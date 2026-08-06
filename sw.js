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

// Clic sur la notification : ouvre l'app (ou la remet au premier plan)
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const cible = new URL('calendrier.html', self.registration.scope).href;
  e.waitUntil((async () => {
    const fenetres = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    // 1. une fenêtre du calendrier déjà ouverte → premier plan
    for (const f of fenetres) {
      if (f.url && f.url.indexOf('calendrier') !== -1) {
        try { return await f.focus(); } catch (_) {}
      }
    }
    // 2. sinon : ouvrir l'app installée sur la bonne page
    try { return await self.clients.openWindow(cible); } catch (_) {}
    // 3. dernier recours : une fenêtre du site, qu'on redirige
    if (fenetres[0]) {
      try { await fenetres[0].focus(); await fenetres[0].navigate(cible); } catch (_) {}
    }
  })());
});

