from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates

from config import db

class Member(db.Model, SerializerMixin):
    __tablename__ = 'members'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    age = db.Column(db.Integer)
    avatar = db.Column(db.String)

    # Relationships
    reviews = db.relationship('Review', back_populates='member', cascade='all, delete-orphan')
    instruments = association_proxy('reviews', 'instrument', creator=lambda instrument_obj: Review(member=instrument_obj))

    serialize_rules = ('-reviews.member',)

    # Validations
    @validates('name')
    def validate_name(self, key, name):
        if not (1 <= len(name) <= 50):
            raise ValueError('Must contain a name')
        return name

    @validates('age')
    def validate_age(self, key, age):
        if not isinstance(age, int):
            raise ValueError('Must be an integer of 18+')
        if not age >= 18:
            raise ValueError('Must be 18 years or older to signup')
        return age

    def __repr__(self):
        return f'<Member {self.id}: {self.name}>'


class Instrument(db.Model, SerializerMixin):
    __tablename__ = 'instruments'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    price = db.Column(db.Integer)
    image = db.Column(db.String)

    # Relationships
    reviews = db.relationship('Review', back_populates='instrument', cascade='all, delete-orphan')
    members = association_proxy('reviews', 'member', creator=lambda member_obj: Review(member=member_obj))

    serialize_rules = ('-reviews.instrument',)

    # Validations
    @validates('name')
    def validate_name(self, key, name):
        if not (1 <= len(name) <= 50):
            raise ValueError('Must contain a name')
        return name

    @validates('price')
    def validate_price(self, key, price):
        if not isinstance(price, int):
            raise ValueError('Price must be an integer greater than $0')
        if not price > 0:
            raise ValueError('Price must be an integer greater than $0')
        return price

    def __repr__(self):
        return f'<Instrument {self.id}: {self.name}>'


class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String)
    rating = db.Column(db.Integer)
    member_id = db.Column(db.Integer, db.ForeignKey('members.id'))
    instrument_id = db.Column(db.Integer, db.ForeignKey('instruments.id'))

    # Relationships
    member = db.relationship('Member', back_populates='reviews')
    instrument = db.relationship('Instrument', back_populates='reviews')

    serialize_rules = ('-member.reviews', '-instrument.reviews')

    # Validations
    @validates('content')
    def validate_content(self, key, content):
        if not content:
            raise ValueError('Review cannot be empty')
        return content

    @validates('rating')
    def validate_rating(self, key, rating):
        if not (1 <= rating <= 5):
            raise ValueError('Rating must be between 1 & 5 stars')
        return rating

    def __repr__(self):
        return f'<Review {self.id}>'
