import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Analytics } from '@vercel/analytics/react';

// Forzar limpieza del Service Worker problemático
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Desregistrar cualquier SW existente
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        console.log('Desregistrando SW existente:', registration.scope);
        await registration.unregister();
      }
      
      // Registrar el nuevo SW de limpieza
      const registration = await navigator.serviceWorker.register('/sw.js', {
        updateViaCache: 'none' // No usar cache para el SW
      });
      
      console.log('SW de limpieza registrado:', registration);
      
      // Forzar actualización si hay uno esperando
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      
    } catch (error) {
      console.log('Error manejando SW:', error);
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <App />
      <Analytics />
  </React.StrictMode>,
);
