# app/config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'test_secret')  # Default for testing
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'test_jwt_secret')
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
    DATABASE_NAME = os.getenv('DATABASE_NAME', 'test_db')  # Use a test DB