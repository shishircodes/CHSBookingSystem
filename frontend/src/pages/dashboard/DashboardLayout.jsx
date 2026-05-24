import { useState } from 'react';
import { NavLink, Link, Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
  LuHeartPulse, LuLayoutDashboard, LuCalendarDays,
  LuSettings2, LuUsers, LuLogOut, LuMenu, LuX,
  LuChevronRight, LuHouse,
} from 'react-icons/lu';
import api from '../../api/client.js';
import { useAuth } from '../../store/authStore.js';

const ALL_TABS = [
  { to: '',         label: 'Overview',        Icon: LuLayoutDashboard, roles: ['provider', 'admin'] },
  { to: 'bookings', label: 'Bookings',        Icon: LuCalendarDays,    roles: ['provider', 'admin'] },
  { to: 'services', label: 'Manage Services', Icon: LuSettings2,       roles: ['provider', 'admin'] },
  { to: 'users',    label: 'Users',           Icon: LuUsers,           roles: ['admin'] },
];

const PAGE_TITLES = {
  '': 'Overview', bookings: 'Bookings', services: 'Manage Services', users: 'Users',
};

function SidebarLink({ to, label, Icon, onClick }) {
  return (
    <NavLink
      end={to === ''}
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
          isActive
            ? 'bg-brand-50 text-brand-700'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
        }`
      }
    >
      <Icon className="text-base shrink-0" />
      {label}
    </NavLink>
  );
}

export default function DashboardLayout() {
  const { user, clear } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'patient') return <Navigate to="/" replace />;

  const tabs = ALL_TABS.filter((t) => t.roles.includes(user.role));

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch { /* ignore */ }
    clear();
    navigate('/login');
  };

  const segment = location.pathname.replace('/dashboard', '').replace('/', '');
  const pageTitle = PAGE_TITLES[segment] ?? 'Dashboard';

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-60 bg-white border-r border-slate-200 flex flex-col shrink-0
        transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>

        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <LuHeartPulse className="text-white text-sm" />
            </div>
            <span className="font-semibold text-slate-800 tracking-tight">CHS Booking</span>
          </div>
          <button onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-700 cursor-pointer">
            <LuX />
          </button>
        </div>

        {/* Role label */}
        <div className="px-4 pt-5 pb-2">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-1">
            {user.role} Portal
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {tabs.map(({ to, label, Icon }) => (
            <SidebarLink key={to} to={to} label={label} Icon={Icon}
              onClick={() => setSidebarOpen(false)} />
          ))}

          {/* Divider + Back to Home */}
          <div className="pt-3 mt-3 border-t border-slate-100">
            <Link to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer">
              <LuHouse className="text-base shrink-0" />
              Back to home
            </Link>
          </div>
        </nav>

        {/* User block */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer">
            <LuLogOut className="text-base shrink-0" /> Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-500 hover:text-slate-800 cursor-pointer">
              <LuMenu className="text-xl" />
            </button>
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <span>Dashboard</span>
              {segment && (
                <>
                  <LuChevronRight className="text-xs text-slate-400" />
                  <span className="font-medium text-slate-800">{pageTitle}</span>
                </>
              )}
            </div>
          </div>

          {/* Right side: home link + logout + user */}
          <div className="flex items-center gap-2">
            <Link to="/"
              className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors cursor-pointer px-2 py-1.5 rounded-lg hover:bg-slate-100">
              <LuHouse className="text-base" />
              Home
            </Link>

            <div className="w-px h-5 bg-slate-200 hidden sm:block" />

            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors cursor-pointer px-2 py-1.5 rounded-lg hover:bg-slate-100">
              <LuLogOut className="text-base" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            <div className="w-px h-5 bg-slate-200 hidden sm:block" />

            <span className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5">
              <div className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-slate-700">{user.name?.split(' ')[0]}</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full font-medium bg-brand-50 text-brand-700">
                {user.role}
              </span>
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
