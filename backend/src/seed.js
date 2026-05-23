import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { query, pool } from './config/db.js';

dotenv.config();

async function upsertUser(name, email, password, role, phone) {
  const hash = await bcrypt.hash(password, 10);
  const { rows } = await query(
    `INSERT INTO users (name, email, password_hash, phone, role)
     VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role
     RETURNING id, email, role`,
    [name, email, hash, phone, role]
  );
  return rows[0];
}

async function main() {
  console.log('Seeding…');
  const admin    = await upsertUser('System Admin', 'admin@chs.local',    'Admin@123',    'admin',    '+61 400 000 001');
  const provider = await upsertUser('Dr. Jane Wells', 'provider@chs.local','Provider@123', 'provider', '+61 400 000 002');
  const patient  = await upsertUser('John Patient',  'patient@chs.local',  'Patient@123',  'patient',  '+61 400 000 003');

  // services
  const services = [
    ['General Health Check',  'Routine general practitioner consultation.',         'GP',          30, 75.00],
    ['Mental Health Counselling','One-on-one counselling session with a psychologist.','Mental Health',60, 120.00],
    ['Childhood Immunisation','Standard scheduled immunisation for children.',     'Pediatrics',  20, 45.00],
    ['Physiotherapy Session', 'Musculoskeletal assessment and treatment.',          'Physiotherapy',45, 95.00],
    ['Dietitian Consultation','Nutrition planning and dietary advice.',             'Nutrition',   45, 90.00],
  ];

  for (const [name, description, category, duration, price] of services) {
    await query(
      `INSERT INTO services (name, description, category, duration_min, price, provider_id, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,TRUE)
       ON CONFLICT DO NOTHING`,
      [name, description, category, duration, price, provider.id]
    );
  }

  console.log('Done. Logins:');
  console.log('  admin@chs.local    / Admin@123');
  console.log('  provider@chs.local / Provider@123');
  console.log('  patient@chs.local  / Patient@123');
  await pool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
