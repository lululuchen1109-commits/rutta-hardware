(() => {
  const form = document.querySelector('[data-research-form]');
  if (!form) return;
  const choices = [...form.querySelectorAll('[data-use-case]')];
  const useCase = form.elements.useCase;
  const email = form.elements.email;
  const note = form.querySelector('[data-research-note]');

  function setNote(message, tone) {
    note.textContent = message;
    if (tone) note.dataset.tone = tone;
    else delete note.dataset.tone;
  }

  choices.forEach(choice => choice.addEventListener('click', () => {
    choices.forEach(button => button.setAttribute('aria-pressed', String(button === choice)));
    useCase.value = choice.dataset.useCase;
    setNote('Concept research · 2 minutes · No purchase required.');
  }));

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!useCase.value) {
      setNote('Choose the setup that sounds most like yours.', 'error');
      choices[0].focus();
      return;
    }
    if (!email.checkValidity()) {
      setNote('Enter a valid email address so we know where to follow up.', 'error');
      email.focus();
      return;
    }
    const response = {
      email: email.value.trim(),
      useCase: useCase.value,
      prototype: form.elements.prototype.checked,
      savedAt: new Date().toISOString()
    };
    try { localStorage.setItem('rutta-research-lead-v1', JSON.stringify(response)); } catch {}
    setNote('Thanks. This concept page saved your response in this browser. Connect a form endpoint before collecting live responses.', 'success');
    form.reset();
    choices.forEach(button => button.setAttribute('aria-pressed', 'false'));
  });
})();
