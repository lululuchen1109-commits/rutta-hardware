(() => {
  const root = document.querySelector('.lk-hero');
  if (!root) return;
  const slides = [...root.querySelectorAll('.lk-slide')];
  const dots = [...root.querySelectorAll('.lk-pagination button')];
  let index = 0;
  function selectSlide(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== index; });
    dots.forEach((button, i) => { button.setAttribute('aria-pressed', String(i === index)); });
  }
  root.querySelector('.lk-prev').addEventListener('click', () => selectSlide(index - 1));
  root.querySelector('.lk-next').addEventListener('click', () => selectSlide(index + 1));
  dots.forEach((button, i) => button.addEventListener('click', () => selectSlide(i)));
  root.addEventListener('keydown', event => {
    if (!event.target.closest('.lk-slide-arrow, .lk-pagination')) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      selectSlide(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  let touchStart;
  root.addEventListener('touchstart', event => {
    touchStart = event.target.closest('a, button') ? null : event.changedTouches[0];
  }, {passive: true});
  root.addEventListener('touchend', event => {
    if (!touchStart) return;
    const end = event.changedTouches[0];
    const dx = end.clientX - touchStart.clientX;
    const dy = end.clientY - touchStart.clientY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > 1.5 * Math.abs(dy)) selectSlide(index + (dx < 0 ? 1 : -1));
    touchStart = null;
  });
  const topbar = root.querySelector('.lk-topbar');
  const toggle = topbar.querySelector('.lk-nav-toggle');
  function setMenu(open) {
    topbar.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  }
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') === 'false'));
  topbar.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('click', e => { if (!topbar.contains(e.target)) setMenu(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && topbar.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });
})();
