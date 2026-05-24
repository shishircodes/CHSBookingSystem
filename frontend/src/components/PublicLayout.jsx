import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';

export default function PublicLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {isHome ? (
          <Outlet />
        ) : (
          <div className="max-w-6xl mx-auto px-6 py-8">
            <Outlet />
          </div>
        )}
      </main>
      {!isHome && (
        <footer className="border-t border-slate-100 py-4 text-center text-sm text-slate-400">
          chs-booking · ICT 930 Advanced Web Application Development
        </footer>
      )}
    </div>
  );
}
