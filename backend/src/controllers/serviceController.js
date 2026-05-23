import { z } from 'zod';
import { query } from '../config/db.js';

export const serviceSchema = z.object({
  name: z.string().min(2).max(160),
  description: z.string().max(2000).optional().or(z.literal('')),
  category: z.string().min(2).max(80),
  duration_min: z.number().int().positive(),
  price: z.number().nonnegative(),
  provider_id: z.number().int().positive().optional().nullable(),
  is_active: z.boolean().optional(),
});

const SELECT = `
  SELECT s.*, u.name AS provider_name
  FROM services s
  LEFT JOIN users u ON u.id = s.provider_id
`;

export async function listServices(req, res) {
  const { rows } = await query(`${SELECT} ORDER BY s.created_at DESC`);
  res.json(rows);
}

export async function getService(req, res) {
  const { rows } = await query(`${SELECT} WHERE s.id = $1`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Service not found' });
  res.json(rows[0]);
}

export async function createService(req, res) {
  const s = req.body;
  // providers can only assign themselves
  const providerId = req.user.role === 'provider' ? req.user.id : (s.provider_id ?? null);
  const { rows } = await query(
    `INSERT INTO services (name, description, category, duration_min, price, provider_id, is_active)
     VALUES ($1,$2,$3,$4,$5,$6,COALESCE($7,TRUE)) RETURNING *`,
    [s.name, s.description || null, s.category, s.duration_min, s.price, providerId, s.is_active]
  );
  res.status(201).json(rows[0]);
}

export async function updateService(req, res) {
  const { id } = req.params;
  const existing = await query('SELECT * FROM services WHERE id = $1', [id]);
  if (!existing.rowCount) return res.status(404).json({ error: 'Service not found' });
  if (req.user.role === 'provider' && existing.rows[0].provider_id !== req.user.id) {
    return res.status(403).json({ error: 'You can only edit your own services' });
  }
  const s = { ...existing.rows[0], ...req.body };
  const { rows } = await query(
    `UPDATE services SET name=$1, description=$2, category=$3, duration_min=$4,
        price=$5, provider_id=$6, is_active=$7 WHERE id=$8 RETURNING *`,
    [s.name, s.description, s.category, s.duration_min, s.price, s.provider_id, s.is_active, id]
  );
  res.json(rows[0]);
}

export async function deleteService(req, res) {
  const { id } = req.params;
  const existing = await query('SELECT provider_id FROM services WHERE id = $1', [id]);
  if (!existing.rowCount) return res.status(404).json({ error: 'Service not found' });
  if (req.user.role === 'provider' && existing.rows[0].provider_id !== req.user.id) {
    return res.status(403).json({ error: 'You can only delete your own services' });
  }
  await query('DELETE FROM services WHERE id = $1', [id]);
  res.status(204).end();
}
