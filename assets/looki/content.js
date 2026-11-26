(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k, fallback) { try { const v = localStorage.getItem(k); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  const params = new URLSearchParams(location.search);

  /* ---------- tracking: pushes to dataLayer so GA4 / GTM / Plausible can pick it up ---------- */
  window.dataLayer = window.dataLayer || [];
  const track = (event, props = {}) => {
    window.dataLayer.push({event, ...props});
    if (typeof window.plausible === 'function') window.plausible(event, {props});
    if (params.has('debug')) console.info('[track]', event, props);
  };
  window.ruttaTrack = track;

  /* first-touch attribution */
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref'];
  if (!store.get('rutta-attribution') && utmKeys.some(k => params.has(k))) {
    const a = {landing: location.pathname, at: new Date().toISOString(), referrer: document.referrer || ''};
    utmKeys.forEach(k => { if (params.has(k)) a[k] = params.get(k); });
    store.set('rutta-attribution', a);
  }
  const attribution = () => store.get('rutta-attribution', {referrer: document.referrer || ''});

  /* headline A/B test: ?h=a|b|c forces a variant, otherwise a sticky random one */
  const headlines = {
    a: 'The mic your MacBook Air was missing.',
    b: 'Clear voices from across the table.',
    c: 'A better microphone that lives on the side of your Mac.'
  };
  let variant = params.get('h');
  if (!headlines[variant]) variant = store.get('rutta-headline');
  if (!headlines[variant]) { const keys = Object.keys(headlines); variant = keys[Math.floor(Math.random() * keys.length)]; }
  store.set('rutta-headline', variant);
  const h1 = $('[data-headline]');
  if (h1) h1.textContent = headlines[variant];
  track('headline_view', {variant});

  $$('[data-track]').forEach(el => el.addEventListener('click', () => track('cta_click', {cta: el.dataset.track, variant})));

  /* ---------- hear the difference ---------- */
  const hear = $('.lk-hear');
  if (hear) {
    const tabs = $$('[role=tab]', hear);
    const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
    let current = null;
    const stopAll = () => {
      if (!current) return;
      current.audio.pause();
      current.btn.setAttribute('aria-pressed', 'false');
      current = null;
    };
    const select = (i, focus) => {
      stopAll();
      tabs.forEach((t, k) => { const on = k === i; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; panels[k].hidden = !on; });
      if (focus) tabs[i].focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', e => {
        const step = {ArrowRight: 1, ArrowLeft: -1}[e.key];
        if (step) { e.preventDefault(); select((i + step + tabs.length) % tabs.length, true); }
      });
    });

    // decorative waveform bars (deterministic, so both players in a pair look related)
    $$('.lk-player', hear).forEach((player, n) => {
      const wave = $('.lk-wave', player);
      const quiet = wave.classList.contains('lk-wave--muted');
      let seed = 7 + Math.floor(n / 2) * 13;
      const rand = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
      for (let i = 0; i < 48; i++) {
        const bar = document.createElement('i');
        const base = 0.25 + rand() * 0.75;
        bar.style.setProperty('--h', Math.round((quiet ? base * 0.45 + (i % 7 === 0 ? 0.35 : 0.08) : base) * 100) + '%');
        wave.append(bar);
      }
    });

    // audio becomes playable once the content team drops real files in assets/audio/
    // and sets data-ready="true" on .lk-hear-stage
    const ready = $('.lk-hear-stage', hear).dataset.ready === 'true';
    if (ready) {
      $$('.lk-player', hear).forEach(player => {
        const btn = $('.lk-play', player);
        const bars = $$('.lk-wave i', player);
        const time = $('time', player);
        const audio = new Audio();
        audio.preload = 'metadata';
        audio.src = player.dataset.src;
        audio.addEventListener('loadedmetadata', () => {
          btn.disabled = false;
          const s = Math.round(audio.duration);
          time.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
        });
        audio.addEventListener('timeupdate', () => {
          const p = audio.currentTime / (audio.duration || 1);
          bars.forEach((b, i) => b.classList.toggle('on', i / bars.length < p));
        });
        audio.addEventListener('ended', () => { btn.setAttribute('aria-pressed', 'false'); current = null; bars.forEach(b => b.classList.remove('on')); });
        btn.addEventListener('click', () => {
          if (current && current.audio === audio) { stopAll(); return; }
          stopAll();
          audio.play().then(() => {
            btn.setAttribute('aria-pressed', 'true');
            current = {audio, btn};
            track('audio_play', {clip: player.dataset.src.split('/').pop()});
          }).catch(() => {});
        });
      });
    }
  }

  /* ---------- waitlist ---------- */
  const form = $('.lk-wl-form');
  if (form) {
    const card = form.closest('.lk-waitlist-card');
    const thanks = $('.lk-wl-thanks', card);
    const error = $('.lk-wl-error', form);
    const submitBtn = $('.lk-wl-submit', form);
    const endpoint = form.dataset.endpoint || '';
    let signup = null;

    const send = async payload => {
      if (endpoint) {
        const res = await fetch(endpoint, {method: 'POST', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}, body: JSON.stringify(payload)});
        if (!res.ok) throw new Error('Request failed');
      } else {
        const list = store.get('rutta-waitlist', []);
        list.push(payload);
        store.set('rutta-waitlist', list);
      }
    };
    const showError = (msg, field) => {
      error.textContent = msg; error.hidden = false;
      if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
    };
    $$('input,select', form).forEach(f => f.addEventListener('input', () => { f.removeAttribute('aria-invalid'); error.hidden = true; }));

    let started = false;
    form.addEventListener('focusin', () => { if (!started) { started = true; track('waitlist_start', {variant}); } });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const email = form.elements.email, mac = form.elements.mac, use = form.elements.use, consent = form.elements.consent;
      if (!email.value.trim() || !email.checkValidity()) return showError('Please enter a valid email address.', email);
      if (!mac.value) return showError('Please choose which Mac you use.', mac);
      if (!use.value) return showError('Please choose what you’d use it for.', use);
      if (!consent.checked) return showError('Please tick the box so we can email you.', consent);
      signup = {
        type: 'waitlist', email: email.value.trim(), mac: mac.value, use: use.value, consent: true,
        headline: variant, page: location.pathname, submitted_at: new Date().toISOString(), ...attribution()
      };
      submitBtn.disabled = true; submitBtn.textContent = 'Joining…';
      try {
        await send(signup);
        track('waitlist_submit', {variant, mac: mac.value, use: use.value});
        form.hidden = true; thanks.hidden = false; thanks.focus();
      } catch {
        showError('Something went wrong. Please try again in a moment.');
      } finally {
        submitBtn.disabled = false; submitBtn.textContent = 'Join the waitlist';
      }
    });

    const survey = $('.lk-survey', card);
    survey.addEventListener('submit', async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(survey).entries());
      if (!Object.values(data).some(v => String(v).trim())) return;
      try { await send({type: 'survey', email: signup?.email || '', ...data, submitted_at: new Date().toISOString()}); } catch {}
      track('survey_submit', {price: data.price || '', current: data.current || ''});
      const done = document.createElement('p');
      done.className = 'lk-wl-sub';
      done.textContent = 'Thank you. That really helps.';
      survey.replaceWith(done);
    });

    const share = $('.lk-share-btn', card);
    share.addEventListener('click', async () => {
      const code = signup ? btoa(signup.email).replace(/[^a-z0-9]/gi, '').slice(0, 8) : 'friend';
      const url = location.origin + location.pathname + '?ref=' + code;
      try { await navigator.clipboard.writeText(url); share.textContent = 'Link copied'; }
      catch { share.textContent = url; }
      track('share_copy');
    });
  }
})();
