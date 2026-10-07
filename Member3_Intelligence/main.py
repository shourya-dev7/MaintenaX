import json
from pathlib import Path

from ml_predictor import train_repair_time_model
from counterfactual import (
    evaluate_decision,
    create_decision_memory
)
from validation import validate_request
from memory import find_similar_incidents
from compatibility import calculate_compatibility
from recovery import recover_from_technician_dropout
from ripple import (
    generate_strategies,
    rank_strategies
)


# ============================================================
# LOAD DATASET
# ============================================================

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "hackathon_seed_data.json"

with open(DATA_FILE, "r") as file:
    data = json.load(file)

data.setdefault("decision_memory", [])

print("Dataset loaded successfully!")
print("Technicians:", len(data["technicians"]))
print("Machines:", len(data["machines"]))
print("Requests:", len(data["service_requests"]))


# ============================================================
# TRAIN ML REPAIR-TIME MODEL
# ============================================================

repair_time_model = train_repair_time_model(data)

print("ML repair-time model trained successfully!")


# ============================================================
# SELECT SERVICE REQUEST
# ============================================================

request = next(
    (
        r for r in data["service_requests"]
        if r["request_id"] == "SR501"
    ),
    None
)

if request is None:
    raise SystemExit("SR501 not found.")

print("\n--- CURRENT SERVICE REQUEST ---")
print("Request ID:", request["request_id"])
print("Machine:", request["machine_id"])
print("Fault:", request["fault_type"])
print("Priority:", request["priority"])
print("Required Skill:", request["required_skill"])
print("Required Parts:", request["required_parts"])
print("SLA:", request["sla_minutes"], "minutes")


# ============================================================
# REQUEST VALIDATION
# ============================================================

validation = validate_request(
    request,
    data
)

print("\n--- REQUEST VALIDATION ---")

print(
    "Machine Exists:",
    validation["machine_exists"]
)

print(
    "Machine Eligible:",
    validation["machine_eligible"]
)

print(
    "Required Skill Available:",
    validation["skill_available"]
)

print(
    "Required Parts Available:",
    validation["parts_available"]
)

if not validation["valid"]:

    print("\nRESULT: REQUEST BLOCKED")

    for issue in validation["issues"]:
        print("-", issue)

    raise SystemExit(
        "Intelligence pipeline stopped: invalid request."
    )

print("\nRESULT: REQUEST VALIDATED")


# ============================================================
# CONTEXTUAL MAINTENANCE MEMORY
# ============================================================

similar_incidents = find_similar_incidents(
    request,
    data
)

print("\n--- CONTEXTUAL MAINTENANCE MEMORY ---")

print(
    "Similar incidents found:",
    len(similar_incidents)
)

for incident in similar_incidents:

    print(
        incident["history_id"],
        "| Technician:",
        incident["technician_id"],
        "| Resolution:",
        incident["resolution_minutes"],
        "min",
        "| Similarity:",
        incident["similarity_score"],
        "%"
    )


# ============================================================
# MACHINE-TECHNICIAN COMPATIBILITY
# ============================================================

compatibility_results = calculate_compatibility(
    request,
    data
)

if not compatibility_results:
    raise SystemExit(
        "No compatible technicians found."
    )

print(
    "\n--- MACHINE-TECHNICIAN COMPATIBILITY ---"
)

for rank, tech in enumerate(
    compatibility_results,
    start=1
):

    print(
        f"\n{rank}.",
        tech["name"],
        f"({tech['technician_id']})",
        "->",
        tech["compatibility_score"],
        "%"
    )

    for reason in tech["reasons"]:
        print("   +", reason)


# ============================================================
# GENERATE POSSIBLE STRATEGIES
# ============================================================

strategies = generate_strategies(
    request,
    compatibility_results,
    data
)

if not strategies:
    raise SystemExit(
        "No feasible strategies generated."
    )

print("\n--- POSSIBLE STRATEGIES ---")

for strategy in strategies:

    print(
        "Assign",
        strategy["technician_name"],
        "| Compatibility:",
        strategy["compatibility_score"],
        "%"
    )


# ============================================================
# OPERATIONAL RIPPLE SIMULATION + ML
# ============================================================

ranked_strategies = rank_strategies(
    strategies,
    request,
    data,
    repair_time_model
)

if not ranked_strategies:
    raise SystemExit(
        "No feasible ranked strategies found."
    )

print(
    "\n--- OPERATIONAL RIPPLE SIMULATION ---"
)

for rank, strategy in enumerate(
    ranked_strategies,
    start=1
):

    print(
        f"\n{rank}.",
        strategy["technician_name"]
    )

    print(
        "   Compatibility:",
        strategy["compatibility_score"],
        "%"
    )

    print(
        "   ML Predicted Repair Time:",
        strategy["predicted_repair_time"],
        "min"
    )

    print(
        "   Global Impact:",
        strategy["impact_score"]
    )

    print(
        "   Response Delay:",
        strategy["estimated_response_delay"],
        "min"
    )

    print(
        "   Current SLA:",
        strategy["sla_risk"],
        f"({strategy['sla_consumption']}%)"
    )

    print(
        "   Projected SLA:",
        strategy["projected_sla_status"],
        f"({strategy['projected_sla_percentage']}%)"
    )

    print(
        "   Affected Requests:",
        strategy["affected_requests"]
        or "None"
    )

    print(
        "   Resource Risks:",
        strategy["resource_risks"]
        or "None"
    )

    print("   Reasons:")

    for reason in strategy["reasons"]:
        print("      -", reason)


