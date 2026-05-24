import { useState } from 'react';
import { useLoaderData, useRevalidator } from 'react-router-dom';
import { LuUserPlus, LuTrash2 } from 'react-icons/lu';
import api from '../api/client.js';

const emptyForm = { name: '', email: '', password: '', phone: '', role: 'patient' };

export default function AdminUsers() {
  const { users } = useLoaderData();
  const { revalidate } = useRevalidator();
  const [form, setForm]   = useState(emptyForm);
  const [error, setError] = useState('');

  const createUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/users', form);
      setForm(emptyForm);
      revalidate();
    } catch (err) {
      const issues = err.response?.data?.issues;
      setError(issues ? issues.map((i) => `${i.path}: ${i.message}`).join(', ') : err.response?.data?.error || 'Create failed');
    }
  };

  const updateRole = async (id, role) => {
    await api.put(`/users/${id}`, { role });
    revalidate();
  };

  const remove = async (id) => {
    if (!confirm('Delete this user?')) return;
    await api.delete(`/users/${id}`);
    revalidate();
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <section className="lg:col-span-1">
        <div className="card">
          <h2 className="text-lg font-semibold">Add user</h2>
          {error && <div className="mt-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">{error}</div>}
          <form onSubmit={createUser} className="mt-4 space-y-3">
            <div><label className="label">Name</label>
              <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="label">Email</label>
              <input type="email" className="input" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div><label className="label">Password</label>
              <input type="password" className="input" required minLength={6}
                     value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            <div><label className="label">Role</label>
              <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="patient">patient</option>
                <option value="provider">provider</option>
                <option value="admin">admin</option>
              </select></div>
            <button className="btn-primary w-full gap-1.5"><LuUserPlus /> Create user</button>
          </form>
        </div>
      </section>

      <section className="lg:col-span-2">
        <h1 className="text-2xl font-semibold mb-3">Users</h1>
        <div className="card p-0 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <select className="input py-1 text-xs w-32" value={u.role} onChange={(e) => updateRole(u.id, e.target.value)}>
                      <option value="patient">patient</option>
                      <option value="provider">provider</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">{u.phone || '-'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => remove(u.id)} className="btn-danger text-xs py-1 px-2 gap-1">
                      <LuTrash2 className="text-sm" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan="5" className="px-4 py-10 text-center text-slate-500">No users.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
