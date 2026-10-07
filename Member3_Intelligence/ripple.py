from ml_predictor import predict_repair_time


def generate_strategies(request, compatibility_results, data):

    strategies = []

    for tech in compatibility_results:
        strategies.append({
            "request_id": request["request_id"],
            "technician_id": tech["technician_id"],
            "technician_name": tech["name"],
            "compatibility_score": tech["compatibility_score"]
        })

    return strategies


# ============================================================
# SLA RISK
# ============================================================

def calculate_sla_risk(request):

    sla = request["sla_minutes"]
    elapsed = request["elapsed_minutes"]

    if sla <= 0:
        return "BREACHED", 100

    consumption = (elapsed / sla) * 100

    if consumption >= 100:
        return "BREACHED", consumption
    elif consumption >= 85:
        return "HIGH", consumption
    elif consumption >= 60:
        return "MEDIUM", consumption
    else:
        return "LOW", consumption


# ============================================================
# RESOURCE RISK
# ============================================================

def calculate_resource_risk(request, data):

    risks = []
    penalty = 0

    for required_part in request["required_parts"]:

        inventory_item = next(
            (
                item
                for item in data["inventory"]
                if (
                    item["part_id"] == required_part
                    and item["site_id"] == request["site_id"]
                )
            ),
            None
        )

        if inventory_item is None:

            risks.append(
                f"{required_part}: NOT AVAILABLE"
            )

            penalty += 50
            continue

        remaining = (
            inventory_item["available_quantity"] - 1
        )

        if remaining <= 0:

            risks.append(
                f"{required_part}: inventory becomes ZERO"
            )

            penalty += 20

        else:

            risks.append(
                f"{required_part}: {remaining} remaining"
            )

    return penalty, risks


# ============================================================
# RIPPLE SIMULATION
# ============================================================

def simulate_ripple(
    strategy,
    request,
    data,
    repair_time_model=None
):

    technician_id = strategy["technician_id"]

    impact_score = 0
    estimated_delay = 0
    affected_requests = []
    reasons = []

    # --------------------------------------------------------
    # 1. FIND TECHNICIAN
    # --------------------------------------------------------

    technician = next(
        t for t in data["technicians"]
        if t["technician_id"] == technician_id
    )

    machine = next(
        (
            m for m in data["machines"]
            if m["machine_id"] == request["machine_id"]
        ),
        None
    )

    if machine is None:
        raise ValueError("Machine not found during ripple simulation.")


    # --------------------------------------------------------
    # 2. ML REPAIR-TIME PREDICTION
    # --------------------------------------------------------

    if repair_time_model is not None:

        predicted_repair_time = predict_repair_time(
            repair_time_model,
            request,
            technician,
            machine
        )

        reasons.append(
            f"ML predicted repair time: "
            f"{predicted_repair_time} min"
        )

    else:

        # Fallback if ML model is unavailable
        predicted_repair_time = 60.0

        reasons.append(
            "Fallback repair-time estimate: 60 min"
        )


    # --------------------------------------------------------
    # 3. EXISTING JOB IMPACT
    # --------------------------------------------------------

    active_jobs = [
        assignment
        for assignment in data["active_assignments"]
        if assignment["technician_id"] == technician_id
    ]

    if active_jobs:

        for job in active_jobs:
            affected_requests.append(
                job["request_id"]
            )

        impact_score += len(active_jobs) * 30

        reasons.append(
            f"{len(active_jobs)} active job(s) may be disrupted"
        )

    else:

        reasons.append(
            "No existing assignments disrupted"
        )


    # --------------------------------------------------------
    # 4. LOCATION / RESPONSE DELAY
    # --------------------------------------------------------

    if technician["site_id"] != request["site_id"]:

        estimated_delay = 30
        impact_score += 20

        reasons.append(
            "Cross-site transfer required (+30 min)"
        )

    else:

        estimated_delay = 5

        reasons.append(
            "Technician already at target site (+5 min)"
        )


    # --------------------------------------------------------
    # 5. PROJECTED SLA USING ML
    # --------------------------------------------------------

    projected_elapsed = (
        request["elapsed_minutes"]
        + estimated_delay
        + predicted_repair_time
    )

    sla_minutes = request["sla_minutes"]

    if sla_minutes <= 0:

        projected_sla_percentage = 100
        projected_sla = "BREACH"
        impact_score += 50

    else:

        projected_sla_percentage = (
            projected_elapsed
            / sla_minutes
        ) * 100

        if projected_sla_percentage >= 100:

            projected_sla = "BREACH"
            impact_score += 50

        elif projected_sla_percentage >= 85:

            projected_sla = "HIGH_RISK"
            impact_score += 25

        else:

            projected_sla = "SAFE"

    reasons.append(
        f"Projected SLA status: {projected_sla}"
    )


    # --------------------------------------------------------
    # 6. WORKLOAD IMPACT
    # --------------------------------------------------------

    workload = technician["active_jobs"]

    impact_score += workload * 10

    if workload > 0:

        reasons.append(
            f"Technician currently has "
            f"{workload} active job(s)"
        )

    else:

        reasons.append(
            "Technician has no active workload"
        )


    # --------------------------------------------------------
    # 7. COMPATIBILITY PENALTY
    # --------------------------------------------------------

    compatibility = strategy[
        "compatibility_score"
    ]

    compatibility_penalty = (
        100 - compatibility
    ) * 0.3

    impact_score += compatibility_penalty


    # --------------------------------------------------------
    # 8. CURRENT SLA INFORMATION
    # --------------------------------------------------------

    sla_level, sla_consumption = (
        calculate_sla_risk(request)
    )

    reasons.append(
        f"Current SLA risk: {sla_level}"
    )


    # --------------------------------------------------------
    # 9. RESOURCE / INVENTORY RIPPLE
    # --------------------------------------------------------

    resource_penalty, resource_risks = (
        calculate_resource_risk(
            request,
            data
        )
    )

    impact_score += resource_penalty

    for risk in resource_risks:

        reasons.append(
            f"Resource risk: {risk}"
        )


    # --------------------------------------------------------
    # FINAL RESULT
    # --------------------------------------------------------

    return {

        **strategy,

        "predicted_repair_time":
            predicted_repair_time,

        "impact_score":
            round(impact_score, 1),

        "affected_requests":
            affected_requests,

        "estimated_response_delay":
            estimated_delay,

        "sla_risk":
            sla_level,

        "sla_consumption":
            round(sla_consumption, 1),

        "projected_sla_status":
            projected_sla,

        "projected_sla_percentage":
            round(projected_sla_percentage, 1),

        "resource_risks":
            resource_risks,

        "reasons":
            reasons
    }


# ============================================================
# RANK STRATEGIES
# ============================================================

def rank_strategies(
    strategies,
    request,
    data,
    repair_time_model=None
):

    simulated = []

    for strategy in strategies:

        result = simulate_ripple(
            strategy,
            request,
            data,
            repair_time_model
        )

        simulated.append(result)

    # Lowest global impact wins
    simulated.sort(
        key=lambda x: x["impact_score"]
    )

    return simulated