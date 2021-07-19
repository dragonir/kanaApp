const cacheName = 'kana-v1';
const staticAssets = [
  './',
  './index.html',
  './assets/css/main.css',
  './assets/css/dark.css',
  './assets/css/petals.css',
  './assets/js/main.js',
  './assets/js/kanaList.js',
  './assets/js/petals.js',
  './assets/json/kanaList.json',
  './assets/images/bg.png',
  './assets/images/bg_dark.png',
  './assets/images/mode_toggle.png',
  './assets/images/miraitowa.png',
  './assets/images/icon-64x64.png',
  './assets/images/icon-256x256.png',
  './assets/images/petal.png',
  './assets/images/prize.png',
];

self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

self.addEventListener('activate', e => {
  self.clients.claim();
});

self.addEventListener('fetch', async e => {
  const req = e.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkAndCache(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

async function networkAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached;
  }
}
