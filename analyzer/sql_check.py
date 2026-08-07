def check_for_problems(query):
    query = query.lower()
    if 'select *' in query:
        print('Specify needed fields instead of using *')
    if 'order by' in query and 'limit' not in query:
        print('Consider limiting the results to reduce sorting')
    if 'distinct' in query:
        print('Check whether distinct is necessary')
    #functions on indexed columns

    #huge in lists
