// VECORIQ. app shell. Network-first for HTML so updates are not trapped in cache.
const CACHE = 'vecoriq-shell-v2';
const ASSETS = ['./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', event => {
 if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
 if (event.request.mode === 'navigate') {
   event.respondWith(fetch(event.request).then(response => { const copy=response.clone(); caches.open(CACHE).then(c=>c.put('./',copy)); return response; }).catch(()=>caches.match('./')));
 } else { event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request))); }
});
