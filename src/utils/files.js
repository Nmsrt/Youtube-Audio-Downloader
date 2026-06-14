// @ts-check
const fs = require('fs');
const path = require('path');
const sanitize = require('sanitize-filename');

/**
 * Resolve a user-supplied folder path, creating it if needed, and verify it is
 * a writable directory.
 * @param {unknown} dir - Candidate folder path.
 * @returns {string} The resolved absolute directory path.
 * @throws {Error} If the path is invalid, not a directory, or not writable.
 */
function ensureDir(dir) {
  if (!dir || typeof dir !== 'string') throw new Error('Invalid folder path');

  // Strip surrounding quotes a user may have pasted, then resolve to absolute.
  const resolved = path.resolve(dir.trim().replace(/^['"]|['"]$/g, ''));

  if (!fs.existsSync(resolved)) fs.mkdirSync(resolved, { recursive: true });
  if (!fs.statSync(resolved).isDirectory())
    throw new Error('Path is not a folder');

  fs.accessSync(resolved, fs.constants.W_OK);
  return resolved;
}

/**
 * Turn an arbitrary string into a safe audio file base name (no extension).
 * @param {unknown} value
 * @returns {string}
 */
function cleanBaseName(value) {
  const safe = sanitize(String(value || '').trim())
    .replace(/\.(mp3|wav)$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  return safe || 'youtube-audio';
}

/**
 * Locate the file yt-dlp produced for a download. yt-dlp may adjust the final
 * name while handling intermediate files, so fall back to the most recently
 * modified file that matches the base name and extension.
 * @param {string} folder
 * @param {string} baseName
 * @param {string} format
 * @returns {string} Absolute path to the best-match file.
 */
function findDownloadedFile(folder, baseName, format) {
  const exact = path.join(folder, `${baseName}.${format}`);
  if (fs.existsSync(exact)) return exact;

  const lowerBase = baseName.toLowerCase();
  const lowerExt = `.${format.toLowerCase()}`;

  const [newest] = fs
    .readdirSync(folder)
    .filter(
      name =>
        name.toLowerCase().startsWith(lowerBase) &&
        name.toLowerCase().endsWith(lowerExt)
    )
    .map(name => {
      const full = path.join(folder, name);
      return { full, mtime: fs.statSync(full).mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime);

  return newest ? newest.full : exact;
}

module.exports = { ensureDir, cleanBaseName, findDownloadedFile };
