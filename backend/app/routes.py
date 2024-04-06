import json
from re import S
from flask import jsonify, request, render_template, send_file, send_from_directory, url_for
from flask_bcrypt import Bcrypt
from flask_jwt_extended import get_jwt_identity, jwt_required, create_access_token
from bson import ObjectId
from app.models import User
from app.database import db
from bson.json_util import dumps
from datetime import datetime, timedelta
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app import app
import os
from werkzeug.utils import secure_filename

#*************************#
# Set the allowed file extensions for image uploads
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
# Define the directory where uploaded question images will be stored
absolute_path = os.path.dirname(__file__)
relative_path = "quiz_img"
question_image_dir = os.path.join(absolute_path, relative_path)
# print( question_image_dir)

# Function to check if a filename has an allowed extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Map category names to collection names
category_to_collection = {
    "Category1": "Verfassungsorgane",
    "Category2": "Verfassungsprinzipien",
    "Category3": "Föderalismus",
    "Category4": "Sozialsystem",
    "Category5": "Grundrechte",
    "Category6": "Wahlen und Beteiligung",
    "Category7": "Parteien",
    "Category8": "Aufgaben des Staates",
    "Category9": "Pflichten",
    "Category10": "Staatssymbole",
    "Category11": "Kommune",
    "Category12": "Recht und Alltag",
    "Category13": "Der Nationalsozialismus und seine Folgen",
    "Category14": "Wichtige Stationen nach 1945",
    "Category15": "Wiedervereinigung",
    "Category16": "Deutschland in Europa",
    "Category17": "Religiöse Vielfalt",
    "Category18": "Bildung",
    "Category19": "Migrationsgeschichte",
    "Category20": "Interkulturelles Zusammenleben",
    
    # Add more mappings for other categories as needed
}
#*************************#


# Initialize Bcrypt and URLSafeTimedSerializer
bcrypt = Bcrypt()
serializer = URLSafeTimedSerializer(os.getenv('SECRET_KEY'))

# Default Route: Hello From Lebentest
@app.route('/')
def index(): 
    try:
        return '<b><big>Hello From Lebentest Quiz App</big></b>'
    except Exception as e:
        error_message = f'An error occurred: {str(e)}'
        return error_message
    
# Default Route: Test Server
@app.route("/api")
def index_again():
    return render_template('index.html')

# Function to request password reset link in email
@app.route('/api/reset-password', methods=['POST'])
def reset_password_link_email():
    email = request.json.get('email')

    # Check if user exists in the database
    user = db.users.find_one({"email": email})

    if user:
        # Generate a unique token for password reset
        token = serializer.dumps(email, salt=os.getenv('SECRET_KEY'))

        # Send the password reset link to the user's email
        send_reset_email(email, token)

        return jsonify({"message": "Password reset instructions sent to your email"}), 200
    else:
        return jsonify({"error": "User not found"}), 404


# Function to send reset password email
def send_reset_email(email, token):
    # Compose the email
    sender_email = os.getenv('SENDER_EMAIL')  # Replace with your email
    receiver_email = email
    password = os.getenv('SENDER_PASSWORD')  # Replace with your email password
    smtp_server= os.getenv('SMTP_SERVER')
    smtp_port= os.getenv('SMTP_PORT')

    sender_name = "Lebentest"
    sender_address = os.getenv('CUSTOM_DOMAIN_EMAIL')

    message = MIMEMultipart()
    # Set the sender with name and email address
    message["From"] = f"{sender_name} <{sender_address}>"
    message["To"] = email
    message["Subject"] = "Password Reset"

    # Construct the reset link
    password_link_domain = os.getenv('RESET_PASSWORD_URL')
    reset_link = f"{password_link_domain}/reset-password/{token}"
    body = f"Click the following link to reset your password: {reset_link}"
    message.attach(MIMEText(body, "plain"))

    # Send the email
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message.as_string())


# Function to reset password with the token from email
@app.route('/api/reset-password/<token>', methods=['GET', 'POST'])
def reset_password_email(token):
    if request.method == 'POST':
        new_password = request.json.get('new_password')

        try:
            # Verify the token and get the associated email
            email = serializer.loads(token, salt=os.getenv('SECRET_KEY'), max_age=3600)  # 1 hour expiration
        except BadSignature:
            return jsonify({"error": "Invalid token"}), 400
        except SignatureExpired:
            return jsonify({"error": "Token expired"}), 400

        # Update the user's password in the database
        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        db.users.update_one({"email": email}, {"$set": {"password": hashed_password}})
         
        return jsonify({"message": "Password reset successful"}), 200
    elif request.method == 'GET':
       # Render the HTML template containing the PasswordReset component
        return render_template("password_reset_template.html", token=token)

    else:
        # Handle other HTTP methods
        return jsonify({"error": "Method Not Allowed"}), 405

