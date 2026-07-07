const API_BASE = '/api';
const TOKEN_KEY = 'adminToken';

const EDIT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
const DELETE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>';
const APPROVE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>';

let portfolio = { profile: {}, projects: [], articles: [] };
let comments = [];
let messages = [];
let settings = {};
let avatarUrlDirty = false;
let editingProjectId = null;
let editingArticleId = null;
let deleteContext = null;
let articleFilter = 'all';
let commentFilter = 'all';
let messageFilter = 'all';
let lastSyncAt = null;

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function getToken() { return localStorage.getItem(TOKEN_KEY); }
function setToken(token) { localStorage.setItem(TOKEN_KEY, token); }
function clearToken() { localStorage.removeItem(TOKEN_KEY); }

async function apiFetch(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (response.status === 401) {
    clearToken();
    showLoginScreen();
    throw new Error('Non autorisé');
  }
  return response;
}

// ═══════════════ NAVIGATION / UI ═══════════════

function showSection(name) {
  goPage(name);
}

function goPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sb-link').forEach(l => l.classList.remove('active'));
  const page = document.getElementById('page-' + name);
  if (page) page.classList.add('active');
  const link = document.querySelector(`.sb-link[data-page="${name}"]`);
  if (link) link.classList.add('active');
  document.getElementById('breadcrumb').textContent = name;
  window.scrollTo(0, 0);
  closeSidebar();
}

document.querySelectorAll('.sb-link[data-page]').forEach(link => {
  link.addEventListener('click', () => goPage(link.dataset.page));
});

const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const burgerBtn = document.getElementById('burgerBtn');

function openSidebar() {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('visible');
  document.body.style.overflow = '';
}

burgerBtn?.addEventListener('click', () => {
  sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
});
sidebarOverlay?.addEventListener('click', closeSidebar);

function showModal(id) {
  const el = document.getElementById('modal-' + id);
  if (el) el.classList.add('open');
}
function closeModal(id) {
  const el = document.getElementById('modal-' + id);
  if (el) el.classList.remove('open');
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay && overlay.id !== 'login-screen') overlay.classList.remove('open');
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      if (m.id !== 'login-screen') m.classList.remove('open');
    });
  }
});

function showToast(msg, type = 'info') {
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const wrap = document.getElementById('toast-wrap');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || '•'}</span><span>${escapeHtml(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function handleTagInput(e) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    const input = document.getElementById('tag-input');
    const val = input.value.trim().replace(',', '');
    if (!val) return;
    const container = document.getElementById('tags-container');
    const tag = document.createElement('span');
    tag.className = 'tag-item';
    tag.innerHTML = `${escapeHtml(val)} <span class="tag-remove" onclick="removeTag(this)">×</span>`;
    container.insertBefore(tag, input);
    input.value = '';
  }
}
function removeTag(el) {
  el.closest('.tag-item').remove();
}
function getTags() {
  return [...document.querySelectorAll('#tags-container .tag-item')]
    .map(el => el.childNodes[0].textContent.trim())
    .filter(Boolean);
}
function setTags(tags) {
  const container = document.getElementById('tags-container');
  container.querySelectorAll('.tag-item').forEach(el => el.remove());
  const input = document.getElementById('tag-input');
  (tags || []).forEach(val => {
    const tag = document.createElement('span');
    tag.className = 'tag-item';
    tag.innerHTML = `${escapeHtml(val)} <span class="tag-remove" onclick="removeTag(this)">×</span>`;
    container.insertBefore(tag, input);
  });
}

function applyFormat(textareaId, type) {
  const textarea = document.getElementById(textareaId);
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;

  if (type === 'h1' || type === 'h2') {
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const prefix = type === 'h1' ? '# ' : '## ';
    textarea.value = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    textarea.focus();
    textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    return;
  }

  const wrap = { bold: '**', italic: '*', code: '`' }[type];
  if (!wrap) return;

  const placeholders = { bold: 'texte en gras', italic: 'texte en italique', code: 'code' };
  const selected = value.slice(start, end) || placeholders[type];

  textarea.value = value.slice(0, start) + wrap + selected + wrap + value.slice(end);
  textarea.focus();
  textarea.setSelectionRange(start + wrap.length, start + wrap.length + selected.length);
}

