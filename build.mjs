#!/usr/bin/env node
// =====================================================================
//  Сборка сайта Umman Trade.
//  Запуск:  node build.mjs
//  Результат — готовый сайт в папке docs/ (её можно выложить на любой
//  хостинг или опубликовать через GitHub Pages).
// =====================================================================

import { promises as fs, existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import site from './content/site.mjs';
import ru from './content/ru.mjs';
import en from './content/en.mjs';
import tk from './content/tk.mjs';
import { icons, logoMark, illustrations, heroArt } from './src/icons.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC_ASSETS = path.join(ROOT, 'src', 'assets');
const OUT = path.join(ROOT, 'docs');

const LANGS = [ru, en, tk];
const DEFAULT_LANG = 'ru';
const PRODUCTS = ['yarn', 'lint', 'fluff'];

// Pages: key -> output file name
const PAGES = {
  home: 'index.html',
  about: 'about.html',
  products: 'products.html',
  yarn: 'yarn.html',
  lint: 'lint.html',
  fluff: 'fluff.html',
  production: 'production.html',
  contacts: 'contacts.html',
};
const NAV = ['home', 'about', 'products', 'production', 'contacts'];

// ---------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------
const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const year = new Date().getFullYear();
// cache-busting version derived from the CSS/JS content
const assetVersion = createHash('sha1')
  .update(readFileSync(path.join(SRC_ASSETS, 'css', 'style.css')))
  .update(readFileSync(path.join(SRC_ASSETS, 'js', 'main.js')))
  .digest('hex')
  .slice(0, 8);
const A = (p) => `../assets/${p}?v=${assetVersion}`; // asset path from a language folder

/** Returns a published image path if src/assets/img/<name>.(jpg|jpeg|png|webp) exists. */
function photo(name) {
  for (const ext of ['webp', 'jpg', 'jpeg', 'png']) {
    if (existsSync(path.join(SRC_ASSETS, 'img', `${name}.${ext}`))) return `../assets/img/${name}.${ext}`;
  }
  return null;
}

const btn = (href, label, cls = 'btn-primary', icon = 'arrow') =>
  `<a class="btn ${cls}" href="${esc(href)}"><span>${esc(label)}</span>${icons[icon] || ''}</a>`;

const requestHref = (product) => `contacts.html${product ? `?product=${product}` : ''}#request`;

// ---------------------------------------------------------------------
// layout
// ---------------------------------------------------------------------
function layout(t, pageKey, { title, description, body, activeNav }) {
  const file = PAGES[pageKey];
  const fullTitle = pageKey === 'home' ? `${site.name} — ${title}` : `${title} — ${site.name}`;
  const url = (code) => (site.baseUrl ? `${site.baseUrl}/${code}/${file === 'index.html' ? '' : file}` : '');

  const alternates = site.baseUrl
    ? LANGS.map((l) => `<link rel="alternate" hreflang="${l.code}" href="${url(l.code)}">`).join('\n  ') +
      `\n  <link rel="alternate" hreflang="x-default" href="${url(DEFAULT_LANG)}">\n  <link rel="canonical" href="${url(t.code)}">`
    : '';

  const navLinks = NAV.map(
    (k) =>
      `<a href="${PAGES[k]}"${activeNav === k ? ' aria-current="page"' : ''}>${esc(t.nav[k])}</a>`,
  ).join('');

  const langLinks = LANGS.map(
    (l) =>
      `<a href="../${l.code}/${file}" hreflang="${l.code}" lang="${l.code}" data-lang="${l.code}"${
        l.code === t.code ? ' aria-current="true"' : ''
      } title="${esc(l.langName)}">${esc(l.label)}</a>`,
  ).join('');

  return `<!doctype html>
<html lang="${t.code}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="#1f4d3a">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(site.name)}">
  <meta property="og:title" content="${esc(fullTitle)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:locale" content="${t.locale}">
  ${site.baseUrl ? `<meta property="og:url" content="${url(t.code)}">` : ''}
  ${alternates}
  <link rel="icon" href="../assets/img/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="../assets/fonts/manrope-${t.code === 'ru' ? 'cyrillic' : t.code === 'tk' ? 'latin-ext' : 'latin'}-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${A('css/style.css')}">
</head>
<body data-page="${pageKey}">
  <a class="skip" href="#main">${esc(t.ui.skip)}</a>

  <header class="header" data-header>
    <div class="container header-inner">
      <a class="logo" href="index.html" aria-label="${esc(site.name)} — ${esc(t.nav.home)}">
        ${logoMark}
        <span class="logo-text"><strong>${esc(site.name)}</strong><small>${esc(t.tagline)}</small></span>
      </a>

      <nav class="nav" id="site-nav" aria-label="${esc(t.ui.menu)}" data-nav>
        <div class="nav-links">${navLinks}</div>
        <div class="nav-extra">
          <a class="nav-phone" href="tel:${esc(site.phoneLink)}">${icons.phone}<span>${esc(site.phone)}</span></a>
          ${btn(requestHref(), t.ui.requestPrice, 'btn-primary btn-sm')}
        </div>
      </nav>

      <div class="header-tools">
        <div class="lang" aria-label="Language">${icons.globe}${langLinks}</div>
        <button class="burger" type="button" aria-controls="site-nav" aria-expanded="false" data-burger
          data-label-open="${esc(t.ui.menu)}" data-label-close="${esc(t.ui.close)}">
          <span class="sr-only">${esc(t.ui.menu)}</span>${icons.menu}${icons.close}
        </button>
      </div>
    </div>
  </header>

  <main id="main">
${body}
  </main>

${footer(t)}
  <script src="${A('js/main.js')}" defer></script>
</body>
</html>
`;
}

function footer(t) {
  return `  <footer class="footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <a class="logo logo-light" href="index.html">${logoMark}<span class="logo-text"><strong>${esc(site.name)}</strong><small>${esc(t.tagline)}</small></span></a>
        <p>${esc(t.home.heroText)}</p>
      </div>
      <div>
        <h3>${esc(t.nav.products)}</h3>
        <ul>${PRODUCTS.map((p) => `<li><a href="${PAGES[p]}">${esc(t.items[p].name)}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h3>${esc(site.name)}</h3>
        <ul>${['about', 'production', 'contacts'].map((k) => `<li><a href="${PAGES[k]}">${esc(t.nav[k])}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h3>${esc(t.nav.contacts)}</h3>
        <ul class="footer-contacts">
          <li>${icons.phone}<a href="tel:${esc(site.phoneLink)}">${esc(site.phone)}</a></li>
          <li>${icons.mail}<a href="mailto:${esc(site.email)}">${esc(site.email)}</a></li>
          <li>${icons.pin}<span>${esc(t.address)}</span></li>
          <li>${icons.clock}<span>${esc(t.hours)}</span></li>
        </ul>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>© ${site.founded && site.founded < year ? `${site.founded}–` : ''}${year} ${esc(site.name)}. ${esc(t.ui.rights)}</span>
      <span class="footer-langs">${LANGS.map((l) => `<a href="../${l.code}/index.html" data-lang="${l.code}" lang="${l.code}">${esc(l.langName)}</a>`).join('')}</span>
    </div>
  </footer>`;
}

// ---------------------------------------------------------------------
// shared sections
// ---------------------------------------------------------------------
function pageHero(t, { title, lead, crumbs = [] }) {
  const trail = [[t.ui.breadcrumbHome, 'index.html'], ...crumbs];
  return `    <section class="page-hero">
      <div class="container">
        <nav class="crumbs" aria-label="Breadcrumb">${trail
          .map(([label, href]) => `<a href="${href}">${esc(label)}</a>`)
          .join('<span aria-hidden="true">/</span>')}<span aria-hidden="true">/</span><span aria-current="page">${esc(title)}</span></nav>
        <h1>${esc(title)}</h1>
        ${lead ? `<p class="lead">${esc(lead)}</p>` : ''}
      </div>
    </section>`;
}

function productCard(t, key) {
  const p = t.items[key];
  return `<article class="product-card reveal">
          <a class="product-card-media" href="${PAGES[key]}" tabindex="-1" aria-hidden="true">${illustrations[key]}</a>
          <div class="product-card-body">
            <h3><a href="${PAGES[key]}">${esc(p.name)}</a></h3>
            <p>${esc(p.short)}</p>
            <a class="link-arrow" href="${PAGES[key]}">${esc(t.ui.learnMore)}${icons.arrow}</a>
          </div>
        </article>`;
}

function ctaBand(t, product) {
  const contactsBtns = [
    btn(requestHref(product), t.ui.sendRequest, 'btn-accent'),
    site.whatsapp
      ? `<a class="btn btn-ghost-light" href="https://wa.me/${esc(site.whatsapp)}" target="_blank" rel="noopener">${icons.whatsapp}<span>${esc(t.ui.whatsapp)}</span></a>`
      : '',
    `<a class="btn btn-ghost-light" href="tel:${esc(site.phoneLink)}">${icons.phone}<span>${esc(site.phone)}</span></a>`,
  ].join('');
  return `    <section class="section">
      <div class="container">
        <div class="cta reveal">
          <div>
            <h2>${esc(t.cta.title)}</h2>
            <p>${esc(t.cta.text)}</p>
          </div>
          <div class="cta-actions">${contactsBtns}</div>
        </div>
      </div>
    </section>`;
}

function requestForm(t) {
  const f = t.form;
  const options = [`<option value="">${esc(f.productAny)}</option>`]
    .concat(PRODUCTS.map((p) => `<option value="${p}">${esc(t.items[p].name)}</option>`))
    .join('');
  return `<form class="form" id="request" data-request-form novalidate
          data-email="${esc(site.email)}" data-whatsapp="${esc(site.whatsapp)}"
          data-subject="${esc(f.subject)}" data-required="${esc(f.required)}">
          <h2>${esc(f.title)}</h2>
          <p class="muted">${esc(f.text)}</p>
          <div class="form-grid">
            <label><span>${esc(f.name)} *</span><input name="name" autocomplete="name" required></label>
            <label><span>${esc(f.company)}</span><input name="company" autocomplete="organization"></label>
            <label><span>${esc(f.phone)} *</span><input name="phone" type="tel" autocomplete="tel" required></label>
            <label><span>${esc(f.email)}</span><input name="email" type="email" autocomplete="email"></label>
            <label><span>${esc(f.product)}</span><select name="product">${options}</select></label>
            <label><span>${esc(f.volume)}</span><input name="volume"></label>
            <label class="full"><span>${esc(f.message)}</span><textarea name="message" rows="4" placeholder="${esc(f.messagePh)}"></textarea></label>
          </div>
          <p class="form-error" role="alert" hidden></p>
          <div class="form-actions">
            <button class="btn btn-primary" type="submit" value="email"><span>${esc(f.submit)}</span>${icons.mail}</button>
            ${
              site.whatsapp
                ? `<span class="muted">${esc(f.or)}</span><button class="btn btn-whatsapp" type="submit" value="whatsapp">${icons.whatsapp}<span>${esc(f.viaWhatsapp)}</span></button>`
                : ''
            }
          </div>
          <p class="form-note">${esc(f.note)}</p>
        </form>`;
}

function contactList(t) {
  const items = [
    [icons.phone, t.ui.phone, `<a href="tel:${esc(site.phoneLink)}">${esc(site.phone)}</a>`],
    [icons.mail, t.ui.email, `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a>`],
    [icons.pin, t.ui.address, `<span>${esc(t.address)}</span>${site.mapUrl ? `<a class="link-arrow" href="${esc(site.mapUrl)}" target="_blank" rel="noopener">${esc(t.ui.openMap)}${icons.arrow}</a>` : ''}`],
    [icons.clock, t.ui.hours, `<span>${esc(t.hours)}</span>`],
  ];
  return `<ul class="contact-list">${items
    .map(([ic, label, val]) => `<li><span class="contact-icon">${ic}</span><div><small>${esc(label)}</small>${val}</div></li>`)
    .join('')}</ul>
          <div class="messengers">
            ${site.whatsapp ? `<a class="btn btn-whatsapp" href="https://wa.me/${esc(site.whatsapp)}" target="_blank" rel="noopener">${icons.whatsapp}<span>${esc(t.ui.whatsapp)}</span></a>` : ''}
            ${site.telegram ? `<a class="btn btn-telegram" href="https://t.me/${esc(site.telegram)}" target="_blank" rel="noopener">${icons.telegram}<span>${esc(t.ui.telegram)}</span></a>` : ''}
          </div>`;
}

function photoTile(t, name, caption, i) {
  const src = photo(name);
  return `<figure class="photo reveal${src ? '' : ' photo-empty'}">
          ${src ? `<img src="${src}" alt="${esc(caption)}" loading="lazy">` : `<div class="photo-ph" data-n="${i + 1}">${illustrations[PRODUCTS[i % 3]]}<span>${esc(t.ui.photoPlaceholder)}</span></div>`}
          <figcaption>${esc(caption)}</figcaption>
        </figure>`;
}

// ---------------------------------------------------------------------
// pages
// ---------------------------------------------------------------------
function pageHome(t) {
  const h = t.home;
  const prodPhoto = photo('production');
  const body = `    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-copy">
          <p class="eyebrow">${esc(h.heroEyebrow)}</p>
          <h1>${esc(h.heroTitle)}</h1>
          <p class="hero-text">${esc(h.heroText)}</p>
          <div class="hero-actions">
            ${btn(requestHref(), h.heroPrimary, 'btn-accent')}
            ${btn('products.html', h.heroSecondary, 'btn-ghost-light', 'arrow')}
          </div>
        </div>
        <div class="hero-visual">${heroArt}</div>
      </div>
      <div class="container">
        <dl class="stats">${h.stats
          .map((s) => `<div class="stat"><dt>${esc(s.value)}</dt><dd>${esc(s.label)}</dd></div>`)
          .join('')}</dl>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <header class="section-head reveal">
          <h2>${esc(h.productsTitle)}</h2>
          <p>${esc(h.productsText)}</p>
        </header>
        <div class="product-grid">
        ${PRODUCTS.map((p) => productCard(t, p)).join('\n        ')}
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <header class="section-head reveal"><h2>${esc(h.whyTitle)}</h2></header>
        <div class="feature-grid">
          ${h.why
            .map(
              (w) => `<div class="feature reveal"><span class="feature-icon">${icons[w.icon]}</span><h3>${esc(w.title)}</h3><p>${esc(w.text)}</p></div>`,
            )
            .join('\n          ')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <header class="section-head reveal">
          <h2>${esc(h.processTitle)}</h2>
          <p>${esc(h.processText)}</p>
        </header>
        <ol class="process">
          ${h.process
            .map((s, i) => `<li class="reveal"><span class="process-n">${String(i + 1).padStart(2, '0')}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`)
            .join('\n          ')}
        </ol>
      </div>
    </section>

    <section class="section section-dark">
      <div class="container split">
        <div class="reveal">
          <h2>${esc(h.productionTitle)}</h2>
          <p>${esc(h.productionText)}</p>
          ${btn('production.html', h.productionLink, 'btn-accent')}
        </div>
        <div class="split-media reveal">
          ${prodPhoto ? `<img src="${prodPhoto}" alt="${esc(h.productionTitle)}" loading="lazy">` : `<div class="mosaic">${PRODUCTS.map((p) => `<div>${illustrations[p]}</div>`).join('')}<div class="mosaic-icon">${icons.factory}</div></div>`}
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container contact-split">
        <div class="reveal">
          <h2>${esc(t.cta.title)}</h2>
          <p class="lead">${esc(t.cta.text)}</p>
          ${contactList(t)}
        </div>
        <div class="reveal">${requestForm(t)}</div>
      </div>
    </section>`;
  return layout(t, 'home', { title: h.title, description: h.description, body, activeNav: 'home' });
}

function pageAbout(t) {
  const a = t.about;
  const body = `${pageHero(t, { title: a.title, lead: a.lead })}

    <section class="section">
      <div class="container split split-top">
        <div class="prose reveal">${a.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
        <aside class="fact-card reveal">
          ${logoMark}
          <dl>${t.home.stats.map((s) => `<div><dt>${esc(s.value)}</dt><dd>${esc(s.label)}</dd></div>`).join('')}
          ${site.founded ? `<div><dt>${esc(site.founded)}</dt><dd>${esc(t.ui.since)}</dd></div>` : ''}</dl>
        </aside>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <header class="section-head reveal"><h2>${esc(a.valuesTitle)}</h2></header>
        <div class="values">
          ${a.values.map((v, i) => `<div class="value reveal"><span class="value-n">${String(i + 1).padStart(2, '0')}</span><h3>${esc(v.title)}</h3><p>${esc(v.text)}</p></div>`).join('\n          ')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <blockquote class="mission reveal"><small>${esc(a.missionTitle)}</small><p>${esc(a.mission)}</p></blockquote>
      </div>
    </section>

${ctaBand(t)}`;
  return layout(t, 'about', { title: a.title, description: a.description, body, activeNav: 'about' });
}

function pageProducts(t) {
  const p = t.products;
  const body = `${pageHero(t, { title: p.title, lead: p.lead })}

    <section class="section">
      <div class="container product-rows">
        ${PRODUCTS.map((k, i) => {
          const it = t.items[k];
          return `<article class="product-row reveal${i % 2 ? ' reverse' : ''}">
          <a class="product-row-media" href="${PAGES[k]}" tabindex="-1" aria-hidden="true">${illustrations[k]}</a>
          <div>
            <h2><a href="${PAGES[k]}">${esc(it.name)}</a></h2>
            <p>${esc(it.intro)}</p>
            <ul class="ticks">${it.features.map((f) => `<li>${icons.tick}${esc(f)}</li>`).join('')}</ul>
            <div class="row-actions">
              ${btn(PAGES[k], t.ui.learnMore, 'btn-primary')}
              ${btn(requestHref(k), t.ui.requestPrice, 'btn-outline', 'mail')}
            </div>
          </div>
        </article>`;
        }).join('\n        ')}
        <p class="note reveal">${esc(p.note)}</p>
      </div>
    </section>

${ctaBand(t)}`;
  return layout(t, 'products', { title: p.title, description: p.description, body, activeNav: 'products' });
}

function pageProduct(t, key) {
  const it = t.items[key];
  const others = PRODUCTS.filter((k) => k !== key);
  const body = `${pageHero(t, { title: it.name, lead: it.short, crumbs: [[t.nav.products, 'products.html']] })}

    <section class="section">
      <div class="container split split-top">
        <div class="product-visual reveal">${illustrations[key]}</div>
        <div class="reveal">
          <p class="lead">${esc(it.intro)}</p>
          <h2 class="h3">${esc(t.ui.advantages)}</h2>
          <ul class="ticks">${it.features.map((f) => `<li>${icons.tick}${esc(f)}</li>`).join('')}</ul>
          <div class="row-actions">${btn(requestHref(key), t.ui.requestPrice, 'btn-accent')}</div>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container detail-grid">
        <div class="reveal">
          <h2>${esc(t.ui.specs)}</h2>
          <table class="specs"><tbody>${it.specs.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table>
        </div>
        <div class="reveal">
          <h2>${esc(t.ui.applications)}</h2>
          <ul class="chips">${it.uses.map((u) => `<li>${esc(u)}</li>`).join('')}</ul>
          <h2>${esc(t.ui.packaging)}</h2>
          <p>${esc(it.packaging)}</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <header class="section-head reveal"><h2>${esc(t.ui.otherProducts)}</h2></header>
        <div class="product-grid product-grid-2">
        ${others.map((k) => productCard(t, k)).join('\n        ')}
        </div>
      </div>
    </section>

${ctaBand(t, key)}`;
  return layout(t, key, { title: it.name, description: it.description, body, activeNav: 'products' });
}

function pageProduction(t) {
  const p = t.production;
  const body = `${pageHero(t, { title: p.title, lead: p.lead })}

    <section class="section">
      <div class="container split split-top">
        <div class="prose reveal">${p.paragraphs.map((x) => `<p>${esc(x)}</p>`).join('')}</div>
        <div class="quality reveal">
          <h2 class="h3">${esc(p.qualityTitle)}</h2>
          <ul class="ticks">${p.quality.map((q) => `<li>${icons.tick}${esc(q)}</li>`).join('')}</ul>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <header class="section-head reveal"><h2>${esc(p.capabilitiesTitle)}</h2></header>
        <div class="feature-grid">
          ${p.capabilities.map((c) => `<div class="feature reveal"><span class="feature-icon">${icons[c.icon]}</span><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></div>`).join('\n          ')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <header class="section-head reveal"><h2>${esc(p.galleryTitle)}</h2><p>${esc(p.galleryText)}</p></header>
        <div class="gallery">
        ${p.gallery.map((cap, i) => photoTile(t, `gallery-${i + 1}`, cap, i)).join('\n        ')}
        </div>
      </div>
    </section>

${ctaBand(t)}`;
  return layout(t, 'production', { title: p.title, description: p.description, body, activeNav: 'production' });
}

function pageContacts(t) {
  const c = t.contacts;
  const body = `${pageHero(t, { title: c.title, lead: c.lead })}

    <section class="section">
      <div class="container contact-split">
        <div class="reveal">${contactList(t)}</div>
        <div class="reveal">${requestForm(t)}</div>
      </div>
    </section>`;
  return layout(t, 'contacts', { title: c.title, description: c.description, body, activeNav: 'contacts' });
}

// ---------------------------------------------------------------------
// root files
// ---------------------------------------------------------------------
function rootIndex() {
  const codes = JSON.stringify(LANGS.map((l) => l.code));
  return `<!doctype html>
<html lang="${DEFAULT_LANG}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(site.name)}</title>
  <meta name="description" content="${esc(ru.home.description)}">
  <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
  <meta http-equiv="refresh" content="1; url=${DEFAULT_LANG}/index.html">
  <script>
    (function () {
      var codes = ${codes}, pick = '${DEFAULT_LANG}';
      try { var saved = localStorage.getItem('lang'); if (codes.indexOf(saved) > -1) pick = saved; else throw 0; }
      catch (e) {
        var nav = (navigator.languages || [navigator.language || '']).map(function (l) { return String(l).slice(0, 2).toLowerCase(); });
        for (var i = 0; i < nav.length; i++) { if (codes.indexOf(nav[i]) > -1) { pick = nav[i]; break; } }
      }
      location.replace(pick + '/index.html');
    })();
  </script>
  <style>body{font:16px system-ui,sans-serif;background:#faf8f3;color:#1d2a26;display:grid;place-items:center;min-height:100vh;margin:0}a{color:#1f4d3a;margin:0 .5em}</style>
</head>
<body>
  <p>${LANGS.map((l) => `<a href="${l.code}/index.html" lang="${l.code}">${esc(l.langName)}</a>`).join('')}</p>
</body>
</html>
`;
}

function notFound() {
  const blocks = LANGS.map(
    (l) => `<div lang="${l.code}"><h1>${esc(l.notFound.title)}</h1><p>${esc(l.notFound.text)}</p><a class="btn btn-primary" href="${site.baseUrl || ''}/${l.code}/index.html">${esc(l.notFound.back)}</a></div>`,
  ).join('');
  return `<!doctype html>
<html lang="${DEFAULT_LANG}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>404 — ${esc(site.name)}</title>
  <style>
    body{font:16px system-ui,sans-serif;background:#faf8f3;color:#1d2a26;margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;box-sizing:border-box}
    main{display:grid;gap:32px;max-width:640px}
    h1{margin:0 0 4px;font-size:1.4rem}p{margin:0 0 12px;color:#5a6762}
    .btn{display:inline-block;padding:10px 18px;border-radius:999px;background:#1f4d3a;color:#fff;text-decoration:none}
    .code{font-size:5rem;font-weight:800;color:#c8963e;line-height:1}
  </style>
</head>
<body><main><div class="code">404</div>${blocks}</main></body>
</html>
`;
}

function sitemap() {
  if (!site.baseUrl) return null;
  const urls = LANGS.flatMap((l) =>
    Object.values(PAGES).map((f) => `  <url><loc>${site.baseUrl}/${l.code}/${f === 'index.html' ? '' : f}</loc></url>`),
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

// ---------------------------------------------------------------------
// checks: every language must have the same structure as Russian
// ---------------------------------------------------------------------
function shape(obj, prefix = '') {
  if (Array.isArray(obj)) return [`${prefix}[${obj.length}]`, ...obj.flatMap((v, i) => shape(v, `${prefix}[${i}]`))];
  if (obj && typeof obj === 'object') return Object.keys(obj).flatMap((k) => shape(obj[k], prefix ? `${prefix}.${k}` : k));
  return [prefix];
}
function checkLocales() {
  const ref = new Set(shape(ru));
  let ok = true;
  for (const l of LANGS.slice(1)) {
    const cur = new Set(shape(l));
    const missing = [...ref].filter((k) => !cur.has(k));
    const extra = [...cur].filter((k) => !ref.has(k));
    if (missing.length || extra.length) {
      ok = false;
      console.error(`\n[${l.code}] структура текстов отличается от русской версии:`);
      missing.forEach((k) => console.error(`  нет поля:   ${k}`));
      extra.forEach((k) => console.error(`  лишнее поле: ${k}`));
    }
  }
  if (!ok) process.exit(1);
}

// ---------------------------------------------------------------------
// build
// ---------------------------------------------------------------------
async function write(rel, content) {
  const file = path.join(OUT, rel);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content);
}

async function main() {
  checkLocales();
  await fs.rm(OUT, { recursive: true, force: true });
  await fs.cp(SRC_ASSETS, path.join(OUT, 'assets'), { recursive: true });

  let count = 0;
  for (const t of LANGS) {
    await write(`${t.code}/${PAGES.home}`, pageHome(t));
    await write(`${t.code}/${PAGES.about}`, pageAbout(t));
    await write(`${t.code}/${PAGES.products}`, pageProducts(t));
    for (const k of PRODUCTS) await write(`${t.code}/${PAGES[k]}`, pageProduct(t, k));
    await write(`${t.code}/${PAGES.production}`, pageProduction(t));
    await write(`${t.code}/${PAGES.contacts}`, pageContacts(t));
    count += Object.keys(PAGES).length;
  }
  await write('index.html', rootIndex());
  await write('404.html', notFound());
  await write('.nojekyll', '');
  const sm = sitemap();
  if (sm) {
    await write('sitemap.xml', sm);
    await write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${site.baseUrl}/sitemap.xml\n`);
  }

  console.log(`Готово: ${count} страниц (${LANGS.map((l) => l.code).join(', ')}) → ${path.relative(ROOT, OUT)}/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
