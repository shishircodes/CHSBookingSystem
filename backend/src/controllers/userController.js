import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { query } from '../config/db.js';

export const createUserSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  phone: z.string().max(40).optional().or(z.literal('')),
  role: z.enum(['patient', 'provider', 'admin']),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  phone: z.string().max(40).optional().or(z.literal('')),
  role: z.enum(['patient', 'provider', 'admin']).optional(),
});

export async function listUsers(req, res) {
  const role = req.query.role;
  let sql = 'SELECT id, name, email, role, phone, created_at FROM users';
  const params = [];
  if (role) { sql += ' WHERE role = $1'; params.push(role); }
  sql += ' ORDER BY created_at DESC';
  const { rows } = await query(sql, params);
  res.json(rows);
}

export async function createUser(req, res) {
  const { name, email, password, phone, role } = req.body;
  const exists = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (exists.rowCount) return res.status(409).json({ error: 'Email already exists' });
  const hash = await bcrypt.hash(password, 10);
  const { rows } = await query(
    `INSERT INTO users (name, email, password_hash, phone, role)
     VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email, role, phone, created_at`,
    [name, email, hash, phone || null, role]
  );
  res.status(201).json(rows[0]);
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const existing = await query('SELECT * FROM users WHERE id = $1', [id]);
  if (!existing.rowCount) return res.status(404).json({ error: 'User not found' });
  const u = { ...existing.rows[0], ...req.body };
  const { rows } = await query(
    `UPDATE users SET name=$1, phone=$2, role=$3 WHERE id=$4
     RETURNING id, name, email, role, phone, created_at`,
    [u.name, u.phone, u.role, id]
  );
  res.json(rows[0]);
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  if (Number(id) === req.user.id) return res.status(400).json({ error: 'Cannot delete yourself' });
  await query('DELETE FROM users WHERE id = $1', [id]);
  res.status(204).end();
}
