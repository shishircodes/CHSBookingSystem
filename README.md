# Community Health Services Booking System

Full-stack web application for booking community health services. Built for ICT 930 Assessment 3.

## Stack
- **Frontend:** React (Vite) + Tailwind CSS + Zustand + React Router + Axios
- **Backend:** Node.js + Express + PostgreSQL (Neon) + JWT
- **Auth:** JWT-based, role-based access control (patient / provider / admin)

## Roles
- **patient** – browse services, book/cancel appointments, view personal bookings
- **provider** – manage their own services, view assigned bookings, update status
- **admin** – manage all users, services, and bookings

## Quick start

### 1. Database (Neon)
1. Create a free Postgres database at https://neon.tech
2. Copy the connection string (it looks like `postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require`)
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

## Default seed accounts
| Role     | Email                  | Password     |
|----------|------------------------|--------------|
| Admin    | admin@chs.local        | Admin@123    |
| Provider | provider@chs.local     | Provider@123 |
| Patient  | patient@chs.local      | Patient@123  |

## API summary
- `POST /api/auth/register` – register a patient
- `POST /api/auth/login` – returns `{ token, user }`
- `GET  /api/auth/me` – current user
- `GET/POST/PUT/DELETE /api/services` – services CRUD
- `GET/POST/PATCH/DELETE /api/bookings` – bookings CRUD
- `GET/PUT/DELETE /api/users` – user admin

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
