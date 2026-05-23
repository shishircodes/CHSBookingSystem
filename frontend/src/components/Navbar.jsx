import { NavLink, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../store/authStore.js';

const linkCls = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
  }`;

export default function Navbar() {
  const { user, isAuthenticated, clear } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch { /* ignore */ }
    clear();
    navigate('/login');
  };

  const isStaff = user?.role === 'admin' || user?.role === 'provider';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <NavLink to="/" className="flex items-center gap-2 font-semibold text-brand-700">
          <span className="text-xl">+</span> CHS Booking
        </NavLink>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/services" className={linkCls}>Services</NavLink>
          {user?.role === 'patient' && <NavLink to="/bookings" className={linkCls}>My Bookings</NavLink>}
          {isStaff && <NavLink to="/dashboard" className={linkCls}>Dashboard</NavLink>}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:block text-sm text-slate-600">
                {user?.name} <span className="badge bg-brand-50 text-brand-700 ml-1">{user?.role}</span>
              </span>
              <button onClick={handleLogout} className="btn-ghost text-sm">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn-ghost text-sm">Login</NavLink>
              <NavLink to="/register" className="btn-primary text-sm">Register</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
