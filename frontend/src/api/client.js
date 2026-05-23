import axios from 'axios';
import { useAuth } from '../store/authStore.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const url = err.config?.url || '';
    // Don't auto-clear on the initial /auth/me probe — it's expected to 401 when logged out.
    if (err.response?.status === 401 && !url.endsWith('/auth/me')) {
      useAuth.getState().clear();
    }
    return Promise.reject(err);
  }
);

export default api;
