(() => {
  /* Three core principles strip */
  const detailCopy = {
    always: 'Most real decisions happen in two-minute desk chats, never when someone opens a recorder. R1 stays online whenever your Mac is open—no start button, no battery to charge.',
    voiceprint: 'Designed to recognize enrolled teammates so R1 knows who said what and who owns each task—while discarding visitors and non-enrolled colleagues.',
    agents: 'Confirmed decisions and tasks stream straight into your knowledge base, task tracker, and AI Agents via MCP, API, and CLI—never locked inside our app.'
  };
  const detailButtons = [...document.querySelectorAll('[data-detail]')];
  const explainer = document.getElementById('detail-explainer');
  for (const button of detailButtons) {
    button.addEventListener('click', () => {
      for (const sibling of detailButtons) sibling.setAttribute('aria-pressed', String(sibling === button));
      if (explainer) explainer.textContent = detailCopy[button.dataset.detail] || '';
    });
  }

  /* Privacy 3-state macro preview */
  const privacyPhoto = document.getElementById('privacy-photo');
  const privacyCaption = document.getElementById('privacy-caption');
  const privacyButtons = [...document.querySelectorAll('[data-pstate]')];
  const privacyStates = {
    ready: {
      src: 'assets/landing/privacy-ready.webp?v=studio-v7',
      alt: 'Close-up of R1 ready: top status light glowing green next to the R mark, aluminum switch in the open position.',
      caption: 'Green breathing light on top · Switch open, R1 ready.'
    },
    input: {
      src: 'assets/landing/privacy-input.webp?v=studio-v7',
      alt: 'Close-up of R1 active: top status light glowing solid amber next to the R mark, aluminum switch in the open position.',
      caption: 'Solid amber light on top · Enrolled speech active.'
    },
    mute: {
      src: 'assets/landing/privacy-mute.webp?v=studio-v7',
      alt: 'Close-up of R1 muted: top status light off and aluminum switch slid back to reveal an orange mechanical marker.',
      caption: 'Light off · Orange mechanical marker visible in the switch track.'
    }
  };
  if (privacyPhoto && privacyButtons.length) {
    const warm = () => Object.values(privacyStates).forEach(s => { const i = new Image(); i.src = s.src; });
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting)) { warm(); obs.disconnect(); }
      }, { rootMargin: '250px' });
      obs.observe(privacyPhoto);
    } else warm();

    privacyButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const state = privacyStates[btn.dataset.pstate];
        if (!state) return;
        privacyButtons.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
        privacyPhoto.src = state.src;
        privacyPhoto.alt = state.alt;
        if (privacyCaption) privacyCaption.textContent = state.caption;
      });
    });
  }

  /* Privacy notice dialog */
  const dialog = document.getElementById('privacy-dialog');
  if (dialog) {
    document.querySelectorAll('[data-open-privacy]').forEach(btn => {
      btn.addEventListener('click', () => dialog.showModal());
    });
    document.querySelectorAll('[data-close-privacy]').forEach(btn => {
      btn.addEventListener('click', () => dialog.close());
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) {
        dialog.close();
      }
    });
  }

  /* Backwards-compatible hash anchors */
  const equivalents = {
    research: 'waitlist',
    why: 'scenarios',
    story: 'scenarios',
    how: 'workflow',
    stories: 'scenarios',
    scenes: 'scenarios',
    notes: 'workflow',
    people: 'privacy',
    unboxing: 'hardware',
    more: 'journal',
    main: 'overview'
  };
  const followOldLink = () => {
    const target = document.getElementById(equivalents[location.hash.slice(1)]);
    if (!target) return;
    if (target.tagName === 'DETAILS') target.open = true;
    target.scrollIntoView({ block: 'start' });
  };
  followOldLink();
  window.addEventListener('hashchange', followOldLink);
})();
