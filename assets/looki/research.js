(() => {
  const SET = (el, key) => { if (!el) return; if (window.ruttaSet) window.ruttaSet(el, key); else el.textContent = key; };

  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); }
      catch { return fallback; }
    },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
  };
  const params = new URLSearchParams(location.search);

  /* Analytics hook for GA4 / GTM / Plausible */
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

  /* Hero headline A/B test: ?h=a|b|c, or ?ab=1 for sticky random */
  const variants = ['a', 'b', 'c'];
  const requested = params.get('h');
  let variant = variants.includes(requested) ? requested : 'a';
  if (variants.includes(requested)) store.set('rutta-headline', requested);
  else if (params.get('ab') === '1') {
    variant = store.get('rutta-headline') || variants[Math.floor(Math.random() * variants.length)];
    store.set('rutta-headline', variant);
  }
  const h1 = document.querySelector('[data-headline]');
  if (h1) SET(h1, 'hero.h1.' + variant);
  track('headline_view', { variant });

  document.querySelectorAll('[data-track]').forEach(el => {
    el.addEventListener('click', () => track('cta_click', { cta: el.dataset.track, variant }));
  });

  /* Keep rich-text notes to simple, safe markup */
  function sanitizeRichHtml(raw) {
    const tpl = document.createElement('template');
    tpl.innerHTML = raw;
    const allowed = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'BR', 'P', 'DIV', 'UL', 'OL', 'LI']);
    const walk = node => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType !== 1) return;
        if (!allowed.has(child.tagName)) child.replaceWith(document.createTextNode(child.textContent || ''));
        else { [...child.attributes].forEach(a => child.removeAttribute(a.name)); walk(child); }
      });
    };
    walk(tpl.content);
    return tpl.innerHTML.trim();
  }

  document.querySelectorAll('[data-research-form]').forEach(form => {
    const card = form.closest('.r1-research-card');
    const choices = [...form.querySelectorAll('[data-use-case]')];
    const useCase = form.elements.useCase;
    const otherWrap = form.querySelector('[data-other-wrap]');
    const otherInput = form.elements.otherScenario;
    const email = form.elements.email;
    const consent = form.elements.consent;
    const note = form.querySelector('[data-research-note]');
    const submitBtn = form.querySelector('.r1-research-submit');
    const thanks = card?.querySelector('[data-research-thanks]');
    const thanksStatus = card?.querySelector('[data-thanks-status]');
    const surveyForm = card?.querySelector('[data-survey-form]');
    const shareBtn = card?.querySelector('[data-share-copy]');
    const endpoint = (form.dataset.endpoint || '').trim();
    let lastSignup = null;

    /* Rich text editor */
    const rteRoot = form.querySelector('[data-rte]');
    const rteEditor = rteRoot?.querySelector('.r1-rte-editor');
    const rteButtons = rteRoot ? [...rteRoot.querySelectorAll('[data-cmd]')] : [];
    function syncRte() {
      if (!rteEditor) return;
      const text = (rteEditor.innerText || '').trim();
      if (!text) rteEditor.innerHTML = '';
      if (form.elements.notesText) form.elements.notesText.value = text;
      if (form.elements.notesHtml) form.elements.notesHtml.value = text ? sanitizeRichHtml(rteEditor.innerHTML) : '';
    }
    function updateToolbar() {
      rteButtons.forEach(btn => {
        if (btn.dataset.cmd === 'removeFormat') return;
        try { btn.setAttribute('aria-pressed', String(document.queryCommandState(btn.dataset.cmd))); } catch {}
      });
    }
    if (rteEditor) {
      rteButtons.forEach(btn => {
        btn.addEventListener('mousedown', e => e.preventDefault());
        btn.addEventListener('click', () => {
          rteEditor.focus();
          if (btn.dataset.cmd === 'removeFormat') rteEditor.textContent = rteEditor.innerText;
          else document.execCommand(btn.dataset.cmd, false);
          syncRte();
          updateToolbar();
        });
      });
      rteEditor.addEventListener('input', () => { syncRte(); updateToolbar(); });
      rteEditor.addEventListener('keyup', updateToolbar);
      rteEditor.addEventListener('mouseup', updateToolbar);
    }

    function setNote(key, tone) {
      if (!note) return;
      SET(note, key);
      if (tone) note.dataset.tone = tone; else delete note.dataset.tone;
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
      if (!started) { started = true; track('waitlist_start', { variant }); }
    });

    choices.forEach(choice => choice.addEventListener('click', () => {
      choices.forEach(button => button.setAttribute('aria-pressed', String(button === choice)));
      useCase.value = choice.dataset.useCase;
      const isOther = useCase.value === 'Others';
      if (otherWrap) {
        otherWrap.hidden = !isOther;
        if (isOther && otherInput) otherInput.focus();
      }
      setNote('note.default');
    }));

    form.addEventListener('submit', async event => {
      event.preventDefault();
      syncRte();
      if (!email.value.trim() || !email.checkValidity()) { setNote('err.email', 'error'); email.focus(); return; }
      if (!useCase.value) { setNote('err.usecase', 'error'); choices[0]?.focus(); return; }
      if (useCase.value === 'Others' && otherInput && !otherInput.value.trim()) { setNote('err.other', 'error'); otherInput.focus(); return; }
      if (!consent.checked) { setNote('err.consent', 'error'); consent.focus(); return; }

      const regionInfo = window.ruttaRegionInfo ? window.ruttaRegionInfo() : { locale: 'en', timeZone: '', browserLocale: '' };
      lastSignup = {
        type: 'waitlist',
        model: 'R1',
        email: email.value.trim(),
        useCase: useCase.value === 'Others' && otherInput?.value.trim() ? 'Others: ' + otherInput.value.trim() : useCase.value,
        name: (form.elements.name?.value || '').trim(),
        teamSize: form.elements.teamSize?.value || '',
        notesText: (form.elements.notesText?.value || '').trim(),
        notesHtml: (form.elements.notesHtml?.value || '').trim(),
        consent: true,
        locale: regionInfo.locale,
        browserLocale: regionInfo.browserLocale,
        timeZone: regionInfo.timeZone,
        headline: variant,
        page: location.pathname,
        savedAt: new Date().toISOString(),
        ...attribution()
      };

      submitBtn.disabled = true;
      try {
        const mode = await sendPayload(lastSignup);
        track('waitlist_submit', { variant, useCase: useCase.value, teamSize: lastSignup.teamSize, locale: regionInfo.locale });
        form.hidden = true;
        if (thanks) {
          SET(thanksStatus, mode === 'remote' ? 'th.remote' : 'th.local');
          thanks.hidden = false;
          thanks.focus();
        }
      } catch {
        setNote('err.generic', 'error');
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
          const regionInfo = window.ruttaRegionInfo ? window.ruttaRegionInfo() : { locale: 'en' };
          await sendPayload({ type: 'survey', model: 'R1', email: lastSignup?.email || '', locale: regionInfo.locale, ...data, savedAt: new Date().toISOString() });
        } catch {}
        track('survey_submit', { priceReaction: data.priceReaction || '', interviewPref: data.interviewPref || '' });
        const done = document.createElement('p');
        done.className = 'r1-thanks-sub';
        SET(done, 'sv.done');
        surveyForm.replaceWith(done);
      });
    }

    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        const code = lastSignup ? btoa(lastSignup.email).replace(/[^a-z0-9]/gi, '').slice(0, 8) : 'team';
        const activeLocale = window.ruttaLang ? window.ruttaLang() : 'en';
        const q = activeLocale && activeLocale !== 'en' ? `?lang=${encodeURIComponent(activeLocale)}&ref=${code}` : `?ref=${code}`;
        const url = location.origin + location.pathname + q;
        try { await navigator.clipboard.writeText(url); SET(shareBtn, 'sh.copied'); }
        catch { shareBtn.textContent = url; }
        track('share_copy', { locale: activeLocale });
      });
    }
  });
})();
