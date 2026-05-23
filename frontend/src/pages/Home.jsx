import { Link } from 'react-router-dom';
import { useAuth } from '../store/authStore.js';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-xl p-8 sm:p-12">
        <h1 className="text-3xl sm:text-4xl font-bold">Community Health Services</h1>
        <p className="mt-3 max-w-2xl text-brand-50">
          Book GP visits, mental-health counselling, physiotherapy, immunisations and more from
          local community health providers — all in one place.
        </p>
        <div className="mt-6 flex gap-3">
          <Link to="/services" className="btn bg-white text-brand-700 hover:bg-slate-100">Browse services</Link>
          {!isAuthenticated && (
            <Link to="/register" className="btn bg-brand-500/30 hover:bg-brand-500/50 text-white border border-white/40">
              Create an account
            </Link>
          )}
        </div>
      </section>

      {isAuthenticated && (
        <section className="card">
          <h2 className="text-xl font-semibold">Welcome back, {user?.name}.</h2>
          <p className="text-slate-600 mt-1">
            You are signed in as a <span className="font-medium">{user?.role}</span>.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {user?.role === 'patient' && (
              <>
                <Link to="/bookings" className="btn-ghost">My bookings</Link>
                <Link to="/services" className="btn-primary">Book a service</Link>
              </>
            )}
            {(user?.role === 'provider' || user?.role === 'admin') && (
              <Link to="/dashboard" className="btn-primary">Open dashboard</Link>
            )}
          </div>
        </section>
      )}

      <section className="grid sm:grid-cols-3 gap-4">
        {[
          ['Easy booking',  'Pick a service, choose a time, done.'],
          ['Role-based access','Separate views for patients, providers and admins.'],
          ['Secure',        'JWT auth, hashed passwords, role-guarded APIs.'],
        ].map(([t, d]) => (
          <div key={t} className="card">
            <h3 className="font-semibold">{t}</h3>
            <p className="text-sm text-slate-600 mt-1">{d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
