const CACHE_NAME='teacherledger-pwa-v9-20261117';
const ASSETS=['./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(Promise.all([
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('teacherledger-pwa-')&&k!==CACHE_NAME).map(k=>caches.delete(k)))),self.clients.claim()
])));
self.addEventListener('fetch',e=>{
 const req=e.request;
 if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 if(req.mode==='navigate'){
  e.respondWith(fetch(req).then(res=>{
   if(res.ok){let c=res.clone();caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',c));}return res;
  }).catch(()=>caches.match('./index.html')));return;
 }
 e.respondWith(caches.match(req).then(c=>c||fetch(req)));
});
