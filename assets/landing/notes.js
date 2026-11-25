(() => {
  const section = document.getElementById("notes");
  if (!section) return;
  const tabs = Array.from(section.querySelectorAll('[role="tab"]'));
  const pages = Array.from(section.querySelectorAll('[role="tabpanel"]'));

  function select(index) {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      pages[i].hidden = !active;
      pages[i].classList.toggle("is-current", active);
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(index));
    tab.addEventListener("keydown", event => {
      let next;
      if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
      else return;
      event.preventDefault();
      select(next);
      tabs[next].focus();
    });
  });
})();
