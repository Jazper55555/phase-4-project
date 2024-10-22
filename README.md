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

The first is mainly utilized for Create, Update, & Delete Methods.

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


#### `config.py`

#### CORS

CORS (Cross-Origin Resource Sharing) is a system that uses HTTP headers to
determine whether resources from different servers-of-origin can be accessed. If
you're using the fetch API to connect your frontend to your Flask backend, you
need to configure CORS on your Flask application instance. Lucky for us, that
only takes one line:

```py
CORS(app)

```

By default, Flask-CORS enables CORS on all routes in your application with all
fetching servers. You can also specify the resources that allow CORS. The
following specifies that routes beginning with `api/` allow CORS from any
originating server:

```py
CORS(app, resources={r"/api/*": {"origins": "*"}})

```

You can also set this up resource-by-resource by importing and using the
`@cross_origin` decorator:

```py
@app.route("/")
@cross_origin()
def howdy():
  return "Howdy partner!"

```

---

## Updating Your README.md

`README.md` is a Markdown file that describes your project. These files can be
used in many different ways- you may have noticed that we use them to generate
entire Canvas lessons- but they're most commonly used as homepages for online
Git repositories. **When you develop something that you want other people to
use, you need to have a README.**

Markdown is not a language that we cover in Flatiron's Software Engineering
curriculum, but it's not a particularly difficult language to learn (if you've
ever left a comment on Reddit, you might already know the basics). Refer to the
cheat sheet in this lesson's resources for a basic guide to Markdown.

### What Goes into a README?

This README should serve as a template for your own- go through the important
files in your project and describe what they do. Each file that you edit (you
can ignore your migration files) should get at least a paragraph. Each function
should get a small blurb.

You should descibe your application first, and with a good level of detail. The
rest should be ordered by importance to the user. (Probably routes next, then
models.)

Screenshots and links to resources that you used throughout are also useful to
users and collaborators, but a little more syntactically complicated. Only add
these in if you're feeling comfortable with Markdown.

---

## Conclusion

A lot of work goes into a full-stack application, but it all relies on concepts
that you've practiced thoroughly throughout this phase. Hopefully this template
and guide will get you off to a good start with your Phase 4 Project.

Happy coding!

---

## Resources

- [Setting up a respository - Atlassian](https://www.atlassian.com/git/tutorials/setting-up-a-repository)
- [Create a repo- GitHub Docs](https://docs.github.com/en/get-started/quickstart/create-a-repo)
- [Markdown Cheat Sheet](https://www.markdownguide.org/cheat-sheet/)
- [Python Circular Imports - StackAbuse](https://stackabuse.com/python-circular-imports/)
- [Flask-CORS](https://flask-cors.readthedocs.io/en/latest/)
