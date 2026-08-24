/* ══════════════════════════════════════════════════════════════
   BAMBOO SARAWAK — service worker

   Rural applicants often fill this form on patchy or absent mobile
   data. Everything the portal needs is client-side, so once the
   shell is cached the whole four-step journey — including drafts
   and submission to local storage — works with no signal at all.

   Strategy:
     navigations   → network-first, fall back to cache, then offline
     same-origin   → stale-while-revalidate (updates land next load)
     Google Fonts  → cache-first (immutable, versioned by URL)
   ══════════════════════════════════════════════════════════════ */

var VERSION    = 'v1';
var SHELL      = 'bamboo-shell-' + VERSION;
var RUNTIME    = 'bamboo-runtime-' + VERSION;
var FONTS      = 'bamboo-fonts-' + VERSION;
var OFFLINE_URL = 'offline.html';

var PRECACHE = [
  '/', 'index.html', 'bamboo.html', 'poster.html', 'offline.html',
  'style.css', 'app.js', 'portal.js', 'bamboo.js', 'poster.js',
  'manifest.webmanifest',
  'assets/icon-192.png', 'assets/icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(SHELL).then(function (cache) {
      /* Individually, so one 404 cannot fail the whole install. */
      return Promise.all(PRECACHE.map(function (url) {
        return cache.add(new Request(url, { cache: 'reload' })).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== SHELL && k !== RUNTIME && k !== FONTS) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

function isFont(url) {
  return url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url;
  try { url = new URL(req.url); } catch (err) { return; }

  /* Never cache the management dashboard — officers should always
     see live records, and it must not linger on a shared device. */
  if (url.pathname.indexOf('pengurusan') !== -1) return;

  if (isFont(url)) {
    e.respondWith(
      caches.open(FONTS).then(function (cache) {
        return cache.match(req).then(function (hit) {
          if (hit) return hit;
          return fetch(req).then(function (res) {
            if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
            return res;
          }).catch(function () {
            /* Uncached and unreachable: hand back a real error response,
               never undefined, so respondWith stays valid and the CSS
               fallback font stack takes over cleanly. */
            return hit || Response.error();
          });
        });
      })
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(RUNTIME).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () {
        /* ignoreSearch matters: the campaign QR posters link to
           /?project=community and /?project=commercial, which must
           still resolve to the cached page when there is no signal. */
        return caches.match(req, { ignoreSearch: true }).then(function (hit) {
          if (hit) return hit;
          return caches.match('index.html').then(function (index) {
            if (index) return index;
            return caches.match(OFFLINE_URL).then(function (off) {
              return off || Response.error();
            });
          });
        });
      })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(function (hit) {
      var network = fetch(req).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(RUNTIME).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return hit || Response.error(); });
      return hit || network;
    })
  );
});
