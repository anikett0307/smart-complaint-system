# Copilot Instructions for Smart Complaint System

## Project Overview
- **Purpose:** Web app for submitting and tracking public complaints, with AI-based priority scoring.
- **Architecture:**
  - `backend/`: Node.js Express API (JWT auth, complaint endpoints, S3 integration, DB migrations)
  - `ai/`: FastAPI microservice for text/image priority prediction
  - `frontend/`: React + Tailwind UI (user pages, admin dashboard)
  - `docker-compose.yml`: Orchestrates backend, AI, and Postgres for local/dev

## Key Workflows
- **Backend:**
  - Start: `npm run dev` (in backend/)
  - Migrations: `npm run migrate` (applies `sql/schema.sql`, seeds admin if env set)
  - Auth: JWT-based, see `controllers/authController.js`
  - S3: Local uploads in `uploads/`, S3 config via `.env`
- **AI Service:**
  - Start: `uvicorn app:app --reload --port 8001` (in ai/)
  - Endpoints: `/predict_text`, `/predict_image` (see README for payloads)
- **Frontend:**
  - Start: `npm run dev` (in frontend/)

## Patterns & Conventions
- **AI Priority:** Keyword-based scoring (see `ai/app.py` and README for logic)
- **DB:** PostgreSQL, schema in `backend/sql/schema.sql`
- **Uploads:** Images stored in `backend/uploads/` (local) or S3 (prod)
- **Env Config:** Copy `.env.example` to `.env` in backend, set secrets/admin
- **API Integration:** Frontend calls backend endpoints (see `frontend/src/api.js`)
- **Admin:** Admin user seeded if `ADMIN_EMAIL`/`ADMIN_PASSWORD` set in env

## Integration & Communication
- **Backend <-> AI:** Backend calls AI microservice for complaint priority
- **Backend <-> DB:** Uses models in `backend/src/models/`
- **Frontend <-> Backend:** REST API, see `frontend/src/api.js`

## Examples
- **AI scoring:** See README for keyword/score mapping
- **Migration script:** `backend/scripts/run_migrations.js`
- **S3 helper:** `backend/src/lib/s3.js`
- **Routes:** `backend/src/routes/`

## Tips for AI Agents
- Reference the README for scoring logic and service endpoints
- Use provided scripts and env files for setup
- Follow directory structure for component boundaries
- Prefer updating this file if new conventions emerge
