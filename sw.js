
/* global self */

const manifest = self.__WB_MANIFEST;
const CACHE_NAME = 'iplanner-v2.3';
const EXTERNAL_ASSETS = [
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      const urlsToCache = (manifest || []).map(entry => entry.url);
      return cache.addAll([...urlsToCache, ...EXTERNAL_ASSETS]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    })
  );
  self.clients.claim();
});

// Listener para Notificações Push
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: 'Lembrete iPlanner', body: 'Você tem uma tarefa pendente.' };
  
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Clique na Notificação
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    self.clients.openWindow(event.notification.data.url)
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.url.includes('supabase.co')) return;
  event.respondWith(
    caches.match(request).then(response => response || fetch(request))
  );
});
