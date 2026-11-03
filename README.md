# MONIQ - Monitoring by SQ Jabar

Dashboard statis (HTML + JS). Data dipisah ke folder `data/` supaya update cukup mengganti file data.

## Struktur
```
index.html   -> tampilan dashboard
loader.js    -> memuat file data lalu menjalankan app.js
app.js       -> logika dashboard
data/        -> semua data (JSON)
```

## Isi folder data
| File | Isi |
|------|-----|
| D.json  | tNPS Mobile |
| T.json  | Tiket Mobile |
| F.json  | tNPS Fixed |
| TF.json | Tiket Fixed |
| V.json  | Visit Jabar |
| W.json  | Waiting Time |
| CP.json | CAPS |
| K.json  | KPI (MOMO & TOMO) |
| H.json  | Sales Halo |
| IH.json | Sales IndiHome |
| OH.json | Sales ORBIT |

## Cara update data
1. Buka repo di GitHub -> folder `data`.
2. Klik **Add file -> Upload files**, drag file JSON terbaru (nama file harus sama persis).
3. Klik **Commit changes**. Tunggu 1-2 menit, lalu refresh dashboard.

## Cara aktifkan GitHub Pages
Settings -> Pages -> Source: *Deploy from a branch* -> Branch: `main` / folder `/ (root)` -> Save.

## Catatan
- Jangan buka `index.html` langsung dengan klik dua kali (file://), karena browser memblokir pemuatan data. Gunakan GitHub Pages atau server lokal: `python -m http.server` lalu buka http://localhost:8000
- Data berisi NIK dan skor per karyawan. Jangan taruh di repo publik.
