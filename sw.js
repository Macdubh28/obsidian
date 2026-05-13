const CACHE='obsidian-v1';
const ASSETS=[
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
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});
