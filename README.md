# MaintenaX

### Smart Maintenance Management & Decision Support Platform

> MaintenaX is an industrial maintenance management platform that centralizes service requests, technician assignment, resource management, operational recovery, and maintenance history — with an intelligence layer for context-aware decision support.

---

## Overview

Industrial maintenance operations often depend on spreadsheets, calls, messages, and disconnected systems. This makes it difficult to coordinate technicians, track resources, manage service requests, and respond quickly when operational conditions change.

**MaintenaX** brings these workflows into a single platform.

The system supports the complete maintenance lifecycle:

**Request Creation → Validation → Recommendation → Assignment → Execution → Recovery → Completion → Verification → Audit History**

MaintenaX evaluates operational context such as:

- Technician skills
- Technician availability
- Current workload
- Technician location
- Spare-part availability
- Service priority
- SLA constraints
- Impact on ongoing work
- Historical service information

The goal is not simply to identify an available technician, but to support better maintenance decisions by considering the broader operational impact of each assignment.

---

## Key Capabilities

### Service Request Management

Create and manage maintenance requests containing:

- Machine information
- Fault description
- Priority
- Site/location
- Required technician skills
- Required spare parts

### Request Validation

Before assignment, the system evaluates relevant operational conditions and resource availability.

### Intelligent Technician Recommendation

MaintenaX evaluates available technicians and ranks potential assignment strategies using multiple operational factors.

The recommendation process considers:

- Skill compatibility
- Availability
- Workload
- Location
- Resources
- SLA impact
- Historical context

### Technician Assignment & Reassignment

Supervisors can assign technicians to maintenance requests and reassign work when operational conditions change.

### Resource Management

The platform tracks maintenance resources including spare parts and tools.

### Operational Exception Handling

The system is designed to handle scenarios such as:

- Technician unavailability
- Spare-part shortages
- SLA risks
- Assignment conflicts
- Changing operational conditions

### Recovery Engine

When an assigned technician or resource becomes unavailable, MaintenaX can evaluate alternative options and support recovery and reassignment.

### Maintenance Tracking

Track maintenance requests through different stages of the service lifecycle.

### Completion & Verification

Completed maintenance work can be verified before a service request is closed.

### Dashboard & Visibility

Provides centralized visibility into maintenance activities and operational status.

### Audit History

Maintains service history and operational records to improve traceability.

---

## Intelligence & Decision Engine

One of the core components of MaintenaX is its intelligence layer.

Instead of making an assignment based on a single condition such as technician availability, the system evaluates multiple constraints together.

### Multi-Strategy Decision Making

The system can generate multiple possible assignment strategies and rank them based on operational conditions.

### Context-Aware Matching

Technician recommendations consider the context of the maintenance request, including:

- Skills
- Availability
- Workload
- Location
- Resources
- SLA requirements

### ML-Based Repair-Time Prediction

The intelligence layer includes a machine-learning based repair-time predictor that uses historical service information to estimate expected resolution time.

### Ripple-Effect Simulation

Potential effects of an assignment on other ongoing maintenance work can be evaluated before making a decision.

This helps identify assignments that may appear suitable locally but create additional operational impact elsewhere.

### SLA Risk Analysis

Assignment strategies can be evaluated for their potential impact on service-level commitments.

### Recovery & Reassignment

If operational conditions change, the system can recompute alternatives rather than treating the original assignment as permanent.

### Counterfactual Decision Analysis

The system can compare a selected strategy with alternative strategies to evaluate decision quality and potential regret.

### Decision Memory

Previous operational decisions and service history can be retained to provide additional context for future decisions.

---

## Maintenance Workflow

```text
Service Request
       │
       ▼
Request Validation
       │
       ▼
Check Technician & Resource Availability
       │
       ▼
Generate Assignment Strategies
       │
       ▼
Evaluate Skills / Workload / Location /
Resources / SLA Impact
       │
       ▼
Recommend / Assign Technician
       │
       ▼
Maintenance Execution
       │
       ▼
Live Status Tracking
       │
       ▼
Exception / Recovery if Required
       │
       ▼
Completion
       │
       ▼
Verification
       │
       ▼
Audit History
```

## System Architecture
┌──────────────────────────────┐
│        User / Frontend       │
│          React + Vite        │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       FastAPI Backend        │
│          REST APIs           │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Database & Operational State │
│            SQLite            │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  Workflow + Intelligence     │
│           Engine             │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Technician & Resource        │
│       Recommendation         │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Assignment & Live Operations │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Exception & Recovery Engine  │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Completion & Verification    │
└──────────────────────────────┘

