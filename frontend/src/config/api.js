// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
    },
    PROPERTIES: {
      ALL: '/api/properties',
      BY_ID: (id) => `/api/properties/${id}`,
      MY_PROPERTIES: '/api/properties/my-properties',
    },
    CUSTOMERS: {
      ALL: '/api/customers',
      BY_ID: (id) => `/api/customers/${id}`,
      SEARCH: '/api/customers/search',
    },
    BUSINESS: {
      BY_ID: (id) => `/api/business/${id}`,
    },
  },
  HEADERS: {
    CONTENT_TYPE: 'application/json',
    AUTHORIZATION: (token) => `Bearer ${token}`,
  },
};

// API utility functions
export const createApiUrl = (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`;

export const createAuthHeaders = (token) => ({
  'Content-Type': API_CONFIG.HEADERS.CONTENT_TYPE,
  'Authorization': API_CONFIG.HEADERS.AUTHORIZATION(token),
});

export const createFormDataHeaders = (token) => ({
  'Authorization': API_CONFIG.HEADERS.AUTHORIZATION(token),
});
