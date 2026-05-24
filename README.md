# YT-DLP Audio Downloader

A clean modern desktop-style YouTube audio downloader built with Node.js, Express, yt-dlp, and FFmpeg.

Supports:

- MP3 downloads
- WAV downloads
- Automatic YouTube title detection
- Editable filename before download
- Changeable save location
- Light/Dark mode
- Modern responsive UI

---

# Features

## Audio Only

This application focuses only on audio extraction.

Supported formats:

- MP3 (compressed)
- WAV (uncompressed)

No video downloading features are included.

---

# UI Features

- Clean full-width desktop layout
- Minimal modern styling
- Functional dark mode toggle
- Separate section containers
- Real-time download status
- Auto-filled filename from YouTube title
- Download location selector
- Compact one-view interface

---

# Requirements

Install these first:

## 1. Node.js

Download:

https://nodejs.org/

Recommended:
- Node.js LTS

---

## 2. Python

Required for yt-dlp.

Download:

https://www.python.org/downloads/

IMPORTANT:
Enable:

```text
Add Python to PATH
```

during installation.

---

## 3. FFmpeg

Download:

https://ffmpeg.org/download.html

Add FFmpeg to your system PATH.

To verify:

```bash
ffmpeg -version
```

---

## 4. yt-dlp

Install globally:

```bash
pip install -U yt-dlp
```

Verify installation:

```bash
yt-dlp --version
```

---

# Installation

## 1. Extract the ZIP

Extract the project anywhere.

Example:

```text
Downloads/
```

---

## 2. Open terminal inside project folder

Example:

```bash
cd youtube-audio-downloader
```

---

## 3. Install dependencies

```bash
npm install
```

---

# Running the App

Start the server:

```bash
node server.js
```

You should see:

```text
YouTube Audio Downloader running at http://localhost:3000
```

Open in browser:

```text
http://localhost:3000
```

---

# Default Save Location

By default, downloads are saved to:

## Windows

```text
C:\Users\YOUR_USERNAME\Downloads
```

The location can also be changed directly in the app UI.

---

# How to Use

1. Paste a YouTube link
2. Wait for the filename to auto-fill
3. Select:
   - MP3
   - WAV
4. (Optional) Edit filename
5. (Optional) Change save location
6. Click Download

---

# Audio Quality

## MP3

Audio quality settings are available.

## WAV

WAV is uncompressed audio.

Because of this:
- quality selection is disabled automatically

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
├── server.js
├── package.json
└── README.md
```

---

# Tech Stack

- Node.js
- Express
- yt-dlp
- FFmpeg
- Vanilla JavaScript
- Modern CSS

---

# Notes

- Downloads happen locally on your machine
- No files are uploaded to external servers
- Uses yt-dlp directly through backend execution

---

# Troubleshooting

## yt-dlp not found

Install:

```bash
pip install -U yt-dlp
```

Restart terminal afterward.

---

## FFmpeg not found

Ensure FFmpeg is added to PATH.

Test:

```bash
ffmpeg -version
```

---

## Port already in use

Change the port inside:

```js
server.js
```

Example:

```js
const PORT = 3001;
```

---

# License

Personal / educational use.
