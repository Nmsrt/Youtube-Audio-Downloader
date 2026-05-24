const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { spawn } = require('child_process');
const sanitize = require('sanitize-filename');

const app = express();
const PORT = 3000;
let downloadDir = path.join(os.homedir(), 'Downloads');

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

function ytDlpCommand() {
  // Prefer direct execution. This avoids Windows shell splitting paths / filenames with spaces.
  return process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
}

function ensureDir(dir) {
  if (!dir || typeof dir !== 'string') throw new Error('Invalid folder path');
  const resolved = path.resolve(dir.trim().replace(/^['"]|['"]$/g, ''));
  if (!fs.existsSync(resolved)) fs.mkdirSync(resolved, { recursive: true });
  const stat = fs.statSync(resolved);
  if (!stat.isDirectory()) throw new Error('Path is not a folder');
  fs.accessSync(resolved, fs.constants.W_OK);
  return resolved;
}

function cleanBaseName(value) {
  const safe = sanitize(String(value || '').trim())
    .replace(/\.(mp3|wav)$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  return safe || 'youtube-audio';
}

function runYtDlp(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(ytDlpCommand(), args, {
      shell: false,
      windowsHide: true,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', d => (stdout += d.toString()));
    child.stderr.on('data', d => (stderr += d.toString()));
    child.on('error', err => {
      reject(new Error(`Could not start yt-dlp. Make sure yt-dlp is installed and available in PATH. ${err.message}`));
    });
    child.on('close', code => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(stderr || stdout || 'yt-dlp failed'));
    });
  });
}

async function getVideoTitle(url) {
  const { stdout } = await runYtDlp(['--no-playlist', '--print', '%(title)s', url]);
  return stdout.split(/\r?\n/).find(Boolean)?.trim() || 'youtube-audio';
}

function findDownloadedFile(folder, baseName, format) {
  const exact = path.join(folder, `${baseName}.${format}`);
  if (fs.existsSync(exact)) return exact;

  const lowerBase = baseName.toLowerCase();
  const lowerFormat = `.${format.toLowerCase()}`;
  const matches = fs.readdirSync(folder)
    .filter(name => name.toLowerCase().startsWith(lowerBase) && name.toLowerCase().endsWith(lowerFormat))
    .map(name => path.join(folder, name))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);

  return matches[0] || exact;
}

app.get('/api/location', (_, res) => res.json({ downloadDir }));

app.post('/api/location', (req, res) => {
  try {
    downloadDir = ensureDir(req.body.path);
    res.json({ ok: true, downloadDir });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/title', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'YouTube URL is required' });
    const title = await getVideoTitle(url);
    res.json({ title, safeTitle: cleanBaseName(title) });
  } catch (err) {
    res.status(500).json({ error: 'Unable to read video title. Make sure yt-dlp is installed and the URL is valid.' });
  }
});

app.post('/api/download', async (req, res) => {
  try {
    const { url, format = 'mp3', quality = 'auto', filename } = req.body;
    if (!url) return res.status(400).json({ error: 'YouTube URL is required' });
    if (!['mp3', 'wav'].includes(format)) return res.status(400).json({ error: 'Only MP3 and WAV are supported' });

    const folder = ensureDir(downloadDir);
    let baseName = cleanBaseName(filename);

    if (!filename || !String(filename).trim()) {
      baseName = cleanBaseName(await getVideoTitle(url));
    }

    // IMPORTANT: keep %(ext)s in the output template.
    // Passing a fixed .mp3/.wav name can break yt-dlp when it handles intermediate files.
    const outputTemplate = path.join(folder, `${baseName}.%(ext)s`);

    const args = [
      '--no-playlist',
      '--ignore-config',
      '--extract-audio',
      '--audio-format', format,
      '--newline',
      '-o', outputTemplate,
    ];

    if (format === 'mp3' && quality !== 'auto') {
      args.push('--audio-quality', String(quality));
    }

    args.push(url);

    const { stdout, stderr } = await runYtDlp(args);
    const finalPath = findDownloadedFile(folder, baseName, format);
    const finalName = path.basename(finalPath);

    res.json({
      ok: true,
      fileName: finalName,
      folder,
      fullPath: finalPath,
      log: `${stdout}\n${stderr}`.trim(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`YT-DLP Audio Downloader running at http://localhost:${PORT}`);
  console.log(`Files will be saved to: ${downloadDir}`);
});
