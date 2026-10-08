from fastapi import APIRouter, Depends, HTTPException

from pydantic import BaseModel

from sqlalchemy.orm import Session

from datetime import datetime

from ..database import get_db

from ..auth import get_current_user
from ..intelligence.service import recommend_for_request

from ..models import (

    ServiceRequest,

    AuditLog,

    Technician,

    Inventory,

    ExceptionRecord,

    Notification

)

class ServiceRequestCreate(BaseModel):

    id: str

    machine_id: str

    site_id: str

    fault_type: str

    description: str

    required_skill: str

    priority: str

    required_parts: str = ""

    sla_minutes: int

router = APIRouter(

    prefix="/service-requests",

    tags=["Service Requests"]

)

# ---------------------------------------------------------

# AUDIT LOG HELPER

# ---------------------------------------------------------

def create_audit_log(

    db,

    service_request_id,

    action,

    old_value=None,

    new_value=None,

    technician_id=None,

    remarks=None

):

    audit = AuditLog(

        service_request_id=service_request_id,

        technician_id=technician_id,

        action=action,

        old_value=old_value,

        new_value=new_value,

        remarks=remarks

    )

    db.add(audit)

# ---------------------------------------------------------

# CREATE SERVICE REQUEST

# ---------------------------------------------------------

@router.post("/")

def create_service_request(

    request: ServiceRequestCreate,

    db: Session = Depends(get_db),

    current_user: dict = Depends(get_current_user)

):

    service_request = ServiceRequest(

        id=request.id,

        machine_id=request.machine_id,

        site_id=request.site_id,

        fault_type=request.fault_type,

        description=request.description,

        required_skill=request.required_skill,

        priority=request.priority,

        status="PENDING_VALIDATION",

        required_parts=request.required_parts,

        sla_minutes=request.sla_minutes

    )

    db.add(service_request)

    create_audit_log(

        db=db,

        service_request_id=service_request.id,

        action="CREATED",

        old_value=None,

        new_value="PENDING_VALIDATION",

        remarks="Service request created"

    )

    db.commit()

    db.refresh(service_request)

    return service_request

# ---------------------------------------------------------

# GET ALL SERVICE REQUESTS

# ---------------------------------------------------------

@router.get("/")

def get_service_requests(

    db: Session = Depends(get_db)

):

    return db.query(ServiceRequest).all()

# ---------------------------------------------------------

# VALIDATE SERVICE REQUEST

# ---------------------------------------------------------

@router.post("/{request_id}/validate")

def validate_service_request(

    request_id: str,

    db: Session = Depends(get_db)

):

    service_request = db.get(ServiceRequest, request_id)

    if service_request is None:

        raise HTTPException(

            status_code=404,

            detail="Service request not found"

        )

    if service_request.status != "PENDING_VALIDATION":

        raise HTTPException(

            status_code=400,

            detail="Service request is not waiting for validation"

        )

    old_status = service_request.status

    service_request.status = "PENDING_APPROVAL"

    create_audit_log(

        db=db,

        service_request_id=service_request.id,

        action="VALIDATED",

        old_value=old_status,

        new_value=service_request.status,

        remarks="Service request validated"

    )

    db.commit()

    db.refresh(service_request)

    return {

        "message": "Service request validated",

        "request_id": service_request.id,

        "status": service_request.status

    }

# ---------------------------------------------------------

# APPROVE SERVICE REQUEST

# ---------------------------------------------------------

@router.post("/{request_id}/approve")

def approve_service_request(
    request_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] != "ADMIN":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    service_request = db.get(ServiceRequest, request_id)

    if service_request is None:

        raise HTTPException(

            status_code=404,

            detail="Service request not found"

        )

    if service_request.status != "PENDING_APPROVAL":

        raise HTTPException(

            status_code=400,

            detail="Service request is not ready for approval"

        )

    old_status = service_request.status

    service_request.status = "APPROVED"

    create_audit_log(

        db=db,

        service_request_id=service_request.id,

        action="APPROVED",

        old_value=old_status,

        new_value=service_request.status,

        remarks="Service request approved"

    )

    db.commit()

    db.refresh(service_request)

    return {

        "message": "Service request approved",

        "request_id": service_request.id,

        "status": service_request.status

    }

# ---------------------------------------------------------

# GET SINGLE SERVICE REQUEST

# ---------------------------------------------------------

@router.get("/{request_id}")

