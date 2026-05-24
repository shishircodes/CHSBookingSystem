import { useState } from 'react';
import { useLoaderData, useRevalidator } from 'react-router-dom';
import { LuCircleCheck, LuCheckCheck, LuX, LuTrash2 } from 'react-icons/lu';
import api from '../api/client.js';
import { useAuth } from '../store/authStore.js';
import StatusBadge from '../components/StatusBadge.jsx';

export default function Bookings() {
  const { user } = useAuth();
  const { bookings } = useLoaderData();
  const { revalidate } = useRevalidator();
  const [error, setError] = useState('');

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      revalidate();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this booking?')) return;
    await api.delete(`/bookings/${id}`);
    revalidate();
  };

  const title = user?.role === 'patient'  ? 'My bookings'
              : user?.role === 'provider' ? 'Bookings assigned to me'
              : 'All bookings';

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">{error}</div>
      )}

      <div className="overflow-x-auto card p-0">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Service</th>
              {user?.role !== 'patient'  && <th className="px-4 py-3">Patient</th>}
              {user?.role !== 'provider' && <th className="px-4 py-3">Provider</th>}
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-3 whitespace-nowrap">
                  {new Date(b.appointment_at).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{b.service_name}</div>
                  <div className="text-xs text-slate-500">{b.service_category} · {b.duration_min} min</div>
                </td>
                {user?.role !== 'patient'  && <td className="px-4 py-3">{b.patient_name}</td>}
                {user?.role !== 'provider' && <td className="px-4 py-3">{b.provider_name || '-'}</td>}
                <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                <td className="px-4 py-3 flex flex-wrap gap-1">

                  {user?.role === 'patient' && b.status !== 'cancelled' && b.status !== 'completed' && (
                    <button onClick={() => setStatus(b.id, 'cancelled')}
                            className="btn-ghost text-xs py-1 px-2 gap-1">
                      <LuX className="text-sm" /> Cancel
                    </button>
                  )}

                  {user?.role === 'provider' && (
                    <>
                      {b.status === 'pending' && (
                        <button onClick={() => setStatus(b.id, 'confirmed')}
                                className="btn-primary text-xs py-1 px-2 gap-1">
                          <LuCircleCheck className="text-sm" /> Confirm
                        </button>
                      )}
                      {b.status === 'confirmed' && (
                        <button onClick={() => setStatus(b.id, 'completed')}
                                className="btn-primary text-xs py-1 px-2 gap-1">
                          <LuCheckCheck className="text-sm" /> Complete
                        </button>
                      )}
                      {b.status !== 'cancelled' && b.status !== 'completed' && (
                        <button onClick={() => setStatus(b.id, 'cancelled')}
                                className="btn-ghost text-xs py-1 px-2 gap-1">
                          <LuX className="text-sm" /> Cancel
                        </button>
                      )}
                    </>
                  )}

                  {user?.role === 'admin' && (
                    <>
                      <select value={b.status} onChange={(e) => setStatus(b.id, e.target.value)}
                              className="input py-1 text-xs w-32 inline-block">
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                      <button onClick={() => remove(b.id)}
                              className="btn-danger text-xs py-1 px-2 gap-1">
                        <LuTrash2 className="text-sm" /> Delete
                      </button>
                    </>
                  )}

                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-10 text-center text-slate-500">
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
