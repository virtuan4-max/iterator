const CACHE = 'iterator_v1.2';

const ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './mobile.css',
    // images
    'https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/images/+symbol.png',
    'https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/images/audiobar.png',
    'https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/images/audiosliderfull.png',
    'https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/images/centerimage-noglyph.png',
    'https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/images/check.png',
    'https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/images/favicon.ico',
    'https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/images/gear.png',
    'https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/images/pearlcross.png',
    'https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/images/pearlnocross.png',
    'https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/images/rectborder.png',
    'https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/images/rectbutton.png',
    'https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/images/rectbuttonactive.png',
    'https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/images/recthalffr.png',
    'https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/images/recthalfrr.png',
    'https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/images/selectboxsquare.png',
    // fonts
    'https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/fonts/Rodondo.woff2',
    'https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/fonts/menu-font.woff2',
    'https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/fonts/rain-world-alphabet.woff2',
    // audio
    'https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/audio/rain.wav',
    'https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/audio/UI_UIArp.wav',
    'https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/audio/UI_UIMetal1.wav',
    'https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/audio/NA_41_-_Random_Gods_(Theme_III).mp3',
];

// On install: cache everything
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

// On activate: drop old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Cache-first for known assets, network-first with cache fallback for everything else.
// Uses ignoreVary + ignoreSearch so cached CDN responses are always matched reliably.
self.addEventListener('fetch', event => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.open(CACHE).then(async cache => {
            // Always check the cache first with relaxed matching
            const cached = await cache.match(event.request, {
                ignoreSearch: true,
                ignoreVary: true,
            });

            // For known/pre-cached assets: serve cache immediately, revalidate in background
            const url = event.request.url;
            const isKnownAsset = ASSETS.some(a => url.endsWith(a) || url === a);

            if (isKnownAsset && cached) {
                // Revalidate in background (stale-while-revalidate)
                event.waitUntil(
                    fetch(event.request)
                        .then(response => {
                            if (response && response.status === 200) {
                                cache.put(event.request, response);
                            }
                        })
                        .catch(() => { /* network unavailable, cached copy is fine */ })
                );
                return cached;
            }

            // For everything else (or uncached known assets): try network, fall back to cache
            try {
                const response = await fetch(event.request);
                if (response && response.status === 200) {
                    cache.put(event.request, response.clone());
                }
                return response;
            } catch {
                // Network failed — return whatever we have in cache
                return cached ?? new Response('', { status: 408, statusText: 'Offline' });
            }
        })
    );
});