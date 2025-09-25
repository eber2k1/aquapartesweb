import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Analytics } from '@vercel/analytics/react';

// DESACTIVAR Service Worker completamente
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Desregistrar TODOS los Service Workers
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        console.log('Eliminando SW:', registration.scope);
        await registration.unregister();
      }
      console.log('Todos los Service Workers eliminados');
    } catch (error) {
      console.log('Error eliminando SW:', error);
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <App />
      <Analytics />
  </React.StrictMode>,
);
