/*
 * Logika AwanPlay: pustaka, filter, favorit, detail, banner, dan sesi streaming palsu.
 * Data ada di js/games.js, cover cadangan di js/art.js.
 */
(function () {
  'use strict';

  var $ = function (s) { return document.querySelector(s); };
  var CFG = window.CONFIG, STYLES = window.ART_STYLES;
  /* data sederhana (nama, deskripsi, img) diberi id dan gaya cover cadangan */
  var GAMES = window.GAMES.map(function (x, i) {
    var s = STYLES[i % STYLES.length];
    return { id: 'g' + (i + 1), t: x.name, sub: '', d: x.desc, img: x.img, m: s.m, c: s.c };
  });
  var FEATURED = CFG.featured.map(function (n) { return 'g' + n; });

  var REGIONS = { jkt: { n: 'Jakarta', ping: 14 }, sgp: { n: 'Singapura', ping: 28 }, tyo: { n: 'Tokyo', ping: 78 } };
  var QUALITY = { '720': { n: '720p', fps: 60, br: 12 }, '1080': { n: '1080p', fps: 60, br: 24 }, '4k': { n: '4K', fps: 60, br: 45 } };

  var full = function (g) { return g.t; };
  var idx = function (id) { return GAMES.findIndex(function (g) { return g.id === id; }); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- favorit (disimpan di browser) ---------- */
  var favs = new Set();
  try { favs = new Set(JSON.parse(localStorage.getItem('awanplay.favs') || '[]')); } catch (e) {}
  function saveFavs() { try { localStorage.setItem('awanplay.favs', JSON.stringify(Array.from(favs))); } catch (e) {} }

  /* ---------- cover: foto di atas, cover kode sebagai cadangan ---------- */
  function coverInner(g, i, tag) {
    var photo = (CFG.usePhotos && g.img)
      ? '<img data-cover src="' + esc(g.img) + '" alt="Cover ' + esc(full(g)) + '" loading="lazy" referrerpolicy="no-referrer">'
      : '';
    return window.makeArt(g, i, tag) + photo;
  }
  /* foto yang gagal dimuat dibuang, cover kode di bawahnya tampil */
  document.addEventListener('error', function (e) {
    if (e.target && e.target.tagName === 'IMG' && e.target.hasAttribute('data-cover')) e.target.remove();
  }, true);

  /* ---------- state ---------- */
  var state = { favOnly: false, q: '', sort: 'rec' };

  /* ---------- banner pilihan ---------- */
  var hi = 0, heroPaused = false;
  function renderHero() {
    var g = GAMES[idx(FEATURED[hi])], i = idx(g.id);
    $('#hero').innerHTML =
      '<div class="hero-bg" aria-hidden="true">' + coverInner(g, i, 'hb') + '</div>' +
      '<div class="hero-body">' +
        '<div class="eyebrow">Pilihan · fiktif</div>' +
        '<h1>' + esc(full(g)) + '</h1>' +
        '<p>' + esc(g.d) + '</p>' +
        '<div class="actions"><button class="btn" type="button" data-play="' + g.id + '">Mainkan (simulasi)</button><button class="btn ghost" type="button" data-open="' + g.id + '">Detail</button></div>' +
        '<div class="dots" role="group" aria-label="Pilih banner">' +
          FEATURED.map(function (_, n) { return '<button type="button" data-hero="' + n + '" aria-label="Banner ' + (n + 1) + '" aria-current="' + (n === hi) + '"></button>'; }).join('') +
        '</div>' +
      '</div>' +
      '<div class="cover">' + coverInner(g, i, 'h') + '<span class="fiktif">FIKTIF</span></div>';
  }
  var hero = $('#hero');
  hero.addEventListener('mouseenter', function () { heroPaused = true; });
  hero.addEventListener('mouseleave', function () { heroPaused = false; });
  hero.addEventListener('focusin', function () { heroPaused = true; });
  hero.addEventListener('focusout', function () { heroPaused = false; });
  if (!reduce && FEATURED.length > 1) {
    setInterval(function () {
      if (heroPaused || document.hidden || !$('#play').hidden || !$('#detail').hidden) return;
      hi = (hi + 1) % FEATURED.length; renderHero();
    }, CFG.heroInterval || 7000);
  }

  /* ---------- pustaka ---------- */
  function renderFilters() { $('#favOnly').setAttribute('aria-pressed', state.favOnly); }
  function visible() {
    var q = state.q.trim().toLowerCase();
    var list = GAMES.map(function (g, i) { return { g: g, i: i }; }).filter(function (o) {
      var g = o.g;
      if (state.favOnly && !favs.has(g.id)) return false;
      return !q || (full(g) + ' ' + g.d).toLowerCase().indexOf(q) !== -1;
    });
    if (state.sort === 'az') list.sort(function (a, b) { return full(a.g).localeCompare(full(b.g), 'id'); });
    return list;
  }
  function renderGrid() {
    var list = visible();
    $('#count').textContent = list.length + ' game fiktif';
    if (!list.length) {
      $('#grid').innerHTML = '<div class="empty">' + (state.favOnly && !state.q ? 'Belum ada favorit. Tekan ikon hati di cover untuk menyimpan game.' : 'Tidak ada game yang cocok. Coba kata kunci lain.') + '</div>';
      return;
    }
    $('#grid').innerHTML = list.map(function (o) {
      var g = o.g, on = favs.has(g.id);
      return '<article class="card">' +
        '<button class="open" type="button" data-open="' + g.id + '" aria-label="Detail ' + esc(full(g)) + '">' +
          '<div class="cover">' + coverInner(g, o.i, 'c') + '<span class="fiktif">FIKTIF</span><span class="peek">Lihat detail</span></div>' +
        '</button>' +
        '<button class="fav" type="button" data-fav="' + g.id + '" aria-pressed="' + on + '" aria-label="Favorit ' + esc(full(g)) + '">' + (on ? '♥' : '♡') + '</button>' +
        '<div class="name">' + esc(full(g)) + '</div>' +
      '</article>';
    }).join('');
  }

  function toggleFav(id, btn) {
    if (favs.has(id)) favs.delete(id); else favs.add(id);
    saveFavs();
    var on = favs.has(id);
    if (btn) { btn.setAttribute('aria-pressed', on); if (btn.classList.contains('fav')) btn.textContent = on ? '♥' : '♡'; }
    if (state.favOnly) renderGrid();
    if (!$('#detail').hidden && detailId === id) syncDetailFav();
  }

  /* ---------- detail ---------- */
  var detailId = null, detailOpener = null;
  function syncDetailFav() {
    var on = favs.has(detailId);
    $('#dFav').setAttribute('aria-pressed', on);
    $('#dFav').textContent = on ? '♥ Favorit' : '♡ Favorit';
  }
  function openDetail(id, from) {
    var i = idx(id), g = GAMES[i]; if (!g) return;
    detailId = id; detailOpener = from || null;
    $('#dCover').innerHTML = coverInner(g, i, 'd') + '<span class="fiktif">FIKTIF</span>';
    $('#dGenre').textContent = 'Game fiktif';
    $('#dTitle').textContent = full(g);
    $('#dDesc').textContent = g.d;
    syncDetailFav();
    $('#detail').hidden = false; document.body.style.overflow = 'hidden';
    $('#dPlay').focus();
  }
  function closeDetail(skipFocus) {
    $('#detail').hidden = true; document.body.style.overflow = '';
    if (!skipFocus && detailOpener && document.contains(detailOpener)) detailOpener.focus();
  }
  $('#dClose').addEventListener('click', function () { closeDetail(); });
  $('#detail').addEventListener('click', function (e) { if (e.target === $('#detail')) closeDetail(); });
  $('#dFav').addEventListener('click', function () { toggleFav(detailId, $('#dFav')); syncDetailFav(); renderGridFavOnly(); });
  $('#dPlay').addEventListener('click', function () { var id = detailId, from = detailOpener; closeDetail(true); launch(id, from); });
  /* sinkronkan ikon hati di grid setelah diubah dari detail */
  function renderGridFavOnly() {
    document.querySelectorAll('.fav').forEach(function (b) {
      var on = favs.has(b.dataset.fav); b.setAttribute('aria-pressed', on); b.textContent = on ? '♥' : '♡';
    });
  }

  /* ---------- klik & input ---------- */
  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-play]'))) { launch(t.dataset.play, t); return; }
    if ((t = e.target.closest('[data-open]'))) { openDetail(t.dataset.open, t); return; }
    if ((t = e.target.closest('[data-fav]'))) { toggleFav(t.dataset.fav, t); return; }
    if ((t = e.target.closest('[data-favonly]'))) { state.favOnly = !state.favOnly; renderFilters(); renderGrid(); return; }
    if ((t = e.target.closest('[data-hero]'))) { hi = +t.dataset.hero; renderHero(); }
  });
  $('#q').addEventListener('input', function (e) { state.q = e.target.value; renderGrid(); });
  $('#sort').addEventListener('change', function (e) { state.sort = e.target.value; renderGrid(); });

  /* ---------- sesi streaming palsu ---------- */
  var sess = 0, raf = 0, hudTimer = 0, opener = null;
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  function rng(seed) {
    var a = seed;
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  var hash = function (n) { return Math.abs((Math.sin(n * 127.1) * 43758.5453) % 1); };

  async function launch(id, from) {
    var i = idx(id), g = GAMES[i]; if (!g) return;
    opener = from || null; var my = ++sess;
    var reg = REGIONS[$('#region').value], qual = QUALITY[$('#quality').value];
    $('#play').hidden = false; document.body.style.overflow = 'hidden';
    $('#boot').hidden = false; $('#stream').hidden = true;
    $('#bootCover').innerHTML = coverInner(g, i, 'b');
    $('#bootTitle').textContent = full(g);
    $('#fill').style.width = '0%'; $('#queue').textContent = ''; $('#cancel').focus();

    async function step(txt, pct, ms) {
      if (my !== sess) return false;
      $('#stage').textContent = txt; $('#fill').style.width = pct + '%';
      await sleep(ms); return my === sess;
    }
    if (!await step('Menghubungi server ' + reg.n + '…', 15, 900)) return;
    var pos = 3 + Math.floor(Math.random() * 5);
    $('#stage').textContent = 'Menunggu giliran'; $('#fill').style.width = '45%';
    while (pos > 0) { if (my !== sess) return; $('#queue').textContent = 'Antrean: posisi ' + pos; await sleep(420); pos--; }
    $('#queue').textContent = '';
    if (!await step('Menyiapkan ' + qual.n + ' · ' + qual.fps + ' fps', 80, 1000)) return;
    if (!await step('Memulai stream…', 100, 600)) return;
    startStream(g, reg, qual, my);
  }

  function startStream(g, reg, qual, my) {
    $('#boot').hidden = true; $('#stream').hidden = false; $('#exit').focus();
    var cv = $('#cv'), ctx = cv.getContext('2d'), t0 = performance.now();
    var W = 0, H = 0, px = .5, tx = .5, st = $('#stream');
    function resize() {
      var d = Math.min(window.devicePixelRatio || 1, 1.5);
      W = cv.width = Math.max(2, Math.floor(cv.clientWidth * d));
      H = cv.height = Math.max(2, Math.floor(cv.clientHeight * d));
    }
    resize(); window.addEventListener('resize', resize);
    st.onpointermove = function (e) { var r = st.getBoundingClientRect(); tx = Math.min(.95, Math.max(.05, (e.clientX - r.left) / r.width)); };
    function keys(e) { if (e.key === 'ArrowLeft') tx = Math.max(.05, tx - .06); if (e.key === 'ArrowRight') tx = Math.min(.95, tx + .06); }
    window.addEventListener('keydown', keys);

    var R = rng(7), stars = Array.from({ length: 90 }, function () { return { x: R(), y: R() * .6, s: R() * 2 + 1, v: .02 + R() * .06 }; });
    var speed = reduce ? .25 : 1, a = g.c[0], b = g.c[1], c = g.c[2], m = g.m;

    function loop(now) {
      if (my !== sess) return;
      var t = (now - t0) / 1000 * speed; px += (tx - px) * .08;
      var gr = ctx.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, a); gr.addColorStop(1, b);
      ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
      var hor = H * .58;
      ctx.fillStyle = c; ctx.globalAlpha = .92; ctx.beginPath(); ctx.arc(W * .5, hor - H * .02, H * .15, 0, 7); ctx.fill(); ctx.globalAlpha = 1;

      if (m === 'road' || m === 'grid') {
        ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(0, hor, W, H - hor);
        ctx.strokeStyle = c; ctx.globalAlpha = .6; ctx.lineWidth = Math.max(1, W / 700);
        for (var k = -10; k <= 10; k++) { ctx.beginPath(); ctx.moveTo(W / 2, hor); ctx.lineTo(W / 2 + k * W * .11, H); ctx.stroke(); }
        for (var j = 0; j < 12; j++) { var z = (j + (t * 1.2) % 1) / 12, y = hor + (H - hor) * z * z; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
        ctx.globalAlpha = 1;
      } else if (m === 'stars' || m === 'rings') {
        ctx.fillStyle = '#fff';
        stars.forEach(function (s) { var x = ((s.x - t * s.v) % 1 + 1) % 1; ctx.globalAlpha = .4 + .5 * Math.pow(Math.sin(t * 2 + s.x * 20), 2); ctx.fillRect(x * W, s.y * H * 1.5, s.s * (W / 500), s.s * (W / 500)); });
        ctx.globalAlpha = 1; ctx.strokeStyle = c; ctx.lineWidth = Math.max(2, W / 220);
        for (var q = 0; q < 5; q++) { var r = ((q + t * .35) % 5) / 5 * H * .55; ctx.globalAlpha = 1 - r / (H * .55); ctx.beginPath(); ctx.arc(W / 2, H * .45, r, 0, 7); ctx.stroke(); }
        ctx.globalAlpha = 1;
      } else if (m === 'waves') {
        for (var w = 0; w < 5; w++) {
          ctx.fillStyle = 'rgba(0,0,0,' + (.2 + w * .12) + ')'; ctx.beginPath(); ctx.moveTo(0, H);
          for (var x = 0; x <= W; x += 12) ctx.lineTo(x, hor + w * H * .07 + Math.sin(x * .008 + t * (1 + w * .4) + w) * H * .018);
          ctx.lineTo(W, H); ctx.fill();
        }
      } else if (m === 'city') {
        for (var l = 0; l < 3; l++) {
          ctx.fillStyle = 'rgba(0,0,0,' + (.35 + l * .2) + ')';
          var sc = (60 + l * 40) * (W / 800 + .4), sp = t * (30 + l * 40) * (W / 800 + .4), base = Math.floor(sp / sc);
          for (var n = -1; n < W / sc + 2; n++) {
            var bh = H * (.12 + .3 * hash(n + base + l * 31));
            ctx.fillRect(n * sc - (sp % sc), hor + l * H * .05 + H * .08 - bh, sc * .82, bh + H);
          }
        }
      } else {
        for (var p = 0; p < 3; p++) {
          ctx.fillStyle = 'rgba(0,0,0,' + (.3 + p * .2) + ')'; ctx.beginPath(); ctx.moveTo(0, H);
          var bs = hor + p * H * .1, amp = H * (.2 - p * .05), spd = t * (.35 + p * .35);
          for (var xx = 0; xx <= W; xx += 10) { var u = xx / W * 6 + spd; ctx.lineTo(xx, bs - amp * (.55 + .45 * Math.sin(u * 1.3 + p)) * Math.abs(Math.sin(u * .9 + p * 2))); }
          ctx.lineTo(W, H); ctx.fill();
        }
      }

      /* pemain: pesawat kecil */
      var X = px * W, Y = H * .8 + Math.sin(t * 3) * H * .01, s2 = Math.max(14, W / 34);
      ctx.save(); ctx.translate(X, Y); ctx.shadowColor = c; ctx.shadowBlur = s2;
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(0, -s2); ctx.lineTo(s2 * .8, s2 * .7); ctx.lineTo(0, s2 * .3); ctx.lineTo(-s2 * .8, s2 * .7); ctx.closePath(); ctx.fill();
      ctx.restore();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    function hud() {
      var ping = Math.max(4, Math.round(reg.ping + (Math.random() * 8 - 3)));
      var fps = qual.fps - (Math.random() < .2 ? Math.round(Math.random() * 3) : 0);
      var br = (qual.br * (.9 + Math.random() * .2)).toFixed(1);
      var loss = Math.random() < .08 ? '0.1' : '0.0';
      $('#hPing').textContent = 'PING ' + ping + ' ms'; $('#hFps').textContent = 'FPS ' + fps;
      $('#hBr').textContent = br + ' Mbps'; $('#hLoss').textContent = 'LOSS ' + loss + '%';
      var s = Math.floor((performance.now() - t0) / 1000);
      $('#hTime').textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    }
    hud(); hudTimer = setInterval(hud, 700);
    st._cleanup = function () { window.removeEventListener('resize', resize); window.removeEventListener('keydown', keys); st.onpointermove = null; };
  }

  function closePlay() {
    sess++; cancelAnimationFrame(raf); clearInterval(hudTimer);
    var st = $('#stream'); if (st._cleanup) { st._cleanup(); st._cleanup = null; }
    $('#play').hidden = true; document.body.style.overflow = '';
    if (opener && document.contains(opener)) opener.focus();
  }
  $('#cancel').addEventListener('click', closePlay);
  $('#exit').addEventListener('click', closePlay);
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!$('#play').hidden) closePlay(); else if (!$('#detail').hidden) closeDetail();
  });

  /* ---------- mulai ---------- */
  renderHero(); renderFilters(); renderGrid();
})();
