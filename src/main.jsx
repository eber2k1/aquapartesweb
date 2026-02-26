import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Analytics } from '@vercel/analytics/react';

// ACTIVAR Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registrado con éxito:', registration.scope);
      })
      .catch((error) => {
        console.log('Fallo al registrar SW:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <App />
      <Analytics />
  </React.StrictMode>,
);
