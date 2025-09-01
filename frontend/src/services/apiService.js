import axios from 'axios';
import { API_CONFIG, createFormDataHeaders } from '../config/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user') 
      ? JSON.parse(localStorage.getItem('user')).token 
      : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },
};

// Properties API
export const propertiesAPI = {
  getAll: async () => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.PROPERTIES.ALL);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.PROPERTIES.BY_ID(id));
    return response.data;
  },
  
  getMyProperties: async () => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.PROPERTIES.MY_PROPERTIES);
    return response.data;
  },
  
  create: async (propertyData, files = []) => {
    const formData = new FormData();
    formData.append('property', new Blob([JSON.stringify(propertyData)], { 
      type: 'application/json' 
    }));
    
    if (propertyData.ownerId) {
      formData.append('ownerId', String(propertyData.ownerId));
    }
    if (propertyData.listerId) {
      formData.append('listerId', String(propertyData.listerId));
    }
    
    files.forEach(file => formData.append('files', file));
    
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.PROPERTIES.ALL, formData, {
      headers: createFormDataHeaders(),
    });
    return response.data;
  },
  
  update: async (id, propertyData) => {
    const formData = new FormData();
    formData.append('property', new Blob([JSON.stringify(propertyData)], { 
      type: 'application/json' 
    }));
    
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.PROPERTIES.BY_ID(id), formData, {
      headers: createFormDataHeaders(),
    });
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.PROPERTIES.BY_ID(id));
    return response.data;
  },
};

// Customers API
export const customersAPI = {
  getAll: async () => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CUSTOMERS.ALL);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CUSTOMERS.BY_ID(id));
    return response.data;
  },
  
  search: async (query) => {
    const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.CUSTOMERS.SEARCH}?query=${encodeURIComponent(query)}`);
    return response.data;
  },
};

// Business API
export const businessAPI = {
  getById: async (id) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.BUSINESS.BY_ID(id));
    return response.data;
  },
};

export default apiClient;
