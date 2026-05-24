# Community Health Services Booking System

Full-stack web application for booking community health services. Built for ICT 930 Assessment 3.

## Live link https://chs-booking-system.vercel.app

## Stack
- **Frontend:** React (Vite) + Tailwind CSS + Zustand + React Router + Axios
- **Backend:** Node.js + Express + PostgreSQL (Neon) + JWT
- **Auth:** JWT-based, role-based access control (patient / provider / admin)

## Roles
- **patient** – browse services, book/cancel appointments, view personal bookings
- **provider** – manage their own services, view assigned bookings, update status
- **admin** – manage all users, services, and bookings

## Default seed accounts | Use this to test
| Role     | Email                  | Password     |
|----------|------------------------|--------------|
| Admin    | admin@chs.local        | Admin@123    |
| Provider | provider@chs.local     | Provider@123 |
| Patient  | patient@chs.local      | Patient@123  |


## Quick start

### 1. Database (Neon)
1. Database setup to be hosted at https://neon.tech
2. Copy the connection string
3. Run the schema:
   ```bash
   psql "<your-neon-connection-string>" -f backend/db/schema.sql
   ```
   (or paste `backend/db/schema.sql` into the Neon SQL editor)

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env       # paste your Neon URL into DATABASE_URL
npm run seed               # creates default admin/provider/patient + sample services
npm run dev
```
Backend runs on `http://localhost:5000`.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.



## API summary
- `POST /api/auth/register` – register a patient
- `POST /api/auth/login` – returns `{ token, user }`
- `GET  /api/auth/me` – current user
- `GET/POST/PUT/DELETE /api/services` – services CRUD
- `GET/POST/PATCH/DELETE /api/bookings` – bookings CRUD
- `GET/PUT/DELETE /api/users` – user admin

## Deploying to Vercel

Deploy as **two separate Vercel projects from this same repo**.

### A. Backend project
1. **Import the repo** on Vercel → set **Root Directory** to `backend`.
2. Framework preset: **Other** (Vercel auto-detects via `vercel.json`).
3. Add **Environment Variables** (Production + Preview):
   | Key | Value |
   |---|---|
   | `DATABASE_URL` | your Neon connection string |
   | `JWT_SECRET` | long random string |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CORS_ORIGIN` | frontend URL, e.g. `https://chs-frontend.vercel.app` (comma-separate multiple) |
   | `NODE_ENV` | `production` |
4. Deploy. The Express app is served from `backend/api/index.js` as a serverless function; `vercel.json` rewrites every path to it.
5. Note the deployed URL, e.g. `https://chs-backend.vercel.app`.

### B. Frontend project
1. Import the same repo again → set **Root Directory** to `frontend`.
2. Framework preset: **Vite** (auto-detected).
3. Add **Environment Variable**:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://chs-backend.vercel.app/api` |
4. Deploy.

### C. Update backend CORS
Once you know the frontend URL, set `CORS_ORIGIN` on the backend project to that URL and redeploy. Cookies use `SameSite=None; Secure` automatically when `NODE_ENV=production`, so the cross-site cookie flow works.

### D. Initialise the database
Run `backend/db/schema.sql` against your Neon database, then seed if you want default accounts:
```bash
DATABASE_URL="..." node backend/src/seed.js
```

## Project structure
```
backend/
  db/schema.sql          PostgreSQL schema
  src/
    config/db.js         pg pool
    middleware/          auth + role guard + error handler
    controllers/         route handlers
    routes/              Express routers
    models/              SQL queries
    server.js
frontend/
  src/
    api/                 axios client
    components/          shared UI
    pages/               5+ functional pages
    store/               Zustand auth store
    App.jsx              router + role guards
```
