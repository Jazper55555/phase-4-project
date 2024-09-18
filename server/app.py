#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, request, make_response, jsonify
from flask_restful import Resource

# Local imports
from config import app, db, api

# Add your model imports
from models import db, Member, Instrument, Review

# Views go here!
@app.route('/')
def home():
    return '<h1>Project Server</h1>'


class Members(Resource):
    def get(self):
        members = Member.query.all()
        response = []

        for member in members:
            member_data = {
                'id': member.id,
                'name': member.name,
                'email': member.email,
                'age': member.age
            }
            response.append(member_data)

        return make_response(jsonify(response), 200)


class Instruments(Resource):
    def get(self):
        instruments = Instrument.query.all()
        response = []

        for instrument in instruments:
            instrument_data = {
                'id': instrument.id,
                'name': instrument.name,
                'price': instrument.price
            }
            response.append(instrument_data)

        return make_response(jsonify(response), 200)


api.add_resource(Members, '/members')
api.add_resource(Instruments, '/instruments')

if __name__ == '__main__':
    app.run(port=5555, debug=True)