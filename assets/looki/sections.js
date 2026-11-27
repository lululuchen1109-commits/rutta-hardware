(() => {
  const T = (key, fallback) => (window.ruttaT ? window.ruttaT(key, fallback) : fallback);
  const SET = (el, key) => { if (window.ruttaSet) window.ruttaSet(el, key); };

  /* Three highlights strip */
  const detailButtons = [...document.querySelectorAll('[data-detail]')];
  const explainer = document.getElementById('detail-explainer');
  detailButtons.forEach(button => {
    button.addEventListener('click', () => {
      detailButtons.forEach(sibling => sibling.setAttribute('aria-pressed', String(sibling === button)));
      SET(explainer, 'detail.' + button.dataset.detail + '.body');
    });
  });

  /* Privacy status preview */
  const privacyPhoto = document.getElementById('privacy-photo');
  const privacyCaption = document.getElementById('privacy-caption');
  const privacyButtons = [...document.querySelectorAll('[data-pstate]')];
  const privacySrc = {
    ready: 'assets/landing/privacy-ready.webp?v=studio-v7',
    input: 'assets/landing/privacy-input.webp?v=studio-v7',
    mute: 'assets/landing/privacy-mute.webp?v=studio-v7'
  };
  if (privacyPhoto && privacyButtons.length) {
    const warm = () => Object.values(privacySrc).forEach(src => { const i = new Image(); i.src = src; });
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting)) { warm(); obs.disconnect(); }
      }, { rootMargin: '250px' });
      obs.observe(privacyPhoto);
    } else warm();

    privacyButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const state = btn.dataset.pstate;
        if (!privacySrc[state]) return;
        privacyButtons.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
        privacyPhoto.src = privacySrc[state];
        SET(privacyCaption, 'pv.cap.' + state);
      });
    });
  }

  /* Privacy notice dialog */
  const dialog = document.getElementById('privacy-dialog');
  if (dialog) {
    document.querySelectorAll('[data-open-privacy]').forEach(btn => btn.addEventListener('click', () => dialog.showModal()));
    document.querySelectorAll('[data-close-privacy]').forEach(btn => btn.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
    });
  }

  /* Old anchors keep working */
  const equivalents = {
    research: 'waitlist', why: 'value', story: 'scenarios', how: 'workflow', stories: 'scenarios',
    scenes: 'scenarios', notes: 'workflow', people: 'privacy', unboxing: 'hardware', journal: 'hardware', main: 'overview'
  };
  const followOldLink = () => {
    const target = document.getElementById(equivalents[location.hash.slice(1)]);
    if (target) target.scrollIntoView({ block: 'start' });
  };
  followOldLink();
  window.addEventListener('hashchange', followOldLink);
  void T;
})();
