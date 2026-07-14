const API_BASE = '/api';

// ═══════════════ NAVIGATION ═══════════════

function openMobileMenu() {
  document.getElementById('mobileMenu')?.classList.add('open');
  document.getElementById('mobileMenuOverlay')?.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  document.getElementById('mobileMenu')?.classList.remove('open');
  document.getElementById('mobileMenuOverlay')?.classList.remove('visible');
  document.body.style.overflow = '';
}

const menuToggle = document.getElementById('menuToggle');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

menuToggle?.addEventListener('click', () => {
  document.getElementById('mobileMenu')?.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
});
mobileMenuOverlay?.addEventListener('click', closeMobileMenu);

document.querySelectorAll('.nav-link[data-section], .mobile-link[data-section], .logo-mark').forEach(link => {
  link.addEventListener('click', () => {
    closeMobileMenu();
    if (document.body.classList.contains('viewing-article')) hideArticle();
    if (document.body.classList.contains('viewing-project')) hideProject();
  });
});

function setActiveNav(name) {
  document.querySelectorAll('.nav-link[data-section], .mobile-link[data-section]').forEach(link => {
    link.classList.toggle('active', link.dataset.section === name);
  });
}

const scrollSpySections = ['home', 'about', 'projects', 'blog', 'contact'];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActiveNav(entry.target.id);
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

scrollSpySections.forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

function showArticle(id) {
  if (document.body.classList.contains('viewing-project')) hideProject();
  document.getElementById('blog-list').style.display = 'none';
  document.querySelectorAll('.article-view').forEach(a => a.classList.remove('active'));
  document.getElementById('article-' + id)?.classList.add('active');
  document.body.classList.add('viewing-article');
  window.scrollTo(0, 0);
  history.replaceState(null, '', '#article-' + id);
  loadComments(id);
}

function hideArticle() {
  document.querySelectorAll('.article-view').forEach(a => a.classList.remove('active'));
  document.getElementById('blog-list').style.display = '';
  document.body.classList.remove('viewing-article');
  if (location.hash.startsWith('#article-')) {
    history.replaceState(null, '', location.pathname + location.search);
  }
}

function openArticleFromHash() {
  const hash = location.hash;
  if (!hash.startsWith('#article-')) return;
  const id = hash.slice('#article-'.length);
  if (document.getElementById('article-' + id)) {
    showArticle(id);
  }
}

function showProject(id) {
  if (document.body.classList.contains('viewing-article')) hideArticle();
  document.querySelector('.projects-grid').style.display = 'none';
  document.querySelector('.projects-filters').style.display = 'none';
  document.querySelectorAll('.project-view').forEach(p => p.classList.remove('active'));
  document.getElementById('project-' + id)?.classList.add('active');
  document.body.classList.add('viewing-project');
  window.scrollTo(0, 0);
  history.replaceState(null, '', '#projet-' + id);
}

function hideProject() {
  document.querySelectorAll('.project-view').forEach(p => p.classList.remove('active'));
  document.querySelector('.projects-grid').style.display = '';
  document.querySelector('.projects-filters').style.display = '';
  document.body.classList.remove('viewing-project');
  if (location.hash.startsWith('#projet-')) {
    history.replaceState(null, '', location.pathname + location.search);
  }
}

function openProjectFromHash() {
  const hash = location.hash;
  if (!hash.startsWith('#projet-')) return;
  const id = hash.slice('#projet-'.length);
  if (document.getElementById('project-' + id)) {
    showProject(id);
  }
}

function prefillContactForm(subject, message) {
  const subjectInput = document.querySelector('#contact-form input[name="subject"]');
  const messageInput = document.querySelector('#contact-form textarea[name="message"]');
  if (subjectInput) subjectInput.value = subject;
  if (messageInput) messageInput.value = message;
}

function toggleBuyForm(id) {
  const form = document.getElementById(`buy-form-${id}`);
  if (form) form.style.display = form.style.display === 'none' ? 'flex' : 'none';
}

function toggleFreeForm(id) {
  const form = document.getElementById(`free-form-${id}`);
  if (form) form.style.display = form.style.display === 'none' ? 'flex' : 'none';
}

