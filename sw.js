
/* global self */

// O Workbox injetará aqui a lista de arquivos gerados no build
// É importante manter esta linha exatamente assim para o build do VitePWA
const manifest = self.__WB_MANIFEST;

const CACHE_NAME = 'iplanner-v2.2';
const EXTERNAL_ASSETS = [
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap',
  'https://fonts.gstatic.com/s/plusjakartasans/v8/L0x5DFIqisS8T19WPy48ubTRN6pX_B4f.woff2',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined'
];

// Instalação: Cacheia os arquivos do manifesto + assets externos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      const urlsToCache = (manifest || []).map(entry => entry.url);
      return cache.addAll([...urlsToCache, ...EXTERNAL_ASSETS]);
    })
  );
  self.skipWaiting();
});

// Ativação: Limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Interceptação de Requests (Cache-First para assets, Network-First para API)
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.hostname.includes('supabase.co')) return;
  if (!request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(request).then(networkResponse => {
        if (
          networkResponse && 
          networkResponse.status === 200 && 
          (request.destination === 'image' || request.destination === 'font')
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        if (request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
