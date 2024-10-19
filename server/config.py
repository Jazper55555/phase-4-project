# Standard library imports

# Remote library imports
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
import os

# Local imports

# Instantiate app, set attributes
app = Flask(__name__)
app.secret_key = os.urandom(24)
app.config['SESSION_COOKIE_SECURE'] = True  # Only send cookies over HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True  # Prevent JavaScript access to cookies
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://phase_4_project_db_b102_user:6xVvd5aMGXYDfMh7Bz9iS2SsHAqDKCXy@dpg-cs87pgm8ii6s73c5j3gg-a.oregon-postgres.render.com/phase_4_project_db_b102'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app)
