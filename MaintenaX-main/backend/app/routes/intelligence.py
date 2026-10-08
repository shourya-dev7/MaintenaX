from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import ServiceRequest
from ..intelligence.service import recommend_for_request, recover_for_request

router = APIRouter(prefix="/intelligence", tags=["Intelligence"])


@router.get("/{request_id}/recommend")
def recommend(request_id: str, db: Session = Depends(get_db)):
    service_request = db.get(ServiceRequest, request_id)
    if service_request is None:
        raise HTTPException(status_code=404, detail="Service request not found")
    result = recommend_for_request(db, service_request)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result)
    return result


@router.get("/{request_id}/recover/{failed_technician_id}")
def recover(request_id: str, failed_technician_id: str, db: Session = Depends(get_db)):
    service_request = db.get(ServiceRequest, request_id)
    if service_request is None:
        raise HTTPException(status_code=404, detail="Service request not found")
    result = recover_for_request(db, service_request, failed_technician_id)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result)
    return result
