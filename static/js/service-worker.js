const CACHE_NAME = 'close-connect-v2';
const urlsToCache = [
  '/',
  '/static/css/styles.css',
  '/static/css/friends.css',
  '/static/css/explore.css',
  '/static/css/chat.css',
  '/static/js/chat.js',
  '/static/images/connect.png',
  '/static/images/icon-192x192.png',
  '/static/images/icon-512x512.png',
  '/static/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if found
        if (response) {
          return response;
        }
        // Otherwise fetch from network
        return fetch(event.request);
      })
  );
});