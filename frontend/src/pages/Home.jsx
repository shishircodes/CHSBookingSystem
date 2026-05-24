import { Link } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';
import {
  LuArrowRight, LuStethoscope, LuBrain, LuActivity,
  LuUsers, LuCalendarDays, LuShieldCheck,
  LuClock, LuCircleCheck,
} from 'react-icons/lu';
import { useAuth } from '../store/authStore.js';

const CATEGORIES = [
  { Icon: LuStethoscope,  label: 'General Practice' },
  { Icon: LuBrain,        label: 'Mental Health'     },
  { Icon: LuActivity,     label: 'Physiotherapy'     },
  { Icon: LuUsers,        label: 'Pediatrics'        },
  { Icon: LuShieldCheck,  label: 'Immunisation'      },
  { Icon: LuCalendarDays, label: 'Dietitian'         },
];

const STEPS = [
  { n: '01', title: 'Find a service',       desc: 'Browse GP visits, mental health, physio and more from local providers.' },
  { n: '02', title: 'Book an appointment',  desc: 'Pick a date and time that suits you. Instant confirmation.'             },
  { n: '03', title: 'Get your care',        desc: 'Attend your appointment. Manage or cancel any time from your dashboard.' },
];

export default function Home() {
  const { services } = useLoaderData();
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="bg-white">

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
            Book health services,{' '}
            <span className="text-brand-600">at your convenience.</span>
          </h1>
          <p className="mt-5 text-lg text-slate-500 leading-relaxed max-w-md">
            Find local health providers, schedule appointments, and manage your
            care — all in one place. No phone calls, no waiting rooms.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link to="/services" className="btn-primary px-6 py-3 text-base rounded-xl">
              Browse services
            </Link>
            {isAuthenticated ? (
              <Link
                to={(user?.role === 'admin' || user?.role === 'provider') ? '/dashboard' : '/bookings'}
                className="flex items-center gap-2 text-slate-700 font-medium hover:text-brand-600 transition-colors">
                {user?.role === 'patient' ? 'My bookings' : 'Dashboard'}
                <LuArrowRight />
              </Link>
            ) : (
              <Link to="/register"
                className="flex items-center gap-2 text-slate-700 font-medium hover:text-brand-600 transition-colors">
                Create account <LuArrowRight />
              </Link>
            )}
          </div>
        </div>

        {/* Booking card mockup */}
        <div className="relative flex items-center justify-center py-8">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5 w-72 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                <LuStethoscope className="text-brand-600 text-lg" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-800">General Health Check</p>
                <p className="text-xs text-slate-400">Dr. Jane Wells · 30 min</p>
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500 mb-2">Select a time slot</p>
            <div className="grid grid-cols-3 gap-1.5 mb-4">
              {['9:00 AM', '10:30 AM', '11:00 AM', '1:00 PM', '2:30 PM', '4:00 PM'].map((t, i) => (
                <div key={t}
                  className={`text-xs text-center py-1.5 rounded-lg border cursor-pointer transition-colors ${
                    i === 1
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'border-slate-200 text-slate-600 hover:border-brand-400'
                  }`}>
                  {t}
                </div>
              ))}
            </div>
            <button className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer">
              Confirm Booking
            </button>
          </div>

          <div className="absolute top-2 right-0 bg-white rounded-xl shadow-lg border border-slate-100 px-3 py-2 flex items-center gap-2 z-20">
            <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center">
              <LuCircleCheck className="text-brand-600 text-xs" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">Confirmed!</p>
              <p className="text-[10px] text-slate-400">Tomorrow 10:30 AM</p>
            </div>
          </div>

          <div className="absolute bottom-2 left-0 bg-white rounded-xl shadow-lg border border-slate-100 px-3 py-2 flex items-center gap-2 z-20">
            <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center">
              <LuUsers className="text-brand-600 text-xs" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">500+ Patients</p>
              <p className="text-[10px] text-slate-400">Trust our platform</p>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 blur-3xl opacity-20 bg-brand-500 rounded-full scale-75" />
        </div>
      </section>

      {/* ── Featured services ──────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured services</h2>
            <p className="text-slate-500 text-sm mt-1">Popular starting points</p>
          </div>
          <Link to="/services"
            className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
            View all <LuArrowRight className="text-sm" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {services.map((s) => (
            <article key={s.id}
              className="border border-slate-200 rounded-xl p-5 bg-white hover:shadow-md hover:border-slate-300 transition-all flex flex-col">
              <span className="text-xs font-semibold text-brand-600 mb-3">{s.category}</span>
              <h3 className="font-bold text-slate-800 leading-snug">{s.name}</h3>
              {s.provider_name && (
                <p className="text-xs text-slate-400 mt-1">by {s.provider_name}</p>
              )}
              <p className="text-sm text-slate-500 mt-2 flex-1 line-clamp-2">{s.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <LuClock className="text-xs" /> {s.duration_min} min
                </span>
                <Link to="/services"
                  className="text-sm font-medium px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                  Book now
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Service categories ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Service categories</h2>
          <p className="text-slate-500 mt-2 text-sm">We cover a wide range of community health needs</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map(({ Icon, label }) => (
            <Link key={label} to="/services"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md hover:border-brand-200 transition-all text-center cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                <Icon className="text-xl text-brand-600" />
              </div>
              <span className="text-xs font-medium text-slate-700 leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────── */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900">How it works</h2>
            <p className="text-slate-500 mt-2">Three simple steps to better health access</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="bg-white rounded-xl border border-slate-200 p-6">
                <span className="text-3xl font-black text-brand-100">{n}</span>
                <h3 className="text-lg font-bold text-slate-800 mt-2">{title}</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      {!isAuthenticated && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="bg-brand-600 rounded-2xl p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Ready to get started?</h2>
              <p className="text-brand-100 mt-1">Create a free patient account and book your first appointment today.</p>
            </div>
            <Link to="/register"
              className="shrink-0 bg-white text-brand-700 font-semibold px-6 py-3 rounded-xl hover:bg-brand-50 transition-colors cursor-pointer">
              Create free account
            </Link>
          </div>
        </section>
      )}

      <footer className="border-t border-slate-100 py-6">
        <p className="text-center text-sm text-slate-400">
          chs-booking. Built for ICT 930 Advanced Web Application Development.
        </p>
      </footer>
    </div>
  );
}
