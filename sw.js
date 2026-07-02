// SENTINEL service worker — app shell precache + runtime caching.
// Bump CACHE_VERSION on every deploy that changes shell assets.
var CACHE_VERSION = 'sentinel-v4.0.0';
var SHELL_CACHE = CACHE_VERSION + '-shell';
var CDN_CACHE   = CACHE_VERSION + '-cdn';
var TILE_CACHE  = CACHE_VERSION + '-tiles';
var DATA_CACHE  = CACHE_VERSION + '-data';

var SHELL_ASSETS = [
  './',
  './index.html',
  './css/app.css',
  './js/app.js',
  './js/live.js',
  './manifest.webmanifest',
  './assets/icons/favicon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/maskable-512.png',
  './assets/icons/apple-touch-icon.png'
];

var TILE_MAX_ENTRIES = 250;

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(SHELL_CACHE).then(function (cache) {
      return cache.addAll(SHELL_ASSETS);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key.indexOf(CACHE_VERSION) !== 0) return caches.delete(key);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

function isTile(url) {
  return /basemaps\.cartocdn\.com/.test(url.hostname);
}

function isCdnLib(url) {
  return /(^|\.)unpkg\.com$|(^|\.)jsdelivr\.net$|(^|\.)googleapis\.com$|(^|\.)gstatic\.com$/.test(url.hostname);
}

function isHlsMedia(url) {
  return /\.(m3u8|ts|m4s|mp4|aac)(\?|$)/.test(url.pathname);
}

function isDataApi(url) {
  return /earthquake\.usgs\.gov|celestrak\.org|api\.allorigins\.win|corsproxy\.io|api\.gdeltproject\.org|hacker-news\.firebaseio\.com/.test(url.hostname);
}

function trimCache(cacheName, maxEntries) {
  caches.open(cacheName).then(function (cache) {
    cache.keys().then(function (keys) {
      if (keys.length <= maxEntries) return;
      var excess = keys.slice(0, keys.length - maxEntries);
      excess.forEach(function (req) { cache.delete(req); });
    });
  });
}

function networkFirst(request, cacheName) {
  return caches.open(cacheName).then(function (cache) {
    return fetch(request).then(function (response) {
      if (response && response.ok) cache.put(request, response.clone());
      return response;
    }).catch(function () {
      return cache.match(request, { ignoreSearch: isSameOrigin(new URL(request.url)) }).then(function (cached) {
        if (cached) return cached;
        throw new Error('offline and not cached: ' + request.url);
      });
    });
  });
}

function staleWhileRevalidate(request, cacheName) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(request).then(function (cached) {
      var networkFetch = fetch(request).then(function (response) {
        if (response && response.ok) cache.put(request, response.clone());
        return response;
      }).catch(function () { return cached; });
      return cached || networkFetch;
    });
  });
}

function cacheFirstCapped(request, cacheName, maxEntries) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(request).then(function (cached) {
      if (cached) return cached;
      return fetch(request).then(function (response) {
        if (response && response.ok) {
          cache.put(request, response.clone());
          trimCache(cacheName, maxEntries);
        }
        return response;
      });
    });
  });
}

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;

  var url;
  try { url = new URL(request.url); } catch (e) { return; }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Live video streams: never intercept.
  if (isHlsMedia(url)) return;

  // App navigation + same-origin shell assets: network-first so deploys land,
  // cache fallback so the app opens offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      networkFirst(request, SHELL_CACHE).catch(function () {
        return caches.match('./index.html', { ignoreSearch: true });
      })
    );
    return;
  }
  if (isSameOrigin(url)) {
    event.respondWith(networkFirst(request, SHELL_CACHE));
    return;
  }

  if (isTile(url)) {
    event.respondWith(cacheFirstCapped(request, TILE_CACHE, TILE_MAX_ENTRIES));
    return;
  }

  if (isCdnLib(url)) {
    event.respondWith(staleWhileRevalidate(request, CDN_CACHE));
    return;
  }

  if (isDataApi(url)) {
    event.respondWith(networkFirst(request, DATA_CACHE));
    return;
  }

  // Everything else (YouTube embeds, VesselFinder iframe, misc): straight through.
});
