# \# MaintenaX

# 

# \### Smart Maintenance Management Platform

# 

# > A centralized platform for managing industrial maintenance requests, intelligently assigning resources, handling operational exceptions, and maintaining complete service history.

# 

# \*\*Team:\*\* 404:NOT FOUND

# 

# \---

# 

# \## 📌 Overview

# 

# MaintenaX is an industrial maintenance management platform designed to centralize the complete maintenance workflow.

# 

# The platform supports the lifecycle of a maintenance request from:

# 

# \*\*Request Creation → Validation → Technician Recommendation → Assignment → Execution → Verification → Audit History\*\*

# 

# MaintenaX combines technician skills, availability, workload, location, spare-part availability, and SLA constraints to support better maintenance decisions.

# 

# It is designed for:

# 

# \- Operations Managers

# \- Maintenance Supervisors

# \- Maintenance Technicians

# 

# \---

# 

# \## 🚨 Problem Statement

# 

# Industrial maintenance operations are often handled through disconnected tools such as spreadsheets, calls, messages, and manual tracking systems.

# 

# This creates several problems:

# 

# \- Manual creation and tracking of service requests

# \- Difficult technician assignment based on skills and availability

# \- Separate checking of spare parts and tools

# \- Limited visibility into ongoing maintenance work

# \- Manual handling of technician dropouts

# \- Difficulty managing spare-part shortages

# \- SLA risks and delayed responses

# \- Poor centralized service history

# \- Increased manual coordination between teams

# 

# MaintenaX addresses these problems by providing a centralized workflow with intelligent decision support.

# 

# \---

# 

# \## 💡 Solution

# 

# MaintenaX provides a centralized maintenance workflow that connects service requests, technicians, resources, execution, exceptions, and service history.

# 

# The system evaluates multiple operational constraints before recommending or assigning a technician.

# 

# The decision process considers:

# 

# \- Technician skills

# \- Technician availability

# \- Current workload

# \- Technician location

# \- Spare-part availability

# \- Service priority

# \- SLA constraints

# \- Impact on ongoing jobs

# 

# The platform also supports reassignment and recovery when operational conditions change.

# 

# \---

# 

# \## ✨ Key Features

# 

# \### 1. Service Request Management

# 

# Create and manage maintenance requests containing:

# 

# \- Machine details

# \- Fault/problem description

# \- Priority

# \- Location

# \- Required technician skills

# \- Required spare parts

# 

# \### 2. Request Validation

# 

# Maintenance requests are validated before assignment.

# 

# The system checks relevant operational conditions and resource availability before proceeding with assignment.

# 

# \### 3. Intelligent Technician Recommendation

# 

# MaintenaX evaluates available technicians and generates/ranks possible assignment strategies.

# 

# Recommendations consider:

# 

# \- Skills

# \- Availability

# \- Workload

# \- Location

# \- Resources

# \- SLA impact

# 

# \### 4. Technician Assignment \& Reassignment

# 

# The platform supports assigning technicians to maintenance requests and changing assignments when operational conditions change.

# 

# \### 5. Resource Management

# 

# The system tracks resources required for maintenance activities, including spare parts and tools.

# 

# \### 6. Operational Exception Handling

# 

# MaintenaX is designed to handle situations such as:

# 

# \- Technician unavailability

# \- Spare-part shortages

# \- SLA risks

# \- Assignment conflicts

# \- Operational changes

# 

# \### 7. Recovery Engine

# 

# When conditions change, the system can support recovery and reassignment rather than treating the original assignment as permanent.

# 

# \### 8. Maintenance Tracking

# 

# Track maintenance progress through different stages of the service lifecycle.

# 

# \### 9. Completion \& Verification

# 

# Completed maintenance work can be verified before the service request is closed.

# 

# \### 10. Dashboard \& Visibility

# 

# Provides centralized visibility into maintenance activities and operational status.

# 

# \### 11. Audit History

# 

# Maintains service history and operational records for better traceability.

# 

# \---

# 

# \## 🧠 Intelligence \& Decision Engine

# 

# One of the core components of MaintenaX is its intelligence layer.

# 

# Instead of selecting a technician using a single condition, the system considers multiple constraints together.

# 

# \### Multi-Strategy Decision Making

# 

# The system can evaluate multiple possible assignment strategies and rank them based on operational conditions.

# 

# \### Ripple Simulation

# 

# Potential effects of an assignment on other ongoing work can be considered before making a decision.

# 

# \### Context-Aware Matching

# 

# Technician recommendations consider the context of the maintenance request, including skills, availability, workload, location, resources, and SLA requirements.

# 

# \### Recovery Engine

# 

# If a technician becomes unavailable or a resource becomes unavailable, the system supports reassignment and recovery.

# 

