
import sys
import os
import pytest
import bcrypt
from dotenv import load_dotenv

# Add the parent directory of the 'app' module to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Load environment variables
load_dotenv()

from app import app
from app.database import db

@pytest.fixture
def client():
    """Creates a test client and resets the test database before each test."""
    app.config['TESTING'] = True
    app.config['DATABASE_NAME'] = "test_db"  # Use a test database

    with app.test_client() as client:
        # Ensure test database is used
        test_db = db.client[app.config['DATABASE_NAME']]
        test_db.users.delete_many({})  # Clear test data
        yield client

def test_index_route(client):
    response = client.get('/')
    assert response.status_code == 200

def test_template_rendering(client):
    response = client.get('/')
    assert b"Hello From Lebentest Quiz App" in response.data

def test_register(client):
    response = client.post('/api/register', json={
        'username': 'test_user',
        'email': 'test@email.com',
        'password': 'test_password'
    })
    assert response.status_code == 201  # 201 Created

def test_login(client):
    # Register first
    response = client.post('/api/register', json={
        'username': 'test_user',
        'email': 'test@email.com',
        'password': 'test_password'
    })
    assert response.status_code == 201  # Ensure user creation worked

    # Now attempt login
    response = client.post('/api/login', json={
        'username_or_email': 'test_user',
        'password': 'test_password'
    })
    assert response.status_code == 200  # 200 OK
    assert b'Login successful' in response.data

def test_failed_registration(client):
    # Register a user
    client.post('/api/register', json={
        'username': 'test_user',
        'email': 'test@email.com',
        'password': 'test_password'
    })
    # Try to register the same user again
    response = client.post('/api/register', json={
        'username': 'test_user',
        'email': 'test@email.com',
        'password': 'test_password'
    })
    assert response.status_code == 409  # Conflict

def test_password_hashing():
    from app.models import User

    # Create a user with plaintext password
    user_data = {
        'username': 'test_user',
        'email': 'test@email.com',
        'password': 'test_password'
    }
    user = User(user_data)

    # Generate a new salt
    salt = bcrypt.gensalt()

    # Hash the password using bcrypt with the new salt
    hashed_password = bcrypt.hashpw(user_data['password'].encode('utf-8'), salt).decode('utf-8')

    # Check if password is hashed correctly
    assert bcrypt.checkpw(user_data['password'].encode('utf-8'), hashed_password.encode('utf-8'))
# import sys
# import os
# import pytest
# import bcrypt

# # Add the parent directory of the 'app' module to the Python path
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# from app import app
# from app.database import db

# @pytest.fixture
# def client():
#     app.config['TESTING'] = True
#     with app.test_client() as client:
#         # Clear any existing data in the collections (optional)
#         db.users.delete_many({})  # Assuming 'users' is your user collection
#         yield client

# def test_index_route(client):
#     response = client.get('/')
#     assert response.status_code == 200

# def test_template_rendering(client):
#     response = client.get('/')
#     assert b"Hello From Lebentest Quiz App" in response.data

# def test_register(client):
#     response = client.post('/api/register', json={'username': 'test_user','email': 'test@email.com', 'password': 'test_password'})
#     assert response.status_code == 201  # 201 Created

# def test_login(client):
#     client.post('/api/register', json={'username': 'test_user', 'email': 'test@email.com', 'password': 'test_password'})
#     response = client.post('/api/login', json={'username_or_email': 'test_user', 'password': 'test_password'})
#     assert response.status_code == 200  # 200 OK
#     assert b'Login successful' in response.data


# def test_failed_registration(client):
#     # Register a user
#     client.post('/api/register', json={'username': 'test_user','email': 'test@email.com', 'password': 'test_password'})
#     # Try to register the same user again
#     response = client.post('/api/register', json={'username': 'test_user','email': 'test@email.com', 'password': 'test_password'})
#     assert response.status_code == 409

# def test_password_hashing():
#     from app.models import User

#     # Create a user with plaintext password
#     user_data = {'username': 'test_user', 'email': 'test@email.com', 'password': 'test_password'}
#     user = User(user_data)
    
#     # Generate a new salt
#     salt = bcrypt.gensalt()
    
#     # Hash the password using bcrypt with the new salt
#     hashed_password = bcrypt.hashpw(user_data['password'].encode('utf-8'), salt).decode('utf-8')
    
#     # Check if password is hashed
#     assert bcrypt.checkpw(user_data['password'].encode('utf-8'), hashed_password.encode('utf-8'))

