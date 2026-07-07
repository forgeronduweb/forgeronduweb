const express = require('express');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const Message = require('../models/Message');
const Settings = require('../models/Settings');

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({ ok: true, message: 'Backend connecté' });
});

router.get('/portfolio', async (_req, res) => {
  const [profile, projects, articles, settings] = await Promise.all([
    Profile.findOne(),
    Project.find(),
    Article.find(),
    Settings.findOne()
  ]);

  res.json({ profile, projects, articles, settings });
});

router.post('/articles/:id/like', async (req, res) => {
  const article = await Article.findOneAndUpdate(
    { id: req.params.id },
    { $inc: { likes: 1 } },
    { returnDocument: 'after' }
  );
  if (!article) return res.status(404).json({ ok: false, message: 'Article introuvable' });
  res.json({ ok: true, likes: article.likes });
});

router.delete('/articles/:id/like', async (req, res) => {
  const article = await Article.findOneAndUpdate(
    { id: req.params.id },
    { $inc: { likes: -1 } },
    { returnDocument: 'after' }
  );
  if (!article) return res.status(404).json({ ok: false, message: 'Article introuvable' });
  if (article.likes < 0) {
    article.likes = 0;
    await article.save();
  }
  res.json({ ok: true, likes: article.likes });
});

router.post('/articles/:id/share', async (req, res) => {
  const article = await Article.findOneAndUpdate(
    { id: req.params.id },
    { $inc: { shares: 1 } },
    { returnDocument: 'after' }
  );
  if (!article) return res.status(404).json({ ok: false, message: 'Article introuvable' });
  res.json({ ok: true, shares: article.shares });
});

router.get('/articles/:id/comments', async (req, res) => {
  const comments = await Comment.find({ articleId: req.params.id, approved: true }).sort({ createdAt: 1 });
  res.json({ ok: true, comments });
});

router.post('/articles/:id/comments', async (req, res) => {
  const { name, message } = req.body || {};
  if (!name || !message) {
    return res.status(400).json({ ok: false, message: 'Nom et message sont requis' });
  }

  const article = await Article.findOne({ id: req.params.id });
  if (!article) return res.status(404).json({ ok: false, message: 'Article introuvable' });

  await Comment.create({ articleId: req.params.id, name, message, approved: false });
  res.status(201).json({ ok: true, message: 'Commentaire envoyé, en attente de validation' });
});

router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ ok: false, message: 'Tous les champs sont requis' });
  }

  await Message.create({ name, email, subject, message });
  res.json({ ok: true, message: 'Message reçu avec succès' });
});

module.exports = router;
