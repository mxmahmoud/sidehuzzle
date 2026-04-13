const CACHE_NAME = 'sidehuzle-tile-cache-v1';
const search = new URL(self.location.href).searchParams;
const hostList = (search.get('hosts') || '')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

function isCachedTileRequest(requestUrl) {
  if (!hostList.length) {
    return false;
  }

  return hostList.includes(requestUrl.hostname);
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);
  if (!isCachedTileRequest(requestUrl)) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request, {
        ignoreVary: true,
      });

      const networkPromise = fetch(event.request)
        .then((response) => {
          if (response.ok || response.type === 'opaque') {
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkPromise;
    })
  );
});
