import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// The JWT lives in an httpOnly cookie (server-managed, JS-unreadable).
// Only the non-sensitive user profile (name, email, role) is persisted here
// in sessionStorage so the UI survives a page refresh without an extra
// network round-trip. If the cookie has expired the next API call will return
// 401 and the axios interceptor calls clear(), keeping both in sync.
export const useAuth = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      clear:   ()     => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'chs-user',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
