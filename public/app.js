const $ = id => document.getElementById(id);

const urlInput = $('urlInput');
const filenameInput = $('filenameInput');
const locationText = $('locationText');
const progressContent = $('progressContent');
const themeBtn = $('themeBtn');

let selectedFormat = 'mp3';
let titleTimer;
let autoTitleValue = '';
let currentVideoInfo = null;

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;

  localStorage.setItem('theme', theme);

  themeBtn.textContent = theme === 'dark' ? '☾' : '☀';

  themeBtn.title =
    theme === 'dark'
      ? 'Switch to light mode'
      : 'Switch to dark mode';
}

setTheme(localStorage.getItem('theme') || 'light');

themeBtn.onclick = () => {
  setTheme(
    document.documentElement.dataset.theme === 'dark'
      ? 'light'
      : 'dark'
  );
};

function updateQualityState() {
  const qualitySelect = $('qualitySelect');
  const qualityHint = $('qualityHint');

  const isWav = selectedFormat === 'wav';

  qualitySelect.disabled = isWav;

  qualitySelect.classList.toggle(
    'disabledSelect',
    isWav
  );

  qualityHint.textContent = isWav
    ? 'WAV is uncompressed, so audio quality cannot be changed.'
    : 'Quality setting applies to MP3 exports.';
}

document.querySelectorAll('.format').forEach(btn => {
  btn.onclick = () => {
    document
      .querySelectorAll('.format')
      .forEach(b => b.classList.remove('active'));

    btn.classList.add('active');

    selectedFormat = btn.dataset.format;

    updateQualityState();

    if (currentVideoInfo) {
      showVideoPreview();
    }
  };
});

updateQualityState();

$('advancedToggle').onchange = e => {
  $('advancedBox').classList.toggle(
    'hidden',
    !e.target.checked
  );
};

$('clearBtn').onclick = () => showEmpty();

