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

        #if plan['Plan Rows'] / node['Actual Rows'] > 0.8:
        #   node["Problems"].append({
        #        "Sign": "Significant difference between actual and plan rows",
        #        "Recommendation": "Consider running ANALYSE to update statistics"
        #    })

        match plan["Node Type"]:
            case "Seq Scan":
                rows_removed = plan.get("Rows Removed by Filter", 0)
                rows_examined = plan["Actual Rows"] + rows_removed

                if rows_examined > 100000 and (rows_removed / rows_examined)>0.8:
                    node["Problems"].append({
                        "Sign" : "Sequential scan examines many rows and filters out most of them",
                        "Recommendations" :"Consider whether an index should be used"
                    })
            case "Nested Loop":
                outer_child = plan['Plans'][0]
                inner_child = plan['Plans'][1]
                if outer_child['Actual Rows'] > 1000 and "Scan" in inner_child['Node Type'] and inner_child['Actual Loops'] * inner_child['Actual Rows'] > 100000:
                    node["Problems"].append({
                        "Sign": "Nested Loop repeatedly executes an inner scan for many outer rows",
                        "Recommendations": "Consider adding an index on inner relation's join/filter columns or whether a different join strategy would be more efficient"
                    })
    else:
        node = {
            "Node Type": plan["Node Type"],
            "Startup Cost": plan["Startup Cost"],
            "Total Cost": plan["Total Cost"],
            "Level": level,
            "Children": [],
            "Problems": []
        }

    if "Plans" in plan:
        for child in plan["Plans"]:
            node["Children"].append(walker(child, type, level+1))

    return node
