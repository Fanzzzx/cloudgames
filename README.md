# AwanPlay

Demo antarmuka cloud gaming. Semua game fiktif dan hanya simulasi: tidak ada game sungguhan yang dijalankan, jadi tidak ada layanan atau lisensi pihak lain yang terlibat.

## Struktur

```
awanplay/
├── index.html      halaman utama
├── css/style.css   tampilan
├── js/games.js     nama, deskripsi, link foto (edit di sini)
├── js/art.js       cover cadangan buatan kode (SVG)
├── js/app.js       pustaka, pencarian, favorit, detail, sesi streaming palsu
└── server.js       server statis opsional (Node, tanpa dependensi)
```

## Menjalankan

- Buka `index.html` langsung di browser, atau
- `node server.js` lalu buka http://localhost:3000 (port bisa diatur lewat env `PORT`), atau
- `python3 -m http.server 3000` di folder ini.

Font dimuat dari Google Fonts, jadi perlu internet saat pertama dibuka.

## Mengganti nama, deskripsi, dan foto

Semua ada di `js/games.js`. Satu game = satu nama, satu deskripsi, satu link foto (10 game, 10 link):

```js
{ // 3
  name: 'Ksatria Lembah Arang',
  desc: 'Jelajahi lembah vulkanik, kalahkan penjaga api, dan tempa senjatamu sendiri.',
  img: 'https://picsum.photos/seed/arang/600/800' },   // ganti dengan link fotomu
```

- Rasio 3:4 paling pas (contoh 600x800).
- Isi `img` sekarang foto placeholder acak dari picsum.photos.
- Kalau link kosong atau gagal dimuat, otomatis tampil cover buatan kode.
- `usePhotos: false` di `CONFIG` memaksa semua game memakai cover buatan kode.
- `featured` berisi nomor game (1 sampai 10) yang muncul di banner atas.
- Pakai gambar yang memang milikmu atau berlisensi.

## Mengganti tampilan

Warna dan font ada di blok `:root` paling atas `css/style.css`.

## Menghubungkan ke backend nanti

Sesi palsu ada di fungsi `launch()` dan `startStream()` di `js/app.js`. Ganti dua fungsi itu dengan panggilan ke servermu sendiri.