def get_service_request(

    request_id: str,

    db: Session = Depends(get_db)

):

    service_request = db.get(ServiceRequest, request_id)

    if service_request is None:

        raise HTTPException(

            status_code=404,

            detail="Service request not found"

        )

    return service_request

# ---------------------------------------------------------

# ASSIGN TECHNICIAN

# ---------------------------------------------------------

@router.post("/{request_id}/assign/{technician_id}")

def assign_technician(

    request_id: str,

    technician_id: str,

    db: Session = Depends(get_db)

):

    service_request = db.get(ServiceRequest, request_id)

    if service_request is None:

        raise HTTPException(

            status_code=404,

            detail="Service request not found"

        )

    if service_request.status != "APPROVED":

        raise HTTPException(

            status_code=400,

            detail="Service request must be approved before assignment"

        )

    old_status = service_request.status

    old_technician = service_request.assigned_technician_id

    service_request.assigned_technician_id = technician_id

    service_request.status = "ASSIGNED"

    create_audit_log(

        db=db,

        service_request_id=service_request.id,

        action="ASSIGNED",

        old_value=old_status,

        new_value=service_request.status,

        technician_id=technician_id,

        remarks=f"Technician {technician_id} assigned"

    )

    db.commit()

    db.refresh(service_request)

    return {

        "message": "Technician assigned",

        "request_id": service_request.id,

        "technician_id": technician_id,

        "previous_technician_id": old_technician,

        "status": service_request.status

    }

@router.post("/{request_id}/auto-assign")

def auto_assign_technician(
    request_id: str,
    db: Session = Depends(get_db)
):
    service_request = db.get(ServiceRequest, request_id)
    if service_request is None:
        raise HTTPException(status_code=404, detail="Service request not found")
    if service_request.status != "APPROVED":
        raise HTTPException(status_code=400, detail="Service request must be approved before assignment")

    intelligence = recommend_for_request(db, service_request)
    if not intelligence.get("success") or not intelligence.get("recommendation"):
        raise HTTPException(status_code=400, detail=intelligence)

    recommended = intelligence["recommendation"]
    technician_id = recommended["technician_id"]
    old_technician = service_request.assigned_technician_id
    service_request.assigned_technician_id = technician_id
    service_request.status = "ASSIGNED"

    create_audit_log(
        db=db,
        service_request_id=service_request.id,
        action="INTELLIGENCE_AUTO_ASSIGNED",
        old_value="APPROVED",
        new_value="ASSIGNED",
        technician_id=technician_id,
        remarks=(f"Intelligence recommendation: impact={recommended['impact_score']}, "
                 f"predicted_repair={recommended['predicted_repair_time']} min")
    )
    db.commit()
    db.refresh(service_request)

    return {
        "message": "Technician assigned using MaintenaX Intelligence Layer",
        "request_id": service_request.id,
        "technician_id": technician_id,
        "previous_technician_id": old_technician,
        "status": service_request.status,
        "intelligence": intelligence
    }

# ---------------------------------------------------------

# START SERVICE REQUEST

# ---------------------------------------------------------

@router.post("/{request_id}/start")

def start_service_request(

    request_id: str,

    db: Session = Depends(get_db)

):

    service_request = db.get(ServiceRequest, request_id)

    if service_request is None:

        raise HTTPException(

            status_code=404,

            detail="Service request not found"

        )

    if service_request.status != "ASSIGNED":

        raise HTTPException(

            status_code=400,

            detail="Service request must be assigned before starting"

        )

    old_status = service_request.status

    service_request.status = "IN_PROGRESS"

    create_audit_log(

        db=db,

        service_request_id=service_request.id,

        action="STARTED",

        old_value=old_status,

        new_value=service_request.status,

        technician_id=service_request.assigned_technician_id,

        remarks="Service work started"

    )

    db.commit()

    db.refresh(service_request)

    return {

        "message": "Service request started",

        "request_id": service_request.id,

        "status": service_request.status

    }

# ---------------------------------------------------------

# COMPLETE SERVICE REQUEST

# ---------------------------------------------------------

@router.post("/{request_id}/complete")

