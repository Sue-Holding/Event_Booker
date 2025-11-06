import { openDB } from 'idb';

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

// ------------------ INSTALL ------------------
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Install");
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// ------------------ ACTIVATE ------------------
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activate");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== API_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ------------------ FETCH ------------------
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests here
  if (request.method === "GET") {
    // 1. API requests
    if (request.url.startsWith("https://eventure-ji0r.onrender.com/")) {
      event.respondWith(
        caches.open(API_CACHE).then(async (cache) => {
          try {
            const response = await fetch(request);
            cache.put(request, response.clone());
            return response;
          } catch (err) {
            const cached = await cache.match(request);
            return cached || new Response(JSON.stringify({ message: "Offline: API unavailable" }), {
              status: 503,
              headers: { "Content-Type": "application/json" }
            });
          }
        })
      );
      return;
    }

    // 2. React SPA navigation: serve index.html
    if (request.mode === "navigate") {
      event.respondWith(
        caches.match("/index.html").then((cachedIndex) => {
          return cachedIndex || fetch("/index.html").catch(() => caches.match("/offline.html"));
        })
      );
      return;
    }

    // 3. Static assets
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return cachedResponse || fetch(request).catch(() => caches.match("/offline.html"));
      })
    );
    return;
  }

  // 4. POST/PUT/DELETE requests (queue for background sync)
  if (["POST", "PUT", "DELETE"].includes(request.method)) {
    event.respondWith(
      fetch(request).catch(async () => {
        const db = await openDB("eventbooker-offline-requests", 1, {
          upgrade(db) {
            db.createObjectStore("requests", { autoIncrement: true });
          }
        });

        const clone = request.clone();
        const body = await clone.text();

        await db.add("requests", {
          url: request.url,
          method: request.method,
          body,
          headers: [...request.headers]
        });

        if ("sync" in self.registration) {
          await self.registration.sync.register("sync-requests");
        }

        return new Response(JSON.stringify({ message: "Request saved offline, will sync later" }), {
          headers: { "Content-Type": "application/json" }
        });
      })
    );
  }
});

// ------------------ SYNC ------------------
self.addEventListener("sync", async (event) => {
  if (event.tag === "sync-requests") {
    console.log("[Service Worker] Syncing offline requests...");
    const db = await openDB("eventbooker-offline-requests", 1);
    const allRequests = await db.getAll("requests");

    for (const req of allRequests) {
      try {
        await fetch(req.url, {
          method: req.method,
          body: req.body,
          headers: req.headers
        });
      } catch (err) {
        console.warn("Retry later:", req.url);
        return;
      }
    }

    await db.clear("requests");
    console.log("[Service Worker] Offline requests synced!");
  }
});












// const STATIC_CACHE = "eventbooker-static-v2";
// const API_CACHE = "eventbooker-api-v1";

// const FILES_TO_CACHE = [
//   "/",
//   "/index.html",
//   "/offline.html",
//   "/manifest.webmanifest",
//   "/icons/logo2-192.png",
//   "/icons/logo-512.png"
// ];

// // install - cache static assets
// self.addEventListener("install", (event) => {
//     console.log("[Service Worker] Install");
//     event.waitUntil(
//         caches.open(STATIC_CACHE).then(cache => cache.addAll(FILES_TO_CACHE))
//     );
//     self.skipWaiting();
// });

// // activate - clean up old caches
// self.addEventListener("activate", (event) => {
//     console.log("[Service Worker] Activate");
//     event.waitUntil(
//         caches.keys().then((keys) => 
//             Promise.all(
//             keys
//                 .filter((key) => key !== STATIC_CACHE && key !== API_CACHE)
//                 .map((key) => caches.delete(key))
//         ))
//     );
//     self.clients.claim();
// });

// // fetch - serve cached content when offline
// self.addEventListener("fetch", (event) => {
//   const { request } = event;

//   // Only cache GET requests
//   if (request.method === "GET") {
//     // Cache API requests
//     if (request.url.startsWith("https://eventure-ji0r.onrender.com/")) {
//       event.respondWith(
//         caches.open(API_CACHE).then(async (cache) => {
//           try {
//             const response = await fetch(request);
//             cache.put(request, response.clone());
//             return response;
//           } catch (err) {
//             const cached = await cache.match(request);
//             return cached || new Response(JSON.stringify({ message: "Offline: API unavailable" }), {
//               status: 503,
//               headers: { "Content-Type": "application/json" },
//             });
//           }
//         })
//       );
//       return;
//     }

//     // Handle React SPA navigation: serve cached index.html
//   if (request.mode === "navigate") {
//     event.respondWith(
//       caches.match("/index.html").then((cachedIndex) => {
//         return cachedIndex || fetch("/index.html");
//       }).catch(() => caches.match("/offline.html"))
//     );
//     return;
//   }

//   // For other GET requests, serve cache or fetch
//   event.respondWith(
//     caches.match(request).then((cachedResponse) => {
//       return cachedResponse || fetch(request);
//     })
//   );
// }