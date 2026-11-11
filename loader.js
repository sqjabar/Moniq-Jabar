/* MONIQ loader: muat manifest + data/*.json, lalu jalankan app.js */
(function(){
  var NAMES=['D','T','F','K','V','W','H','IH','OH','CP','TF','FU','ORD','ACC'];
  var upd=document.getElementById('upd');
  function say(t,err){if(upd){upd.textContent=t;upd.style.color=err?'#E5393A':''}}
  function j(url){return fetch(url).then(function(r){if(!r.ok)throw new Error(url+' ('+r.status+')');return r.json()})}
  say('Memuat data…');
  fetch('manifest.json',{cache:'no-store'}).then(function(r){
    if(!r.ok)throw new Error('manifest.json ('+r.status+')');return r.json();
  }).then(function(m){
    return Promise.all(NAMES.map(function(n){
      return j('data/'+n+'.json?v='+((m.files||{})[n]||m.version||''));
    })).then(function(arr){
      NAMES.forEach(function(n,i){window[n]=arr[i]});
      return fetch('update.json',{cache:'no-store'}).then(function(r){return r.ok?r.json():{}}).catch(function(){return {}});
    }).then(function(u){
      say(u.label||'');
      return new Promise(function(ok,no){
        var s=document.createElement('script');
        s.src='app.js?v='+(m.app||m.version||'');
        s.onload=ok;s.onerror=function(){no(new Error('app.js gagal dimuat'))};
        document.body.appendChild(s);
      });
    });
  }).catch(function(e){
    var local=location.protocol==='file:';
    say('Gagal memuat data: '+e.message+(local?' — buka lewat GitHub Pages atau server lokal, bukan klik dua kali file.':' — pastikan manifest.json dan semua file di folder data sudah ter-upload, lalu Ctrl+F5.'),true);
    console.error(e);
  });
})();
