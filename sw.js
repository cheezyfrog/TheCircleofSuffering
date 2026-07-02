const cacheName = 'circle-of-suffering-v3';

// We only cache the bare minimum web files needed to make the PWA installable
const basicFiles = [
  './', 
  './index.html', 
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      // Safely try to cache each file individually so a missing file won't crash the app
      return Promise.allSettled(basicFiles.map(file => cache.add(file)));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => key !== cacheName ? caches.delete(key) : null));
    }).then(() => self.clients.claim())
  );
});

// THE SECURITY BYPASS:
self.addEventListener('fetch', e => {
  const requestUrl = new URL(e.request.url);

  // If the app is requesting an external CDN file (like VexFlow), 
  // we exit immediately and let the browser load it normally over the internet.
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  // For your regular local files, pull from the network first
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
