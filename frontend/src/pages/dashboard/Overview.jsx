import { useLoaderData } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  LuCalendarDays, LuStethoscope, LuUsers, LuUserCheck,
  LuArrowRight, LuClock, LuCircleCheck, LuTrendingUp,
} from 'react-icons/lu';
import { useAuth } from '../../store/authStore.js';
import StatusBadge from '../../components/StatusBadge.jsx';

function StatCard({ label, value, sub, Icon }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4">
      <div className="p-2.5 rounded-xl bg-brand-50 shrink-0">
        <Icon className="text-xl text-brand-600" />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-3xl font-bold text-slate-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function Overview() {
  const { user } = useAuth();
  const { bookings, services, users } = useLoaderData();

  const pending   = bookings.filter((b) => b.status === 'pending').length;
  const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
  const completed = bookings.filter((b) => b.status === 'completed').length;
  const upcoming  = bookings
    .filter((b) => new Date(b.appointment_at) >= new Date() && b.status !== 'cancelled')
    .sort((a, b) => new Date(a.appointment_at) - new Date(b.appointment_at))
    .slice(0, 5);

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {user.role === 'admin' ? 'Admin Overview' : 'Provider Overview'}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {user.role === 'admin'
            ? 'System-wide summary.'
            : `Welcome back, ${user.name?.split(' ')[0]}.`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard Icon={LuCalendarDays} label="Total bookings" value={bookings.length}
          sub={`${pending} pending · ${confirmed} confirmed`} />
        <StatCard Icon={LuStethoscope}
          label={user.role === 'provider' ? 'My services' : 'Services'}
          value={services.length}
          sub={`${services.filter((s) => s.is_active).length} active`} />
        {user.role === 'admin' ? (
          <>
            <StatCard Icon={LuUsers} label="Total users" value={users.length}
              sub={`${users.filter((u) => u.role === 'patient').length} patients`} />
            <StatCard Icon={LuUserCheck} label="Providers"
              value={users.filter((u) => u.role === 'provider').length}
              sub="Registered providers" />
          </>
        ) : (
          <>
            <StatCard Icon={LuClock}       label="Pending"   value={pending}   sub="Awaiting confirmation" />
            <StatCard Icon={LuCircleCheck} label="Confirmed" value={confirmed} sub="Scheduled appointments" />
          </>
        )}
      </div>

      {/* Lower grid */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* Upcoming table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Upcoming appointments</h2>
            <Link to="bookings"
              className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors">
              View all <LuArrowRight className="text-xs" />
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="px-5 py-12 text-center text-slate-400 text-sm">
              No upcoming appointments.
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                  <th className="px-5 py-3 text-left font-medium">Patient</th>
                  <th className="px-5 py-3 text-left font-medium">Service</th>
                  <th className="px-5 py-3 text-left font-medium">When</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {upcoming.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {b.patient_name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-700">{b.patient_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{b.service_name}</td>
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap text-xs">
                      {new Date(b.appointment_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                      {' · '}
                      {new Date(b.appointment_at).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Booking breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-800 mb-4">Booking breakdown</h2>
            <div className="space-y-3">
              {[
                { label: 'Pending',   val: pending   },
                { label: 'Confirmed', val: confirmed },
                { label: 'Completed', val: completed },
              ].map(({ label, val }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{label}</span>
                    <span className="font-medium text-slate-700">{val}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all"
                      style={{ width: bookings.length ? `${(val / bookings.length) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active services card */}
          <div className="bg-brand-600 rounded-xl p-5 text-white">
            <LuTrendingUp className="text-xl text-white/60 mb-2" />
            <p className="font-semibold text-sm">Active services</p>
            <p className="text-3xl font-bold mt-1">{services.filter(s => s.is_active).length}</p>
            <p className="text-xs text-white/60 mt-1">of {services.length} total</p>
            <Link to="services"
              className="mt-3 flex items-center gap-1 text-xs text-white/80 hover:text-white font-medium transition-colors">
              Manage services <LuArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
