const express = require('express');
const crypto = require('crypto');
const multer = require('multer');
const geoip = require('geoip-lite');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const Message = require('../models/Message');
const Order = require('../models/Order');
const Quote = require('../models/Quote');
const Subscriber = require('../models/Subscriber');
const Visit = require('../models/Visit');
const Settings = require('../models/Settings');
const { publicWriteLimiter, trackingLimiter, publicReadLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// Liste non-exhaustive mais couvre la grande majorité du trafic robots (moteurs de recherche,
// previews de réseaux sociaux, monitoring, clients HTTP en ligne de commande...).
const BOT_UA_PATTERN = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegrambot|discordbot|slackbot|curl|wget|python-requests|axios|headlesschrome|phantomjs|puppeteer|playwright|postman|uptimerobot|pingdom|ahrefsbot|semrushbot|mj12bot|dotbot/i;

function detectDevice(userAgent) {
  const ua = String(userAgent || '');
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  if (/mobile|android|iphone|ipod/i.test(ua)) return 'mobile';
  return 'desktop';
}

function hashVisitor(ip, userAgent) {
  const day = new Date().toISOString().slice(0, 10);
  return crypto.createHash('sha256').update(`${ip}|${userAgent}|${day}`).digest('hex');
}

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

const quoteUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/zip',
      'application/x-zip-compressed',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/octet-stream'
    ];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Format non supporté (PDF, ZIP, DOC/DOCX, JPG, PNG ou WebP)'));
    }
    cb(null, true);
  }
});

function handleQuoteUpload(req, res, next) {
  quoteUpload.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ ok: false, message: err.message });
    next();
  });
}

// Le Content-Type déclaré par le client est falsifiable : on retrouve le vrai type via les
// premiers octets du fichier avant de le stocker, comme pour les reçus et médias admin.
function detectQuoteFileMimetype(buffer, declaredMimetype) {
  if (!buffer || buffer.length < 4) return null;
  if (buffer.toString('ascii', 0, 4) === '%PDF') return 'application/pdf';
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return 'image/png';
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg';
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  if (buffer[0] === 0x50 && buffer[1] === 0x4b && [0x03, 0x05, 0x07].includes(buffer[2])) {
    return declaredMimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ? declaredMimetype
      : 'application/zip';
  }
  if (buffer[0] === 0xd0 && buffer[1] === 0xcf && buffer[2] === 0x11 && buffer[3] === 0xe0) return 'application/msword';
  return null;
}

router.get('/health', publicReadLimiter, (_req, res) => {
  res.json({ ok: true, message: 'Backend connecté' });
});

router.get('/portfolio', publicReadLimiter, async (req, res) => {
  const [profile, projects, articles, settings] = await Promise.all([
    Profile.findOne(),
    Project.find(),
    Article.find({ published: true }),
    Settings.findOne()
  ]);

  // Le contenu d'un fichier téléchargeable (gratuit ou payant) ne doit jamais être exposé
  // publiquement avant que la commande ne soit payée (voir GET /orders/:token/download) ou
  // que l'email de l'acheteur n'ait été collecté (voir POST /subscribers). Le nom du fichier
  // reste visible : c'est une simple métadonnée, pas une donnée sensible.
  const safeProjects = projects.map(project => {
    const json = project.toJSON();
    if (json.downloadType !== 'none') {
      json.downloadFileUrl = '';
    }
    return json;
  });

  // Cette réponse embarque les images (avatar, projets) en base64 et peut donc peser plusieurs
  // centaines de Ko. Un ETag évite de retransmettre tout ce poids à chaque visite tant que rien
  // n'a changé côté admin : le navigateur reçoit un 304 (quelques octets) au lieu du JSON complet.
  const body = JSON.stringify({ profile, projects: safeProjects, articles, settings });
  const etag = `"${crypto.createHash('sha1').update(body).digest('hex')}"`;
  res.set('Cache-Control', 'no-cache');
  res.set('ETag', etag);
  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end();
  }
  res.type('application/json').send(body);
});

