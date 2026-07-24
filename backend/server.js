const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./db/connection');
const { seedIfEmpty } = require('./data/seed');
const portfolioRouter = require('./routes/portfolio');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 4000;

// Nécessaire pour que express-rate-limit voie la vraie IP du visiteur derrière le proxy de Render.
app.set('trust proxy', 1);

// CSP désactivée : le HTML utilise des attributs onclick="" inline partout (admin et frontend),
// une CSP par défaut casserait toute l'interactivité du site. Les autres protections de helmet
// (X-Frame-Options, X-Content-Type-Options, etc.) restent actives.
app.use(helmet({ contentSecurityPolicy: false }));

// Le frontend appelle toujours l'API en same-origin (API_BASE = '/api'), donc le navigateur
// n'a pas besoin de CORS pour ces requêtes. On restreint quand même explicitement aux domaines
// du site pour empêcher un site tiers d'appeler l'API depuis le navigateur d'un visiteur.
const ALLOWED_ORIGINS = ['https://forgeronduweb.com', 'https://www.forgeronduweb.com'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error('Origin non autorisée'));
  }
}));
app.use(express.json());

// index.html doit toujours être revalidé (point d'entrée de l'app) ; les autres fichiers
// statiques (CSS/JS/images) peuvent être mis en cache brièvement par le navigateur pour
// éviter de retélécharger les mêmes assets à chaque navigation, tout en restant à jour
// rapidement après un déploiement (pas de hash de version dans les noms de fichiers).
const staticOptions = {
  setHeaders: (res, filePath) => {
    const cacheControl = filePath.endsWith('.html') ? 'no-cache' : 'public, max-age=300, must-revalidate';
    res.setHeader('Cache-Control', cacheControl);
  }
};
// Sur admin.forgeronduweb.com, le même conteneur sert l'admin à la racine du domaine (Traefik
// route les deux domaines vers ce même port sans distinction de chemin) ; on distingue donc
// admin/public via le Host reçu plutôt que via l'URL, pour éviter toute collision entre les
// fichiers statiques (script.js, style.css...) des deux dossiers montés en racine.
const ADMIN_HOST = process.env.ADMIN_HOST || 'admin.forgeronduweb.com';
function isAdminHost(req) {
  return req.hostname === ADMIN_HOST;
}

const frontendStatic = express.static(path.join(__dirname, '..', 'frontend'), staticOptions);
const adminStatic = express.static(path.join(__dirname, '..', 'admin'), staticOptions);

app.use((req, res, next) => {
  if (isAdminHost(req)) return adminStatic(req, res, next);
  next();
});
app.use(frontendStatic);
app.use('/admin', adminStatic);

app.get('/', (req, res) => {
  if (isAdminHost(req)) return res.sendFile(path.join(__dirname, '..', 'admin', 'index.html'));
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.get('/admin', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin', 'index.html'));
});

app.use('/api', portfolioRouter);
app.use('/api/admin', adminRouter);

app.use((err, _req, res, _next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ ok: false, message: 'JSON invalide' });
  }
  return res.status(500).json({ ok: false, message: 'Erreur serveur' });
});

async function start() {
  await connectDB();
  await seedIfEmpty();
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  start();
}

module.exports = { app, connectDB };
