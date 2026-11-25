(() => {
  const hero = document.querySelector('.hero');
  const scene = hero.querySelector('.hero-scene');
  const object = document.getElementById('hero-object');
  const label = hero.querySelector('.finish-label');
  const finishes = [...hero.querySelectorAll('[data-tone]')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const studioCache = new Map();
  let selection = 0;

  function loadImage(cache, address) {
    if (cache.has(address)) return cache.get(address);
    const image = new Image();
    image.src = address;
    const ready = image.decode().then(() => image).catch(error => {
      cache.delete(address);
      throw error;
    });
    cache.set(address, ready);
    return ready;
  }
  function finishImage(key) {
    return 'assets/landing/hero-' + key + '.webp?v=logo-left-1';
  }
  finishes.forEach(button => {
    const prepare = () => loadImage(studioCache, finishImage(button.dataset.tone)).catch(() => {});
    button.addEventListener('pointerenter', prepare, {once:true});
    button.addEventListener('focus', prepare, {once:true});
    button.addEventListener('click', async () => {
      const request = ++selection;
      const tone = button.dataset.tone;
      const name = button.getAttribute('aria-label');
      try {
        const photo = await loadImage(studioCache, finishImage(tone));
        if (request !== selection) return;
        object.src = photo.src;
        object.alt = name + ' Rutta Bar with the USB-C plug behind the aluminum shell';
        hero.dataset.finish = tone;
        for (const item of finishes) item.setAttribute('aria-pressed', String(item === button));
        label.textContent = name;
      } catch {
        if (request === selection) label.textContent = 'Couldn’t load this finish. Try again.';
      }
    });
  });
  scene.addEventListener('pointermove', event => {
    if (reducedMotion.matches || event.pointerType !== 'mouse') return;
    const box = scene.getBoundingClientRect();
    scene.style.setProperty('--mx', (11 * ((event.clientX-box.left)/box.width-.5)) + 'px');
    scene.style.setProperty('--my', (10 * ((event.clientY-box.top)/box.height-.5)) + 'px');
  });
  scene.addEventListener('pointerleave', () => {
    scene.style.removeProperty('--mx');
    scene.style.removeProperty('--my');
  });

  const player = document.querySelector('.fit-player');
  const frame = document.getElementById('fit-frame');
  const slider = document.getElementById('fit-range');
  const status = document.getElementById('fit-status');
  const play = player.querySelector('.fit-play');
  const frames = new Map();
  const last = Number(slider.max);
  let sequence = 0;
  let running = false;
  let current = 0;
  let displayRequest = 0;

  function address(index) {
    return 'assets/landing/fit-' + String(index).padStart(2, '0') + '.webp?v=logo-left-1';
  }
  async function display(index) {
    const request = ++displayRequest;
    try {
      const photo = await loadImage(frames, address(index));
      if (request !== displayRequest) return false;
      frame.src = photo.src;
      current = index;
      slider.value = String(index);
      slider.style.setProperty('--fill', (100 * index / last) + '%');
      const text = index === 0 ? 'Unplugged' : index === last ? 'Connected' : 'Aligning';
      slider.setAttribute('aria-valuetext', text + (index && index < last ? ' · ' + Math.round(100 * index / last) + '%' : ''));
      status.value = text;
      frame.alt = index === last ? 'Silver Rutta Bar seated against the MacBook Air' : 'Rutta Bar aligned with the USB-C port on the side of a MacBook Air';
      return true;
    } catch {
      if (request === displayRequest) {
        slider.value = String(current);
        status.value = 'Couldn’t load this frame. Try again.';
      }
      return false;
    }
  }
  function stop() {
    ++sequence;
    running = false;
    play.setAttribute('aria-label', current === last ? 'Replay installation' : 'Play installation');
    play.firstElementChild.textContent = current === last ? '↺' : '▶';
  }
  slider.addEventListener('input', () => {
    stop();
    display(Number(slider.value)).then(applied => { if (applied && !running) stop(); });
  });
  play.addEventListener('click', async () => {
    if (running) { stop(); return; }
    running = true;
    const run = ++sequence;
    play.setAttribute('aria-label', 'Pause installation');
    play.firstElementChild.textContent = 'Ⅱ';
    const start = current >= last ? 0 : current;
    if (reducedMotion.matches) {
      await display(current === last ? 0 : last);
    } else {
      // Load the next frame during the hold to keep playback responsive on slower connections.
      for (let index = start; index <= last && run === sequence; index++) {
        if (!await display(index)) break;
        if (index < last) {
          loadImage(frames, address(index + 1)).catch(() => {});
          await new Promise(resolve => setTimeout(resolve, 82));
        }
      }
    }
    if (run === sequence) stop();
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        // A small head start without competing with the first screen for bandwidth.
        for (const index of [0, 1, last]) loadImage(frames, address(index)).catch(() => {});
        observer.disconnect();
      }
    }, {rootMargin:'120px'});
    observer.observe(player);
  }
})();
