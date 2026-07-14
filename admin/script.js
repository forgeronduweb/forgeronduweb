const API_BASE = '/api';
const TOKEN_KEY = 'adminToken';

const EDIT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
const DELETE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>';
const APPROVE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>';
const REPLY_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7l9 6 9-6M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z"/></svg>';

let portfolio = { profile: {}, projects: [], articles: [] };
let comments = [];
let messages = [];
let quotes = [];
let orders = [];
let subscribers = [];
let settings = {};
let avatarUrlDirty = false;
let editingProjectId = null;
let newProjectImageFile = null;
let newProjectDownloadFile = null;
let editingArticleId = null;
let deleteContext = null;
let articleFilter = 'all';
let orderFilter = 'all';
let messageFilter = 'all';
let quoteFilter = 'all';
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
  if (id === 'new-projet') { resetNewProjectImage(); resetNewProjectDownload(); }
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

  if (type === 'code') {
    const selected = value.slice(start, end) || 'votre code ici';
    const block = '```langage\n' + selected + '\n```';
    textarea.value = value.slice(0, start) + block + value.slice(end);
    textarea.focus();
    // Sélectionne "langage" pour que l'utilisateur puisse le remplacer immédiatement (ex: javascript, python, bash).
    const langStart = start + 3;
    textarea.setSelectionRange(langStart, langStart + 'langage'.length);
    return;
  }

  const wrap = { bold: '**', italic: '*' }[type];
  if (!wrap) return;

  const placeholders = { bold: 'texte en gras', italic: 'texte en italique' };
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

