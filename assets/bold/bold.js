(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const V = '?v=switch-axis-26';
  const cache = new Map();
  const load = src => {
    if (cache.has(src)) return cache.get(src);
    const img = new Image(); img.src = src;
    const p = img.decode().then(() => img).catch(e => { cache.delete(src); throw e; });
    cache.set(src, p); return p;
  };

  /* ---------- header colour follows the section underneath ---------- */
  const header = $('.bd-header');
  const sections = $$('main > section, .bd-footer');
  const meta = $('meta[name=theme-color]');
  let ticking = false;
  const paint = () => {
    ticking = false;
    const y = header.offsetHeight;
    const s = sections.find(el => { const r = el.getBoundingClientRect(); return r.top <= y && r.bottom > y; }) || sections[0];
    const cs = getComputedStyle(s);
    header.style.setProperty('--hbg', cs.backgroundColor);
    header.style.setProperty('--hfg', cs.color);
    if (meta) meta.content = cs.backgroundColor;
  };
  const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };
  addEventListener('scroll', queue, {passive:true});
  addEventListener('resize', queue);
  // repaint when a section changes colour (finish picker, mute switch)
  new MutationObserver(queue).observe(document.body, {subtree:true, attributes:true, attributeFilter:['data-finish', 'data-state']});
  paint();

  /* ---------- hero: finishes + gentle tilt ---------- */
  const hero = $('.bd-hero');
  if (hero) {
    const img = $('#bd-hero-img');
    const name = $('.bd-finish-name', hero);
    const buttons = $$('[data-tone]', hero);
    let req = 0;
    buttons.forEach(b => {
      const src = 'assets/landing/hero-' + b.dataset.tone + '.webp' + V;
      b.addEventListener('pointerenter', () => load(src).catch(() => {}), {once:true});
      b.addEventListener('click', async () => {
        const r = ++req;
        try {
          const loaded = await load(src);
          if (r !== req) return;
          img.src = loaded.src;
          hero.dataset.finish = b.dataset.tone;
          name.textContent = b.getAttribute('aria-label');
          buttons.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
          window.ruttaTrack?.('finish_select', {finish: b.dataset.tone});
        } catch {}
      });
    });
    const stage = $('.bd-hero-stage', hero);
    if (!reduced) {
      stage.addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse') return;
        const r = stage.getBoundingClientRect();
        stage.style.setProperty('--ry', ((e.clientX - r.left) / r.width - .5) * 14 + 'deg');
        stage.style.setProperty('--rx', -((e.clientY - r.top) / r.height - .5) * 10 + 'deg');
      });
      stage.addEventListener('pointerleave', () => { stage.style.setProperty('--rx', '0deg'); stage.style.setProperty('--ry', '0deg'); });
    }
  }

  /* ---------- setup: installation sequence ---------- */
  const player = $('.fit-player');
  if (player) {
    const frame = $('#fit-frame'), slider = $('#fit-range'), status = $('#fit-status'), play = $('.fit-play', player);
    const last = Number(slider.max);
    const address = i => 'assets/landing/fit-' + String(i).padStart(2, '0') + '.webp' + V;
    let seq = 0, running = false, current = 0, req = 0;
    const display = async i => {
      const r = ++req;
      try {
        const loaded = await load(address(i));
        if (r !== req) return false;
        frame.src = loaded.src; current = i;
        slider.value = String(i);
        slider.style.setProperty('--fill', (100 * i / last) + '%');
        const label = i === 0 ? 'Unplugged' : i === last ? 'Connected!' : 'Aligning…';
        slider.setAttribute('aria-valuetext', label);
        status.value = label;
        return true;
      } catch { if (r === req) slider.value = String(current); return false; }
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

  /* ---------- polaroid scroller ---------- */
  const strip = $('.bd-polaroids');
  if (strip) $$('[data-scroll]').forEach(b => b.addEventListener('click', () => {
    const card = $('.bd-polaroid', strip);
    strip.scrollBy({left: Number(b.dataset.scroll) * (card.offsetWidth + 30), behavior: reduced ? 'auto' : 'smooth'});
  }));

  /* ---------- unboxing film ---------- */
  const dialog = $('.bd-film'), film = $('#unboxing-film');
  if (dialog && film) {
    $$('[data-film]').forEach(b => b.addEventListener('click', () => {
      if (typeof dialog.showModal !== 'function') { location.href = 'assets/landing/unboxing.mp4' + V; return; }
      dialog.showModal();
      try { film.currentTime = 0; } catch {}
      film.play().catch(() => {});
    }));
    $('.bd-film-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => film.pause());
  }
})();
