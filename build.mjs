#!/usr/bin/env node
// =====================================================================
//  Сборка сайта UMMAN TRADE.
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
import { icons, illustrations } from './src/icons.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC_ASSETS = path.join(ROOT, 'src', 'assets');
const OUT = path.join(ROOT, 'docs');

// Order of languages in the switcher and footer: Turkmen, Russian, English
const LANGS = [tk, ru, en];
const DEFAULT_LANG = 'tk'; // language a first-time visitor sees
const DIRECTIONS = ['yarn', 'export', 'import', 'food'];

// Pages: key -> output file name
const PAGES = {
  home: 'index.html',
  about: 'about.html',
  yarn: 'yarn.html',
  export: 'export.html',
  import: 'import.html',
  food: 'food.html',
  contacts: 'contacts.html',
};
const NAV = ['about', 'yarn', 'export', 'import', 'food', 'contacts'];

// Card image for each business line: a photo if it exists, otherwise an illustration
const DIRECTION_MEDIA = {
  yarn: { photo: 'yarn-card-white', illu: 'yarn' },
  export: { photo: 'export-card-lint', illu: 'bale' },
  import: { photo: 'import-1', illu: 'chem' },
  food: { photo: 'food-1', illu: 'food' },
};

// ---------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------
const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const year = Math.max(new Date().getFullYear(), 2026);
// cache-busting version derived from the CSS/JS content
const assetVersion = createHash('sha1')
  .update(readFileSync(path.join(SRC_ASSETS, 'css', 'style.css')))
  .update(readFileSync(path.join(SRC_ASSETS, 'js', 'main.js')))
  .digest('hex')
  .slice(0, 8);
const A = (p) => `../assets/${p}?v=${assetVersion}`; // asset path from a language folder

/** Published path of src/assets/img/<name>.(webp|jpg|jpeg|png) if it exists. */
function photo(name) {
  for (const ext of ['webp', 'jpg', 'jpeg', 'png']) {
    const file = path.join(SRC_ASSETS, 'img', `${name}.${ext}`);
    if (existsSync(file)) {
      // ?v=<content hash> makes browsers fetch a replaced photo instead of a cached copy
      const v = createHash('sha1').update(readFileSync(file)).digest('hex').slice(0, 8);
      return `../assets/img/${name}.${ext}?v=${v}`;
    }
  }
  return null;
}
const hasVideo = (name) => existsSync(path.join(SRC_ASSETS, 'video', `${name}.mp4`));

const btn = (href, label, cls = 'btn-primary', icon = 'arrow') =>
  `<a class="btn ${cls}" href="${esc(href)}"><span>${esc(label)}</span>${icons[icon] || ''}</a>`;

// Logo: the company's own mark, src/assets/img/logo-mark.(svg|webp|png)
const logoFile = ['svg', 'webp', 'png'].map((e) => `logo-mark.${e}`).find((f) => existsSync(path.join(SRC_ASSETS, 'img', f)));
if (!logoFile) throw new Error('Логотип не найден: положите файл src/assets/img/logo-mark.png');
const logoMark = `<img class="logo-mark" src="../assets/img/${logoFile}" alt="" width="48" height="48">`;
const [nameFirst, ...nameRest] = site.name.split(' ');
const logoText = `<span class="logo-text"><span class="logo-l1">${esc(nameFirst)}</span>${nameRest.length ? `<span class="logo-l2">${esc(nameRest.join(' '))}</span>` : ''}</span>`;

const requestHref = (product) => `contacts.html${product ? `?product=${product}` : ''}#request`;

/** Muted looping video that starts automatically, with a poster frame. */
function media(name, label, cls = '') {
  const poster = photo(`${name}-poster`);
  if (hasVideo(name)) {
    // ?v=<content hash> so a replaced video is not served from the browser cache
    const v = createHash('sha1').update(readFileSync(path.join(SRC_ASSETS, 'video', `${name}.mp4`))).digest('hex').slice(0, 8);
    return `<figure class="media ${cls}"><video class="media-video" autoplay muted loop playsinline preload="metadata"${poster ? ` poster="${poster}"` : ''} aria-label="${esc(label)}"><source src="../assets/video/${name}.mp4?v=${v}" type="video/mp4"></video></figure>`;
  }
  return poster ? `<figure class="media ${cls}"><img src="${poster}" alt="${esc(label)}" loading="lazy"></figure>` : '';
}

