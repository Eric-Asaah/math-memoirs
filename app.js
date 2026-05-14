(function () {
  'use strict';

  var STORAGE_LIKES = 'memoir-likes-v1';
  var CONFIG_URL = new URL('site.json', window.location.href).href;

  /** Major platforms (fixed SVG markup). Add `href` in site.json to activate. */
  function socialIconMarkup(network) {
    var n = String(network || 'generic').toLowerCase();
    if (n === 'twitter') n = 'x';
    var svgs = {
      github:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.45 7.9 10.98.6.1.75-.25.75-.55v-2c-3.2.7-3.9-1.55-3.9-1.55-.5-1.35-1.25-1.7-1.25-1.7-1-.65.1-.65.1-.65 1.1.05 1.7 1.15 1.7 1.15 1 1.7 2.6 1.2 3.25.95.1-.75.4-1.2.75-1.45-2.55-.3-5.2-1.3-5.2-5.85 0-1.3.45-2.35 1.2-3.2-.15-.35-.5-1.75.1-3.65 0 0 1-.35 3.3 1.2 1-.25 2.05-.35 3.1-.35 1.05 0 2.1.1 3.1.35 2.3-1.55 3.25-1.2 3.25-1.2.65 1.9.25 3.3.1 3.65.75.85 1.2 1.9 1.2 3.2 0 4.55-2.65 5.55-5.2 5.85.4.35.8 1.05.8 2.1v3.1c0 .3.15.65.75.55A10.8 10.8 0 0023.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>',
      youtube:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M23.5 6.2c-.3-1.1-1.1-1.9-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6c-1 .2-1.8 1-2.1 2.1C0 8.1 0 12 0 12s0 3.9.5 5.8c.3 1.1 1.1 1.9 2.1 2.1 1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6c1-.2 1.8-1 2.1-2.1.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 15.5v-7l6 3.5-6 3.5z"/></svg>',
      instagram:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.3 2.4.5.6.2 1.1.5 1.6 1s.8 1 1 1.6c.2.5.4 1.2.5 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.9-.5 2.4-.2.6-.5 1.1-1 1.6s-1 .8-1.6 1c-.5.2-1.2.4-2.4.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.3-2.4-.5-.6-.2-1.1-.5-1.6-1s-.8-1-1-1.6c-.2-.5-.4-1.2-.5-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.9.5-2.4.2-.6.5-1.1 1-1.6s1-.8 1.6-1c.5-.2 1.2-.4 2.4-.5C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2 .4-.5.2-.9.5-1.3.9s-.7.8-.9 1.3c-.2.3-.3.9-.4 2C2.4 8.5 2.4 8.9 2.4 12s0 3.5.1 4.7c.1 1.1.2 1.7.4 2 .2.5.5.9.9 1.3s.8.7 1.3.9c.3.2.9.3 2 .4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2-.4.5-.2.9-.5 1.3-.9s.7-.8.9-1.3c.2-.3.3-.9.4-2 .1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2-.2-.5-.5-.9-.9-1.3s-.8-.7-1.3-.9c-.3-.2-.9-.3-2-.4-1.2-.1-1.6-.1-4.7-.1zm0 3.5A5.5 5.5 0 1017.5 12 5.5 5.5 0 0012 7.5zm0 9A3.5 3.5 0 1115.5 12 3.5 3.5 0 0112 16.5zm5.6-9.8a1.3 1.3 0 11-1.3 1.3 1.3 1.3 0 011.3-1.3z"/></svg>',
      tiktok:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>',
      facebook:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.47h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>',
      discord:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>',
      whatsapp:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M20.5 3.5A11.8 11.8 0 0012 0C5.4 0 .1 5.3.1 11.9c0 2.1.5 4.1 1.5 5.9L0 24l6.3-1.7a11.7 11.7 0 005.7 1.5h.1C18.6 24 24 18.7 24 12.1 24 8.8 22.8 5.7 20.5 3.5zM12 21.5h-.1c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-3.7 1 1-3.6-.3-.4A9.6 9.6 0 1121.6 12 9.7 9.7 0 0112 21.5zm5.5-8c-.3-.1-3-1.5-3.5-1.7-.5-.2-.8-.1-1 .1-.3.3-1.2 1.5-1.5 1.8-.3.3-.5.4-.9.1-.3-.1-1.4-.5-2.6-1.7-1-.9-1.6-2-1.8-2.3-.2-.3 0-.5.1-.7l.5-.5c.1-.1.3-.3.4-.5.1-.2.1-.4 0-.5-.1-.2-1-2.4-1.3-3.3-.4-.9-.8-.8-1-.8h-.8c-.2 0-.5.1-.8.3-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 1.9 2.9 4.6 4.1.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 3-.3 3.4-1.3.4-1 .4-1.8.3-2z"/></svg>',
      email:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"/></svg>',
      x: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M18.9 3h3.4l-7.4 8.5L23 21h-6.9l-5.4-7.1L5 21H1.5l7.9-9.1L1 3h7.1l4.9 6.4 5.9-6.4z"/></svg>',
      linkedin:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V23h-4V8zm7.5 0h3.8v2.05h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.13V23h-4v-7.07c0-1.69-.03-3.86-2.35-3.86-2.35 0-2.71 1.84-2.71 3.74V23h-4V8z"/></svg>',
      generic:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM5 5h6V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6h-2v6H5V5z"/></svg>',
      google_form:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 12h8v2H8v-2zm0 4h8v2H8v-2zm0-8h3v2H8V8z"/></svg>'
    };
    return svgs[n] || svgs.generic;
  }

  var DEFAULT_SOCIAL_ORDER = [
    { network: 'github', label: 'GitHub' },
    { network: 'youtube', label: 'YouTube' },
    { network: 'instagram', label: 'Instagram' },
    { network: 'tiktok', label: 'TikTok' },
    { network: 'x', label: 'X' },
    { network: 'linkedin', label: 'LinkedIn' },
    { network: 'facebook', label: 'Facebook' },
    { network: 'discord', label: 'Discord' },
    { network: 'whatsapp', label: 'WhatsApp' },
    { network: 'email', label: 'Email' }
  ];

  function pdfBasename(path) {
    if (!path) return 'manuscript.pdf';
    var s = String(path).replace(/\\/g, '/').split('/');
    return s[s.length - 1] || 'manuscript.pdf';
  }

  function loadSiteData() {
    return fetch(CONFIG_URL, { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .catch(function (firstErr) {
        var el = document.getElementById('site-data-embedded');
        if (el && el.textContent.trim()) {
          try {
            return JSON.parse(el.textContent);
          } catch (parseErr) {
            throw firstErr;
          }
        }
        throw firstErr;
      });
  }

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDate(isoDate) {
    if (!isoDate) return '';
    var d = new Date(isoDate + (String(isoDate).length === 10 ? 'T12:00:00' : ''));
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function getYear() {
    return String(new Date().getFullYear());
  }

  function setMeta(nameOrProp, value, isProperty) {
    if (!value) return;
    var sel = isProperty ? 'meta[property="' + nameOrProp + '"]' : 'meta[name="' + nameOrProp + '"]';
    var el = document.head.querySelector(sel);
    if (!el) {
      el = document.createElement('meta');
      if (isProperty) el.setAttribute('property', nameOrProp);
      else el.setAttribute('name', nameOrProp);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  }

  function applyHead(site) {
    if (site.documentTitle) document.title = site.documentTitle;
    if (site.metaDescription) {
      setMeta('description', site.metaDescription, false);
      setMeta('og:description', site.metaDescription, true);
      setMeta('twitter:description', site.metaDescription, true);
    }
    if (site.documentTitle) {
      setMeta('og:title', site.documentTitle, true);
      setMeta('twitter:title', site.documentTitle, true);
    }
    setMeta('twitter:card', 'summary', true);
    setMeta('og:type', 'website', true);

    var base = site.baseUrl && String(site.baseUrl).trim();
    var canonicalHref = base || window.location.href.split('#')[0];
    try {
      canonicalHref = new URL(base || window.location.href).href;
    } catch (e) {
      canonicalHref = window.location.href.split('#')[0];
    }
    var link = document.getElementById('canonical-link');
    if (link) link.setAttribute('href', canonicalHref);
    setMeta('og:url', canonicalHref, true);

    if (site.ogImage && String(site.ogImage).trim()) {
      setMeta('og:image', site.ogImage, true);
      setMeta('twitter:image', site.ogImage, true);
    }
  }

  function readLikes() {
    try {
      var raw = localStorage.getItem(STORAGE_LIKES);
      var o = raw ? JSON.parse(raw) : {};
      return o && typeof o === 'object' ? o : {};
    } catch (e) {
      return {};
    }
  }

  function writeLikes(map) {
    try {
      localStorage.setItem(STORAGE_LIKES, JSON.stringify(map));
    } catch (e) {
      /* ignore quota */
    }
  }

  function showToast(msg, durationMs) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    t.classList.add('toast--on');
    clearTimeout(showToast._tid);
    var ms = typeof durationMs === 'number' ? durationMs : 2600;
    showToast._tid = setTimeout(function () {
      t.classList.remove('toast--on');
      t.hidden = true;
    }, ms);
  }

  function feedbackUrlForEntry(site, entry) {
    var fb = site.connect && site.connect.feedback && site.connect.feedback.href;
    if (!fb) return '';
    var u;
    try {
      u = new URL(fb, window.location.href);
    } catch (e) {
      return fb;
    }
    var title = entry.title ? 'Feedback: ' + entry.title : 'Memoir feedback';
    if (!u.searchParams.get('title')) u.searchParams.set('title', title);
    var body = 'Entry: ' + (entry.id || '') + (entry.title ? '\n\n' : '\n');
    if (!u.searchParams.get('body')) u.searchParams.set('body', body);
    return u.href;
  }

  function renderHeader(site) {
    var label = $('#site-label');
    if (label && site.byline) label.textContent = site.byline;
    var rule = $('#header-rule-label');
    if (rule && site.ruleLabel) rule.textContent = site.ruleLabel;

    var h1 = document.getElementById('hero-title');
    if (h1 && site.heading) {
      h1.innerHTML = '';
      var span1 = document.createElement('span');
      span1.textContent = site.heading.line1 || 'Mathematical';
      h1.appendChild(span1);
      h1.appendChild(document.createElement('br'));
      var em = document.createElement('em');
      em.textContent = site.heading.line2Italic || 'Memoirs';
      h1.appendChild(em);
    }

    var sub = $('#subtitle');
    if (sub && site.subtitle) sub.textContent = site.subtitle;

    var pl = $('#project-label');
    if (pl && site.projectLabel) pl.textContent = site.projectLabel;
  }

  function renderHeaderMedia(site) {
    var wrap = document.getElementById('header-visual');
    var slot = document.getElementById('portrait-slot');
    var img = document.getElementById('portrait-img');
    var label = document.getElementById('portrait-slot-label');
    if (!wrap || !slot || !img) return;

    var im = site.images || {};
    var url = String(im.portraitUrl || '').trim() || String(im.logoUrl || '').trim();
    var alt = String(im.portraitAlt || '').trim() || 'Site image';

    if (!url) {
      slot.classList.add('portrait-slot--placeholder');
      img.hidden = true;
      img.removeAttribute('src');
      img.alt = '';
      if (label) {
        label.hidden = false;
        label.textContent =
          'Logo or portrait — add assets/your-file.png then set site.images.portraitUrl or logoUrl in site.json';
      }
      wrap.hidden = false;
      return;
    }

    wrap.hidden = false;
    slot.classList.remove('portrait-slot--placeholder');
    img.src = url;
    img.alt = alt;
    img.hidden = false;
    if (label) label.hidden = true;
  }

  function applyAnalytics(site) {
    var a = site && site.analytics;
    if (!a) return;

    var dom = String(a.plausibleDomain || '').trim();
    if (dom && !document.querySelector('script[data-plausible-memoir]')) {
      var p = document.createElement('script');
      p.defer = true;
      p.dataset.plausibleMemoir = '1';
      p.setAttribute('data-domain', dom);
      p.src = 'https://plausible.io/js/script.js';
      document.head.appendChild(p);
    }

    var gid = String(a.googleMeasurementId || '').trim();
    if (gid && !document.getElementById('ga-memoir-lib')) {
      var ext = document.createElement('script');
      ext.async = true;
      ext.id = 'ga-memoir-lib';
      ext.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gid);
      document.head.appendChild(ext);
      var inline = document.createElement('script');
      inline.id = 'ga-memoir-inline';
      inline.textContent =
        'window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config",' +
        JSON.stringify(gid) +
        ');';
      document.head.appendChild(inline);
    }
  }

  function renderDiscussion(site) {
    var d = site && site.discussion;
    var slot = document.getElementById('discussion-slot');
    if (!slot) return;

    if (!d || !d.enabled || d.type !== 'utterances' || !String(d.repo || '').trim()) {
      slot.hidden = true;
      slot.innerHTML = '';
      return;
    }

    slot.hidden = false;
    slot.innerHTML = '';

    var lab = document.createElement('p');
    lab.className = 'section-label discussion-label';
    lab.textContent = 'Comments';
    slot.appendChild(lab);

    var s = document.createElement('script');
    s.src = 'https://utteranc.es/client.js';
    s.setAttribute('repo', d.repo.trim());
    s.setAttribute('issue-term', d.issueTerm || 'pathname');
    s.setAttribute('theme', d.theme || 'preferred-color-scheme');
    s.crossOrigin = 'anonymous';
    s.async = true;
    slot.appendChild(s);
  }

  function renderConnect(site) {
    var wrap = document.getElementById('connect-panel');
    if (!wrap) return;
    if (site.connect && site.connect.enabled === false) {
      wrap.hidden = true;
      return;
    }

    var c = site.connect || {};
    var social = Array.isArray(c.social) ? c.social : [];
    var hasGoogleForm = c.googleForm && String(c.googleForm.href || '').trim();
    var hasTextLinks = (c.links || []).some(function (l) {
      return l && String(l.href || '').trim();
    });
    var hasFb = c.feedback && String(c.feedback.href || '').trim();

    wrap.hidden = false;
    wrap.innerHTML = '';

    var h = document.createElement('h2');
    h.className = 'connect-heading';
    h.textContent = c.heading || 'Public channels & feedback';
    wrap.appendChild(h);

    if (c.intro) {
      var p = document.createElement('p');
      p.className = 'connect-intro';
      p.textContent = c.intro;
      wrap.appendChild(p);
    }

    // Build icon row only from what you list
    if (social.length > 0) {
      var icons = document.createElement('div');
      icons.className = 'social-row social-row--platforms';
      social.forEach(function (item) {
        var net = String(item.network || 'generic').toLowerCase();
        if (net === 'twitter') net = 'x';
        var markup = socialIconMarkup(net);
        if (item.href && String(item.href).trim()) {
          var a = document.createElement('a');
          a.className = 'social-link';
          a.href = item.href.trim();
          a.rel = 'noopener noreferrer';
          a.setAttribute('aria-label', item.label || item.network);
          a.innerHTML = markup;
          icons.appendChild(a);
        } else {
          var sp = document.createElement('span');
          sp.className = 'social-link social-link--muted';
          sp.setAttribute('aria-label', (item.label || item.network) + ' — add href in site.json under connect.social');
          sp.title = 'Configure in site.json (connect.social)';
          sp.innerHTML = markup;
          icons.appendChild(sp);
        }
      });
      wrap.appendChild(icons);
    }

    var row = document.createElement('div');
    row.className = 'connect-actions connect-actions--primary';

    if (hasGoogleForm) {
      var g = document.createElement('a');
      g.className = 'btn btn-form';
      g.href = c.googleForm.href.trim();
      g.rel = 'noopener noreferrer';
      g.target = '_blank';
      var ic = document.createElement('span');
      ic.className = 'btn-form-icon';
      ic.setAttribute('aria-hidden', 'true');
      ic.innerHTML = socialIconMarkup('google_form');
      g.appendChild(ic);
      g.appendChild(document.createTextNode(' ' + (c.googleForm.label || 'Google Form')));
      row.appendChild(g);
    }

    if (hasFb) {
      var f = document.createElement('a');
      f.className = 'btn btn-primary';
      f.href = c.feedback.href;
      f.rel = 'noopener noreferrer';
      f.target = '_blank';
      f.textContent = c.feedback.label || 'GitHub issue';
      row.appendChild(f);
    }

    (c.links || []).forEach(function (link) {
      if (!link || !String(link.href || '').trim()) return;
      var a = document.createElement('a');
      a.className = 'btn btn-secondary';
      a.href = link.href;
      a.rel = 'noopener noreferrer';
      a.target = '_blank';
      a.textContent = link.label || link.href;
      row.appendChild(a);
    });

    if (row.childNodes.length) wrap.appendChild(row);
  }

  function setCopyrightYear() {
    var cy = document.getElementById('copyright-year');
    if (cy) cy.textContent = getYear();
  }

  function renderFooter(site) {
    setCopyrightYear();

    var f = (site && site.footer) || {};

    var author = $('#footer-author');
    if (author) author.textContent = f.author || '';

    var lic = $('#footer-license');
    if (lic) lic.textContent = f.license || '';

    var repo = document.getElementById('footer-repo');
    if (repo) {
      if (f.repoUrl && f.repoLabel) {
        repo.href = f.repoUrl;
        repo.textContent = f.repoLabel;
      } else if (f.repoLabel) {
        repo.textContent = f.repoLabel;
        repo.removeAttribute('href');
      }
    }

    var tag = document.getElementById('footer-tagline');
    if (tag) tag.textContent = f.tagline || '';

    var pr = document.getElementById('footer-privacy');
    if (pr) {
      if (f.privacyNote) {
        pr.textContent = f.privacyNote;
        pr.hidden = false;
      } else {
        pr.textContent = '';
        pr.hidden = true;
      }
    }
  }

  function renderEntryCard(entry, globalIndex, site, likes) {
    var pending = entry.status === 'pending';
    var card = document.createElement('article');
    card.className = 'entry-card' + (pending ? ' pending' : '');
    card.dataset.entryId = entry.id || 'entry-' + globalIndex;

    var stamp = document.createElement('div');
    stamp.className = 'entry-stamp' + (pending ? ' pending' : '');
    stamp.textContent = pending ? '⧗ In progress' : '✓ Completed';
    card.appendChild(stamp);

    var head = document.createElement('div');
    head.className = 'entry-header';

    var num = document.createElement('span');
    num.className = 'entry-number';
    num.textContent = 'Entry ' + String(globalIndex + 1).padStart(2, '0');
    head.appendChild(num);

    if (pending) {
      var dspan = document.createElement('span');
      dspan.className = 'entry-date';
      dspan.textContent = '— ' + getYear();
      head.appendChild(dspan);
    } else if (entry.datetime) {
      var time = document.createElement('time');
      time.className = 'entry-date';
      time.dateTime = entry.datetime;
      time.textContent = formatDate(entry.datetime);
      head.appendChild(time);
    }

    card.appendChild(head);

    var h2 = document.createElement('h2');
    h2.className = 'entry-title';
    h2.textContent = entry.title || '';
    card.appendChild(h2);

    var bodyWrap = document.createElement('div');
    bodyWrap.className = 'entry-body-wrap';
    var body = document.createElement('p');
    body.className = 'entry-body';
    body.innerHTML = entry.body || '';
    bodyWrap.appendChild(body);

    var listUi = site.listUi || {};
    var bodyLimit =
      typeof listUi.bodyCharsBeforeToggle === 'number' ? listUi.bodyCharsBeforeToggle : 200;
    var bodyText = entry.body || '';
    if (!pending && bodyText.length > bodyLimit) {
      body.classList.add('entry-body--clamp');
      var rm = document.createElement('button');
      rm.type = 'button';
      rm.className = 'read-more-btn';
      rm.textContent = 'Read more';
      rm.addEventListener('click', function () {
        var open = card.classList.toggle('entry-card--expanded');
        rm.textContent = open ? 'Show less' : 'Read more';
      });
      bodyWrap.appendChild(rm);
    }
    card.appendChild(bodyWrap);

    var tags = document.createElement('div');
    tags.className = 'entry-tags';
    (entry.tags || []).forEach(function (t) {
      var span = document.createElement('span');
      span.className = 'tag';
      span.textContent = t;
      tags.appendChild(span);
    });
    card.appendChild(tags);

    var searchBits = [
      entry.title,
      entry.body,
      (entry.tags || []).join(' '),
      entry.pdf || '',
      entry.id || '',
      'entry ' + String(globalIndex + 1).padStart(2, '0')
    ];
    card.dataset.search = searchBits
      .join(' ')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    var toolbar = document.createElement('div');
    toolbar.className = 'entry-toolbar';

    var left = document.createElement('div');
    left.className = 'entry-toolbar-left';

    var like = document.createElement('button');
    like.type = 'button';
    like.className = 'like-btn';
    var eid = entry.id || String(globalIndex);
    var liked = !!likes[eid];
    like.setAttribute('aria-pressed', liked ? 'true' : 'false');
    like.setAttribute('aria-label', liked ? 'Unlike this entry' : 'I like this entry');
    var icon = document.createElement('span');
    icon.className = 'like-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = liked ? '♥' : '♡';
    var txt = document.createElement('span');
    txt.className = 'like-text';
    txt.textContent = liked ? 'Saved' : 'I like this';
    like.appendChild(icon);
    like.appendChild(document.createTextNode(' '));
    like.appendChild(txt);
    like.addEventListener('click', function () {
      var map = readLikes();
      var on = !map[eid];
      if (on) map[eid] = true;
      else delete map[eid];
      writeLikes(map);
      like.setAttribute('aria-pressed', on ? 'true' : 'false');
      like.setAttribute('aria-label', on ? 'Unlike this entry' : 'I like this entry');
      like.querySelector('.like-icon').textContent = on ? '♥' : '♡';
      like.querySelector('.like-text').textContent = on ? 'Saved' : 'I like this';
      showToast(
        on
          ? 'Saved only in this browser — not sent to the author. Clear site data in the browser to reset.'
          : 'Removed from this browser.',
        on ? 4200 : 2600
      );
    });
    left.appendChild(like);

    var entryFb = feedbackUrlForEntry(site, entry);
    if (entryFb) {
      var ef = document.createElement('a');
      ef.className = 'btn btn-ghost';
      ef.href = entryFb;
      ef.rel = 'noopener noreferrer';
      ef.textContent = 'Note on this entry';
      left.appendChild(ef);
    }

    toolbar.appendChild(left);

    var right = document.createElement('div');
    right.className = 'entry-toolbar-right';

    if (!pending && entry.pdf) {
      var openA = document.createElement('a');
      openA.className = 'entry-cta entry-cta--open';
      openA.href = entry.pdf;
      openA.target = '_blank';
      openA.rel = 'noopener noreferrer';
      openA.textContent = entry.openLabel || entry.manuscriptLabel || 'Open PDF';

      var dl = document.createElement('a');
      dl.className = 'entry-cta entry-cta--download';
      dl.href = entry.pdf;
      if (entry.download === true && entry.downloadName) {
        dl.setAttribute('download', entry.downloadName);
      } else {
        dl.setAttribute('download', pdfBasename(entry.pdf));
      }
      dl.textContent = entry.downloadLabel || 'Download PDF';

      right.appendChild(openA);
      right.appendChild(dl);
    } else if (pending) {
      var lock = document.createElement('span');
      lock.className = 'entry-cta';
      lock.textContent = entry.lockedLabel || 'Locked';
      right.appendChild(lock);
    }

    toolbar.appendChild(right);
    card.appendChild(toolbar);

    return card;
  }

  function wireManuscriptSearch() {
    var input = document.getElementById('manuscript-search');
    var root = document.getElementById('entries-root');
    var empty = document.getElementById('search-empty');
    if (!input || !root) return;
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      root.classList.toggle('catalog--filtering', !!q);
      root.querySelectorAll('.entries-section').forEach(function (sec) {
        sec.classList.toggle('entries-section--filter-expand', !!q);
      });
      var cards = root.querySelectorAll('.entry-card');
      var visible = 0;
      cards.forEach(function (card) {
        var hay = card.dataset.search || '';
        var show = !q || hay.indexOf(q) !== -1;
        card.hidden = !show;
        if (show) visible++;
      });
      if (empty) empty.hidden = !q || visible > 0;
      root.querySelectorAll('.btn-show-more').forEach(function (b) {
        b.hidden = !!q;
      });
      root.querySelectorAll('.placeholder-card').forEach(function (ph) {
        ph.hidden = !!q;
      });
      root.querySelectorAll('.entries-section-label').forEach(function (lab) {
        var el = lab.nextElementSibling;
        if (!el || !el.classList.contains('entries-section')) return;
        var any = false;
        el.querySelectorAll('.entry-card').forEach(function (c) {
          if (!c.hidden) any = true;
        });
        lab.hidden = !!q && !any;
        el.hidden = !!q && !any;
      });
    });
  }

  function renderEntries(entries, site) {
    var root = document.getElementById('entries-root');
    if (!root) return;

    var loading = document.getElementById('entries-loading');
    if (loading) loading.remove();

    root.innerHTML = '';
    root.classList.remove('catalog--filtering');

    var empty = document.createElement('p');
    empty.id = 'search-empty';
    empty.className = 'search-empty';
    empty.hidden = true;
    empty.textContent = 'No manuscripts match your search.';
    root.appendChild(empty);

    var list = Array.isArray(entries) ? entries.slice() : [];

    var verified = [];
    var pending = [];
    list.forEach(function (e, i) {
      e._i = i;
      if (e.status === 'pending') pending.push(e);
      else verified.push(e);
    });

    var vc = document.getElementById('verified-count');
    var pc = document.getElementById('pending-count');
    if (vc) vc.textContent = String(verified.length);
    if (pc) pc.textContent = String(pending.length);

    var likes = readLikes();
    var lu = site.listUi || {};
    var maxShow =
      typeof lu.maxEntriesBeforeShowAll === 'number' ? lu.maxEntriesBeforeShowAll : 3;

    function section(labelText, arr) {
      if (!arr.length) return;
      var lab = document.createElement('p');
      lab.className = 'section-label entries-section-label';
      lab.textContent = labelText;
      root.appendChild(lab);

      var sectionRoot = document.createElement('div');
      sectionRoot.className = 'entries-section';

      var needToggle = arr.length > maxShow;
      arr.forEach(function (entry, idx) {
        var card = renderEntryCard(entry, entry._i, site, likes);
        if (needToggle && idx >= maxShow) card.classList.add('entry-collapsed');
        sectionRoot.appendChild(card);
        // typeset LaTeX if MathJax is loaded
        if (typeof MathJax !== 'undefined' && MathJax.typeset) {
          MathJax.typeset([card]);
        }
      });
      root.appendChild(sectionRoot);

      if (needToggle) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-show-more';
        var expanded = false;
        btn.textContent = 'View all in ' + labelText + ' (' + arr.length + ')';
        btn.addEventListener('click', function () {
          expanded = !expanded;
          sectionRoot.classList.toggle('entries-section--expanded', expanded);
          btn.textContent = expanded
            ? 'Show fewer in ' + labelText
            : 'View all in ' + labelText + ' (' + arr.length + ')';
        });
        root.appendChild(btn);
      }
    }

    section('Completed', verified);
    section('In progress', pending);

    var ph = site.placeholder;
    if (ph) {
      var box = document.createElement('div');
      box.className = 'placeholder-card';
      if (ph.symbol) {
        var sym = document.createElement('span');
        sym.className = 'placeholder-symbol';
        sym.textContent = ph.symbol;
        box.appendChild(sym);
      }
      box.appendChild(document.createTextNode(ph.text || ''));
      root.appendChild(box);
    }

    wireManuscriptSearch();
  }

  function showLoadError(err) {
    var el = document.getElementById('load-error');
    if (!el) return;
    el.hidden = false;
    var isFile = window.location.protocol === 'file:';
    var detail = escapeHtml(err && err.message ? err.message : 'Unknown error');
    var fileHint =
      '<p><strong>You opened this page from disk</strong> (<code>file://</code>). Browsers block <code>fetch</code> for neighboring files even when the path is correct, so <code>site.json</code> cannot load that way unless a fallback is present.</p>' +
      '<p><strong>Ways to preview:</strong> (1) Publish with <strong>GitHub Pages</strong> and open the <code>https://…</code> URL. (2) From this folder run <code>npx --yes serve .</code> and use the local <code>http://localhost…</code> link. (3) After editing <code>site.json</code>, run <code>node inject-site-embedded.cjs</code> so the latest data is embedded in <code>index.html</code> for offline double‑click.</p>';
    var httpHint =
      '<p>Confirm <code>site.json</code> is in the same folder as <code>index.html</code> on your server and that the server returns it with a 200 status.</p>';
    el.innerHTML =
      '<p class="load-error-title"><strong>Catalog could not load.</strong> (' + detail + ')</p>' +
      (isFile ? fileHint : httpHint);
  }

  function main() {
    setCopyrightYear();

    loadSiteData()
      .then(function (data) {
        var errEl = document.getElementById('load-error');
        if (errEl) {
          errEl.hidden = true;
          errEl.innerHTML = '';
        }
        var site = data.site || {};
        var entries = data.entries || [];
        applyHead(site);
        renderHeader(site);
        renderHeaderMedia(site);
        renderEntries(entries, site);
        renderDiscussion(site);
        renderConnect(site);
        renderFooter(site);
        applyAnalytics(site);
      })
      .catch(function (e) {
        setCopyrightYear();
        var loading = document.getElementById('entries-loading');
        if (loading) loading.remove();
        showLoadError(e);
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', main);
  else main();
})();