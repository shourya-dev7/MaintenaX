# ============================================================
# CONTEXTUAL MAINTENANCE MEMORY
# ============================================================

def find_similar_incidents(request, data):

    # --------------------------------------------------------
    # 1. FIND CURRENT MACHINE
    # --------------------------------------------------------

    machine = next(
        (
            m
            for m in data["machines"]
            if m["machine_id"] == request["machine_id"]
        ),
        None
    )

    if machine is None:
        return []

    machine_type = machine["machine_type"]

    matches = []


    # --------------------------------------------------------
    # 2. COMPARE WITH HISTORICAL INCIDENTS
    # --------------------------------------------------------

    for incident in data["service_history"]:

        similarity_score = 0
        reasons = []


        # ----------------------------------------------------
        # SAME MACHINE
        # ----------------------------------------------------

        if (
            incident["machine_id"]
            == request["machine_id"]
        ):

            similarity_score += 30

            reasons.append(
                "Same machine"
            )


        # ----------------------------------------------------
        # SAME MACHINE TYPE
        # ----------------------------------------------------

        if (
            incident["machine_type"]
            == machine_type
        ):

            similarity_score += 30

            reasons.append(
                "Same machine type"
            )


        # ----------------------------------------------------
        # SAME FAULT TYPE
        # ----------------------------------------------------

        if (
            incident["fault_type"]
            == request["fault_type"]
        ):

            similarity_score += 40

            reasons.append(
                "Same fault type"
            )


        # ----------------------------------------------------
        # KEEP ONLY RELEVANT INCIDENTS
        # ----------------------------------------------------

        # Minimum similarity required = 60%
        if similarity_score >= 60:

            matches.append({

                "history_id":
                    incident["history_id"],

                "machine_id":
                    incident["machine_id"],

                "machine_type":
                    incident["machine_type"],

                "fault_type":
                    incident["fault_type"],

                "technician_id":
                    incident["technician_id"],

                "resolution_minutes":
                    incident["resolution_minutes"],

                "sla_breached":
                    incident.get(
                        "sla_breached",
                        False
                    ),

                "repeat_failure":
                    incident.get(
                        "repeat_failure",
                        False
                    ),

                "similarity_score":
                    similarity_score,

                "reasons":
                    reasons
            })


    # --------------------------------------------------------
    # 3. RANK MOST SIMILAR FIRST
    # --------------------------------------------------------

    matches.sort(
        key=lambda x: x["similarity_score"],
        reverse=True
    )


    return matches