// Le fichier gratuit n'est jamais exposé publiquement (voir /api/portfolio) : on ne récupère
// le vrai lien qu'après avoir enregistré l'email, pour se constituer une base d'utilisateurs.
async function submitFreeDownload(id) {
  const project = (window.portfolioProjectsById || {})[id];
  if (!project) return;

  const feedback = document.getElementById(`free-feedback-${id}`);
  const name = document.getElementById(`free-name-${id}`)?.value.trim() || '';
  const email = document.getElementById(`free-email-${id}`)?.value.trim() || '';

  if (!email) {
    if (feedback) { feedback.textContent = 'Email requis.'; feedback.style.color = '#ef4444'; }
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/subscribers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: id, email, name })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Erreur');

    if (feedback) {
      feedback.textContent = 'Merci ! Ton téléchargement démarre...';
      feedback.style.color = '#22c55e';
    }
    const link = document.createElement('a');
    link.href = result.downloadUrl;
    link.download = result.downloadFileName || project.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    if (feedback) {
      feedback.textContent = error.message || 'Échec de l\'envoi.';
      feedback.style.color = '#ef4444';
    }
  }
}

function toggleProofMethod(id) {
  const method = document.querySelector(`input[name="proof-method-${id}"]:checked`)?.value || 'transaction';
  const transactionFields = document.getElementById(`buy-transaction-fields-${id}`);
  const receiptFields = document.getElementById(`buy-receipt-fields-${id}`);
  if (transactionFields) transactionFields.style.display = method === 'transaction' ? '' : 'none';
  if (receiptFields) receiptFields.style.display = method === 'receipt' ? '' : 'none';
}

// La commande n'est créée qu'une fois la preuve de paiement fournie (numéro Wave + ID de
// transaction, ou reçu PDF), pour donner à l'admin de quoi vérifier avant de livrer le fichier.
async function submitOrder(id) {
  const project = (window.portfolioProjectsById || {})[id];
  if (!project) return;

  const feedback = document.getElementById(`buy-feedback-${id}`);
  const buyerName = document.getElementById(`buy-name-${id}`)?.value.trim() || '';
  const buyerEmail = document.getElementById(`buy-email-${id}`)?.value.trim() || '';
  const proofMethod = document.querySelector(`input[name="proof-method-${id}"]:checked`)?.value || 'transaction';

  if (!buyerName || !buyerEmail) {
    if (feedback) { feedback.textContent = 'Nom et email sont requis.'; feedback.style.color = '#ef4444'; }
    return;
  }

  const formData = new FormData();
  formData.append('projectId', id);
  formData.append('buyerName', buyerName);
  formData.append('buyerEmail', buyerEmail);
  formData.append('proofMethod', proofMethod);

  if (proofMethod === 'receipt') {
    const file = document.getElementById(`buy-receipt-file-${id}`)?.files[0];
    if (!file) {
      if (feedback) { feedback.textContent = 'Merci de joindre le reçu PDF.'; feedback.style.color = '#ef4444'; }
      return;
    }
    formData.append('receipt', file);
  } else {
    const waveNumber = document.getElementById(`buy-wave-number-${id}`)?.value.trim() || '';
    const transactionId = document.getElementById(`buy-transaction-id-${id}`)?.value.trim() || '';
    if (!waveNumber || !transactionId) {
      if (feedback) { feedback.textContent = 'Numéro Wave et ID de transaction sont requis.'; feedback.style.color = '#ef4444'; }
      return;
    }
    formData.append('waveNumber', waveNumber);
    formData.append('transactionId', transactionId);
  }

  try {
    const response = await fetch(`${API_BASE}/orders`, { method: 'POST', body: formData });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Erreur');

    if (feedback) {
      feedback.textContent = 'Merci ! Ta preuve a bien été envoyée, tu recevras ton lien de téléchargement après vérification.';
      feedback.style.color = '#22c55e';
    }
  } catch (error) {
    if (feedback) {
      feedback.textContent = error.message || 'Échec de l\'envoi.';
      feedback.style.color = '#ef4444';
    }
  }
}

