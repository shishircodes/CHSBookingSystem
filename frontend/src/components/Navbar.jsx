import { NavLink, useNavigate } from 'react-router-dom';
import {
  LuHeartPulse, LuLogOut, LuLogIn, LuUserPlus,
  LuCalendarDays, LuLayoutDashboard, LuStethoscope,
} from 'react-icons/lu';
import api from '../api/client.js';
import { useAuth } from '../store/authStore.js';

const linkCls = ({ isActive }) =>
  `relative px-1 py-1 text-sm font-medium transition-colors ${
    isActive
      ? 'text-brand-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-brand-600 after:rounded-full'
      : 'text-slate-600 hover:text-slate-900'
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
    <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 text-slate-800 font-semibold">
          <div className="w-7 h-7 bg-brand-600 rounded-md flex items-center justify-center">
            <LuHeartPulse className="text-white text-sm" />
          </div>
          chs-booking
        </NavLink>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" end className={linkCls}>Home</NavLink>
          <NavLink to="/services" className={linkCls}>
            Services
          </NavLink>
          {user?.role === 'patient' && (
            <NavLink to="/bookings" className={linkCls}>My Bookings</NavLink>
          )}
          {isStaff && (
            <NavLink to="/dashboard" className={linkCls}>Dashboard</NavLink>
          )}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:block text-sm text-slate-600">
                Welcome, <span className="font-medium text-slate-800">{user?.name?.split(' ')[0]}</span>
              </span>
              <button onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
                <LuLogOut className="text-base" /> Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Login
              </NavLink>
              <NavLink to="/register"
                className="btn-primary text-sm px-4 py-2 rounded-lg">
                Get started
              </NavLink>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
