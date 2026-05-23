import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client.js';
import { useAuth } from '../../store/authStore.js';
import StatusBadge from '../../components/StatusBadge.jsx';

function Stat({ label, value, hint }) {
  return (
    <div className="card">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-3xl font-semibold mt-1">{value}</p>
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

export default function Overview() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      const [b, s] = await Promise.all([api.get('/bookings'), api.get('/services')]);
      setBookings(b.data);
      setServices(user.role === 'provider'
        ? s.data.filter((x) => x.provider_id === user.id)
        : s.data);
      if (user.role === 'admin') {
        const u = await api.get('/users');
        setUsers(u.data);
      }
    })();
  }, [user]);

  const pending   = bookings.filter((b) => b.status === 'pending').length;
  const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
  const upcoming  = bookings
    .filter((b) => new Date(b.appointment_at) >= new Date() && b.status !== 'cancelled')
    .sort((a, b) => new Date(a.appointment_at) - new Date(b.appointment_at))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="text-slate-600 text-sm">
          {user.role === 'admin' ? 'System-wide stats.' : 'Stats for your services.'}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Total bookings" value={bookings.length} hint={`${pending} pending · ${confirmed} confirmed`} />
        <Stat label={user.role === 'provider' ? 'My services' : 'Services'} value={services.length}
              hint={`${services.filter((s) => s.is_active).length} active`} />
        {user.role === 'admin' && (
          <>
            <Stat label="Users" value={users.length}
                  hint={`${users.filter((u) => u.role === 'patient').length} patients · ${users.filter((u) => u.role === 'provider').length} providers`} />
            <Stat label="Providers" value={users.filter((u) => u.role === 'provider').length} />
          </>
        )}
        {user.role === 'provider' && (
          <>
            <Stat label="Pending"   value={pending} />
            <Stat label="Confirmed" value={confirmed} />
          </>
        )}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Upcoming appointments</h2>
          <Link to="bookings" className="text-sm text-brand-700 hover:underline">View all →</Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-slate-500 text-sm py-6 text-center">No upcoming appointments.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="py-2">When</th>
                <th className="py-2">Service</th>
                <th className="py-2">Patient</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {upcoming.map((b) => (
                <tr key={b.id}>
                  <td className="py-2">{new Date(b.appointment_at).toLocaleString()}</td>
                  <td className="py-2">{b.service_name}</td>
                  <td className="py-2">{b.patient_name}</td>
                  <td className="py-2"><StatusBadge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
