const CACHE_NAME = "field-demo-pulse-v1";
const APP_ROUTES = ["/", "/promoter", "/stockist", "/dashboard", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(APP_ROUTES.map((route) => cache.add(route))),
    ),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            void caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          return (await cache.match(request)) ?? (await cache.match(url.pathname)) ?? (await cache.match("/"));
        }),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(async (cached) => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          void caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
        }
        return cached ?? response;
      } catch (error) {
        if (cached) return cached;
        throw error;
      }
    }),
  );
});
