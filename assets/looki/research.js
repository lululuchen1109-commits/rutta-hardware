(() => {
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); }
      catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
    }
  };

  const params = new URLSearchParams(location.search);

  /* Lightweight analytics hook for GA4 / GTM / Plausible */
  window.dataLayer = window.dataLayer || [];
  const track = (event, props = {}) => {
    window.dataLayer.push({ event, ...props });
    if (typeof window.plausible === 'function') window.plausible(event, { props });
  };
  window.ruttaTrack = track;

  /* First-touch UTM / referral attribution */
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref'];
  if (!store.get('rutta-attribution') && utmKeys.some(k => params.has(k))) {
    const data = { landing: location.pathname, at: new Date().toISOString(), referrer: document.referrer || '' };
    utmKeys.forEach(k => { if (params.has(k)) data[k] = params.get(k); });
    store.set('rutta-attribution', data);
  }
  const attribution = () => store.get('rutta-attribution', { referrer: document.referrer || '' });

  /* Optional Hero headline A/B testing via ?h=a|b|c (defaults cleanly to a) */
  const headlines = {
    a: 'The mic your MacBook Air was missing.',
    b: 'Clear voices from across the table.',
    c: 'A better microphone that lives on the side of your Mac.'
  };
  const requested = params.get('h');
  let variant = headlines[requested] ? requested : 'a';
  if (requested && headlines[requested]) store.set('rutta-headline', requested);
  else if (params.get('ab') === '1') {
    variant = store.get('rutta-headline') || Object.keys(headlines)[Math.floor(Math.random() * 3)];
    store.set('rutta-headline', variant);
  }
  const h1 = document.querySelector('[data-headline]');
  if (h1 && headlines[variant]) h1.textContent = headlines[variant];
  track('headline_view', { variant });

  document.querySelectorAll('[data-track]').forEach(el => {
    el.addEventListener('click', () => track('cta_click', { cta: el.dataset.track, variant }));
  });

  /* Waitlist & optional post-signup survey */
  const form = document.querySelector('[data-research-form]');
  if (!form) return;

  const choices = [...form.querySelectorAll('[data-use-case]')];
  const useCase = form.elements.useCase;
  const mac = form.elements.mac;
  const email = form.elements.email;
  const consent = form.elements.consent;
  const note = form.querySelector('[data-research-note]');
  const submitBtn = form.querySelector('.lk-research-submit');
  const thanks = document.querySelector('[data-research-thanks]');
  const thanksStatus = document.querySelector('[data-thanks-status]');
  const surveyForm = document.querySelector('[data-survey-form]');
  const shareBtn = document.querySelector('[data-share-copy]');
  const endpoint = (form.dataset.endpoint || '').trim();
  let lastSignup = null;

  function setNote(message, tone) {
    if (!note) return;
    note.textContent = message;
    if (tone) note.dataset.tone = tone;
    else delete note.dataset.tone;
  }

  async function sendPayload(payload) {
    if (endpoint) {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Request failed');
      return 'remote';
    }
    const list = store.get('rutta-waitlist-v2', []);
    list.push(payload);
    store.set('rutta-waitlist-v2', list);
    return 'local';
  }

  let started = false;
  form.addEventListener('focusin', () => {
    if (!started) {
      started = true;
      track('waitlist_start', { variant });
    }
  });

  choices.forEach(choice => choice.addEventListener('click', () => {
    choices.forEach(button => button.setAttribute('aria-pressed', String(button === choice)));
    useCase.value = choice.dataset.useCase;
    setNote('No purchase required · Milestones only, no spam.');
  }));

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!useCase.value) {
      setNote('Choose where you’d use Rutta Bar most.', 'error');
      choices[0].focus();
      return;
    }
    if (!mac.value) {
      setNote('Choose which Mac you use.', 'error');
      mac.focus();
      return;
    }
    if (!email.value.trim() || !email.checkValidity()) {
      setNote('Enter a valid email address so we know where to reach you.', 'error');
      email.focus();
      return;
    }
    if (!consent.checked) {
      setNote('Tick the consent box so we can send you Rutta Bar updates.', 'error');
      consent.focus();
      return;
    }

    lastSignup = {
      type: 'waitlist',
      email: email.value.trim(),
      mac: mac.value,
      useCase: useCase.value,
      prototype: Boolean(form.elements.prototype?.checked),
      consent: true,
      headline: variant,
      page: location.pathname,
      savedAt: new Date().toISOString(),
      ...attribution()
    };

    submitBtn.disabled = true;
    try {
      const mode = await sendPayload(lastSignup);
      track('waitlist_submit', { variant, mac: mac.value, useCase: useCase.value });
      form.hidden = true;
      if (thanks) {
        if (thanksStatus) {
          thanksStatus.textContent = mode === 'remote'
            ? 'We’ll reach out when prototype testing and early pricing open.'
            : 'Preview mode: saved in this browser until the live waitlist backend is connected.';
        }
        thanks.hidden = false;
        thanks.focus();
      }
    } catch {
      setNote('Something went wrong. Please try again in a moment.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });

  if (surveyForm) {
    surveyForm.addEventListener('submit', async event => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(surveyForm).entries());
      if (!Object.values(data).some(v => String(v).trim())) return;
      try {
        await sendPayload({
          type: 'survey',
          email: lastSignup?.email || '',
          ...data,
          savedAt: new Date().toISOString()
        });
      } catch {}
      track('survey_submit', { price: data.price || '', currentSetup: data.currentSetup || '' });
      const done = document.createElement('p');
      done.className = 'lk-thanks-sub';
      done.textContent = 'Thank you—that helps shape the first batch.';
      surveyForm.replaceWith(done);
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const code = lastSignup ? btoa(lastSignup.email).replace(/[^a-z0-9]/gi, '').slice(0, 8) : 'friend';
      const url = location.origin + location.pathname + '?ref=' + code;
      try {
        await navigator.clipboard.writeText(url);
        shareBtn.textContent = 'Link copied ✓';
      } catch {
        shareBtn.textContent = url;
      }
      track('share_copy');
    });
  }
})();
