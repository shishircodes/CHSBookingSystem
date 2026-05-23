import jwt from 'jsonwebtoken';

const COOKIE_NAME = 'token';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

export function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, role: u.role, phone: u.phone };
}

export function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true',
    maxAge: SEVEN_DAYS_MS,
    path: '/',
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, { path: '/' });
}
