import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from '../components/Notification/Notification';

// Crear el contexto
const NotificationContext = createContext();

/**
 * Hook personalizado para usar el contexto de notificaciones
 * @returns {Object} Métodos y propiedades del contexto
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe ser usado dentro de un NotificationProvider');
  }
  return context;
};

/**
 * Proveedor del contexto de notificaciones
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {React.ReactElement} Proveedor del contexto
 */
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    show: false,
    type: 'info',
    message: '',
    duration: 3000
  });

  /**
   * Muestra una notificación
   * @param {string} type - Tipo de notificación ('success', 'error', 'warning', 'info')
   * @param {string} message - Mensaje a mostrar
   * @param {number} duration - Duración en ms (0 para no cerrar automáticamente)
   */
  const showNotification = useCallback((type, message, duration = 3000) => {
    setNotification({
      show: true,
      type,
      message,
      duration
    });
  }, []);

  /**
   * Oculta la notificación actual
   */
  const hideNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      show: false
    }));
  }, []);

  /**
   * Muestra una notificación de éxito
   * @param {string} message - Mensaje a mostrar
   * @param {number} duration - Duración en ms
   */
  const success = useCallback((message, duration) => {
    showNotification('success', message, duration);
  }, [showNotification]);

  /**
   * Muestra una notificación de error
   * @param {string} message - Mensaje a mostrar
   * @param {number} duration - Duración en ms
   */
  const error = useCallback((message, duration) => {
    showNotification('error', message, duration);
  }, [showNotification]);

  /**
   * Muestra una notificación de advertencia
   * @param {string} message - Mensaje a mostrar
   * @param {number} duration - Duración en ms
   */
  const warning = useCallback((message, duration) => {
    showNotification('warning', message, duration);
  }, [showNotification]);

  /**
   * Muestra una notificación informativa
   * @param {string} message - Mensaje a mostrar
   * @param {number} duration - Duración en ms
   */
  const info = useCallback((message, duration) => {
    showNotification('info', message, duration);
  }, [showNotification]);

  const value = {
    showNotification,
    hideNotification,
    success,
    error,
    warning,
    info
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Notification
        type={notification.type}
        message={notification.message}
        show={notification.show}
        onClose={hideNotification}
        duration={notification.duration}
      />
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
