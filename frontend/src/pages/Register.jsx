import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../store/authStore.js';

export default function Register() {
  const navigate = useNavigate();
  const setUser = useAuth((s) => s.setUser);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      setUser(data.user);
      navigate('/', { replace: true });
    } catch (err) {
      const issues = err.response?.data?.issues;
      setError(issues ? issues.map((i) => `${i.path}: ${i.message}`).join(', ') : err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h1 className="text-2xl font-semibold">Create an account</h1>
        <p className="text-slate-600 text-sm mt-1">Register as a patient to book services.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">{error}</div>}
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <input id="name" required className="input" value={form.name} onChange={update('name')} />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" required className="input" value={form.email} onChange={update('email')} />
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone (optional)</label>
            <input id="phone" className="input" value={form.phone} onChange={update('phone')} />
          </div>
          <div>
            <label className="label" htmlFor="password">Password (min 6)</label>
            <input id="password" type="password" required minLength={6} className="input"
                   value={form.password} onChange={update('password')} />
          </div>
          <button disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-slate-600 mt-4">
          Already have an account? <Link to="/login" className="text-brand-700 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
