(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const cache = new Map();
  const load = src => {
    if (cache.has(src)) return cache.get(src);
    const img = new Image(); img.src = src;
    const p = img.decode().then(() => img).catch(e => { cache.delete(src); throw e; });
    cache.set(src, p); return p;
  };

  /* ---------- Scenes: tabs with auto-advance ---------- */
  const scenes = document.getElementById('scenes');
  if (scenes) {
    const tabs = [...scenes.querySelectorAll('[role=tab]')];
    const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
    const DURATION = 7000;
    let index = 0, start = 0, elapsed = 0, raf = 0, paused = false, visible = false, stopped = reduced.matches;

    const select = (i, focus) => {
      index = (i + tabs.length) % tabs.length;
      tabs.forEach((t, k) => {
        const on = k === index;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        t.style.setProperty('--p', on ? (stopped ? 1 : 0) : 0);
        panels[k].hidden = !on;
        panels[k].classList.toggle('is-active', on);
      });
      if (focus) tabs[index].focus();
      if (matchMedia('(max-width:980px)').matches) tabs[index].scrollIntoView({block:'nearest', inline:'nearest', behavior:'smooth'});
      elapsed = 0; start = performance.now();
      const next = panels[(index + 1) % panels.length].querySelector('img');
      if (next) next.loading = 'eager';
    };
    const tick = now => {
      raf = requestAnimationFrame(tick);
      if (paused || !visible || stopped) { start = now - elapsed; return; }
      elapsed = now - start;
      tabs[index].style.setProperty('--p', Math.min(1, elapsed / DURATION));
      if (elapsed >= DURATION) select(index + 1);
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => { stopped = true; select(i); });
      t.addEventListener('keydown', e => {
        const map = {ArrowRight:1, ArrowDown:1, ArrowLeft:-1, ArrowUp:-1};
        if (e.key in map) { e.preventDefault(); stopped = true; select(index + map[e.key], true); }
        else if (e.key === 'Home') { e.preventDefault(); stopped = true; select(0, true); }
        else if (e.key === 'End') { e.preventDefault(); stopped = true; select(tabs.length - 1, true); }
      });
    });
    const stage = scenes.querySelector('.v-scenes-body');
    stage.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') paused = true; });
    stage.addEventListener('pointerleave', () => { paused = false; });
    stage.addEventListener('focusin', () => { paused = true; });
    stage.addEventListener('focusout', () => { paused = false; });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => { visible = es.some(e => e.isIntersecting); }, {threshold:.35}).observe(stage);
    } else visible = true;
    select(0);
    raf = requestAnimationFrame(tick);
  }

  /* ---------- Finish picker ---------- */
  const finish = document.querySelector('.v-finish');
  if (finish) {
    const obj = document.getElementById('finish-object');
    const status = finish.querySelector('.v-finish-status');
    const buttons = [...finish.querySelectorAll('[data-tone]')];
    let req = 0;
    const src = tone => 'assets/landing/hero-' + tone + '.webp?v=logo-left-1';
    buttons.forEach(b => {
      const warm = () => load(src(b.dataset.tone)).catch(() => {});
      b.addEventListener('pointerenter', warm, {once:true});
      b.addEventListener('focus', warm, {once:true});
      b.addEventListener('click', async () => {
        const r = ++req, tone = b.dataset.tone, name = b.textContent.trim();
        try {
          const img = await load(src(tone));
          if (r !== req) return;
          obj.src = img.src;
          obj.alt = name + ' Rutta Bar with the USB-C plug behind the aluminum shell';
          finish.dataset.finish = tone;
          buttons.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
          status.textContent = '';
        } catch { if (r === req) status.textContent = 'Couldn’t load this finish. Try again.'; }
      });
    });
  }

  /* ---------- Fit: installation sequence ---------- */
  const player = document.querySelector('.fit-player');
  if (player) {
    const frame = document.getElementById('fit-frame');
    const slider = document.getElementById('fit-range');
    const status = document.getElementById('fit-status');
    const play = player.querySelector('.fit-play');
    const last = Number(slider.max);
    const address = i => 'assets/landing/fit-' + String(i).padStart(2, '0') + '.webp?v=logo-left-1';
    let seq = 0, running = false, current = 0, displayReq = 0;
    const display = async i => {
      const r = ++displayReq;
      try {
        const img = await load(address(i));
        if (r !== displayReq) return false;
        frame.src = img.src; current = i;
        slider.value = String(i);
        slider.style.setProperty('--fill', (100 * i / last) + '%');
        const text = i === 0 ? 'Unplugged' : i === last ? 'Connected' : 'Aligning';
        slider.setAttribute('aria-valuetext', text + (i && i < last ? ' · ' + Math.round(100 * i / last) + '%' : ''));
        status.value = text;
        frame.alt = i === last ? 'Silver Rutta Bar seated against the MacBook Air' : 'Rutta Bar aligned with the USB-C port on the side of a MacBook Air';
        return true;
      } catch {
        if (r === displayReq) { slider.value = String(current); status.value = 'Couldn’t load this frame'; }
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
      if (reduced.matches) await display(current === last ? 0 : last);
      else for (let i = from; i <= last && run === seq; i++) {
        if (!await display(i)) break;
        if (i < last) { load(address(i + 1)).catch(() => {}); await new Promise(r => setTimeout(r, 82)); }
      }
      if (run === seq) stop();
    });
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => {
        if (es.some(e => e.isIntersecting)) { [0, 1, last].forEach(i => load(address(i)).catch(() => {})); io.disconnect(); }
      }, {rootMargin:'200px'});
      io.observe(player);
    }
  }
})();
