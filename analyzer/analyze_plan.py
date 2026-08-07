from analyzer.plan_walker import walker


def analyze_plan(plan):
    problems = []
    walker(plan['Plan'])
