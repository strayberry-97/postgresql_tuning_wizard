from analyzer.plan_walker import walker


def analyze_plan(plan):
    result = []
    walker(plan['Plan'], result)
    print(result)
