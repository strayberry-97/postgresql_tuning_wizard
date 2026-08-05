import os

import psycopg
from dotenv import load_dotenv, dotenv_values

ENV_PATH = "../.env"


def establish_connection():
    env = dotenv_values(ENV_PATH)

    db_params = {
        "dbname": env["DBNAME"],
        "user": env["USER"],
        "password": env["PASSWORD"],
        "host": env["HOST"],
        "port": env["PORT"],
    }
    try: return psycopg.connect(**db_params)
    except Exception as error:
        print(f"Error connecting to database: {error}")
        return None