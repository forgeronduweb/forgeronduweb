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
app.use(cors());
app.use(express.json());

const staticOptions = { setHeaders: (res) => res.setHeader('Cache-Control', 'no-cache') };
app.use(express.static(path.join(__dirname, '..', 'frontend'), staticOptions));
app.use('/admin', express.static(path.join(__dirname, '..', 'admin'), staticOptions));

app.get('/', (_req, res) => {
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
