# app/__init__.py
from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager
from flask_jwt_extended import JWTManager
from app.config import Config
from app.models import User  

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

login_manager = LoginManager()
login_manager.init_app(app) 

jwt = JWTManager(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

from app import routes 





