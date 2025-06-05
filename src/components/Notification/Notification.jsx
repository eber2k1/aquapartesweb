import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'react-feather';
import styled from 'styled-components';
import { NotificationContext } from '../../context/NotificationContext.jsx';

const NotificationContainer = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  background: #4CAF50;
  color: white;
  padding: 15px 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-width: 320px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const Notification = ({ message, onClose }) => {
  // Manejador para el cierre manual
  const handleClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  // Cierre automático después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <NotificationContainer
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      onClick={(e) => e.stopPropagation()}
    >
      <CheckCircle size={20} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1, margin: '0 10px' }}>{message}</span>
      <CloseButton 
        onClick={handleClose} 
        aria-label="Cerrar notificación"
      >
        <X size={18} />
      </CloseButton>
    </NotificationContainer>
  );
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message) => {
    setNotification({ message, id: Date.now() });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <AnimatePresence>
        {notification && (
          <Notification
            key={notification.id}
            message={notification.message}
            onClose={closeNotification}
          />
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
};

export default Notification;
