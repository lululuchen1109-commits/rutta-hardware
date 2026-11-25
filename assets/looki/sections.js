(() => {
  const detailCopy = {
    plug: 'The plug carries power from your Mac and audio back to it. There’s no cable to lay across the table.',
    light: 'The single light on top breathes green when ready, stays yellow while sending audio, and goes dark when muted.',
    mute: 'Slide the metal switch back to mute. The orange mark in the switch track is visible even when the light is off.'
  };
  const detailButtons = [...document.querySelectorAll('[data-detail]')];
  const explainer = document.getElementById('detail-explainer');
  for (const button of detailButtons) {
    button.addEventListener('click', () => {
      for (const sibling of detailButtons) sibling.setAttribute('aria-pressed', String(sibling === button));
      explainer.textContent = detailCopy[button.dataset.detail];
    });
  }

  const rail = document.querySelector('.moment-rail');
  const moments = [...rail.children];
  const mobile = matchMedia('(max-width:749px)');
  let selected = 0;
  function selectMoment(index, move) {
    selected = (index + moments.length) % moments.length;
    for (const [i, moment] of moments.entries()) {
      const open = i === selected;
      moment.dataset.open = String(open);
      moment.querySelector('button').setAttribute('aria-expanded', String(open));
      moment.querySelector('.moment-copy p').hidden = !open;
    }
    if (move) {
      const target = moments[selected];
      const gap = target.getBoundingClientRect().left - rail.getBoundingClientRect().left;
      if (mobile.matches || gap < 0 || gap + target.clientWidth > rail.clientWidth) rail.scrollTo({left: rail.scrollLeft + gap - (mobile.matches ? 16 : 0)});
    }
  }
  for (const [i, moment] of moments.entries()) {
    moment.querySelector('button').addEventListener('click', () => selectMoment(i, true));
  }
  for (const button of document.querySelectorAll('[data-nudge]')) {
    button.addEventListener('click', () => selectMoment(selected + Number(button.dataset.nudge), true));
  }
  document.querySelector('[data-tutor]').addEventListener('click', () => selectMoment(moments.length - 1, true));
  const film = document.querySelector('#unboxing-film');
  for (const link of document.querySelectorAll('.lk-announcement a, .lk-hero-pill[href="#unboxing"]')) {
    link.addEventListener('click', event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (film.ended) film.currentTime = 0;
      film.play().catch(() => {});
    });
  }
  rail.addEventListener('scroll', () => {
    if (!mobile.matches) return;
    const offset = rail.scrollLeft + moments[0].offsetLeft;
    const nearest = moments.reduce((a,b) => Math.abs(a.offsetLeft-offset) < Math.abs(b.offsetLeft-offset) ? a : b);
    const index = moments.indexOf(nearest);
    if (index !== selected) selectMoment(index, false);
  }, {passive:true});
})();

(() => {
  const equivalents = {how:'story', stories:'scenes', notes:'story', more:'journal', faq:'specs', main:'overview'};
  const followOldLink = () => {
    const target = document.getElementById(equivalents[location.hash.slice(1)]);
    if (!target) return;
    if (target.tagName === 'DETAILS') target.open = true;
    target.scrollIntoView({block:'start'});
  };
  followOldLink();
  window.addEventListener('hashchange', followOldLink);
})();
