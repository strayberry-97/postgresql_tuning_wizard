def walker(plan, type,  level = 0):
    if type == 'explain analyze':
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

        estimated_rows = plan.get('Plan Rows', 0)
        actual_rows = plan.get('Actual Rows', 0)

        if estimated_rows > 0 and actual_rows > 0:
            ratio = max(estimated_rows, actual_rows) / min(estimated_rows, actual_rows)

            if ratio >= 10:
                node['Problems'].append({
                    "Severity" : "High",
                    "Sign" : f"Estimated rows ({estimated_rows}) differ significantly from actual rows ({actual_rows})",
                    "Recommendations" : "Statistics might be inaccurate, consider running ANALYZE to update them"
                })

        match plan["Node Type"]:
            case "Seq Scan":
                rows_removed = plan.get("Rows Removed by Filter", 0)
                rows_examined = plan["Actual Rows"] + rows_removed

                if rows_examined > 100000 and (rows_removed / rows_examined)>0.8:
                    node["Problems"].append({
                        "Sign" : "Sequential scan examines many rows and filters out most of them",
                        "Recommendations" :"Consider whether an index should be used on the columns used by the filter condition",
                        "Severity": "High"
                    })
            case "Nested Loop":
                outer_child = plan['Plans'][0]
                inner_child = plan['Plans'][1]
                if outer_child['Actual Rows'] > 1000 and "Scan" in inner_child['Node Type'] and inner_child['Actual Loops'] * inner_child['Actual Rows'] > 100000:
                    node["Problems"].append({
                        "Sign": "Nested Loop repeatedly executes an inner scan for many outer rows",
                        "Recommendations": "Consider adding an index on inner relation's join or filter columns or whether a different join strategy would be more efficient",
                        "Severity" : "Medium"
                    })
    else:
        node = {
            "Node Type": plan["Node Type"],
            "Startup Cost": plan["Startup Cost"],
            "Total Cost": plan["Total Cost"],
            "Estimated Rows" : plan['Plan Rows'],
            "Level": level,
            "Children": [],
            "Problems": []
        }

    if "Plans" in plan:
        for child in plan["Plans"]:
            node["Children"].append(walker(child, type, level+1))

    return node
