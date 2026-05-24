import { createBrowserRouter, Navigate } from 'react-router-dom';

import PublicLayout    from './components/PublicLayout.jsx';
import DashboardLayout from './pages/dashboard/DashboardLayout.jsx';
import Home            from './pages/Home.jsx';
import Login           from './pages/Login.jsx';
import Register        from './pages/Register.jsx';
import Services        from './pages/Services.jsx';
import Bookings        from './pages/Bookings.jsx';
import ManageServices  from './pages/ManageServices.jsx';
import AdminUsers      from './pages/AdminUsers.jsx';
import Overview        from './pages/dashboard/Overview.jsx';
import NotFound        from './pages/NotFound.jsx';

import {
  staffGuard,
  homeLoader, servicesLoader,
  patientBookingsLoader,
  overviewLoader, bookingsLoader,
  manageServicesLoader, adminUsersLoader,
} from './loaders.js';

const router = createBrowserRouter([

  // ── Dashboard (provider + admin) ─────────────────────────────────────
  // staffGuard runs first; child loaders run in parallel after it succeeds.
  {
    path: '/dashboard',
    loader: staffGuard,
    element: <DashboardLayout />,
    children: [
      { index: true,      element: <Overview />,       loader: overviewLoader       },
      { path: 'bookings', element: <Bookings />,       loader: bookingsLoader       },
      { path: 'services', element: <ManageServices />, loader: manageServicesLoader },
      { path: 'users',    element: <AdminUsers />,     loader: adminUsersLoader     },
    ],
  },

  // ── Public / patient layout ───────────────────────────────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: '/',         element: <Home />,     loader: homeLoader            },
      { path: '/login',    element: <Login />                                   },
      { path: '/register', element: <Register />                                },
      { path: '/services', element: <Services />, loader: servicesLoader        },
      { path: '/bookings', element: <Bookings />, loader: patientBookingsLoader },
      { path: '/404',      element: <NotFound />                                },
      { path: '*',         element: <Navigate to="/404" replace />              },
    ],
  },

]);

export default router;