function filterToggle(btn) {
  btn.closest('div').querySelectorAll('button').forEach(b => b.classList.remove('active-filter'));
  btn.classList.add('active-filter');
}

// ═══════════════ AUTH ═══════════════

function showLoginScreen() {
  document.getElementById('login-screen').classList.add('open');
}
function hideLoginScreen() {
  document.getElementById('login-screen').classList.remove('open');
}

async function login() {
  const passwordInput = document.getElementById('login-password');
  const errorEl = document.getElementById('login-error');
  errorEl.style.display = 'none';

  try {
    const response = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passwordInput.value })
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body.message || 'Erreur');

    setToken(body.token);
    passwordInput.value = '';
    hideLoginScreen();
    init();
  } catch (error) {
    errorEl.style.display = 'block';
  }
}

function logout() {
  clearToken();
  showLoginScreen();
}

// ═══════════════ CHARGEMENT / RENDU ═══════════════

async function init() {
  try {
    const response = await fetch(`${API_BASE}/portfolio`);
    if (!response.ok) throw new Error('Erreur API');
    portfolio = await response.json();

    const profileName = document.querySelector('.sb-user-name');
    const profileRole = document.querySelector('.sb-user-role');
    if (profileName) profileName.textContent = portfolio.profile.name;
    if (profileRole) profileRole.textContent = portfolio.profile.role;

    const commentsRes = await apiFetch('/admin/comments');
    const commentsBody = await commentsRes.json();
    comments = commentsBody.comments || [];

    const messagesRes = await apiFetch('/admin/messages');
    const messagesBody = await messagesRes.json();
    messages = messagesBody.messages || [];

    const settingsRes = await apiFetch('/admin/settings');
    const settingsBody = await settingsRes.json();
    settings = settingsBody.settings || {};

    lastSyncAt = new Date();
    updateLastSync();
    renderDashboardStats();
    renderProjects();
    renderArticles();
    renderProfileForm();
    renderComments();
    renderMessages();
    renderSettingsForm();
    return true;
  } catch (error) {
    console.error('Erreur de chargement de l\'admin', error);
    showToast('Connexion au backend impossible', 'error');
    return false;
  }
}

async function syncNow() {
  const ok = await init();
  if (ok) showToast('Portfolio mis à jour', 'success');
}

function commentsForArticle(articleId) {
  return comments.filter(c => c.articleId === articleId);
}

function renderDashboardStats() {
  const totalArticles = portfolio.articles.length;
  const published = portfolio.articles.filter(a => a.published).length;
  document.getElementById('stat-articles-count').textContent = totalArticles;
  document.getElementById('stat-articles-sub').textContent = `${published} publiés · ${totalArticles - published} brouillons`;
  document.getElementById('badge-articles').textContent = totalArticles;

  const totalProjects = portfolio.projects.length;
  const live = portfolio.projects.filter(p => p.status === 'Live').length;
  document.getElementById('stat-projects-count').textContent = totalProjects;
  document.getElementById('stat-projects-sub').textContent = `${live} live · ${totalProjects - live} en cours`;
  document.getElementById('badge-projects').textContent = totalProjects;

  const pendingComments = comments.filter(c => !c.approved).length;
  const badgeComments = document.getElementById('badge-comments');
  if (badgeComments) badgeComments.textContent = pendingComments;

  const unreadMessages = messages.filter(m => !m.read).length;
  const badgeMessages = document.getElementById('badge-messages');
  if (badgeMessages) badgeMessages.textContent = unreadMessages;

  renderSiteStatus();
  renderRecentActivity();
}

function formatRelativeTime(date) {
  if (!date || Number.isNaN(date.getTime())) return '';
  const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMin < 1) return 'à l\'instant';
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `il y a ${diffH} h`;
  const diffJ = Math.floor(diffH / 24);
  return `il y a ${diffJ} j`;
}

function updateLastSync() {
  const label = document.getElementById('last-sync-label');
  if (!label || !lastSyncAt) return;
  label.textContent = `Dernière sync : ${formatRelativeTime(lastSyncAt)}`;
}

