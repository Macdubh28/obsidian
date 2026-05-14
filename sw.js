const CACHE = 'obsidian-v4';
const ASSETS = [
  '/obsidian/',
  '/obsidian/index.html',
  '/obsidian/accord-1.html',
  '/obsidian/accord-2.html',
  '/obsidian/accord-3.html',
  '/obsidian/accord-4.html',
  '/obsidian/accord-5.html',
  '/obsidian/citations.html',
  '/obsidian/convergence.html',
  '/obsidian/journal.html',
  '/obsidian/meditation.html',
  '/obsidian/progression.html',
  '/obsidian/manifest.json',
  '/obsidian/favicon.png',
  '/obsidian/icons/icon-192.png',
  '/obsidian/icons/icon-512.png'
];

// Install — precache all assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate — purge old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — NETWORK FIRST HTML, CACHE FIRST assets
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);
  const isHTML = e.request.headers.get('accept')?.includes('text/html');
  const isAsset = /\.(png|jpg|jpeg|svg|ico|css|js|json|woff2?)$/.test(url.pathname);

  if (isHTML) {
    e.respondWith(
      fetch(e.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return response;
        })
        .catch(() => caches.match(e.request))
    );
  } else if (isAsset) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return response;
        });
      })
    );
  } else {
    e.respondWith(
      fetch(e.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return response;
        })
        .catch(() => caches.match(e.request))
    );
  }
});