# Function to change user password from profile
@app.route('/api/reset-password', methods=['PUT'])
@jwt_required()  # Ensure that the endpoint is protected and accessible only to authenticated users
def reset_password_profile():
    try:
        current_user_id = get_jwt_identity()
        user_data = db.users.find_one({"_id": ObjectId(current_user_id)})

        if not user_data:
            return jsonify({"error": "User not found"}), 404

        data = request.json
        current_password = data.get('current_password')
        new_password = data.get('new_password')

        if not current_password or not new_password:
            return jsonify({"error": "Current password and new password are required"}), 400

        # Verify the current password
        if not bcrypt.check_password_hash(user_data['password'], current_password):
            return jsonify({"error": "Incorrect current password"}), 401

        # Hash the new password
        hashed_new_password = bcrypt.generate_password_hash(new_password).decode('utf-8')

        # Update the user's password in the database
        db.users.update_one({"_id": ObjectId(current_user_id)}, {"$set": {"password": hashed_new_password}})

        return jsonify({"message": "Password changed successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Function to register a new user
@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    # print(data)

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    user_data = {
        'username': username,
        'email': email,
        'password': hashed_password
    }

    user_id = db.users.insert_one(user_data).inserted_id
    # print(user_id)

    return jsonify({"message": "Registration successful", "user_id": str(user_id)}), 201

# Function to log in a user
@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json()

    username_or_email = data.get('username_or_email')
    password = data.get('password')

    if '@' in username_or_email:
        user_data = db.users.find_one({"email": username_or_email})
    else:
        user_data = db.users.find_one({"username": username_or_email})

    if user_data:
        if user_data and bcrypt.check_password_hash(user_data['password'], password):
            user = User(user_data)
            access_token = create_access_token(identity=str(user.id))
            
            return jsonify({"message": "Login successful", "token": access_token}), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
        
    else:
        return jsonify({"error": "User not found. Please register."}), 404

# Define the route handler for fetching user profile
@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    try:
        # Extract user ID from JWT token
        current_user_id = get_jwt_identity()

        # Fetch user data from the database
        user_data = db.users.find_one({"_id": ObjectId(current_user_id)})

        if user_data:
            # Construct profile data response
            profile_data = {
                "username": user_data.get('username', ''),
                "firstName": user_data.get('firstName', ''),
                "lastName": user_data.get('lastName', ''),   
                "email": user_data.get('email', ''),
                "address": user_data.get('address', {}),
                "phoneNumber": user_data.get('phoneNumber', ''),
            }

            # Include avatar URL if available
            if 'avatar_url' in user_data:
                avatar_url = url_for('get_avatar', filename=os.path.basename(user_data['avatar_url']), _external=True)
                profile_data['avatar_url'] = avatar_url

            return jsonify(profile_data), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Function to update user profile
@app.route('/api/profile', methods=['PUT'])
@jwt_required()
def update_user_profile():
    try:
        # Extract user ID from JWT token
        current_user_id = get_jwt_identity()

        # Fetch user data from the database
        user_data = db.users.find_one({"_id": ObjectId(current_user_id)})

        if not user_data:
            return jsonify({"error": "User not found"}), 404

        # Parse request JSON data
        data = request.get_json()
        # print(data)

        # Update user data
        for key in ['username', 'email', 'phoneNumber', 'firstName', 'lastName']:
            if key in data:
                user_data[key] = data[key]

        # Update address if provided
        if 'address' in data:
            user_data['address'] = data['address']
            print(data)

        # Update user data in the database
        db.users.update_one({"_id": ObjectId(current_user_id)}, {"$set": user_data})

        return jsonify({"message": "Profile updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Define the route handler for retrieving avatars
@app.route('/api/avatars/<filename>', methods=['GET'])
def get_avatar(filename):
    try:
        upload_folder = os.path.join(app.root_path, "avatars")
        avatar_path = os.path.join(upload_folder, filename)

        # Check if the file exists
        if os.path.exists(avatar_path):
            return send_file(avatar_path)
        else:
            return jsonify({"error": "Avatar not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Define the route handler for /upload-avatar
@app.route('/api/upload-avatar', methods=['POST'])
@jwt_required()
def upload_avatar():
    try:
        # Extract user ID from JWT token
        current_user_id = get_jwt_identity()

        # Ensure the avatar file is provided in the request
        if 'avatar' not in request.files:
            return jsonify({"error": "No avatar provided"}), 400

        avatar_file = request.files['avatar']

        # Customize the file upload directory and filename
        upload_folder = os.path.join(app.root_path, "avatars")
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)  # Create the folder if it doesn't exist

        avatar_filename = f"user_{current_user_id}.png"
        avatar_path = os.path.join(upload_folder, avatar_filename)

        # Save the avatar file to the specified path
        avatar_file.save(avatar_path)

        # Update the user's avatar URL in the database
        db.users.update_one({"_id": ObjectId(current_user_id)}, {"$set": {"avatar_url": avatar_path}})

        # Construct full URL for the avatar
        avatar_url = url_for('get_avatar', filename=avatar_filename, _external=True)

        return jsonify({"message": "Avatar uploaded successfully", "avatar_url": avatar_url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Function to submit quiz answers with feedback
@app.route('/api/quiz/submit', methods=['POST'])
@jwt_required()
def submit_quiz_answers():
    current_user_id = get_jwt_identity()
    user_data = db.users.find_one({"_id": ObjectId(current_user_id)})

    if not user_data:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    answers = data.get('answers', [])

    if not answers:
        return jsonify({"error": "No quiz answers provided"}), 400

    # Assuming you have a MongoDB collection named 'quiz_questions'
    quiz_questions_collection = db.quiz_questions

    # Assuming you have a MongoDB collection named 'quiz_responses'
    quiz_responses_collection = db.quiz_responses

    # Prepare the quiz response with feedback
    feedback_responses = []
    for answer in answers:
        question = quiz_questions_collection.find_one({"text": answer['question']})

        if not question:
            feedback_responses.append({"question": answer['question'], "feedback": "Question not found"})
        elif question['correctAnswer'] == answer['selectedOption']:
            feedback_responses.append({"question": answer['question'], "feedback": "Correct!"})
        else:
            feedback_responses.append({"question": answer['question'], "feedback": "Wrong!"})

    # Store the quiz response in the 'quiz_responses' collection
    quiz_response = {
        'user_id': current_user_id,
        'timestamp': datetime.utcnow(),
        'responses': feedback_responses
    }
    response_id = quiz_responses_collection.insert_one(quiz_response).inserted_id

    return jsonify({"response_id": str(response_id), "feedback": feedback_responses}), 200

# Function to get quiz answers
@app.route('/api/quiz/responses', methods=['GET'])
@jwt_required()
def get_quiz_responses():
    current_user_id = get_jwt_identity()
    
    # Retrieve all quiz responses for the user from the 'quiz_responses' collection
    responses = list(db.quiz_responses.find({'user_id': current_user_id}))

    # Convert ObjectId to string in each response
    for response in responses:
        response['_id'] = str(response['_id'])

    return jsonify({"responses": dumps(responses)}), 200    

# Function to serve question image with url    
@app.route('/api/quiz/images/<path:filename>')
def get_question_img(filename):
    # Serve the image file from the specified directory
    return send_from_directory(question_image_dir, filename)

# Function to get quiz questions from mongodb collections based on category
@app.route('/api/quiz/questions/category/<category_name>', methods=['GET'])
@jwt_required()
def get_quiz_questions_by_category(category_name):
   
    try:
        
        # Get the collection name corresponding to the provided category
        collection_name = category_to_collection.get(category_name)
        
        # Check if the provided category has a corresponding collection
        if collection_name:
            # Assuming your quiz questions are stored in the specified collection
            questions = list(db[collection_name].find())

            # Convert ObjectId to string in each question
            for question in questions:
                question['_id'] = str(question['_id'])

                # Check if the image file exists for the question
                image_path = os.path.join(question_image_dir,  f"{category_name}_{question['question_no']}.png")

                if os.path.exists(image_path):
                    # If the image file exists, include the URL for serving the image
                    picture_link = url_for('get_question_img', filename=f"{category_name}_{question['question_no']}.png", _external=True)
                    question['picture_link'] = picture_link
                else:
                    # If the image file doesn't exist, set picture_link to an empty string
                    question['picture_link'] = ""


            # Use dumps from bson.json_util to handle serialization of ObjectId to JSON
            return dumps({"questions": questions}), 200
        else:
            return jsonify({"error": f"No collection found for category '{category_name}'"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Function to map mongodb collections based on category
@app.route('/api/categories', methods=['GET'])
def get_categories():
    category_mapping = [
        {"name": "Category1", "label": "Verfassungsorgane"},
        {"name": "Category2", "label": "Verfassungsprinzipien"},
        {"name": "Category3", "label": "Föderalismus"},
        {"name": "Category4", "label": "Sozialsystem"},
        {"name": "Category5", "label": "Grundrechte"},
        {"name": "Category6", "label": "Wahlen und Beteiligung"},
        {"name": "Category7", "label": "Parteien"},
        {"name": "Category8", "label": "Aufgaben des Staates"},
        {"name": "Category9", "label": "Pflichten"},
        {"name": "Category10", "label": "Staatssymbole"},
        {"name": "Category11", "label": "Kommune"},
        {"name": "Category12", "label": "Recht und Alltag"},
        {"name": "Category13", "label": "Der Nationalsozialismus und seine Folgen"},
        {"name": "Category14", "label": "Wichtige Stationen nach 1945"},
        {"name": "Category15", "label": "Wiedervereinigung"},
        {"name": "Category16", "label": "Deutschland in Europa"},
        {"name": "Category17", "label": "Religiöse Vielfalt"},
        {"name": "Category18", "label": "Bildung"},
        {"name": "Category19", "label": "Migrationsgeschichte"},
        {"name": "Category20", "label": "Interkulturelles Zusammenleben"}
    ]
    return jsonify({"categories": category_mapping})

# Function to add quiz questions and store to mongodb collections based on category
@app.route('/api/quiz/questions/add', methods=['POST'])
@jwt_required()
def add_quiz_question():
    try:
        # Extract JSON data from the form fields
        question_data = request.form.get('questionData')
        question_data = json.loads(question_data)

        # Extract category and question details from the request data
        category_name = question_data.get('category')
        question_text = question_data.get('text')
        options = question_data.get('options', [])  # Access options field as an array
        correct_answer = question_data.get('correctAnswer')

        # Check if the request contains a file
        if 'image' in request.files:
            file = request.files['image']

            # Check if the file has an allowed extension
            if file and allowed_file(file.filename):
                # Get the collection name corresponding to the provided category
                collection_name = category_to_collection.get(category_name)

                # Check if the provided category has a corresponding collection
                if collection_name:

                    # Count the number of questions in the collection
                    question_count = db[collection_name].count_documents({})

                    # Increment the count to generate the question number
                    question_no = str(question_count + 1)

                    # Construct the new filename dynamically using category and question number
                    filename = f"{category_name}_{question_no}.png"  # Remove spaces from category name

                    # Save the file to the upload folder with the new filename
                    file.save(os.path.join(question_image_dir, secure_filename(filename)))

                    # Insert the new question into the specified collection
                    db[collection_name].insert_one({
                        "text": question_text,
                        "options": options,
                        "correctAnswer": correct_answer,
                        "question_no": question_no
                        # Add more fields as needed
                    })

                    return jsonify({"message": "Question added successfully"}), 200
                else:
                    return jsonify({"error": f"No collection found for category '{category_name}'"}), 404
            else:
                return jsonify({"error": "Invalid file type"}), 400
        else:
            # If no image is provided, proceed to add the question without processing the image
            
            # Get the collection name corresponding to the provided category
            collection_name = category_to_collection.get(category_name)

            # Check if the provided category has a corresponding collection
            if collection_name:

                # Count the number of questions in the collection
                question_count = db[collection_name].count_documents({})

                # Increment the count to generate the question number
                question_no = str(question_count + 1)

                # Insert the new question into the specified collection
                db[collection_name].insert_one({
                    "text": question_text,
                    "options": options,
                    "correctAnswer": correct_answer,
                    "question_no": question_no
                    # Add more fields as needed
                })

                return jsonify({"message": "Question added successfully"}), 200
            else:
                return jsonify({"error": f"No collection found for category '{category_name}'"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Function to get quiz question by ID
@app.route('/api/quiz/questions/<string:category_name>/<string:question_id>', methods=['GET'])
@jwt_required()
def get_question_by_id(category_name, question_id):
    try:

        # Get the collection name corresponding to the provided category
        collection_name = category_to_collection.get(category_name)
        
            
        # Query the database to find the question by its ID in the specified collection
        question = db[collection_name].find_one({'_id': ObjectId(question_id)})
            
        # Check if the question exists
        if question:
            # Convert ObjectId to string
            question['_id'] = str(question['_id'])
            
            # Optionally, check if the image file exists for the question and include the URL

            # Include the collection name in the response data
            question['category'] = collection_name

            

            # Check if the image file exists for the question
            image_path = os.path.join(question_image_dir,  f"{category_name}_{question['question_no']}.png")

            if os.path.exists(image_path):
                # If the image file exists, include the URL for serving the image
                picture_link = url_for('get_question_img', filename=f"{category_name}_{question['question_no']}.png", _external=True)
                question['picture_link'] = picture_link
            else:
                # If the image file doesn't exist, set picture_link to an empty string
                question['picture_link'] = ""

            print(question)
            
            # Return the question as JSON response
            return jsonify(question), 200
        else:
            # If the question with the specified ID is not found, return a 404 error
            print("Question not found")
            return jsonify({"error": "Question not found"}), 404
        

      
    except Exception as e:
        # If an exception occurs during the execution of the route handler, return a 500 error
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


# Function to update quiz question 
@app.route('/api/quiz/questions/update', methods=['POST'])
@jwt_required()
def update_quiz_question():
    try:
        
        # Extract JSON data from the form fields
        question_data = request.form.get('questionData')
        question_data = json.loads(question_data)

        # print(question_data)


        # Extract category, question ID, and updated question details from the request data
        category_name = question_data.get('category')
        # print(category_name)
        
        question_id = question_data.get('_id')
        updated_question_text = question_data.get('text')
        updated_options = question_data.get('options', [])
        updated_correct_answer = question_data.get('correctAnswer')
        updated_question_no = question_data.get('question_no')

        # Check if the request contains a file
        if 'image' in request.files:
            file = request.files['image']

            # Check if the file has an allowed extension
            if file and allowed_file(file.filename):
                # Get the collection name corresponding to the provided category
                collection_name = category_to_collection.get(category_name)

                # Check if the provided category has a corresponding collection
                if collection_name:
                    # Construct the new filename dynamically using category and question ID
                    filename = f"{category_name}_{updated_question_no}.png"  # Remove spaces from category name

                    # Save the file to the upload folder with the new filename
                    file.save(os.path.join(question_image_dir, secure_filename(filename)))

                    # Update the existing question in the specified collection
                    db[collection_name].update_one({'_id': ObjectId(question_id)}, {'$set': {
                        "text": updated_question_text,
                        "options": updated_options,
                        "correctAnswer": updated_correct_answer,
                        "question_no":updated_question_no
                        # Add more fields as needed
                    }})

                    return jsonify({"message": "Question updated successfully"}), 200
                else:
                    return jsonify({"error": f"No collection found for category '{category_name}'"}), 404
            else:
                return jsonify({"error": "Invalid file type"}), 400
        else:
            # If no image is provided, update the question without processing the image

            # Get the collection name corresponding to the provided category
            collection_name = category_to_collection.get(category_name)

            # Check if the provided category has a corresponding collection
            if collection_name:
                # Update the existing question in the specified collection
                db[collection_name].update_one({'_id': ObjectId(question_id)}, {'$set': {
                    "text": updated_question_text,
                    "options": updated_options,
                    "correctAnswer": updated_correct_answer,
                    "question_no":updated_question_no
                    # Add more fields as needed
                }})

                return jsonify({"message": "Question updated successfully"}), 200
            else:
                return jsonify({"error": f"No collection found for category '{category_name}'"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Function to delete quiz question
@app.route('/api/quiz/questions/delete', methods=['POST'])
@jwt_required()
def delete_quiz_question():
    try:
        # Extract JSON data from the form fields
        question_data = request.json

        # Extract category and question ID from the request data
        category_name = question_data.get('category')
        question_id = question_data.get('question_id')

        if category_name in category_to_collection:
            collection_name = category_to_collection[category_name]

            # Find the question in the specified collection
            question = db[collection_name].find_one({'_id': ObjectId(question_id)})

            if question:
                # Delete the question from the specified collection
                result = db[collection_name].delete_one({'_id': ObjectId(question_id)})
                if result.deleted_count > 0:
                    # If there's an associated image, delete it from the backend folder
                    image_filename = f"{category_name}_{question['question_no']}.png"
                    image_path = os.path.join(question_image_dir, image_filename)
                    if os.path.exists(image_path):
                        os.remove(image_path)
                    return jsonify({"message": "Question deleted successfully"}), 200
                else:
                    return jsonify({"error": "Question not found"}), 404
            else:
                return jsonify({"error": "Question not found"}), 404
        else:
            return jsonify({"error": "Invalid category"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Function to log in as a admin
@app.route('/api/admin', methods=['POST'])
@jwt_required()
def login_admin_user():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')

    admin_username = os.getenv('ADMIN_USERNAME')
    admin_password = os.getenv('ADMIN_PASSWORD')

    if( username==admin_username and password==admin_password):
        return jsonify({"message": "Login successful"}), 200
    else:
            return jsonify({"error": "Invalid credentials. Please try again."}), 401
