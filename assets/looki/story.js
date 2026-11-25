(() => {
  const story = document.querySelector('#story');
  if (!story) return;
  const tabs = [...story.querySelectorAll('[role="tab"]')];
  const review = story.querySelector('.lk-story-review');
  function selectTab(selected) {
    tabs.forEach(tab => {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      const next = {
        ArrowRight: (index + 1) % tabs.length,
        ArrowLeft: (index + tabs.length - 1) % tabs.length,
        Home: 0,
        End: tabs.length - 1,
      }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      selectTab(tabs[next]);
      tabs[next].focus();
    });
  });
  review.addEventListener('click', () => {
    const confirmed = review.getAttribute('aria-pressed') === 'false';
    review.setAttribute('aria-pressed', String(confirmed));
    review.textContent = confirmed ? 'Note confirmed ✓' : 'Confirm note';
  });
})();
