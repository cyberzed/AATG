// CACHE_VERSION is stamped automatically by sync-data.py; run it after changing beers.json or the app files.
const CACHE_VERSION = 'a3703465';
const CACHE = 'aat26-' + CACHE_VERSION;
const CORE = [
  './',
  'index.html',
  'style.css',
  'app.js',
  'vendor/fuse.basic.min.js',
  'downloads/aarhus-together-2026-beers.xlsx',
  'downloads/aarhus-together-2026-beers.csv',
  'beers.json',
  'beers-data.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  // cache: 'reload' skips the browser's HTTP cache, so a new version never stores stale copies of the files
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE.map(url => new Request(url, { cache: 'reload' })))));
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
  const isSameOrigin = url.origin === self.location.origin;
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!isSameOrigin && !isFont) return;

  event.respondWith(
    caches.open(CACHE).then(async cache => {
      // Ignore the query string so shared filter/import URLs still hit the cached page.
      const cached = await cache.match(req, { ignoreSearch: isSameOrigin });
      // no-cache revalidates our own files with the server instead of reusing the HTTP cache
      const refresh = fetch(isSameOrigin ? new Request(req.url, { cache: 'no-cache' }) : req)
        .then(res => {
          if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
          return res;
        })
        .catch(() => null);
      return cached || (await refresh) || (req.mode === 'navigate' ? cache.match('index.html') : Response.error());
    })
  );
});
