import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../store/authStore.js';

const TABS = [
  { to: '',          label: 'Overview',         icon: '■', roles: ['provider', 'admin'] },
  { to: 'bookings',  label: 'Bookings',         icon: '✓', roles: ['provider', 'admin'] },
  { to: 'services',  label: 'Manage Services',  icon: '⚙', roles: ['provider', 'admin'] },
  { to: 'users',     label: 'Users',            icon: '☻', roles: ['admin'] },
];

const itemCls = ({ isActive }) =>
  `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
    isActive
      ? 'bg-brand-50 text-brand-700'
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
  }`;

export default function DashboardLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'patient') return <Navigate to="/" replace />;

  const tabs = TABS.filter((t) => t.roles.includes(user.role));

  return (
    <div className="grid lg:grid-cols-[220px_1fr] gap-6">
      <aside className="card p-3 h-fit lg:sticky lg:top-20">
        <div className="px-2 pb-3 mb-2 border-b border-slate-200">
          <p className="text-xs uppercase tracking-wider text-slate-400">Dashboard</p>
          <p className="font-semibold mt-0.5">{user.name}</p>
          <span className="badge bg-brand-50 text-brand-700 mt-1">{user.role}</span>
        </div>
        <nav className="flex flex-col gap-1">
          {tabs.map((t) => (
            <NavLink key={t.to} end={t.to === ''} to={t.to} className={itemCls}>
              <span className="w-4 text-center text-brand-600">{t.icon}</span>
              {t.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <section className="min-w-0">
        <Outlet />
      </section>
    </div>
  );
}
