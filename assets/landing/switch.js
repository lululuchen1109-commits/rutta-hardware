(() => {
  const section = document.getElementById("switch");
  if (!section) return;

  const photo = section.querySelector(".rb-switch-still");
  const handle = section.querySelector(".rb-switch-handle");
  const callout = handle.querySelector(".rb-switch-callout span");
  const reading = section.querySelector(".rb-switch-reading");
  const choices = [...section.querySelectorAll("[data-mode]")];
  const messages = {
    ready: "The light on top breathes green while the microphone is ready.",
    input: "The light stays amber while audio is being sent to your Mac.",
    mute: "The top light goes out. An orange marker in the switch track shows the microphone is muted."
  };
  const source = mode => "assets/landing/switch-photo-" + mode + ".webp?v=scale32-1";
  let beforeMute = "ready";
  const shot = section.querySelector(".rb-switch-shot");
  const mechanism = document.createElement("span");
  mechanism.className = "rb-switch-mechanism";
  mechanism.setAttribute("aria-hidden", "true");
  ["track", "knob"].forEach(part => {
    const image = new Image();
    image.alt = "";
    image.src = "assets/landing/switch-" + part + ".webp";
    image.className = "rb-switch-" + part;
    mechanism.append(image);
  });
  shot.insertBefore(mechanism, handle);
  let drag;
  let suppressClick = false;

  function setMode(mode) {
    if (mode !== "mute") beforeMute = mode;
    if (section.dataset.state === mode) return;
    section.dataset.state = mode;
    photo.src = source(mode);
    const muted = mode === "mute";
    handle.setAttribute("aria-checked", String(muted));
    callout.textContent = muted ? "Slide to unmute" : "Slide to mute";
    reading.textContent = messages[mode];
    choices.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.mode === mode)));
  }

  choices.forEach(button => button.addEventListener("click", () => setMode(button.dataset.mode)));
  handle.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      setMode(event.key === "ArrowLeft" ? "mute" : beforeMute);
    }
  });
  handle.addEventListener("click", event => {
    if (event.detail && suppressClick) return;
    setMode(section.dataset.state === "mute" ? beforeMute : "mute");
  });
  handle.addEventListener("pointerdown", event => {
    if (event.button !== 0 || !event.isPrimary) return;
    suppressClick = false;
    drag = {
      id: event.pointerId, start: event.clientX,
      initial: section.dataset.state === "mute" ? 0 : 1
    };
    handle.setPointerCapture(event.pointerId);
  });
  handle.addEventListener("pointermove", event => {
    if (drag?.id !== event.pointerId) return;
    const distance = event.clientX - drag.start;
    if (!suppressClick && Math.abs(distance) < 4) return;
    const travel = Math.max(18, shot.offsetWidth * 0.040033);
    const fraction = Math.max(0, Math.min(1, drag.initial + distance / travel));
    shot.dataset.dragging = "true";
    shot.style.setProperty("--sw-travel", fraction);
    suppressClick = true;
    setMode(fraction < .5 ? "mute" : beforeMute);
  });
  handle.addEventListener("lostpointercapture", () => {
    delete shot.dataset.dragging;
    drag = null;
  });

  function warmPhotos() {
    for (const mode of ["input", "mute"]) {
      const image = new Image();
      image.src = source(mode);
    }
  }
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      warmPhotos();
      observer.disconnect();
    }, {rootMargin: "250px"});
    observer.observe(section);
  } else warmPhotos();
})();
