import json

from .database import (
    SessionLocal,
    Base,
    engine
)

from .models import (
    Site,
    Machine,
    Technician,
    Inventory,
    ServiceRequest,
    ServiceHistory,
    Assignment
)


def seed_database():

    # ========================================================
    # 1. CREATE DATABASE TABLES
    # ========================================================

    print("Creating database tables...")

    Base.metadata.create_all(bind=engine)

    print("Database tables created successfully.")


    # ========================================================
    # 2. START DATABASE SESSION
    # ========================================================

    db = SessionLocal()

    try:

        # ====================================================
        # 3. LOAD SEED DATA
        # ====================================================

        with open(
            "hackathon_seed_data.json",
            "r",
            encoding="utf-8"
        ) as file:
            data = json.load(file)


        # ====================================================
        # 4. INSERT SITES
        # ====================================================

        for item in data["sites"]:

            existing_site = db.get(
                Site,
                item["site_id"]
            )

            if existing_site is None:

                site = Site(
                    id=item["site_id"],
                    name=item["name"],
                    location=item["location"],
                    latitude=str(item["latitude"]),
                    longitude=str(item["longitude"]),
                )

                db.add(site)

        # Commit sites first because other tables reference them
        db.commit()

        print("Sites inserted.")


        # ====================================================
        # 5. INSERT MACHINES
        # ====================================================

        for item in data["machines"]:

            existing_machine = db.get(
                Machine,
                item["machine_id"]
            )

            if existing_machine is None:

                machine = Machine(
                    id=item["machine_id"],
                    machine_type=item["machine_type"],
                    site_id=item["site_id"],
                    status=item["status"],
                    criticality=item["criticality"],
                )

                db.add(machine)

        db.commit()

        print("Machines inserted.")


        # ====================================================
        # 6. INSERT TECHNICIANS
        # ====================================================

        for item in data["technicians"]:

            existing_technician = db.get(
                Technician,
                item["technician_id"]
            )

            if existing_technician is None:

                technician = Technician(
                    id=item["technician_id"],
                    name=item["name"],
                    skills=",".join(item["skills"]),
                    site_id=item["site_id"],
                    availability=item["availability"],
                    active_jobs=item["active_jobs"],
                    experience_years=item["experience_years"],
                )

                db.add(technician)

        db.commit()

        print("Technicians inserted.")


        # ====================================================
        # 7. INSERT INVENTORY
        # ====================================================

        for item in data["inventory"]:

            existing_inventory = (
                db.query(Inventory)
                .filter(
                    Inventory.part_number
                    == item["part_id"],

                    Inventory.site_id
                    == item["site_id"],
                )
                .first()
            )

            if existing_inventory is None:

                inventory = Inventory(
                    part_number=item["part_id"],
                    name=item["part_name"],
                    site_id=item["site_id"],
                    quantity=item["available_quantity"],
                )

                db.add(inventory)

        db.commit()

        print("Inventory inserted.")


        # ====================================================
        # 8. INSERT SERVICE REQUESTS
        # ====================================================

        for item in data["service_requests"]:

            existing_request = db.get(
                ServiceRequest,
                item["request_id"]
            )

            if existing_request is None:

                service_request = ServiceRequest(
                    id=item["request_id"],
                    machine_id=item["machine_id"],
                    site_id=item["site_id"],
                    fault_type=item["fault_type"],
                    description=item["description"],
                    required_skill=item["required_skill"],
                    priority=item["priority"],
                    status=item["status"],
                    required_parts=",".join(
                        item["required_parts"]
                    ),
                    sla_minutes=item["sla_minutes"],
                    elapsed_minutes=item["elapsed_minutes"],
                    assigned_technician_id=item.get(
                        "assigned_technician"
                    ),
                )

                db.add(service_request)

        db.commit()

        print("Service requests inserted.")


        # ====================================================
        # 9. INSERT SERVICE HISTORY
        # ====================================================

        for item in data["service_history"]:

            existing_history = db.get(
                ServiceHistory,
                item["history_id"]
            )

            if existing_history is None:

                history = ServiceHistory(
                    id=item["history_id"],
                    machine_id=item["machine_id"],
                    fault_type=item["fault_type"],
                    technician_id=item["technician_id"],
                    duration_minutes=item[
                        "resolution_minutes"
                    ],
                    sla_breach=item["sla_breached"],
                    repeat_failure=item[
                        "repeat_failure"
                    ],
                )

                db.add(history)

        db.commit()

        print("Service history inserted.")


        # ====================================================
        # 10. INSERT ACTIVE ASSIGNMENTS
        # ====================================================

        for item in data["active_assignments"]:

            existing_assignment = db.get(
                Assignment,
                item["assignment_id"]
            )

            if existing_assignment is None:

                assignment = Assignment(
                    id=item["assignment_id"],
                    service_request_id=item[
                        "request_id"
                    ],
                    technician_id=item[
                        "technician_id"
                    ],
                    estimated_remaining_minutes=item[
                        "estimated_remaining_minutes"
                    ],
                )

                db.add(assignment)

        db.commit()

        print("Active assignments inserted.")


        # ====================================================
        # COMPLETE
        # ====================================================

        print("\n======================================")
        print(" MaintenaX DATABASE SEEDED SUCCESSFULLY")
        print("======================================")


    except Exception as error:

        # Undo incomplete transaction if something fails
        db.rollback()

        print("\nDatabase seeding failed:")
        print(error)

        raise


    finally:

        # Always close database connection
        db.close()


# ============================================================
# RUN SEED SCRIPT
# ============================================================

if __name__ == "__main__":
    seed_database()