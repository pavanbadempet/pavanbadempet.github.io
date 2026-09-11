const CACHE_NAME = 'pavan-portfolio-v5';

// Core assets to pre-cache on install for instant loading
const PRECACHE_URLS = [
    '/',
    '/classic/',
    '/agent/',
    '/assets/css/style.css',
    '/assets/css/premium-os.css',
    '/assets/css/magnific-popup.css',
    '/assets/js/main.js',
    '/assets/js/jquery.min.js',
    '/assets/js/wasm-bridge.js',
    '/assets/js/marked.min.js',
    '/assets/wasm/rust_wasm_engine.wasm',
    '/assets/img/pavan_badempet.webp',
    '/site.webmanifest'
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

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const request = event.request;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (!url.protocol.startsWith('http')) return;

    // Skip caching external API / worker endpoints
    if (url.hostname.includes('workers.dev') || url.hostname.includes('google-analytics.com')) {
        return;
    }

    // Navigation requests (HTML pages): Network-First, fall back to cache
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then(networkResponse => {
                    if (networkResponse && networkResponse.status === 200) {
                        const copy = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
                    }
                    return networkResponse;
                })
                .catch(async () => {
                    const cachedResponse = await caches.match(request);
                    if (cachedResponse) return cachedResponse;
                    return caches.match('/');
                })
        );
        return;
    }

    // Static assets (CSS, JS, WASM, Images, Fonts): Stale-While-Revalidate
    const isStaticAsset = /\.(css|js|wasm|webp|png|jpg|jpeg|svg|ico|woff|woff2|ttf|eot)$/i.test(url.pathname);

    if (isStaticAsset) {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache => {
                return cache.match(request).then(cachedResponse => {
                    const fetchPromise = fetch(request).then(networkResponse => {
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(() => null);

                    // Return cached response immediately if available, otherwise wait for network
                    return cachedResponse || fetchPromise.then(res => res || new Response('', { status: 404 }));
                });
            })
        );
        return;
    }

    // Default Cache-First fallback
    event.respondWith(
        caches.match(request).then(cached => {
            return cached || fetch(request).then(response => {
                if (response && response.status === 200) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
                }
                return response;
            }).catch(() => new Response('', { status: 404 }));
        })
    );
});
