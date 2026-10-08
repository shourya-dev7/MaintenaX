"""Adapter between SQLAlchemy backend state and Member 3 intelligence engine."""
from ..models import Machine, Technician, Inventory, ServiceRequest, ServiceHistory, Assignment
from .validation import validate_request
from .memory import find_similar_incidents
from .compatibility import calculate_compatibility
from .ml_predictor import train_repair_time_model
from .ripple import generate_strategies, rank_strategies
from .recovery import recover_from_technician_dropout


def _csv(value):
    if not value:
        return []
    return [x.strip() for x in value.split(",") if x.strip()]


def build_engine_data(db):
    machines = db.query(Machine).all()
    machine_by_id = {m.id: m for m in machines}

    return {
        "machines": [
            {"machine_id": m.id, "machine_type": m.machine_type, "site_id": m.site_id,
             "status": m.status, "criticality": m.criticality}
            for m in machines
        ],
        "technicians": [
            {"technician_id": t.id, "name": t.name, "skills": _csv(t.skills),
             "site_id": t.site_id, "availability": t.availability,
             "active_jobs": t.active_jobs or 0, "experience_years": t.experience_years or 0}
            for t in db.query(Technician).all()
        ],
        "inventory": [
            {"part_id": i.part_number, "part_name": i.name, "site_id": i.site_id,
             "available_quantity": i.quantity or 0}
            for i in db.query(Inventory).all()
        ],
        "service_requests": [
            {"request_id": r.id, "machine_id": r.machine_id, "site_id": r.site_id,
             "fault_type": r.fault_type, "description": r.description or "",
             "required_skill": r.required_skill or "", "required_parts": _csv(r.required_parts),
             "priority": r.priority, "sla_minutes": r.sla_minutes or 0,
             "elapsed_minutes": r.elapsed_minutes or 0, "status": r.status,
             "assigned_technician": r.assigned_technician_id}
            for r in db.query(ServiceRequest).all()
        ],
        "service_history": [
            {"history_id": h.id, "machine_id": h.machine_id,
             "machine_type": machine_by_id[h.machine_id].machine_type if h.machine_id in machine_by_id else "UNKNOWN",
             "fault_type": h.fault_type, "technician_id": h.technician_id,
             "resolution_minutes": h.duration_minutes, "sla_breached": bool(h.sla_breach),
             "repeat_failure": bool(h.repeat_failure)}
            for h in db.query(ServiceHistory).all()
        ],
        "active_assignments": [
            {"assignment_id": a.id, "request_id": a.service_request_id,
             "technician_id": a.technician_id,
             "estimated_remaining_minutes": a.estimated_remaining_minutes}
            for a in db.query(Assignment).all()
        ],
        "exceptions": [],
        "decision_memory": [],
    }


def request_dict(service_request):
    return {
        "request_id": service_request.id,
        "machine_id": service_request.machine_id,
        "site_id": service_request.site_id,
        "fault_type": service_request.fault_type,
        "description": service_request.description or "",
        "required_skill": service_request.required_skill or "",
        "required_parts": _csv(service_request.required_parts),
        "priority": service_request.priority,
        "sla_minutes": service_request.sla_minutes or 0,
        "elapsed_minutes": service_request.elapsed_minutes or 0,
        "status": service_request.status,
        "assigned_technician": service_request.assigned_technician_id,
    }


def recommend_for_request(db, service_request):
    data = build_engine_data(db)
    request = request_dict(service_request)
    validation = validate_request(request, data)
    if not validation["valid"]:
        return {"success": False, "validation": validation, "request_id": service_request.id}

    memory = find_similar_incidents(request, data)
    compatibility = calculate_compatibility(request, data)
    if not compatibility:
        return {"success": False, "validation": validation, "request_id": service_request.id,
                "reason": "No compatible technicians available"}

    model = train_repair_time_model(data) if data["service_history"] else None
    strategies = generate_strategies(request, compatibility, data)
    ranked = rank_strategies(strategies, request, data, model)
    return {
        "success": bool(ranked), "request_id": service_request.id, "validation": validation,
        "similar_incidents": memory[:5], "recommendation": ranked[0] if ranked else None,
        "alternatives": ranked[1:] if ranked else []
    }


def recover_for_request(db, service_request, failed_technician_id):
    data = build_engine_data(db)
    request = request_dict(service_request)
    model = train_repair_time_model(data) if data["service_history"] else None
    return recover_from_technician_dropout(request, failed_technician_id, data, model)
