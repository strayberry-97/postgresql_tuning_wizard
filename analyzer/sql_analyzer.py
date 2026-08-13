from analyzer.sql_parser import parse, walk
from enum import Enum
from pglast.enums import A_Expr_Kind

class PATTERNS(Enum):
    IN = A_Expr_Kind.AEXPR_IN

def check_for_in_problems(query):
    tree = parse(query)
    results = []
    walk(tree[0], PATTERNS.IN.value, results)
    for each in results:
        print(len(each.rexpr))