# \### Decision Memory

# 

# Previous operational decisions and service history can be used to improve visibility and support future decision-making.

# 

# \---

# 

# \## 🔄 Maintenance Workflow

# 

# ```text

# Service Request

# &#x20;      ↓

# Request Validation

# &#x20;      ↓

# Check Technician \& Resource Availability

# &#x20;      ↓

# Generate Assignment Strategies

# &#x20;      ↓

# Evaluate Skills / Workload / Location / Resources / SLA

# &#x20;      ↓

# Recommend or Assign Technician

# &#x20;      ↓

# Maintenance Execution

# &#x20;      ↓

# Live Status Tracking

# &#x20;      ↓

# Exception / Recovery if Required

# &#x20;      ↓

# Completion

# &#x20;      ↓

# Verification

# &#x20;      ↓

# Audit History

# 

# 🏗️ System Architecture

# ┌──────────────────────────┐

# │     User / Frontend      │

# │      React + Vite        │

# └────────────┬─────────────┘

# &#x20;            │

# &#x20;            ▼

# ┌──────────────────────────┐

# │     FastAPI Backend      │

# │       REST APIs          │

# └────────────┬─────────────┘

# &#x20;            │

# &#x20;            ▼

# ┌──────────────────────────┐

# │ Database \& Operational   │

# │         State            │

# └────────────┬─────────────┘

# &#x20;            │

# &#x20;            ▼

# ┌──────────────────────────┐

# │ Workflow + Intelligence  │

# │         Engine           │

# └────────────┬─────────────┘

# &#x20;            │

# &#x20;            ▼

# ┌──────────────────────────┐

# │ Technician \& Resource    │

# │     Recommendation       │

# └────────────┬─────────────┘

# &#x20;            │

# &#x20;            ▼

# ┌──────────────────────────┐

# │ Assignment \& Live        │

# │       Operation          │

# └────────────┬─────────────┘

# &#x20;            │

# &#x20;            ▼

# ┌──────────────────────────┐

# │ Exception / Recovery     │

# └────────────┬─────────────┘

# &#x20;            │

# &#x20;            ▼

# ┌──────────────────────────┐

# │ Completion \& Verification│

# └──────────────────────────┘

# 

# 🛠️ Tech Stack

# Frontend

# \- React

# \- Vite

# \- Tailwind CSS

# \- Axios

# \- Supabase Auth

# \- Google OAuth

# \- Lucide React

# Backend

# \- Python

# \- FastAPI

# \- SQLAlchemy

# \- Pydantic

# \- Uvicorn

# \- JWT authentication

# Database

# \- SQLite for the MVP

# \- PostgreSQL planned for production deployment

# Authentication

# \- Supabase Authentication

# \- Google OAuth

# 🔐 Authentication

# MaintenaX uses Supabase Authentication for the frontend authentication flow.

# Google authentication is supported through Supabase's Google OAuth provider.

# Required Environment Variables

# Create a .env file inside:

# maintenance-frontend/

# 

# Add:

# VITE\_SUPABASE\_URL=your\_supabase\_url

# VITE\_SUPABASE\_PUBLISHABLE\_KEY=your\_supabase\_publishable\_key

# 

# These values must come from your Supabase project.

# Google OAuth Setup

# To use Google login:

# 1\. Create or configure a Supabase project.

# 2\. Enable the Google authentication provider.

# 3\. Configure the required Google OAuth credentials.

# 4\. Configure the appropriate redirect settings in Supabase.

# 5\. Add the Supabase URL and publishable key to the frontend .env file.

# Important: Never commit .env or any secret credentials to GitHub.

# 

# 🚀 Getting Started

# Prerequisites

# Make sure the following are installed:

# \- Git

# \- Python 3.x

# \- Node.js

# \- npm

# 📁 Project Structure

# MaintenaX/

# │

# ├── backend/

# │   ├── app/

# │   ├── hackathon\_seed\_data.json

# │   ├── requirements.txt

# │   ├── README.md

# │   └── INTEGRATION.md

# │

# ├── maintenance-frontend/

# │   ├── public/

# │   ├── src/

# │   ├── package.json

# │   ├── package-lock.json

# │   ├── vite.config.js

# │   └── README.md

# │

# ├── .gitignore

# └── README.md

# 

# ⚙️ Backend Setup

# Open a terminal in the project root.

# Navigate to the backend:

# cd backend

# 

# Create a Python virtual environment:

# python -m venv venv

# 

# Activate the virtual environment on Windows PowerShell:

# .\\venv\\Scripts\\Activate.ps1

# 

# Install backend dependencies:

# pip install -r requirements.txt

# 

# Start the FastAPI server:

# uvicorn app.main:app --reload

# 

# The backend will normally be available at:

# http://127.0.0.1:8000