router.post('/orders', publicWriteLimiter, handleReceiptUpload, async (req, res) => {
  const { projectId, buyerName, buyerEmail, buyerPhone, proofMethod, waveNumber, transactionId } = req.body || {};
  if (typeof projectId !== 'string' || !projectId || !buyerName || !buyerEmail) {
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

router.post('/subscribers', publicWriteLimiter, async (req, res) => {
  const { projectId, email, name } = req.body || {};
  if (typeof projectId !== 'string' || !projectId || !email) {
    return res.status(400).json({ ok: false, message: 'Projet et email sont requis' });
  }

  const project = await Project.findOne({ id: projectId });
  if (!project || project.downloadType !== 'free' || !project.downloadFileUrl) {
    return res.status(404).json({ ok: false, message: 'Fichier gratuit introuvable pour ce projet' });
  }

  await Subscriber.create({ email, name: name || '', projectId: project.id, projectName: project.name });
  res.status(201).json({ ok: true, downloadUrl: project.downloadFileUrl, downloadFileName: project.downloadFileName });
});

router.get('/orders/:token/download', publicWriteLimiter, async (req, res) => {
  // Le token est un secret aléatoire de 192 bits (voir Order.generateDownloadToken) : il ne peut
  // pas être deviné ni brute-forcé. La seule protection supplémentaire nécessaire est de limiter
  // le nombre de fois où un lien valide peut être utilisé, ci-dessous via downloadCount/maxDownloads.
  const order = await Order.findOne({ downloadToken: req.params.token, status: 'paid' });
  if (!order) return res.status(404).json({ ok: false, message: 'Lien invalide ou expiré' });

  if (order.downloadCount >= order.maxDownloads) {
    return res.status(403).json({ ok: false, message: 'Ce lien a atteint son nombre maximum de téléchargements' });
  }

  const project = await Project.findOne({ id: order.projectId });
  if (!project || !project.downloadFileUrl) {
    return res.status(404).json({ ok: false, message: 'Fichier introuvable' });
  }

  const match = /^data:([^;]+);base64,(.+)$/.exec(project.downloadFileUrl);
  if (!match) return res.status(404).json({ ok: false, message: 'Fichier introuvable' });

  order.downloadCount += 1;
  await order.save();

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

router.get('/articles/:id/comments', publicReadLimiter, async (req, res) => {
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

router.post('/quotes', publicWriteLimiter, handleQuoteUpload, async (req, res) => {
  const { name, email, phone, projectType, budget, description } = req.body || {};
  if (!name || !email || !description) {
    return res.status(400).json({ ok: false, message: 'Nom, email et description sont requis' });
  }

  let fileUrl = '';
  let fileName = '';
  if (req.file) {
    const detectedMimetype = detectQuoteFileMimetype(req.file.buffer, req.file.mimetype);
    if (!detectedMimetype) {
      return res.status(400).json({ ok: false, message: 'Le fichier joint ne semble pas être un fichier valide' });
    }
    fileUrl = `data:${detectedMimetype};base64,${req.file.buffer.toString('base64')}`;
    fileName = req.file.originalname;
  }

  await Quote.create({
    name,
    email,
    phone: phone || '',
    projectType: projectType || '',
    budget: budget || '',
    description,
    fileUrl,
    fileName
  });
  res.status(201).json({ ok: true, message: 'Demande de devis envoyée avec succès' });
});

router.post('/visit', trackingLimiter, async (req, res) => {
  // Toujours répondre 204 même si on ignore la visite (bot, requête malformée) : le beacon
  // frontend n'a rien à faire d'un échec, et on ne veut pas qu'une erreur réseau soit visible.
  const userAgent = req.headers['user-agent'] || '';
  if (BOT_UA_PATTERN.test(userAgent)) return res.status(204).end();

  const { path: pagePath, referrer } = req.body || {};
  if (typeof pagePath !== 'string' || !pagePath) return res.status(204).end();

  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  const geo = ip ? geoip.lookup(ip) : null;

  try {
    await Visit.create({
      path: pagePath.slice(0, 200),
      referrer: typeof referrer === 'string' ? referrer.slice(0, 200) : '',
      country: geo?.country || '',
      device: detectDevice(userAgent),
      visitorHash: hashVisitor(ip, userAgent)
    });
  } catch {
    // Le tracking ne doit jamais faire échouer la navigation du visiteur.
  }
  res.status(204).end();
});

module.exports = router;
