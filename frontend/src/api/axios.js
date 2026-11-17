import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: apiBaseUrl,
});

export const assetUrl = (assetPath) => {
  if (!assetPath || /^(https?:|data:|blob:)/i.test(assetPath)) return assetPath;
  const apiOrigin = import.meta.env.VITE_API_BASE_URL
    ? new URL(import.meta.env.VITE_API_BASE_URL).origin
    : '';
  return `${apiOrigin}${assetPath.startsWith('/') ? assetPath : `/${assetPath}`}`;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('service-snaps-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

