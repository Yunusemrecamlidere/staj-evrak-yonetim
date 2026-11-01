import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7000/api', // backend hazır olunca güncellenecek
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLoginRequest = err.config?.url?.includes('/auth/login');

    if (err.response?.status === 401 && !isLoginRequest) {
      localStorage.clear();
      window.location.href = '/login';
    }
    if (err.response?.status === 403) {
      window.location.href = '/forbidden';
    }
    return Promise.reject(err);
  }
);

export default api;