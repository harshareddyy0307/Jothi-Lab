import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');


// Intercept requests to inject JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jyothi_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept responses to log out if token is invalid or expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (localStorage.getItem('jyothi_token')) {
        localStorage.removeItem('jyothi_token');
        localStorage.removeItem('jyothi_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
