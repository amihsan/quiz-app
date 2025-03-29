# app/models.py
from flask_login import UserMixin
from bson import ObjectId

class User(UserMixin):
    def __init__(self, user_data):
        self.id = str(user_data.get('_id', ''))  # Provide a default value if '_id' is missing
        self.username = user_data.get('username', '')
        self.email = user_data.get('email', '')
        self.password = user_data.get('password', '')
        self.role = user_data.get('role', 'user')  # Default to 'user' if role is missing