# ============================================================
# SYSTEM RECOMMENDATION
# ============================================================

best_strategy = ranked_strategies[0]

print("\n================================")
print("      SYSTEM RECOMMENDATION")
print("================================")

print(
    "Technician:",
    best_strategy["technician_name"]
)

print(
    "Technician ID:",
    best_strategy["technician_id"]
)

print(
    "Compatibility:",
    best_strategy["compatibility_score"],
    "%"
)

print(
    "ML Predicted Repair Time:",
    best_strategy["predicted_repair_time"],
    "min"
)

print(
    "Global Impact:",
    best_strategy["impact_score"]
)

print(
    "Projected SLA:",
    best_strategy["projected_sla_status"]
)

print(
    "Affected Requests:",
    best_strategy["affected_requests"]
    or "None"
)

print(
    "Reason: LOWEST SYSTEM-WIDE IMPACT"
)


# ============================================================
# DYNAMIC RECOVERY DEMO
# ============================================================

print("\n================================")
print("       SIMULATING DISRUPTION")
print("================================")

failed_technician_id = (
    best_strategy["technician_id"]
)

print(
    best_strategy["technician_name"],
    "has suddenly become UNAVAILABLE."
)

recovery = recover_from_technician_dropout(
    request,
    failed_technician_id,
    data,
    repair_time_model
)

if recovery["success"]:

    print(
        "\n--- RECOVERY SIMULATION ---"
    )

    for rank, option in enumerate(
        recovery["all_recovery_options"],
        start=1
    ):

        print(
            f"\n{rank}.",
            option["technician_name"]
        )

        print(
            "   Compatibility:",
            option["compatibility_score"],
            "%"
        )

        print(
            "   Ripple Impact:",
            option["impact_score"]
        )

        print(
            "   Projected SLA:",
            option["projected_sla_status"]
        )

        print(
            "   Affected Requests:",
            option["affected_requests"]
            or "None"
        )

    replacement = recovery[
        "recommended_replacement"
    ]

    print("\n================================")
    print("      RECOVERY RECOMMENDATION")
    print("================================")

    print(
        "Reassign",
        request["request_id"],
        "to:",
        replacement["technician_name"]
    )

    print(
        "Replacement ID:",
        replacement["technician_id"]
    )

    print(
        "Impact Score:",
        replacement["impact_score"]
    )

    print(
        "Reason: LOWEST RECOVERY RIPPLE"
    )

else:

    print(
        "\nRecovery failed:",
        recovery["reason"]
    )


# ============================================================
# SIMULATE JOB COMPLETION
# ============================================================

print("\n================================")
print("          JOB COMPLETED")
print("================================")

# Prototype simulated outcome.
# Later Member 2 will provide real completion metrics.
actual_impact = 22

print(
    "Actual Operational Impact:",
    actual_impact
)


# ============================================================
# COUNTERFACTUAL ANALYSIS
# ============================================================

analysis = evaluate_decision(
    best_strategy,
    ranked_strategies,
    actual_impact
)

print(
    "\n--- COUNTERFACTUAL ANALYSIS ---"
)

print(
    "Chosen Technician:",
    best_strategy["technician_name"]
)

print(
    "Predicted Impact:",
    best_strategy["impact_score"]
)

print(
    "Actual Impact:",
    analysis["actual_impact"]
)

if analysis["best_alternative"]:

    alternative = analysis[
        "best_alternative"
    ]

    print(
        "Best Alternative:",
        alternative["technician_name"]
    )

    print(
        "Alternative Predicted Impact:",
        alternative["impact_score"]
    )

print(
    "Estimated Decision Regret:",
    analysis["decision_regret"]
)

print(
    "Decision Quality:",
    analysis["evaluation"]
)


# ============================================================
# CREATE DECISION MEMORY
# ============================================================

decision_record = create_decision_memory(
    request,
    best_strategy,
    analysis
)

existing_record = next(
    (
        record
        for record in data["decision_memory"]
        if record["request_id"]
        == request["request_id"]
    ),
    None
)

if existing_record:

    existing_record.update(
        decision_record
    )

else:

    data["decision_memory"].append(
        decision_record
    )


print("\n--- DECISION MEMORY ---")

print(
    "Request:",
    decision_record["request_id"]
)

print(
    "Chosen Technician:",
    decision_record["chosen_technician"]
)

print(
    "Predicted Impact:",
    decision_record["predicted_impact"]
)

print(
    "Actual Impact:",
    decision_record["actual_impact"]
)

print(
    "Estimated Decision Regret:",
    decision_record["decision_regret"]
)

print(
    "Evaluation:",
    decision_record["evaluation"]
)


# ============================================================
# SAVE DECISION MEMORY
# ============================================================

with open(DATA_FILE, "w") as file:

    json.dump(
        data,
        file,
        indent=4
    )

print(
    "\nDecision memory saved to dataset."
)

print("\n================================")
print(" INTELLIGENCE PIPELINE COMPLETE")
print("================================")