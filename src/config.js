// @ts-check
const path = require('path');
const os = require('os');

/** Absolute path to the project root (one level up from `src/`). */
const ROOT_DIR = path.resolve(__dirname, '..');

module.exports = {
  ROOT_DIR,
  /** TCP port the HTTP server listens on. */
  PORT: Number(process.env.PORT) || 3000,
  /** Folder served as static assets (the web UI). */
  PUBLIC_DIR: path.join(ROOT_DIR, 'public'),
  /** Where downloads are saved until the user picks another folder. */
  DEFAULT_DOWNLOAD_DIR: path.join(os.homedir(), 'Downloads'),
  /** Audio formats the API is allowed to export. */
  SUPPORTED_FORMATS: ['mp3', 'wav'],
  /** Maximum accepted JSON request body size. */
  JSON_BODY_LIMIT: '1mb',
};
