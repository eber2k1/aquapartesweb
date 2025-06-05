import React, { createContext, useState, useCallback } from 'react';
import Notification from '../components/Notification/Notification';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message) => {
    // Limpiar cualquier notificación existente antes de mostrar una nueva
    setNotification(null);
    
    // Usar setTimeout para asegurar que el estado se actualice correctamente
    setTimeout(() => {
      setNotification({ 
        message, 
        id: Date.now() 
      });
    }, 100);
  }, []);

  const closeNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <Notification 
          key={notification.id}
          message={notification.message} 
          onClose={closeNotification} 
        />
      )}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
