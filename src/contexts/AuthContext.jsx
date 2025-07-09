import { createContext, useState, useContext, useEffect } from 'react';
import MainApi from '../utils/MainApi';
import { useNotification } from './NotificationContext';

// Crear el contexto de autenticación
const AuthContext = createContext();

/**
 * Hook personalizado para usar el contexto de autenticación
 * @returns {Object} Contexto de autenticación
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * Proveedor del contexto de autenticación
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {React.ReactElement} Proveedor del contexto
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { success, error: showError } = useNotification();
  
  // Instancia de MainApi para operaciones de autenticación
  const api = new MainApi();

  /**
   * Inicializa el estado del usuario desde localStorage al cargar la aplicación
   */
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error al parsear usuario almacenado:', e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Registra un nuevo usuario
   * @param {Object} userData - Datos del usuario a registrar
   * @returns {Promise<Object>} Usuario registrado
   */
  const register = async (userData) => {
    setError(null);
    try {
      const data = await api.register(userData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      success('Usuario registrado correctamente');
      return data.user;
    } catch (err) {
      const errorMessage = err.message || 'Error al registrar usuario';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    }
  };

  /**
   * Inicia sesión con credenciales
   * @param {string} email - Correo electrónico
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} Usuario autenticado
   */
  const login = async (email, password) => {
    setError(null);
    try {
      const data = await api.login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      success('Inicio de sesión exitoso');
      return data.user;
    } catch (err) {
      const errorMessage = err.message || 'Error al iniciar sesión';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    }
  };

  /**
   * Cierra la sesión del usuario actual
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    success('Sesión cerrada correctamente');
  };

  const value = {
    user,
    error,
    loading,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
