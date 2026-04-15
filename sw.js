const CACHE_NAME = 'player-list-cache-v2';
const urlsToCache = [
  './',
  'index.html',
  'manifest.json',
  'icon-192.png', // Обов'язково додай назви своїх файлів іконок
  'icon-512.png'
];

// Встановлення
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Активація
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Обробка запитів (Стратегія: мережа з відкатом на кеш)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then(response => {
        if (response) {
          return response;
        }
        // Якщо це перехід на головну сторінку, повертаємо index.html
        if (event.request.mode === 'navigate') {
          return caches.match('index.html');
        }
      });
    })
  );
});
