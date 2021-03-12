def create_app():
    from dotenv import load_dotenv
    load_dotenv()

    # app setup with secret key for session
    from flask import Flask
    app = Flask(__name__, static_folder='./build/static')

    import os
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'secret!')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # init db
    from models import db
    db.init_app(app)
    with app.app_context():
        db.create_all()

    from flask_cors import CORS
    cors = CORS(app, resources={r"/*": {"origins": "*"}})

    from flask_socketio import SocketIO
    from flask import json
    socketio = SocketIO(app,
                        cors_allowed_origins="*",
                        json=json,
                        manage_session=False)

    return app, cors, socketio, db
