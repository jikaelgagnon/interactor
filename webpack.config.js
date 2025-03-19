const path = require("path");
// const webpack = require("webpack");
// const Dotenv = require("dotenv-webpack");


module.exports = (env, argv) => ({
  entry: {
    background: "./src/background.js",
    content: "./src/content.js"  // Add content script
  },
  output: {
    filename: "[name].bundle.js",  // Generates background.bundle.js and content.bundle.js
    path: path.resolve(__dirname, "dist"),  // Store outputs in dist/
  },
  mode: "production",
  optimization: {
    minimize: true,
  },
  target: ['web', 'es5']
});
