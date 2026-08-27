from analyzer.sql_parser import parse, walk
from enum import Enum
from pglast.enums import A_Expr_Kind

class PATTERNS(Enum):
    IN = A_Expr_Kind.AEXPR_IN

def analyze_sql(query):
    recommendations = []
    query_upper = query.upper()

    if "SELECT *" in query_upper:
        recommendations.append({
            "Severity" : "Low",
            "Sign" : "Query uses SELECT *",
            "Recommendations" : "Select only the columns needed by the query to reduce unnecessary memory usage"
        })

    tree = parse(query)
    results = []
    walk(tree[0], PATTERNS.IN.value, results)

    for each in results:
        if len(each.rexpr) > 5:
            recommendations.append({
                "Severity" : "Low",
                "Sign" : "IN condition uses many values",
                "Recommendations" : "Consider using EXISTS instead in large databases"
            })

    return recommendations