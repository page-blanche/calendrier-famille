// Service worker : ne met rien en cache (tout passe au réseau),
// mais reçoit les notifications push et gère le clic dessus.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});

// Réception d'une notification push
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { corps: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.titre || '🏡 Famille', {
    body: d.corps || '',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    data: { url: d.url || './calendrier.html' }
  }));
});

// Clic sur la notification : ouvre (ou remet au premier plan) l'app
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((liste) => {
    for (const c of liste) { if ('focus' in c) return c.focus(); }
    return self.clients.openWindow((e.notification.data && e.notification.data.url) || './');
  }));
});

