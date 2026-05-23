import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { query } from '../config/db.js';
import { signToken, publicUser, setAuthCookie, clearAuthCookie } from '../utils/token.js';

export const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  phone: z.string().max(40).optional().or(z.literal('')),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function register(req, res) {
  const { name, email, password, phone } = req.body;
  const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rowCount) return res.status(409).json({ error: 'Email already registered' });

  const hash = await bcrypt.hash(password, 10);
  const { rows } = await query(
    `INSERT INTO users (name, email, password_hash, phone, role)
     VALUES ($1, $2, $3, $4, 'patient')
     RETURNING id, name, email, role, phone`,
    [name, email, hash, phone || null]
  );
  const user = rows[0];
  setAuthCookie(res, signToken(user));
  res.status(201).json({ user: publicUser(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
  const user = rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  setAuthCookie(res, signToken(user));
  res.json({ user: publicUser(user) });
}

export async function logout(req, res) {
  clearAuthCookie(res);
  res.json({ ok: true });
}

export async function me(req, res) {
  const { rows } = await query(
    'SELECT id, name, email, role, phone FROM users WHERE id = $1',
    [req.user.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'User not found' });
  res.json({ user: rows[0] });
}
