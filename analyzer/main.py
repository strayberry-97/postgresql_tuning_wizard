from analyzer.analyze_plan import analyze_plan
from analyzer.connection import establish_connection
from analyzer.explain import get_execution_plan

#query = "SELECT inv.invoice_no, p.description, i.quantity, i.unit_price, inv.country FROM invoices inv JOIN invoice_items i ON inv.invoice_no = i.invoice_no JOIN products p ON i.stock_code = p.stock_code LIMIT 20;"
query = "Select * From invoices ORDER BY country DESC"

def get_query_plan(db_params,user_query):
    conn = establish_connection(db_params)
    plan = get_execution_plan(conn, user_query)[0][0][0]
    return plan

