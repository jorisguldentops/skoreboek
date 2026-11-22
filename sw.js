// Skoreboek service worker: app werkt offline; nieuwe versie = VERSIE ophogen
const VERSIE='skoreboek-v4';
const BESTANDEN=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','pdfjs/pdf.min.mjs','pdfjs/pdf.worker.min.mjs'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSIE).then(c=>c.addAll(BESTANDEN)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSIE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  if(r.mode==='navigate'){ // eerst netwerk (nieuwste versie), anders uit cache
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(VERSIE).then(x=>x.put('index.html',c));return res}).catch(()=>caches.match('index.html')));return}
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r)));
});
