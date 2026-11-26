(() => {
  const hardware = document.querySelector('.lk-hardware');
  if (!hardware) return;
  const tabs = [...hardware.querySelectorAll('.lk-hw-tabs a')];
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  const slider = hardware.querySelector('#fit-range');
  const frame = hardware.querySelector('#fit-frame');
  const play = hardware.querySelector('.fit-play');
  const output = hardware.querySelector('#fit-status');
  let run = 0;
  let running = false;

  function stopFit() {
    run++;
    running = false;
    play.textContent = Number(slider.value) === 15 ? '↺' : '▶';
    play.setAttribute('aria-label', Number(slider.value) === 15 ? 'Replay installation' : 'Play installation');
  }
  function displayPanel(id) {
    panels.forEach((panel,i) => {
      const active = panel.id === id;
      panel.hidden = !active;
      tabs[i].tabIndex = active ? 0 : -1;
      tabs[i].setAttribute('aria-selected', String(active));
    });
    if (id !== 'fit') stopFit();
  }
  function handleAnchor(shouldScroll) {
    const id = location.hash.slice(1);
    if (panels.some(panel => panel.id === id)) {
      displayPanel(id);
      if (shouldScroll) hardware.querySelector('.lk-hw-workbench').scrollIntoView({block:'start',behavior:'instant'});
    } else if (id === 'specs') {
      hardware.querySelector('#specs').open = true;
    }
  }
  displayPanel('finish');
  handleAnchor(false);
  window.addEventListener('hashchange', () => handleAnchor(true));
  tabs.forEach((tab,i) => {
    tab.addEventListener('click', event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      event.preventDefault();
      const id = panels[i].id;
      displayPanel(id);
      history.replaceState(history.state, '', '#' + id);
    });
    tab.addEventListener('keydown', event => {
      const keys = {ArrowLeft:(i+tabs.length-1)%tabs.length,ArrowRight:(i+1)%tabs.length,Home:0,End:tabs.length-1};
      if (!(event.key in keys)) return;
      event.preventDefault();
      const next = tabs[keys[event.key]];
      next.click();
      next.focus();
    });
  });

  const finishes = [...hardware.querySelectorAll('[data-tone]')];
  const photo = hardware.querySelector('#lk-finish-image');
  const label = hardware.querySelector('#lk-finish-name');
  const loaded = new Map();
  function preload(url) {
    if (!loaded.has(url)) {
      const img = new Image();
      img.src = url;
      loaded.set(url, img.decode().then(() => url).catch(error => { loaded.delete(url); throw error; }));
    }
    return loaded.get(url);
  }
  let change = 0;
  finishes.forEach(button => {
    const color = button.dataset.tone;
    const url = 'assets/landing/hero-' + color + '.webp?v=studio-v7';
    button.addEventListener('pointerenter', () => preload(url).catch(() => {}), {once:true});
    button.addEventListener('click', async () => {
      const request = ++change;
      try {
        await preload(url);
        if (request !== change) return;
        photo.src = url;
        const name = button.getAttribute('aria-label');
        photo.alt = name + ' Rutta Bar, viewed from its outer face.';
        label.textContent = name;
        hardware.querySelector('#finish').dataset.finish = color;
        finishes.forEach(item => item.setAttribute('aria-pressed',String(item === button)));
      } catch {
        if (request === change) label.textContent = 'Finish unavailable. Try again.';
      }
    });
  });

  let sequence = 0;
  let shown = 0;
  async function fitTo(n) {
    const request = ++sequence;
    const url = 'assets/landing/fit-' + String(n).padStart(2, '0') + '.webp?v=studio-v7';
    try {
      await preload(url);
      if (request !== sequence) return false;
      shown = n;
      frame.src = url;
      const state = n === 0 ? 'Unplugged' : n === 15 ? 'Connected' : 'Aligning';
      slider.value = String(n);
      slider.setAttribute('aria-valuetext', state);
      output.value = state;
      frame.alt = state === 'Connected' ? 'Rutta Bar seated against the side of the MacBook Air.' : 'The Rutta Bar USB-C plug aligns with the MacBook Air.';
      return true;
    } catch {
      if (request === sequence) {slider.value = String(shown); output.value = 'Try again';}
      return false;
    }
  }
  slider.addEventListener('input', () => {stopFit(); fitTo(Number(slider.value));});
  play.addEventListener('click', async () => {
    if (running) {stopFit(); return;}
    const token = ++run;
    running = true;
    play.textContent = 'Ⅱ';
    play.setAttribute('aria-label', 'Pause installation');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      await fitTo(shown === 15 ? 0 : 15);
    } else {
      for (let n=shown === 15 ? 0 : shown; n <= 15 && token === run; n++) {
        if (!(await fitTo(n))) break;
        await new Promise(resolve => setTimeout(resolve,80));
      }
    }
    if (token === run) stopFit();
  });

  const film = hardware.querySelector('#unboxing-film');
  const sourceError = hardware.querySelector('.unboxing-error');
  const onMediaError = () => {sourceError.hidden = false;};
  film.addEventListener('error', onMediaError);
  film.querySelector('source').addEventListener('error', onMediaError);
})();
