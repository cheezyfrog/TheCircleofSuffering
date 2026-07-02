const cacheName = 'circle-of-suffering-v2';
const staticAssets = [
  './', 
  './index.html', 
  './app.js', 
  './style.css', 
  './manifest.json',
  './icon-512.png'
];

// Install stage: only cache local layout files
self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

// Activate stage: clean out old broken caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Smarter fetch engine: tries network first, falls back to cache if offline
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
