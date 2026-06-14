// @ts-check
const { DEFAULT_DOWNLOAD_DIR } = require('./config');
const { ensureDir } = require('./utils/files');

// Current download folder. Mutable runtime state shared across requests.
let downloadDir = DEFAULT_DOWNLOAD_DIR;

/** @returns {string} The current download directory. */
function getDownloadDir() {
  return downloadDir;
}

/**
 * Validate and update the download directory.
 * @param {unknown} dir - Candidate folder path.
 * @returns {string} The resolved directory now in use.
 * @throws {Error} If the path is not a writable directory.
 */
function setDownloadDir(dir) {
  downloadDir = ensureDir(dir);
  return downloadDir;
}

module.exports = { getDownloadDir, setDownloadDir };
