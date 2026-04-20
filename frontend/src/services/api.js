import axios from 'axios';
import { authService } from './authService.js';

let isRefreshing   = false;
let failedQueue    = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => error ? prom.reject(error) : prom.resolve(token));
  failedQueue = [];
};

const api = axios.create({
  baseURL:  import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers:  { 'Content-Type': 'application/json' },
  timeout:  15000,
});

// Attach token to every request
api.interceptors.request.use((config) => {
  try {
    const session = authService.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (_) {}
  return config;
});

// Auto-refresh expired token, then retry original request
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        }).catch(e => Promise.reject(e));
      }

      original._retry  = true;
      isRefreshing     = true;

      try {
        const data  = await authService.refreshToken();
        const token = data.session?.access_token;
        processQueue(null, token);
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        authService.logout();
window
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
