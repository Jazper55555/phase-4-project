from sqlalchemy import create_engine, inspect

# Replace with your actual database URI
DATABASE_URI = 'postgresql://phase_4_project_db_b102_user:6xVvd5aMGXYDfMh7Bz9iS2SsHAqDKCXy@dpg-cs87pgm8ii6s73c5j3gg-a.oregon-postgres.render.com/phase_4_project_db_b102'

def inspect_database():
    # Create the engine
    engine = create_engine(DATABASE_URI)

    # Create an inspector
    inspector = inspect(engine)

    # Print out table names
    print("Tables in the database:")
    for table_name in inspector.get_table_names():
        print(table_name)

if __name__ == "__main__":
    inspect_database()