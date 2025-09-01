module.exports = {
  launch: {
    headless: true, 
    pipe: true,
    dumpio: true,
    args: [
      `--disable-extensions-except=${require('path').resolve(__dirname, 'dist')}`,
      `--load-extension=${require('path').resolve(__dirname, 'dist')}`,
        "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
    ]
  }
};
