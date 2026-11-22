/**
 * Centralized Express error-handling middleware.
 * Ensures all errors return application/json with {"error": "..."},
 * mapping invalid JSON syntax to 400 and PostgreSQL outages to 503.
 */
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Malformed JSON payload' });
  }

  if (err.statusCode === 503) {
    return res.status(503).json({ error: 'Database service unavailable' });
  }

  console.error('Unhandled server error:', err);
  return res.status(500).json({ error: 'Internal server error' });
}

module.exports = errorHandler;