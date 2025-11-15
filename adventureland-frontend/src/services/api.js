import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:8082';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error('An error occurred. Please try again.');
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  customerLogin: async (email, password) => {
    const response = await api.get('/customers/signIn', {
      auth: {
        username: email,
        password: password,
      },
    });
    const token = response.headers.authorization || response.headers.Authorization;
    if (token) {
      localStorage.setItem('token', token.replace('Bearer ', ''));
      localStorage.setItem('user', JSON.stringify({ ...response.data, role: 'CUSTOMER' }));
    }
    return response.data;
  },

  adminLogin: async (email, password) => {
    const response = await api.get('/admin/signIn', {
      auth: {
        username: email,
        password: password,
      },
    });
    const token = response.headers.authorization || response.headers.Authorization;
    if (token) {
      localStorage.setItem('token', token.replace('Bearer ', ''));
      localStorage.setItem('user', JSON.stringify({ ...response.data, role: 'ADMIN' }));
    }
    return response.data;
  },

  customerRegister: (data) => api.post('/customers/register', data),
  adminRegister: (data) => api.post('/admin/register', data),
  forgotPassword: (data) => api.post('/forgot-password', data),
  resetPassword: (data) => api.post('/reset-password', data),
};

// Customer APIs
export const customerAPI = {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
  update: (data) => api.put('/customers', data),
  delete: (id) => api.delete(`/customers?customerId=${id}`),
};

// Admin APIs
export const adminAPI = {
  getAll: () => api.get('/admin'),
  update: (data) => api.patch('/admin', data),
  delete: (id) => api.delete(`/admin/${id}`),
};

// Activity APIs
export const activityAPI = {
  getAll: () => api.get('/activities'),
  create: (data) => api.post('/activities', data),
  update: (id, data) => api.put(`/activities/${id}`, data),
  delete: (id) => api.delete(`/activities/${id}`),
};

// Ticket APIs
export const ticketAPI = {
  book: (activityId, dateTime) => {
    const params = new URLSearchParams({ activityId });
    if (dateTime) {
      params.append('dateTime', dateTime);
    }
    return api.post(`/tickets?${params.toString()}`);
  },
  cancel: (ticketId) => api.post(`/tickets/${ticketId}`),
  getByCustomer: (customerId) => api.get(`/tickets/${customerId}`),
  calculateBill: () => api.get('/tickets'),
};

export default api;

