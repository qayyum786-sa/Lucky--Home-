import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const buyAPI = {
  getAll: (params) => api.get('/buy-properties', { params }),
  getOne: (id) => api.get(`/buy-properties/${id}`),
  create: (data) => api.post('/buy-properties', data),
  update: (id, data) => api.put(`/buy-properties/${id}`, data),
  remove: (id) => api.delete(`/buy-properties/${id}`),
};

export const rentAPI = {
  getAll: (params) => api.get('/rent-properties', { params }),
  getOne: (id) => api.get(`/rent-properties/${id}`),
  create: (data) => api.post('/rent-properties', data),
  update: (id, data) => api.put(`/rent-properties/${id}`, data),
  remove: (id) => api.delete(`/rent-properties/${id}`),
};

export const contactAPI = {
  submit: (data) => api.post('/contact', data),
  getAll: (params) => api.get('/contact', { params }),
  getOne: (id) => api.get(`/contact/${id}`),
  updateStatus: (id, status) => api.patch(`/contact/${id}/status`, { status }),
};

export const usersAPI = {
  getAll: () => api.get('/users'),
  getStats: () => api.get('/users/stats'),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  remove: (id) => api.delete(`/users/${id}`),
};

export const uploadAPI = {
  images: (formData) => api.post('/upload/images', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  documents: (formData) => api.post('/upload/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export default api;