function renderSiteStatus() {
  const p = portfolio.profile || {};

  const sections = [
    Boolean(p.name && p.role),
    Boolean(p.bio && (p.stack || []).length),
    portfolio.projects.length > 0,
    portfolio.articles.some(a => a.published),
    Boolean(p.email)
  ];
  const sectionsDone = sections.filter(Boolean).length;
  document.getElementById('sections-fraction').textContent = `${sectionsDone}/${sections.length}`;
  document.getElementById('sections-fill').style.width = `${Math.round((sectionsDone / sections.length) * 100)}%`;

  const totalArticles = portfolio.articles.length;
  const publishedArticles = portfolio.articles.filter(a => a.published).length;
  document.getElementById('articles-fraction').textContent = `${publishedArticles}/${totalArticles}`;
  document.getElementById('articles-fill').style.width = totalArticles ? `${Math.round((publishedArticles / totalArticles) * 100)}%` : '0%';

  const totalProjects = portfolio.projects.length;
  const documentedProjects = portfolio.projects.filter(pr => pr.description && (pr.tech || []).length).length;
  document.getElementById('projects-fraction').textContent = `${documentedProjects}/${totalProjects}`;
  document.getElementById('projects-fill').style.width = totalProjects ? `${Math.round((documentedProjects / totalProjects) * 100)}%` : '0%';
}

function renderRecentActivity() {
  const container = document.getElementById('activity-list');
  if (!container) return;

  const events = [];

  portfolio.articles.forEach(a => {
    const date = new Date(a.updatedAt || a.createdAt);
    if (Number.isNaN(date.getTime())) return;
    events.push({
      date,
      dot: a.published ? 'green' : 'orange',
      text: a.published ? `Article <strong>"${escapeHtml(a.title)}"</strong> publié` : `Brouillon <strong>"${escapeHtml(a.title)}"</strong> en attente`
    });
  });

  portfolio.projects.forEach(pr => {
    const created = new Date(pr.createdAt);
    const updated = new Date(pr.updatedAt);
    if (Number.isNaN(updated.getTime())) return;
    const isNew = !Number.isNaN(created.getTime()) && Math.abs(updated.getTime() - created.getTime()) < 5000;
    events.push({
      date: updated,
      dot: 'blue',
      text: isNew ? `Projet <strong>${escapeHtml(pr.name)}</strong> ajouté` : `Projet <strong>${escapeHtml(pr.name)}</strong> mis à jour`
    });
  });

  comments.forEach(c => {
    const date = new Date(c.createdAt);
    if (Number.isNaN(date.getTime())) return;
    events.push({
      date,
      dot: c.approved ? 'green' : 'orange',
      text: `Commentaire de <strong>${escapeHtml(c.name)}</strong> sur « ${escapeHtml(c.articleTitle)} »`
    });
  });

  messages.forEach(m => {
    const date = new Date(m.createdAt);
    if (Number.isNaN(date.getTime())) return;
    events.push({
      date,
      dot: m.read ? 'blue' : 'orange',
      text: `Message de <strong>${escapeHtml(m.name)}</strong> — ${escapeHtml(m.subject)}`
    });
  });

  events.sort((a, b) => b.date - a.date);

  container.innerHTML = '';
  if (!events.length) {
    container.innerHTML = '<p style="font-size:12px;color:var(--muted)">Aucune activité récente.</p>';
    return;
  }

  events.slice(0, 6).forEach(event => {
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.innerHTML = `
      <div class="activity-dot ${event.dot}"></div>
      <div><div class="activity-text">${event.text}</div><div class="activity-time">${formatRelativeTime(event.date)}</div></div>`;
    container.appendChild(item);
  });
}

function statusBadgeClass(status) {
  if (status === 'Live') return 'badge-green';
  if (status === 'Archivé') return 'badge-blue';
  return 'badge-orange';
}

function renderProjects() {
  const container = document.getElementById('projets-list');
  if (!container) return;
  container.innerHTML = '';

  portfolio.projects.forEach(project => {
    const card = document.createElement('div');
    card.className = `proj-card ${project.status === 'Live' ? 'live' : 'wip'}`;
    card.innerHTML = `
      <div class="proj-info">
        <div class="proj-name">${escapeHtml(project.name)}</div>
        <div class="proj-desc">${escapeHtml(project.description)}</div>
        <div class="proj-tags">${(project.tech || []).map(t => `<span class="proj-tag">${escapeHtml(t)}</span>`).join('')}</div>
      </div>
      <div class="proj-actions">
        <span class="badge ${statusBadgeClass(project.status)}">${escapeHtml(project.status)}</span>
        <div class="icon-btn edit-btn">${EDIT_ICON}</div>
        <div class="icon-btn danger delete-btn">${DELETE_ICON}</div>
      </div>`;
    card.querySelector('.edit-btn').addEventListener('click', () => openEditProject(project.id));
    card.querySelector('.delete-btn').addEventListener('click', () => confirmDelete(project.name, 'projects', project.id));
    container.appendChild(card);
  });
}