def complete_service_request(

    request_id: str,

    db: Session = Depends(get_db)

):

    service_request = db.get(ServiceRequest, request_id)

    if service_request is None:

        raise HTTPException(

            status_code=404,

            detail="Service request not found"

        )

    if service_request.status != "IN_PROGRESS":

        raise HTTPException(

            status_code=400,

            detail="Service request must be in progress before completion"

        )

    old_status = service_request.status

    service_request.status = "COMPLETED"

    create_audit_log(

        db=db,

        service_request_id=service_request.id,

        action="COMPLETED",

        old_value=old_status,

        new_value=service_request.status,

        technician_id=service_request.assigned_technician_id,

        remarks="Service work completed"

    )

    db.commit()

    db.refresh(service_request)

    return {

        "message": "Service request completed",

        "request_id": service_request.id,

        "status": service_request.status

    }

# ---------------------------------------------------------

# VERIFY SERVICE REQUEST

# ---------------------------------------------------------

@router.post("/{request_id}/verify")

def verify_service_request(

    request_id: str,

    db: Session = Depends(get_db)

):

    service_request = db.get(ServiceRequest, request_id)

    if service_request is None:

        raise HTTPException(

            status_code=404,

            detail="Service request not found"

        )

    if service_request.status != "COMPLETED":

        raise HTTPException(

            status_code=400,

            detail="Service request must be completed before verification"

        )

    old_status = service_request.status

    service_request.status = "VERIFIED"

    create_audit_log(

        db=db,

        service_request_id=service_request.id,

        action="VERIFIED",

        old_value=old_status,

        new_value=service_request.status,

        technician_id=service_request.assigned_technician_id,

        remarks="Service request verified"

    )

    db.commit()

    db.refresh(service_request)

    return {

        "message": "Service request verified",

        "request_id": service_request.id,

        "status": service_request.status

    }

# ---------------------------------------------------------

# TECHNICIAN MATCHING

# ---------------------------------------------------------

@router.get("/{request_id}/recommend-technicians")

def recommend_technicians(

    request_id: str,

    db: Session = Depends(get_db)

):

    service_request = db.get(ServiceRequest, request_id)

    if service_request is None:

        raise HTTPException(

            status_code=404,

            detail="Service request not found"

        )

    technicians = db.query(Technician).all()

    matching_technicians = []

    for technician in technicians:

        if (

            service_request.required_skill

            and service_request.required_skill.upper()

            in (technician.skills or "").upper()

            ):

            score = 50

            reasons = ["Required skill matches"]

            if technician.availability.upper() == "AVAILABLE":

                score += 30

                reasons.append("Technician is available")

            if technician.site_id == service_request.site_id:

                score += 20

                reasons.append("Same site")

            if technician.active_jobs == 0:

                score += 10

                reasons.append("No active jobs")

            matching_technicians.append({

                "technician_id": technician.id,

                "name": technician.name,

                "skills": technician.skills,

                "site_id": technician.site_id,

                "availability": technician.availability,

                "active_jobs": technician.active_jobs,

                "score": score,

                "reasons": reasons

                })

    matching_technicians.sort(

    key=lambda technician: technician["score"],

    reverse=True

    )

    return {

    "request_id": request_id,

    "required_skill": service_request.required_skill,

    "recommended_technician": (

        {

            "technician_id": matching_technicians[0]["technician_id"],

            "name": matching_technicians[0]["name"],

            "score": matching_technicians[0]["score"],

            "reasons": matching_technicians[0]["reasons"]

        }

        if matching_technicians

        else None

    ),

    "matching_technicians": matching_technicians

}

@router.get("/{request_id}/check-parts")

def check_parts(

    request_id: str,

    db: Session = Depends(get_db)

):

    service_request = db.get(ServiceRequest, request_id)

    if service_request is None:

        raise HTTPException(

            status_code=404,

            detail="Service request not found"

        )

    if not service_request.required_parts:

        return {

            "request_id": request_id,

            "required_parts": None,

            "available": True,

            "message": "No spare parts required"

        }

    parts = [

        part.strip()

        for part in service_request.required_parts.split(",")

    ]

    results = []

    for part_number in parts:

        inventory = db.query(Inventory).filter(

            Inventory.part_number == part_number,

            Inventory.site_id == service_request.site_id

        ).first()

        if inventory is None:

            results.append({

                "part_number": part_number,

                "available": False,

                "quantity": 0

            })

        else:

            results.append({

                "part_number": part_number,

                "available": inventory.quantity > 0,

                "quantity": inventory.quantity

            })

    all_available = all(

        result["available"]

        for result in results

    )

    return {

        "request_id": request_id,

        "site_id": service_request.site_id,

        "available": all_available,

        "parts": results

    }

@router.post("/{request_id}/create-part-exception")

