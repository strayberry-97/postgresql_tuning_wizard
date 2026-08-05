from analyzer.connection import establish_connection
from analyzer.explain import get_execution_plan

conn = establish_connection()
user_query = "SELECT * FROM invoices WHERE customer_id = 0"

with conn:
    plan = get_execution_plan(conn, user_query)[0][0][0]
    print(plan['Plan'])