function setArticleFilter(filter, btn) {
  articleFilter = filter;
  filterToggle(btn);
  renderArticles();
}

function renderArticles() {
  const container = document.getElementById('articles-list');
  if (!container) return;

  const total = portfolio.articles.length;
  const published = portfolio.articles.filter(a => a.published).length;
  document.getElementById('filter-count-all').textContent = total;
  document.getElementById('filter-count-published').textContent = published;
  document.getElementById('filter-count-draft').textContent = total - published;

  const search = (document.getElementById('article-search')?.value || '').trim().toLowerCase();

  const visible = portfolio.articles.filter(article => {
    if (articleFilter === 'published' && !article.published) return false;
    if (articleFilter === 'draft' && article.published) return false;
    if (search && !article.title.toLowerCase().includes(search)) return false;
    return true;
  });

  container.innerHTML = '';
  visible.forEach(article => {
    const articleComments = commentsForArticle(article.id);
    const pendingCount = articleComments.filter(c => !c.approved).length;

    const card = document.createElement('div');
    card.className = 'article-card';
    card.innerHTML = `
      <div class="article-card-top">
        <div style="display:flex;align-items:center;gap:8px">
          <span class="article-cat">${escapeHtml(article.category)}</span>
          <span class="badge ${article.published ? 'badge-green' : 'badge-orange'}">${article.published ? 'Publié' : 'Brouillon'}</span>
        </div>
        <div class="article-actions">
          <div class="icon-btn edit-btn">${EDIT_ICON}</div>
          <div class="icon-btn danger delete-btn">${DELETE_ICON}</div>
        </div>
      </div>
      <div class="article-title">${escapeHtml(article.title)}</div>
      <div class="article-excerpt">${escapeHtml(article.excerpt)}</div>
      <div class="article-meta"><span>${escapeHtml(article.date)}</span></div>
      <div class="article-stats">
        <span>❤ ${article.likes || 0}</span>
        <span>↗ ${article.shares || 0}</span>
        <span>💬 ${articleComments.length}${pendingCount ? ` (${pendingCount} en attente)` : ''}</span>
      </div>`;
    card.querySelector('.edit-btn').addEventListener('click', () => openEditArticle(article.id));
    card.querySelector('.delete-btn').addEventListener('click', () => confirmDelete(article.title, 'articles', article.id));
    container.appendChild(card);
  });
}

// ═══════════════ COMMENTAIRES ═══════════════

function setCommentFilter(filter, btn) {
  commentFilter = filter;
  filterToggle(btn);
  renderComments();
}

function renderComments() {
  const container = document.getElementById('comments-list');
  if (!container) return;

  const total = comments.length;
  const pending = comments.filter(c => !c.approved).length;
  document.getElementById('comment-count-all').textContent = total;
  document.getElementById('comment-count-pending').textContent = pending;
  document.getElementById('comment-count-approved').textContent = total - pending;

  const visible = comments.filter(c => {
    if (commentFilter === 'pending') return !c.approved;
    if (commentFilter === 'approved') return c.approved;
    return true;
  });

  container.innerHTML = '';
  if (!visible.length) {
    container.innerHTML = '<p style="font-size:12px;color:var(--muted)">Aucun commentaire.</p>';
    return;
  }

  visible.forEach(comment => {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.innerHTML = `
      <div class="article-card-top">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span class="comment-author">${escapeHtml(comment.name)}</span>
          <span class="comment-article-ref">sur « ${escapeHtml(comment.articleTitle)} »</span>
          <span class="badge ${comment.approved ? 'badge-green' : 'badge-orange'}">${comment.approved ? 'Approuvé' : 'En attente'}</span>
        </div>
        <div class="article-actions">
          ${comment.approved ? '' : `<div class="icon-btn approve-btn" title="Approuver">${APPROVE_ICON}</div>`}
          <div class="icon-btn danger delete-btn" title="Supprimer">${DELETE_ICON}</div>
        </div>
      </div>
      <div class="comment-message">${escapeHtml(comment.message)}</div>
      <div class="article-meta"><span>${new Date(comment.createdAt).toLocaleDateString('fr-FR')}</span></div>`;
    if (!comment.approved) {
      card.querySelector('.approve-btn').addEventListener('click', () => approveComment(comment.id));
    }
    card.querySelector('.delete-btn').addEventListener('click', () => confirmDelete('ce commentaire', 'comments', comment.id));
    container.appendChild(card);
  });
}

