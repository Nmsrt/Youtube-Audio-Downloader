// @ts-check
import { els } from './dom.js';
import { escapeHtml, lastUsefulLog } from './utils.js';

/** @typedef {import('./types').VideoInfo} VideoInfo */

/**
 * Render the thumbnail block, with a music-note fallback when none exists.
 * @param {string} thumbnail
 * @returns {string}
 */
function thumbHtml(thumbnail) {
  return thumbnail
    ? `<img class="thumb" src="${escapeHtml(thumbnail)}" alt="Thumbnail">`
    : `<div class="thumb thumbFallback">♫</div>`;
}

/**
 * Render a preview card. Used both while waiting to download ("ready") and
 * during the download itself ("downloading").
 * @param {VideoInfo | null} info
 * @param {'ready' | 'downloading'} variant
 * @param {string} format
 * @returns {string}
 */
function previewCard(info, variant, format) {
  const isReady = variant === 'ready';
  const title =
    info?.title || (isReady ? 'YouTube Audio' : 'Downloading audio');
  const uploader = info?.uploader || '';
  const duration = info?.duration || '';

  const leading = isReady
    ? `<div class="badge">✓</div>`
    : `<div class="spinner"></div>`;
  const small = isReady
    ? `Ready to download as ${format.toUpperCase()}.`
    : 'Extracting and converting audio...';

  return `
    <div class="downloadPreview">
      ${thumbHtml(info?.thumbnail || '')}
      <div class="previewMeta${isReady ? ' noSpinner' : ''}">
        ${leading}
        <div>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(uploader)}${duration ? ` • ${escapeHtml(duration)}` : ''}</p>
          <small>${small}</small>
        </div>
      </div>
    </div>
  `;
}

/** Show the empty / idle state. */
export function showEmpty() {
  els.progress.className = 'empty';
  els.progress.innerHTML = `
    <div class="emptyIcon">⇩</div>
    <h3>No active downloads</h3>
    <p>Paste a YouTube link above to begin.</p>
  `;
}

/** Show the "reading the link" loading state. */
export function showLoadingPreview() {
  els.progress.className = '';
  els.progress.innerHTML = `
    <div class="downloadPreview">
      <div class="thumb thumbFallback">⌛</div>
      <div class="previewMeta">
        <div class="spinner"></div>
        <div>
          <h3>Reading YouTube link</h3>
          <p>Fetching thumbnail and video details...</p>
          <small>This should only take a moment.</small>
        </div>
      </div>
    </div>
  `;
}

/**
 * Show the resolved video, ready to download.
 * @param {VideoInfo | null} info
 * @param {string} format
 */
export function showVideoPreview(info, format) {
  els.progress.className = '';
  els.progress.innerHTML = previewCard(info, 'ready', format);
}

/**
 * Show the in-progress download state.
 * @param {VideoInfo | null} info
 * @param {string} format
 */
export function showDownloading(info, format) {
  els.progress.className = '';
  els.progress.innerHTML = previewCard(info, 'downloading', format);
}

/**
 * Show a success or error status, with an optional yt-dlp log.
 * @param {'success' | 'error'} type
 * @param {string} title
 * @param {string} msg
 * @param {string} [log='']
 */
export function showStatus(type, title, msg, log = '') {
  const good = type === 'success';
  els.progress.className = '';
  els.progress.innerHTML = `
    <div class="status">
      <div class="badge ${good ? '' : 'bad'}">${good ? '✓' : '!'}</div>
      <div>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(msg)}</p>
      </div>
    </div>
    ${log ? `<pre>\n${escapeHtml(lastUsefulLog(log))}\n</pre>` : ''}
  `;
}
