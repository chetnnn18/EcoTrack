import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('wastewise_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('wastewise_token');
      localStorage.removeItem('wastewise_user');
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error, fallback = 'Something went wrong') =>
  error.response?.data?.message || error.message || fallback;

export const assetUrl = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_ORIGIN}${url}`;
};

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  resendOTP: (email) => api.post('/auth/resend-otp', { email }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  changePassword: (data) => api.patch('/auth/change-password', data),
  getMe: () => api.get('/auth/me')
};

export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard'),
  getReports: (params) => api.get('/dashboard/reports', { params }),
  createReport: (data) => api.post('/dashboard/reports', data),
  cancelReport: (id) => api.patch(`/dashboard/reports/${id}/cancel`),
  updateProfile: (data) => api.patch('/dashboard/profile', data)
};

export const uploadAPI = {
  uploadImages: (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getReports: (params) => api.get('/admin/reports', { params }),
  updateReportStatus: (id, data) => api.patch(`/admin/reports/${id}/status`, data),
  rejectReport: (id, reason) => api.patch(`/admin/reports/${id}/reject`, { reason }),
  getCollectors: () => api.get('/admin/collectors'),
  getUsers: (role) => api.get('/admin/users', { params: role ? { role } : {} }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`)
};

export const binAPI = {
  getBins: () => api.get('/bins'),
  createBin: (data) => api.post('/bins', data),
  updateBin: (id, data) => api.patch(`/bins/${id}`, data),
  deleteBin: (id) => api.delete(`/bins/${id}`)
};

export default api;
