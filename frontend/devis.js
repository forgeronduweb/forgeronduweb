const API_BASE = '/api';
const TOTAL_STEPS = 4;

const state = { projectType: '', budget: '', timeline: '', description: '', name: '', email: '', phone: '' };
let currentStep = 1;

document.querySelectorAll('.choice-card').forEach(card => {
  card.addEventListener('click', () => {
    const group = card.closest('[data-group]').dataset.group;
    state[group] = card.dataset.value;
    card.closest('.choice-grid').querySelectorAll('.choice-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    setError('');
  });
});

function setError(message) {
  const errorEl = document.getElementById('wizard-error');
  if (errorEl) errorEl.textContent = message;
}

function validateStep(step) {
  if (step === 1) return Boolean(state.projectType) || 'Merci de sélectionner un type de projet.';
  if (step === 2) return Boolean(state.budget) || 'Merci de sélectionner un budget estimé.';
  if (step === 3) {
    state.description = document.getElementById('devis-description').value.trim();
    return Boolean(state.description) || 'Merci de décrire ton projet.';
  }
  if (step === 4) {
    state.name = document.getElementById('devis-name').value.trim();
    state.email = document.getElementById('devis-email').value.trim();
    state.phone = document.getElementById('devis-phone').value.trim();
    if (!state.name || !state.email) return 'Nom et email sont requis.';
    return true;
  }
  return true;
}

function renderStep() {
  document.querySelectorAll('.wizard-panel').forEach(panel => {
    panel.classList.toggle('active', panel.dataset.step === String(currentStep));
  });

  const fill = document.getElementById('wizard-progress-fill');
  if (fill) fill.style.width = `${(currentStep / TOTAL_STEPS) * 100}%`;

  const label = document.getElementById('wizard-step-label');
  if (label) label.textContent = `Étape ${currentStep} sur ${TOTAL_STEPS}`;

  const prevBtn = document.getElementById('wizard-prev');
  if (prevBtn) prevBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';

  const nextBtn = document.getElementById('wizard-next');
  if (nextBtn) {
    nextBtn.innerHTML = currentStep === TOTAL_STEPS
      ? 'Envoyer la demande <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'
      : 'Suivant <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
  }

  setError('');
}

function prevStep() {
  if (currentStep === 1) return;
  currentStep -= 1;
  renderStep();
}

async function nextStep() {
  const result = validateStep(currentStep);
  if (result !== true) {
    setError(result);
    return;
  }

  if (currentStep === TOTAL_STEPS) {
    await submitQuote();
    return;
  }

  currentStep += 1;
  renderStep();
}

async function submitQuote() {
  const nextBtn = document.getElementById('wizard-next');
  const prevBtn = document.getElementById('wizard-prev');
  nextBtn.disabled = true;
  nextBtn.textContent = 'Envoi en cours...';
  if (prevBtn) prevBtn.style.visibility = 'hidden';

  const formData = new FormData();
  formData.append('name', state.name);
  formData.append('email', state.email);
  formData.append('phone', state.phone);
  formData.append('projectType', state.projectType);
  formData.append('budget', state.budget);
  formData.append('description', `${state.description}${state.timeline ? `\n\nDélai souhaité : ${state.timeline}` : ''}`);

  const file = document.getElementById('devis-file')?.files[0];
  if (file) formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE}/quotes`, { method: 'POST', body: formData });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Erreur');

    setError('');
    document.getElementById('wizard-nav').style.display = 'none';
    document.querySelectorAll('.wizard-panel').forEach(panel => {
      panel.classList.toggle('active', panel.dataset.step === 'success');
    });
    document.getElementById('wizard-progress-fill').style.width = '100%';
    document.getElementById('wizard-step-label').textContent = 'Terminé';
  } catch (error) {
    setError(error.message || 'Échec de l\'envoi, réessaie dans un instant.');
    nextBtn.disabled = false;
    renderStep();
  }
}

document.getElementById('devis-form')?.addEventListener('submit', (e) => e.preventDefault());

renderStep();
