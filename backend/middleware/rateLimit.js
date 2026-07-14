const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: 'Trop de tentatives, réessaie dans 15 minutes' }
});

const publicWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: 'Trop de requêtes, réessaie plus tard' }
});

// Séparé de publicWriteLimiter : une visite envoie un ping de tracking par page vue, ce qui
// consommerait vite le quota partagé et bloquerait à tort un visiteur qui veut aussi envoyer
// un message ou un commentaire dans la même fenêtre de 15 minutes.
const trackingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: 'Trop de requêtes' }
});

module.exports = { loginLimiter, publicWriteLimiter, trackingLimiter };
