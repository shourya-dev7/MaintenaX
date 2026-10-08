def calculate_compatibility(request, data):

    # Find current machine
    machine = next(
        (
            m for m in data["machines"]
            if m["machine_id"] == request["machine_id"]
        ),
        None
    )

    if machine is None:
        return []

    results = []

    for tech in data["technicians"]:

        # --------------------------------
        # HARD FILTERS
        # --------------------------------

        # Technician must have required skill
        if request["required_skill"] not in tech["skills"]:
            continue

        # Technician must currently be available
        if tech["availability"] != "AVAILABLE":
            continue

        # --------------------------------
        # BASE COMPATIBILITY
        # --------------------------------

        score = 0
        reasons = []

        # 1. Skill match - 25
        score += 25
        reasons.append("Required skill matched")

        # 2. Same site - 15
        if tech["site_id"] == request["site_id"]:
            score += 15
            reasons.append("Same site")

        # 3. Workload - max 10
        if tech["active_jobs"] == 0:
            score += 10
            reasons.append("No active jobs")
        elif tech["active_jobs"] == 1:
            score += 5
            reasons.append("Low workload")

        # --------------------------------
        # HISTORICAL PERFORMANCE
        # --------------------------------

        relevant_history = []

        for incident in data["service_history"]:

            if (
                incident["technician_id"]
                == tech["technician_id"]
                and incident["machine_type"]
                == machine["machine_type"]
            ):
                relevant_history.append(incident)

        # 4. Machine-type experience - max 15
        experience_count = len(relevant_history)

        experience_score = min(
            experience_count * 5,
            15
        )

        score += experience_score

        if experience_count > 0:
            reasons.append(
                f"{experience_count} similar machine jobs"
            )

        # --------------------------------
        # FAULT-SPECIFIC EXPERIENCE
        # --------------------------------

        fault_history = [
            h for h in relevant_history
            if h["fault_type"] == request["fault_type"]
        ]

        # 5. Fault experience - max 15
        fault_score = min(
            len(fault_history) * 5,
            15
        )

        score += fault_score

        if fault_history:
            reasons.append(
                f"{len(fault_history)} similar fault repairs"
            )

        # --------------------------------
        # SUCCESS / REPEAT FAILURE
        # --------------------------------

        if relevant_history:

            successful_jobs = sum(
                1 for h in relevant_history
                if not h["repeat_failure"]
            )

            success_rate = (
                successful_jobs /
                len(relevant_history)
            )

            # Maximum 20
            success_score = success_rate * 20

            score += success_score

            reasons.append(
                f"{round(success_rate * 100)}% historical success"
            )

        else:
            success_rate = None

        # Cap score at 100
        score = min(score, 100)

        results.append({
            "technician_id": tech["technician_id"],
            "name": tech["name"],
            "compatibility_score": round(score, 1),
            "historical_success_rate": (
                round(success_rate * 100, 1)
                if success_rate is not None
                else None
            ),
            "reasons": reasons
        })

    # Highest compatibility first
    results.sort(
        key=lambda x: x["compatibility_score"],
        reverse=True
    )

    return results