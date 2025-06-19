// const path = require("path");

// module.exports = {
//   entry: {
//     background: "./src/background.ts",  // Entry for background script
//     content: "./src/content.ts"         // Entry for content script
//   },
//   output: {
//     filename: "[name].bundle.js",  // Generates background.bundle.js and content.bundle.js
//     path: path.resolve(__dirname, "dist"),  // Store outputs in dist/
//   },
//   mode: "production",
//   module: {
//     rules: [
//       {
//         test: /\.ts$/,  // Handle TypeScript files
//         use: "ts-loader",  // Use ts-loader to transpile TypeScript
//         exclude: /node_modules/
//       }
//     ]
//   },
//   resolve: {
//     extensions: [".ts"]  // Resolve .ts and .js files
//   },
//   optimization: {
//     minimize: true,
//   },
//   target: 'web'  // Ensure targeting the web platform with modern JavaScript
// };

const path = require("path");

module.exports = {
  entry: {
    background: "./src/background.ts",  // Entry for background script
    content: "./src/content.ts",        // Entry for content script
    popup: "./src/popup.ts"             // Entry for popup script
  },
  output: {
    filename: "[name].bundle.js",  // Generates background.bundle.js, content.bundle.js, and popup.bundle.js
    path: path.resolve(__dirname, "dist"),  // Store outputs in dist/
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.ts$/,  // Handle TypeScript files
        use: "ts-loader",  // Use ts-loader to transpile TypeScript
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]  // Resolve .ts and .js files
  },
  optimization: {
    minimize: true,
  },
  target: 'web'  // Ensure targeting the web platform with modern JavaScript
};
