(() => {
  const film = document.getElementById('unboxing-film');
  const entry = document.querySelector('.film-link');
  const errorMessage = document.querySelector('.unboxing-error');
  const showError = () => { errorMessage.hidden = false; };

  entry.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if (film.ended) film.currentTime = 0;
    film.play().catch(() => {
      if (film.error) showError();
    });
  });
  film.addEventListener('error', showError);
  film.querySelector('source').addEventListener('error', showError);
})();
