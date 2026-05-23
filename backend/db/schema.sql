-- Community Health Services Booking System schema (PostgreSQL / Neon)

DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE  IF EXISTS user_role CASCADE;
DROP TYPE  IF EXISTS booking_status CASCADE;

CREATE TYPE user_role      AS ENUM ('patient', 'provider', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(120) NOT NULL,
    email         VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone         VARCHAR(40),
    role          user_role NOT NULL DEFAULT 'patient',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE services (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(160) NOT NULL,
    description   TEXT,
    category      VARCHAR(80) NOT NULL,
    duration_min  INTEGER NOT NULL CHECK (duration_min > 0),
    price         NUMERIC(10,2) NOT NULL DEFAULT 0,
    provider_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE bookings (
    id            SERIAL PRIMARY KEY,
    patient_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id    INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    provider_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
    appointment_at TIMESTAMPTZ NOT NULL,
    status        booking_status NOT NULL DEFAULT 'pending',
    notes         TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_services_provider ON services(provider_id);
CREATE INDEX idx_bookings_patient  ON bookings(patient_id);
CREATE INDEX idx_bookings_provider ON bookings(provider_id);
CREATE INDEX idx_bookings_when     ON bookings(appointment_at);
