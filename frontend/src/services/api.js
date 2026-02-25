import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 5000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('cf_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const url = error.config?.url || '';
            /* Don't redirect to /login when the auth request itself fails —
               that would mask "Invalid credentials" errors */
            if (!url.includes('/auth/')) {
                localStorage.removeItem('cf_token');
                localStorage.removeItem('cf_user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credentials) => api.post('/auth/token', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

export const productAPI = {
    getAll: () => api.get('/products'),
    getById: (id) => api.get(`/products/${id}`),
    create: (product) => api.post('/products', product),
    update: (id, product) => api.put(`/products/${id}`, product),
    delete: (id) => api.delete(`/products/${id}`),
};

export const orderAPI = {
    create: (order) => api.post('/orders', order),
    getAll: () => api.get('/orders'),
    getById: (id) => api.get(`/orders/${id}`),
};

export const metricsAPI = {
    getSystemMetrics: () => api.get('/actuator/metrics'),
    getPodInfo: () => api.get('/actuator/health'),
};

export default api;