function requestFreeFile(id) {
  const project = (window.portfolioProjectsById || {})[id];
  if (!project) return;
  hideProject();
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  prefillContactForm(
    `Téléchargement du projet "${project.name}"`,
    `Bonjour, je suis intéressé(e) par le projet "${project.name}" (gratuit). Peux-tu me l'envoyer ?`
  );
}

let projectFilter = 'all';

function applyProjectFilter() {
  document.querySelectorAll('.project-card').forEach(card => {
    const matches = projectFilter === 'all' || card.dataset.category === projectFilter;
    card.style.display = matches ? '' : 'none';
  });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    projectFilter = btn.dataset.category || 'all';
    applyProjectFilter();
  });
});

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function safeHref(url) {
  const value = String(url ?? '').trim();
  return /^https?:\/\//i.test(value) ? value : '';
}

function estimateReadingTime(content) {
  const words = String(content ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function getSuggestedArticles(current, articles, limit = 4) {
  const others = articles.filter(a => a.id !== current.id);
  const sameCategory = others.filter(a => a.category === current.category);
  const rest = others.filter(a => a.category !== current.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

function buildSocialEntry(kind, rawValue) {
  const configs = {
    instagram: { iconClass: 'fa-brands fa-instagram', label: 'Instagram', base: 'https://instagram.com/' },
    linkedin: { iconClass: 'fa-brands fa-linkedin', label: 'LinkedIn', base: 'https://www.linkedin.com/in/' },
    github: { iconClass: 'fa-brands fa-github', label: 'GitHub', base: 'https://github.com/' },
    website: { iconClass: 'fa-solid fa-globe', label: 'Site web', base: '' }
  };
  const cfg = configs[kind];
  const value = String(rawValue ?? '').trim();
  if (!value) return null;

  let href, handle;
  if (/^https?:\/\//i.test(value)) {
    href = value;
    handle = value.replace(/^https?:\/\//i, '').replace(/\/$/, '').split('/').pop() || value;
  } else if (cfg.base) {
    handle = value.replace(/^@/, '');
    href = cfg.base + handle;
  } else {
    handle = value;
    href = `https://${value}`;
  }

  return { iconClass: cfg.iconClass, label: cfg.label, handle: kind === 'website' ? handle : '@' + handle, href };
}

function renderInlineMarkdown(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

function renderCodeBlock(lang, code) {
  const language = String(lang ?? '').trim().toLowerCase();
  const label = language || 'code';
  const hljsClass = language ? ` language-${escapeHtml(language)}` : '';
  return `<div class="article-code-terminal">
    <div class="terminal-bar">
      <div class="dot r"></div>
      <div class="dot y"></div>
      <div class="dot g"></div>
      <div class="terminal-title">${escapeHtml(label)}</div>
    </div>
    <pre class="article-code-body"><code class="hljs${hljsClass}">${escapeHtml(code)}</code></pre>
  </div>`;
}

function renderTextChunk(text) {
  const lines = text.split('\n');
  const blocks = [];
  let paragraph = [];

  function flushParagraph() {
    if (paragraph.length) {
      blocks.push(`<p>${renderInlineMarkdown(paragraph.join('\n')).replace(/\n/g, '<br>')}</p>`);
      paragraph = [];
    }
  }

  lines.forEach(line => {
    const trimmed = line.trim();
    if (/^##\s+/.test(trimmed)) {
      flushParagraph();
      blocks.push(`<h2>${renderInlineMarkdown(trimmed.replace(/^##\s+/, ''))}</h2>`);
    } else if (/^#\s+/.test(trimmed)) {
      flushParagraph();
      blocks.push(`<h1>${renderInlineMarkdown(trimmed.replace(/^#\s+/, ''))}</h1>`);
    } else if (trimmed === '') {
      flushParagraph();
    } else {
      paragraph.push(line);
    }
  });
  flushParagraph();
  return blocks.join('');
}

function renderArticleContent(content) {
  const text = String(content ?? '');
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  const blocks = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    const [full, lang, code] = match;
    blocks.push(renderTextChunk(text.slice(lastIndex, match.index)));
    blocks.push(renderCodeBlock(lang, code.replace(/\n$/, '')));
    lastIndex = match.index + full.length;
  }
  blocks.push(renderTextChunk(text.slice(lastIndex)));

  const joined = blocks.join('');
  return joined.trim() ? joined : '<p>Cet article n\'a pas encore de contenu.</p>';
}

function getLikedArticles() {
  try {
    return JSON.parse(localStorage.getItem('likedArticles') || '[]');
  } catch {
    return [];
  }
}

function setLikedArticles(list) {
  localStorage.setItem('likedArticles', JSON.stringify(list));
}

async function toggleLike(id) {
  const liked = getLikedArticles();
  const isLiked = liked.includes(id);
  const btn = document.getElementById('like-btn-' + id);
  const countEl = document.getElementById('like-count-' + id);

  try {
    const response = await fetch(`${API_BASE}/articles/${id}/like`, { method: isLiked ? 'DELETE' : 'POST' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Erreur');

    if (countEl) countEl.textContent = result.likes;
    if (isLiked) {
      setLikedArticles(liked.filter(x => x !== id));
      btn?.classList.remove('liked');
    } else {
      setLikedArticles([...liked, id]);
      btn?.classList.add('liked');
    }
  } catch (error) {
    console.error('Erreur like', error);
  }
}

async function shareArticle(id) {
  const url = `${location.origin}${location.pathname}#article-${id}`;
  const countEl = document.getElementById('share-count-' + id);
  const feedback = document.getElementById('share-feedback-' + id);

  // navigator.share() ouvre la fenêtre de partage native de l'OS et ne se résout que si
  // l'utilisateur choisit effectivement une app pour partager (il rejette si annulé) — c'est
  // le signal le plus fiable qu'on puisse obtenir côté navigateur, donc on ne compte QUE ce cas.
  // La copie presse-papier (fallback desktop) n'est pas comptée : copier un lien ne veut pas
  // dire qu'il a été partagé quelque part.
  if (navigator.share) {
    try {
      await navigator.share({ url });
    } catch (error) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/articles/${id}/share`, { method: 'POST' });
      const result = await response.json();
      if (response.ok && countEl) countEl.textContent = result.shares;
    } catch (error) {
      console.error('Erreur partage', error);
    }
    return;
  }

  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(url);
      if (feedback) {
        feedback.textContent = 'Lien copié !';
        setTimeout(() => { feedback.textContent = ''; }, 2500);
      }
    } catch (error) {
      console.error('Erreur copie du lien', error);
    }
  }
}

async function loadComments(id) {
  const container = document.getElementById('comments-list-' + id);
  if (!container) return;
  container.innerHTML = '<p class="comments-empty">Chargement...</p>';

  try {
    const response = await fetch(`${API_BASE}/articles/${id}/comments`);
    const data = await response.json();
    const comments = data.comments || [];

    if (!comments.length) {
      container.innerHTML = '<p class="comments-empty">Aucun commentaire pour le moment.</p>';
      return;
    }

    container.innerHTML = comments.map(c => `
      <div class="comment-item">
        <div class="comment-author">${escapeHtml(c.name)}</div>
        <div class="comment-message">${escapeHtml(c.message)}</div>
      </div>`).join('');
  } catch (error) {
    container.innerHTML = '<p class="comments-empty">Impossible de charger les commentaires.</p>';
  }
}

async function submitComment(event, id) {
  event.preventDefault();
  const nameInput = document.getElementById('comment-name-' + id);
  const messageInput = document.getElementById('comment-message-' + id);
  const feedback = document.getElementById('comment-feedback-' + id);
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();
  if (!name || !message) return false;

  try {
    const response = await fetch(`${API_BASE}/articles/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Erreur');

    if (feedback) {
      feedback.textContent = 'Merci ! Ton commentaire est en attente de validation.';
      feedback.style.color = '#22c55e';
    }
    nameInput.value = '';
    messageInput.value = '';
  } catch (error) {
    if (feedback) {
      feedback.textContent = 'Échec de l\'envoi du commentaire.';
      feedback.style.color = '#ef4444';
    }
  }
  return false;
}

async function loadPortfolioData({ silent = false } = {}) {
  const statusEl = document.getElementById('api-status');
  try {
    const response = await fetch(`${API_BASE}/portfolio`, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Erreur API');
    const data = await response.json();

    if (data.settings) {
      if (data.settings.siteTitle) document.title = data.settings.siteTitle;
      if (data.settings.seoDescription) {
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', 'description');
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', data.settings.seoDescription);
      }

      const visibility = data.settings.sectionVisibility || {};
      Object.entries(visibility).forEach(([id, visible]) => {
        if (visible === false) {
          const section = document.getElementById(id);
          if (section) section.style.display = 'none';
          document.querySelectorAll(`[data-section="${id}"]`).forEach(link => { link.style.display = 'none'; });
        }
      });
    }

    const name = document.querySelector('[data-section="about"]');
    if (name) {
      document.querySelector('.about-name').textContent = data.profile.name;
      document.querySelector('.about-role').textContent = `${data.profile.role} · ${data.profile.location}`;

      const bioContainer = document.querySelector('.about-bio');
      if (bioContainer) {
        const paragraphs = String(data.profile.bio || '').split(/\n+/).map(p => p.trim()).filter(Boolean);
        bioContainer.innerHTML = paragraphs.length
          ? paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('')
          : '<p>Biographie à venir.</p>';
      }
    }

    const avatarImg = document.getElementById('about-avatar-img');
    if (avatarImg && data.profile.avatarUrl) {
      avatarImg.src = data.profile.avatarUrl;
    }

    const statProjects = document.getElementById('stat-projects');
    if (statProjects) statProjects.textContent = data.projects.length;

    const statExperience = document.getElementById('stat-experience');
    if (statExperience) statExperience.textContent = `${data.profile.yearsOfExperience || 0}+`;

    const statStack = document.getElementById('stat-stack');
    if (statStack) statStack.textContent = (data.profile.stack || []).length;

    const contactSub = document.getElementById('contact-sub');
    if (contactSub && data.profile.availabilityMessage) {
      contactSub.textContent = data.profile.availabilityMessage;
    }

    const socialList = document.getElementById('social-list');
    if (socialList) {
      const entries = ['instagram', 'linkedin', 'github', 'website']
        .map(kind => buildSocialEntry(kind, data.profile[kind]))
        .filter(Boolean);
      socialList.innerHTML = entries.length
        ? entries.map(e => `
          <a class="social-item" href="${escapeHtml(e.href)}" target="_blank" rel="noopener">
            <div class="social-icon"><i class="${e.iconClass}"></i></div>
            <div>
              <div class="social-name">${escapeHtml(e.label)}</div>
              <div class="social-handle">${escapeHtml(e.handle)}</div>
            </div>
            <span class="social-arrow">↗</span>
          </a>`).join('')
        : '<p style="font-size:13px;color:var(--text-muted)">Aucun réseau renseigné.</p>';
    }

    const availabilityList = document.getElementById('availability-list');
    if (availabilityList) {
      const items = [data.profile.status, data.profile.location].filter(Boolean);
      availabilityList.innerHTML = items.length
        ? items.map(item => `<li>${escapeHtml(item)}</li>`).join('')
        : '<li>Informations à venir.</li>';
    }

    const projectsGrid = document.querySelector('.projects-grid');
    const projectViews = document.getElementById('project-views');
    window.portfolioProjectsById = {};
    if (projectsGrid) {
      projectsGrid.innerHTML = '';
      if (projectViews) projectViews.innerHTML = '';
      data.projects.forEach(project => {
        window.portfolioProjectsById[project.id] = project;

        const card = document.createElement('div');
        card.className = 'project-card' + (project.imageUrl ? ' has-image' : '');
        card.dataset.category = project.category || 'Fullstack';
        card.onclick = () => showProject(project.id);
        const demoHref = safeHref(project.demo);
        const githubHref = safeHref(project.github);
        card.innerHTML = `
          ${project.imageUrl ? `<img class="project-hover-image" src="${escapeHtml(project.imageUrl)}" alt="" loading="lazy">` : ''}
          <div class="project-content">
            <div class="project-header">
              <div class="project-name">${escapeHtml(project.name)}</div>
              <div class="project-status ${project.status === 'Live' ? 'live' : 'wip'}">${escapeHtml(project.status)}</div>
            </div>
            <div class="project-desc">${escapeHtml(project.description)}</div>
            <div class="project-tech">
              ${(project.tech || []).map(tag => `<span class="tech-tag">${escapeHtml(tag)}</span>`).join('')}
            </div>
            <div class="project-links">
              ${demoHref ? `<a class="project-link" href="${escapeHtml(demoHref)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">↗ Démo</a>` : ''}
              ${githubHref ? `<a class="project-link" href="${escapeHtml(githubHref)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">⌥ GitHub</a>` : ''}
            </div>
          </div>`;
        projectsGrid.appendChild(card);

        if (projectViews) {
          let downloadCta = '';
          if (project.downloadType === 'free') {
            downloadCta = project.downloadFileName
              ? `<button type="button" class="btn-hero-secondary project-cta" onclick="toggleFreeForm('${project.id}')">⬇ Obtenir gratuitement</button>
                <div class="buy-form" id="free-form-${project.id}" style="display:none">
                  <p class="buy-form-hint">Laisse ton email pour recevoir le lien de téléchargement.</p>
                  <input class="form-input" type="text" id="free-name-${project.id}" placeholder="Ton nom">
                  <input class="form-input" type="email" id="free-email-${project.id}" placeholder="Ton email">
                  <button type="button" class="btn-hero-primary" onclick="submitFreeDownload('${project.id}')">Recevoir le lien de téléchargement</button>
                  <p class="buy-form-feedback" id="free-feedback-${project.id}"></p>
                </div>`
              : `<a class="btn-hero-secondary project-cta" href="#contact" onclick="requestFreeFile('${project.id}')">⬇ Obtenir gratuitement</a>`;
          } else if (project.downloadType === 'paid') {
            const paymentHref = safeHref(project.paymentLink);
            const priceLabel = `${escapeHtml(String(project.price))} ${escapeHtml(project.currency || 'XOF')}`;
            const openPaymentJs = paymentHref ? `window.open('${escapeHtml(paymentHref)}','_blank','noopener');` : '';
            downloadCta = `<button type="button" class="btn-hero-secondary project-cta" onclick="${openPaymentJs}toggleBuyForm('${project.id}')">Obtenir pour ${priceLabel}</button>
                <div class="buy-form" id="buy-form-${project.id}" style="display:none">
                  <p class="buy-form-hint">Une fois le paiement effectué sur Wave, envoie ta preuve ci-dessous pour recevoir ton lien de téléchargement.</p>
                  <input class="form-input" type="text" id="buy-name-${project.id}" placeholder="Ton nom">
                  <input class="form-input" type="email" id="buy-email-${project.id}" placeholder="Ton email">
                  <div class="buy-form-proof-toggle">
                    <label><input type="radio" name="proof-method-${project.id}" value="transaction" checked onchange="toggleProofMethod('${project.id}')"> Numéro Wave + ID transaction</label>
                    <label><input type="radio" name="proof-method-${project.id}" value="receipt" onchange="toggleProofMethod('${project.id}')"> Reçu PDF</label>
                  </div>
                  <div id="buy-transaction-fields-${project.id}">
                    <input class="form-input" type="text" id="buy-wave-number-${project.id}" placeholder="Numéro Wave utilisé pour payer">
                    <input class="form-input" type="text" id="buy-transaction-id-${project.id}" placeholder="ID de transaction Wave">
                  </div>
                  <div id="buy-receipt-fields-${project.id}" style="display:none">
                    <input class="form-input" type="file" accept=".pdf,application/pdf" id="buy-receipt-file-${project.id}">
                  </div>
                  <button type="button" class="btn-hero-primary" onclick="submitOrder('${project.id}')">Envoyer ma preuve de paiement</button>
                  <p class="buy-form-feedback" id="buy-feedback-${project.id}"></p>
                </div>`;
          }

          const view = document.createElement('div');
          view.className = 'project-view';
          view.id = 'project-' + project.id;
          view.innerHTML = `
            <div class="project-back" onclick="hideProject()">← Retour aux projets</div>
            ${project.imageUrl ? `<img class="project-view-image" src="${escapeHtml(project.imageUrl)}" alt="">` : ''}
            <div class="project-view-header">
              <div class="project-view-title">${escapeHtml(project.name)}</div>
              <div class="project-status ${project.status === 'Live' ? 'live' : 'wip'}">${escapeHtml(project.status)}</div>
            </div>
            <div class="project-view-tech">
              ${(project.tech || []).map(tag => `<span class="tech-tag">${escapeHtml(tag)}</span>`).join('')}
            </div>
            <div class="project-view-desc">${escapeHtml(project.description)}</div>
            <div class="project-view-links">
              ${demoHref ? `<a class="project-link" href="${escapeHtml(demoHref)}" target="_blank" rel="noopener">↗ Démo</a>` : ''}
              ${githubHref ? `<a class="project-link" href="${escapeHtml(githubHref)}" target="_blank" rel="noopener">⌥ GitHub</a>` : ''}
            </div>
            ${downloadCta}`;
          projectViews.appendChild(view);
        }
      });
      applyProjectFilter();
      openProjectFromHash();
    }

    const blogList = document.getElementById('blog-list');
    const articleViews = document.getElementById('article-views');
    if (blogList && articleViews) {
      blogList.innerHTML = '';
      articleViews.innerHTML = '';
      const publishedArticles = data.articles.filter(article => article.published);

      publishedArticles.forEach(article => {
          const readTime = estimateReadingTime(article.content);

          const post = document.createElement('div');
          post.className = 'blog-post';
          post.onclick = () => showArticle(article.id);
          post.innerHTML = `
            <div>
              <div class="blog-meta">
                <span class="blog-cat">${escapeHtml(article.category)}</span>
                <span class="blog-date">${escapeHtml(article.date)}</span>
              </div>
              <div class="blog-title">${escapeHtml(article.title)}</div>
              <div class="blog-excerpt">${escapeHtml(article.excerpt)}</div>
            </div>
            <div class="blog-read">${readTime} min ↗</div>`;
          blogList.appendChild(post);

          const liked = getLikedArticles().includes(article.id);
          const suggestions = getSuggestedArticles(article, publishedArticles);

          const view = document.createElement('div');
          view.className = 'article-view';
          view.id = 'article-' + article.id;
          view.innerHTML = `
            <div class="article-view-layout">
              <div class="article-main">
                <div class="article-back" onclick="hideArticle()">← Retour aux articles</div>
                <h1 class="article-h1">${escapeHtml(article.title)}</h1>
                <div class="article-meta">
                  <span>${escapeHtml(article.date)}</span>
                  <span>${readTime} min de lecture</span>
                  <span>${escapeHtml(article.category)}</span>
                </div>
                <div class="article-body">${renderArticleContent(article.content)}</div>
                <div class="article-actions-bar">
                  <button class="article-like-btn${liked ? ' liked' : ''}" id="like-btn-${article.id}" onclick="toggleLike('${article.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="${liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                    <span id="like-count-${article.id}">${article.likes || 0}</span>
                  </button>
                  <button class="article-share-btn" id="share-btn-${article.id}" onclick="shareArticle('${article.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                    Partager
                    <span id="share-count-${article.id}">${article.shares || 0}</span>
                  </button>
                  <span class="share-feedback" id="share-feedback-${article.id}"></span>
                </div>
                <div class="article-comments">
                  <h3 class="comments-title">Commentaires</h3>
                  <div class="comments-list" id="comments-list-${article.id}"><p class="comments-empty">Chargement...</p></div>
                  <form class="comment-form" onsubmit="return submitComment(event, '${article.id}')">
                    <input class="form-input" type="text" id="comment-name-${article.id}" placeholder="Ton nom" required>
                    <textarea class="form-input" id="comment-message-${article.id}" rows="3" placeholder="Ton commentaire..." required></textarea>
                    <button class="comment-submit" type="submit">Envoyer</button>
                    <p class="comment-feedback" id="comment-feedback-${article.id}"></p>
                  </form>
                </div>
              </div>
              ${suggestions.length ? `
              <aside class="article-suggestions">
                <div class="article-suggestions-title">À lire aussi</div>
                <div class="suggestion-list">
                  ${suggestions.map(s => `
                    <div class="suggestion-card" onclick="showArticle('${s.id}')">
                      <div class="suggestion-cat">${escapeHtml(s.category)}</div>
                      <div class="suggestion-title">${escapeHtml(s.title)}</div>
                      <div class="suggestion-date">${escapeHtml(s.date)}</div>
                    </div>`).join('')}
                </div>
              </aside>` : ''}
            </div>`;
          articleViews.appendChild(view);
        });
      if (window.hljs) {
        articleViews.querySelectorAll('pre code').forEach(block => window.hljs.highlightElement(block));
      }
      openArticleFromHash();
    }
  } catch (error) {
    if (!silent && statusEl) {
      statusEl.textContent = 'Impossible de joindre le backend';
      statusEl.style.color = '#ef4444';
    }
    console.error('Erreur de chargement du portfolio', error);
  }
}

async function handleSubmit(btn) {
  const form = btn.closest('form');
  const statusEl = document.getElementById('api-status');
  const payload = {
    name: form?.querySelector('input[name="name"]')?.value || '',
    email: form?.querySelector('input[name="email"]')?.value || '',
    subject: form?.querySelector('input[name="subject"]')?.value || '',
    message: form?.querySelector('textarea[name="message"]')?.value || ''
  };

  btn.disabled = true;
  btn.textContent = 'Envoi en cours...';

  try {
    const response = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!response.ok) throw new Error(result.message || 'Erreur');

    if (statusEl) {
      statusEl.textContent = 'Message envoyé avec succès';
      statusEl.style.color = '#22c55e';
    }
    btn.textContent = 'Message envoyé ✓';
    btn.style.background = '#22c55e';
    btn.style.color = '#fff';
    form.reset();
  } catch (error) {
    if (statusEl) {
      statusEl.textContent = 'Échec de l\'envoi';
      statusEl.style.color = '#ef4444';
    }
    btn.textContent = 'Échec de l\'envoi';
    btn.style.background = '#ef4444';
    btn.style.color = '#fff';
    console.error(error);
  } finally {
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Envoyer le message →';
      btn.style.background = '';
      btn.style.color = '';
    }, 3000);
  }
}

function initCodeSnow() {
  const container = document.getElementById('codeSnow');
  if (!container) return;

  const icons = [
    'fa-html5', 'fa-css3-alt', 'fa-js', 'fa-react', 'fa-node-js',
    'fa-python', 'fa-php', 'fa-docker', 'fa-git-alt', 'fa-npm', 'fa-sass', 'fa-vuejs'
  ];
  const count = 55;

  for (let i = 0; i < count; i++) {
    const icon = icons[Math.floor(Math.random() * icons.length)];
    const el = document.createElement('i');
    el.className = `fa-brands ${icon} code-snow-icon`;
    el.style.left = `${Math.random() * 100}%`;
    el.style.fontSize = `${12 + Math.random() * 16}px`;
    el.style.opacity = (0.08 + Math.random() * 0.22).toFixed(2);
    el.style.animationDuration = `${14 + Math.random() * 16}s`;
    el.style.animationDelay = `-${(Math.random() * 30).toFixed(1)}s`;
    container.appendChild(el);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadPortfolioData();
  initCodeSnow();
  trackPageView();
});

// Ping anonyme (pas de cookie, pas d'identifiant persistant côté client) envoyé une fois par
// chargement de page pour les statistiques de fréquentation dans l'admin.
function trackPageView() {
  const payload = JSON.stringify({ path: location.pathname + location.hash, referrer: document.referrer || '' });
  if (navigator.sendBeacon) {
    navigator.sendBeacon(`${API_BASE}/visit`, new Blob([payload], { type: 'application/json' }));
  } else {
    fetch(`${API_BASE}/visit`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(() => {});
  }
}

// Repère si le visiteur est en train de saisir un formulaire (contact, commentaire) ou de lire
// un article/projet, pour ne jamais lui couper sa lecture ou effacer sa saisie en arrière-plan.
function isVisitorBusy() {
  const active = document.activeElement;
  const editingField = active && ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName);
  const reading = document.body.classList.contains('viewing-article') || document.body.classList.contains('viewing-project');
  return Boolean(editingField || reading);
}

setInterval(() => {
  if (isVisitorBusy()) return;
  loadPortfolioData({ silent: true });
}, 15000);