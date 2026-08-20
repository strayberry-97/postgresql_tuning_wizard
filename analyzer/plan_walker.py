def walker(plan, level = 0):
    node = {
        "Node Type": plan["Node Type"],
        "Startup Cost": plan["Startup Cost"],
        "Total Cost": plan["Total Cost"],
        "Actual Startup Time": plan["Actual Startup Time"],
        "Actual Total Time": plan["Actual Total Time"],
        "Actual Rows": plan["Actual Rows"],
        "Level" : level,
        "Children" : [],
        "Problems" : []

    }
    match plan["Node Type"]:
        case "Seq Scan":
            rows_removed = plan.get("Rows Removed by Filter", 0)
            rows_examined = plan["Actual Rows"] + rows_removed

            if rows_examined > 100000 and (rows_removed / rows_examined)>0.8:
                node["Problems"].append([
                    plan["Node Type"],
                    level,
                    "Sequential scan examines many rows and filters out most of them; consider whether an index could help"
                ])

    if "Plans" in plan:
        for child in plan["Plans"]:
            node["Children"].append(walker(child, level+1))

    return node
