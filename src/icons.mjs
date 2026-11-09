// Inline SVG icons (24×24, stroke = currentColor) and product illustrations.

const wrap = (body) =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

export const icons = {
  factory: wrap('<path d="M3 21V10l5 3V10l5 3V7l8 4v10z"/><path d="M3 21h18"/><path d="M7 17h2M12 17h2M17 17h1"/>'),
  check: wrap('<path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>'),
  scale: wrap('<path d="M12 4v16M6 20h12"/><path d="M4 8h16"/><path d="M6 8l-3 6a3 3 0 0 0 6 0zM18 8l-3 6a3 3 0 0 0 6 0z"/>'),
  truck: wrap('<path d="M2 6h11v10H2zM13 10h4l4 3v3h-8"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>'),
  settings: wrap('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1"/>'),
  handshake: wrap('<path d="M2 11l4-4 4 2 3-2 3 1 6 4"/><path d="M6 7v7l5 5 2-2 2 2 2-2 2-2-4-5"/><path d="M10 9l-3 3 2 2 3-3"/>'),
  warehouse: wrap('<path d="M3 21V9l9-5 9 5v12"/><path d="M7 21v-8h10v8M7 17h10"/>'),
  filter: wrap('<path d="M3 5h18l-7 8v6l-4 2v-8z"/>'),
  spin: wrap('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 4c3 2 3 6 0 8M12 12c-3 2-3 6 0 8"/>'),
  press: wrap('<path d="M4 3h16M12 3v5"/><path d="M7 8h10v3H7z"/><path d="M5 14h14v7H5z"/><path d="M5 17.5h14"/>'),
  lab: wrap('<path d="M9 3h6M10 3v6L5 19a1.5 1.5 0 0 0 1.3 2h11.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7.5 15h9"/>'),
  box: wrap('<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>'),
  phone: wrap('<path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/>'),
  mail: wrap('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
  pin: wrap('<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>'),
  clock: wrap('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  arrow: wrap('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  menu: wrap('<path d="M4 7h16M4 12h16M4 17h16"/>'),
  close: wrap('<path d="M6 6l12 12M18 6L6 18"/>'),
  globe: wrap('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z"/>'),
  tick: wrap('<path d="M5 12l5 5 9-10"/>'),
  whatsapp: `<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>`,
  telegram: `<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.9 4.3l-3.2 15c-.2 1-.9 1.3-1.8.8l-4.8-3.6-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.4 13 1.7 11.5c-1-.3-1-1 .2-1.5L20.6 3c.9-.3 1.6.2 1.3 1.3z"/></svg>`,
};

// ---------------------------------------------------------------------
// Logo mark: globe (navy) with a gold crescent — vector redraw of the
// Umman Trading logo. The navy colour follows --logo-ink so the mark
// stays visible on dark backgrounds.
// To use the original file instead, put logo-mark.svg / .png / .webp
// into src/assets/img/ and rebuild.
// ---------------------------------------------------------------------
export const logoMarkSvg = `<svg class="logo-mark" viewBox="0 0 48 48" aria-hidden="true">
  <defs>
    <linearGradient id="um-gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#e6c983"/><stop offset=".5" stop-color="#c99a45"/><stop offset="1" stop-color="#a7792c"/>
    </linearGradient>
    <clipPath id="um-l"><path d="M0 0H25.5C29 17 25 33 11 48H0z"/></clipPath>
    <clipPath id="um-r"><path d="M25.5 0H48V48H11C25 33 29 17 25.5 0z"/></clipPath>
    <g id="um-net" fill="none" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">
      <circle cx="22" cy="24" r="17.8"/>
      <path d="M4.2 24H39.8"/>
      <path d="M22 6.2L37.4 32.9H6.6zM22 41.8L37.4 15.1H6.6z"/>
    </g>
  </defs>
  <use href="#um-net" style="stroke:var(--logo-ink,#1d4579)" clip-path="url(#um-l)"/>
  <use href="#um-net" stroke="url(#um-gold)" clip-path="url(#um-r)"/>
  <path d="M26 3C37.8 4.6 46 13.6 46 24.4S37.6 44.4 25.4 45.4C35 40.6 40.6 33 40.6 24.2S35.4 7.6 26 3z" fill="url(#um-gold)"/>
  <path d="M12 42.6C24.4 31.5 28.6 18 25.6 5.4" fill="none" style="stroke:var(--logo-ink,#1d4579)" stroke-width="2.6" stroke-linecap="round"/>
</svg>`;

// ---------------------------------------------------------------------
// Product illustrations (decorative, 200×160)
// ---------------------------------------------------------------------
const yarnLines = Array.from({ length: 11 }, (_, i) => {
  const y = 38 + i * 9;
  const half = 26 + i * 3.2;
  return `<path d="M${100 - half} ${y} Q100 ${y + 5} ${100 + half} ${y - 2}" />`;
}).join('');

export const illustrations = {
  yarn: `<svg class="illu" viewBox="0 0 200 160" aria-hidden="true">
    <ellipse cx="100" cy="146" rx="70" ry="8" fill="var(--shadow)"/>
    <path d="M90 22h20l4 120H86z" fill="var(--accent-soft)"/>
    <path d="M74 34h52l20 104H54z" fill="var(--cotton)"/>
    <clipPath id="yarn-clip"><path d="M74 34h52l20 104H54z"/></clipPath>
    <g fill="none" stroke="var(--line-strong)" stroke-width="1.6" opacity=".8" clip-path="url(#yarn-clip)">${yarnLines}</g>
    <path d="M74 34h52l20 104H54z" fill="none" stroke="var(--ink-soft)" stroke-width="2" stroke-linejoin="round"/>
    <ellipse cx="100" cy="34" rx="26" ry="5" fill="#fff" stroke="var(--ink-soft)" stroke-width="2"/>
    <ellipse cx="100" cy="33" rx="7" ry="2" fill="var(--accent)"/>
    <path d="M146 120c14 4 22 14 18 24" fill="none" stroke="var(--line-strong)" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  bale: `<svg class="illu" viewBox="0 0 200 160" aria-hidden="true">
    <ellipse cx="100" cy="146" rx="78" ry="8" fill="var(--shadow)"/>
    <path d="M40 54l60-22 60 22v76l-60 14-60-14z" fill="var(--cotton)"/>
    <path d="M40 54l60 18 60-18" fill="none" stroke="var(--ink-soft)" stroke-width="2" stroke-linejoin="round"/>
    <path d="M100 72v72" stroke="var(--ink-soft)" stroke-width="2"/>
    <path d="M40 54l60-22 60 22v76l-60 14-60-14z" fill="none" stroke="var(--ink-soft)" stroke-width="2" stroke-linejoin="round"/>
    <path d="M40 54l60 18 60-18-60-22z" fill="#fff"/>
    <path d="M40 54l60 18 60-18-60-22z" fill="none" stroke="var(--ink-soft)" stroke-width="2" stroke-linejoin="round"/>
    <g stroke="var(--accent)" stroke-width="4" fill="none" stroke-linecap="round">
      <path d="M58 60v74"/><path d="M80 66v74"/><path d="M120 66v74"/><path d="M142 60v74"/>
    </g>
    <g fill="none" stroke="var(--line-strong)" stroke-width="1.2" opacity=".7">
      <path d="M46 84q10 4 20 0t20 2"/><path d="M46 104q10 4 20 0t20 2"/>
      <path d="M108 86q12-4 24 0t22-2"/><path d="M108 108q12-4 24 0t22-2"/>
    </g>
  </svg>`,

  boll: `<svg class="illu" viewBox="0 0 200 160" aria-hidden="true">
    <ellipse cx="100" cy="146" rx="66" ry="8" fill="var(--shadow)"/>
    <path d="M100 140V108" stroke="var(--leaf)" stroke-width="4" stroke-linecap="round"/>
    <path d="M100 124c-12-2-20 4-24 12M100 118c12-2 20 4 24 10" fill="none" stroke="var(--leaf)" stroke-width="3" stroke-linecap="round"/>
    <path d="M64 104c8 10 24 14 36 6 12 8 28 4 36-6l-8 4-12-6-16 6-16-6-12 6z" fill="var(--leaf-2)"/>
    <g fill="#fff" stroke="var(--ink-soft)" stroke-width="2">
      <circle cx="100" cy="50" r="26"/>
      <circle cx="70" cy="76" r="24"/>
      <circle cx="130" cy="76" r="24"/>
      <circle cx="100" cy="86" r="24"/>
    </g>
    <g fill="#fff">
      <circle cx="100" cy="52" r="23"/><circle cx="72" cy="76" r="21"/><circle cx="128" cy="76" r="21"/><circle cx="100" cy="84" r="21"/>
    </g>
    <g fill="none" stroke="var(--line-strong)" stroke-width="1.4" stroke-linecap="round" opacity=".7">
      <path d="M90 44q6-6 14-2"/><path d="M62 74q4-6 12-4"/><path d="M122 70q6-4 12 0"/><path d="M92 86q8 4 16 0"/>
    </g>
    <g fill="var(--accent)" opacity=".6"><circle cx="40" cy="40" r="3"/><circle cx="162" cy="34" r="2.5"/><circle cx="168" cy="96" r="2"/><circle cx="30" cy="100" r="2"/></g>
  </svg>`,

  chem: `<svg class="illu" viewBox="0 0 200 160" aria-hidden="true">
    <ellipse cx="100" cy="146" rx="80" ry="8" fill="var(--shadow)"/>
    <g stroke="var(--ink-soft)" stroke-width="2" stroke-linejoin="round">
      <path d="M38 52h52v88H38z" fill="var(--brand)"/>
      <ellipse cx="64" cy="52" rx="26" ry="6" fill="#3b67a3"/>
      <ellipse cx="64" cy="140" rx="26" ry="6" fill="var(--brand)"/>
      <path d="M38 80h52M38 112h52" fill="none" stroke="#3b67a3" stroke-width="3"/>
      <path d="M110 70h50v70h-50z" fill="#fff"/>
      <path d="M118 70v-10h22l6 10" fill="#fff"/>
      <rect x="132" y="50" width="12" height="10" rx="2" fill="var(--accent)"/>
    </g>
    <rect x="118" y="92" width="34" height="26" rx="3" fill="var(--accent-soft)"/>
    <path d="M128 100l7 10 7-10" fill="none" stroke="var(--accent-2)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="50" y="88" width="28" height="16" rx="2" fill="#fff" opacity=".9"/>
    <path d="M56 96h16" stroke="var(--brand)" stroke-width="2.4" stroke-linecap="round"/>
  </svg>`,

  food: `<svg class="illu" viewBox="0 0 200 160" aria-hidden="true">
    <ellipse cx="100" cy="146" rx="80" ry="8" fill="var(--shadow)"/>
    <path d="M36 140c-6-30-2-62 10-82l-6-10h56l-6 10c12 20 16 52 10 82z" fill="var(--cotton)" stroke="var(--ink-soft)" stroke-width="2" stroke-linejoin="round"/>
    <path d="M44 58h48" stroke="var(--ink-soft)" stroke-width="2"/>
    <path d="M52 48c6-6 26-6 32 0" fill="none" stroke="var(--accent-2)" stroke-width="2.4" stroke-linecap="round"/>
    <rect x="48" y="86" width="40" height="28" rx="3" fill="#fff" stroke="var(--line-strong)" stroke-width="1.5"/>
    <path d="M58 96h20M58 104h14" stroke="var(--accent-2)" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M120 96h44l-6 44h-32z" fill="#fff" stroke="var(--ink-soft)" stroke-width="2" stroke-linejoin="round"/>
    <path d="M164 104h6a8 8 0 0 1 0 16h-8" fill="none" stroke="var(--ink-soft)" stroke-width="2"/>
    <path d="M124 104h36" stroke="var(--brand)" stroke-width="6"/>
    <path d="M134 86c-4-6 4-8 0-16M146 86c-4-6 4-8 0-16" fill="none" stroke="var(--line-strong)" stroke-width="2" stroke-linecap="round"/>
    <g fill="var(--accent)"><ellipse cx="150" cy="146" rx="5" ry="3.5"/><ellipse cx="162" cy="144" rx="5" ry="3.5"/><ellipse cx="140" cy="148" rx="4.5" ry="3"/></g>
  </svg>`,
};

// Large hero illustration: cotton branch with bolls
export const heroArt = `<svg class="hero-art" viewBox="0 0 520 520" aria-hidden="true">
  <defs>
    <radialGradient id="hg" cx="50%" cy="45%" r="55%">
      <stop offset="0" stop-color="var(--accent)" stop-opacity=".35"/>
      <stop offset="1" stop-color="var(--accent)" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="260" cy="250" r="250" fill="url(#hg)"/>
  <circle cx="260" cy="260" r="190" fill="none" stroke="var(--hero-line)" stroke-width="1.5" stroke-dasharray="3 9"/>
  <circle cx="260" cy="260" r="236" fill="none" stroke="var(--hero-line)" stroke-width="1"/>
  <g fill="none" stroke="var(--hero-stem)" stroke-width="7" stroke-linecap="round">
    <path d="M250 500C252 400 246 330 262 250"/>
    <path d="M256 380C220 360 180 330 150 280"/>
    <path d="M254 330C300 310 340 280 370 230"/>
  </g>
  <g fill="var(--hero-leaf)">
    <path d="M250 440c-40-6-80 6-100 30 36 10 76 0 100-30z"/>
    <path d="M256 420c40-10 82-2 104 20-34 14-76 8-104-20z"/>
  </g>
  ${boll(262, 190, 1.25)}
  ${boll(150, 262, 0.95)}
  ${boll(374, 214, 0.9)}
</svg>`;

function boll(cx, cy, s) {
  const r = (n) => (n * s).toFixed(1);
  return `<g transform="translate(${cx} ${cy})">
    <path d="M${r(-44)} ${r(30)}c${r(14)} ${r(26)} ${r(74)} ${r(26)} ${r(88)} 0l${r(-14)} ${r(10)}-${r(30)}-${r(8)}-${r(30)} ${r(8)}z" fill="var(--hero-leaf)"/>
    <g fill="#fff">
      <circle cx="0" cy="${r(-26)}" r="${r(32)}"/>
      <circle cx="${r(-32)}" cy="${r(4)}" r="${r(30)}"/>
      <circle cx="${r(32)}" cy="${r(4)}" r="${r(30)}"/>
      <circle cx="0" cy="${r(16)}" r="${r(30)}"/>
    </g>
    <g fill="none" stroke="#d9d2c3" stroke-width="2" stroke-linecap="round">
      <path d="M${r(-10)} ${r(-34)}q${r(8)} ${r(-8)} ${r(18)} ${r(-2)}"/>
      <path d="M${r(-40)} ${r(2)}q${r(6)} ${r(-8)} ${r(16)} ${r(-4)}"/>
      <path d="M${r(-10)} ${r(18)}q${r(10)} ${r(6)} ${r(20)} 0"/>
    </g>
  </g>`;
}
