import { z } from 'zod';
import { query } from '../config/db.js';

export const createBookingSchema = z.object({
  service_id: z.number().int().positive(),
  appointment_at: z.string().min(10), // ISO datetime
  notes: z.string().max(1000).optional().or(z.literal('')),
});

export const updateStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
});

const SELECT = `
  SELECT b.*,
         s.name AS service_name, s.category AS service_category, s.duration_min, s.price,
         p.name AS patient_name, p.email AS patient_email,
         pr.name AS provider_name
  FROM bookings b
  JOIN services s ON s.id = b.service_id
  JOIN users    p ON p.id = b.patient_id
  LEFT JOIN users pr ON pr.id = b.provider_id
`;

export async function listBookings(req, res) {
  let sql = SELECT;
  const params = [];
  if (req.user.role === 'patient') {
    sql += ' WHERE b.patient_id = $1';
    params.push(req.user.id);
  } else if (req.user.role === 'provider') {
    sql += ' WHERE b.provider_id = $1';
    params.push(req.user.id);
  }
  sql += ' ORDER BY b.appointment_at DESC';
  const { rows } = await query(sql, params);
  res.json(rows);
}

export async function createBooking(req, res) {
  const { service_id, appointment_at, notes } = req.body;
  const svc = await query('SELECT provider_id, is_active FROM services WHERE id = $1', [service_id]);
  if (!svc.rowCount) return res.status(404).json({ error: 'Service not found' });
  if (!svc.rows[0].is_active) return res.status(400).json({ error: 'Service is not active' });

  const { rows } = await query(
    `INSERT INTO bookings (patient_id, service_id, provider_id, appointment_at, status, notes)
     VALUES ($1, $2, $3, $4, 'pending', $5) RETURNING *`,
    [req.user.id, service_id, svc.rows[0].provider_id, appointment_at, notes || null]
  );
  res.status(201).json(rows[0]);
}

export async function updateBookingStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  const existing = await query('SELECT * FROM bookings WHERE id = $1', [id]);
  if (!existing.rowCount) return res.status(404).json({ error: 'Booking not found' });
  const b = existing.rows[0];

  if (req.user.role === 'patient') {
    if (b.patient_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    if (status !== 'cancelled') return res.status(403).json({ error: 'Patients can only cancel' });
  } else if (req.user.role === 'provider') {
    if (b.provider_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  }
  // admin can set any status

  const { rows } = await query(
    'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  res.json(rows[0]);
}

export async function deleteBooking(req, res) {
  const { id } = req.params;
  const existing = await query('SELECT patient_id FROM bookings WHERE id = $1', [id]);
  if (!existing.rowCount) return res.status(404).json({ error: 'Booking not found' });
  if (req.user.role === 'patient' && existing.rows[0].patient_id !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  if (req.user.role === 'provider') return res.status(403).json({ error: 'Forbidden' });
  await query('DELETE FROM bookings WHERE id = $1', [id]);
  res.status(204).end();
}
