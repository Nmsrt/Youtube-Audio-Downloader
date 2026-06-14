// @ts-check
const express = require('express');
const path = require('path');
const { SUPPORTED_FORMATS } = require('../config');
const { getDownloadDir, setDownloadDir } = require('../settings');
const { runYtDlp, getVideoTitle, getVideoInfo } = require('../services/ytDlp');
const {
  ensureDir,
  cleanBaseName,
  findDownloadedFile,
} = require('../utils/files');
const { errorMessage } = require('../utils/errors');

const router = express.Router();

// Current download location.
router.get('/location', (_req, res) => {
  res.json({ downloadDir: getDownloadDir() });
});

// Update the download location.
router.post('/location', (req, res) => {
  try {
    const downloadDir = setDownloadDir(req.body.path);
    res.json({ ok: true, downloadDir });
  } catch (err) {
    res.status(400).json({ error: errorMessage(err) });
  }
});

// Full video metadata (title, thumbnail, uploader, duration).
router.post('/info', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'YouTube URL is required' });
    res.json(await getVideoInfo(url));
  } catch {
    res.status(500).json({
      error:
        'Unable to read video info. Make sure yt-dlp is installed and the URL is valid.',
    });
  }
});

// Video title only.
router.post('/title', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'YouTube URL is required' });
    const title = await getVideoTitle(url);
    res.json({ title, safeTitle: cleanBaseName(title) });
  } catch {
    res.status(500).json({
      error:
        'Unable to read video title. Make sure yt-dlp is installed and the URL is valid.',
    });
  }
});

// Download and convert audio.
router.post('/download', async (req, res) => {
  try {
    const { url, format = 'mp3', quality = 'auto', filename } = req.body;
    if (!url) return res.status(400).json({ error: 'YouTube URL is required' });
    if (!SUPPORTED_FORMATS.includes(format)) {
      return res.status(400).json({ error: 'Only MP3 and WAV are supported' });
    }

    const folder = ensureDir(getDownloadDir());
    const baseName =
      filename && String(filename).trim()
        ? cleanBaseName(filename)
        : cleanBaseName(await getVideoTitle(url));

    // Keep %(ext)s in the template: a fixed .mp3/.wav name can break yt-dlp
    // while it handles intermediate files.
    const outputTemplate = path.join(folder, `${baseName}.%(ext)s`);

    const args = [
      '--no-playlist',
      '--ignore-config',
      '--extract-audio',
      '--audio-format',
      format,
      '--newline',
      '-o',
      outputTemplate,
    ];
    if (format === 'mp3' && quality !== 'auto') {
      args.push('--audio-quality', String(quality));
    }
    args.push(url);

    const { stdout, stderr } = await runYtDlp(args);
    const fullPath = findDownloadedFile(folder, baseName, format);

    res.json({
      ok: true,
      fileName: path.basename(fullPath),
      folder,
      fullPath,
      log: `${stdout}\n${stderr}`.trim(),
    });
  } catch (err) {
    res.status(500).json({ error: errorMessage(err) });
  }
});

module.exports = router;
