/* ============================================================
   Mathematical Memoirs — design enhancements (PREVIEW)
   Progressive, additive behaviors for the notebook page.
   No dependencies. Degrades gracefully; honors reduced motion.
   ============================================================ */
(function () {
  'use strict';

  var REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. Reading progress thread (left margin) ------------- */
  function initReadingThread() {
    if (document.querySelector('.reading-thread')) return;
    var thread = document.createElement('div');
    thread.className = 'reading-thread';
    thread.setAttribute('aria-hidden', 'true');
    var fill = document.createElement('div');
    fill.className = 'reading-thread__fill';
    thread.appendChild(fill);
    document.body.appendChild(thread);

    var ticking = false;
    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
      fill.style.height = pct.toFixed(1) + '%';
      ticking = false;
    }
    function onScroll() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ---- 2. Marginalia + scroll reveal ------------------------ */
  function addMarginalia(card, index) {
    if (card.querySelector('.margin-note')) return;
    var num = card.querySelector('.entry-number');
    var date = card.querySelector('.entry-date');
    var n = num ? num.textContent.replace(/[^0-9]/g, '') : String(index + 1);
    var note = document.createElement('div');
    note.className = 'margin-note';
    note.setAttribute('aria-hidden', 'true');
    var html = '\u00A7' + (n || String(index + 1));
    if (date) {
      var d = date.textContent.replace(/^[\s\u2014-]+/, '').trim();
      if (d) html += '<small>' + d + '</small>';
    }
    note.innerHTML = html;
    card.appendChild(note);
  }

  function initReveal(cards) {
    cards.forEach(function (card, i) {
      addMarginalia(card, i);
      if (!REDUCE) card.classList.add('reveal');
    });
    if (REDUCE || !('IntersectionObserver' in window)) {
      cards.forEach(function (c) { c.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    cards.forEach(function (c) { io.observe(c); });
  }

  /* ---- 3. Right-rail scroll-spy entry index ----------------- */
  function initRail(cards) {
    if (document.querySelector('.entry-rail')) return;
    if (cards.length < 2) return;
    var rail = document.createElement('nav');
    rail.className = 'entry-rail';
    rail.setAttribute('aria-label', 'Entry index');

    var map = [];
    cards.forEach(function (card, i) {
      var id = card.dataset.entryId || ('entry-' + i);
      if (!card.id) card.id = id;
      var titleEl = card.querySelector('.entry-title');
      var title = titleEl ? titleEl.textContent.trim() : ('Entry ' + (i + 1));
      var a = document.createElement('a');
      a.href = '#' + card.id;
      a.innerHTML = '<span class="label">' + title.replace(/[<>&]/g, '') +
        '</span><span class="dot"></span>';
      rail.appendChild(a);
      map.push({ card: card, link: a });
    });
    document.body.appendChild(rail);

    // Height-robust active detection: the current entry is the last one
    // whose top has crossed ~35% down the viewport. Works for cards that
    // are taller than the viewport (where a 0.5 threshold never fires).
    var ticking = false;
    function setActive() {
      var line = window.innerHeight * 0.35;
      var current = map[0];
      map.forEach(function (m) {
        if (m.card.getBoundingClientRect().top <= line) current = m;
      });
      map.forEach(function (x) { x.link.classList.toggle('active', x === current); });
      ticking = false;
    }
    function onScroll() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(setActive); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    setActive();
  }

  /* ---- 5. Like-button heart burst --------------------------- */
  function wireLikeBursts(root) {
    root.addEventListener('click', function (ev) {
      var btn = ev.target.closest ? ev.target.closest('.like-btn') : null;
      if (!btn) return;
      // Let app.js flip aria-pressed first, then react.
      window.setTimeout(function () {
        var on = btn.getAttribute('aria-pressed') === 'true';
        if (!on) return;
        btn.classList.add('pop');
        window.setTimeout(function () { btn.classList.remove('pop'); }, 460);
        if (REDUCE) return;
        for (var i = 0; i < 6; i++) {
          (function (k) {
            var s = document.createElement('span');
            s.className = 'heart-spark';
            s.textContent = k % 2 ? '\u2665' : '\u2726';
            s.style.setProperty('--dx', (Math.random() * 40 - 20).toFixed(0) + 'px');
            s.style.setProperty('--dy', (-24 - Math.random() * 26).toFixed(0) + 'px');
            btn.appendChild(s);
            window.requestAnimationFrame(function () { s.classList.add('go'); });
            window.setTimeout(function () { s.remove(); }, 750);
          })(i);
        }
      }, 0);
    });
  }

  /* ---- 6. Display-equation hover-zoom + copy-LaTeX ----------- */
  // MathJax's typesetPromise clears its math list, so the reliable
  // source of LaTeX is site.json. We extract math tokens per entry
  // (in order) and map them onto that card's rendered containers.
  var TOKEN_RE = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\$([^$]+?)\$|\\\(([\s\S]+?)\\\)/g;

  function extractMath(body) {
    var out = [];
    var m;
    TOKEN_RE.lastIndex = 0;
    while ((m = TOKEN_RE.exec(body)) !== null) {
      if (m[1] != null) out.push({ tex: m[1].trim(), display: true });
      else if (m[2] != null) out.push({ tex: m[2].trim(), display: true });
      else if (m[3] != null) out.push({ tex: m[3].trim(), display: false });
      else if (m[4] != null) out.push({ tex: m[4].trim(), display: false });
    }
    return out;
  }

  function attachCopy(container, tex) {
    if (container.dataset.enhanced) return;
    container.dataset.enhanced = '1';
    var wrap = document.createElement('span');
    wrap.className = 'eq-wrap';
    container.parentNode.insertBefore(wrap, container);
    wrap.appendChild(container);
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'eq-copy';
    btn.textContent = 'copy';
    btn.setAttribute('aria-label', 'Copy LaTeX source');
    btn.addEventListener('click', function (ev) {
      ev.stopPropagation();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(tex).then(function () {
          btn.textContent = 'copied';
          window.setTimeout(function () { btn.textContent = 'copy'; }, 1400);
        }).catch(function () { btn.textContent = 'err'; });
      }
    });
    wrap.appendChild(btn);
  }

  function enhanceEquations(byId) {
    var cards = document.querySelectorAll('.entry-card');
    cards.forEach(function (card) {
      var id = card.dataset.entryId;
      var body = byId[id];
      if (body == null) return;
      var tokens = extractMath(body);
      if (!tokens.length) return;
      var containers = card.querySelectorAll('mjx-container');
      if (containers.length !== tokens.length) return; // order can't be trusted
      tokens.forEach(function (tok, i) {
        var c = containers[i];
        if (tok.display && c.getAttribute('display') === 'true') attachCopy(c, tok.tex);
      });
    });
  }

  function initEquations() {
    fetch(new URL('site.json', window.location.href).href, { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !Array.isArray(data.entries)) return;
        var byId = {};
        data.entries.forEach(function (e) { if (e && e.id) byId[e.id] = e.body || ''; });
        var run = function () { enhanceEquations(byId); };
        if (typeof MathJax !== 'undefined' && MathJax.startup && MathJax.startup.promise) {
          MathJax.startup.promise.then(function () { window.setTimeout(run, 150); });
        } else {
          window.setTimeout(run, 900);
        }
        var root = document.getElementById('entries-root');
        if (root) {
          root.addEventListener('click', function (ev) {
            if (ev.target.closest && ev.target.closest('.read-more-btn')) {
              window.setTimeout(run, 500);
            }
          });
        }
      })
      .catch(function () {});
  }

  /* ---- Bootstrap: wait for app.js to render entry cards ------ */
  function whenCardsReady(cb) {
    var root = document.getElementById('entries-root');
    if (!root) return;
    function check() {
      var cards = root.querySelectorAll('.entry-card');
      if (cards.length) { cb(Array.prototype.slice.call(cards), root); return true; }
      return false;
    }
    if (check()) return;
    var obs = new MutationObserver(function () {
      if (check()) obs.disconnect();
    });
    obs.observe(root, { childList: true, subtree: true });
    window.setTimeout(function () { obs.disconnect(); check(); }, 6000);
  }

  function start() {
    initReadingThread();
    whenCardsReady(function (cards, root) {
      initReveal(cards);
      initRail(cards);
      wireLikeBursts(root);
      initEquations();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
