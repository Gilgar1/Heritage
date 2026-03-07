const CACHE_NAME = 'heritage-v1';
const STATIC_ASSETS = [
    '/',
    '/feed',
    '/families',
    '/discover',
    '/manifest.json',
    '/icon-192.png',
];

// Install: cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS).catch(() => { }))
    );
    self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch: cache-first for static, network-first for API
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET and cross-origin
    if (request.method !== 'GET' || !url.origin.includes(self.location.origin)) return;

    // Network-first for API/dynamic routes
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/_next/')) {
        event.respondWith(
            fetch(request).then((res) => {
                const clone = res.clone();
                caches.open(CACHE_NAME).then((c) => c.put(request, clone)).catch(() => { });
                return res;
            }).catch(() => caches.match(request))
        );
        return;
    }

    // Cache-first for assets
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;
            return fetch(request).then((res) => {
                if (res.ok) {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then((c) => c.put(request, clone)).catch(() => { });
                }
                return res;
            }).catch(() => {
                // Return offline page for navigation requests
                if (request.mode === 'navigate') return caches.match('/feed');
            });
        })
    );
});

// Push notifications
self.addEventListener('push', (event) => {
    const data = event.data?.json() || {};
    event.waitUntil(
        self.registration.showNotification(data.title || 'Heritage', {
            body: data.message || 'You have a new notification',
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            data: { url: data.link || '/notifications' },
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data?.url || '/notifications')
    );
});
