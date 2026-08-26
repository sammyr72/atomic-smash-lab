/* ═══════════════════════════════════════════════════════════
   ATOMIC SMASH LAB — site interactions
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── year ──────────────────────────────────────────────── */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ── sticky nav ────────────────────────────────────────── */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    nav.classList.toggle('is-stuck', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── scroll reveal ─────────────────────────────────────── */
  var reveals = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ── cursor glow ───────────────────────────────────────── */
  var glow = document.getElementById('cursorGlow');
  if (glow && !reduced && window.matchMedia('(pointer:fine)').matches) {
    var gx = 0, gy = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      glow.style.opacity = '1';
    }, { passive: true });
    (function follow() {
      gx += (tx - gx) * 0.08;
      gy += (ty - gy) * 0.08;
      glow.style.transform = 'translate3d(' + gx + 'px,' + gy + 'px,0)';
      requestAnimationFrame(follow);
    })();
  }

  /* ── counting stats ────────────────────────────────────── */
  var stats = document.querySelectorAll('[data-count]');
  if (!reduced && 'IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sio.unobserve(entry.target);
        var el = entry.target;
        var target = parseInt(el.dataset.count, 10);
        var start = performance.now();
        var dur = 1100;
        (function tick(now) {
          var t = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased);
          if (t < 1) requestAnimationFrame(tick);
        })(start);
      });
    }, { threshold: 0.6 });
    stats.forEach(function (el) { sio.observe(el); });
  }

  /* ═══════════ PERIODIC SAMPLER ═══════════ */
  var ELEMENTS = [
    { z: 1,  s: 'H',  n: 'Hydrogen',  p: 1,  nn: 0,   e: 1,
      note: 'The simplest atom there is. Your first one, and the one Helios walks you through.' },
    { z: 2,  s: 'He', n: 'Helium',    p: 2,  nn: 2,   e: 2,
      note: 'A full outer shell already. It will not bond with anything you throw at it.' },
    { z: 3,  s: 'Li', n: 'Lithium',   p: 3,  nn: 4,   e: 3,
      note: 'One lonely electron in the outer shell, desperate to be given away.' },
    { z: 6,  s: 'C',  n: 'Carbon',    p: 6,  nn: 6,   e: 6,
      note: 'Four open bonding slots. The backbone of most recipes in the Molecule Lab.' },
    { z: 7,  s: 'N',  n: 'Nitrogen',  p: 7,  nn: 7,   e: 7,
      note: 'Three bonds and a lone pair. Build it, then go make ammonia.' },
    { z: 8,  s: 'O',  n: 'Oxygen',    p: 8,  nn: 8,   e: 8,
      note: 'Two open slots. Grab two hydrogens and you are holding water.' },
    { z: 10, s: 'Ne', n: 'Neon',      p: 10, nn: 10,  e: 10,
      note: 'Noble, complete, gloriously antisocial. Nothing sticks to it.' },
    { z: 11, s: 'Na', n: 'Sodium',    p: 11, nn: 12,  e: 11,
      note: 'Twelve neutrons to stack. The racks start feeling small around here.' },
    { z: 13, s: 'Al', n: 'Aluminium', p: 13, nn: 14,  e: 13,
      note: 'Forty pieces in total. Snap assist starts earning its keep.' },
    { z: 14, s: 'Si', n: 'Silicon',   p: 14, nn: 14,  e: 14,
      note: 'Carbon’s heavier cousin, and the reason you can read this.' },
    { z: 26, s: 'Fe', n: 'Iron',      p: 26, nn: 30,  e: 26,
      note: 'Eighty-two particles. The point where the nucleus stops looking like a clump.' },
    { z: 29, s: 'Cu', n: 'Copper',    p: 29, nn: 35,  e: 29,
      note: 'Ninety-three pieces, and a shell structure that breaks the usual rules.' },
    { z: 47, s: 'Ag', n: 'Silver',    p: 47, nn: 61,  e: 47,
      note: 'A hundred and fifty-five particles. You will want the lasso for this one.' },
    { z: 79, s: 'Au', n: 'Gold',      p: 79, nn: 118, e: 79,
      note: 'Two hundred and seventy-six pieces. A genuine sit-down-and-commit build.' },
    { z: 92, s: 'U',  n: 'Uranium',   p: 92, nn: 146, e: 92,
      note: 'Three hundred and thirty particles. The heaviest thing in nature, by hand.' }
  ];

  var ptable  = document.getElementById('ptable');
  var recipe  = document.getElementById('recipe');
  var rNum    = document.getElementById('rNum');
  var rSym    = document.getElementById('rSym');
  var rName   = document.getElementById('rName');
  var rNote   = document.getElementById('rNote');

  function renderReadout(el) {
    rNum.textContent  = el.z;
    rSym.textContent  = el.s;
    rName.textContent = el.n;
    rNote.textContent = el.note;

    recipe.innerHTML = '';
    [
      { c: el.p,  l: 'protons',   k: 'p' },
      { c: el.nn, l: 'neutrons',  k: 'n' },
      { c: el.e,  l: 'electrons', k: 'e' }
    ].forEach(function (part) {
      var node = document.createElement('div');
      node.className = 'part part--' + part.k;
      node.innerHTML = '<span class="part__c">' + part.c + '</span>' +
                       '<span class="part__l">' + part.l + '</span>';
      recipe.appendChild(node);
    });
  }

  if (ptable) {
    ELEMENTS.forEach(function (el, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'el' + (i === 0 ? ' is-active' : '');
      btn.setAttribute('role', 'listitem');
      btn.setAttribute('aria-label', el.n + ', atomic number ' + el.z);
      btn.innerHTML = '<span class="el__z">' + el.z + '</span>' +
                      '<span class="el__s">' + el.s + '</span>' +
                      '<span class="el__n">' + el.n + '</span>';
      btn.addEventListener('click', function () {
        ptable.querySelectorAll('.el').forEach(function (n) { n.classList.remove('is-active'); });
        btn.classList.add('is-active');
        renderReadout(el);
      });
      ptable.appendChild(btn);
    });
    renderReadout(ELEMENTS[0]);
  }

  /* ═══════════ HERO ATOM ═══════════ */
  var canvas = document.getElementById('atomCanvas');
  if (!canvas || reduced) return;

  var ctx = canvas.getContext('2d');
  var W = 0, H = 0, DPR = 1;
  var cx = 0, cy = 0, scale = 1;
  var mx = 0, my = 0, px = 0, py = 0;

  var NUCLEONS = [];
  var ORBITS = [];

  function seed() {
    NUCLEONS = [];
    for (var i = 0; i < 16; i++) {
      var a = Math.random() * Math.PI * 2;
      var r = Math.pow(Math.random(), 0.5) * 22;
      NUCLEONS.push({
        x: Math.cos(a) * r,
        y: Math.sin(a) * r * 0.9,
        r: 7 + Math.random() * 3,
        proton: i % 2 === 0,
        ph: Math.random() * Math.PI * 2,
        sp: 0.4 + Math.random() * 0.5
      });
    }

    ORBITS = [
      { rx: 150, ry: 54, tilt: 0,             sp: 0.42, n: 2, ph: 0 },
      { rx: 190, ry: 66, tilt: Math.PI / 3,   sp: -0.31, n: 3, ph: 1.2 },
      { rx: 232, ry: 78, tilt: -Math.PI / 3,  sp: 0.24, n: 3, ph: 2.4 }
    ];
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width  = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    // Sit the atom right of centre on wide screens, high-centre on narrow ones.
    var wide = W > 900;
    cx = wide ? W * 0.74 : W * 0.5;
    cy = wide ? H * 0.48 : H * 0.26;
    scale = wide ? Math.min(W / 1500, 1.15) : Math.min(W / 780, 0.78);
  }

  window.addEventListener('mousemove', function (e) {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  function ellipsePoint(o, t) {
    var x = Math.cos(t) * o.rx;
    var y = Math.sin(t) * o.ry;
    return {
      x: x * Math.cos(o.tilt) - y * Math.sin(o.tilt),
      y: x * Math.sin(o.tilt) + y * Math.cos(o.tilt),
      depth: Math.sin(t)          // -1 behind, +1 in front
    };
  }

  var t0 = performance.now();

  function frame(now) {
    var t = (now - t0) / 1000;

    px += (mx * 26 - px) * 0.05;
    py += (my * 20 - py) * 0.05;

    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.translate(cx + px, cy + py);
    ctx.scale(scale, scale);

    // orbit rings
    ORBITS.forEach(function (o) {
      ctx.save();
      ctx.rotate(o.tilt);
      ctx.beginPath();
      ctx.ellipse(0, 0, o.rx, o.ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(167,139,250,.16)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    });

    // nucleus glow
    var ng = ctx.createRadialGradient(0, 0, 0, 0, 0, 92);
    ng.addColorStop(0,   'rgba(255,95,158,.32)');
    ng.addColorStop(0.5, 'rgba(167,139,250,.12)');
    ng.addColorStop(1,   'rgba(167,139,250,0)');
    ctx.fillStyle = ng;
    ctx.beginPath();
    ctx.arc(0, 0, 92, 0, Math.PI * 2);
    ctx.fill();

    // nucleons
    NUCLEONS.forEach(function (n) {
      var wob = Math.sin(t * n.sp + n.ph) * 3;
      var x = n.x + wob;
      var y = n.y + Math.cos(t * n.sp * 0.8 + n.ph) * 3;
      var g = ctx.createRadialGradient(x - n.r * 0.35, y - n.r * 0.35, 1, x, y, n.r);
      if (n.proton) {
        g.addColorStop(0, '#ff9ec4');
        g.addColorStop(1, '#c2255c');
      } else {
        g.addColorStop(0, '#ffe89a');
        g.addColorStop(1, '#c99a12');
      }
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // electrons — drawn back-to-front so depth reads correctly
    var pts = [];
    ORBITS.forEach(function (o) {
      for (var i = 0; i < o.n; i++) {
        var ang = t * o.sp + o.ph + (i * Math.PI * 2) / o.n;
        var p = ellipsePoint(o, ang);
        pts.push(p);
      }
    });
    pts.sort(function (a, b) { return a.depth - b.depth; });

    pts.forEach(function (p) {
      var d = (p.depth + 1) / 2;           // 0 back → 1 front
      var r = 4 + d * 3.4;
      var alpha = 0.35 + d * 0.65;

      var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4.5);
      g.addColorStop(0, 'rgba(124,214,255,' + (alpha * 0.65) + ')');
      g.addColorStop(1, 'rgba(124,214,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(226,246,255,' + alpha + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
    requestAnimationFrame(frame);
  }

  seed();
  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(frame);
})();
