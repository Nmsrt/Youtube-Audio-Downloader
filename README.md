<div align="center">

<!-- Replace with your project logo or banner -->
<img src="https://via.placeholder.com/120x120.png?text=LOGO" alt="Project Logo" width="120" height="120" />

<h1>YouTube Audio Downloader</h1>

<p><em>A modern local YouTube audio downloader — extract MP3 and WAV files directly to your PC with a clean desktop-style interface.</em></p>

[![License](https://img.shields.io/badge/license-Personal%2FEducational-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/Nmsrt/Youtube-Audio-Downloader/releases)
[![Issues](https://img.shields.io/github/issues/Nmsrt/Youtube-Audio-Downloader)](https://github.com/Nmsrt/Youtube-Audio-Downloader/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

<br />

[Report Bug](https://github.com/Nmsrt/Youtube-Audio-Downloader/issues/new?template=bug_report.md) · [Request Feature](https://github.com/Nmsrt/Youtube-Audio-Downloader/issues/new?template=feature_request.md)

</div>

---

> ⚠️ **Personal & local use only.** This app runs entirely on your machine. No files are uploaded externally.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Audio Quality](#audio-quality)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Contact](#contact)

---

## Overview

YouTube Audio Downloader is a locally hosted web app that lets you extract audio from YouTube videos and save them directly to your PC — no cloud, no external uploads. It runs a lightweight Node.js + Express backend that calls `yt-dlp` and `FFmpeg` under the hood, served through a clean browser interface with light/dark mode support.

---

## Features

- ✅ **MP3 & WAV support** — Download audio as compressed MP3 or uncompressed WAV.
- ✅ **Auto-filled filename** — YouTube video title is fetched and pre-filled automatically.
- ✅ **Editable filename** — Rename the output file before downloading.
- ✅ **Custom save location** — Choose where files are saved directly inside the app.
- ✅ **Download progress section** — Visual feedback while the download is running.
- ✅ **Light / dark mode** — Toggle between themes from the interface.
- ✅ **One-click launch** — Double-click `start-app.bat` to start everything automatically.
- ✅ **Fully local** — All downloads go directly to your PC; nothing leaves your machine.

---

## Tech Stack

| Layer            | Technology                                 |
| ---------------- | ------------------------------------------ |
| Runtime          | [Node.js](https://nodejs.org/)             |
| Backend          | [Express](https://expressjs.com/)          |
| Audio extraction | [yt-dlp](https://github.com/yt-dlp/yt-dlp) |
| Audio processing | [FFmpeg](https://ffmpeg.org/)              |
| Frontend         | Vanilla JavaScript, HTML, CSS              |

---

## Getting Started

### Prerequisites

All four dependencies below **must be installed** before running the app.

---

#### 1. Node.js

Download and install the **LTS version** from [nodejs.org](https://nodejs.org/).

Verify:

```bash
node -v
npm -v
```

---

#### 2. Python

`yt-dlp` requires Python. Download from [python.org](https://www.python.org/downloads/).

> ⚠️ During installation, check **"Add Python to PATH"** before proceeding.

Verify:

```bash
python --version
```

---

#### 3. yt-dlp

```bash
pip install -U yt-dlp
```

Verify:

```bash
yt-dlp --version
```

---

#### 4. FFmpeg (Windows)

1. Download `ffmpeg-release-essentials.zip` from [gyan.dev/ffmpeg/builds](https://www.gyan.dev/ffmpeg/builds/).
2. Extract to a location of your choice, e.g.:
   ```
   C:\ffmpeg
   ```
   The folder should contain:
   ```
   C:\ffmpeg\bin\ffmpeg.exe
   ```
3. Add FFmpeg to your PATH:

   ```
   Windows Search → Edit the system environment variables
   → Environment Variables → Path → Edit → New
   ```

   Add: `C:\ffmpeg\bin` — then press OK on all dialogs.

4. Open a **new** terminal and verify:
   ```bash
   ffmpeg -version
   ```

---

### Installation

1. **Download or clone the repository:**

   ```bash
   git clone https://github.com/Nmsrt/Youtube-Audio-Downloader.git
   cd Youtube-Audio-Downloader
   ```

2. **Launch the app:**

   Double-click `start-app.bat`.

   On first run, the launcher will automatically run `npm install` before starting the server — this may take a moment. Future launches are much faster.

3. **The app will open automatically in your browser at:**
   ```
   http://localhost:3000
   ```

> ⚠️ Keep the terminal window open while using the app. Closing it will stop the server.

---

## Usage

1. Paste a YouTube URL into the input field.
2. Wait for the video title to auto-fill as the filename.
3. Select your output format — **MP3** or **WAV**.
4. _(Optional)_ Edit the filename.
5. _(Optional)_ Change the save location. Default:
   ```
   C:\Users\YOUR_USERNAME\Downloads
   ```
6. Click **Download**.

---

## Audio Quality

| Format | Quality Setting | Notes                                                     |
| ------ | --------------- | --------------------------------------------------------- |
| MP3    | Selectable      | Compressed; quality options are enabled                   |
| WAV    | Fixed (max)     | Uncompressed; quality selection is disabled automatically |

---

## Project Structure

```
Youtube-Audio-Downloader/
├── public/
│   ├── index.html            # App markup
│   ├── style.css             # Styling + dark mode
│   └── js/                   # Frontend ES modules
│       ├── main.js           # Entry point: state + event wiring
│       ├── dom.js            # Cached element references
│       ├── api.js            # fetch helpers
│       ├── ui.js             # Progress / preview rendering
│       ├── theme.js          # Light/dark theme toggle
│       ├── utils.js          # escapeHtml, log trimming
│       ├── errors.js         # Error-message helper
│       └── types.js          # JSDoc typedefs
├── src/                      # Backend
│   ├── app.js                # Express app factory
│   ├── config.js             # Constants (port, paths, formats)
│   ├── settings.js           # Mutable download-folder state
│   ├── routes/api.js         # API endpoints
│   ├── services/ytDlp.js     # yt-dlp process integration
│   └── utils/                # files.js, errors.js
├── server.js                 # Entry point: starts the HTTP server
├── start-app.bat             # One-click launcher (Windows)
├── package.json
└── README.md
```

---

## Troubleshooting

**`yt-dlp` not found**

```bash
pip install -U yt-dlp
```

Restart your terminal afterward.

---

**FFmpeg not found**

```bash
ffmpeg -version
```

If this fails, FFmpeg is either not installed or not added to PATH correctly. Revisit the [FFmpeg installation steps](#4-ffmpeg-windows).

---

**App opens but downloads fail**

Check that all of the following are true:

- `yt-dlp` is installed and accessible from terminal
- `FFmpeg` is installed and accessible from terminal
- Your internet connection is active
- The YouTube URL is valid and not a private/restricted video

---

**Port already in use**

Set a `PORT` environment variable before starting, e.g. `PORT=3001 npm start`,
or edit the default in `src/config.js`:

```js
// In src/config.js
PORT: Number(process.env.PORT) || 3000,
```

---

## License

Personal and educational use only.

---

## Contact

**Neo Monserrat** — neo.monserrat@gmail.com

Project Link: [https://github.com/Nmsrt/Youtube-Audio-Downloader](https://github.com/Nmsrt/Youtube-Audio-Downloader)

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/Nmsrt">Nmsrt</a></sub>
</div>
