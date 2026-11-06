/* 우리북 service worker: keeps the app working offline. Bump VERSION on every release. */
const VERSION='uribook-v1';
const FONTS='uribook-fonts';
const SHELL=['./','./index.html','./app.js','./manifest.webmanifest','./vendor/pdf-lib.min.js','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];

self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)));});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==VERSION&&k!==FONTS).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting();});
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET')return;
  const u=new URL(req.url);
  if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){
    e.respondWith(caches.open(FONTS).then(async c=>{
      const hit=await c.match(req); if(hit)return hit;
      try{const r=await fetch(req);if(r.ok||r.type==='opaque')c.put(req,r.clone());return r;}catch(err){return Response.error();}
    }));
    return;
  }
  if(u.origin!==self.location.origin)return;
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(hit=>hit||fetch(req).then(r=>{
    if(r.ok){const copy=r.clone();caches.open(VERSION).then(c=>c.put(req,copy));}
    return r;
  }).catch(()=>req.mode==='navigate'?caches.match('./index.html'):Response.error())));
});
