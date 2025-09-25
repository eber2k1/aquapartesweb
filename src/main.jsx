import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Analytics } from '@vercel/analytics/react';

// Comentar temporalmente el Service Worker
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then((registration) => {
//         console.log('SW registrado: ', registration);
//       })
//       .catch((registrationError) => {
//         console.log('SW registro falló: ', registrationError);
//       });
//   });
// }

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <App />
      <Analytics />
  </React.StrictMode>,
);
