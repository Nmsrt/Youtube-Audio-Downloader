// @ts-check
import { els, formatButtons } from './dom.js';
import { apiPost, fetchLocation } from './api.js';
import { initTheme } from './theme.js';
import {
  showEmpty,
  showLoadingPreview,
  showVideoPreview,
  showDownloading,
  showStatus,
} from './ui.js';
import { errorMessage } from './errors.js';

/** @typedef {import('./types').VideoInfo} VideoInfo */

const TITLE_DEBOUNCE_MS = 300;

let selectedFormat = 'mp3';
/** @type {ReturnType<typeof setTimeout> | undefined} */
let titleTimer;
/** @type {VideoInfo | null} */
let currentVideoInfo = null;

/** Reflect the selected format in the quality control and its hint. */
function updateQualityState() {
  const isWav = selectedFormat === 'wav';
  els.qualitySelect.disabled = isWav;
  els.qualitySelect.classList.toggle('disabledSelect', isWav);
  els.qualityHint.textContent = isWav
    ? 'WAV is uncompressed, so audio quality cannot be changed.'
    : 'Quality setting applies to MP3 exports.';
}

/**
 * Fetch video metadata for the current URL and fill the filename field.
 * @param {boolean} [force=false] - Overwrite a filename the user already edited.
 */
async function fillTitle(force = false) {
  const url = els.url.value.trim();
  if (!url) return;
  if (!force && els.filename.dataset.edited === '1') return;

  els.filename.placeholder = 'Reading YouTube title...';
  try {
    currentVideoInfo = await apiPost('/api/info', { url });
    if (
      force ||
      els.filename.dataset.edited !== '1' ||
      !els.filename.value.trim()
    ) {
      els.filename.value = currentVideoInfo?.safeTitle || '';
      els.filename.dataset.edited = '0';
    }
    els.filename.placeholder = 'Edit filename before downloading';
  } catch {
    els.filename.placeholder = 'Could not read title';
  }
}

/** Load the current download folder into the UI. */
async function refreshLocation() {
  const { downloadDir } = await fetchLocation();
  els.locationText.textContent = downloadDir;
}

/**
 * Switch the active audio format.
 * @param {HTMLButtonElement} btn
 */
function handleFormatClick(btn) {
  formatButtons.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedFormat = btn.dataset.format || 'mp3';
  updateQualityState();
  if (currentVideoInfo) showVideoPreview(currentVideoInfo, selectedFormat);
}

/** Prompt for and persist a new download folder. */
async function handleChangeLocation() {
  const current = els.locationText.textContent || '';
  const next = prompt(
    'Enter the full folder path where downloads should be saved:',
    current
  );
  if (!next) return;

  try {
    const { downloadDir } = await apiPost('/api/location', { path: next });
    els.locationText.textContent = downloadDir;
    showStatus(
      'success',
      'Download location updated',
      `New folder: ${downloadDir}`
    );
  } catch (err) {
    showStatus('error', 'Could not update download folder', errorMessage(err));
  }
}

/** Reset state and (debounced) resolve the title when the URL changes. */
function handleUrlInput() {
  const url = els.url.value.trim();
  currentVideoInfo = null;
  els.filename.dataset.edited = '0';
  els.filename.value = '';
  clearTimeout(titleTimer);

  if (!url) {
    showEmpty();
    return;
  }

  showLoadingPreview();
  titleTimer = setTimeout(async () => {
    await fillTitle(false);
    if (currentVideoInfo) showVideoPreview(currentVideoInfo, selectedFormat);
  }, TITLE_DEBOUNCE_MS);
}

/** Validate input, run the download, and report the result. */
async function handleDownload() {
  const url = els.url.value.trim();
  if (!url) {
    showStatus('error', 'Missing YouTube URL', 'Paste a YouTube link first.');
    return;
  }

  els.downloadBtn.disabled = true;
  els.downloadBtn.textContent = 'Downloading...';
  try {
    if (!els.filename.value.trim()) await fillTitle(true);
    showDownloading(currentVideoInfo, selectedFormat);

    const data = await apiPost('/api/download', {
      url,
      format: selectedFormat,
      quality: els.qualitySelect.value,
      filename: els.filename.value.trim(),
    });

    showStatus(
      'success',
      'Download complete',
      `Saved as ${data.fileName}. Saved to: ${data.folder}`,
      data.log
    );
  } catch (err) {
    showStatus('error', 'Download failed', errorMessage(err));
  } finally {
    els.downloadBtn.disabled = false;
    els.downloadBtn.textContent = '⇩ Download';
  }
}

/** Apply initial state and attach event listeners. */
function init() {
  initTheme();
  updateQualityState();
  refreshLocation();

  formatButtons.forEach(btn =>
    btn.addEventListener('click', () => handleFormatClick(btn))
  );
  els.advancedToggle.addEventListener('change', () =>
    els.advancedBox.classList.toggle('hidden', !els.advancedToggle.checked)
  );
  els.clearBtn.addEventListener('click', showEmpty);
  els.changeBtn.addEventListener('click', handleChangeLocation);
  els.url.addEventListener('input', handleUrlInput);
  els.filename.addEventListener('input', () => {
    els.filename.dataset.edited = '1';
  });
  els.downloadBtn.addEventListener('click', handleDownload);
}

init();
