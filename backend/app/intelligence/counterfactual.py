def evaluate_decision(
    chosen_strategy,
    ranked_strategies,
    actual_impact
):

    # Find strategies that were NOT selected
    alternatives = [
        strategy
        for strategy in ranked_strategies
        if strategy["technician_id"]
        != chosen_strategy["technician_id"]
    ]

    # No alternative existed
    if not alternatives:

        return {
            "actual_impact": actual_impact,
            "best_alternative": None,
            "decision_regret": 0,
            "evaluation": "NO_ALTERNATIVE"
        }

    # Best predicted alternative
    best_alternative = min(
        alternatives,
        key=lambda x: x["impact_score"]
    )

    # --------------------------------
    # DECISION REGRET
    # --------------------------------

    regret = max(
        0,
        actual_impact
        - best_alternative["impact_score"]
    )

    # --------------------------------
    # DECISION QUALITY
    # --------------------------------

    if regret == 0:
        evaluation = "OPTIMAL"

    elif regret <= 10:
        evaluation = "GOOD"

    elif regret <= 25:
        evaluation = "ACCEPTABLE"

    else:
        evaluation = "SUBOPTIMAL"

    return {
        "actual_impact":
            round(actual_impact, 1),

        "best_alternative":
            best_alternative,

        "decision_regret":
            round(regret, 1),

        "evaluation":
            evaluation
    }


# ============================================================
# DECISION MEMORY
# ============================================================

def create_decision_memory(
    request,
    chosen_strategy,
    analysis
):

    alternative = analysis["best_alternative"]

    return {

        "request_id":
            request["request_id"],

        "machine_id":
            request["machine_id"],

        "fault_type":
            request["fault_type"],

        "chosen_technician":
            chosen_strategy["technician_id"],

        "predicted_impact":
            chosen_strategy["impact_score"],

        "actual_impact":
            analysis["actual_impact"],

        "best_alternative":
            (
                alternative["technician_id"]
                if alternative
                else None
            ),

        "best_alternative_predicted_impact":
            (
                alternative["impact_score"]
                if alternative
                else None
            ),

        "decision_regret":
            analysis["decision_regret"],

        "evaluation":
            analysis["evaluation"]
    }