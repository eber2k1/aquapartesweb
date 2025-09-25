const CACHE_NAME = 'aquapartes-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/logov8.png'
];

// Service Worker que se auto-destruye para limpiar el cache problemático
self.addEventListener('install', () => {
  console.log('SW: Instalando nuevo service worker para limpiar cache...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('SW: Activando y limpiando todas las caches...');
  event.waitUntil(
    Promise.all([
      // Limpiar todas las caches existentes
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('SW: Eliminando cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }),
      // Tomar control inmediatamente
      self.clients.claim(),
      // Auto-desregistrarse después de limpiar
      self.registration.unregister().then(() => {
        console.log('SW: Service Worker desregistrado exitosamente');
      })
    ])
  );
});

// No interceptar ninguna petición - dejar que pasen directamente al servidor
self.addEventListener('fetch', () => {
  // No hacer nada - dejar que todas las peticiones pasen al servidor
  return;
});