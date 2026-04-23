# AgriTrack

AgriTrack is a full-stack agricultural field management app with a Django REST API backend and a React/Vite frontend. It supports two roles:

- `admin`: creates fields, views all data, registers agents, and monitors analytics
- `agent`: sees assigned fields, updates crop stages, and logs field activities

## Stack

- Backend: Django, Django REST Framework, Simple JWT
- Frontend: React, Vite, Tailwind CSS, Axios, Recharts
- Database: SQLite for local development

## Project Structure

```text
backend/
  agri_backend/        Django settings and root URLs
  users/               Custom user model, login, agent creation
  fields/              Field model, CRUD, dashboard endpoints
  updates/             Stage updates and activity log models

frontend/
  src/pages/           Landing page, login, admin and agent dashboards
  src/components/      Shared UI for field cards, analytics, forms, navbar
  src/api.js           Axios client and token refresh flow
```

## Setup Instructions

### 1. Backend

From the repo root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py create_test_users
python manage.py create_demo_data
python manage.py runserver
```

The API will be available at `http://localhost:8000`.

Notes:

- `create_demo_data` assumes the test users already exist, so run `create_test_users` first.
- The backend is configured for SQLite in development via `backend/agri_backend/settings.py`.

### 2. Frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

The frontend will run on Vite's local dev server, usually `http://localhost:5173` unless that port is occupied.

Local API calls use same-origin `/api`; [`frontend/vite.config.js`](./frontend/vite.config.js) **proxies** `/api` to `http://127.0.0.1:8000`, so you do not need `VITE_API_URL` for normal local sign-in (including opening the dev server from a LAN URL like `http://192.168.x.x:5173`). Optional: set `VITE_DEV_PROXY_TARGET` in `.env.local` if Django is not on port `8000`.

For Vercel deployments:

- Set the Vercel project Root Directory to `frontend`
- Update [`frontend/vercel.json`](./frontend/vercel.json) so the regex rewrite `^/api/(.*)$` forwards to your Railway host (for example `https://your-backend.up.railway.app/api/$1`)
- Remove any production `VITE_API_URL` value so the deployed frontend uses same-origin `/api`

For Railway (or similar) backend deployments:

- If the service root is the **repo root** (`AgriTrack/`), the root [`Procfile`](./Procfile) runs [`start.sh`](./start.sh), which `cd`s into `backend/` when needed.
- If the service root is **`backend/`** only, use [`backend/Procfile`](./backend/Procfile) (no `chdir`) so Gunicorn can load `agri_backend.wsgi`.

## Demo Accounts

After running `python manage.py create_test_users`:

- Admin: `admin@agritrack.com` / `admin123`
- Agent: `agent@agritrack.com` / `agent123`

## Design Decisions

- Custom email-based user model: authentication uses email instead of username, which fits a business app more naturally and keeps role checks simple.
- Role-based API filtering: admins can access everything, while agents only receive fields assigned to them. This is enforced in the backend queryset and endpoint logic, not just in the UI.
- Separate domain apps: `users`, `fields`, and `updates` isolate authentication, field records, and operational history so responsibilities stay clear.
- Derived field health instead of stored status: field `status` is computed from crop stage and update recency, which avoids duplicate state and keeps dashboard summaries consistent.
- Activity logs drive cost tracking: each logged activity can contribute to `total_input_cost`, keeping operational records and financial rollups aligned.
- JWT auth with refresh tokens: the frontend stores access and refresh tokens and retries unauthorized requests through an Axios refresh flow.
- SQLite-first development setup: the repo is optimized for quick local startup without external services.
- Frontend/backend separation: the React app talks to the Django API through `VITE_API_URL`, which makes local development and separate deployment straightforward.

## Assumptions Made

- This is a single-organization app. There is no tenant or farm-level isolation beyond user roles and assigned fields.
- Field agents are expected to work only on fields explicitly assigned to them.
- A field's operational health can be approximated from stage and recent update activity; there is no more advanced agronomic risk engine yet.
- Demo and local development use seeded users and sample data rather than a registration flow for first-time admins.
- SQLite is acceptable for local/dev usage, but production would likely need PostgreSQL and environment-based settings.
- The frontend assumes the backend is reachable over HTTP from a browser at the URL defined in `VITE_API_URL`.

## API Overview

- `POST /api/auth/login/`: log in and receive JWT tokens
- `POST /api/auth/token/refresh/`: refresh an access token
- `POST /api/auth/create/`: admin-only agent creation
- `GET /api/fields/`: list fields visible to the current user
- `POST /api/fields/`: admin-only field creation
- `GET /api/fields/{id}/`: retrieve field details
- `PATCH /api/fields/{id}/`: admin-only field edits
- `DELETE /api/fields/{id}/`: admin-only delete
- `POST /api/fields/{id}/update/`: create a stage update
- `POST /api/fields/{id}/activity/`: log a field activity
- `GET /api/dashboard/`: summary metrics and recent activity

## Deployment Notes

- If Vercel is rooted at `frontend`, use [`frontend/vercel.json`](./frontend/vercel.json) for the build settings.
- Vercel API requests are proxied with a rewrite rule in [`frontend/vercel.json`](./frontend/vercel.json), forwarding `/api/*` to your backend origin.
- For production, the backend should move off SQLite, use environment variables for secrets, and run with `DEBUG = False`.
