/**
 * 🚀 BestMealMate Service Worker v2.0
 * Enhanced PWA support with offline capabilities
 */

const CACHE_VERSION = 'v3';
const STATIC_CACHE = `bestmealmate-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `bestmealmate-dynamic-${CACHE_VERSION}`;
const API_CACHE = `bestmealmate-api-${CACHE_VERSION}`;
const RECIPE_CACHE = `bestmealmate-recipes-${CACHE_VERSION}`;

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/login',
  '/dashboard/recipes',
  '/manifest.json',
  '/icon.svg',
  '/offline.html'
];

// API routes to cache with network-first strategy
const API_ROUTES = [
  '/api/brain',
  '/api/ai-chef',
  '/api/recipes'
];

// Maximum recipes to cache offline (to prevent excessive storage)
const MAX_CACHED_RECIPES = 500;

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker installing...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker installed');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Cache failed:', error);
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              return name.startsWith('bestmealmate-') &&
                     !name.includes(CACHE_VERSION);
            })
            .map((name) => {
              console.log('🗑️ Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - smart caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Recipe API - special handling for offline viewing
  if (url.pathname.startsWith('/api/recipes')) {
    event.respondWith(handleRecipeRequest(request));
    return;
  }

  // API routes - network first, then cache
  if (API_ROUTES.some(route => url.pathname.startsWith(route))) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // Static assets - cache first
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // HTML pages - network first with offline fallback
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirstWithOffline(request));
    return;
  }

  // Everything else - stale while revalidate
  event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
});

// Cache-first strategy
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('Fetch failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Network-first strategy
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    return new Response(JSON.stringify({ error: 'Offline', offline: true }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Network-first with offline HTML fallback
async function networkFirstWithOffline(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    // Return offline page
    const offlinePage = await caches.match('/offline.html');
    if (offlinePage) {
      return offlinePage;
    }

    // Fallback
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>BestMealMate - Offline</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: system-ui; text-align: center; padding: 50px; background: #f9fafb; }
            h1 { color: #22c55e; }
            p { color: #6b7280; }
            button { background: #22c55e; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 16px; }
            button:hover { background: #16a34a; }
          </style>
        </head>
        <body>
          <h1>🍽️ BestMealMate</h1>
          <p>You're currently offline. Please check your internet connection.</p>
          <button onclick="location.reload()">Try Again</button>
        </body>
      </html>
    `, {
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}

// Check if request is for static asset
function isStaticAsset(pathname) {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2'];
  return staticExtensions.some(ext => pathname.endsWith(ext)) ||
         pathname === '/' ||
         pathname === '/manifest.json';
}

// Push notification handling
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};

  const options = {
    body: data.body || 'You have a new notification from BestMealMate',
    icon: '/icon.svg',
    badge: '/icon.svg',
    vibrate: [100, 50, 100],
    tag: data.tag || 'bestmealmate-notification',
    data: {
      url: data.url || '/dashboard',
      dateOfArrival: Date.now()
    },
    actions: [
      { action: 'open', title: 'Open', icon: '/icon.svg' },
      { action: 'close', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'BestMealMate',
      options
    )
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/dashboard';

  if (event.action === 'close') {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing window if available
        for (const client of clientList) {
          if (client.url.includes('bestmealmate') && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pantry') {
    event.waitUntil(syncPantryData());
  }
  if (event.tag === 'sync-meals') {
    event.waitUntil(syncMealData());
  }
});

async function syncPantryData() {
  // Sync queued pantry updates when back online
  const cache = await caches.open('bestmealmate-sync');
  const requests = await cache.keys();

  for (const request of requests) {
    if (request.url.includes('pantry')) {
      try {
        const cached = await cache.match(request);
        if (cached) {
          await fetch(request, { method: 'POST', body: await cached.text() });
          await cache.delete(request);
        }
      } catch (error) {
        console.error('Sync failed:', error);
      }
    }
  }
}

async function syncMealData() {
  // Sync queued meal plan updates when back online
  console.log('🔄 Syncing meal data...');
}

// Recipe caching for offline viewing
async function handleRecipeRequest(request) {
  const url = new URL(request.url);
  const cache = await caches.open(RECIPE_CACHE);

  try {
    const response = await fetch(request);

    if (response.ok) {
      // Clone the response for caching
      const responseClone = response.clone();

      // Cache individual recipe requests
      if (url.searchParams.has('id')) {
        await cache.put(request, responseClone);
      }

      // Cache paginated results (limit to first few pages)
      const page = parseInt(url.searchParams.get('page') || '0');
      if (page < 10) {
        await cache.put(request, responseClone);
      }

      // Cleanup old cached recipes
      await cleanupRecipeCache();
    }

    return response;
  } catch (error) {
    // Offline - try to serve from cache
    const cached = await cache.match(request);

    if (cached) {
      console.log('📖 Serving recipe from cache');
      return cached;
    }

    // Check if we have any cached recipes to return
    const keys = await cache.keys();
    if (keys.length > 0 && !url.searchParams.has('id')) {
      // Return first cached page of recipes
      const firstPage = await cache.match(keys[0]);
      if (firstPage) {
        return firstPage;
      }
    }

    return new Response(JSON.stringify({
      error: 'Offline - recipes not cached',
      offline: true,
      recipes: []
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Cleanup old cached recipes to prevent storage bloat
async function cleanupRecipeCache() {
  const cache = await caches.open(RECIPE_CACHE);
  const keys = await cache.keys();

  if (keys.length > MAX_CACHED_RECIPES) {
    // Delete oldest entries (first in list)
    const toDelete = keys.slice(0, keys.length - MAX_CACHED_RECIPES);
    for (const key of toDelete) {
      await cache.delete(key);
    }
    console.log(`🧹 Cleaned up ${toDelete.length} old recipes from cache`);
  }
}

// Save recipe for offline viewing
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_RECIPE') {
    const { recipeId, recipeData } = event.data;
    cacheRecipeForOffline(recipeId, recipeData);
  }

  if (event.data && event.data.type === 'GET_CACHED_RECIPES') {
    getCachedRecipes().then(recipes => {
      event.ports[0].postMessage({ recipes });
    });
  }
});

async function cacheRecipeForOffline(recipeId, recipeData) {
  const cache = await caches.open(RECIPE_CACHE);
  const response = new Response(JSON.stringify({ recipe: recipeData }), {
    headers: { 'Content-Type': 'application/json' }
  });
  await cache.put(`/api/recipes?id=${recipeId}`, response);
  console.log(`✅ Recipe ${recipeId} cached for offline viewing`);
}

async function getCachedRecipes() {
  const cache = await caches.open(RECIPE_CACHE);
  const keys = await cache.keys();
  const recipes = [];

  for (const key of keys) {
    if (key.url.includes('id=')) {
      try {
        const response = await cache.match(key);
        if (response) {
          const data = await response.json();
          if (data.recipe) {
            recipes.push(data.recipe);
          }
        }
      } catch (e) {
        console.error('Error reading cached recipe:', e);
      }
    }
  }

  return recipes;
}

console.log('🚀 BestMealMate Service Worker v3 loaded');
