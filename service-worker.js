const CACHE_NAME = 'pavan-portfolio-v4';

// Precache only URLs that exist on the built site; failed entries no longer break install.
const PRECACHE_URLS = [
    '/',
    '/assets/css/style.css',
    '/assets/js/main.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
            Promise.allSettled(
                PRECACHE_URLS.map(url =>
                    cache.add(url).catch(() => null)
                )
            )
        )
    );
    self.skipWaiting();
});

self.addEventListener('fetch', event => {
    // Only handle GET requests; skip non-HTTP(S) schemes
    if (event.request.method !== 'GET') return;
    const url = event.request.url;
    if (!url.startsWith('http')) return;

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) return response;
                return fetch(event.request).catch(() => {
                    // Network failed (offline, blocked, etc.) — return a no-body
                    // response so the browser doesn't log an unhandled rejection.
                    // Use 200 with empty body to avoid "503" noise in DevTools.
                    return new Response('', {
                        status: 200,
                        headers: { 'Content-Type': 'text/plain' }
                    });
                });
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});