async function init({ silent = false } = {}) {
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

    const quotesRes = await apiFetch('/admin/quotes');
    const quotesBody = await quotesRes.json();
    quotes = quotesBody.quotes || [];

    const ordersRes = await apiFetch('/admin/orders');
    const ordersBody = await ordersRes.json();
    orders = ordersBody.orders || [];

    const subscribersRes = await apiFetch('/admin/subscribers');
    const subscribersBody = await subscribersRes.json();
    subscribers = subscribersBody.subscribers || [];

    const settingsRes = await apiFetch('/admin/settings');
    const settingsBody = await settingsRes.json();
    settings = settingsBody.settings || {};

    lastSyncAt = new Date();
    updateLastSync();
    renderDashboardStats();
    renderProjects();
    renderArticles();
    renderProfileForm();
    renderMessages();
    renderQuotes();
    renderAbonnes();
    renderOrders();
    renderSettingsForm();
    return true;
  } catch (error) {
    console.error('Erreur de chargement de l\'admin', error);
    if (!silent) showToast('Connexion au backend impossible', 'error');
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

  const unreadMessages = messages.filter(m => !m.read).length;
  const badgeMessages = document.getElementById('badge-messages');
  if (badgeMessages) badgeMessages.textContent = unreadMessages;

  const unreadQuotes = quotes.filter(q => !q.read).length;
  const badgeQuotes = document.getElementById('badge-quotes');
  if (badgeQuotes) badgeQuotes.textContent = unreadQuotes;

  const badgeAbonnes = document.getElementById('badge-abonnes');
  if (badgeAbonnes) badgeAbonnes.textContent = subscribers.length;

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const badgeOrders = document.getElementById('badge-orders');
  if (badgeOrders) badgeOrders.textContent = pendingOrders;

  const paidOrders = orders.filter(o => o.status === 'paid');
  const revenue = paidOrders.reduce((sum, o) => sum + (o.price || 0), 0);
  const revenueCurrency = paidOrders[0]?.currency || 'XOF';
  const statRevenue = document.getElementById('stat-revenue');
  if (statRevenue) statRevenue.textContent = `${revenue.toLocaleString('fr-FR')} ${revenueCurrency}`;
  const statRevenueSub = document.getElementById('stat-revenue-sub');
  if (statRevenueSub) statRevenueSub.textContent = `${paidOrders.length} vente${paidOrders.length > 1 ? 's' : ''} confirmée${paidOrders.length > 1 ? 's' : ''}`;

  const distinctSubscribers = new Set(subscribers.map(s => s.email.toLowerCase())).size;
  const statSubscribers = document.getElementById('stat-subscribers');
  if (statSubscribers) statSubscribers.textContent = distinctSubscribers;
  const statSubscribersSub = document.getElementById('stat-subscribers-sub');
  if (statSubscribersSub) statSubscribersSub.textContent = 'emails collectés (templates)';

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
        ${project.downloadType === 'paid' ? `<span class="badge badge-blue">${escapeHtml(String(project.price))} ${escapeHtml(project.currency || 'XOF')}</span>` : ''}
        ${project.downloadType === 'free' ? '<span class="badge badge-green">Gratuit</span>' : ''}
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
        <span class="article-comments-toggle" style="cursor:pointer;text-decoration:underline dotted">💬 ${articleComments.length}${pendingCount ? ` (${pendingCount} en attente)` : ''}</span>
      </div>
      <div class="article-comments-panel" id="article-comments-${article.id}" style="display:none;flex-direction:column;gap:10px;margin-top:10px;padding-top:10px;border-top:1px solid var(--border)"></div>`;
    card.querySelector('.edit-btn').addEventListener('click', () => openEditArticle(article.id));
    card.querySelector('.delete-btn').addEventListener('click', () => confirmDelete(article.title, 'articles', article.id));
    card.querySelector('.article-comments-toggle').addEventListener('click', () => toggleArticleComments(article.id));
    container.appendChild(card);
  });
}

// ═══════════════ COMMENTAIRES (gérés par article) ═══════════════

function toggleArticleComments(articleId) {
  const panel = document.getElementById(`article-comments-${articleId}`);
  if (!panel) return;
  const isHidden = panel.style.display === 'none' || !panel.style.display;
  panel.style.display = isHidden ? 'flex' : 'none';
  if (isHidden) renderArticleComments(articleId);
}

function renderArticleComments(articleId) {
  const panel = document.getElementById(`article-comments-${articleId}`);
  if (!panel) return;
  const articleComments = commentsForArticle(articleId);

  panel.innerHTML = '';
  if (!articleComments.length) {
    panel.innerHTML = '<p style="font-size:12px;color:var(--muted)">Aucun commentaire.</p>';
    return;
  }

  articleComments.forEach(comment => {
    const item = document.createElement('div');
    item.className = 'article-comment-item';
    item.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span class="comment-author">${escapeHtml(comment.name)}</span>
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
      item.querySelector('.approve-btn').addEventListener('click', () => approveComment(comment.id));
    }
    item.querySelector('.delete-btn').addEventListener('click', () => confirmDelete('ce commentaire', 'comments', comment.id));
    panel.appendChild(item);
  });
}

async function approveComment(id) {
  try {
    const response = await apiFetch(`/admin/comments/${id}/approve`, { method: 'PUT' });
    const body = await response.json();
    if (!response.ok) throw new Error(body.message || 'Erreur');

    const comment = comments.find(c => c.id === id);
    if (comment) comment.approved = true;
    if (comment) renderArticleComments(comment.articleId);
    renderArticles();
    renderDashboardStats();
    showToast('Commentaire approuvé', 'success');
  } catch (error) {
    showToast(error.message || 'Échec de l\'approbation', 'error');
  }
}

// ═══════════════ MES ABONNÉS (téléchargements + messages) ═══════════════

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
    card.className = 'article-card clickable';
    card.innerHTML = `
      <div class="article-card-top">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span class="comment-author">${escapeHtml(msg.name)}</span>
          <span class="comment-article-ref">${escapeHtml(msg.email)}</span>
          ${msg.read ? '' : '<span class="badge badge-orange">Non lu</span>'}
        </div>
        <div class="article-actions">
          <a class="icon-btn" title="Répondre par email" href="mailto:${escapeHtml(msg.email)}?subject=${encodeURIComponent('Re: ' + msg.subject)}">${REPLY_ICON}</a>
          ${msg.read ? '' : `<div class="icon-btn read-btn" title="Marquer comme lu">${APPROVE_ICON}</div>`}
          <div class="icon-btn danger delete-btn" title="Supprimer">${DELETE_ICON}</div>
        </div>
      </div>
      <div class="article-title">${escapeHtml(msg.subject)}</div>
      <div class="comment-message">${escapeHtml(msg.message)}</div>
      <div class="article-meta"><span>${new Date(msg.createdAt).toLocaleDateString('fr-FR')}</span></div>`;
    card.querySelector('.article-actions').addEventListener('click', e => e.stopPropagation());
    if (!msg.read) {
      card.querySelector('.read-btn').addEventListener('click', () => markMessageRead(msg.id));
    }
    card.querySelector('.delete-btn').addEventListener('click', () => confirmDelete('ce message', 'messages', msg.id));
    card.addEventListener('click', () => openMessageDetail(msg.id));
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

function openMessageDetail(id) {
  const msg = messages.find(m => m.id === id);
  if (!msg) return;

  const body = `
    <div class="detail-grid">
      <div class="detail-row"><div class="detail-label">Nom</div><div class="detail-value">${escapeHtml(msg.name)}</div></div>
      <div class="detail-row"><div class="detail-label">Email</div><div class="detail-value">${escapeHtml(msg.email)}</div></div>
    </div>
    <div class="detail-row"><div class="detail-label">Sujet</div><div class="detail-value">${escapeHtml(msg.subject)}</div></div>
    <div class="detail-row"><div class="detail-label">Message</div><div class="detail-value">${escapeHtml(msg.message)}</div></div>
    <div class="detail-row"><div class="detail-label">Reçu le</div><div class="detail-value">${new Date(msg.createdAt).toLocaleString('fr-FR')}</div></div>`;

  const footer = `
    <a class="btn btn-ghost" style="text-decoration:none" href="mailto:${escapeHtml(msg.email)}?subject=${encodeURIComponent('Re: ' + msg.subject)}">${REPLY_ICON} Répondre</a>
    ${!msg.read ? `<button class="btn btn-primary" onclick="closeModal('detail');markMessageRead('${msg.id}')">Marquer comme lu</button>` : ''}
    <button class="btn btn-danger" onclick="closeModal('detail');confirmDelete('ce message','messages','${msg.id}')">${DELETE_ICON} Supprimer</button>`;

  document.getElementById('detail-title').textContent = `Message de ${msg.name}`;
  document.getElementById('detail-body').innerHTML = body;
  document.getElementById('detail-footer').innerHTML = footer;
  showModal('detail');
}

// ═══════════════ DEVIS ═══════════════

function setQuoteFilter(filter, btn) {
  quoteFilter = filter;
  filterToggle(btn);
  renderQuotes();
}

function renderQuotes() {
  const container = document.getElementById('quotes-list');
  if (!container) return;

  const total = quotes.length;
  const unread = quotes.filter(q => !q.read).length;
  const countAll = document.getElementById('quote-count-all');
  const countUnread = document.getElementById('quote-count-unread');
  if (countAll) countAll.textContent = total;
  if (countUnread) countUnread.textContent = unread;

  const visible = quoteFilter === 'unread' ? quotes.filter(q => !q.read) : quotes;

  container.innerHTML = '';
  if (!visible.length) {
    container.innerHTML = '<p style="font-size:12px;color:var(--muted)">Aucune demande de devis.</p>';
    return;
  }

  visible.forEach(quote => {
    const card = document.createElement('div');
    card.className = 'article-card clickable';
    const details = [quote.projectType, quote.budget, quote.phone].filter(Boolean);
    card.innerHTML = `
      <div class="article-card-top">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span class="comment-author">${escapeHtml(quote.name)}</span>
          <span class="comment-article-ref">${escapeHtml(quote.email)}</span>
          ${quote.read ? '' : '<span class="badge badge-orange">Non lu</span>'}
        </div>
        <div class="article-actions">
          <a class="icon-btn" title="Répondre par email" href="mailto:${escapeHtml(quote.email)}?subject=${encodeURIComponent('Re: ta demande de devis')}">${REPLY_ICON}</a>
          ${quote.read ? '' : `<div class="icon-btn read-btn" title="Marquer comme lu">${APPROVE_ICON}</div>`}
          <div class="icon-btn danger delete-btn" title="Supprimer">${DELETE_ICON}</div>
        </div>
      </div>
      ${details.length ? `<div class="article-meta">${details.map(d => `<span>${escapeHtml(d)}</span>`).join('')}</div>` : ''}
      <div class="comment-message">${escapeHtml(quote.description)}</div>
      ${quote.fileUrl ? `<div class="article-meta"><a href="${escapeHtml(quote.fileUrl)}" target="_blank" rel="noopener">📎 ${escapeHtml(quote.fileName || 'fichier joint')}</a></div>` : ''}
      <div class="article-meta"><span>${new Date(quote.createdAt).toLocaleDateString('fr-FR')}</span></div>`;
    card.querySelector('.article-actions').addEventListener('click', e => e.stopPropagation());
    if (!quote.read) {
      card.querySelector('.read-btn').addEventListener('click', () => markQuoteRead(quote.id));
    }
    card.querySelector('.delete-btn').addEventListener('click', () => confirmDelete('cette demande de devis', 'quotes', quote.id));
    card.addEventListener('click', () => openQuoteDetail(quote.id));
    container.appendChild(card);
  });
}

async function markQuoteRead(id) {
  try {
    const response = await apiFetch(`/admin/quotes/${id}/read`, { method: 'PUT' });
    const body = await response.json();
    if (!response.ok) throw new Error(body.message || 'Erreur');

    const quote = quotes.find(q => q.id === id);
    if (quote) quote.read = true;
    renderQuotes();
    renderDashboardStats();
  } catch (error) {
    showToast(error.message || 'Échec de la mise à jour', 'error');
  }
}

function openQuoteDetail(id) {
  const quote = quotes.find(q => q.id === id);
  if (!quote) return;

  const body = `
    <div class="detail-grid">
      <div class="detail-row"><div class="detail-label">Nom</div><div class="detail-value">${escapeHtml(quote.name)}</div></div>
      <div class="detail-row"><div class="detail-label">Email</div><div class="detail-value">${escapeHtml(quote.email)}</div></div>
      <div class="detail-row"><div class="detail-label">Téléphone</div><div class="detail-value">${quote.phone ? escapeHtml(quote.phone) : '—'}</div></div>
      <div class="detail-row"><div class="detail-label">Type de projet</div><div class="detail-value">${quote.projectType ? escapeHtml(quote.projectType) : '—'}</div></div>
      <div class="detail-row"><div class="detail-label">Budget estimé</div><div class="detail-value">${quote.budget ? escapeHtml(quote.budget) : '—'}</div></div>
      <div class="detail-row"><div class="detail-label">Reçu le</div><div class="detail-value">${new Date(quote.createdAt).toLocaleString('fr-FR')}</div></div>
    </div>
    <div class="detail-row"><div class="detail-label">Description du projet</div><div class="detail-value">${escapeHtml(quote.description)}</div></div>
    ${quote.fileUrl ? `<div class="detail-row"><div class="detail-label">Fichier joint</div><div class="detail-value"><a href="${escapeHtml(quote.fileUrl)}" target="_blank" rel="noopener">📎 ${escapeHtml(quote.fileName || 'fichier joint')}</a></div></div>` : ''}`;

  const footer = `
    <a class="btn btn-ghost" style="text-decoration:none" href="mailto:${escapeHtml(quote.email)}?subject=${encodeURIComponent('Re: ta demande de devis')}">${REPLY_ICON} Répondre</a>
    ${!quote.read ? `<button class="btn btn-primary" onclick="closeModal('detail');markQuoteRead('${quote.id}')">Marquer comme lu</button>` : ''}
    <button class="btn btn-danger" onclick="closeModal('detail');confirmDelete('cette demande de devis','quotes','${quote.id}')">${DELETE_ICON} Supprimer</button>`;

  document.getElementById('detail-title').textContent = `Devis de ${quote.name}`;
  document.getElementById('detail-body').innerHTML = body;
  document.getElementById('detail-footer').innerHTML = footer;
  showModal('detail');
}

// ═══════════════ MES ABONNÉS (téléchargements de templates) ═══════════════

function renderAbonnes() {
  const container = document.getElementById('abonnes-list');
  if (!container) return;

  const sorted = [...subscribers].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  container.innerHTML = '';
  if (!sorted.length) {
    container.innerHTML = '<tr><td colspan="5" style="color:var(--muted);font-size:12px">Aucun abonné pour le moment.</td></tr>';
    return;
  }

  sorted.forEach(sub => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${escapeHtml(sub.name || '—')}</td>
      <td class="td-mono">${escapeHtml(sub.email)}</td>
      <td>« ${escapeHtml(sub.projectName)} »</td>
      <td class="td-mono">${new Date(sub.createdAt).toLocaleDateString('fr-FR')}</td>
      <td><div class="icon-btn danger delete-btn" title="Supprimer">${DELETE_ICON}</div></td>`;
    row.querySelector('.delete-btn').addEventListener('click', () => confirmDelete(`l'abonné ${sub.email}`, 'subscribers', sub.id));
    container.appendChild(row);
  });
}

