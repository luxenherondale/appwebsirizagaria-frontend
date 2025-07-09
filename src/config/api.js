/**
 * Configuración de la API para Siriza Agaria
 * Este archivo centraliza la configuración de la conexión al backend
 */

// URL base de la API
// En desarrollo local, apunta al servidor Express en el puerto 5000
// En producción, se usa la URL del servidor desplegado
export const API_URL = 'https://api.appsirizagaria.mooo.com/api';

// Configuración para las peticiones fetch
export const fetchConfig = {
  headers: {
    'Content-Type': 'application/json'
  }
};

/**
 * Añade el token de autenticación a la configuración de fetch
 * @param {Object} config - Configuración base de fetch
 * @returns {Object} Configuración con token incluido
 */
export const authConfig = (config = {}) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return { ...fetchConfig, ...config };
  }
  
  return {
    ...fetchConfig,
    ...config,
    headers: {
      ...fetchConfig.headers,
      ...(config.headers || {}),
      'x-auth-token': token
    }
  };
};

/**
 * Rutas de la API
 */
export const API_ROUTES = {
  // Autenticación
  AUTH: {
    LOGIN: `${API_URL}/auth/login`,
    REGISTER: `${API_URL}/auth/register`,
    ME: `${API_URL}/auth/me`
  },
  // Usuarios
  USERS: {
    BASE: `${API_URL}/users`,
    BY_ID: (id) => `${API_URL}/users/${id}`
  },
  // Libros
  BOOKS: {
    BASE: `${API_URL}/books`,
    STATS: `${API_URL}/books/stats`,
    BY_ID: (id) => `${API_URL}/books/${id}`
  },
  // Gastos
  EXPENSES: {
    BASE: `${API_URL}/expenses`,
    STATS: `${API_URL}/expenses/stats`,
    BY_ID: (id) => `${API_URL}/expenses/${id}`
  },
  // Estado del servidor
  HEALTH: `${API_URL}/health`
};

/**
 * Maneja errores de las peticiones a la API
 * @param {Response} response - Respuesta de fetch
 * @returns {Promise} Promesa con los datos o error
 */
export const handleApiResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // Si hay un error 401 (no autorizado), limpiar el token
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    throw new Error(data.message || 'Error en la petición a la API');
  }
  
  return data;
};

export default {
  API_URL,
  fetchConfig,
  authConfig,
  API_ROUTES,
  handleApiResponse
};
