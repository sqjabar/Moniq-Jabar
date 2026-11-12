(function(){
  var v=Date.now();
  var box=document.createElement('div');
  box.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;font:16px sans-serif;background:#E8EBF4;color:#1F2340;z-index:9999;padding:20px';
  box.textContent='Memuat data MONIQ…';
  document.body.appendChild(box);
  function get(u){return fetch(u+'?v='+v,{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error(u+' ('+r.status+')');return r.json()})}
  function badge(){
    fetch('update.json?v='+v,{cache:'no-store'}).then(function(r){return r.ok?r.json():null}).then(function(j){
      var m=document.getElementById('meta');if(!j||!j.updated||!m)return;
      var b=document.createElement('div');
      b.style.cssText='display:inline-block;margin:6px 0 2px;padding:3px 12px;border-radius:99px;background:#fff;border:1px solid #E2E5F0;color:#EC0000;font-weight:700;font-size:12.5px';
      b.textContent='\uD83D\uDD52 Latest Update '+j.updated;
      m.parentNode.insertBefore(b,m);
    }).catch(function(){});
  }
  var names;
  get('manifest.json').then(function(m){names=m;return Promise.all(m.map(function(n){return get('data/'+n+'.json')}))})
  .then(function(arr){
    names.forEach(function(n,i){window[n]=arr[i]});
    var s=document.createElement('script');s.src='app.js?v='+v;
    s.onload=function(){box.remove();badge()};
    s.onerror=function(){box.textContent='Gagal memuat app.js'};
    document.body.appendChild(s);
  }).catch(function(e){
    box.innerHTML='Gagal memuat data: '+e.message+'<br><small>Jika membuka file langsung dari komputer (file://), gunakan GitHub Pages atau server lokal.</small>';
  });
})();