// ═══════════════ COMMANDES ═══════════════

function setCommandesTab(tab, btn) {
  filterToggle(btn);
  const listEl = document.getElementById('commandes-tab-list');
  const reportEl = document.getElementById('commandes-tab-report');
  if (listEl) listEl.style.display = tab === 'list' ? '' : 'none';
  if (reportEl) reportEl.style.display = tab === 'report' ? 'flex' : 'none';
  if (tab === 'report') renderOrdersReport();
}

function setOrderFilter(filter, btn) {
  orderFilter = filter;
  filterToggle(btn);
  renderOrders();
}

function renderOrdersReport() {
  const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };

  const paidOrders = orders.filter(o => o.status === 'paid');
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const currency = paidOrders[0]?.currency || pendingOrders[0]?.currency || 'XOF';

  const revenue = paidOrders.reduce((sum, o) => sum + (o.price || 0), 0);
  const avgOrder = paidOrders.length ? Math.round(revenue / paidOrders.length) : 0;
  const pendingValue = pendingOrders.reduce((sum, o) => sum + (o.price || 0), 0);

  setText('report-revenue', `${revenue.toLocaleString('fr-FR')} ${currency}`);
  setText('report-revenue-sub', `${paidOrders.length} vente${paidOrders.length > 1 ? 's' : ''} confirmée${paidOrders.length > 1 ? 's' : ''}`);
  setText('report-sales-count', paidOrders.length);
  setText('report-sales-sub', `${pendingOrders.length} en attente de vérification`);
  setText('report-avg-order', `${avgOrder.toLocaleString('fr-FR')} ${currency}`);
  setText('report-pending-value', `${pendingValue.toLocaleString('fr-FR')} ${currency}`);
  setText('report-pending-sub', `${pendingOrders.length} commande${pendingOrders.length > 1 ? 's' : ''} à vérifier`);

  const byProject = new Map();
  paidOrders.forEach(o => {
    const entry = byProject.get(o.projectName) || { revenue: 0, count: 0, currency: o.currency };
    entry.revenue += o.price || 0;
    entry.count += 1;
    byProject.set(o.projectName, entry);
  });

  const byProjectRows = [...byProject.entries()].sort((a, b) => b[1].revenue - a[1].revenue);
  renderRevenueByTemplateChart(byProjectRows, currency);
  renderRevenueTimeChart(paidOrders, currency);
}

