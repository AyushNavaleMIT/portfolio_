/* main.js: site config, link slots, GitHub data, footer year.
   Fill in the empty strings in CONFIG as real links become available.
   Empty values render as clearly labelled "coming soon" slots, never as fake links. */
(function () {
  'use strict';

  var CONFIG = {
    githubUser: 'SymbioteX01',
    email: 'ayushnavale210@gmail.com',   // public address from the earlier portfolio
    linkedin: '',       // e.g. 'https://www.linkedin.com/in/your-handle/'
    projects: {         // github / demo: full https URLs or site-relative paths. stack: array of strings.
      compass:   { github: '', demo: 'assets/projects/campus-compass.html', stack: ['HTML', 'CSS', 'JavaScript'] },
      datathon:  { stack: ['Python', 'Pandas'] },
      campus:    { github: '', demo: '', stack: [] },
      netpulse:  { github: '', demo: '', stack: [] },
      netsage:   { github: '', demo: '', stack: [] },
      hypoguard: { github: '', demo: '', stack: [] }
    },
    certs: { cisco: '', js1: '', js2: '' }   // verification URLs
  };
  window.AN = { CONFIG: CONFIG };

  function isUrl(v) { return typeof v === 'string' && /^(https?:\/\/|assets\/)/i.test(v); }

  /* Replace a "coming soon" span with a real anchor. */
  function activate(el, href, label) {
    var a = document.createElement('a');
    a.className = 'link-slot on';
    a.href = href;
    a.textContent = label;
    if (/^(https?:|assets\/)/i.test(href)) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    el.replaceWith(a);
    return a;
  }

  function initLinks() {
    document.querySelectorAll('[data-project]').forEach(function (card) {
      var cfg = CONFIG.projects[card.dataset.project] || {};
      card.querySelectorAll('[data-slot]').forEach(function (slot) {
        var url = cfg[slot.dataset.slot];
        if (isUrl(url)) activate(slot, url, slot.dataset.slot === 'github' ? 'Repository' : 'Live demo');
      });
      var stack = card.querySelector('[data-stack]');
      if (stack && Array.isArray(cfg.stack) && cfg.stack.length) {
        var label = document.createElement('p');
        label.className = 'p-label';
        label.textContent = 'Stack';
        var ul = document.createElement('ul');
        ul.className = 'chips';
        cfg.stack.forEach(function (s) { var li = document.createElement('li'); li.textContent = s; ul.appendChild(li); });
        stack.append(label, ul);
      }
    });

    document.querySelectorAll('[data-cert]').forEach(function (el) {
      var url = CONFIG.certs[el.dataset.cert];
      if (isUrl(url)) activate(el, url, 'Verify');
    });

    var mail = document.querySelector('[data-contact="email"]');
    if (mail && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(CONFIG.email)) {
      var a = activate(mail, 'mailto:' + CONFIG.email, CONFIG.email);
      var cta = document.getElementById('contact-cta');
      if (cta) { cta.href = 'mailto:' + CONFIG.email; cta.removeAttribute('target'); cta.removeAttribute('rel'); }
    }
    var li = document.querySelector('[data-contact="linkedin"]');
    if (li && isUrl(CONFIG.linkedin)) activate(li, CONFIG.linkedin, 'Open LinkedIn');
  }

  /* ===== GitHub ===== */
  var API = 'https://api.github.com/users/' + CONFIG.githubUser;

  function getJSON(url) {
    var key = 'an:' + url, cached = null;
    try { cached = JSON.parse(sessionStorage.getItem(key)); } catch (e) {}
    if (cached) return Promise.resolve(cached);
    var ctrl = 'AbortController' in window ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 8000) : null;
    return fetch(url, { headers: { Accept: 'application/vnd.github+json' }, signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) { try { sessionStorage.setItem(key, JSON.stringify(d)); } catch (e) {} return d; })
      .finally(function () { if (timer) clearTimeout(timer); });
  }

  function fallback(box) {
    box.textContent = '';
    var d = document.createElement('div');
    d.className = 'gh-fallback';
    d.append('Live repository data could not be loaded right now. ');
    var a = document.createElement('a');
    a.href = 'https://github.com/' + CONFIG.githubUser + '?tab=repositories';
    a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.textContent = 'Browse repositories on GitHub';
    d.append(a, '.');
    box.appendChild(d);
  }

  function renderRepos(list) {
    var box = document.getElementById('gh-repos');
    var repos = list.filter(function (r) { return !r.fork; })
      .sort(function (a, b) { return new Date(b.pushed_at) - new Date(a.pushed_at); }).slice(0, 6);
    if (!repos.length) { fallback(box); return; }
    box.textContent = '';
    var accents = ['pink', 'cyan', 'yellow', 'purple', 'green', 'pink'];
    repos.forEach(function (r, i) {
      var a = document.createElement('a');
      a.className = 'card repo accent-' + accents[i % accents.length];
      a.href = r.html_url; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.style.setProperty('--i', i);
      var k = document.createElement('p'); k.className = 'card-k'; k.textContent = r.language || 'Repository';
      var h = document.createElement('h3'); h.textContent = r.name;
      var p = document.createElement('p'); p.textContent = r.description || 'No description provided.';
      var m = document.createElement('div'); m.className = 'meta';
      var s = document.createElement('span'); s.textContent = '★ ' + r.stargazers_count;
      var f = document.createElement('span'); f.textContent = 'Forks ' + r.forks_count;
      m.append(s, f);
      a.append(k, h, p, m);
      box.appendChild(a);
    });
  }

  function initGitHub() {
    var box = document.getElementById('gh-repos');
    if (!box) return;
    getJSON(API).then(function (u) {
      var nums = document.querySelectorAll('#gh-stats b');
      if (nums.length === 3) {
        nums[0].textContent = u.public_repos; nums[1].textContent = u.followers; nums[2].textContent = u.following;
      }
    }).catch(function () {});
    getJSON(API + '/repos?per_page=100&sort=pushed').then(renderRepos).catch(function () { fallback(box); });

    var img = document.getElementById('gh-graph-img'), msg = document.getElementById('gh-graph-msg');
    if (img && msg) {
      img.onload = function () { img.hidden = false; msg.hidden = true; };
      img.onerror = function () {
        msg.hidden = false;
        msg.textContent = '';
        var a = document.createElement('a');
        a.href = 'https://github.com/' + CONFIG.githubUser; a.target = '_blank'; a.rel = 'noopener noreferrer';
        a.textContent = 'View contribution activity on GitHub';
        a.style.color = 'var(--yellow)';
        msg.append('The contribution graph is unavailable right now. ', a, '.');
      };
      img.src = 'https://ghchart.rshah.org/00e5ff/' + CONFIG.githubUser;
    }
  }

  document.getElementById('year').textContent = new Date().getFullYear();
  initLinks();
  initGitHub();
})();