```

## Technology Stack
Frontend
- React
- Vite
- Tailwind CSS
- Axios
- Supabase Authentication
- Google OAuth
- Lucide React
Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn
- JWT-based authentication
Intelligence Layer
- Python
- Scikit-learn
- Random Forest regression
- Rule-based compatibility and validation
- Ripple-effect simulation
- SLA/resource risk analysis
- Recovery and reassignment logic
- Counterfactual analysis
- Decision memory
Database
- SQLite for the current MVP
- PostgreSQL planned for production deployment
Authentication
- Supabase Authentication
- Google OAuth
## Project Structure
MaintenaX/
│
├── backend/
│   ├── app/
│   │   ├── intelligence/
│   │   │   ├── compatibility.py
│   │   │   ├── counterfactual.py
│   │   │   ├── memory.py
│   │   │   ├── ml_predictor.py
│   │   │   ├── recovery.py
│   │   │   ├── ripple.py
│   │   │   └── validation.py
│   │   │
│   │   ├── routes/
│   │   ├── database.py
│   │   ├── models.py
│   │   └── main.py
│   │
│   ├── hackathon_seed_data.json
│   ├── requirements.txt
│   ├── README.md
│   └── INTEGRATION.md
│
├── maintenance-frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── integration/
│   │   ├── pages/
│   │   ├── api/
│   │   └── lib/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── docs/
├── .gitignore
└── README.md

## Getting Started
Prerequisites
Make sure the following are installed:
- Git
- Python 3.x
- Node.js
- npm
1. Clone the Repository
git clone <repository-url>
cd MaintenaX-main

If you downloaded the project as a ZIP, extract it and open a terminal inside the project directory.
2. Configure Authentication
MaintenaX uses Supabase Authentication for the frontend authentication flow.
Google Sign-In is supported through Supabase's Google OAuth provider.
Create the following file:
maintenance-frontend/.env

Add:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

These values must come from your Supabase project.
Google OAuth Configuration
To enable Google Sign-In:
1. Create or configure a Supabase project.
2. Enable the Google authentication provider.
3. Configure the required Google OAuth credentials.
4. Configure the appropriate redirect URLs in Supabase.
5. Add the Supabase URL and publishable key to maintenance-frontend/.env.
Security: Never commit .env files or secret credentials to GitHub.
3. Backend Setup
Open a terminal in the project directory.
cd backend

Create a virtual environment:
python -m venv venv

Activate the environment on Windows PowerShell:
.\venv\Scripts\Activate.ps1

Install dependencies:
python -m pip install -r requirements.txt

Seed the database:
python -m app.seed

The seed process populates the development database with:
- Sites
- Machines
- Technicians
- Inventory
- Service Requests
- Service History
- Active Assignments
Start the backend:
python -m uvicorn app.main:app --reload

The backend will normally be available at:
http://127.0.0.1:8000

FastAPI API documentation:
http://127.0.0.1:8000/docs

4. Frontend Setup
Open a second terminal.
cd maintenance-frontend

Install dependencies:
npm install

Start the development server:
npm run dev

Vite will display the local development URL.
Typically:
http://localhost:5173

## Future Roadmap
Potential extensions include:
- Real-time notifications
- Advanced operational analytics
- Production PostgreSQL deployment
- Cloud deployment
- Improved security and monitoring
- Automated backups
- Scalable APIs
- IoT integration
- Predictive maintenance
- Mobile applications
- Enterprise system integrations
- More advanced intelligence models
## MaintenaX Decision Support Approach
MaintenaX takes a broader approach.
The platform considers:
- Who has the required skills?
- Who is available?
- Who has the appropriate workload?
- Who is closest to the job?
- Are required resources available?
- What is the SLA impact?
- How will this assignment affect other ongoing work?
- What happens if the assigned technician becomes unavailable?
This turns MaintenaX from a basic maintenance tracking application into a maintenance decision-support platform.
## Team
Team 404:NOT FOUND
Member	ID
Sonhita Ghose	26BEC1406
Kinjal Sarkar	26BCE1313
Aishani Basu	26BCE1366
Shourya Kumar Gupta	26BCE1304


## License
This project was developed as a hackathon project by Team 404:NOT FOUND.
```
