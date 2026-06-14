// @ts-check
const { createApp } = require('./src/app');
const { PORT } = require('./src/config');
const { getDownloadDir } = require('./src/settings');

const app = createApp();

app.listen(PORT, () => {
  console.log(`YT-DLP Audio Downloader running at http://localhost:${PORT}`);
  console.log(`Files will be saved to: ${getDownloadDir()}`);
});
