const express = require('express');
const multer = require('multer');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const Message = require('../models/Message');
const Settings = require('../models/Settings');
const { resetToSeed } = require('../data/seed');
const { signToken, requireAdmin, safeCompare } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimit');

const router = express.Router();

const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      return cb(new Error('Format non supporté (JPG, PNG ou WebP uniquement)'));
    }
    cb(null, true);
  }
});

// Le Content-Type du multipart est déclaré par le client et donc falsifiable ;
// on vérifie en plus les premiers octets réels du fichier avant d'accepter l'upload.
function matchesImageMagicBytes(buffer, mimetype) {
  if (!buffer || buffer.length < 12) return false;
  if (mimetype === 'image/png') {
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  }
  if (mimetype === 'image/jpeg') {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimetype === 'image/webp') {
    return buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';
  }
  return false;
}

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

router.post('/login', loginLimiter, (req, res) => {
  const { password } = req.body || {};
  if (!password || !safeCompare(password, process.env.ADMIN_PASSWORD)) {
    return res.status(401).json({ ok: false, message: 'Mot de passe incorrect' });
  }
  res.json({ ok: true, token: signToken() });
});

router.use(requireAdmin);

router.put('/profile', async (req, res) => {
  const { name, role, location, yearsOfExperience, email, avatarUrl, website, github, linkedin, instagram, status, availabilityMessage, bio, stack } = req.body || {};
  if (!name || !role || !email) {
    return res.status(400).json({ ok: false, message: 'Nom, rôle et email sont requis' });
  }

  const profile = await Profile.findOneAndUpdate(
    {},
    {
      name,
      role,
      location: location || '',
      yearsOfExperience: Number.isFinite(Number(yearsOfExperience)) ? Number(yearsOfExperience) : 0,
      email,
      avatarUrl: avatarUrl || '',
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

router.post('/profile/avatar', (req, res, next) => {
  avatarUpload.single('avatar')(req, res, (err) => {
    if (err) return res.status(400).json({ ok: false, message: err.message });
    next();
  });
}, async (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, message: 'Aucun fichier reçu' });
  if (!matchesImageMagicBytes(req.file.buffer, req.file.mimetype)) {
    return res.status(400).json({ ok: false, message: 'Le fichier ne semble pas être une image valide' });
  }

  const avatarUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  const profile = await Profile.findOneAndUpdate({}, { avatarUrl }, { upsert: true, returnDocument: 'after' });
  res.json({ ok: true, avatarUrl, profile });
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

router.get('/settings', async (_req, res) => {
  const settings = await Settings.findOneAndUpdate({}, {}, { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true });
  res.json({ ok: true, settings });
});

router.put('/settings', async (req, res) => {
  const { siteTitle, seoDescription, portfolioUrl, sectionVisibility } = req.body || {};

  const settings = await Settings.findOneAndUpdate(
    {},
    {
      siteTitle: siteTitle || 'Evrard BAHO — Dev Portfolio',
      seoDescription: seoDescription || '',
      portfolioUrl: portfolioUrl || '',
      sectionVisibility: {
        home: sectionVisibility?.home !== false,
        about: sectionVisibility?.about !== false,
        projects: sectionVisibility?.projects !== false,
        blog: sectionVisibility?.blog !== false,
        contact: sectionVisibility?.contact !== false
      }
    },
    { upsert: true, returnDocument: 'after' }
  );
  res.json({ ok: true, settings });
});

router.post('/reset', async (_req, res) => {
  await resetToSeed();
  res.json({ ok: true, message: 'Portfolio réinitialisé' });
});

module.exports = router;
