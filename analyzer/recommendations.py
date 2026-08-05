def check_for_problems(query):
    query = query.lower()
    if 'select *' in query:
        print('Specify needed fields instead of using *')
    if '':
        pass