# 

# FastAPI API documentation is available at:

# http://127.0.0.1:8000/docs

# 

# 💻 Frontend Setup

# Open another terminal in the project root.

# Navigate to the frontend:

# cd maintenance-frontend

# 

# Install dependencies:

# npm install

# 

# Make sure the required .env file is present:

# maintenance-frontend/.env

# 

# Then start the development server:

# npm run dev

# 

# Vite will display the local development URL in the terminal, normally similar to:

# http://localhost:5173

# 

# ▶️ Running the Full Application

# MaintenaX requires both the backend and frontend development servers.

# Terminal 1 — Backend

# cd backend

# .\\venv\\Scripts\\Activate.ps1

# uvicorn app.main:app --reload

# 

# Terminal 2 — Frontend

# cd maintenance-frontend

# npm run dev

# 

# Then open the frontend URL provided by Vite.

# 🧪 Validation \& Testing

# The project can be validated using:

# \- Functional API testing

# \- Mock-data workflow testing

# \- End-to-end service lifecycle testing

# \- Frontend authentication testing

# \- Maintenance request workflow testing

# \- Technician assignment and reassignment testing

# \- Exception and recovery workflow testing

# 📊 Project Scope

# Included

# \- Core service request lifecycle

# \- Technician management

# \- Resource management

# \- Request validation and approval

# \- Technician recommendation

# \- Technician assignment

# \- Technician reassignment

# \- Maintenance status tracking

# \- Completion and verification

# \- Dashboard

# \- Audit history

# \- Exception and recovery workflows

# Currently Out of Scope

# \- Real IoT integration

# \- Predictive maintenance

# \- Advanced AI/ML model training

# \- Production-scale deployment

# \- Dedicated mobile application

# \- External enterprise integrations

# \- Large-scale stress testing

# 🔮 Future Scope

# After the hackathon, MaintenaX can be expanded with:

# \- A more complete intelligence engine

# \- Real-time notifications

# \- Advanced analytics

# \- Production PostgreSQL deployment

# \- Cloud deployment

# \- Improved security and monitoring

# \- Automated backups

# \- Scalable APIs

# \- IoT integration

# \- Predictive maintenance

# \- Mobile applications

# \- Enterprise system integrations

# ⚠️ Risks \& Fallbacks

# MaintenaX considers several operational risks.

# Technician Unavailability

# Risk: Assigned technician becomes unavailable.

# Fallback: Manual reassignment or recovery workflow.

# Spare-Part Shortage

# Risk: Required spare part is unavailable.

# Fallback: Exception handling and alternative assignment/recovery.

# API Failure

# Risk: Backend/API becomes temporarily unavailable.

# Fallback: Manual operational updates and exception logging.

# Incorrect Recommendation

# Risk: Recommended technician may not be suitable.

# Fallback: Manual assignment or reassignment by the supervisor.

# 💰 Running Cost

# The current prototype is designed to run locally using:

# \- React

# \- Vite

# \- FastAPI

# \- SQLite

# No mandatory cloud infrastructure or paid API service is required for the basic local prototype.

# Estimated Round 1 running cost:

# ₹0

# Cloud hosting and production infrastructure can be introduced in later stages.

# 📈 Expected Impact

# MaintenaX aims to reduce manual coordination effort by centralizing maintenance workflows and supporting intelligent technician/resource assignment.

# A 30% reduction in manual coordination effort is a project target estimate, not a validated production result. It would need to be measured through real operational usage and comparison against existing maintenance processes.

# 💡 Why MaintenaX?

# Maintenance operations frequently depend on spreadsheets, separate systems, phone calls, and manual coordination.

# MaintenaX brings these workflows together into one platform.

# Instead of simply asking:

# "Which technician is available?"

# 

# MaintenaX considers the larger operational context:

# \- Who has the required skills?

# \- Who is available?

# \- Who has the lowest workload?

# \- Who is closest to the job?

# \- Are the required resources available?

# \- What is the SLA impact?

# \- How will this assignment affect other ongoing work?

# \- What should happen if the situation changes?

# This makes MaintenaX more than a maintenance tracking application — it acts as a decision-support platform for maintenance operations.

# 👥 Team

# 404:NOT FOUND

# Member	ID

# Sonhita Ghose	26BEC1406

# Kinjal Sarkar	26BCE1313

# Aishani Basu	26BCE1366

# Shourya Kumar Gupta	26BCE1304

# 

# 

# 📚 References

# The project research and design were informed by work related to:

# \- Maintenance management technology implementation

# \- Maintenance capacity planning

# \- Spare-parts management

# \- Scheduling

# \- Competence-based maintenance planning

# 📄 License

# This project was developed as a hackathon project by Team 404:NOT FOUND.

# 

