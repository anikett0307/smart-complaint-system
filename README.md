http://localhost:5174# Smart Complaint System

Production-ready sample project: web app to submit and track public complaints with AI-based priority scoring.

See subfolders: `backend/`, `frontend/`, `ai/`.

## 🤖 How AI Priority Scoring Works

The system uses **keyword-based heuristics** in the AI microservice (`ai/app.py`) to automatically assign priority levels. When a complaint is submitted, the AI analyzes the title and description text:

### Priority Calculation

**HIGH Priority (Score ≥ 3):**
- Keywords: `collapse`, `flood`, `fire`, `accident`, `electrocute`, `danger`, `critical`, `emergency`, `injury`, `bleeding`, etc.
- Examples:
  - "**Fire in building** near market square - needs immediate response"
  - "**Accident with injuries** on Main Road blocking traffic"
  - "**Collapsed road** causing commute delays and danger"

**MEDIUM Priority (Score ≥ 2):**
- Keywords: `blocked`, `overflow`, `major`, `leak`, `no power`, `no water`, `broken`, `damaged`, `urgent repair`, etc.
- Examples:
  - "**Major water leak** causing flooding in residential area"
  - "**Power outage** affecting entire neighborhood"
  - "**Blocked drainage** causing sewage backup"

**LOW Priority (Score < 2):**
- Minor issues: `pothole`, `small`, `minor`, `dusty`, `dirty`, `maintenance`, `cosmetic`, etc.
- Examples:
  - "Small pothole on side street"
  - "Dirty sidewalk needs cleaning"
  - "Street light cosmetic damage"

### Scoring Details

| Factor | Points |
|--------|--------|
| HIGH keyword match | +3 |
| MEDIUM keyword match | +2 |
| LOW keyword match | -1 |
| Description length > 300 chars | +1 |
| Description length > 100 chars | +0.5 |

**Example:** A complaint titled "**Major fire** breaking out in commercial building" with a 200+ character description would score: 3 (HIGH keyword) + 0.5 (length) = **3.5 points = HIGH priority**.

### AI Service Endpoints

- `POST /predict_text` — Analyzes text complaint for priority
  - Input: `{ "title": "...", "description": "..." }`
  - Returns: `{ "priority": "High"|"Medium"|"Low", "confidence": 0.0-1.0, "score": float, "keywords_matched": [...] }`

- `POST /predict_image` — Basic image analysis (placeholder for CNN model in production)

---

## Quick start (development):

- Backend:
  - cd backend
  - npm install
  - copy `.env.example` to `.env` and fill values
  - npm run dev

- AI service:
  - cd ai
  - python -m venv .venv
  - .venv\Scripts\pip install -r requirements.txt
  - uvicorn app:app --reload --port 8001

- Frontend:
  - cd frontend
  - npm install
  - npm run dev

This repo includes an Express backend with JWT auth, PostgreSQL schema, a FastAPI AI microservice, and a React + Tailwind frontend skeleton.

Docker (compose)
-----------------

A `docker-compose.yml` is provided to run Postgres, the AI service, and the backend together.

1. Copy `backend/.env.example` to `backend/.env` and update any secrets if desired. If you want an admin created automatically during migrations, set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env`.

2. Build and start all services:

```powershell
docker compose up --build
```

Services and ports:
- Backend: http://localhost:4000
- AI service: http://localhost:8001
- Postgres: localhost:5432 (user: `postgres`, pass: `postgres` by default in compose)

Notes:
- The backend container runs the migration script `npm run migrate` at startup to apply `backend/sql/schema.sql` and seed an admin user when `ADMIN_EMAIL`/`ADMIN_PASSWORD` are provided.
- Uploaded images are stored in `backend/uploads` (mounted into the container). For production, configure AWS S3 by setting `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `S3_BUCKET` in `backend/.env`.
- If you only want to run services individually, follow the Quick start steps above.

Project layout
--------------
- `backend/` — Express API, JWT auth, complaint endpoints, S3 helper, DB migrations script.
- `ai/` — FastAPI microservice for basic text/image priority predictions.
- `frontend/` — React + Tailwind UI including user pages and admin dashboard.
- `docker-compose.yml` — Compose file to run DB, backend, and AI for local development.

Further improvements (suggested):
- Add a `frontend` service to compose for full-stack local run.
- Add healthchecks and wait-for-db logic to make container startup more robust.
- Add tests and CI pipeline for linting, unit tests, and security scanning.
