const STATIC_CACHE = "eventbooker-static-v3";
const API_CACHE = "eventbooker-api-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.webmanifest",
  "/icons/logo2-192.png",
  "/icons/logo-512.png"
];

// INSTALL
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
        .filter((key) => ![STATIC_CACHE, API_CACHE].includes(key))
        .map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // GET requests
  if (request.method === 'GET') {
    // API caching
    if (
      request.url.startsWith('http://localhost:5050/') || 
      request.url.startsWith('https://eventure-ji0r.onrender.com/')
    ) {
      event.respondWith(
        caches.open(API_CACHE).then(async (cache) => {
          try {
            const response = await fetch(request);
            if (
              response.ok && 
              response.headers.get('Content-Type')?.includes('application/json')
            ) {
              cache.put(request, response.clone());
            }
            return response;
          } catch (err) {
            const cached = await cache.match(request);
            return (
              cached ||
              new Response(
                JSON.stringify({ message: 'Offline: API unavailable' }),
                {
                  status: 503,
                  headers: { 'Content-Type': 'application/json' },
                }
              )
            );
          }
        })
      );
      return;
    }

    // Navigation requests (SPA)
    if (request.mode === 'navigate') {
      event.respondWith(
        fetch(request).catch(() => caches.match('/offline.html'))
      );
      return;
    }

    // Static assets
    event.respondWith(
      caches.match(request).then((cached) =>
        cached || fetch(request).catch(() => caches.match('/offline.html'))
      )
    );
    return;
  }

  // POST/PUT/DELETE → queue when offline
  if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
    event.respondWith(
      fetch(request).catch(async () => {
        await saveRequestOffline(request);

        if ('sync' in self.registration) {
          await self.registration.sync.register('sync-requests');
        }

        return new Response(
          JSON.stringify({ message: 'Offline: request saved for sync' }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
  }
});

// SYNC
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-requests') {
    event.waitUntil(syncOfflineRequests());
  }
});

// IndexedDB helpers
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('eventure-offline-requests', 1);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('requests')) {
        db.createObjectStore('requests', { autoIncrement: true });
      }
    };

    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

async function saveRequestOffline(request) {
  const db = await openDatabase();
  const tx = db.transaction('requests', 'readwrite');
  const store = tx.objectStore('requests');

  const clone = request.clone();
  const body = await clone.text();

  store.add({
    url: request.url,
    method: request.method,
    body,
    headers: [...request.headers],
  });

  return tx.complete;
}

async function syncOfflineRequests() {
  console.log('[SW] Syncing offline requests...');
  const db = await openDatabase();
  const tx = db.transaction('requests', 'readwrite');
  const store = tx.objectStore('requests');

  const allRequests = await new Promise((resolve) => {
    const items = [];
    const cursor = store.openCursor();
    cursor.onsuccess = (event) => {
      const current = event.target.result;
      if (current) {
        items.push({ id: current.key, ...current.value });
        current.continue();
      } else {
        resolve(items);
      }
    };
  });

  for (const req of allRequests) {
    try {
      await fetch(req.url, {
        method: req.method,
        body: req.body,
        headers: req.headers,
      });
      store.delete(req.id);
    } catch (err) {
      console.warn('[SW] Still offline, retry later:', req.url);
      return;
    }
  }

  console.log('[SW] All offline requests synced!');
}