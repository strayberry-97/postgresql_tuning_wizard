def walker(plan, result, level = 0):
    print(plan);
    match plan["Node Type"]:
        case "Seq Scan":
            rows_removed = plan.get("Rows Removed by Filter", 0)
            rows_examined = plan["Actual Rows"] + rows_removed

            if rows_examined > 100000 and (rows_removed / rows_examined)>0.8:
                result.append([
                    plan["Node Type"],
                    level,
                    "Sequential scan examines many rows and filters out most of them; consider whether an index could help"])

    if "Plans" in plan:
        for each in plan["Plans"]:
            walker(each, result, level+1)
