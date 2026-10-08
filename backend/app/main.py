from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine, SessionLocal
from . import models
from .routes import service_requests, auth, intelligence

app = FastAPI(
    title="MaintenaX API",
    description="Industrial Equipment Service Management Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(service_requests.router)
app.include_router(auth.router)
app.include_router(intelligence.router)
# Create database tables
Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {
        "message": "Welcome to MaintenaX Backend",
        "status": "running"
    }
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "MaintenaX Backend"
    }
@app.get("/db-test")
def db_test():
    db = SessionLocal()

    count = db.query(models.ServiceRequest).count()

    db.close()

    return {
        "database": "connected",
        "service_requests": count
    }