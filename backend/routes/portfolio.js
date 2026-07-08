const express = require('express');
const multer = require('multer');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const Message = require('../models/Message');
const Order = require('../models/Order');
const Settings = require('../models/Settings');
const { publicWriteLimiter } = require('../middleware/rateLimit');

const router = express.Router();

const receiptUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!['application/pdf', 'application/octet-stream'].includes(file.mimetype)) {
      return cb(new Error('Le reçu doit être un fichier PDF'));
    }
    cb(null, true);
  }
});

function isPdfBuffer(buffer) {
  return Boolean(buffer) && buffer.length >= 4 && buffer.toString('ascii', 0, 4) === '%PDF';
}

function handleReceiptUpload(req, res, next) {
  receiptUpload.single('receipt')(req, res, (err) => {
    if (err) return res.status(400).json({ ok: false, message: err.message });
    next();
  });
}

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

  // Le fichier d'un projet payant ne doit jamais être exposé publiquement avant
  // qu'une commande ne soit confirmée payée — voir GET /orders/:token/download.
  const safeProjects = projects.map(project => {
    const json = project.toJSON();
    if (json.downloadType === 'paid') {
      json.downloadFileUrl = '';
      json.downloadFileName = '';
    }
    return json;
  });

  res.json({ profile, projects: safeProjects, articles, settings });
});

router.post('/orders', publicWriteLimiter, handleReceiptUpload, async (req, res) => {
  const { projectId, buyerName, buyerEmail, buyerPhone, proofMethod, waveNumber, transactionId } = req.body || {};
  if (!projectId || !buyerName || !buyerEmail) {
    return res.status(400).json({ ok: false, message: 'Projet, nom et email sont requis' });
  }

  const project = await Project.findOne({ id: projectId });
  if (!project || project.downloadType !== 'paid') {
    return res.status(404).json({ ok: false, message: 'Projet introuvable ou non payant' });
  }

  const usingReceipt = proofMethod === 'receipt';
  if (usingReceipt) {
    if (!req.file) return res.status(400).json({ ok: false, message: 'Merci de joindre le reçu de paiement (PDF)' });
    if (!isPdfBuffer(req.file.buffer)) {
      return res.status(400).json({ ok: false, message: 'Le reçu ne semble pas être un fichier PDF valide' });
    }
  } else if (!waveNumber || !transactionId) {
    return res.status(400).json({ ok: false, message: 'Numéro Wave et ID de transaction sont requis' });
  }

  const order = await Order.create({
    projectId: project.id,
    projectName: project.name,
    price: project.price,
    currency: project.currency,
    buyerName,
    buyerEmail,
    buyerPhone: buyerPhone || '',
    proofMethod: usingReceipt ? 'receipt' : 'transaction',
    waveNumber: usingReceipt ? '' : waveNumber,
    transactionId: usingReceipt ? '' : transactionId,
    receiptFileUrl: usingReceipt ? `data:application/pdf;base64,${req.file.buffer.toString('base64')}` : '',
    receiptFileName: usingReceipt ? req.file.originalname : ''
  });
  res.status(201).json({ ok: true, order });
});

router.get('/orders/:token/download', async (req, res) => {
  const order = await Order.findOne({ downloadToken: req.params.token, status: 'paid' });
  if (!order) return res.status(404).json({ ok: false, message: 'Lien invalide ou expiré' });

  const project = await Project.findOne({ id: order.projectId });
  if (!project || !project.downloadFileUrl) {
    return res.status(404).json({ ok: false, message: 'Fichier introuvable' });
  }

  const match = /^data:([^;]+);base64,(.+)$/.exec(project.downloadFileUrl);
  if (!match) return res.status(404).json({ ok: false, message: 'Fichier introuvable' });

  const [, mimetype, base64Data] = match;
  res.set('Content-Type', mimetype);
  res.set('Content-Disposition', `attachment; filename="${project.downloadFileName || project.name}"`);
  res.send(Buffer.from(base64Data, 'base64'));
});

router.post('/articles/:id/like', publicWriteLimiter, async (req, res) => {
  const article = await Article.findOneAndUpdate(
    { id: req.params.id },
    { $inc: { likes: 1 } },
    { returnDocument: 'after' }
  );
  if (!article) return res.status(404).json({ ok: false, message: 'Article introuvable' });
  res.json({ ok: true, likes: article.likes });
});

router.delete('/articles/:id/like', publicWriteLimiter, async (req, res) => {
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

router.post('/articles/:id/share', publicWriteLimiter, async (req, res) => {
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

router.post('/articles/:id/comments', publicWriteLimiter, async (req, res) => {
  const { name, message } = req.body || {};
  if (!name || !message) {
    return res.status(400).json({ ok: false, message: 'Nom et message sont requis' });
  }

  const article = await Article.findOne({ id: req.params.id });
  if (!article) return res.status(404).json({ ok: false, message: 'Article introuvable' });

  await Comment.create({ articleId: req.params.id, name, message, approved: false });
  res.status(201).json({ ok: true, message: 'Commentaire envoyé, en attente de validation' });
});

router.post('/contact', publicWriteLimiter, async (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ ok: false, message: 'Tous les champs sont requis' });
  }

  await Message.create({ name, email, subject, message });
  res.json({ ok: true, message: 'Message reçu avec succès' });
});

module.exports = router;
