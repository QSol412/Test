const APP="goblin-app-v1";
self.addEventListener("install",e=>{e.waitUntil(caches.open(APP).then(c=>c.addAll(["./","index.html","manifest.json"])).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=="GET"||u.pathname.startsWith("/m/"))return;
  const cdn=u.hostname==="cdn.jsdelivr.net";
  if(!cdn&&u.origin!==location.origin)return;
  e.respondWith((async()=>{
    const c=await caches.open(APP);
    if(cdn){const hit=await c.match(r);if(hit)return hit}
    try{const res=await fetch(r);if(res.ok)c.put(r,res.clone());return res}
    catch(err){const hit=await c.match(r,{ignoreSearch:true})||(r.mode==="navigate"?await c.match("index.html"):null);if(hit)return hit;throw err}
  })());
});
