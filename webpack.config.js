const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = (env, argv) => ({
  entry: "./background.js",
  output: {
    filename: "background.bundle.js",
    path: path.resolve(__dirname),
  },
  mode: argv.mode || "production",
  plugins: [
    new Dotenv()
  ]
});

