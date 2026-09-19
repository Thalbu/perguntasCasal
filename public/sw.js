/*
 * Service worker mínimo. O app é estático de ponta a ponta, então dá pra
 * guardar tudo que for sendo visitado e servir do cache quando não houver
 * rede — útil em viagem, no interior, ou quando o wi-fi de casa cai.
 *
 * Sem biblioteca de propósito: são três estratégias e ~60 linhas.
 */
const CACHE = "nos-dois-v1";

// o casco mínimo pra abrir offline mesmo sem ter visitado nada antes
const CASCO = ["/", "/icon-192.png", "/icon-512.png", "/manifest.webmanifest"];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(CASCO)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((chaves) =>
        Promise.all(chaves.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (evento) => {
  const req = evento.request;
  const url = new URL(req.url);

  // só GET e só o próprio domínio; o resto passa direto
  if (req.method !== "GET" || url.origin !== self.location.origin) return;
  // o HMR do dev nunca deve ser cacheado
  if (url.pathname.startsWith("/_next/webpack") || url.pathname.includes("hot-update"))
    return;

  // páginas: rede primeiro (pra pegar atualização), cache como rede de segurança
  if (req.mode === "navigate") {
    evento.respondWith(
      fetch(req)
        .then((resposta) => {
          const copia = resposta.clone();
          caches.open(CACHE).then((c) => c.put(req, copia));
          return resposta;
        })
        .catch(() => caches.match(req).then((c) => c || caches.match("/"))),
    );
    return;
  }

  // assets: cache primeiro; os do /_next/static têm hash no nome e nunca mudam
  evento.respondWith(
    caches.match(req).then(
      (guardado) =>
        guardado ||
        fetch(req).then((resposta) => {
          if (resposta.ok && resposta.type === "basic") {
            const copia = resposta.clone();
            caches.open(CACHE).then((c) => c.put(req, copia));
          }
          return resposta;
        }),
    ),
  );
});
