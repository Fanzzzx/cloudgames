/*
 * Data game AwanPlay. Satu game = satu nama, satu deskripsi, satu link foto.
 * Edit file ini untuk mengganti nama, deskripsi, dan foto.
 *
 * `img` sekarang berisi foto placeholder acak dari picsum.photos (rasio 3:4,
 * 600x800 paling pas). Ganti dengan link fotomu sendiri. Pastikan gambar yang
 * kamu pakai milikmu atau berlisensi. Kalau link kosong atau gagal dimuat,
 * otomatis tampil cover buatan kode (lihat js/art.js).
 */
window.CONFIG = {
  usePhotos: true,         // false = selalu pakai cover buatan kode
  featured: [3, 2, 4, 9],  // nomor game di banner atas (1 sampai 10)
  heroInterval: 7000       // ms, ganti banner otomatis
};

window.GAMES = [
  { // 1
    name: 'GTA 5 ONLINE DAN OFFLINE',
    desc: 'Full story map lengkap dan bisa main roleplay.',
    img: 'https://ganga--link--ghhzdp9sv8hk.code.run/i/mruf60wpvi.jpg' },
  { // 2
    name: 'GTA San Andreas Definitive Edition',
    desc: 'GTA SanAndreas mod dan tidak mod, Full map, Full story dan grafik HD.',
    img: 'https://ganga--link--ghhzdp9sv8hk.code.run/i/rffnp884sz.jpg' },
  { // 3
    name: 'GTA SanAndreas',
    desc: 'GTA SanAndreas mod dan tidak mod, Full map, Full story.',
    img: 'https://ganga--link--ghhzdp9sv8hk.code.run/i/uw604lr9ha.jpg' },
  { // 4
    name: 'FC 27',
    desc: 'Game bola terbaru lengkap semua tim grafik HD.',
    img: 'https://ganga--link--ghhzdp9sv8hk.code.run/i/j4xujqufm5.jpg' },
  { // 5
    name: 'CALL OF DUTY',
    desc: 'Game FPS & RPG menarik dan bagus .',
    img: 'https://ganga--link--ghhzdp9sv8hk.code.run/i/juqgkcnywg.jpg' },
  { // 6
    name: 'Forza Horizon 6',
    desc: 'Game mobil balap full mod menyo dan kualitas grafik HD.',
    img: 'https://ganga--link--ghhzdp9sv8hk.code.run/i/2altdogafo.jpg },
  { // 7
    name: 'EURO TRUK SIMULATOR 2',
    desc: 'Game truck yang bagus dan menarik bisa upload kendaraan apa pun.',
    img: 'https://ganga--link--ghhzdp9sv8hk.code.run/i/xfb8v0k8ng.jpg' },
  { // 8
    name: 'SPIDERMAN 2',
    desc: 'Full misi no mod grafik HD.',
    img: 'https://ganga--link--ghhzdp9sv8hk.code.run/i/wmc37leuhh.jpg' },
  { // 9
    name: 'SCAM WITH YOUR FRIENDS',
    desc: 'Game bertujuan untuk menipu seseorang ( hanya simulasi dan yang di tipu adalah AI ).',
    img: 'https://ganga--link--ghhzdp9sv8hk.code.run/i/0kk92f26xi.jpg' },
  { // 10
    name: 'VALORANT',
    desc: 'Game FPS seru grafik HD.',
    img: 'https://ganga--link--ghhzdp9sv8hk.code.run/i/jelax2mneg.jpg' },
];
