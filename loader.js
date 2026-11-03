// Memuat semua file data JSON, lalu menjalankan app.js.
// Untuk update data: cukup ganti file di folder /data (nama file jangan diubah).
(function () {
  const FILES = ['D','T','F','K','V','W','H','IH','OH','CP','TF'];
  const v = Date.now(); // hindari cache lama di browser
  const box = document.createElement('div');
  box.id = 'moniq-loading';
  box.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;font:16px sans-serif;background:#E8EBF4;color:#1F2340;z-index:9999';
  box.textContent = 'Memuat data MONIQ…';
  document.body.appendChild(box);

  Promise.all(FILES.map(n =>
    fetch('data/' + n + '.json?v=' + v, { cache: 'no-store' }).then(r => {
      if (!r.ok) throw new Error('data/' + n + '.json (' + r.status + ')');
      return r.json();
    })
  )).then(arr => {
    FILES.forEach((n, i) => { window[n] = arr[i]; });
    const s = document.createElement('script');
    s.src = 'app.js?v=' + v;
    s.onload = () => box.remove();
    s.onerror = () => { box.textContent = 'Gagal memuat app.js'; };
    document.body.appendChild(s);
  }).catch(e => {
    box.innerHTML = 'Gagal memuat data: ' + e.message +
      '<br><small>Jika membuka file langsung dari komputer (file://), gunakan GitHub Pages atau server lokal.</small>';
  });
})();
