import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../store/authStore.js';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useAuth((s) => s.setUser);

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      setUser(data.user);
      const dest = location.state?.from?.pathname || '/';
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="card border-slate-200 shadow-sm">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-slate-600 text-sm mt-1">Welcome back.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">{error}</div>}
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" required className="input"
                   value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" required className="input"
                   value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-sm text-slate-600 mt-4">
          No account? <Link to="/register" className="text-brand-700 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
