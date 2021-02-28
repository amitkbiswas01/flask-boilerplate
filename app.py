import os
from pathlib import Path
from dotenv import load_dotenv

from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

from database.db import initialize_db
from resources.routes import initialize_routes
from resources.errors import errors

# base dir and env file
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=Path.joinpath(BASE_DIR, ".env"))

# app initialization
app = Flask(__name__)
CORS(app)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
api = Api(app, errors=errors)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# configure mongodb
app.config["MONGODB_SETTINGS"] = {
    "db": "flask_boilerplatedb",
    "host": "localhost",
    "port": 27017,
}

initialize_db(app)
initialize_routes(api)

if __name__ == "__main__":
    app.run()
