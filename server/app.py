#!/usr/bin/env python3

from flask import Flask, request, make_response, jsonify
from flask_restful import Resource

from config import app, db, api

from models import db, Member, Instrument, Review

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


class InstrumentsById(Resource):
    def get(self, id):
        selected_instrument = Instrument.query.filter(Instrument.id == id).first()

        review_data = [{
            'id': review.id,
            'content': review.content,
            'rating': review.rating,
            'member': {
                'name': review.member.name,
                'avatar': review.member.avatar
            }
        } 
        for review in selected_instrument.reviews]

        response = {
            'instrument': {
                'id': selected_instrument.id,
                'name': selected_instrument.name,
                'price': selected_instrument.price,
                'image': selected_instrument.image
            },
            'reviews': review_data
        }

        return make_response(jsonify(response), 200)


class MembersById(Resource):
    def get(self, id):
        selected_member = Member.query.filter(Member.id == id).first()

        review_data = [{
            'id': review.id,
            'content': review.content,
            'rating': review.rating,
            'instrument': {
                'name': review.instrument.name,
                'price': review.instrument.price,
                'image': review.instrument.image}
        }
        for review in selected_member.reviews]

        response = {
            'member': {
                'age': selected_member.age,
                'avatar': selected_member.avatar,
                'name': selected_member.name,
            },
            'reviews': review_data
            }

        return make_response(jsonify(response), 200)

api.add_resource(Members, '/members')
api.add_resource(Instruments, '/instruments')
api.add_resource(InstrumentsById, '/instruments/<int:id>')
api.add_resource(MembersById, '/members/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)