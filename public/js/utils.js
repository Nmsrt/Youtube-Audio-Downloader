// @ts-check

const HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
};

/**
 * Escape a string for safe insertion into HTML.
 * @param {unknown} str
 * @returns {string}
 */
export function escapeHtml(str) {
  return String(str).replace(/[&<>'"]/g, char => HTML_ESCAPES[char] ?? char);
}

/**
 * Keep only the last few lines of a yt-dlp log for compact display.
 * @param {string} log
 * @param {number} [maxLines=10]
 * @returns {string}
 */
export function lastUsefulLog(log, maxLines = 10) {
  return String(log).split(/\r?\n/).filter(Boolean).slice(-maxLines).join('\n');
}
