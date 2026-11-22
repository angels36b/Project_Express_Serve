const config = require('../config/env');

/**
 * Handles GET /login/.
 * Public endpoint (no Bearer token required) returning the student's Moodle login as text/plain.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
function getLogin(req, res) {
  res.status(200).type('text/plain; charset=utf-8').send(config.moodleLogin);
}

/**
 * Handles GET /api/author/.
 * Protected endpoint returning configured Moodle login and fullName as JSON.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
function getAuthor(req, res) {
  res.status(200).json({
    login: config.moodleLogin,
    fullName: config.moodleFullName
  });
}

module.exports = {
  getLogin,
  getAuthor
};