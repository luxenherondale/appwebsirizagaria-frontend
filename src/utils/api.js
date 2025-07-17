import axios from 'axios';

// URL base de la API
const API_URL = 'https://api.appsirizagaria.mooo.com/api';

// Cliente axios con configuración base
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir el token de autenticación a las peticiones
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Funciones de API para diferentes módulos

// Autenticación
export const authAPI = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  logout: () => apiClient.post('/auth/logout'),
  getCurrentUser: () => apiClient.get('/auth/me')
};

// Gestión de Stock
export const stockAPI = {
  getBooks: () => apiClient.get('/books'),
  getBook: (id) => apiClient.get(`/books/${id}`),
  createBook: (bookData) => apiClient.post('/books', bookData),
  updateBook: (id, bookData) => apiClient.put(`/books/${id}`, bookData),
  deleteBook: (id) => apiClient.delete(`/books/${id}`),
  getBookStats: () => apiClient.get('/books/stats')
};

// Contabilidad
export const accountingAPI = {
  getTransactions: () => apiClient.get('/accounting/transactions'),
  createTransaction: (data) => apiClient.post('/accounting/transactions', data),
  getReports: (period) => apiClient.get(`/accounting/reports?period=${period}`)
};

// Proyectos
export const projectsAPI = {
  getProjects: () => apiClient.get('/projects'),
  getProject: (id) => apiClient.get(`/projects/${id}`),
  createProject: (projectData) => apiClient.post('/projects', projectData),
  updateProject: (id, projectData) => apiClient.put(`/projects/${id}`, projectData),
  deleteProject: (id) => apiClient.delete(`/projects/${id}`)
};

// Cotizaciones
export const quotesAPI = {
  getQuotes: () => apiClient.get('/quotes'),
  getQuote: (id) => apiClient.get(`/quotes/${id}`),
  createQuote: (quoteData) => apiClient.post('/quotes', quoteData),
  updateQuote: (id, quoteData) => apiClient.put(`/quotes/${id}`, quoteData),
  deleteQuote: (id) => apiClient.delete(`/quotes/${id}`)
};

// Marketing/Bookfluencers
export const marketingAPI = {
  getInfluencers: () => apiClient.get('/marketing/influencers'),
  getCampaigns: () => apiClient.get('/marketing/campaigns'),
  createCampaign: (campaignData) => apiClient.post('/marketing/campaigns', campaignData)
};

// Stock Externo
export const externalStockAPI = {
  getLocations: () => apiClient.get('/external-stock/locations'),
  getStockByLocation: (locationId) => apiClient.get(`/external-stock/locations/${locationId}`),
  updateStockAtLocation: (locationId, stockData) => apiClient.put(`/external-stock/locations/${locationId}`, stockData)
};

// Exportar el cliente para casos de uso personalizados
export default apiClient;