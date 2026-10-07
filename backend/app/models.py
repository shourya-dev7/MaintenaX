from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text
from datetime import datetime

from .database import Base


class Site(Base):
    __tablename__ = "sites"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    latitude = Column(String, nullable=True)
    longitude = Column(String, nullable=True)


class Machine(Base):
    __tablename__ = "machines"

    id = Column(String, primary_key=True)
    machine_type = Column(String, nullable=False)
    site_id = Column(String, nullable=False)
    status = Column(String, nullable=False)
    criticality = Column(Integer, nullable=False)


class Technician(Base):
    __tablename__ = "technicians"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    skills = Column(String, nullable=True)
    site_id = Column(String, nullable=False)
    availability = Column(String, nullable=False)
    active_jobs = Column(Integer, default=0)
    experience_years = Column(Integer, default=0)


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, autoincrement=True)
    part_number = Column(String, nullable=False)
    name = Column(String, nullable=False)
    site_id = Column(String, nullable=False)
    quantity = Column(Integer, default=0)


class ServiceRequest(Base):
    __tablename__ = "service_requests"

    id = Column(String, primary_key=True)
    machine_id = Column(String, nullable=False)
    site_id = Column(String, nullable=False)

    fault_type = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    required_skill = Column(String, nullable=True)

    priority = Column(String, nullable=False)
    status = Column(String, nullable=False)

    required_parts = Column(String, nullable=True)

    sla_minutes = Column(Integer, nullable=True)
    elapsed_minutes = Column(Integer, default=0)

    assigned_technician_id = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )


class ServiceHistory(Base):
    __tablename__ = "service_history"

    id = Column(String, primary_key=True)
    machine_id = Column(String, nullable=False)
    fault_type = Column(String, nullable=False)
    technician_id = Column(String, nullable=False)

    duration_minutes = Column(Integer, nullable=False)
    sla_breach = Column(Boolean, default=False)
    repeat_failure = Column(Boolean, default=False)


class Assignment(Base):
    __tablename__ = "active_assignments"

    id = Column(String, primary_key=True)
    service_request_id = Column(String, nullable=False)
    technician_id = Column(String, nullable=False)
    estimated_remaining_minutes = Column(Integer, nullable=True)


class ExceptionRecord(Base):
    __tablename__ = "exceptions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    service_request_id = Column(String, nullable=False)

    type = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    severity = Column(String, default="MEDIUM")
    status = Column(String, default="OPEN")

    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    technician_id = Column(String, nullable=True)
    service_request_id = Column(String, nullable=True)

    message = Column(Text, nullable=False)
    type = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    service_request_id = Column(String, nullable=True)
    technician_id = Column(String, nullable=True)

    action = Column(String, nullable=False)
    old_value = Column(Text, nullable=True)
    new_value = Column(Text, nullable=True)
    remarks = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False, default="USER")