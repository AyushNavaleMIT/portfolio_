/* animations.js: hero entrance, heading split, scroll reveals, timeline + page progress. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Split headings into words so each can slide up from a mask. */
  function split(el) {
    var count = 0;
    (function walk(node, parent) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
            var i = document.createElement('i'); i.textContent = t; i.style.setProperty('--wi', count++);
            w.appendChild(i); frag.appendChild(w);
          });
          parent.replaceChild(frag, n);
        } else if (n.nodeType === 1) { walk(n, n); }
      });
    })(el, el);
  }
  document.querySelectorAll('[data-split]').forEach(function (h) {
    h.setAttribute('aria-label', h.textContent.trim());
    split(h);
  });

  /* Stagger indices */
  document.querySelectorAll('[data-stagger]').forEach(function (c) {
    Array.prototype.forEach.call(c.children, function (el, i) { el.style.setProperty('--i', i); });
  });

  /* Hero entrance after fonts are ready (with a safety timeout). */
  var hero = document.getElementById('hero');
  var started = false;
  function startHero() { if (started) return; started = true; requestAnimationFrame(function () { hero.classList.add('hero-ready'); }); }
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(startHero); setTimeout(startHero, 1200); } else { startHero(); }

  /* Scroll-triggered reveals */
  var targets = document.querySelectorAll('[data-reveal],[data-stagger],[data-split],.foot-brand');
  if (!('IntersectionObserver' in window) || reduce) {
    targets.forEach(function (t) { t.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* Scroll progress + timeline rail fill (one rAF-throttled handler) */
  var bar = document.getElementById('progress');
  var tl = document.getElementById('timeline');
  var ticking = false;
  function update() {
    ticking = false;
    var h = root.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(window.scrollY / h, 1) : 0) + ')';
    if (tl) {
      var r = tl.getBoundingClientRect();
      var p = (window.innerHeight * 0.6 - r.top) / r.height;
      tl.style.setProperty('--prog', Math.max(0, Math.min(1, p)).toFixed(3));
    }
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