async function approveComment(id) {
  try {
    const response = await apiFetch(`/admin/comments/${id}/approve`, { method: 'PUT' });
    const body = await response.json();
    if (!response.ok) throw new Error(body.message || 'Erreur');

    const comment = comments.find(c => c.id === id);
    if (comment) comment.approved = true;
    renderComments();
    renderArticles();
    renderDashboardStats();
    showToast('Commentaire approuvé', 'success');
  } catch (error) {
    showToast(error.message || 'Échec de l\'approbation', 'error');
  }
}

// ═══════════════ MESSAGES ═══════════════

function setMessageFilter(filter, btn) {
  messageFilter = filter;
  filterToggle(btn);
  renderMessages();
}

function renderMessages() {
  const container = document.getElementById('messages-list');
  if (!container) return;

  const total = messages.length;
  const unread = messages.filter(m => !m.read).length;
  document.getElementById('message-count-all').textContent = total;
  document.getElementById('message-count-unread').textContent = unread;

  const visible = messageFilter === 'unread' ? messages.filter(m => !m.read) : messages;

  container.innerHTML = '';
  if (!visible.length) {
    container.innerHTML = '<p style="font-size:12px;color:var(--muted)">Aucun message.</p>';
    return;
  }

  visible.forEach(msg => {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.innerHTML = `
      <div class="article-card-top">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span class="comment-author">${escapeHtml(msg.name)}</span>
          <span class="comment-article-ref">${escapeHtml(msg.email)}</span>
          ${msg.read ? '' : '<span class="badge badge-orange">Non lu</span>'}
        </div>
        <div class="article-actions">
          ${msg.read ? '' : `<div class="icon-btn read-btn" title="Marquer comme lu">${APPROVE_ICON}</div>`}
          <div class="icon-btn danger delete-btn" title="Supprimer">${DELETE_ICON}</div>
        </div>
      </div>
      <div class="article-title">${escapeHtml(msg.subject)}</div>
      <div class="comment-message">${escapeHtml(msg.message)}</div>
      <div class="article-meta"><span>${new Date(msg.createdAt).toLocaleDateString('fr-FR')}</span></div>`;
    if (!msg.read) {
      card.querySelector('.read-btn').addEventListener('click', () => markMessageRead(msg.id));
    }
    card.querySelector('.delete-btn').addEventListener('click', () => confirmDelete('ce message', 'messages', msg.id));
    container.appendChild(card);
  });
}

async function markMessageRead(id) {
  try {
    const response = await apiFetch(`/admin/messages/${id}/read`, { method: 'PUT' });
    const body = await response.json();
    if (!response.ok) throw new Error(body.message || 'Erreur');

    const msg = messages.find(m => m.id === id);
    if (msg) msg.read = true;
    renderMessages();
    renderDashboardStats();
  } catch (error) {
    showToast(error.message || 'Échec de la mise à jour', 'error');
  }
}

// ═══════════════ PROFIL ═══════════════

function renderProfileForm() {
  const p = portfolio.profile;
  const [firstname = '', ...rest] = (p.name || '').split(' ');
  document.getElementById('profile-firstname').value = firstname;
  document.getElementById('profile-lastname').value = rest.join(' ');
  document.getElementById('profile-role').value = p.role || '';
  document.getElementById('profile-location').value = p.location || '';
  document.getElementById('profile-years-experience').value = p.yearsOfExperience || 0;
  document.getElementById('profile-bio').value = p.bio || '';
  document.getElementById('profile-website').value = p.website || '';
  document.getElementById('profile-github').value = p.github || '';
  document.getElementById('profile-linkedin').value = p.linkedin || '';
  document.getElementById('profile-instagram').value = p.instagram || '';
  document.getElementById('profile-email').value = p.email || '';
  document.getElementById('profile-status').value = p.status || 'Ouvert aux missions';
  document.getElementById('profile-availability-message').value = p.availabilityMessage || '';

  const avatarUrlInput = document.getElementById('profile-avatar-url');
  if ((p.avatarUrl || '').startsWith('data:')) {
    avatarUrlInput.value = '';
    avatarUrlInput.placeholder = 'Photo uploadée — colle une URL pour la remplacer';
  } else {
    avatarUrlInput.value = p.avatarUrl || '';
    avatarUrlInput.placeholder = 'https://...';
  }
  avatarUrlDirty = false;
  setAvatarPreview(p.avatarUrl || '');
  setTags(p.stack);
}

