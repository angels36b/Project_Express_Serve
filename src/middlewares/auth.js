const crypto = require('crypto');
const config = require('../config/env');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || typeof authHeader !== 'string') {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid Authorization format' });
  }

  const providedToken = Buffer.from(parts[1], 'utf8');
  const expectedToken = Buffer.from(config.apiToken, 'utf8');

  if (
    providedToken.length !== expectedToken.length ||
    !crypto.timingSafeEqual(providedToken, expectedToken)
  ) {
    return res.status(401).json({ error: 'Invalid API token' });
  }

  return next();
}

module.exports = requireAuth;