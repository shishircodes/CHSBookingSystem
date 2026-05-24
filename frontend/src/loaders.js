// React Router v7 loader functions.
//
// React Router runs a route's loader (and all its ancestors' loaders) before
// rendering. Each loader either returns data or throws redirect().
//
// Loaders completely replace useEffect-based data fetching.

import { redirect } from 'react-router-dom';
import api from './api/client.js';
import { useAuth } from './store/authStore.js';

/** Wraps an async fetch and converts a 401 into a redirect to /login. */
async function safe(fn) {
  try {
    return await fn();
  } catch (err) {
    if (err.response?.status === 401) {
      useAuth.getState().clear();
      throw redirect('/login');
    }
    throw err;
  }
}

// ── Sync auth guards (throw redirect, return null on success) ─────────────

export function staffGuard() {
  const { isAuthenticated, user } = useAuth.getState();
  if (!isAuthenticated) throw redirect('/login');
  if (!['provider', 'admin'].includes(user?.role)) throw redirect('/');
  return null;
}

export function adminGuard() {
  const { isAuthenticated, user } = useAuth.getState();
  if (!isAuthenticated) throw redirect('/login');
  if (user?.role !== 'admin') throw redirect('/');
  return null;
}

// ── Combined loaders (auth guard + data fetch in one) ─────────────────────

/** /bookings — patient only */
export async function patientBookingsLoader() {
  const { isAuthenticated, user } = useAuth.getState();
  if (!isAuthenticated) throw redirect('/login');
  if (user?.role !== 'patient') throw redirect('/');
  return safe(async () => {
    const { data } = await api.get('/bookings');
    return { bookings: data };
  });
}

/** dashboard/users — admin only */
export async function adminUsersLoader() {
  adminGuard();
  return safe(async () => {
    const { data } = await api.get('/users');
    return { users: data };
  });
}

// ── Pure data loaders (auth enforced by parent route's staffGuard) ─────────

export async function overviewLoader() {
  return safe(async () => {
    const user = useAuth.getState().user;
    const [{ data: bookings }, { data: allServices }] = await Promise.all([
      api.get('/bookings'),
      api.get('/services'),
    ]);
    const services = user?.role === 'provider'
      ? allServices.filter((s) => s.provider_id === user.id)
      : allServices;
    let users = [];
    if (user?.role === 'admin') {
      const { data } = await api.get('/users');
      users = data;
    }
    return { bookings, services, users };
  });
}

export async function bookingsLoader() {
  return safe(async () => {
    const { data } = await api.get('/bookings');
    return { bookings: data };
  });
}

export async function manageServicesLoader() {
  return safe(async () => {
    const user = useAuth.getState().user;
    const { data: all } = await api.get('/services');
    const services = user?.role === 'provider'
      ? all.filter((s) => s.provider_id === user.id)
      : all;
    let providers = [];
    if (user?.role === 'admin') {
      const { data } = await api.get('/users?role=provider');
      providers = data;
    }
    return { services, providers };
  });
}

// ── Public loaders (no auth required) ────────────────────────────────────

export async function homeLoader() {
  return safe(async () => {
    const { data } = await api.get('/services');
    return { services: data.filter((s) => s.is_active).slice(0, 3) };
  });
}

export async function servicesLoader() {
  return safe(async () => {
    const { data } = await api.get('/services');
    return { services: data.filter((s) => s.is_active) };
  });
}
