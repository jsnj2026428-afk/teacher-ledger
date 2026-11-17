const CACHE = 'teacher-ledger-pwa-v7-20261117';
const ASSETS = ['./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(Promise.all([
  caches.keys().then(keys => Promise.all(keys.filter(k => (k.startsWith('teacherledger-pwa-') || k.startsWith('teacher-ledger-pwa-')) && k !== CACHE).map(k => caches.delete(k)))),
  self.clients.claim()
])));
self.addEventListener('fetch', e => {
  const request = e.request;
  if(request.method !== 'GET' || new URL(request.url).origin !== location.origin) return;
  if(request.mode === 'navigate'){
    e.respondWith(fetch(request).then(response => {
      if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache => cache.put('./index.html',copy));}
      return response;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});
