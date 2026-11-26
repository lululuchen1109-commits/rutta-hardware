(() => {
  const tabs = [...document.querySelectorAll('[data-ct-tab]')];
  const panels = {
    waitlist: document.getElementById('ct-panel-waitlist'),
    inquiry: document.getElementById('ct-panel-inquiry')
  };
  const params = new URLSearchParams(location.search);

  function selectTab(name, focus) {
    if (!panels[name]) return;
    tabs.forEach(tab => {
      const active = tab.dataset.ctTab === name;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[tab.dataset.ctTab].hidden = !active;
    });
    if (focus) tabs.find(t => t.dataset.ctTab === name)?.focus();
    window.ruttaTrack?.('contact_tab_switch', { tab: name });
  }

  tabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => selectTab(tab.dataset.ctTab, false));
    tab.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const next = tabs[(idx + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
        selectTab(next.dataset.ctTab, true);
      }
    });
  });

  if (params.get('tab') === 'inquiry' || location.hash === '#inquiry') {
    selectTab('inquiry', false);
  }

  /* General & press inquiry form */
  const form = document.querySelector('[data-inquiry-form]');
  if (!form) return;

  const topics = [...form.querySelectorAll('[data-topic]')];
  const topicInput = form.elements.topic;
  const note = form.querySelector('[data-inquiry-note]');
  const submitBtn = form.querySelector('.lk-research-submit');
  const thanks = document.querySelector('[data-inquiry-thanks]');
  const thanksStatus = document.querySelector('[data-inquiry-status]');
  const endpoint = (form.dataset.endpoint || '').trim();

  function setNote(msg, tone) {
    if (!note) return;
    note.textContent = msg;
    if (tone) note.dataset.tone = tone;
    else delete note.dataset.tone;
  }

  topics.forEach(btn => btn.addEventListener('click', () => {
    topics.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    topicInput.value = btn.dataset.topic;
    setNote('Direct to the Rutta hardware team · We read every note.');
  }));

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = form.elements.name;
    const email = form.elements.email;
    const message = form.elements.message;
    const consent = form.elements.consent;

    if (!name.value.trim()) {
      setNote('Please enter your name.', 'error');
      name.focus();
      return;
    }
    if (!email.value.trim() || !email.checkValidity()) {
      setNote('Please enter a valid email address so we can reply.', 'error');
      email.focus();
      return;
    }
    if (!message.value.trim()) {
      setNote('Please include a short message.', 'error');
      message.focus();
      return;
    }
    if (!consent.checked) {
      setNote('Please tick the box so we can reply to your inquiry by email.', 'error');
      consent.focus();
      return;
    }

    const payload = {
      type: 'inquiry',
      topic: topicInput.value,
      name: name.value.trim(),
      org: form.elements.org.value.trim(),
      email: email.value.trim(),
      message: message.value.trim(),
      consent: true,
      page: location.pathname,
      savedAt: new Date().toISOString()
    };

    submitBtn.disabled = true;
    try {
      let mode = 'local';
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Request failed');
        mode = 'remote';
      } else {
        const list = JSON.parse(localStorage.getItem('rutta-inquiries-v1') || '[]');
        list.push(payload);
        localStorage.setItem('rutta-inquiries-v1', JSON.stringify(list));
      }
      window.ruttaTrack?.('contact_inquiry_submit', { topic: payload.topic });
      form.hidden = true;
      if (thanks) {
        if (thanksStatus) {
          thanksStatus.textContent = mode === 'remote'
            ? 'Thanks for reaching out. We’ll get back to you by email soon.'
            : 'Preview mode: saved in this browser until the live contact backend is connected.';
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

  document.querySelector('[data-switch-waitlist]')?.addEventListener('click', () => selectTab('waitlist', true));
  document.querySelector('[data-reset-inquiry]')?.addEventListener('click', () => {
    form.reset();
    topics.forEach((b, i) => b.setAttribute('aria-pressed', String(i === 0)));
    topicInput.value = topics[0]?.dataset.topic || 'Product question';
    setNote('Direct to the Rutta hardware team · We read every note.');
    if (thanks) thanks.hidden = true;
    form.hidden = false;
  });
})();
