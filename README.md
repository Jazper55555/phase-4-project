# Percussion Playground - A Full-Stack Application

## Purpose

- Create a full-stack application using React and Flask with a backend server deployed through Render
- Create a communal space for drummers/percussionists to talk shop with the myriad of instruments from around the world

---

## Introduction/Setup

Fork and clone this repo from Github. The Project URL can be found here:
- [Percussion Playground](https://github.com/Jazper55555/phase-4-project) 

Once you fork the repo over, you'll need to download the necessary packages by running the following commands:

```console
npm install --prefix client
pipenv install && pipenv shell
```

This will also get you running a Flask shell which is necessary for executing `python` oriented commands. Because the backend server is running via Render, you only need to run the front end React Application locally by typing the following command:

```console
npm start --prefix client
```

This should start the application on the following port:

```console
Local:            http://localhost:3000
On Your Network:  http://10.251.14.187:3000
```

You should see _Percussion Playground_ displayed in the browser!


## Directory Structure

Following the root directory structure below, there is a brief discussion on the function and purpose of each .js and .py file located in the `client` & `server` folders.

```console
.
├── CONTRIBUTING.md
├── LICENSE.md
├── Pipfile
├── Pipfile.lock
├── README.md
├── client
│   ├── README.md
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   └── src
├── package-lock.json
├── requirements.txt
└── server
    ├── __pycache__
    ├── app.py
    ├── config.py
    ├── inspect_db.py
    ├── instance
    ├── migrations
    ├── models.py
    └── seed.py
```

Note: My `instance` and `migrations` files were for initially configuring my locally run SQLite database. Because the database is now deployed through Render, they are not necessary for running the application.

---

## Client Folder

### `app.py`

Contains all of the RESTful routes connecting the Front-End React Application to the backend server on Render. There are two methods used for routing:

`app.route()` & `class <Name>(Resource)`

The first is mainly utilized for CREATE, UPDATE, & DELETE Methods.

```py
@app.route('/')
def home():
    return '<h1>Project Server</h1>'
```

The second is generally used for READ purposes, however, there are instances of other methods in both routes

```py
class Reviews(Resource):
    def get(self):
        reviews = Review.query.all()
        response = []

        for review in reviews:
            review_data = {
                'id': review.id,
                'content': review.content,
                'rating': review.rating,
                'member_id': review.member_id,
                'instrument_id': review.instrument_id
            }
            response.append(review_data)

        return make_response(jsonify(response), 200) 
```

### `config.py`

#### Flask

There are a number of Flask related packages implemented in the application including `flask_migrate`, `flask_sqlalchemy`, `flask_cors`, & `flask_restful`. Each of these serves a specific purpose in getting the backend Flask application to run smoothly.

```py
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
import os
```

#### App

The primary configuration for proper connection to the database comes from `app.config['SQLALCHEMY_DATABASE_URI']`. This connects the Flask application to the online server through the 'External Database URL'.

#### SQLAlchemy & Migrate

By passing `app` (through `Flask`) & `db` (through `SQLAlchemy`) through `Migrate`, we are able to properly instantiate the newly created database.

```py
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)
```

#### CORS

CORS (Cross-Origin Resource Sharing) is configured to connect my Front-End React Application to the backend server deployed through Render.

```py
CORS(app)

```

### `inspect_db.py`

This file is used primarily to inspect the tables via the terminal to ensure proper migration of data to/from tables. It connects via the previously mentioned `DATABASE_URI`.

### `models.py`

There are 3 tables/models represented:

- Instrument(s)
- Member(s)
- Review(s)

#### Instruments

```py
class Instrument(db.Model, SerializerMixin):
    __tablename__ = 'instruments'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    price = db.Column(db.Integer)
    image = db.Column(db.String)
```
This displays the attributes for each instance of `Instrument`.

#### Members

```py
class Member(db.Model, SerializerMixin):
    __tablename__ = 'members'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    age = db.Column(db.Integer)
    avatar = db.Column(db.String)
 ```

This displays the attributes for each instance of `Member`.

#### Reviews

```py
class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String)
    rating = db.Column(db.Integer)
    member_id = db.Column(db.Integer, db.ForeignKey('members.id'))
    instrument_id = db.Column(db.Integer, db.ForeignKey('instruments.id'))
```

This displays the attributes for each instance of `Review`. As you can see, there are two `ForeignKeys` that constitute the `primary_key` for `Instrument` and `Member`.

### Relationships

The table relationships are represented below:

- Instruments to Reviews = One to Many Relationship
- Members to Reviews = One to Many Relationship
- Instruments to Members = Many to Many Relationship

![Table Relationship Diagram](/Phase-4-Project-Relationships-Diagram.png)

---

## Resources

- [Setting up a respository - Atlassian](https://www.atlassian.com/git/tutorials/setting-up-a-repository)
- [Create a repo- GitHub Docs](https://docs.github.com/en/get-started/quickstart/create-a-repo)
- [Markdown Cheat Sheet](https://www.markdownguide.org/cheat-sheet/)
- [Python Circular Imports - StackAbuse](https://stackabuse.com/python-circular-imports/)
- [Flask-CORS](https://flask-cors.readthedocs.io/en/latest/)