const stats = (list, cls = '') =>
  `<dl class="stat-row ${cls}">${list.map((s) => `<div><dt>${esc(s.value)}</dt><dd>${esc(s.label)}</dd></div>`).join('')}</dl>`;

const table = (rows, cls = 'specs') =>
  `<table class="${cls}"><tbody>${rows.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table>`;

const ticks = (list) => `<ul class="ticks">${list.map((f) => `<li>${icons.tick}${esc(f)}</li>`).join('')}</ul>`;

// ---------------------------------------------------------------------
// layout
// ---------------------------------------------------------------------
function layout(t, pageKey, { title, description, body }) {
  const file = PAGES[pageKey];
  const fullTitle = pageKey === 'home' ? `${site.name} — ${title}` : `${title} — ${site.name}`;
  const url = (code) => (site.baseUrl ? `${site.baseUrl}/${code}/${file === 'index.html' ? '' : file}` : '');

  const alternates = site.baseUrl
    ? LANGS.map((l) => `<link rel="alternate" hreflang="${l.code}" href="${url(l.code)}">`).join('\n  ') +
      `\n  <link rel="alternate" hreflang="x-default" href="${url(DEFAULT_LANG)}">\n  <link rel="canonical" href="${url(t.code)}">`
    : '';

  const navLinks = NAV.map(
    (k) => `<a href="${PAGES[k]}"${pageKey === k ? ' aria-current="page"' : ''}>${esc(t.nav[k])}</a>`,
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
  <meta name="theme-color" content="#1d4579">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(site.name)}">
  <meta property="og:title" content="${esc(fullTitle)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:locale" content="${t.locale}">
  ${site.baseUrl ? `<meta property="og:url" content="${url(t.code)}">` : ''}
  ${site.baseUrl ? `<meta property="og:image" content="${site.baseUrl}/assets/img/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">` : ''}
  ${alternates}
  <link rel="icon" href="../assets/img/favicon.png" type="image/png">
  <link rel="preload" href="../assets/fonts/manrope-${t.code === 'ru' ? 'cyrillic' : t.code === 'tk' ? 'latin-ext' : 'latin'}-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${A('css/style.css')}">
</head>
<body data-page="${pageKey}">
  <a class="skip" href="#main">${esc(t.ui.skip)}</a>

  <header class="header" data-header>
    <div class="container header-inner">
      <a class="logo" href="index.html" aria-label="${esc(site.name)} — ${esc(t.nav.home)}">
        ${logoMark}
        ${logoText}
      </a>

      <nav class="nav" id="site-nav" aria-label="${esc(t.ui.menu)}" data-nav>
        <div class="nav-links">${navLinks}</div>
        <div class="nav-extra">
          <a class="nav-phone" href="tel:${esc(site.phoneLink)}" aria-label="${esc(t.ui.phone)} ${esc(site.phone)}">${icons.phone}<span>${esc(site.phone)}</span></a>
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
        <a class="logo logo-light" href="index.html">${logoMark}${logoText}</a>
        <p class="footer-tagline">${esc(t.tagline)}</p>
        <p>${esc(t.home.directionsText)}</p>
      </div>
      <div>
        <h3>${esc(t.ui.directions)}</h3>
        <ul>${DIRECTIONS.map((d) => `<li><a href="${PAGES[d]}">${esc(t.directions[d].name)}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h3>${esc(t.ui.company)}</h3>
        <ul>${['about', 'contacts'].map((k) => `<li><a href="${PAGES[k]}">${esc(t.nav[k])}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h3>${esc(t.nav.contacts)}</h3>
        <ul class="footer-contacts">
          <li>${icons.phone}<a href="tel:${esc(site.phoneLink)}">${esc(site.phone)}</a></li>
          ${site.whatsapp ? `<li>${icons.whatsapp}<a href="https://wa.me/${esc(site.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a></li>` : ''}
          <li>${icons.mail}<a href="mailto:${esc(site.email)}">${esc(site.email)}</a></li>
          <li>${icons.pin}<span>${esc(t.address)}</span></li>
        </ul>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>© ${year} UMMAN TRADE. ${esc(t.ui.rights)}<br>${esc(t.ui.legal)}</span>
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

function directionCard(t, key) {
  const d = t.directions[key];
  const m = DIRECTION_MEDIA[key];
  const img = photo(m.photo);
  return `<article class="dir-card">
          <a class="dir-card-media${img ? ' has-photo' : ''}" href="${PAGES[key]}" tabindex="-1" aria-hidden="true">${
            img ? `<img src="${img}" alt="" loading="lazy">` : illustrations[m.illu]
          }</a>
          <div class="dir-card-body">
            <h3><a href="${PAGES[key]}">${esc(d.name)}</a></h3>
            <p>${esc(d.short)}</p>
            <a class="link-arrow" href="${PAGES[key]}">${esc(t.ui.learnMore)}${icons.arrow}</a>
          </div>
        </article>`;
}

function ctaBand(t, product) {
  const actions = [
    btn(requestHref(product), t.ui.requestPrice, 'btn-accent'),
    site.whatsapp
      ? `<a class="btn btn-whatsapp" href="https://wa.me/${esc(site.whatsapp)}" target="_blank" rel="noopener">${icons.whatsapp}<span>${esc(t.ui.whatsapp)}</span></a>`
      : '',
    `<a class="btn btn-outline" href="tel:${esc(site.phoneLink)}">${icons.phone}<span>${esc(site.phone)}</span></a>`,
  ].join('');
  return `    <section class="section section-cta">
      <div class="container">
        <div class="cta">
          <div>
            ${t.cta.title ? `<h2>${esc(t.cta.title)}</h2>` : ''}
            <p>${esc(t.cta.text)}</p>
          </div>
          <div class="cta-actions">${actions}</div>
        </div>
      </div>
    </section>`;
}

function gallery(t, prefix, captions) {
  return `<div class="gallery">
        ${captions
          .map((cap, i) => {
            const src = photo(`${prefix}-${i + 1}`);
            return `<figure class="photo${src ? '' : ' photo-empty'}">
          ${src ? `<img src="${src}" alt="${esc(cap)}" loading="lazy">` : `<div class="photo-ph">${icons.box}<span>${esc(t.ui.photoPlaceholder)}</span></div>`}
          <figcaption>${esc(cap)}</figcaption>
        </figure>`;
          })
          .join('\n        ')}
        </div>`;
}

function requestForm(t) {
  const f = t.form;
  const options = [`<option value="">${esc(f.productAny)}</option>`]
    .concat(Object.entries(f.options).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`))
    .join('');
  return `<form class="form" id="request" data-request-form novalidate
          data-endpoint="${esc(site.formEndpoint || '')}" data-email="${esc(site.email)}" data-whatsapp="${esc(site.whatsapp)}"
          data-sending="${esc(f.sending)}" data-success="${esc(f.success)}" data-failed="${esc(f.failed)}" data-not-activated="${esc(f.notActivated)}"
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
          <label class="form-trap" aria-hidden="true">Website<input name="_honey" tabindex="-1" autocomplete="off"></label>
          <p class="form-error" role="alert" hidden></p>
          <p class="form-success" role="status" hidden></p>
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
  ];
  return `<ul class="contact-list">${items
    .map(([ic, label, val]) => `<li><span class="contact-icon">${ic}</span><div><small>${esc(label)}</small>${val}</div></li>`)
    .join('')}</ul>
          <div class="messengers">
            ${site.whatsapp ? `<a class="btn btn-whatsapp" href="https://wa.me/${esc(site.whatsapp)}" target="_blank" rel="noopener">${icons.whatsapp}<span>${esc(t.ui.whatsapp)}</span></a>` : ''}
            ${site.telegram ? `<a class="btn btn-telegram" href="https://t.me/${esc(site.telegram)}" target="_blank" rel="noopener">${icons.telegram}<span>${esc(t.ui.telegram)}</span></a>` : ''}
          </div>`;
}

// ---------------------------------------------------------------------
// pages
// ---------------------------------------------------------------------
function pageHome(t) {
  const h = t.home;
  const body = `    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-copy">
          <p class="eyebrow">${esc(h.heroEyebrow)}</p>
          <h1>${esc(h.heroTitle)}</h1>
          <p class="hero-text">${esc(h.heroText)}</p>
          <div class="hero-actions">
            ${btn(requestHref(), h.heroPrimary, 'btn-accent')}
            ${btn('#directions', h.heroSecondary, 'btn-outline', 'arrow')}
          </div>
        </div>
        <div class="hero-visual">${media('spinning-hall', t.yarn.title, 'media-hero')}</div>
      </div>
      <div class="container">${stats(h.stats, 'stats')}</div>
    </section>

    <section class="section" id="directions">
      <div class="container">
        <header class="section-head">
          <h2>${esc(h.directionsTitle)}</h2>
          <p>${esc(h.directionsText)}</p>
        </header>
        <div class="dir-grid">
        ${DIRECTIONS.map((d) => directionCard(t, d)).join('\n        ')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container split">
        <div class="split-media"><figure class="media media-feature"><img src="${photo('yarn-feature')}" alt="${esc(t.yarn.title)}" loading="lazy"></figure></div>
        <div >
          <p class="eyebrow">${esc(h.yarnEyebrow)}</p>
          <h2>${esc(h.yarnTitle)}</h2>
          <p>${esc(h.yarnText)}</p>
          ${stats(t.yarn.stats)}
          ${btn('yarn.html', h.yarnLink, 'btn-accent')}
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <header class="section-head"><h2>${esc(h.whyTitle)}</h2></header>
        <div class="feature-grid">
          ${h.why
            .map((w) => `<div class="feature"><span class="feature-icon">${icons[w.icon]}</span><h3>${esc(w.title)}</h3><p>${esc(w.text)}</p></div>`)
            .join('\n          ')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container contact-split">
        <div >
          ${t.cta.title ? `<h2>${esc(t.cta.title)}</h2>` : ''}
          <p class="lead">${esc(t.cta.text)}</p>
          ${contactList(t)}
        </div>
        <div >${requestForm(t)}</div>
      </div>
    </section>`;
  return layout(t, 'home', { title: h.title, description: h.description, body });
}

function pageAbout(t) {
  const a = t.about;
  const body = `${pageHero(t, { title: a.title, lead: a.lead })}

    <section class="section">
      <div class="container split split-top">
        <div class="prose">${a.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
        <aside class="fact-card">
          ${logoMark}
          <dl>${t.home.stats.map((s) => `<div><dt>${esc(s.value)}</dt><dd>${esc(s.label)}</dd></div>`).join('')}</dl>
        </aside>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <header class="section-head"><h2>${esc(a.valuesTitle)}</h2></header>
        <div class="values">
          ${a.values.map((v, i) => `<div class="value"><span class="value-n">${String(i + 1).padStart(2, '0')}</span><h3>${esc(v.title)}</h3><p>${esc(v.text)}</p></div>`).join('\n          ')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container narrow">
        <h2>${esc(a.requisitesTitle)}</h2>
        ${table(a.requisites)}
      </div>
    </section>

${ctaBand(t)}`;
  return layout(t, 'about', { title: a.title, description: a.description, body });
}

function pageYarn(t) {
  const y = t.yarn;
  const body = `${pageHero(t, { title: y.title, lead: y.lead, crumbs: [[t.ui.directions, 'index.html#directions']] })}

    <section class="section">
      <div class="container split split-top">
        <div class="split-media">${media('yarn-mill', y.title, 'media-tall')}</div>
        <div >
          <div class="prose">${y.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
          ${stats(y.stats)}
          ${ticks(y.features)}
          <div class="row-actions">${btn(requestHref('yarn'), t.ui.requestPrice, 'btn-accent')}</div>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container detail-grid">
        <div >
          <h2>${esc(t.ui.specs)}</h2>
          ${table(y.specs)}
          <div class="callout">
            <span class="feature-icon">${icons.lab}</span>
            <div><h3>${esc(y.labTitle)}</h3><p>${esc(y.labText)}</p></div>
          </div>
        </div>
        <div >
          <h2>${esc(y.testsTitle)}</h2>
          ${table(y.tests, 'specs specs-compact')}
          <p class="table-note">${esc(y.testsNote)}</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <header class="section-head"><h2>${esc(y.galleryTitle)}</h2></header>
        ${gallery(t, 'yarn', y.gallery)}
      </div>
    </section>

${ctaBand(t, 'yarn')}`;
  return layout(t, 'yarn', { title: y.title, description: y.description, body });
}

function pageExport(t) {
  const x = t.export;
  const body = `${pageHero(t, { title: x.title, lead: x.lead, crumbs: [[t.ui.directions, 'index.html#directions']] })}

    <section class="section">
      <div class="container split split-top">
        <div class="split-media">${media('cotton-bales', x.videoLabel, 'media-tall')}</div>
        <div >
          ${stats(x.stats)}
          <div class="prose">${x.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
          <div class="callout">
            <span class="feature-icon">${icons.lab}</span>
            <div><h3>${esc(x.labTitle)}</h3><p>${esc(x.labText)}</p></div>
          </div>
          <div class="row-actions">${btn(requestHref('lint'), t.ui.requestPrice, 'btn-accent')}</div>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <header class="section-head"><h2>${esc(x.itemsTitle)}</h2></header>
        <div class="item-grid">
          ${x.items
            .map(
              (it) => `<article class="item-card">
            <div class="item-card-media">${illustrations[it.illu]}</div>
            <h3>${esc(it.name)}</h3>
            <p>${esc(it.text)}</p>
            <a class="link-arrow" href="${requestHref(it.key)}">${esc(t.ui.requestPrice)}${icons.arrow}</a>
          </article>`,
            )
            .join('\n          ')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <header class="section-head"><h2>${esc(x.galleryTitle)}</h2></header>
        ${gallery(t, 'export', x.gallery)}
      </div>
    </section>

${ctaBand(t, 'lint')}`;
  return layout(t, 'export', { title: x.title, description: x.description, body });
}

function pageImport(t) {
  const m = t.import;
  const body = `${pageHero(t, { title: m.title, lead: m.lead, crumbs: [[t.ui.directions, 'index.html#directions']] })}

    <section class="section">
      <div class="container">
        <header class="section-head"><h2>${esc(m.itemsTitle)}</h2></header>
        <div class="item-grid item-grid-2">
          ${m.items
            .map(
              (it) => `<article class="item-card">
            <div class="item-card-media${photo(`import-${it.key}`) ? ' has-photo' : ''}">${photo(`import-${it.key}`) ? `<img src="${photo(`import-${it.key}`)}" alt="${esc(it.name)}" loading="lazy">` : illustrations.chem}</div>
            <h3>${esc(it.name)}</h3>
            <p>${esc(it.text)}</p>
            <a class="link-arrow" href="${requestHref(it.key)}">${esc(t.ui.requestPrice)}${icons.arrow}</a>
          </article>`,
            )
            .join('\n          ')}
        </div>
        <div class="callout callout-wide">
          <span class="feature-icon">${icons.check}</span>
          <div><h3>${esc(m.licenseTitle)}</h3><p>${esc(m.licenseText)}</p></div>
        </div>
      </div>
    </section>

${ctaBand(t, 'caustic')}`;
  return layout(t, 'import', { title: m.title, description: m.description, body });
}

function pageFood(t) {
  const f = t.food;
  const body = `${pageHero(t, { title: f.title, lead: f.lead, crumbs: [[t.ui.directions, 'index.html#directions']] })}

    <section class="section">
      <div class="container">
        <header class="section-head"><h2>${esc(f.brandsTitle)}</h2><p>${esc(f.brandsText)}</p></header>
        <div class="brand-grid">
          ${f.brands.map((b) => `<div class="brand-tile"><strong>${esc(b.name)}</strong><span>${esc(b.origin)}</span></div>`).join('\n          ')}
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <header class="section-head"><h2>${esc(f.staplesTitle)}</h2><p>${esc(f.staplesText)}</p></header>
        <div class="staple-grid">
          ${f.staples.map((s) => `<div class="staple"><h3>${esc(s.name)}</h3><p>${icons.globe}<span>${esc(s.origin)}</span></p></div>`).join('\n          ')}
        </div>
        <p class="note">${esc(f.closing)}</p>
      </div>
    </section>

${ctaBand(t, 'food')}`;
  return layout(t, 'food', { title: f.title, description: f.description, body });
}

function pageContacts(t) {
  const c = t.contacts;
  const body = `${pageHero(t, { title: c.title, lead: c.lead })}

    <section class="section">
      <div class="container contact-split">
        <div >${contactList(t)}</div>
        <div >${requestForm(t)}</div>
      </div>
    </section>`;
  return layout(t, 'contacts', { title: c.title, description: c.description, body });
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
  <meta name="description" content="${esc(LANGS.find((l) => l.code === DEFAULT_LANG).home.description)}">
  <link rel="icon" href="assets/img/favicon.png" type="image/png">
  <meta http-equiv="refresh" content="1; url=${DEFAULT_LANG}/index.html">
  <script>
    (function () {
      var codes = ${codes}, pick = '${DEFAULT_LANG}';
      // Turkmen by default; a language the visitor picked earlier is remembered
      try { var saved = localStorage.getItem('lang'); if (codes.indexOf(saved) > -1) pick = saved; } catch (e) {}
      location.replace(pick + '/index.html');
    })();
  </script>
  <style>body{font:16px system-ui,sans-serif;background:#fff;color:#16233a;display:grid;place-items:center;min-height:100vh;margin:0}a{color:#1d4579;margin:0 .5em}</style>
</head>
<body>
  <p>${LANGS.map((l) => `<a href="${l.code}/index.html" lang="${l.code}">${esc(l.langName)}</a>`).join('')}</p>
</body>
</html>
`;
}

function notFound() {
  const blocks = LANGS.map(
    (l) => `<div lang="${l.code}"><h1>${esc(l.notFound.title)}</h1><p>${esc(l.notFound.text)}</p><a class="btn" href="${site.baseUrl || ''}/${l.code}/index.html">${esc(l.notFound.back)}</a></div>`,
  ).join('');
  return `<!doctype html>
<html lang="${DEFAULT_LANG}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>404 — ${esc(site.name)}</title>
  <style>
    body{font:16px system-ui,sans-serif;background:#fff;color:#16233a;margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;box-sizing:border-box}
    main{display:grid;gap:32px;max-width:640px}
    h1{margin:0 0 4px;font-size:1.4rem}p{margin:0 0 12px;color:#5b6678}
    .btn{display:inline-block;padding:10px 18px;border-radius:999px;background:#1d4579;color:#fff;text-decoration:none}
    .code{font-size:5rem;font-weight:800;color:#c99a45;line-height:1}
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
  for (const l of LANGS.filter((x) => x !== ru)) {
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

  const renderers = {
    home: pageHome,
    about: pageAbout,
    yarn: pageYarn,
    export: pageExport,
    import: pageImport,
    food: pageFood,
    contacts: pageContacts,
  };
  let count = 0;
  for (const t of LANGS) {
    for (const [key, render] of Object.entries(renderers)) {
      await write(`${t.code}/${PAGES[key]}`, render(t));
      count++;
    }
  }
  await write('index.html', rootIndex());
  await write('404.html', notFound());
  await write('.nojekyll', '');
  const sm = sitemap();
  if (sm) {
    await write('sitemap.xml', sm);
    await write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${site.baseUrl}/sitemap.xml\n`);
    // custom domain for GitHub Pages: only when baseUrl is not the github.io address
    const host = new URL(site.baseUrl).host;
    if (!host.endsWith('github.io')) await write('CNAME', `${host}\n`);
  }

  console.log(`Готово: ${count} страниц (${LANGS.map((l) => l.code).join(', ')}) → ${path.relative(ROOT, OUT)}/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
