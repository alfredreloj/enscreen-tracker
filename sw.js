const CACHE = 'enscreen-v3';
const ASSETS = [
  '/enscreen-tracker/',
  '/enscreen-tracker/index.html',
  '/enscreen-tracker/manifest.json',
  '/enscreen-tracker/icon-192.png',
  '/enscreen-tracker/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => {
      return Promise.all(
        ASSETS.map(url =>
          fetch(url, {cache: 'reload'}).then(res => {
            if (res.ok) return c.put(url, res);
          }).catch(() => {})
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => {
        return caches.match('/enscreen-tracker/index.html');
      });
    })
  );
});
