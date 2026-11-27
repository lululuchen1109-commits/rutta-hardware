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

  /* Optional Hero headline A/B testing via ?h=a|b|c */
  const headlines = {
    a: 'Turn everyday team talk into shared progress.',
    b: 'Keep every team decision in context.',
    c: 'Make spoken decisions useful to the work that follows.'
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

  /* Sanitize rich-text HTML to safe minimal inline & list markup */
  function sanitizeRichHtml(raw) {
    const tpl = document.createElement('template');
    tpl.innerHTML = raw;
    const allowed = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'BR', 'P', 'DIV', 'UL', 'OL', 'LI']);
    const walk = node => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === 1) {
          if (!allowed.has(child.tagName)) {
            const text = document.createTextNode(child.textContent || '');
            child.replaceWith(text);
          } else {
            [...child.attributes].forEach(attr => child.removeAttribute(attr.name));
            walk(child);
          }
        }
      });
    };
    walk(tpl.content);
    return tpl.innerHTML.trim();
  }

  /* Bind every waitlist form on the page */
  document.querySelectorAll('[data-research-form]').forEach(form => {
    const card = form.closest('.lk-research-card');
    const choices = [...form.querySelectorAll('[data-use-case]')];
    const useCase = form.elements.useCase;
    const otherWrap = form.querySelector('[data-other-wrap]');
    const otherInput = form.elements.otherScenario;
    const email = form.elements.email;
    const consent = form.elements.consent;
    const note = form.querySelector('[data-research-note]');
    const submitBtn = form.querySelector('.lk-research-submit');
    const thanks = card?.querySelector('[data-research-thanks]');
    const thanksStatus = card?.querySelector('[data-thanks-status]');
    const shareBtn = card?.querySelector('[data-share-copy]');
    const endpoint = (form.dataset.endpoint || '').trim();
    let lastSignup = null;

    /* Rich Text Editor setup */
    const rteRoot = form.querySelector('[data-rte]');
    const rteEditor = rteRoot?.querySelector('.lk-rte-editor');
    const rteToolbarButtons = rteRoot ? [...rteRoot.querySelectorAll('[data-cmd]')] : [];

    function syncRte() {
      if (!rteEditor) return;
      const text = (rteEditor.innerText || '').trim();
      if (!text) rteEditor.innerHTML = '';
      if (form.elements.notesText) form.elements.notesText.value = text;
      if (form.elements.notesHtml) form.elements.notesHtml.value = text ? sanitizeRichHtml(rteEditor.innerHTML) : '';
    }

    function updateToolbarState() {
      rteToolbarButtons.forEach(btn => {
        const cmd = btn.dataset.cmd;
        if (cmd === 'removeFormat') return;
        try {
          btn.setAttribute('aria-pressed', String(document.queryCommandState(cmd)));
        } catch {}
      });
    }

    if (rteEditor) {
      rteToolbarButtons.forEach(btn => {
        btn.addEventListener('mousedown', e => e.preventDefault());
        btn.addEventListener('click', () => {
          rteEditor.focus();
          const cmd = btn.dataset.cmd;
          if (cmd === 'removeFormat') {
            document.execCommand('removeFormat', false);
            const plain = rteEditor.innerText;
            rteEditor.textContent = plain;
          } else {
            document.execCommand(cmd, false);
          }
          syncRte();
          updateToolbarState();
        });
      });
      rteEditor.addEventListener('input', () => { syncRte(); updateToolbarState(); });
      rteEditor.addEventListener('keyup', updateToolbarState);
      rteEditor.addEventListener('mouseup', updateToolbarState);
    }

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
      const list = store.get('rutta-waitlist-r1', []);
      list.push(payload);
      store.set('rutta-waitlist-r1', list);
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
      const isOther = useCase.value === 'Others';
      if (otherWrap) {
        otherWrap.hidden = !isOther;
        if (isOther && otherInput) otherInput.focus();
      }
      setNote('Concept validation · No purchase or pre-order required.');
    }));

    form.addEventListener('submit', async event => {
      event.preventDefault();
      syncRte();

      if (!email.value.trim() || !email.checkValidity()) {
        setNote('Enter a valid work email so we know where to reach you.', 'error');
        email.focus();
        return;
      }
      if (!useCase.value) {
        setNote('Choose one scenario where R1 would help most.', 'error');
        choices[0]?.focus();
        return;
      }
      if (useCase.value === 'Others' && otherInput && !otherInput.value.trim()) {
        setNote('Tell us briefly what scenario you have in mind.', 'error');
        otherInput.focus();
        return;
      }
      if (!consent.checked) {
        setNote('Tick the consent box so we can send you R1 updates.', 'error');
        consent.focus();
        return;
      }

      lastSignup = {
        type: 'waitlist',
        model: 'R1',
        email: email.value.trim(),
        useCase: useCase.value === 'Others' && otherInput?.value.trim()
          ? 'Others: ' + otherInput.value.trim()
          : useCase.value,
        name: (form.elements.name?.value || '').trim(),
        teamSize: form.elements.teamSize?.value || '',
        mac: form.elements.mac?.value || '',
        notesText: (form.elements.notesText?.value || '').trim(),
        notesHtml: (form.elements.notesHtml?.value || '').trim(),
        consent: true,
        headline: variant,
        page: location.pathname,
        savedAt: new Date().toISOString(),
        ...attribution()
      };

      submitBtn.disabled = true;
      try {
        const mode = await sendPayload(lastSignup);
        track('waitlist_submit', { variant, useCase: useCase.value, teamSize: lastSignup.teamSize });
        form.hidden = true;
        if (thanks) {
          if (thanksStatus) {
            thanksStatus.textContent = mode === 'remote'
              ? 'We’ll reach out with R1 validation updates and optional 15-min team chats.'
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

    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        const code = lastSignup ? btoa(lastSignup.email).replace(/[^a-z0-9]/gi, '').slice(0, 8) : 'team';
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
  });
})();
