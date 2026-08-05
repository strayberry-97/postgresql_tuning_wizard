def get_execution_plan(conn, user_query):
    try:
        query = "EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) " + user_query
        with conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()
    except Exception as error:
        print(f"Error while trying to run query:{error}")
        return None