function setAvatarPreview(url) {
  const img = document.getElementById('avatar-preview-img');
  const initials = document.getElementById('avatar-preview-initials');
  if (url) {
    img.src = url;
    img.style.display = 'block';
    initials.style.display = 'none';
  } else {
    img.style.display = 'none';
    initials.style.display = '';
  }
}

function updateAvatarPreview() {
  avatarUrlDirty = true;
  setAvatarPreview(document.getElementById('profile-avatar-url').value.trim());
}

async function clearAvatarUrl() {
  document.getElementById('profile-avatar-url').value = '';
  document.getElementById('profile-avatar-url').placeholder = 'https://...';
  avatarUrlDirty = true;
  setAvatarPreview('');
  await saveProfile();
}

async function uploadAvatar(event) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const token = getToken();
    const response = await fetch(`${API_BASE}/admin/profile/avatar`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });
    if (response.status === 401) {
      clearToken();
      showLoginScreen();
      return;
    }
    const body = await response.json();
    if (!response.ok) throw new Error(body.message || 'Erreur');

    portfolio.profile = body.profile;
    renderProfileForm();
    showToast('Photo mise à jour', 'success');
  } catch (error) {
    showToast(error.message || 'Échec de l\'upload', 'error');
  } finally {
    event.target.value = '';
  }
}

async function saveProfile() {
  const firstname = document.getElementById('profile-firstname').value.trim();
  const lastname = document.getElementById('profile-lastname').value.trim();
  const avatarUrl = avatarUrlDirty
    ? document.getElementById('profile-avatar-url').value.trim()
    : (portfolio.profile.avatarUrl || '');
  const payload = {
    name: [firstname, lastname].filter(Boolean).join(' '),
    role: document.getElementById('profile-role').value.trim(),
    location: document.getElementById('profile-location').value.trim(),
    yearsOfExperience: Number(document.getElementById('profile-years-experience').value) || 0,
    avatarUrl,
    bio: document.getElementById('profile-bio').value.trim(),
    website: document.getElementById('profile-website').value.trim(),
    github: document.getElementById('profile-github').value.trim(),
    linkedin: document.getElementById('profile-linkedin').value.trim(),
    instagram: document.getElementById('profile-instagram').value.trim(),
    email: document.getElementById('profile-email').value.trim(),
    status: document.getElementById('profile-status').value,
    availabilityMessage: document.getElementById('profile-availability-message').value.trim(),
    stack: getTags()
  };

  try {
    const response = await apiFetch('/admin/profile', { method: 'PUT', body: JSON.stringify(payload) });
    const body = await response.json();
    if (!response.ok) throw new Error(body.message || 'Erreur');

    portfolio.profile = body.profile;
    showToast('Profil sauvegardé', 'success');
  } catch (error) {
    showToast(error.message || 'Échec de la sauvegarde', 'error');
  }
}

// ═══════════════ PARAMÈTRES ═══════════════

function renderSettingsForm() {
  const s = settings;
  const visibility = s.sectionVisibility || {};
  document.getElementById('settings-site-title').value = s.siteTitle || '';
  document.getElementById('settings-seo-description').value = s.seoDescription || '';
  document.getElementById('settings-portfolio-url').value = s.portfolioUrl || '';
  ['home', 'about', 'projects', 'blog', 'contact'].forEach(id => {
    document.getElementById(`visibility-${id}`).checked = visibility[id] !== false;
  });
}

