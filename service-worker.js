const CACHE_NAME = 'pavan-portfolio-v3';

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
                    // Network failed (offline, blocked, etc.) — return nothing
                    // so the browser shows its own error rather than an unhandled rejection
                    return new Response('', { status: 503, statusText: 'Service Unavailable' });
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