def create_part_exception(

    request_id: str,

    db: Session = Depends(get_db)

):

    service_request = db.get(ServiceRequest, request_id)

    if service_request is None:

        raise HTTPException(

            status_code=404,

            detail="Service request not found"

        )

    if not service_request.required_parts:

        raise HTTPException(

            status_code=400,

            detail="No spare parts required"

        )

    parts = [

        part.strip()

        for part in service_request.required_parts.split(",")

    ]

    unavailable_parts = []

    for part_number in parts:

        inventory = db.query(Inventory).filter(

            Inventory.part_number == part_number,

            Inventory.site_id == service_request.site_id

        ).first()

        if inventory is None or inventory.quantity <= 0:

            unavailable_parts.append(part_number)

    if not unavailable_parts:

        return {

            "request_id": request_id,

            "exception_created": False,

            "message": "All required parts are available"

        }

    exception = ExceptionRecord(

        service_request_id=request_id,

        type="PART_UNAVAILABLE",

        description=f"Unavailable parts: {', '.join(unavailable_parts)}",

        severity="HIGH",

        status="OPEN"

    )

    db.add(exception)

    db.commit()

    db.refresh(exception)

    return {

        "request_id": request_id,

        "exception_created": True,

        "exception_id": exception.id,

        "type": exception.type,

        "severity": exception.severity,

        "status": exception.status,

        "unavailable_parts": unavailable_parts

    }

@router.get("/{request_id}/exceptions")

def get_exceptions(

    request_id: str,

    db: Session = Depends(get_db)

):

    service_request = db.get(ServiceRequest, request_id)

    if service_request is None:

        raise HTTPException(

            status_code=404,

            detail="Service request not found"

        )

    exceptions = db.query(ExceptionRecord).filter(

        ExceptionRecord.service_request_id == request_id

    ).all()

    return {

        "request_id": request_id,

        "exceptions": [

            {

                "id": exception.id,

                "type": exception.type,

                "description": exception.description,

                "severity": exception.severity,

                "status": exception.status,

                "created_at": exception.created_at

            }

            for exception in exceptions

        ]

    }

@router.post("/{request_id}/exceptions/{exception_id}/resolve")

def resolve_exception(

    request_id: str,

    exception_id: int,

    db: Session = Depends(get_db)

):

    exception = db.query(ExceptionRecord).filter(

        ExceptionRecord.id == exception_id,

        ExceptionRecord.service_request_id == request_id

    ).first()

    if exception is None:

        raise HTTPException(

            status_code=404,

            detail="Exception not found"

        )

    if exception.status == "RESOLVED":

        raise HTTPException(

            status_code=400,

            detail="Exception is already resolved"

        )

    exception.status = "RESOLVED"

    exception.resolved_at = datetime.utcnow()

    db.commit()

    db.refresh(exception)

    return {

        "message": "Exception resolved",

        "exception_id": exception.id,

        "request_id": request_id,

        "status": exception.status,

        "resolved_at": exception.resolved_at

    }

@router.post("/{request_id}/reassign")

def reassign_technician(

    request_id: str,

    technician_id: str,

    db: Session = Depends(get_db)

):

    service_request = db.get(ServiceRequest, request_id)

    if service_request is None:

        raise HTTPException(

            status_code=404,

            detail="Service request not found"

        )

    technician = db.get(Technician, technician_id)

    if technician is None:

        raise HTTPException(

            status_code=404,

            detail="Technician not found"

        )

    if technician.availability.upper() != "AVAILABLE":

        raise HTTPException(

            status_code=400,

            detail="Technician is not available"

        )

    if (

        service_request.required_skill

        and service_request.required_skill.upper()

        not in (technician.skills or "").upper()

    ):

        raise HTTPException(

            status_code=400,

            detail="Technician does not have the required skill"

        )

    old_technician_id = service_request.assigned_technician_id

    service_request.assigned_technician_id = technician_id

    service_request.status = "ASSIGNED"

    create_audit_log(

        db=db,

        service_request_id=request_id,

        action="REASSIGNED",

        old_value=old_technician_id,

        new_value=technician_id,

        technician_id=technician_id,

        remarks="Service request reassigned to another qualified technician"

    )

    notification = Notification(

        technician_id=technician_id,

        service_request_id=request_id,

        message=f"You have been assigned service request {request_id}",

        type="ASSIGNMENT"

        )

    db.add(notification)

    db.commit()

    db.refresh(service_request)

    return {

        "message": "Technician reassigned",

        "request_id": request_id,

        "old_technician_id": old_technician_id,

        "new_technician_id": technician_id,

        "status": service_request.status

    }