async function saveSettings() {
  const payload = {
    siteTitle: document.getElementById('settings-site-title').value.trim(),
    seoDescription: document.getElementById('settings-seo-description').value.trim(),
    portfolioUrl: document.getElementById('settings-portfolio-url').value.trim(),
    sectionVisibility: {
      home: document.getElementById('visibility-home').checked,
      about: document.getElementById('visibility-about').checked,
      projects: document.getElementById('visibility-projects').checked,
      blog: document.getElementById('visibility-blog').checked,
      contact: document.getElementById('visibility-contact').checked
    }
  };

  try {
    const response = await apiFetch('/admin/settings', { method: 'PUT', body: JSON.stringify(payload) });
    const body = await response.json();
    if (!response.ok) throw new Error(body.message || 'Erreur');

    settings = body.settings;
    showToast('Paramètres sauvegardés', 'success');
  } catch (error) {
    showToast(error.message || 'Échec de la sauvegarde', 'error');
  }
}

async function resetPortfolio() {
  try {
    const response = await apiFetch('/admin/reset', { method: 'POST' });
    const body = await response.json();
    if (!response.ok) throw new Error(body.message || 'Erreur');

    await init();
    showToast('Portfolio réinitialisé', 'success');
  } catch (error) {
    showToast(error.message || 'Échec de la réinitialisation', 'error');
  }
}

// ═══════════════ PROJETS ═══════════════

function openEditProject(id) {
  const project = portfolio.projects.find(p => p.id === id);
  if (!project) return;
  editingProjectId = id;

  document.getElementById('edit-projet-name').value = project.name;
  document.getElementById('edit-projet-description').value = project.description;
  document.getElementById('edit-projet-status').value = project.status;
  document.getElementById('edit-projet-demo').value = project.demo || '';
  document.getElementById('edit-projet-github').value = project.github || '';
  document.getElementById('edit-projet-tech').value = (project.tech || []).join(', ');
  showModal('edit-projet');
}

function parseTechInput(value) {
  return value.split(',').map(t => t.trim()).filter(Boolean);
}

async function submitNewProject() {
  const payload = {
    name: document.getElementById('new-projet-name').value.trim(),
    description: document.getElementById('new-projet-description').value.trim(),
    status: document.getElementById('new-projet-status').value,
    demo: document.getElementById('new-projet-demo').value.trim(),
    github: document.getElementById('new-projet-github').value.trim(),
    tech: parseTechInput(document.getElementById('new-projet-tech').value)
  };
  if (!payload.name || !payload.description) {
    showToast('Nom et description sont requis', 'error');
    return;
  }

  try {
    const response = await apiFetch('/admin/projects', { method: 'POST', body: JSON.stringify(payload) });
    const body = await response.json();
    if (!response.ok) throw new Error(body.message || 'Erreur');

    portfolio.projects.push(body.project);
    ['name', 'description', 'demo', 'github', 'tech'].forEach(field => {
      document.getElementById(`new-projet-${field}`).value = '';
    });
    renderProjects();
    renderDashboardStats();
    closeModal('new-projet');
    showToast('Projet ajouté !', 'success');
  } catch (error) {
    showToast(error.message || 'Échec de l\'ajout', 'error');
  }
}

async function submitEditProject() {
  if (!editingProjectId) return;
  const payload = {
    name: document.getElementById('edit-projet-name').value.trim(),
    description: document.getElementById('edit-projet-description').value.trim(),
    status: document.getElementById('edit-projet-status').value,
    demo: document.getElementById('edit-projet-demo').value.trim(),
    github: document.getElementById('edit-projet-github').value.trim(),
    tech: parseTechInput(document.getElementById('edit-projet-tech').value)
  };
  if (!payload.name || !payload.description) {
    showToast('Nom et description sont requis', 'error');
    return;
  }

  try {
    const response = await apiFetch(`/admin/projects/${editingProjectId}`, { method: 'PUT', body: JSON.stringify(payload) });
    const body = await response.json();
    if (!response.ok) throw new Error(body.message || 'Erreur');

    const index = portfolio.projects.findIndex(p => p.id === editingProjectId);
    if (index !== -1) portfolio.projects[index] = body.project;
    editingProjectId = null;
    renderProjects();
    renderDashboardStats();
    closeModal('edit-projet');
    showToast('Projet mis à jour', 'success');
  } catch (error) {
    showToast(error.message || 'Échec de la mise à jour', 'error');
  }
}

// ═══════════════ ARTICLES ═══════════════

