module.exports = {
  launch: {
    headless: false, // must be false for extensions
    args: [
      `--disable-extensions-except=${require('path').resolve(__dirname, 'dist')}`,
      `--load-extension=${require('path').resolve(__dirname, 'dist')}`
    ]
  }
};
