import psycopg

db_params = {
    "dbname" : "tuning_wizard_test",
    "user" : "postgres",
    "password" : "1111",
    "host" : "localhost",
    "port" : "5432"
}

try:
    with psycopg.connect(**db_params) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT version();")
            db_version = cur.fetchone()
            print(f"Successfully connected! Postgres version: {db_version[0]}")

except Exception as error:
    print(f"Error connecting to database: {error}")