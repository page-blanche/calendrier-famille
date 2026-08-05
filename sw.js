// Service worker minimal : ne met rien en cache, laisse tout passer au réseau.
// Sa seule présence permet l'installation de l'app sur Android.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
