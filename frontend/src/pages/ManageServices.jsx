import { useEffect, useState } from 'react';
import api from '../api/client.js';
import { useAuth } from '../store/authStore.js';

const empty = { name: '', description: '', category: '', duration_min: 30, price: 0, is_active: true };

export default function ManageServices() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    const { data } = await api.get('/services');
    if (user.role === 'provider') {
      setServices(data.filter((s) => s.provider_id === user.id));
    } else {
      setServices(data);
    }
    if (user.role === 'admin') {
      const u = await api.get('/users?role=provider');
      setProviders(u.data);
    }
  };
  useEffect(() => { load(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      duration_min: Number(form.duration_min),
      price: Number(form.price),
      provider_id: form.provider_id ? Number(form.provider_id) : null,
    };
    try {
      if (editingId) await api.put(`/services/${editingId}`, payload);
      else           await api.post('/services', payload);
      setForm(empty); setEditingId(null);
      load();
    } catch (err) {
      const issues = err.response?.data?.issues;
      setError(issues ? issues.map((i) => `${i.path}: ${i.message}`).join(', ') : err.response?.data?.error || 'Save failed');
    }
  };

  const startEdit = (s) => {
    setEditingId(s.id);
    setForm({
      name: s.name, description: s.description || '', category: s.category,
      duration_min: s.duration_min, price: Number(s.price), is_active: s.is_active,
      provider_id: s.provider_id || '',
    });
  };

  const remove = async (id) => {
    if (!confirm('Delete this service?')) return;
    await api.delete(`/services/${id}`);
    load();
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <section className="lg:col-span-1">
        <div className="card">
          <h2 className="text-lg font-semibold">{editingId ? 'Edit service' : 'New service'}</h2>
          {error && <div className="mt-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">{error}</div>}
          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <div><label className="label">Name</label>
              <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="label">Category</label>
              <input className="input" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            <div><label className="label">Description</label>
              <textarea rows="3" className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Duration (min)</label>
                <input type="number" min="1" className="input" required value={form.duration_min}
                       onChange={(e) => setForm({ ...form, duration_min: e.target.value })} /></div>
              <div><label className="label">Price ($)</label>
                <input type="number" step="0.01" min="0" className="input" required value={form.price}
                       onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
            </div>
            {user.role === 'admin' && (
              <div><label className="label">Provider</label>
                <select className="input" value={form.provider_id || ''} onChange={(e) => setForm({ ...form, provider_id: e.target.value })}>
                  <option value="">(none)</option>
                  {providers.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.email})</option>)}
                </select></div>
            )}
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
              Active
            </label>
            <div className="flex gap-2">
              <button className="btn-primary flex-1">{editingId ? 'Update' : 'Create'}</button>
              {editingId && (
                <button type="button" className="btn-ghost" onClick={() => { setEditingId(null); setForm(empty); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <section className="lg:col-span-2 space-y-3">
        <h1 className="text-2xl font-semibold">
          {user.role === 'provider' ? 'My services' : 'All services'}
        </h1>
        <div className="card p-0 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-slate-500">{s.provider_name || 'No provider'}</div>
                  </td>
                  <td className="px-4 py-3">{s.category}</td>
                  <td className="px-4 py-3">{s.duration_min} min</td>
                  <td className="px-4 py-3">${Number(s.price).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${s.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200'}`}>
                      {s.is_active ? 'yes' : 'no'}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-1">
                    <button onClick={() => startEdit(s)} className="btn-ghost text-xs py-1 px-2">Edit</button>
                    <button onClick={() => remove(s.id)} className="btn-danger text-xs py-1 px-2">Delete</button>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr><td colSpan="6" className="px-4 py-10 text-center text-slate-500">No services yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
