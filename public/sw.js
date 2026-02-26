const CACHE_NAME = 'aquapartes-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/logov8.png',
  '/manifest.json'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('SW: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('SW: Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación y limpieza de caches antiguos
self.addEventListener('activate', (event) => {
  console.log('SW: Activando...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('SW: Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de Cache: Network First (Red primero, luego cache)
// Esta estrategia es más segura para evitar servir contenido obsoleto
self.addEventListener('fetch', (event) => {
  // Solo interceptar peticiones GET
  if (event.request.method !== 'GET') return;

  // Ignorar peticiones de chrome-extension, etc.
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la respuesta es válida, la clonamos y actualizamos el cache
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => {
            // No cachear POST o peticiones con query params dinámicos agresivamente
            // pero para una PWA simple, cachear recursos estáticos está bien.
            // Aquí usamos un enfoque simple.
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // Si falla la red, intentamos servir desde cache
        console.log('SW: Red falló, buscando en cache:', event.request.url);
        return caches.match(event.request);
      })
  );
});
