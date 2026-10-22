// CACHE_VERSION is stamped automatically by sync-data.py; run it after changing beers.json or the app files.
const CACHE_VERSION = '01db1a2b';
const CACHE = 'aat26-' + CACHE_VERSION;
const CORE = [
  './',
  'index.html',
  'style.css',
  'app.js',
  'beers.json',
  'beers-data.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('aat26-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Stale-while-revalidate: answer from cache instantly, refresh it in the background.
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (url.origin !== self.location.origin && !isFont) return;

  event.respondWith(
    caches.open(CACHE).then(async cache => {
      // Ignore the query string so shared filter/import URLs still hit the cached page.
      const cached = await cache.match(req, { ignoreSearch: url.origin === self.location.origin });
      const refresh = fetch(req)
        .then(res => {
          if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
          return res;
        })
        .catch(() => null);
      return cached || (await refresh) || (req.mode === 'navigate' ? cache.match('index.html') : Response.error());
    })
  );
});
