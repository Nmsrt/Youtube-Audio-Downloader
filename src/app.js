// @ts-check
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const { errorMessage } = require('./utils/errors');
const { PUBLIC_DIR, JSON_BODY_LIMIT } = require('./config');

/**
 * Build and configure the Express application.
 * @returns {import('express').Express}
 */
function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: JSON_BODY_LIMIT }));
  app.use(express.static(PUBLIC_DIR));

  app.use('/api', apiRoutes);

  // Unknown API route -> JSON 404 (static assets are handled above).
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

  // Centralized fallback for unexpected errors.
  /** @type {import('express').ErrorRequestHandler} */
  const errorHandler = (err, _req, res, _next) => {
    res.status(500).json({ error: errorMessage(err, 'Server error') });
  };
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
