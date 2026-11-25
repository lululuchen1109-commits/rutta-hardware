(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const V = '?v=pair-center-1';
  const cache = new Map();
  const load = src => {
    if (cache.has(src)) return cache.get(src);
    const img = new Image(); img.src = src;
    const p = img.decode().then(() => img).catch(e => { cache.delete(src); throw e; });
    cache.set(src, p); return p;
  };

  /* ---------- header: transparent at top, hides on scroll down, returns white on scroll up ---------- */
  const header = $('.lk-header');
  let lastY = scrollY, state = 'top';
  const setState = next => {
    if (next === state) return;
    const jump = state === 'top' || next === 'top';
    if (jump) header.classList.add('no-anim');
    header.dataset.state = state = next;
    if (jump) { void header.offsetHeight; requestAnimationFrame(() => header.classList.remove('no-anim')); }
  };
  const onScroll = () => {
    const y = scrollY;
    if (y < 80) setState('top');
    else if (y > 180 && Math.abs(y - lastY) > 2) setState(y < lastY ? 'shown' : 'hidden');
    lastY = y;
  };
  addEventListener('scroll', onScroll, {passive:true});
  $$('.lk-nav a, .lk-cta').forEach(a => a.addEventListener('click', () => setTimeout(() => setState(scrollY < 80 ? 'top' : 'hidden'), 700)));

  /* ---------- hero carousel ---------- */
  const hero = $('.lk-hero');
  if (hero) {
    const track = $('.lk-hero-track', hero);
    const slides = $$('.lk-slide', hero);
    const bars = $$('.lk-progress button', hero);
    const DURATION = 8000;
    let index = 0, start = performance.now(), elapsed = 0, hover = false, visible = true, stopped = reduced;
    const go = i => {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(${-100 * index}%)`;
      slides.forEach((s, k) => { const on = k === index; s.classList.toggle('is-active', on); s.inert = !on; });
      bars.forEach((b, k) => {
        if (k === index) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
        b.style.setProperty('--p', k === index && stopped ? 1 : 0);
      });
      elapsed = 0; start = performance.now();
      const nextImg = slides[(index + 1) % slides.length].querySelector('img[loading=lazy]');
      if (nextImg) nextImg.loading = 'eager';
    };
    const tick = now => {
      requestAnimationFrame(tick);
      if (stopped || hover || !visible || document.hidden) { start = now - elapsed; return; }
      elapsed = now - start;
      bars[index].style.setProperty('--p', Math.min(1, elapsed / DURATION));
      if (elapsed >= DURATION) go(index + 1);
    };
    $('.lk-arrow--prev', hero).addEventListener('click', () => go(index - 1));
    $('.lk-arrow--next', hero).addEventListener('click', () => go(index + 1));
    bars.forEach((b, k) => b.addEventListener('click', () => go(k)));
    hero.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hover = true; });
    hero.addEventListener('pointerleave', () => { hover = false; });
    hero.addEventListener('focusin', () => { hover = true; });
    hero.addEventListener('focusout', () => { hover = false; });
    let sx = null;
    hero.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') sx = e.clientX; });
    hero.addEventListener('pointerup', e => {
      if (sx === null) return;
      const dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
    });
    if ('IntersectionObserver' in window) new IntersectionObserver(es => { visible = es[0].isIntersecting; }, {threshold:.25}).observe(hero);
    go(0);
    requestAnimationFrame(tick);

    /* finishes on slide 2 */
    const productSlide = $('.lk-slide--product', hero);
    const productImg = $('#hero-finish');
    const finishButtons = $$('[data-tone]', productSlide);
    let request = 0;
    finishButtons.forEach(b => {
      const src = 'assets/landing/hero-' + b.dataset.tone + '.webp' + V;
      b.addEventListener('pointerenter', () => load(src).catch(() => {}), {once:true});
      b.addEventListener('click', async () => {
        stopped = true; bars[index].style.setProperty('--p', 1);
        const r = ++request;
        try {
          const img = await load(src);
          if (r !== request) return;
          productImg.src = img.src;
          productSlide.dataset.finish = b.dataset.tone;
          finishButtons.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        } catch { /* keep the current finish */ }
      });
    });
  }

  /* ---------- tabs (how it works) ---------- */
  $$('.lk-how [role=tablist]').forEach(list => {
    const tabs = $$('[role=tab]', list);
    const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
    const select = (i, focus) => {
      tabs.forEach((t, k) => {
        const on = k === i;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panels[k].hidden = !on;
      });
      if (focus) tabs[i].focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', e => {
        const step = {ArrowRight:1, ArrowLeft:-1}[e.key];
        if (step) { e.preventDefault(); select((i + step + tabs.length) % tabs.length, true); }
      });
    });
  });

  /* ---------- rules rotator ---------- */
  const words = $$('.lk-word');
  if (words.length) {
    const text = $('.lk-rule-text');
    const lines = [
      '“The USB-C plug is the whole connection. Nothing runs across the desk, and nothing gets left behind in a bag.”',
      '“Your Mac powers it through the port, so there’s nothing to charge and nothing to run flat halfway through a meeting.”',
      '“A metal switch on the side mutes it instantly. You can find it with one finger, mid-sentence, without looking.”'
    ];
    let current = 0;
    const place = () => {
      words.forEach(w => {
        const pos = (Number(w.dataset.i) - current + 3) % 3;
        w.className = 'lk-word ' + ['is-current', 'is-next', 'is-prev'][pos];
        if (pos === 0) w.setAttribute('aria-current', 'true'); else w.removeAttribute('aria-current');
      });
      text.style.opacity = 0;
      setTimeout(() => { text.textContent = lines[current]; text.style.opacity = 1; }, reduced ? 0 : 180);
    };
    words.forEach(w => w.addEventListener('click', () => { if (Number(w.dataset.i) !== current) { current = Number(w.dataset.i); place(); } }));
  }

  /* ---------- stories: expanding cards ---------- */
  const storyTrack = $('.lk-story-track');
  if (storyTrack) {
    const cards = $$('.lk-story', storyTrack);
    const dotsBox = $('.lk-dots');
    const prev = $('.lk-story-arrow--prev'), next = $('.lk-story-arrow--next');
    const dots = cards.map((c, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Story ' + (i + 1) + ': ' + $('.lk-story-tag', c).textContent);
      dotsBox.append(b);
      return b;
    });
    let current = 0;
    const scrollTo = i => {
      const other = cards.find((_, k) => k !== i) || cards[0];
      const w = parseFloat(getComputedStyle(other).flexBasis) || other.offsetWidth;
      const gap = parseFloat(getComputedStyle(storyTrack).columnGap) || 20;
      storyTrack.scrollTo({left: Math.max(0, i * (w + gap) - (i ? 40 : 0)), behavior: reduced ? 'auto' : 'smooth'});
    };
    const open = (i, scroll = true) => {
      current = i;
      cards.forEach((c, k) => {
        const on = k === i;
        c.classList.toggle('is-open', on);
        $('.lk-story-toggle', c).setAttribute('aria-expanded', String(on));
      });
      dots.forEach((d, k) => { if (k === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
      prev.disabled = i <= 0; next.disabled = i >= cards.length - 1;
      if (scroll && i >= 0) scrollTo(i);
    };
    cards.forEach((c, i) => {
      c.addEventListener('click', e => {
        if (e.target.closest('.lk-story-toggle')) return;
        if (!c.classList.contains('is-open')) open(i);
      });
      $('.lk-story-toggle', c).addEventListener('click', () => {
        if (c.classList.contains('is-open')) { c.classList.remove('is-open'); $('.lk-story-toggle', c).setAttribute('aria-expanded', 'false'); }
        else open(i);
      });
    });
    dots.forEach((d, i) => d.addEventListener('click', () => open(i)));
    prev.addEventListener('click', () => open(Math.max(0, current - 1)));
    next.addEventListener('click', () => open(Math.min(cards.length - 1, current + 1)));
    open(0, false);
  }

  /* ---------- fit: installation sequence ---------- */
  const player = $('.fit-player');
  if (player) {
    const frame = $('#fit-frame');
    const slider = $('#fit-range');
    const status = $('#fit-status');
    const play = $('.fit-play', player);
    const last = Number(slider.max);
    const address = i => 'assets/landing/fit-' + String(i).padStart(2, '0') + '.webp' + V;
    let seq = 0, running = false, current = 0, req = 0;
    const display = async i => {
      const r = ++req;
      try {
        const img = await load(address(i));
        if (r !== req) return false;
        frame.src = img.src; current = i;
        slider.value = String(i);
        slider.style.setProperty('--fill', (100 * i / last) + '%');
        const label = i === 0 ? 'Unplugged' : i === last ? 'Connected' : 'Aligning';
        slider.setAttribute('aria-valuetext', label + (i && i < last ? ' · ' + Math.round(100 * i / last) + '%' : ''));
        status.value = label;
        frame.alt = i === last ? 'Silver Rutta Bar seated against the MacBook Air' : 'Rutta Bar aligned with the USB-C port on the side of a MacBook Air';
        return true;
      } catch {
        if (r === req) { slider.value = String(current); status.value = 'Try again'; }
        return false;
      }
    };
    const stop = () => {
      ++seq; running = false;
      play.setAttribute('aria-label', current === last ? 'Replay installation' : 'Play installation');
      play.firstElementChild.textContent = current === last ? '↺' : '▶';
    };
    slider.addEventListener('input', () => { stop(); display(Number(slider.value)).then(ok => { if (ok && !running) stop(); }); });
    play.addEventListener('click', async () => {
      if (running) { stop(); return; }
      running = true;
      const run = ++seq;
      play.setAttribute('aria-label', 'Pause installation');
      play.firstElementChild.textContent = 'Ⅱ';
      const from = current >= last ? 0 : current;
      if (reduced) await display(current === last ? 0 : last);
      else for (let i = from; i <= last && run === seq; i++) {
        if (!await display(i)) break;
        if (i < last) { load(address(i + 1)).catch(() => {}); await new Promise(r => setTimeout(r, 82)); }
      }
      if (run === seq) stop();
    });
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => {
        if (es.some(e => e.isIntersecting)) { [0, 1, last].forEach(i => load(address(i)).catch(() => {})); io.disconnect(); }
      }, {rootMargin:'300px'});
      io.observe(player);
    }
  }

  /* ---------- persona cards ---------- */
  $$('.lk-plus').forEach(b => b.addEventListener('click', () => {
    const more = $('.lk-qc-more', b.closest('.lk-quote-card'));
    const open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(open));
    more.hidden = !open;
  }));

  /* ---------- unboxing film dialog ---------- */
  const dialog = $('.lk-film');
  const film = $('#unboxing-film');
  if (dialog && film) {
    $$('[data-film]').forEach(b => b.addEventListener('click', () => {
      if (typeof dialog.showModal === 'function') dialog.showModal(); else { location.href = 'assets/landing/unboxing.mp4' + V; return; }
      try { film.currentTime = 0; } catch {}
      film.play().catch(() => {});
    }));
    $('.lk-film-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => film.pause());
  }

  /* ---------- sign-up (not connected to a backend yet) ---------- */
  const form = $('.lk-signup');
  if (form) {
    const input = $('input', form), note = $('.lk-signup-note', form);
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!input.value.trim() || !input.checkValidity()) { note.textContent = 'Please enter a valid email address.'; input.focus(); return; }
      try { localStorage.setItem('rutta-updates-email', input.value.trim()); } catch {}
      note.textContent = 'Thanks. Sign-up isn’t connected yet, so this is only saved in your browser.';
      form.reset();
    });
  }
})();
