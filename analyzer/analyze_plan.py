from analyzer.plan_walker import walker


def analyze_plan(plan):
    result = {
        "Planning Time" : plan["Planning Time"],
        "Execution Time" : plan["Execution Time"],
        "Shared Buffers Hit" : plan["Plan"]["Shared Hit Blocks"],
        "Shared Buffers Read" : plan["Plan"]["Shared Read Blocks"],
        "Temp Blocks Written" : plan["Plan"]["Temp Written Blocks"],
        "Total Rows" : plan["Plan"]['Actual Rows'],
        "Plan" : []
    }


    result["Plan"] = walker(plan['Plan'], 0)
    return result
