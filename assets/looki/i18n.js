/* Rutta R1 · Multi-Region i18n Engine (v7)
   - Supported locales: en, zh-CN, zh-TW, ja, ko, de, fr, es
   - Detection order: ?lang= query -> localStorage('rutta-lang') -> navigator.languages -> 'en'
   - Loads modular JSON packs from /assets/locales/<locale>.json with in-memory caching. */
(() => {
  const LOCALES = {
    'en':    { short: 'EN',    name: 'English',  dir: 'ltr', intl: 'en-US' },
    'zh-CN': { short: '简中',  name: '简体中文', dir: 'ltr', intl: 'zh-CN' },
    'zh-TW': { short: '繁中',  name: '繁體中文', dir: 'ltr', intl: 'zh-TW' },
    'ja':    { short: '日本語', name: '日本語',  dir: 'ltr', intl: 'ja-JP' },
    'ko':    { short: '한국어', name: '한국어',  dir: 'ltr', intl: 'ko-KR' },
    'de':    { short: 'DE',    name: 'Deutsch',  dir: 'ltr', intl: 'de-DE' },
    'fr':    { short: 'FR',    name: 'Français', dir: 'ltr', intl: 'fr-FR' },
    'es':    { short: 'ES',    name: 'Español',  dir: 'ltr', intl: 'es-ES' }
  };
  const SUPPORTED = Object.keys(LOCALES);
  const STORAGE_KEY = 'rutta-lang';
  const PACK_VER = 'v8r2';

  /* English fallback for dynamic script-driven strings (HTML already carries full EN) */
  const EN_BASE = {
    'hero.h1.a': 'What your team says becomes what your team knows.',
    'hero.h1.b': 'Never lose a spoken decision again.',
    'hero.h1.c': 'The team mic that never needs a record button.',
    'detail.always.body': 'No start button, no battery. Plugged into your Mac, R1 is on whenever your Mac is — so the small conversations that move work forward finally get captured.',
    'detail.voice.body': 'Each teammate enrolls their voice once. R1 knows who said what — that’s how every task gets an owner — and is designed to discard voices it doesn’t recognize.',
    'detail.flow.body': 'Confirmed notes land in your Rutta team knowledge base, then flow to the docs, task tools, chat apps and AI Agents you already use via MCP, API and CLI.',
    'pv.cap.ready': 'Green breathing light · R1 is ready.',
    'pv.cap.input': 'Solid amber light · R1 is capturing enrolled teammates.',
    'pv.cap.mute': 'Light off · an orange marker shows it’s physically muted.',
    'finish.silver': 'R1 · Silver',
    'finish.sky': 'R1 · Sky Blue',
    'finish.starlight': 'R1 · Starlight',
    'finish.midnight': 'R1 · Midnight',
    'fit.unplugged': 'Unplugged',
    'fit.aligning': 'Aligning',
    'fit.connected': 'Connected',
    'fit.retry': 'Try again',
    'sw.mute': 'Slide to mute',
    'sw.unmute': 'Slide to unmute',
    'sw.read.ready': 'The light on top breathes green while R1 is ready.',
    'sw.read.input': 'The light stays amber while R1 is capturing enrolled teammates.',
    'sw.read.mute': 'The light goes out, and an orange marker appears in the switch track.',
    'ex.intro': 'Drag to rotate, or choose a detail.',
    'ex.introStill': 'Choose a detail to see how R1 fits together.',
    'ex.home': 'R1 in silver',
    'ex.ports': 'One pinhole faces the palm rest; a second sits mid-side 15.5 mm away — a 15.7 mm dual-mic baseline.',
    'ex.plug': 'The USB-C plug draws power from your Mac and carries audio back through the same connection.',
    'ex.mute': 'Slide the switch to mute. An orange mark appears in the track so you can see its position.',
    'note.default': 'Concept stage · free, no payment or pre-order.',
    'err.email': 'Please enter a valid work email.',
    'err.usecase': 'Please choose where R1 would help most.',
    'err.other': 'Please describe your scenario briefly.',
    'err.consent': 'Please tick the box so we can email you.',
    'err.generic': 'Something went wrong. Please try again.',
    'th.remote': 'We’ll keep you posted, and may invite you to a 15-minute chat.',
    'th.local': 'Preview mode: saved in this browser until the live backend is connected.',
    'sv.done': 'Thank you — this really helps.',
    'sh.copied': 'Link copied ✓'
  };

  function normalizeLocale(raw) {
    if (!raw || typeof raw !== 'string') return null;
    const tag = raw.trim().replace(/_/g, '-');
    if (LOCALES[tag]) return tag;
    const low = tag.toLowerCase();
    if (low === 'en' || low.startsWith('en-')) return 'en';
    if (low === 'zh-tw' || low === 'zh-hk' || low === 'zh-mo' || low.includes('hant')) return 'zh-TW';
    if (low === 'zh' || low === 'zh-cn' || low === 'zh-sg' || low.includes('hans') || low.startsWith('zh-')) return 'zh-CN';
    if (low === 'ja' || low.startsWith('ja-')) return 'ja';
    if (low === 'ko' || low.startsWith('ko-')) return 'ko';
    if (low === 'de' || low.startsWith('de-')) return 'de';
    if (low === 'fr' || low.startsWith('fr-')) return 'fr';
    if (low === 'es' || low.startsWith('es-')) return 'es';
    return null;
  }

  function detectInitialLocale() {
    try {
      const q = new URLSearchParams(location.search).get('lang');
      const fromQuery = normalizeLocale(q);
      if (fromQuery) return fromQuery;
    } catch {}
    try {
      const saved = normalizeLocale(localStorage.getItem(STORAGE_KEY));
      if (saved) return saved;
    } catch {}
    const candidates = Array.isArray(navigator.languages) && navigator.languages.length
      ? navigator.languages
      : [navigator.language || 'en'];
    for (const cand of candidates) {
      const matched = normalizeLocale(cand);
      if (matched) return matched;
    }
    return 'en';
  }

  const capturedEn = { ...EN_BASE };
  const cache = new Map([['en', capturedEn]]);
  let lang = detectInitialLocale();
  let activeDict = capturedEn;

  function captureDomEnglish() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n;
      if (capturedEn[k] == null) capturedEn[k] = el.innerHTML;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const k = el.dataset.i18nPh;
      if (capturedEn[k] == null) capturedEn[k] = el.getAttribute('placeholder') || '';
    });
    document.querySelectorAll('[data-i18n-dph]').forEach(el => {
      const k = el.dataset.i18nDph;
      if (capturedEn[k] == null) capturedEn[k] = el.dataset.placeholder || '';
    });
    const titleEl = document.querySelector('title[data-i18n-title]');
    if (titleEl && capturedEn[titleEl.dataset.i18nTitle] == null) {
      capturedEn[titleEl.dataset.i18nTitle] = titleEl.textContent;
    }
    document.querySelectorAll('meta[data-i18n-meta]').forEach(meta => {
      const k = meta.dataset.i18nMeta;
      if (capturedEn[k] == null) capturedEn[k] = meta.getAttribute('content') || '';
    });
  }

  async function loadPack(code) {
    if (cache.has(code)) return cache.get(code);
    if (window.RUTTA_LOCALES && window.RUTTA_LOCALES[code]) {
      const merged = { ...capturedEn, ...window.RUTTA_LOCALES[code] };
      cache.set(code, merged);
      return merged;
    }
    try {
      const res = await fetch(`assets/looki/locales/${encodeURIComponent(code)}.json?v=${PACK_VER}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const merged = { ...capturedEn, ...data };
      cache.set(code, merged);
      return merged;
    } catch {
      return capturedEn;
    }
  }

  function t(key, fallback) {
    if (activeDict && activeDict[key] != null) return activeDict[key];
    if (capturedEn[key] != null) return capturedEn[key];
    return fallback != null ? fallback : key;
  }

  function formatUsd(amount, intlTag) {
    try {
      const isEn = intlTag.startsWith('en');
      return new Intl.NumberFormat(intlTag, {
        style: 'currency',
        currency: 'USD',
        currencyDisplay: isEn ? 'narrowSymbol' : 'symbol',
        maximumFractionDigits: 0
      }).format(amount);
    } catch {
      return '$' + Number(amount).toLocaleString('en-US');
    }
  }

  function syncInternalLinks() {
    document.querySelectorAll('a[data-keep-lang], a[href^="/waitlist/r1"], a[href="/"]').forEach(a => {
      const raw = a.dataset.baseHref || a.getAttribute('href');
      if (!a.dataset.baseHref) a.dataset.baseHref = raw;
      if (!raw || raw.startsWith('#') || /^https?:\/\//i.test(raw)) return;
      const [pathAndQuery, hash] = raw.split('#');
      const [pathname, query] = pathAndQuery.split('?');
      const sp = new URLSearchParams(query || '');
      if (lang !== 'en') sp.set('lang', lang);
      else sp.delete('lang');
      const qs = sp.toString();
      a.setAttribute('href', pathname + (qs ? '?' + qs : '') + (hash ? '#' + hash : ''));
    });
  }

  function syncPickers() {
    const meta = LOCALES[lang] || LOCALES.en;
    document.querySelectorAll('[data-locale-current]').forEach(el => { el.textContent = meta.short; });
    document.querySelectorAll('[data-locale-name]').forEach(el => { el.textContent = meta.name; });
    document.querySelectorAll('[data-lang]').forEach(btn => {
      const match = btn.dataset.lang === lang;
      if (btn.getAttribute('role') === 'menuitemradio') btn.setAttribute('aria-checked', String(match));
      else btn.setAttribute('aria-pressed', String(match));
    });
  }

  function applyDom() {
    const meta = LOCALES[lang] || LOCALES.en;
    document.documentElement.lang = lang;
    document.documentElement.dir = meta.dir;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.innerHTML = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      el.setAttribute('placeholder', t(el.dataset.i18nPh));
    });
    document.querySelectorAll('[data-i18n-dph]').forEach(el => {
      el.dataset.placeholder = t(el.dataset.i18nDph);
    });
    document.querySelectorAll('[data-i18n-usd]').forEach(el => {
      const n = Number(el.dataset.i18nUsd);
      if (Number.isFinite(n)) el.textContent = formatUsd(n, meta.intl);
    });
    const titleEl = document.querySelector('title[data-i18n-title]');
    if (titleEl) document.title = t(titleEl.dataset.i18nTitle);
    document.querySelectorAll('meta[data-i18n-meta]').forEach(m => {
      m.setAttribute('content', t(m.dataset.i18nMeta));
    });

    syncPickers();
    syncInternalLinks();
    document.dispatchEvent(new CustomEvent('ruttalang', { detail: { lang, meta } }));
  }

  async function setLang(next, { persist = true, trackSwitch = false } = {}) {
    const normalized = normalizeLocale(next) || 'en';
    lang = normalized;
    activeDict = await loadPack(lang);
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
    }
    applyDom();
    if (trackSwitch) window.ruttaTrack?.('language_switch', { locale: lang });
    return lang;
  }

  /* Dropdown UI wiring for every [data-locale-picker] */
  function wirePickers() {
    const pickers = [...document.querySelectorAll('[data-locale-picker]')];
    function closeAll(except) {
      pickers.forEach(p => {
        if (p === except) return;
        p.classList.remove('is-open');
        const btn = p.querySelector('.r1-locale-btn');
        const menu = p.querySelector('.r1-locale-menu');
        btn?.setAttribute('aria-expanded', 'false');
        if (menu) menu.hidden = true;
      });
    }

    pickers.forEach(picker => {
      const trigger = picker.querySelector('.r1-locale-btn');
      const menu = picker.querySelector('.r1-locale-menu');
      const items = [...picker.querySelectorAll('[data-lang]')];
      if (!trigger || !menu) return;

      trigger.addEventListener('click', e => {
        e.stopPropagation();
        const willOpen = menu.hidden;
        closeAll(willOpen ? picker : null);
        picker.classList.toggle('is-open', willOpen);
        trigger.setAttribute('aria-expanded', String(willOpen));
        menu.hidden = !willOpen;
        if (willOpen) {
          const checked = items.find(i => i.dataset.lang === lang) || items[0];
          checked?.focus();
        }
      });

      items.forEach((item, idx) => {
        item.addEventListener('click', () => {
          closeAll();
          trigger.focus();
          if (item.dataset.lang !== lang) setLang(item.dataset.lang, { persist: true, trackSwitch: true });
        });
        item.addEventListener('keydown', e => {
          if (e.key === 'ArrowDown') { e.preventDefault(); items[(idx + 1) % items.length].focus(); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); items[(idx + items.length - 1) % items.length].focus(); }
          else if (e.key === 'Escape') { e.preventDefault(); closeAll(); trigger.focus(); }
        });
      });
    });

    document.addEventListener('click', () => closeAll());
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
  }

  window.ruttaT = t;
  window.ruttaLang = () => lang;
  window.ruttaLocales = () => [...SUPPORTED];
  window.ruttaSetLang = code => setLang(code, { persist: true, trackSwitch: true });
  window.ruttaSet = (el, key) => {
    if (!el) return;
    el.dataset.i18n = key;
    el.innerHTML = t(key);
  };
  window.ruttaRegionInfo = () => ({
    locale: lang,
    browserLocale: navigator.language || '',
    browserLanguages: Array.isArray(navigator.languages) ? navigator.languages.slice(0, 5) : [],
    timeZone: (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch { return ''; } })()
  });

  captureDomEnglish();
  wirePickers();
  syncPickers();
  syncInternalLinks();

  /* Apply immediately on startup (async fetch if non-English) */
  window.ruttaI18nReady = setLang(lang, { persist: false, trackSwitch: false });
})();
