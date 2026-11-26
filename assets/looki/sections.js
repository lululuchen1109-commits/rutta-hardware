(() => {
  /* Three hardware details strip */
  const detailCopy = {
    plug: 'One integrated USB-C plug carries power from your Mac and audio back to it. No cable across the table, no battery to charge.',
    inlets: 'Two Ø 0.40 mm acoustic inlets—one centered on the short end, one mid-side 15.5 mm away—create a 15.7 mm physical dual-mic baseline.',
    mute: 'Slide the centered aluminum switch back to mute. The top light goes dark and an orange mechanical marker appears in the track.'
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
      alt: 'Close-up of Rutta Bar ready: top status light glowing green next to the R mark, aluminum switch in the open position.',
      caption: 'Green breathing light on top · Switch open, microphone ready.'
    },
    input: {
      src: 'assets/landing/privacy-input.webp?v=studio-v7',
      alt: 'Close-up of Rutta Bar sending audio: top status light glowing solid amber next to the R mark, aluminum switch in the open position.',
      caption: 'Solid amber light on top · Audio is actively going to your Mac.'
    },
    mute: {
      src: 'assets/landing/privacy-mute.webp?v=studio-v7',
      alt: 'Close-up of Rutta Bar muted: top status light off and aluminum switch slid back to reveal an orange mechanical marker.',
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

  /* Auto-play unboxing video when clicking unboxing links */
  const film = document.querySelector('#unboxing-film');
  if (film) {
    for (const link of document.querySelectorAll('a[href="#unboxing"]')) {
      link.addEventListener('click', event => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (film.ended) film.currentTime = 0;
        film.play().catch(() => {});
      });
    }
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
    story: 'why',
    how: 'why',
    stories: 'why',
    scenes: 'why',
    notes: 'why',
    people: 'privacy',
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
