# app/config.py
import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

class Config:
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY') 
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=30) # increase duration here
    MONGODB_URI = os.getenv('MONGODB_URI')
    DATABASE_NAME = os.getenv('DATABASE_NAME')
    SECRET_KEY = os.getenv('SECRET_KEY')
