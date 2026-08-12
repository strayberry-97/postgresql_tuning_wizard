from pglast import parse_sql

from pglast.ast import Node

def parse(query):
    return parse_sql(query)

def walk(node, target, results):
    if not isinstance(node, Node):
        return

    for field in node:
        value = getattr(node, field)
        if field == 'kind' and value == target:
            results.append(node)

        if isinstance(value, Node):
            walk(value, target, results)

        elif isinstance(value, tuple):
            for item in value:
                if isinstance(item, Node):
                    walk(item, target, results)

