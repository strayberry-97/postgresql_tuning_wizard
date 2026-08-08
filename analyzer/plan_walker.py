def walker(plan, result, level = 0):
    match plan["Node Type"]:
        case "Seq Scan":
            if plan["Actual Rows"] > 100:
                result.append([plan['Node Type'], level, "Seq Scan on a large amount of rows, consider using an index"])
        case "Filter":
            if plan["Actual Rows"] <= plan["Estimated Rows"] * 0.1:
                result.append([plan['Node Type'], level, "Large number of rows filtered out"])

    if "Plans" in plan:
        for each in plan["Plans"]:
            walker(each, result, level+1)
