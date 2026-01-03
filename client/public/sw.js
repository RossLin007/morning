
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

if (workbox) {
  console.log(`Workbox is loaded`);

  // Force strict cache expiration for updates
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  // 1. Navigation Fallback (SPA Support for Offline)
  // This ensures that refreshing '/reading' while offline returns 'index.html' from cache
  const navigationRoute = new workbox.routing.NavigationRoute(
    new workbox.strategies.NetworkFirst({
      cacheName: 'app-shell',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 1, // Only need the latest index.html
          maxAgeSeconds: 24 * 60 * 60, // 24 Hours
        }),
      ],
    }),
    {
      // Optional: allowlist/denylist
      // denylist: [/^\/api\//],
    }
  );
  workbox.routing.registerRoute(navigationRoute);

  // 2. Cache Google Fonts (StaleWhileRevalidate)
  workbox.routing.registerRoute(
    ({url}) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'google-fonts',
      plugins: [
        new workbox.expiration.ExpirationPlugin({maxEntries: 20}),
      ],
    }),
  );

  // 3. Cache Images (CacheFirst)
  // Unsplash, Dicebear, Google User Content
  workbox.routing.registerRoute(
    ({request, url}) => request.destination === 'image' || url.origin.includes('images.unsplash.com') || url.origin.includes('api.dicebear.com') || url.origin.includes('lh3.googleusercontent.com'),
    new workbox.strategies.CacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100, // Increased for community images
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    }),
  );

  // 4. Cache Audio Assets (CacheFirst)
  workbox.routing.registerRoute(
    ({request, url}) => request.destination === 'audio' || url.pathname.endsWith('.mp3') || url.pathname.endsWith('.wav'),
    new workbox.strategies.CacheFirst({
      cacheName: 'audio-assets',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 20,
          maxAgeSeconds: 60 * 24 * 60 * 60, // 60 Days
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200], 
        }),
      ],
    })
  );

  // 5. Cache Supabase API Reads (NetworkFirst)
  // Allows reading content even when offline, updates when online
  workbox.routing.registerRoute(
    ({url}) => url.origin.includes('supabase.co') && url.pathname.includes('/rest/v1/'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'supabase-api-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days (Increased resilience)
        }),
      ],
    })
  );

  // 6. Cache JS/CSS Bundles (StaleWhileRevalidate)
  workbox.routing.registerRoute(
    ({request}) => request.destination === 'script' || request.destination === 'style',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources',
    })
  );

} else {
  console.log(`Workbox didn't load`);
}
