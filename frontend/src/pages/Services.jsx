import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../store/authStore.js';

export default function Services() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [booking, setBooking] = useState(null); // service being booked
  const [form, setForm] = useState({ appointment_at: '', notes: '' });
  const [msg, setMsg] = useState(null);

  const load = async () => {
    const { data } = await api.get('/services');
    setServices(data.filter((s) => s.is_active));
  };
  useEffect(() => { load(); }, []);

  const categories = useMemo(
    () => ['all', ...new Set(services.map((s) => s.category))],
    [services]
  );

  const filtered = services.filter((s) => {
    const matchesText = (s.name + s.description + s.category).toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === 'all' || s.category === category;
    return matchesText && matchesCat;
  });

  const startBooking = (svc) => {
    if (!isAuthenticated) return navigate('/login');
    if (user.role !== 'patient') {
      setMsg({ type: 'error', text: 'Only patients can book services.' });
      return;
    }
    setBooking(svc);
    setForm({ appointment_at: '', notes: '' });
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      await api.post('/bookings', {
        service_id: booking.id,
        appointment_at: new Date(form.appointment_at).toISOString(),
        notes: form.notes,
      });
      setMsg({ type: 'success', text: `Booked "${booking.name}". See My Bookings.` });
      setBooking(null);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Booking failed' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Available services</h1>
          <p className="text-slate-600 text-sm">Browse and book community health services.</p>
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Search services…"
            className="input sm:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="input sm:w-44" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {msg && (
        <div className={`rounded-md p-3 text-sm border ${
          msg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                 : 'bg-red-50 border-red-200 text-red-700'
        }`}>{msg.text}</div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <article key={s.id} className="card flex flex-col">
            <span className="badge bg-brand-50 text-brand-700 self-start">{s.category}</span>
            <h2 className="text-lg font-semibold mt-2">{s.name}</h2>
            <p className="text-sm text-slate-600 mt-1 flex-1">{s.description}</p>
            <div className="mt-3 text-sm text-slate-700 flex items-center justify-between">
              <span>{s.duration_min} min</span>
              <span className="font-semibold">${Number(s.price).toFixed(2)}</span>
            </div>
            {s.provider_name && (
              <p className="text-xs text-slate-500 mt-1">Provider: {s.provider_name}</p>
            )}
            <button onClick={() => startBooking(s)} className="btn-primary mt-4">Book</button>
          </article>
        ))}
        {filtered.length === 0 && (
          <p className="text-slate-500 col-span-full text-center py-8">No services match.</p>
        )}
      </div>

      {booking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-20">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold">Book: {booking.name}</h2>
            <p className="text-sm text-slate-600 mt-1">
              {booking.duration_min} min &middot; ${Number(booking.price).toFixed(2)}
            </p>
            <form onSubmit={submitBooking} className="mt-4 space-y-4">
              <div>
                <label className="label" htmlFor="when">Date and time</label>
                <input id="when" type="datetime-local" required className="input"
                       value={form.appointment_at}
                       onChange={(e) => setForm({ ...form, appointment_at: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="notes">Notes (optional)</label>
                <textarea id="notes" rows="3" className="input"
                          value={form.notes}
                          onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setBooking(null)} className="btn-ghost">Cancel</button>
                <button className="btn-primary">Confirm booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
