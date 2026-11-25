(() => {
  const section = document.getElementById("explore");
  if (!section) return;

  const canvas = section.querySelector("canvas");
  const still = section.querySelector(".rb-explore-still");
  const parts = [...section.querySelectorAll("[data-rb-part]")];
  const caption = section.querySelector(".rb-explore-caption");
  const reset = section.querySelector(".rb-explore-reset");
  const ring = section.querySelector(".rb-explore-focus");
  const views = {
    home: {
      angle: -0.50, pitch: 0.51, magnification: 1.35, target: [-2.2, 13, 0],
      text: "Rutta Bar in silver", photo: "hero-silver.webp",
      alt: "Rutta Bar in silver, seen from above"
    },
    ports: {
      angle: -0.62, pitch: 0.28, magnification: 1.87, target: [-5.45, 3.65, 0],
      text: "Two openings face the room. Another pair sits at the short end, toward the palm rest.",
      photo: "explore-ports.webp", alt: "Two round acoustic openings on the outside face and a second pair on the short end"
    },
    plug: {
      angle: 2.84, pitch: 0.36, magnification: 1.70, target: [6.50, 20, 0],
      text: "The USB-C plug draws power from your Mac and carries audio back through the same connection.",
      photo: "explore-plug.webp", alt: "The reversible USB-C plug on the rear of the aluminum body"
    },
    mute: {
      angle: -0.16, pitch: 0.19, magnification: 2.08, target: [-5.5, 20, 0],
      text: "Slide the switch to mute. An orange mark appears in the track so you can see its position.",
      photo: "explore-mute.webp?v=top-only-2", alt: "The mute switch at its left stop with an orange marker in the track"
    }
  };
  let selected = "home";
  let viewer;
  let loading;
  let ringTimer;

  function hideRing() {
    clearTimeout(ringTimer);
    ring.hidden = true;
  }
  function show(name) {
    selected = name;
    const view = views[name];
    section.dataset.detail = name;
    caption.textContent = view.text;
    for (const control of parts) {
      control.setAttribute("aria-pressed", String(control.dataset.rbPart === name));
    }
    reset.hidden = name === "home";
    if (!viewer) still.src = "assets/landing/" + view.photo;
    still.alt = view.alt;
    hideRing();
    if (viewer) {
      viewer.setCamera(view);
      viewer.setMuted(name === "mute");
      // A steady input indication keeps an idle inline model inexpensive to display.
      if (name !== "mute") viewer.setActivity(true);
      if (name === "mute" || name === "ports") {
        ringTimer = setTimeout(() => { ring.hidden = false; },
          matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 550);
      }
    }
  }
  function markManual() {
    hideRing();
    reset.hidden = false;
  }
  function useStills() {
    viewer?.dispose();
    viewer = null;
    canvas.tabIndex = -1;
    section.dataset["3d"] = "still";
    section.querySelector(".rb-explore-intro").textContent = "Choose a detail to see how Rutta Bar fits together.";
    show(selected);
  }
  function enhance() {
    if (loading) return loading;
    const scriptReady = window.RuttaViewer ? Promise.resolve() : new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "assets/landing/explore-viewer.js?v=top-only-2";
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
    loading = scriptReady.then(() => {
      viewer = window.RuttaViewer.mount(canvas, { transparent: true, inline: true });
      section.dataset["3d"] = "ready";
      canvas.tabIndex = 0;
      show(selected);
    }).catch(useStills);
    return loading;
  }
  for (const control of parts) control.addEventListener("click", () => {
    show(control.dataset.rbPart);
    enhance();
  });
  reset.addEventListener("click", () => show("home"));
  canvas.addEventListener("pointermove", e => { if (e.buttons) markManual(); });
  canvas.addEventListener("keydown", e => {
    if (e.key === "Home") {
      e.preventDefault();
      e.stopImmediatePropagation();
      show("home");
    }
    else if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","+","=","-"].includes(e.key)) markManual();
  }, true);
  canvas.addEventListener("ruttaviewererror", useStills);
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        enhance();
      }
    }, { rootMargin: "320px" });
    observer.observe(section);
  } else enhance();
})();
