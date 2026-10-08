# MaintenaX Backend + Intelligence Layer

The Member 3 intelligence engine is integrated directly into the FastAPI backend.

## Run

```bash
pip install -r requirements.txt
python -m app.seed
uvicorn app.main:app --reload
```

Open Swagger at `http://127.0.0.1:8000/docs`.

## Intelligence endpoints

- `GET /intelligence/{request_id}/recommend` — validates the request, retrieves similar incidents, calculates technician compatibility, predicts repair time with Random Forest, runs ripple simulation, and returns the lowest-impact recommendation plus alternatives.
- `GET /intelligence/{request_id}/recover/{failed_technician_id}` — simulates technician dropout and returns the ML-enhanced lowest-ripple replacement.
- `POST /service-requests/{request_id}/auto-assign` — now uses the intelligence recommendation and persists the selected technician in the backend database.

The database remains the source of truth. The intelligence adapter converts SQLAlchemy records to the Member 3 engine's existing data contract, so the decision code stays modular.
