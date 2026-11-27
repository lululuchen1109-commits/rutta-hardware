(() => {
  const SET = (el, key) => { if (el && window.ruttaSet) window.ruttaSet(el, key); };

  /* 1. Tabbed workflow showcase */
  document.querySelectorAll('[data-stage]').forEach(stage => {
    const tabs = [...stage.querySelectorAll('[data-stage-tab]')];
    const panels = [...stage.querySelectorAll('[data-stage-panel]')];
    function select(name) {
      tabs.forEach(tab => {
        const active = tab.dataset.stageTab === name;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      panels.forEach(panel => { panel.hidden = panel.dataset.stagePanel !== name; });
    }
    tabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => select(tab.dataset.stageTab));
      tab.addEventListener('keydown', e => {
        const nextIdx = e.key === 'ArrowRight' ? (idx + 1) % tabs.length
          : e.key === 'ArrowLeft' ? (idx + tabs.length - 1) % tabs.length : -1;
        if (nextIdx < 0) return;
        e.preventDefault();
        tabs[nextIdx].click();
        tabs[nextIdx].focus();
      });
    });
  });

  /* 2. Kinetic 3-word principle strip */
  const detailButtons = [...document.querySelectorAll('[data-detail]')];
  const explainer = document.getElementById('detail-explainer');
  detailButtons.forEach(button => {
    button.addEventListener('click', () => {
      detailButtons.forEach(sibling => sibling.setAttribute('aria-pressed', String(sibling === button)));
      SET(explainer, 'detail.' + button.dataset.detail + '.body');
    });
  });

  /* 3. Horizontal expandable scenario rail */
  document.querySelectorAll('[data-story-rail]').forEach(rail => {
    const track = rail.querySelector('.r1-story-track');
    const cards = [...rail.querySelectorAll('.r1-story')];
    const prev = rail.querySelector('.r1-story-arrow--prev');
    const next = rail.querySelector('.r1-story-arrow--next');
    const dots = [...rail.querySelectorAll('.r1-story-dots button')];
    if (!track || !cards.length) return;

    let current = 0;

    function syncArrows() {
      if (!prev || !next) return;
      prev.disabled = track.scrollLeft <= 6;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 6;
    }

    function openCard(index, shouldScroll) {
      current = (index + cards.length) % cards.length;
      cards.forEach((card, i) => {
        const open = i === current;
        card.classList.toggle('is-open', open);
        const btn = card.querySelector('.r1-story-toggle');
        if (btn) btn.setAttribute('aria-expanded', String(open));
      });
      dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === current)));
      if (shouldScroll) {
        const target = cards[current];
        const gap = parseFloat(getComputedStyle(track).gap) || 18;
        const desktop = window.innerWidth > 940;
        const estLeft = desktop
          ? (current === cards.length - 1 ? track.scrollWidth + 420 : Math.max(0, current * (326 + gap) - 12))
          : Math.max(0, target.offsetLeft - 12);
        track.scrollTo({ left: estLeft, behavior: 'smooth' });
        setTimeout(() => {
          const settledLeft = current === cards.length - 1
            ? track.scrollWidth
            : Math.max(0, target.offsetLeft - 12);
          track.scrollTo({ left: settledLeft, behavior: 'smooth' });
          syncArrows();
        }, 500);
      } else {
        setTimeout(syncArrows, 500);
      }
    }

    cards.forEach((card, idx) => {
      const toggle = card.querySelector('.r1-story-toggle');
      card.addEventListener('click', e => {
        if (e.target.closest('a')) return;
        if (!card.classList.contains('is-open')) openCard(idx, true);
      });
      toggle?.addEventListener('click', e => {
        e.stopPropagation();
        if (card.classList.contains('is-open')) openCard((idx + 1) % cards.length, true);
        else openCard(idx, true);
      });
    });

    prev?.addEventListener('click', () => openCard(Math.max(0, current - 1), true));
    next?.addEventListener('click', () => openCard(Math.min(cards.length - 1, current + 1), true));
    dots.forEach((dot, idx) => dot.addEventListener('click', () => openCard(idx, true)));
    track.addEventListener('scroll', syncArrows, { passive: true });
    window.addEventListener('resize', syncArrows, { passive: true });
    syncArrows();
  });

  /* 4. Privacy status preview — pure transparent R1 hardware macro + volumetric studio state aura */
  const privacyPhoto = document.getElementById('privacy-photo');
  const privacyStage = document.querySelector('.r1-privacy-stage');
  const privacyCaption = document.getElementById('privacy-caption');
  const privacyButtons = [...document.querySelectorAll('[data-pstate]')];
  const privacySrc = {
    ready: 'assets/landing/switch-photo-ready.webp?v=studio-v7',
    input: 'assets/landing/switch-photo-input.webp?v=studio-v7',
    mute: 'assets/landing/switch-photo-mute.webp?v=studio-v7'
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
        if (privacyStage) privacyStage.dataset.pstate = state;
        SET(privacyCaption, 'pv.cap.' + state);
      });
    });
  }

  /* 5. Privacy notice dialog & footer specs opener */
  document.querySelectorAll('[data-open-specs]').forEach(a => a.addEventListener('click', () => {
    const specs = document.getElementById('specs');
    if (specs) specs.open = true;
  }));
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

  /* 6. Legacy anchor aliases */
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
})();