// ─── Graphiques (Chart.js) ───
// Une seule teinte (bleu) pour les deux graphiques : chacun trace UNE série
// (le revenu), ventilée par catégorie nominale (template) ou par date — la
// couleur ne doit pas ré-encoder une information déjà portée par la position
// (voir la règle "un value-ramp sur des catégories nominales" à éviter).
const CHART_BLUE = '#3b82f6';
const CHART_BLUE_WASH = 'rgba(59,130,246,0.1)';
const CHART_GRID = 'rgba(255,255,255,0.06)';
const CHART_MUTED = '#808080';
const CHART_TEXT = '#ebebeb';
const CHART_SURFACE = '#141414';

let revenueTemplateChart = null;
let revenueTimeChart = null;

if (typeof Chart !== 'undefined') {
  Chart.defaults.font.family = "'Geist', sans-serif";
  Chart.defaults.color = CHART_MUTED;
}

function formatCompactAmount(value, currency) {
  return `${Number(value).toLocaleString('fr-FR')} ${currency}`;
}

function renderRevenueByTemplateChart(rows, currency) {
  const canvas = document.getElementById('chart-revenue-template');
  const empty = document.getElementById('report-template-empty');
  const wrap = document.getElementById('report-template-chart-wrap');
  if (!canvas) return;

  if (!rows.length) {
    if (empty) empty.style.display = 'block';
    if (wrap) wrap.style.display = 'none';
    if (revenueTemplateChart) { revenueTemplateChart.destroy(); revenueTemplateChart = null; }
    return;
  }
  if (empty) empty.style.display = 'none';
  if (wrap) { wrap.style.display = ''; wrap.style.height = `${Math.max(120, rows.length * 46)}px`; }

  const labels = rows.map(([name]) => name);
  const values = rows.map(([, entry]) => entry.revenue);
  const counts = rows.map(([, entry]) => entry.count);

  if (revenueTemplateChart) revenueTemplateChart.destroy();
  revenueTemplateChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: CHART_BLUE,
        borderRadius: 4,
        maxBarThickness: 22
      }]
    },
    options: {
      indexAxis: 'y',
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: CHART_SURFACE,
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          titleColor: CHART_MUTED,
          bodyColor: CHART_TEXT,
          displayColors: false,
          padding: 10,
          callbacks: {
            label: (ctx) => {
              const count = counts[ctx.dataIndex];
              return [`${formatCompactAmount(ctx.parsed.x, currency)}`, `${count} vente${count > 1 ? 's' : ''}`];
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: CHART_GRID, drawTicks: false },
          border: { display: false },
          ticks: { callback: (v) => v.toLocaleString('fr-FR') }
        },
        y: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: CHART_TEXT }
        }
      }
    }
  });
}

