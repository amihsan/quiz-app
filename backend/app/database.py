# app/database.py
from pymongo import MongoClient
from app.config import Config

client = MongoClient(Config.MONGODB_URI)
db = client[Config.DATABASE_NAME]