async function api(path, body) {
  const r = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await r.json().catch(() => ({}));

  if (!r.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

async function refreshLocation() {
  const r = await fetch('/api/location');

  const data = await r.json();

  locationText.textContent = data.downloadDir;
}

refreshLocation();

$('changeBtn').onclick = async () => {
  const current = locationText.textContent;

  const next = prompt(
    'Enter the full folder path where downloads should be saved:',
    current
  );

  if (!next) return;

  try {
    const data = await api('/api/location', {
      path: next,
    });

    locationText.textContent = data.downloadDir;

    showStatus(
      'success',
      'Download location updated',
      `New folder: ${data.downloadDir}`
    );
  } catch (e) {
    showStatus(
      'error',
      'Could not update download folder',
      e.message
    );
  }
};

async function fillTitle(force = false) {
  const url = urlInput.value.trim();

  if (!url) return;

  if (
    !force &&
    filenameInput.dataset.edited === '1'
  ) {
    return;
  }

  filenameInput.placeholder =
    'Reading YouTube title...';

  try {
    const data = await api('/api/info', {
      url,
    });

    currentVideoInfo = data;

    autoTitleValue = data.safeTitle;

    if (
      force ||
      filenameInput.dataset.edited !== '1' ||
      !filenameInput.value.trim()
    ) {
      filenameInput.value = data.safeTitle;

      filenameInput.dataset.edited = '0';
    }

    filenameInput.placeholder =
      'Edit filename before downloading';
  } catch (e) {
    filenameInput.placeholder =
      'Could not read title';
  }
}

urlInput.addEventListener('input', () => {
  const url = urlInput.value.trim();

  autoTitleValue = '';

  currentVideoInfo = null;

  filenameInput.dataset.edited = '0';

  filenameInput.value = '';

  clearTimeout(titleTimer);

  if (!url) {
    showEmpty();
    return;
  }

  showLoadingPreview();

  titleTimer = setTimeout(async () => {
    await fillTitle(false);

    if (currentVideoInfo) {
      showVideoPreview();
    }
  }, 300);
});

filenameInput.addEventListener('input', () => {
  filenameInput.dataset.edited = '1';
});

$('downloadBtn').onclick = async () => {
  const url = urlInput.value.trim();

  if (!url) {
    showStatus(
      'error',
      'Missing YouTube URL',
      'Paste a YouTube link first.'
    );

    return;
  }

  const btn = $('downloadBtn');

  btn.disabled = true;

  btn.textContent = 'Downloading...';

  try {
    if (!filenameInput.value.trim()) {
      await fillTitle(true);
    }

    showDownloading();

    const data = await api('/api/download', {
      url,
      format: selectedFormat,
      quality: $('qualitySelect').value,
      filename: filenameInput.value.trim(),
    });

    showStatus(
      'success',
      'Download complete',
      `Saved as ${data.fileName}. Saved to: ${data.folder}`,
      data.log
    );
  } catch (e) {
    showStatus(
      'error',
      'Download failed',
      e.message
    );
  } finally {
    btn.disabled = false;

    btn.textContent = '⇩ Download';
  }
};

function showEmpty() {
  progressContent.className = 'empty';

  progressContent.innerHTML = `
    <div class="emptyIcon">⇩</div>
    <h3>No active downloads</h3>
    <p>Paste a YouTube link above to begin.</p>
  `;
}

function showLoadingPreview() {
  progressContent.className = '';

  progressContent.innerHTML = `
    <div class="downloadPreview">
      <div class="thumb thumbFallback">⌛</div>

      <div class="previewMeta">
        <div class="spinner"></div>

        <div>
          <h3>Reading YouTube link</h3>

          <p>Fetching thumbnail and video details...</p>

          <small>
            This should only take a moment.
          </small>
        </div>
      </div>
    </div>
  `;
}

function showVideoPreview() {
  progressContent.className = '';

  const thumb =
    currentVideoInfo?.thumbnail || '';

  const title =
    currentVideoInfo?.title ||
    'YouTube Audio';

  const uploader =
    currentVideoInfo?.uploader || '';

  const duration =
    currentVideoInfo?.duration || '';

  progressContent.innerHTML = `
    <div class="downloadPreview">
      ${
        thumb
          ? `
            <img
              class="thumb"
              src="${escapeHtml(thumb)}"
              alt="Thumbnail"
            >
          `
          : `
            <div class="thumb thumbFallback">
              ♫
            </div>
          `
      }

      <div class="previewMeta noSpinner">
        <div class="badge">✓</div>

        <div>
          <h3>${escapeHtml(title)}</h3>

          <p>
            ${escapeHtml(uploader)}
            ${
              duration
                ? ` • ${escapeHtml(duration)}`
                : ''
            }
          </p>

          <small>
            Ready to download as
            ${selectedFormat.toUpperCase()}.
          </small>
        </div>
      </div>
    </div>
  `;
}

function showDownloading() {
  progressContent.className = '';

  const thumb =
    currentVideoInfo?.thumbnail || '';

  const title =
    currentVideoInfo?.title ||
    'Downloading audio';

  const uploader =
    currentVideoInfo?.uploader || '';

  const duration =
    currentVideoInfo?.duration || '';

  progressContent.innerHTML = `
    <div class="downloadPreview">
      ${
        thumb
          ? `
            <img
              class="thumb"
              src="${escapeHtml(thumb)}"
              alt="Thumbnail"
            >
          `
          : `
            <div class="thumb thumbFallback">
              ♫
            </div>
          `
      }

      <div class="previewMeta">
        <div class="spinner"></div>

        <div>
          <h3>${escapeHtml(title)}</h3>

          <p>
            ${escapeHtml(uploader)}
            ${
              duration
                ? ` • ${escapeHtml(duration)}`
                : ''
            }
          </p>

          <small>
            Extracting and converting audio...
          </small>
        </div>
      </div>
    </div>
  `;
}

function showStatus(
  type,
  title,
  msg,
  log = ''
) {
  const good = type === 'success';

  progressContent.className = '';

  progressContent.innerHTML = `
    <div class="status">
      <div class="badge ${
        good ? '' : 'bad'
      }">
        ${good ? '✓' : '!'}
      </div>

      <div>
        <h3>${escapeHtml(title)}</h3>

        <p>${escapeHtml(msg)}</p>
      </div>
    </div>

    ${
      log
        ? `
          <pre>
${escapeHtml(lastUsefulLog(log))}
          </pre>
        `
        : ''
    }
  `;
}

function lastUsefulLog(log) {
  const lines = String(log)
    .split(/\r?\n/)
    .filter(Boolean);

  return lines.slice(-10).join('\n');
}

function escapeHtml(str) {
  return String(str).replace(
    /[&<>'"]/g,
    c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    })[c]
  );
}