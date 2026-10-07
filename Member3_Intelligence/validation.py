def validate_request(request, data):

    result = {
        "machine_exists": False,
        "machine_eligible": False,
        "skill_available": False,
        "parts_available": True,
        "valid": False,
        "issues": []
    }

    # -----------------------------
    # 1. MACHINE VALIDATION
    # -----------------------------

    machine = next(
        (
            m for m in data["machines"]
            if m["machine_id"] == request["machine_id"]
        ),
        None
    )

    if machine:
        result["machine_exists"] = True

        # For prototype:
        # FAULT/OPERATIONAL machines are serviceable
        if machine["status"] in ["FAULT", "OPERATIONAL"]:
            result["machine_eligible"] = True
    else:
        result["issues"].append("Machine not found")

    # -----------------------------
    # 2. SKILL AVAILABILITY
    # -----------------------------

    for tech in data["technicians"]:

        if (
            request["required_skill"] in tech["skills"]
            and tech["availability"] == "AVAILABLE"
        ):
            result["skill_available"] = True
            break

    if not result["skill_available"]:
        result["issues"].append(
            "No available technician with required skill"
        )

    # -----------------------------
    # 3. PART AVAILABILITY
    # -----------------------------

    for required_part in request["required_parts"]:

        part_found = False

        for item in data["inventory"]:

            if (
                item["part_id"] == required_part
                and item["site_id"] == request["site_id"]
                and item["available_quantity"] > 0
            ):
                part_found = True
                break

        if not part_found:
            result["parts_available"] = False
            result["issues"].append(
                f"{required_part} unavailable at site"
            )

    # -----------------------------
    # FINAL VALIDATION
    # -----------------------------

    result["valid"] = (
        result["machine_exists"]
        and result["machine_eligible"]
        and result["skill_available"]
        and result["parts_available"]
    )

    return result