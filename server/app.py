#!/usr/bin/env python3

from flask import Flask, request, make_response, jsonify, session
from flask_restful import Resource

from config import app, db, api

from models import db, Member, Instrument, Review

@app.route('/')
def home():
    return '<h1>Project Server</h1>'


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    name = data.get('name')

    user = Member.query.filter_by(email=email, name=name).first()

    if user:
        session['user_id'] = user.id
        session.permanent = True
        return jsonify({"success": True, 'user_id': user.id})
    else:
        return jsonify({"success": False, "errors": ["Invalid credentials"]})


@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'success': True, 'message': 'Logged out successfully'})


@app.route('/reviews', methods=['POST'])
def add_review():
    if 'user_id' not in session:
        return jsonify({"success": False, "errors": ["User not logged in"]}), 401

    user_id = session['user_id']
    data = request.json
    content = data.get('content')
    rating = data.get('rating')
    instrument_id = data.get('instrument_id')

    if not all([content, rating, instrument_id]):
        return jsonify({"success": False, "errors": ["Missing data"]}), 400

    try:
          new_review = Review(content=content, rating=rating, member_id=session['user_id'], instrument_id=instrument_id)
          db.session.add(new_review)
          db.session.commit()
          return jsonify({"success": True, "message": "Review added successfully"})
    except Exception as e:
          print("Error occurred:", e)  
          db.session.rollback()
          return jsonify({"success": False, "errors": ["An error occurred while adding the review"]}), 500


@app.route('/instruments', methods=['POST'])
def add_instrument():
    if 'user_id' not in session:
        return jsonify({"success": False, "errors": ["User not logged in"]}), 401

    user_id = session['user_id']
    data = request.json
    name = data.get('name')
    price = data.get('price')
    image = data.get('image')
    content = data.get('content')
    rating = data.get('rating')

    if not all([name, price, image, content, rating]):
        return jsonify({"success": False, "errors": ["Missing data"]}), 400

    try:
        new_instrument = Instrument(name=name, price=price, image=image)
        db.session.add(new_instrument)
        db.session.commit()

        new_review = Review(content=content, rating=rating, member_id=user_id, instrument_id=new_instrument.id)
        db.session.add(new_review)
        db.session.commit()

        return jsonify({"success": True, "message": "Instrument and review added successfully", "instrument": new_instrument.serialize(), "review": new_review.serialize()})
    except Exception as e:
          print("Error occurred:", e) 
          db.session.rollback()
          return jsonify({"success": False, "errors": ["Successfully added"]}), 500


@app.route('/reviews/<int:id>', methods=['GET'])
def get_review(id):
    review = Review.query.get(id)
    if review:
        return jsonify({"success": True, "review": {
            "content": review.content,
            "rating": review.rating
        }})
    else:
        return jsonify({"success": False, "errors": ["Review not found"]}), 404

@app.route('/reviews/<int:id>', methods=['DELETE'])
def delete_review(id):
    review = Review.query.get(id)
    if review:
        db.session.delete(review)
        db.session.commit()
        return make_response('', 204)
    else:
        return make_response(jsonify({'error': 'Review not found'}), 404)



@app.route('/reviews/<int:id>', methods=['PUT'])
def update_review(id):
    if 'user_id' not in session:
        return jsonify({'success': False, 'errors': ['User not logged in']}), 401

    user_id = session['user_id']    
    data = request.json
    review = Review.query.get(id)

    if review is None:
        return jsonify({'success': False, 'errors': ['Review not found']}), 404

    if review.member_id != user_id:
        return jsonify({"success": False, "errors": ["You can only edit your own reviews"]}), 403

    review.content = data.get('content', review.content)
    review.rating = data.get('rating', review.rating)
    db.session.commit()

    return jsonify({"success": True, "message": "Review updated successfully"})


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
            'member_id': review.member_id,
            'instrument': {
                'id': review.instrument.id,
                'name': review.instrument.name,
                'price': review.instrument.price,
                'image': review.instrument.image}
        }
        for review in selected_member.reviews]

        response = {
            'member': {
                'id': selected_member.id,
                'age': selected_member.age,
                'avatar': selected_member.avatar,
                'name': selected_member.name,
            },
            'reviews': review_data
            }

        return make_response(jsonify(response), 200)
        

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

api.add_resource(Members, '/members')
api.add_resource(Instruments, '/instruments')
api.add_resource(InstrumentsById, '/instruments/<int:id>')
api.add_resource(MembersById, '/members/<int:id>')
api.add_resource(Reviews, '/reviews')


if __name__ == '__main__':
    app.run(port=5555, debug=True)