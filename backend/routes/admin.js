const express = require('express');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const Message = require('../models/Message');
const { signToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';
}

async function uniqueId(baseText, Model) {
  const base = slugify(baseText);
  let id = base;
  let suffix = 2;
  while (await Model.exists({ id })) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }
  return id;
}

router.post('/login', (req, res) => {
  const { password } = req.body || {};
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ ok: false, message: 'Mot de passe incorrect' });
  }
  res.json({ ok: true, token: signToken() });
});

router.use(requireAdmin);

router.put('/profile', async (req, res) => {
  const { name, role, location, email, website, github, linkedin, instagram, status, availabilityMessage, bio, stack } = req.body || {};
  if (!name || !role || !email) {
    return res.status(400).json({ ok: false, message: 'Nom, rôle et email sont requis' });
  }

  const profile = await Profile.findOneAndUpdate(
    {},
    {
      name,
      role,
      location: location || '',
      email,
      website: website || '',
      github: github || '',
      linkedin: linkedin || '',
      instagram: instagram || '',
      status: status || '',
      availabilityMessage: availabilityMessage || '',
      bio: bio || '',
      stack: Array.isArray(stack) ? stack : []
    },
    { upsert: true, returnDocument: 'after' }
  );
  res.json({ ok: true, profile });
});

router.post('/projects', async (req, res) => {
  const { name, description, status, tech, demo, github } = req.body || {};
  if (!name || !description) {
    return res.status(400).json({ ok: false, message: 'Nom et description sont requis' });
  }

  const project = await Project.create({
    id: await uniqueId(name, Project),
    name,
    description,
    status: status || 'En cours',
    tech: Array.isArray(tech) ? tech : [],
    demo: demo || '',
    github: github || ''
  });
  res.status(201).json({ ok: true, project });
});

router.put('/projects/:id', async (req, res) => {
  const { name, description, status, tech, demo, github } = req.body || {};
  if (!name || !description) {
    return res.status(400).json({ ok: false, message: 'Nom et description sont requis' });
  }

  const project = await Project.findOneAndUpdate(
    { id: req.params.id },
    {
      name,
      description,
      ...(status ? { status } : {}),
      ...(Array.isArray(tech) ? { tech } : {}),
      ...(demo !== undefined ? { demo } : {}),
      ...(github !== undefined ? { github } : {})
    },
    { returnDocument: 'after' }
  );
  if (!project) return res.status(404).json({ ok: false, message: 'Projet introuvable' });
  res.json({ ok: true, project });
});

router.delete('/projects/:id', async (req, res) => {
  const project = await Project.findOneAndDelete({ id: req.params.id });
  if (!project) return res.status(404).json({ ok: false, message: 'Projet introuvable' });
  res.json({ ok: true });
});

router.post('/articles', async (req, res) => {
  const { title, excerpt, content, category, published, date } = req.body || {};
  if (!title || !excerpt) {
    return res.status(400).json({ ok: false, message: 'Titre et extrait sont requis' });
  }

  const article = await Article.create({
    id: await uniqueId(title, Article),
    title,
    excerpt,
    content: content || '',
    category: category || 'Général',
    published: Boolean(published),
    date: date || new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  });
  res.status(201).json({ ok: true, article });
});

router.put('/articles/:id', async (req, res) => {
  const { title, excerpt, content, category, published, date } = req.body || {};
  if (!title || !excerpt) {
    return res.status(400).json({ ok: false, message: 'Titre et extrait sont requis' });
  }

  const article = await Article.findOneAndUpdate(
    { id: req.params.id },
    {
      title,
      excerpt,
      ...(content !== undefined ? { content } : {}),
      ...(category ? { category } : {}),
      ...(published !== undefined ? { published: Boolean(published) } : {}),
      ...(date ? { date } : {})
    },
    { returnDocument: 'after' }
  );
  if (!article) return res.status(404).json({ ok: false, message: 'Article introuvable' });
  res.json({ ok: true, article });
});

router.delete('/articles/:id', async (req, res) => {
  const article = await Article.findOneAndDelete({ id: req.params.id });
  if (!article) return res.status(404).json({ ok: false, message: 'Article introuvable' });
  res.json({ ok: true });
});

router.get('/comments', async (_req, res) => {
  const [comments, articles] = await Promise.all([
    Comment.find().sort({ createdAt: -1 }),
    Article.find()
  ]);
  const titleById = new Map(articles.map(a => [a.id, a.title]));

  res.json({
    ok: true,
    comments: comments.map(c => ({ ...c.toJSON(), articleTitle: titleById.get(c.articleId) || c.articleId }))
  });
});

router.put('/comments/:id/approve', async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(req.params.id, { approved: true }, { returnDocument: 'after' });
  if (!comment) return res.status(404).json({ ok: false, message: 'Commentaire introuvable' });
  res.json({ ok: true, comment });
});

router.delete('/comments/:id', async (req, res) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);
  if (!comment) return res.status(404).json({ ok: false, message: 'Commentaire introuvable' });
  res.json({ ok: true });
});

router.get('/messages', async (_req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json({ ok: true, messages });
});

router.put('/messages/:id/read', async (req, res) => {
  const message = await Message.findByIdAndUpdate(req.params.id, { read: true }, { returnDocument: 'after' });
  if (!message) return res.status(404).json({ ok: false, message: 'Message introuvable' });
  res.json({ ok: true, message });
});

router.delete('/messages/:id', async (req, res) => {
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) return res.status(404).json({ ok: false, message: 'Message introuvable' });
  res.json({ ok: true });
});

module.exports = router;
