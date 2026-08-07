def walker(plan, level = 0):
    print(f"Level {level}: {plan['Node Type']}")
    if "Plans" in plan:
        for each in plan["Plans"]:
            walker(each, level+1)
