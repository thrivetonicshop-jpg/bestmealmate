// Service Worker for Push Notifications
self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'New notification from BestMealMate',
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      { action: 'explore', title: 'View', icon: '/icon-check.png' },
      { action: 'close', title: 'Dismiss', icon: '/icon-close.png' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('BestMealMate', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'explore') {
    clients.openWindow('/dashboard');
  } else {
    clients.openWindow('/');
  }
});

// Cache static assets
const CACHE_NAME = 'bestmealmate-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/login'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