function openEditArticle(id) {
  const article = portfolio.articles.find(a => a.id === id);
  if (!article) return;
  editingArticleId = id;

  document.getElementById('edit-article-title').value = article.title;
  document.getElementById('edit-article-category').value = article.category;
  document.getElementById('edit-article-status').value = article.published ? 'published' : 'draft';
  document.getElementById('edit-article-excerpt').value = article.excerpt;
  document.getElementById('edit-article-content').value = article.content || '';
  showModal('edit-article');
}

async function submitNewArticle(published) {
  const payload = {
    title: document.getElementById('new-article-title').value.trim(),
    category: document.getElementById('new-article-category').value,
    excerpt: document.getElementById('new-article-excerpt').value.trim(),
    content: document.getElementById('new-article-content').value,
    published
  };
  if (!payload.title || !payload.excerpt) {
    showToast('Titre et extrait sont requis', 'error');
    return;
  }

  try {
    const response = await apiFetch('/admin/articles', { method: 'POST', body: JSON.stringify(payload) });
    const body = await response.json();
    if (!response.ok) throw new Error(body.message || 'Erreur');

    portfolio.articles.push(body.article);
    ['title', 'excerpt', 'content'].forEach(field => {
      document.getElementById(`new-article-${field}`).value = '';
    });
    renderArticles();
    renderDashboardStats();
    closeModal('new-article');
    showToast(published ? 'Article publié !' : 'Brouillon sauvegardé', published ? 'success' : 'info');
  } catch (error) {
    showToast(error.message || 'Échec de la création', 'error');
  }
}

async function submitEditArticle() {
  if (!editingArticleId) return;
  const payload = {
    title: document.getElementById('edit-article-title').value.trim(),
    category: document.getElementById('edit-article-category').value,
    published: document.getElementById('edit-article-status').value === 'published',
    excerpt: document.getElementById('edit-article-excerpt').value.trim(),
    content: document.getElementById('edit-article-content').value
  };
  if (!payload.title || !payload.excerpt) {
    showToast('Titre et extrait sont requis', 'error');
    return;
  }

  try {
    const response = await apiFetch(`/admin/articles/${editingArticleId}`, { method: 'PUT', body: JSON.stringify(payload) });
    const body = await response.json();
    if (!response.ok) throw new Error(body.message || 'Erreur');

    const index = portfolio.articles.findIndex(a => a.id === editingArticleId);
    if (index !== -1) portfolio.articles[index] = body.article;
    editingArticleId = null;
    renderArticles();
    renderDashboardStats();
    closeModal('edit-article');
    showToast('Article mis à jour', 'success');
  } catch (error) {
    showToast(error.message || 'Échec de la mise à jour', 'error');
  }
}

// ═══════════════ SUPPRESSION ═══════════════

function confirmDelete(label, type, id) {
  deleteContext = type && id ? { type, id } : null;
  document.getElementById('delete-target').textContent = label;
  showModal('delete');
}

async function performDelete() {
  if (!deleteContext) {
    showToast('Fonctionnalité à venir', 'info');
    closeModal('delete');
    return;
  }

  const { type, id } = deleteContext;

  if (type === 'reset') {
    closeModal('delete');
    deleteContext = null;
    await resetPortfolio();
    return;
  }

  try {
    const response = await apiFetch(`/admin/${type}/${id}`, { method: 'DELETE' });
    const body = await response.json();
    if (!response.ok) throw new Error(body.message || 'Erreur');

    if (type === 'projects') portfolio.projects = portfolio.projects.filter(p => p.id !== id);
    if (type === 'articles') portfolio.articles = portfolio.articles.filter(a => a.id !== id);
    if (type === 'comments') comments = comments.filter(c => c.id !== id);
    if (type === 'messages') messages = messages.filter(m => m.id !== id);
    renderProjects();
    renderArticles();
    renderComments();
    renderMessages();
    renderDashboardStats();
    showToast('Supprimé', 'info');
  } catch (error) {
    showToast(error.message || 'Échec de la suppression', 'error');
  } finally {
    deleteContext = null;
    closeModal('delete');
  }
}

// ═══════════════ INIT ═══════════════

const style = document.createElement('style');
style.textContent = `@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}`;
document.head.appendChild(style);

window.addEventListener('DOMContentLoaded', () => {
  if (getToken()) {
    hideLoginScreen();
    init();
  } else {
    showLoginScreen();
  }
});

setInterval(() => {
  updateLastSync();
  if (portfolio.articles.length || portfolio.projects.length) renderRecentActivity();
}, 30000);
