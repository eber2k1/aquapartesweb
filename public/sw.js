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

// Service Worker agresivo para limpiar cache problemático
const CLEANUP_VERSION = 'cleanup-v2';

self.addEventListener('install', (event) => {
  console.log('SW: Forzando instalación inmediata...');
  // Forzar activación inmediata sin esperar
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('SW: Limpieza agresiva iniciada...');
  event.waitUntil(
    Promise.all([
      // Limpiar TODAS las caches sin excepción
      caches.keys().then((cacheNames) => {
        console.log('SW: Caches encontradas:', cacheNames);
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('SW: Eliminando cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }),
      // Tomar control de todas las pestañas inmediatamente
      self.clients.claim(),
      // Recargar todas las pestañas abiertas
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          console.log('SW: Recargando cliente:', client.url);
          client.navigate(client.url);
        });
      })
    ]).then(() => {
      console.log('SW: Limpieza completada, auto-desregistrando...');
      // Auto-desregistrarse después de limpiar
      return self.registration.unregister();
    })
  );
});

// NO interceptar ninguna petición
self.addEventListener('fetch', () => {
  // Dejar que todas las peticiones pasen directamente al servidor
});