/*
 * Cover buatan kode (SVG). Dipakai sebagai gambar cadangan kalau foto di
 * js/games.js kosong atau gagal dimuat. Semua bentuknya orisinal.
 */
(function () {
  function rng(seed) {
    let a = seed;
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function mountain(y, amp, ph, op) {
    let d = 'M0 400 L0 ' + y;
    for (let x = 0; x <= 300; x += 10) {
      d += ' L' + x + ' ' + (y - amp * Math.abs(Math.sin(x * .021 + ph)) - amp * .4 * Math.sin(x * .07 + ph * 2)).toFixed(1);
    }
    return '<path d="' + d + ' L300 400Z" fill="#000" opacity="' + op + '"/>';
  }

  /* gaya cover cadangan, urutannya sama dengan js/games.js */
  window.ART_STYLES = [
    { m: 'castle', c: ['#2a0f2e', '#a8324a', '#ffb26b'] },
    { m: 'road',   c: ['#0a1a3a', '#e0527a', '#ffd27a'] },
    { m: 'sun',    c: ['#1d1b3a', '#e36a3d', '#ffd27a'] },
    { m: 'stars',  c: ['#080b24', '#2b2a6e', '#9be7ff'] },
    { m: 'grid',   c: ['#13062e', '#5b1ea8', '#ff6fd8'] },
    { m: 'blocks', c: ['#2e1a0d', '#c4561f', '#ffd27a'] },
    { m: 'grid',   c: ['#06122b', '#0f4c75', '#3ef0ff'] },
    { m: 'castle', c: ['#0b2a2e', '#1f7a7a', '#bff5ff'] },
    { m: 'waves',  c: ['#0b1d3a', '#1b5f8f', '#ffe29a'] },
    { m: 'rings',  c: ['#1a0f2e', '#4b2a8a', '#ffd27a'] }
  ];

  window.makeArt = function (g, i, tag) {
    const a = g.c[0], b = g.c[1], c = g.c[2];
    const id = 'bg' + i + (tag || ''), R = rng(i * 97 + 13);
    let o = '<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient></defs>' +
      '<rect width="300" height="400" fill="url(#' + id + ')"/>';

    switch (g.m) {
      case 'sun':
        o += '<circle cx="150" cy="200" r="64" fill="' + c + '"/>' + mountain(300, 60, 1, .35) + mountain(340, 45, 3, .5) + mountain(385, 30, 5, .75);
        break;

      case 'castle':
        o += '<circle cx="215" cy="110" r="26" fill="' + c + '"/>';
        [[30,150,36],[78,110,30],[118,180,40],[170,90,34],[214,140,38],[256,170,32]].forEach(function (t) {
          const x = t[0], h = t[1], w = t[2];
          o += '<rect x="' + x + '" y="' + (330 - h) + '" width="' + w + '" height="' + (h + 70) + '" fill="#000" opacity=".62"/>' +
               '<path d="M' + (x - 3) + ' ' + (330 - h) + ' L' + (x + w / 2) + ' ' + (330 - h - 30) + ' L' + (x + w + 3) + ' ' + (330 - h) + 'Z" fill="#000" opacity=".62"/>';
        });
        o += '<rect y="330" width="300" height="70" fill="#000" opacity=".75"/>';
        break;

      case 'road':
        o += '<circle cx="150" cy="215" r="48" fill="' + c + '"/><rect y="220" width="300" height="180" fill="#000" opacity=".45"/>' +
             '<path d="M122 220 L178 220 L292 400 L8 400Z" fill="#000" opacity=".6"/>' +
             '<path d="M150 224 L150 400" stroke="' + c + '" stroke-width="4" stroke-dasharray="12 16"/>';
        break;

      case 'grid':
        o += '<circle cx="150" cy="226" r="70" fill="' + c + '"/><rect y="230" width="300" height="170" fill="' + a + '"/>';
        for (let k = 0; k <= 10; k++) o += '<path d="M150 230 L' + (-210 + k * 72) + ' 400" stroke="' + c + '" stroke-opacity=".65" stroke-width="1.5"/>';
        for (let j = 1; j <= 7; j++) o += '<path d="M0 ' + (230 + j * j * 3.6).toFixed(1) + ' H300" stroke="' + c + '" stroke-opacity=".65" stroke-width="1.5"/>';
        break;

      case 'stars':
        for (let k = 0; k < 60; k++) {
          const s = R() * 2 + .8;
          o += '<rect x="' + (R() * 300).toFixed(0) + '" y="' + (R() * 400).toFixed(0) + '" width="' + s.toFixed(1) + '" height="' + s.toFixed(1) + '" fill="#fff" opacity="' + (.4 + R() * .6).toFixed(2) + '"/>';
        }
        o += '<circle cx="120" cy="250" r="84" fill="' + c + '"/><circle cx="150" cy="270" r="84" fill="#000" opacity=".28"/>' +
             '<ellipse cx="120" cy="250" rx="140" ry="22" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3" transform="rotate(-18 120 250)"/>';
        break;

      case 'waves':
        o += '<circle cx="150" cy="215" r="58" fill="' + c + '"/>';
        for (let w = 0; w < 4; w++) {
          const y = 250 + w * 34;
          let d = 'M0 400 L0 ' + y;
          for (let x = 0; x <= 300; x += 8) d += ' L' + x + ' ' + (y + 8 * Math.sin(x * .04 + w * 1.7)).toFixed(1);
          o += '<path d="' + d + ' L300 400Z" fill="#000" opacity="' + (.22 + w * .14).toFixed(2) + '"/>';
        }
        break;

      case 'rings':
        for (let r = 140; r >= 20; r -= 24) {
          const hot = r % 48 === 20;
          o += '<circle cx="150" cy="200" r="' + r + '" fill="none" stroke="' + (hot ? c : '#fff') + '" stroke-opacity="' + (hot ? .95 : .28) + '" stroke-width="' + (hot ? 9 : 5) + '"/>';
        }
        o += '<circle cx="150" cy="200" r="12" fill="' + c + '"/>';
        break;

      case 'blocks':
        for (let y = 0; y < 8; y++) for (let x = 0; x < 6; x++) {
          o += '<rect x="' + x * 50 + '" y="' + y * 50 + '" width="50" height="50" fill="#000" opacity="' + ((x + y) % 2 ? .22 : .04) + '"/>';
        }
        o += '<circle cx="110" cy="170" r="62" fill="' + c + '"/><circle cx="110" cy="170" r="44" fill="' + b + '" opacity=".7"/>' +
             '<circle cx="210" cy="260" r="46" fill="' + c + '" opacity=".85"/><circle cx="210" cy="260" r="30" fill="' + b + '" opacity=".7"/>';
        break;

      case 'city':
        o += '<circle cx="200" cy="150" r="40" fill="' + c + '" opacity=".9"/>';
        for (let l = 0; l < 3; l++) {
          let x = -10;
          while (x < 300) {
            const w = 26 + R() * 26, h = 60 + R() * 110 + l * 20, y = 360 - l * 14 - h + 40;
            o += '<rect x="' + x.toFixed(0) + '" y="' + y.toFixed(0) + '" width="' + w.toFixed(0) + '" height="' + (h + 60).toFixed(0) + '" fill="#000" opacity="' + (.35 + l * .2).toFixed(2) + '"/>';
            if (l === 2) {
              for (let k = 0; k < 4; k++) {
                if (R() > .4) o += '<rect x="' + (x + 5 + (k % 2) * 12).toFixed(0) + '" y="' + (y + 10 + Math.floor(k / 2) * 16).toFixed(0) + '" width="5" height="7" fill="' + c + '" opacity=".85"/>';
              }
            }
            x += w + 3;
          }
        }
        break;

      case 'forest':
        o += '<circle cx="90" cy="110" r="30" fill="' + c + '" opacity=".85"/>';
        for (let l = 0; l < 3; l++) {
          for (let x = -10 + l * 14; x < 310; x += 44 - l * 6) {
            const h = 90 + R() * 70 + l * 25, y = 330 + l * 24;
            o += '<path d="M' + x + ' ' + y + ' L' + (x + 20) + ' ' + (y - h) + ' L' + (x + 40) + ' ' + y + 'Z" fill="#000" opacity="' + (.3 + l * .22).toFixed(2) + '"/>';
          }
        }
        break;
    }
    return o + '</svg>';
  };
})();
