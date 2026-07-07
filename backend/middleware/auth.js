const crypto = require('crypto');

const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 jours

function getSecret() {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error('ADMIN_SECRET manquant dans .env');
  return secret;
}

function sign(timestamp) {
  return crypto.createHmac('sha256', getSecret()).update(String(timestamp)).digest('hex');
}

function signToken() {
  const timestamp = Date.now();
  return `${timestamp}.${sign(timestamp)}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return false;
  const [timestamp, signature] = token.split('.');
  if (!timestamp || !signature) return false;
  if (Date.now() - Number(timestamp) > TOKEN_TTL_MS) return false;

  const expected = sign(timestamp);
  const expectedBuf = Buffer.from(expected);
  const signatureBuf = Buffer.from(signature);
  if (expectedBuf.length !== signatureBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, signatureBuf);
}

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!verifyToken(token)) {
    return res.status(401).json({ ok: false, message: 'Non autorisé' });
  }
  next();
}

// Compare deux chaînes en temps constant en les hashant d'abord (évite les fuites
// de longueur/contenu par timing attack) — utilisé pour vérifier le mot de passe admin.
function safeCompare(a, b) {
  const hashA = crypto.createHash('sha256').update(String(a ?? '')).digest();
  const hashB = crypto.createHash('sha256').update(String(b ?? '')).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

module.exports = { signToken, verifyToken, requireAdmin, safeCompare };
