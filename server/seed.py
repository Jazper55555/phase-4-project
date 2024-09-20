#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
import requests


# Remote library imports
from faker import Faker

fake = Faker()

# Local imports
from app import app
from models import db, Member, Instrument, Review


def create_members():
    members = []
    for _ in range(50):
        name = fake.name()
        first_name, last_name = name.split(' ')[:2]
        email = f'{first_name.lower()}.{last_name.lower()}@percplay.com'
        random_avatar = f"https://ui-avatars.com/api/?name={name.replace(' ', '+')}&rounded=true"

        m = Member(
            name=name,
            email=email,
            age=randint(18, 100),
            avatar=random_avatar
        )
        members.append(m)

    return members

def create_instruments():
    instruments = []
    instrument_names = [
        'Marimba', 'Xylo', 'Vibraphone', 'Bells', 'Snare Drum',
        'Bass Drum', 'Flexatone', 'China Cymbal', 'Splash', 'Guiro',
        'Bongos', 'Conga', 'Doumbek', 'Triangle', 'Congas', 'Boomwacker',
        'Bird Whistle', 'Rainstick', 'Ocean Drum', 'Zil-Bell', 'Timpani',
        'Sleigh Bells', 'Chimes', 'Thundersheet', 'Tom-Tom'
    ]

    for name in instrument_names:
        number_for_price = randint(1, 5000)
        price = f'${number_for_price}'

        instrument = Instrument(name=name, price=price)
        instruments.append(instrument)

    return instruments

if __name__ == '__main__':
    # fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
        print('Clearing db...')
        Member.query.delete()
        Instrument.query.delete()
        Review.query.delete()

        print('Seeding members...')
        members = create_members()
        db.session.add_all(members)
        db.session.commit()

        print('Seeding instruments...')
        instruments = create_instruments()
        db.session.add_all(instruments)
        db.session.commit()

        print('Done seeding db')