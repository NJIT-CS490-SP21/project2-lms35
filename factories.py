"""
Factories for creating flask and socket io dependencies
"""
import os

from dotenv import load_dotenv
from flask import Flask, json
from flask_cors import CORS
from flask_socketio import SocketIO
from models import db


def create_app():
    """
    Create a flask app with all configs and dependencies satisfied
    :return:
    """
    load_dotenv()

    # app setup with secret key for session
    app = Flask(__name__, static_folder='./build/static')

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'secret!')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # init db
    db.init_app(app)
    with app.app_context():
        db.create_all()

    cors = CORS(app, resources={r"/*": {"origins": "*"}})

    socketio = SocketIO(app,
                        cors_allowed_origins="*",
                        json=json,
                        manage_session=False)

    return app, cors, socketio, db
