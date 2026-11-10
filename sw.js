const VERSION = "orivane-shell-v10";
const BASE = new URL("./", self.location.href);
const SHELL = [
  new URL("./", BASE).href,
  new URL("./index.html", BASE).href,
  new URL("./style.css?v=42", BASE).href,
  new URL("./motion.css?v=1", BASE).href,
  new URL("./control-center.css?v=1", BASE).href,
  new URL("./control-center.js?v=1", BASE).href,
  new URL("./motion.js?v=1", BASE).href,
  new URL("./script.js?v=47", BASE).href,
  new URL("./owner-panel.js?v=12", BASE).href,
  new URL("./owner-panel.css?v=5", BASE).href,
  new URL("./gif-accessibility.js?v=3", BASE).href,
  new URL("./features.js?v=1", BASE).href,
  new URL("./workspace.js?v=25", BASE).href,
  new URL("./gif-picker.js?v=20", BASE).href,
  new URL("./studios.js?v=43", BASE).href,
  new URL("./install.js?v=1", BASE).href,
  new URL("./manifest.json", BASE).href,
  new URL("./orivane-icon.svg", BASE).href
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("orivane-shell-") && key !== VERSION).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("message", event => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) caches.open(VERSION).then(cache => cache.put(new URL("./index.html", BASE).href, response.clone()));
      return response;
    }).catch(async () => (await caches.match(request)) || (await caches.match(new URL("./index.html", BASE).href)) || Response.error()));
    return;
  }
  if (SHELL.includes(request.url) || /\.(?:css|js|svg|json)$/.test(url.pathname)) {
    event.respondWith(caches.match(request).then(cached => {
      const fresh = fetch(request).then(response => {
        if (response.ok) caches.open(VERSION).then(cache => cache.put(request, response.clone()));
        return response;
      }).catch(() => cached);
      return cached || fresh;
    }));
  }
});