/* Umman Trading — site scripts (no dependencies) */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } },
  };

  // Remember the language the visitor is reading
  store.set('lang', doc.lang);
  document.querySelectorAll('[data-lang]').forEach(function (a) {
    a.addEventListener('click', function () { store.set('lang', a.getAttribute('data-lang')); });
  });

  // ---------- header shadow on scroll ----------
  var header = document.querySelector('[data-header]');
  var onScroll = function () { header && header.classList.toggle('is-scrolled', window.scrollY > 8); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- mobile menu ----------
  var burger = document.querySelector('[data-burger]');
  var nav = document.querySelector('[data-nav]');
  function setMenu(open) {
    if (!burger || !nav) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.querySelector('.sr-only').textContent = burger.getAttribute(open ? 'data-label-close' : 'data-label-open');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  }
  if (burger) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.matchMedia('(min-width: 1121px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });
  }

  // ---------- request form ----------
  var form = document.querySelector('[data-request-form]');
  if (!form) return;

  // Pre-select a product from ?product=yarn
  var m = /[?&]product=([a-z]+)/.exec(location.search);
  if (m && form.product) {
    form.product.value = m[1];
    if (location.hash === '#request') setTimeout(function () { form.name.focus({ preventScroll: true }); }, 400);
  }

  var errorBox = form.querySelector('.form-error');
  var labelOf = function (name) {
    var el = form.elements[name];
    var span = el && el.closest('label') && el.closest('label').querySelector('span');
    return span ? span.textContent.replace(/\s*\*$/, '') : name;
  };

  form.addEventListener('input', function (e) { e.target.classList.remove('is-invalid'); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var via = (e.submitter && e.submitter.value) || 'email';

    var missing = ['name', 'phone'].filter(function (n) { return !form.elements[n].value.trim(); });
    missing.forEach(function (n) { form.elements[n].classList.add('is-invalid'); });
    if (missing.length) {
      errorBox.textContent = form.getAttribute('data-required');
      errorBox.hidden = false;
      form.elements[missing[0]].focus();
      return;
    }
    errorBox.hidden = true;

    var lines = [];
    ['name', 'company', 'phone', 'email', 'product', 'volume', 'message'].forEach(function (n) {
      var el = form.elements[n];
      if (!el) return;
      var v = el.tagName === 'SELECT' ? el.options[el.selectedIndex].text : el.value.trim();
      if (v) lines.push(labelOf(n) + ': ' + v);
    });
    var subject = form.getAttribute('data-subject') + ' — ' + form.elements.name.value.trim();
    var text = lines.join('\n');

    if (via === 'whatsapp' && form.getAttribute('data-whatsapp')) {
      window.open('https://wa.me/' + form.getAttribute('data-whatsapp') + '?text=' + encodeURIComponent(subject + '\n\n' + text), '_blank', 'noopener');
      return;
    }

    var endpoint = form.getAttribute('data-endpoint');
    if (!endpoint || !window.fetch) {
      location.href = 'mailto:' + form.getAttribute('data-email') +
        '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text);
      return;
    }

    // Send the request straight to our inbox through the form service
    var payload = { _subject: subject, _template: 'table', _captcha: 'false', _honey: form.elements._honey ? form.elements._honey.value : '' };
    ['name', 'company', 'phone', 'email', 'product', 'volume', 'message'].forEach(function (n) {
      var el = form.elements[n];
      if (!el) return;
      var v = el.tagName === 'SELECT' ? el.options[el.selectedIndex].text : el.value.trim();
      if (v) payload[labelOf(n)] = v;
    });
    if (form.elements.email && form.elements.email.value.trim()) payload._replyto = form.elements.email.value.trim();
    payload['Language / Язык'] = document.documentElement.lang;

    var okBox = form.querySelector('.form-success');
    var btn = e.submitter && e.submitter.value === 'email' ? e.submitter : form.querySelector('button[value="email"]');
    var btnLabel = btn && btn.querySelector('span');
    var oldLabel = btnLabel ? btnLabel.textContent : '';
    if (btn) btn.disabled = true;
    if (btnLabel) btnLabel.textContent = form.getAttribute('data-sending');
    okBox.hidden = true;

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (res) {
        if (!res.ok || String(res.data.success) !== 'true') throw new Error(res.data.message || 'send failed');
        form.reset();
        okBox.textContent = form.getAttribute('data-success');
        okBox.hidden = false;
      })
      .catch(function () {
        errorBox.textContent = form.getAttribute('data-failed');
        errorBox.hidden = false;
      })
      .then(function () {
        if (btn) btn.disabled = false;
        if (btnLabel) btnLabel.textContent = oldLabel;
      });
  });
})();
