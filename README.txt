# YT-DLP Audio Downloader

A modern local YouTube audio downloader built using:

- Node.js
- Express
- yt-dlp
- FFmpeg
- Vanilla JavaScript

This app allows you to download YouTube audio directly as:

- MP3
- WAV

with a clean desktop-style interface.

---

# Features

## Audio-only downloader

This application focuses only on audio extraction.

Supported formats:

- MP3 (compressed)
- WAV (uncompressed)

No video downloading is included.

---

# UI Features

- Modern desktop-style UI
- Light / dark mode toggle
- Full-width layout
- Download progress section
- Auto-filled filename from YouTube title
- Editable filename before download
- Changeable save location
- Functional WAV / MP3 logic
- Compact one-view interface
- Local downloading directly to your PC

---

# IMPORTANT

This app is designed for:

## Personal local use

It runs directly on your computer.

Downloads are saved locally to your PC.

---

# Requirements

You MUST install these before using the app.

---

# 1. Install Node.js

Download:

https://nodejs.org/

Install the:

```text
LTS Version
```

After installing, verify:

```bash
node -v
npm -v
```

---

# 2. Install Python

yt-dlp requires Python.

Download:

https://www.python.org/downloads/

IMPORTANT:

During installation:

```text
CHECK:
Add Python to PATH
```

Verify installation:

```bash
python --version
```

---

# 3. Install yt-dlp

Open terminal or command prompt:

```bash
pip install -U yt-dlp
```

Verify installation:

```bash
yt-dlp --version
```

---

# 4. Install FFmpeg

Download FFmpeg:

https://ffmpeg.org/download.html

Recommended Windows build:

https://www.gyan.dev/ffmpeg/builds/

Download:

```text
ffmpeg-release-essentials.zip
```

---

# How to Install FFmpeg on Windows

## 1. Extract FFmpeg

Example location:

```text
C:\ffmpeg
```

Inside it should contain:

```text
C:\ffmpeg\bin\ffmpeg.exe
```

---

## 2. Add FFmpeg to PATH

Open:

```text
Windows Search
→ Edit the system environment variables
```

Then:

```text
Environment Variables
→ Path
→ Edit
→ New
```

Add:

```text
C:\ffmpeg\bin
```

Press OK on everything.

---

## 3. Verify FFmpeg

Open a NEW terminal:

```bash
ffmpeg -version
```

If installed correctly, FFmpeg info will appear.

---

# HOW TO OPEN THE APP WITHOUT TYPING COMMANDS

## First Time Setup

1. Extract the ZIP.
2. Make sure:
   - Node.js installed
   - Python installed
   - yt-dlp installed
   - FFmpeg installed

---

# Launching the App

1. Double-click:

```text
start-app.bat
```

2. The app will:
   - automatically install dependencies if needed
   - start the local server
   - open the app automatically in your browser

---

# IMPORTANT

Keep the black terminal window OPEN while using the app.

Closing the terminal window will stop the app.

---

# First Run Behavior

The first launch may take longer because:

```text
npm install
```

runs automatically.

Future launches are much faster.

---

# Default Save Location

By default, downloads save to:

## Windows

```text
C:\Users\YOUR_USERNAME\Downloads
```

You can also change the save location directly inside the app.

---

# How To Use

1. Paste a YouTube link
2. Wait for the title to auto-fill
3. Choose:
   - MP3
   - WAV
4. (Optional) Edit filename
5. (Optional) Change save location
6. Click Download

---

# Audio Quality Logic

## MP3

Audio quality selection is enabled.

---

## WAV

WAV is uncompressed audio.

Because of this:

- audio quality is disabled automatically

---

# Project Structure

```text
youtube-audio-downloader/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── start-app.bat
├── server.js
├── package.json
└── README.md
```

---

# Troubleshooting

# yt-dlp not found

Install again:

```bash
pip install -U yt-dlp
```

Restart terminal afterward.

---

# FFmpeg not found

Verify:

```bash
ffmpeg -version
```

If not found:
- FFmpeg is not installed properly
- PATH is not configured correctly

---

# App opens but downloads fail

Check:
- yt-dlp installed
- FFmpeg installed
- internet connection works
- YouTube URL is valid

---

# Port already in use

Inside:

```text
server.js
```

change:

```js
const PORT = 3000;
```

to another port:

```js
const PORT = 3001;
```

---

# Notes

- Downloads happen locally
- No files are uploaded externally
- Uses yt-dlp directly through backend execution
- Designed for personal local use

---

# License

Personal / educational use only.