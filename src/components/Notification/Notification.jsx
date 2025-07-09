import React, { useState, useEffect } from 'react';
import './Notification.css';

/**
 * Componente de notificación para mostrar mensajes temporales
 * @param {Object} props - Propiedades del componente
 * @param {string} props.type - Tipo de notificación ('success', 'error', 'warning', 'info')
 * @param {string} props.message - Mensaje a mostrar
 * @param {boolean} props.show - Indica si la notificación debe mostrarse
 * @param {function} props.onClose - Función para cerrar la notificación
 * @param {number} props.duration - Duración en ms antes de que la notificación se cierre automáticamente (0 para no cerrar)
 * @returns {React.ReactElement|null} Componente Notification
 */
const Notification = ({ type = 'info', message, show, onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      // Si hay una duración definida, configurar el temporizador para cerrar
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        
        // Limpiar el temporizador si el componente se desmonta o cambian las props
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [show, duration]);

  const handleClose = () => {
    setIsVisible(false);
    // Esperar a que termine la animación antes de llamar a onClose
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  if (!show && !isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={`notification notification-${type} ${isVisible ? 'show' : 'hide'}`}>
      <div className="notification-icon">{getIcon()}</div>
      <div className="notification-message">{message}</div>
      <button className="notification-close" onClick={handleClose}>×</button>
    </div>
  );
};

export default Notification;
