const CACHE_NAME = 'gcse-rs-flashcards-v1';
const urlsToCache = [
    '/',
    '/index.html',
    // We're using a CDN for Tailwind CSS, so we don't need to cache it manually.
    // If you had local CSS/JS files, you'd list them here:
    // '/style.css',
    // '/script.js',
    '/manifest.json',
    // Placeholder icons (replace with actual icons if you design them)
    'https://placehold.co/72x72/4299e1/ffffff?text=RS',
    'https://placehold.co/96x96/4299e1/ffffff?text=RS',
    'https://placehold.co/128x128/4299e1/ffffff?text=RS',
    'https://placehold.co/144x144/4299e1/ffffff?text=RS',
    'https://placehold.co/152x152/4299e1/ffffff?text=RS',
    'https://placehold.co/192x192/4299e1/ffffff?text=RS',
    'https://placehold.co/384x384/4299e1/ffffff?text=RS',
    'https://placehold.co/512x512/4299e1/ffffff?text=RS'
];

// Install event: caches all the essential assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Failed to cache during install:', error);
            })
    );
});

// Fetch event: serves cached content or fetches from network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // No cache hit - fetch from network
                return fetch(event.request).catch(error => {
                    // This catch is important for when the network is unavailable
                    console.error('Fetch failed for:', event.request.url, error);
                    // You might want to return a fallback page here for navigation requests
                    // e.g., if (event.request.mode === 'navigate') { return caches.match('/offline.html'); }
                });
            })
    );
});

// Activate event: cleans up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName); // Delete old caches
                    }
                })
            );
        })
    );
});
