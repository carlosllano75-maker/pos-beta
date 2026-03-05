const CACHE_NAME = 'casa-gourmet-v6'; // Subimos la versión para forzar la actualización
const assets = [
  './',
  './index.html',
  './manifest.json',
  './logo-casa-gourmet.jpg',
  './html2canvas.min.js' // <--- LIBRERÍA AGREGADA PARA MODO OFFLINE
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => {
      console.log("Instalando caché offline...");
      return c.addAll(assets);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      // Retorna el archivo desde la memoria si existe, sino lo busca en internet
      return res || fetch(e.request);
    })
  );
});