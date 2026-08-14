import psycopg

def establish_connection(db_params):
    try: return psycopg.connect(**db_params)
    except Exception as error:
        print(f"Error connecting to database: {error}")
        return None