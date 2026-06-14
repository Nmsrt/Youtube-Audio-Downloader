// @ts-check
const { spawn } = require('child_process');
const { cleanBaseName } = require('../utils/files');

/**
 * Metadata extracted from a YouTube video.
 * @typedef {Object} VideoInfo
 * @property {string} title - Original video title.
 * @property {string} safeTitle - Filename-safe version of the title.
 * @property {string} thumbnail - Thumbnail image URL.
 * @property {string} uploader - Channel / uploader name.
 * @property {string} duration - Human-readable duration (e.g. "3:45").
 */

/**
 * Output collected from a finished yt-dlp run.
 * @typedef {Object} YtDlpResult
 * @property {string} stdout
 * @property {string} stderr
 */

/**
 * Name of the yt-dlp executable. Running it directly (no shell) avoids Windows
 * shell splitting of paths / filenames that contain spaces.
 * @returns {string}
 */
function ytDlpCommand() {
  return process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
}

/**
 * Run yt-dlp with the given arguments and collect its output.
 * @param {string[]} args
 * @returns {Promise<YtDlpResult>}
 */
function runYtDlp(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(ytDlpCommand(), args, {
      shell: false,
      windowsHide: true,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', chunk => (stdout += chunk.toString()));
    child.stderr.on('data', chunk => (stderr += chunk.toString()));

    child.on('error', err =>
      reject(
        new Error(
          `Could not start yt-dlp. Make sure yt-dlp is installed and available in PATH. ${err.message}`
        )
      )
    );

    child.on('close', code => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(stderr || stdout || 'yt-dlp failed'));
    });
  });
}

/**
 * Fetch only the title of a video.
 * @param {string} url
 * @returns {Promise<string>}
 */
async function getVideoTitle(url) {
  const { stdout } = await runYtDlp([
    '--no-playlist',
    '--print',
    '%(title)s',
    url,
  ]);
  return stdout.split(/\r?\n/).find(Boolean)?.trim() || 'youtube-audio';
}

/**
 * Fetch full metadata for a video.
 * @param {string} url
 * @returns {Promise<VideoInfo>}
 */
async function getVideoInfo(url) {
  const { stdout } = await runYtDlp([
    '--no-playlist',
    '--dump-single-json',
    url,
  ]);
  const info = JSON.parse(stdout);

  return {
    title: info.title || 'youtube-audio',
    safeTitle: cleanBaseName(info.title || 'youtube-audio'),
    thumbnail: info.thumbnail || '',
    uploader: info.uploader || '',
    duration: info.duration_string || '',
  };
}

module.exports = { runYtDlp, getVideoTitle, getVideoInfo };
