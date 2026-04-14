const CACHE = 'enscreen-v2';
const ASSETS = [
  '/enscreen-tracker/',
  '/enscreen-tracker/index.html',
  '/enscreen-tracker/manifest.json',
  '/enscreen-tracker/icon-192.png',
  '/enscreen-tracker/icon-512.png'
];
 
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
 
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});
 
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() =>
      caches.match('/enscreen-tracker/index.html')
    ))
  );
});
 
