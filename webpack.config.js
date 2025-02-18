const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = (env, argv) => ({
  entry: {
    background: "./background.js",
    content: "./content.js"  // Add content script
  },
  output: {
    filename: "[name].bundle.js",  // Generates background.bundle.js and content.bundle.js
    path: path.resolve(__dirname, "dist"),  // Store outputs in dist/
  },
  mode: argv.mode || "production",
  plugins: [
    new Dotenv()
  ],
});
