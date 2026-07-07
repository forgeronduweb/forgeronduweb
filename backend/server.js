const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./db/connection');
const { seedIfEmpty } = require('./data/seed');
const portfolioRouter = require('./routes/portfolio');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 4000;

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
