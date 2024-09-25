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
                'age': member.age,
                'avatar': member.avatar
            }
            response.append(member_data)

        return make_response(jsonify(response), 200)

    def post(self):
        name_request = request.get_json().get('name')
        if not name_request:
            return make_response(jsonify({'errors': ['Name must include first and last name']}), 400)
        age_request = request.get_json().get('age')
        if not isinstance(age_request, int):
            return make_response(jsonify({'errors': ['Must be 18 or older to sign up']}), 400)
        first_name, last_name = name_request.split(' ')[:2]
        email_request = f'{first_name.lower()}.{last_name.lower()}@percplay.com'
        try:
            new_member = Member(
                name = name_request,
                age = age_request,
                email = email_request,
                avatar = f"https://ui-avatars.com/api/?name={name_request.replace(' ', '+')}&rounded=true"
            )
            db.session.add(new_member)
            db.session.commit()

            response = {
                'id': new_member.id,
                'name': new_member.name,
                'age': new_member.age,
                'email': new_member.email
            }

            return make_response(jsonify(response), 200)

        except:
            db.session.rollback()
            return make_response(jsonify({'errors': ['User already exists']}), 400)


class Instruments(Resource):
    def get(self):
        instruments = Instrument.query.all()
        response = []

        for instrument in instruments:
            instrument_data = {
                'id': instrument.id,
                'name': instrument.name,
                'price': instrument.price,
                'image': instrument.image
            }
            response.append(instrument_data)

        return make_response(jsonify(response), 200)


api.add_resource(Members, '/members')
api.add_resource(Instruments, '/instruments')

if __name__ == '__main__':
    app.run(port=5555, debug=True)