function renderRevenueTimeChart(paidOrders, currency) {
  const canvas = document.getElementById('chart-revenue-time');
  const empty = document.getElementById('report-time-empty');
  const rangeLabel = document.getElementById('report-time-range');
  if (!canvas) return;

  if (!paidOrders.length) {
    if (empty) empty.style.display = 'block';
    canvas.style.display = 'none';
    if (rangeLabel) rangeLabel.textContent = '—';
    if (revenueTimeChart) { revenueTimeChart.destroy(); revenueTimeChart = null; }
    return;
  }
  if (empty) empty.style.display = 'none';
  canvas.style.display = '';

  const byDay = new Map();
  paidOrders.forEach(o => {
    const day = new Date(o.paidAt || o.createdAt).toISOString().slice(0, 10);
    byDay.set(day, (byDay.get(day) || 0) + (o.price || 0));
  });

  const days = [...byDay.keys()].sort();
  let running = 0;
  const values = days.map(day => {
    running += byDay.get(day);
    return running;
  });
  const labels = days.map(day => new Date(day).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }));
  const fullDates = days.map(day => new Date(day).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }));

  if (rangeLabel) {
    rangeLabel.textContent = days.length > 1 ? `${labels[0]} → ${labels[labels.length - 1]}` : labels[0];
  }

  if (revenueTimeChart) revenueTimeChart.destroy();
  revenueTimeChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data: values,
        borderColor: CHART_BLUE,
        backgroundColor: CHART_BLUE_WASH,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: CHART_BLUE,
        pointBorderColor: CHART_SURFACE,
        pointBorderWidth: 2,
        fill: true,
        tension: 0.25
      }]
    },
    options: {
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: CHART_SURFACE,
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          titleColor: CHART_MUTED,
          bodyColor: CHART_TEXT,
          displayColors: false,
          padding: 10,
          callbacks: {
            title: (items) => fullDates[items[0].dataIndex],
            label: (ctx) => `Cumulé : ${formatCompactAmount(ctx.parsed.y, currency)}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: CHART_MUTED, autoSkip: true, maxRotation: 0 }
        },
        y: {
          beginAtZero: true,
          grid: { color: CHART_GRID, drawTicks: false },
          border: { display: false },
          ticks: { callback: (v) => v.toLocaleString('fr-FR') }
        }
      }
    }
  });
}

function renderOrders() {
  const container = document.getElementById('orders-list');
  if (!container) return;

  renderOrdersReport();

  const total = orders.length;
  const pending = orders.filter(o => o.status === 'pending').length;
  const paid = orders.filter(o => o.status === 'paid').length;
  document.getElementById('order-count-all').textContent = total;
  document.getElementById('order-count-pending').textContent = pending;
  document.getElementById('order-count-paid').textContent = paid;

  const visible = orders.filter(o => {
    if (orderFilter === 'pending') return o.status === 'pending';
    if (orderFilter === 'paid') return o.status === 'paid';
    return true;
  });

  container.innerHTML = '';
  if (!visible.length) {
    container.innerHTML = '<p style="font-size:12px;color:var(--muted)">Aucune commande.</p>';
    return;
  }

  visible.forEach(order => {
    const downloadLink = order.status === 'paid' ? `${location.origin}/api/orders/${order.downloadToken}/download` : '';
    const card = document.createElement('div');
    card.className = 'article-card clickable';
    card.innerHTML = `
      <div class="article-card-top">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span class="comment-author">${escapeHtml(order.buyerName)}</span>
          <span class="comment-article-ref">${escapeHtml(order.buyerEmail)}</span>
          <span class="badge ${order.status === 'paid' ? 'badge-green' : 'badge-orange'}">${order.status === 'paid' ? 'Payée' : 'En attente'}</span>
        </div>
        <div class="article-actions">
          ${order.status === 'pending' ? `<div class="icon-btn approve-btn" title="Marquer payé">${APPROVE_ICON}</div>` : ''}
          <div class="icon-btn danger delete-btn" title="Supprimer">${DELETE_ICON}</div>
        </div>
      </div>
      <div class="article-title">${escapeHtml(order.projectName)} — ${escapeHtml(String(order.price))} ${escapeHtml(order.currency || 'XOF')}</div>
      <div class="comment-message">
        ${order.buyerPhone ? `Téléphone : ${escapeHtml(order.buyerPhone)}<br>` : ''}
        ${order.proofMethod === 'receipt'
          ? `Preuve : <a href="${escapeHtml(order.receiptFileUrl)}" target="_blank" rel="noopener">voir le reçu PDF (${escapeHtml(order.receiptFileName || 'recu.pdf')})</a>`
          : `Preuve : numéro Wave <strong>${escapeHtml(order.waveNumber)}</strong> · transaction <strong>${escapeHtml(order.transactionId)}</strong>`}
      </div>
      ${downloadLink ? `
        <div class="order-download-row" style="display:flex;align-items:center;gap:8px;margin-top:6px">
          <input class="form-input mono" style="font-size:11px" readonly value="${escapeHtml(downloadLink)}">
          <button class="btn btn-ghost copy-link-btn" style="font-size:12px;flex-shrink:0">Copier</button>
          <span style="font-size:11px;color:var(--muted);font-family:var(--mono);flex-shrink:0">${order.downloadCount || 0}/${order.maxDownloads || 2} utilisés</span>
        </div>` : ''}
      <div class="article-meta"><span>Commandé le ${new Date(order.createdAt).toLocaleDateString('fr-FR')}</span>${order.paidAt ? `<span>Payé le ${new Date(order.paidAt).toLocaleDateString('fr-FR')}</span>` : ''}</div>`;
    card.querySelector('.article-actions').addEventListener('click', e => e.stopPropagation());
    card.querySelector('.order-download-row')?.addEventListener('click', e => e.stopPropagation());
    if (order.status === 'pending') {
      card.querySelector('.approve-btn').addEventListener('click', () => markOrderPaid(order.id));
    }
    if (downloadLink) {
      card.querySelector('.copy-link-btn').addEventListener('click', () => copyOrderLink(downloadLink));
    }
    card.querySelector('.delete-btn').addEventListener('click', () => confirmDelete(`la commande de ${order.buyerName}`, 'orders', order.id));
    card.addEventListener('click', () => openOrderDetail(order.id));
    container.appendChild(card);
  });
}

function openOrderDetail(id) {
  const order = orders.find(o => o.id === id);
  if (!order) return;
  const downloadLink = order.status === 'paid' ? `${location.origin}/api/orders/${order.downloadToken}/download` : '';

  const body = `
    <div class="detail-grid">
      <div class="detail-row"><div class="detail-label">Acheteur</div><div class="detail-value">${escapeHtml(order.buyerName)}</div></div>
      <div class="detail-row"><div class="detail-label">Email</div><div class="detail-value">${escapeHtml(order.buyerEmail)}</div></div>
      <div class="detail-row"><div class="detail-label">Téléphone</div><div class="detail-value">${order.buyerPhone ? escapeHtml(order.buyerPhone) : '—'}</div></div>
      <div class="detail-row"><div class="detail-label">Statut</div><div class="detail-value"><span class="badge ${order.status === 'paid' ? 'badge-green' : 'badge-orange'}">${order.status === 'paid' ? 'Payée' : 'En attente'}</span></div></div>
      <div class="detail-row"><div class="detail-label">Projet</div><div class="detail-value">${escapeHtml(order.projectName)}</div></div>
      <div class="detail-row"><div class="detail-label">Prix</div><div class="detail-value">${escapeHtml(String(order.price))} ${escapeHtml(order.currency || 'XOF')}</div></div>
      <div class="detail-row"><div class="detail-label">Commandé le</div><div class="detail-value">${new Date(order.createdAt).toLocaleString('fr-FR')}</div></div>
      ${order.paidAt ? `<div class="detail-row"><div class="detail-label">Payé le</div><div class="detail-value">${new Date(order.paidAt).toLocaleString('fr-FR')}</div></div>` : ''}
    </div>
    <div class="detail-row">
      <div class="detail-label">Preuve de paiement</div>
      <div class="detail-value">${order.proofMethod === 'receipt'
        ? `<a href="${escapeHtml(order.receiptFileUrl)}" target="_blank" rel="noopener">voir le reçu PDF (${escapeHtml(order.receiptFileName || 'recu.pdf')})</a>`
        : `Numéro Wave <strong>${escapeHtml(order.waveNumber)}</strong> · transaction <strong>${escapeHtml(order.transactionId)}</strong>`}</div>
    </div>
    ${downloadLink ? `
    <div class="detail-row">
      <div class="detail-label">Lien de téléchargement (${order.downloadCount || 0}/${order.maxDownloads || 2} utilisés)</div>
      <div class="detail-value" style="display:flex;align-items:center;gap:8px">
        <input class="form-input mono" style="font-size:11px" readonly value="${escapeHtml(downloadLink)}">
        <button class="btn btn-ghost" style="font-size:12px;flex-shrink:0" onclick="copyOrderLink('${downloadLink}')">Copier</button>
      </div>
    </div>` : ''}`;

  const footer = `
    ${order.status === 'pending' ? `<button class="btn btn-primary" onclick="closeModal('detail');markOrderPaid('${order.id}')">Marquer payé</button>` : ''}
    <button class="btn btn-danger" id="detail-delete-order-btn">${DELETE_ICON} Supprimer</button>`;

  document.getElementById('detail-title').textContent = `Commande de ${order.buyerName}`;
  document.getElementById('detail-body').innerHTML = body;
  document.getElementById('detail-footer').innerHTML = footer;
  // buyerName est saisi par un visiteur non authentifié : on l'attache via addEventListener plutôt
  // que de l'interpoler dans un attribut onclick="", pour ne pas pouvoir casser le JS avec une apostrophe.
  document.getElementById('detail-delete-order-btn').addEventListener('click', () => {
    closeModal('detail');
    confirmDelete(`la commande de ${order.buyerName}`, 'orders', order.id);
  });
  showModal('detail');
}

async function copyOrderLink(link) {
  try {
    await navigator.clipboard.writeText(link);
    showToast('Lien copié', 'success');
  } catch (error) {
    showToast('Échec de la copie', 'error');
  }
}

async function markOrderPaid(id) {
  try {
    const response = await apiFetch(`/admin/orders/${id}/mark-paid`, { method: 'PUT' });
    const body = await response.json();
    if (!response.ok) throw new Error(body.message || 'Erreur');

    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) orders[index] = body.order;
    renderOrders();
    renderDashboardStats();
    showToast('Commande marquée payée — copie le lien pour l\'envoyer à l\'acheteur', 'success');
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
  document.getElementById('edit-projet-category').value = project.category || 'Fullstack';
  document.getElementById('edit-projet-demo').value = project.demo || '';
  document.getElementById('edit-projet-github').value = project.github || '';
  document.getElementById('edit-projet-tech').value = (project.tech || []).join(', ');
  setProjectImagePreview(project.imageUrl || '');
  document.getElementById('edit-projet-download-type').value = project.downloadType || 'none';
  document.getElementById('edit-projet-price').value = project.price || '';
  document.getElementById('edit-projet-payment-link').value = project.paymentLink || '';
  toggleDownloadPriceField('edit-projet');
  setProjectDownloadFilename(project.downloadFileName || '', 'edit-projet');
  showModal('edit-projet');
}

function toggleDownloadPriceField(prefix) {
  const type = document.getElementById(`${prefix}-download-type`).value;
  const display = type === 'paid' ? '' : 'none';
  const priceGroup = document.getElementById(`${prefix}-price-group`);
  if (priceGroup) priceGroup.style.display = display;
  const linkGroup = document.getElementById(`${prefix}-payment-link-group`);
  if (linkGroup) linkGroup.style.display = display;
}

function setProjectDownloadFilename(name, prefix = 'edit-projet') {
  const label = document.getElementById(`${prefix}-download-filename`);
  if (label) label.textContent = name || 'Aucun fichier';
  const removeBtn = document.getElementById(`${prefix}-download-remove`);
  if (removeBtn) removeBtn.style.display = name ? '' : 'none';
}

function setProjectImagePreview(url, prefix = 'edit-projet') {
  const img = document.getElementById(`${prefix}-image-preview`);
  const placeholder = document.getElementById(`${prefix}-image-placeholder`);
  if (url) {
    img.src = url;
    img.style.display = 'block';
    placeholder.style.display = 'none';
  } else {
    img.style.display = 'none';
    placeholder.style.display = '';
  }
}

async function uploadProjectImageFile(projectId, file) {
  const formData = new FormData();
  formData.append('image', file);

  const token = getToken();
  const response = await fetch(`${API_BASE}/admin/projects/${projectId}/image`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData
  });
  if (response.status === 401) {
    clearToken();
    showLoginScreen();
    throw new Error('Non autorisé');
  }
  const body = await response.json();
  if (!response.ok) throw new Error(body.message || 'Erreur');
  return body;
}

async function uploadProjectImage(event) {
  const file = event.target.files[0];
  if (!file || !editingProjectId) return;

  try {
    const body = await uploadProjectImageFile(editingProjectId, file);
    const index = portfolio.projects.findIndex(p => p.id === editingProjectId);
    if (index !== -1) portfolio.projects[index] = body.project;
    setProjectImagePreview(body.imageUrl);
    renderProjects();
    showToast('Image mise à jour', 'success');
  } catch (error) {
    showToast(error.message || 'Échec de l\'upload', 'error');
  } finally {
    event.target.value = '';
  }
}

function resetNewProjectImage() {
  newProjectImageFile = null;
  setProjectImagePreview('', 'new-projet');
  const input = document.getElementById('new-projet-image-file');
  if (input) input.value = '';
}

function handleNewProjectImageSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  newProjectImageFile = file;
  const reader = new FileReader();
  reader.onload = () => setProjectImagePreview(reader.result, 'new-projet');
  reader.readAsDataURL(file);
}

async function uploadProjectDownloadFileRequest(projectId, file) {
  const formData = new FormData();
  formData.append('file', file);

  const token = getToken();
  const response = await fetch(`${API_BASE}/admin/projects/${projectId}/download-file`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData
  });
  if (response.status === 401) {
    clearToken();
    showLoginScreen();
    throw new Error('Non autorisé');
  }
  const body = await response.json();
  if (!response.ok) throw new Error(body.message || 'Erreur');
  return body;
}

async function uploadProjectDownloadFile(event) {
  const file = event.target.files[0];
  if (!file || !editingProjectId) return;

  try {
    const body = await uploadProjectDownloadFileRequest(editingProjectId, file);
    const index = portfolio.projects.findIndex(p => p.id === editingProjectId);
    if (index !== -1) portfolio.projects[index] = body.project;
    setProjectDownloadFilename(body.downloadFileName, 'edit-projet');
    renderProjects();
    showToast('Fichier mis à jour', 'success');
  } catch (error) {
    showToast(error.message || 'Échec de l\'upload', 'error');
  } finally {
    event.target.value = '';
  }
}

async function removeProjectDownloadFile() {
  if (!editingProjectId) return;
  try {
    const response = await apiFetch(`/admin/projects/${editingProjectId}/download-file`, { method: 'DELETE' });
    const body = await response.json();
    if (!response.ok) throw new Error(body.message || 'Erreur');

    const index = portfolio.projects.findIndex(p => p.id === editingProjectId);
    if (index !== -1) portfolio.projects[index] = body.project;
    setProjectDownloadFilename('', 'edit-projet');
    renderProjects();
    showToast('Fichier supprimé', 'success');
  } catch (error) {
    showToast(error.message || 'Échec de la suppression', 'error');
  }
}

function resetNewProjectDownload() {
  newProjectDownloadFile = null;
  setProjectDownloadFilename('', 'new-projet');
  const typeSelect = document.getElementById('new-projet-download-type');
  if (typeSelect) typeSelect.value = 'none';
  const priceInput = document.getElementById('new-projet-price');
  if (priceInput) priceInput.value = '';
  const linkInput = document.getElementById('new-projet-payment-link');
  if (linkInput) linkInput.value = '';
  toggleDownloadPriceField('new-projet');
  const input = document.getElementById('new-projet-download-file');
  if (input) input.value = '';
}

function handleNewProjectDownloadFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  newProjectDownloadFile = file;
  setProjectDownloadFilename(file.name, 'new-projet');
}

function parseTechInput(value) {
  return value.split(',').map(t => t.trim()).filter(Boolean);
}

async function submitNewProject() {
  const downloadType = document.getElementById('new-projet-download-type').value;
  const payload = {
    name: document.getElementById('new-projet-name').value.trim(),
    description: document.getElementById('new-projet-description').value.trim(),
    status: document.getElementById('new-projet-status').value,
    category: document.getElementById('new-projet-category').value,
    demo: document.getElementById('new-projet-demo').value.trim(),
    github: document.getElementById('new-projet-github').value.trim(),
    tech: parseTechInput(document.getElementById('new-projet-tech').value),
    downloadType,
    price: downloadType === 'paid' ? Number(document.getElementById('new-projet-price').value) || 0 : 0,
    paymentLink: document.getElementById('new-projet-payment-link').value.trim()
  };
  if (!payload.name || !payload.description) {
    showToast('Nom et description sont requis', 'error');
    return;
  }

  try {
    const response = await apiFetch('/admin/projects', { method: 'POST', body: JSON.stringify(payload) });
    const body = await response.json();
    if (!response.ok) throw new Error(body.message || 'Erreur');

    let project = body.project;
    if (newProjectImageFile) {
      try {
        const imageBody = await uploadProjectImageFile(project.id, newProjectImageFile);
        project = imageBody.project;
      } catch (imageError) {
        showToast(imageError.message || 'Projet créé, mais échec de l\'upload de l\'image', 'error');
      }
    }
    if (newProjectDownloadFile) {
      try {
        const fileBody = await uploadProjectDownloadFileRequest(project.id, newProjectDownloadFile);
        project = fileBody.project;
      } catch (fileError) {
        showToast(fileError.message || 'Projet créé, mais échec de l\'upload du fichier', 'error');
      }
    }

    portfolio.projects.push(project);
    ['name', 'description', 'demo', 'github', 'tech'].forEach(field => {
      document.getElementById(`new-projet-${field}`).value = '';
    });
    resetNewProjectImage();
    resetNewProjectDownload();
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
  const editDownloadType = document.getElementById('edit-projet-download-type').value;
  const payload = {
    name: document.getElementById('edit-projet-name').value.trim(),
    description: document.getElementById('edit-projet-description').value.trim(),
    status: document.getElementById('edit-projet-status').value,
    category: document.getElementById('edit-projet-category').value,
    demo: document.getElementById('edit-projet-demo').value.trim(),
    github: document.getElementById('edit-projet-github').value.trim(),
    tech: parseTechInput(document.getElementById('edit-projet-tech').value),
    downloadType: editDownloadType,
    price: editDownloadType === 'paid' ? Number(document.getElementById('edit-projet-price').value) || 0 : 0,
    paymentLink: document.getElementById('edit-projet-payment-link').value.trim()
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
    if (type === 'quotes') quotes = quotes.filter(q => q.id !== id);
    if (type === 'subscribers') subscribers = subscribers.filter(s => s.id !== id);
    if (type === 'orders') orders = orders.filter(o => o.id !== id);
    renderProjects();
    renderArticles();
    renderMessages();
    renderQuotes();
    renderAbonnes();
    renderOrders();
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

// Repère si l'admin est en train de taper ou a une modale ouverte, pour ne jamais
// écraser une saisie en cours pendant le rafraîchissement automatique en arrière-plan.
function isAdminBusy() {
  const active = document.activeElement;
  const editingField = active && ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName);
  const modalOpen = document.querySelector('.modal-overlay.open:not(#login-screen)');
  return Boolean(editingField || modalOpen);
}

setInterval(() => {
  if (!getToken() || isAdminBusy()) return;
  init({ silent: true });
}, 15000);
