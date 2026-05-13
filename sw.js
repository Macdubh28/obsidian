const CACHE = 'obsidian-v3';
const ASSETS = [
  '/obsidian/',
  '/obsidian/index.html',
  '/obsidian/accord-1.html',
  '/obsidian/accord-2.html',
  '/obsidian/accord-3.html',
  '/obsidian/accord-4.html',
  '/obsidian/accord-5.html',
  '/obsidian/citations.html',
  '/obsidian/journal.html',
  '/obsidian/meditation.html',
  '/obsidian/progression.html',
  '/obsidian/manifest.json'
];

// Install — precache assets
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

// Fetch — NETWORK FIRST, cache fallback
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Update cache with fresh response
        const clone = response.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