@router.get("/{request_id}/notifications")

def get_notifications(

    request_id: str,

    db: Session = Depends(get_db)

):

    service_request = db.get(ServiceRequest, request_id)

    if service_request is None:

        raise HTTPException(

            status_code=404,

            detail="Service request not found"

        )

    notifications = db.query(Notification).filter(

        Notification.service_request_id == request_id

    ).all()

    return {

        "request_id": request_id,

        "notifications": [

            {

                "id": notification.id,

                "technician_id": notification.technician_id,

                "message": notification.message,

                "type": notification.type,

                "is_read": notification.is_read,

                "created_at": notification.created_at

            }

            for notification in notifications

        ]

    }

@router.post("/{request_id}/check-sla")

def check_sla(

    request_id: str,

    db: Session = Depends(get_db)

):

    service_request = db.get(ServiceRequest, request_id)

    if service_request is None:

        raise HTTPException(

            status_code=404,

            detail="Service request not found"

        )

    if service_request.sla_minutes is None:

        return {

            "request_id": request_id,

            "sla_risk": False,

            "message": "No SLA defined"

        }

    if service_request.elapsed_minutes >= service_request.sla_minutes:

        exception = ExceptionRecord(

            service_request_id=request_id,

            type="SLA_EXCEEDED",

            description=(

                f"SLA exceeded: {service_request.elapsed_minutes} "

                f"minutes elapsed against {service_request.sla_minutes} minutes"

            ),

            severity="HIGH",

            status="OPEN"

        )

        db.add(exception)

        db.commit()

        db.refresh(exception)

        return {

            "request_id": request_id,

            "sla_risk": True,

            "exception_created": True,

            "exception_id": exception.id,

            "message": "SLA has been exceeded"

        }

    return {

        "request_id": request_id,

        "sla_risk": False,

        "exception_created": False,

        "message": "SLA is currently within limit"

    }

@router.get("/dashboard/summary")

def dashboard_summary(

    db: Session = Depends(get_db)

):

    service_requests = db.query(ServiceRequest).all()

    status_counts = {}

    for service_request in service_requests:

        status = service_request.status

        status_counts[status] = status_counts.get(status, 0) + 1

    open_exceptions = db.query(ExceptionRecord).filter(

        ExceptionRecord.status == "OPEN"

    ).count()

    unread_notifications = db.query(Notification).filter(

        Notification.is_read == False

    ).count()

    return {

        "total_service_requests": len(service_requests),

        "status_counts": status_counts,

        "open_exceptions": open_exceptions,

        "unread_notifications": unread_notifications

    }

@router.get("/technicians/workload")

def technician_workload(

    db: Session = Depends(get_db)

):

    technicians = db.query(Technician).all()

    return {

        "technicians": [

            {

                "technician_id": technician.id,

                "name": technician.name,

                "skills": technician.skills,

                "site_id": technician.site_id,

                "availability": technician.availability,

                "active_jobs": technician.active_jobs,

                "experience_years": technician.experience_years

            }

            for technician in technicians

        ]

    }

@router.get("/inventory/summary")

def inventory_summary(

    db: Session = Depends(get_db)

):

    inventory = db.query(Inventory).all()

    return {

        "inventory": [

            {

                "id": item.id,

                "part_number": item.part_number,

                "name": item.name,

                "site_id": item.site_id,

                "quantity": item.quantity,

                "available": item.quantity > 0

            }

            for item in inventory

        ]

    }

@router.get("/{request_id}/audit")

def get_audit_history(

    request_id: str,

    db: Session = Depends(get_db)

):

    service_request = db.get(ServiceRequest, request_id)

    if service_request is None:

        raise HTTPException(

            status_code=404,

            detail="Service request not found"

        )

    logs = db.query(AuditLog).filter(

        AuditLog.service_request_id == request_id

    ).order_by(

        AuditLog.created_at.asc()

    ).all()

    return {

        "request_id": request_id,

        "audit_history": [

            {

                "id": log.id,

                "action": log.action,

                "old_value": log.old_value,

                "new_value": log.new_value,

                "technician_id": log.technician_id,

                "remarks": log.remarks,

                "created_at": log.created_at

            }

            for log in logs

        ]

    }
