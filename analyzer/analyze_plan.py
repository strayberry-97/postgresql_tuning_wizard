from analyzer.plan_walker import walker


def analyze_plan(plan, query_type):
    if query_type == 'explain analyze':
        result = {
            "Planning Time" : plan["Planning Time"],
            "Execution Time" : plan["Execution Time"],
            "Shared Buffers Hit" : plan["Plan"]["Shared Hit Blocks"],
            "Shared Buffers Read" : plan["Plan"]["Shared Read Blocks"],
            "Temp Blocks Written" : plan["Plan"]["Temp Written Blocks"],
            "Total Rows" : plan["Plan"]['Actual Rows'],
            "Plan" : []
        }
    else:
        result = {
            "Plan" : []
        }


    result["Plan"] = walker(plan['Plan'], query_type, 0)
    return result
