import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import api from './api/client.js';
import { useAuth } from './store/authStore.js';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Services from './pages/Services.jsx';
import Bookings from './pages/Bookings.jsx';
import ManageServices from './pages/ManageServices.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import DashboardLayout from './pages/dashboard/DashboardLayout.jsx';
import Overview from './pages/dashboard/Overview.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  const { setUser, clear, isLoading } = useAuth();

  useEffect(() => {
    api.get('/auth/me')
      .then((r) => setUser(r.data.user))
      .catch(() => clear());
  }, [setUser, clear]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<Services />} />

          <Route path="/bookings" element={
            <ProtectedRoute roles={['patient']}><Bookings /></ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute roles={['provider', 'admin']}><DashboardLayout /></ProtectedRoute>
          }>
            <Route index             element={<Overview />} />
            <Route path="bookings"   element={<Bookings />} />
            <Route path="services"   element={<ManageServices />} />
            <Route path="users"      element={
              <ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>
            } />
          </Route>

          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-sm text-slate-500">
        Community Health Services Booking System &mdash; ICT 930
      </footer>
    </div>
  );
}
