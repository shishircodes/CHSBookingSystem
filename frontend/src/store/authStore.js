import { create } from 'zustand';

// Auth token lives in an httpOnly cookie managed by the server.
// We keep only the user profile in memory; on app boot we call /auth/me
// to rehydrate it from the cookie.
export const useAuth = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  clear:   ()     => set({ user: null, isAuthenticated: false, isLoading: false }),
}));
