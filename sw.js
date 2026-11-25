// 홈 화면 앱용 서비스 워커. 앱 파일 전부를 기기에 담아 두어 인터넷 없이도 열리게 한다.
// 새 버전을 올리면 다음에 열 때 새 파일을 받아 두고, 그다음 실행부터 새 버전이 열린다.
const VERSION = 'daw-470804ea0979';
const FILES = ["./","./assets/index-B47P0_QX.css","./assets/index-BmmF_lxN.js","./assets/lamejs-DZQw-GQ8.js","./icon-180.png","./icon-192.png","./icon-512.png","./index.html","./manifest.webmanifest"];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k.startsWith('daw-') && k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(VERSION).then(async (c) => {
      const hit = await c.match(req, { ignoreSearch: true });
      if (hit) return hit;
      if (req.mode === 'navigate') {
        const home = await c.match('./');
        if (home) return home;
      }
      return fetch(req);
    }),
  );
});
