from .compatibility import calculate_compatibility

from .ripple import (
    generate_strategies,
    rank_strategies
)


def recover_from_technician_dropout(
    request,
    failed_technician_id,
    data,
    repair_time_model=None
):

    # ========================================================
    # FIND FAILED TECHNICIAN
    # ========================================================

    failed_technician = next(
        (
            tech
            for tech in data["technicians"]
            if tech["technician_id"]
            == failed_technician_id
        ),
        None
    )

    if failed_technician is None:

        return {
            "success": False,
            "reason": "Technician not found"
        }


    # ========================================================
    # TEMPORARILY MARK UNAVAILABLE
    # ========================================================

    old_status = failed_technician[
        "availability"
    ]

    failed_technician[
        "availability"
    ] = "UNAVAILABLE"


    # ========================================================
    # RECALCULATE COMPATIBILITY
    # ========================================================

    compatibility_results = (
        calculate_compatibility(
            request,
            data
        )
    )

    if not compatibility_results:

        failed_technician[
            "availability"
        ] = old_status

        return {
            "success": False,
            "reason":
                "No replacement technicians available"
        }


    # ========================================================
    # GENERATE RECOVERY STRATEGIES
    # ========================================================

    strategies = generate_strategies(
        request,
        compatibility_results,
        data
    )


    # ========================================================
    # RE-RUN ML-ENHANCED RIPPLE ENGINE
    # ========================================================

    ranked = rank_strategies(
        strategies,
        request,
        data,
        repair_time_model
    )


    if not ranked:

        failed_technician[
            "availability"
        ] = old_status

        return {
            "success": False,
            "reason":
                "No feasible recovery strategy found"
        }


    # Lowest-impact replacement
    best_recovery = ranked[0]


    # ========================================================
    # RESTORE ORIGINAL STATE
    # ========================================================

    # We restore because this function currently SIMULATES
    # the disruption instead of permanently changing the DB.

    failed_technician[
        "availability"
    ] = old_status


    return {

        "success":
            True,

        "failed_technician":
            failed_technician_id,

        "recommended_replacement":
            best_recovery,

        "all_recovery_options":
            ranked
    }