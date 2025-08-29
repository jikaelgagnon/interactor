# Info
- `Node.js` is a JavaScript runtime environment (ie. it lets you run JavaScript code)
- `npm` is used to managed JavaScript packages
- `package.json` contains the project and dependency info
- Webpack is a module bundler for JavaScript applications. It takes modules with dependencies and generates static assets representing those modules. We will use webpack to bundle multiple JavaScript files into a single file. A module bundler allows you to write modular code and bundle it into a single file.
- TypeScript is a superset of JavaScript that adds static typing and other features to the language.

For info on how to run this code see: https://victoronsoftware.com/posts/add-webpack-and-typescript-to-chrome-extension/

# Purpose
This document goes into detail about how the code works and describes various tools used in this repo.
# Overall Structure

This Chrome extension works by communicating back and forth between a content script and a background script. The content script is responsible for interacting with the DOM, logging interactions/navigations, and extracting metadata. Each time the content script logs an activity, it sends a message to the background script, which, as the name suggests, runs in the background. The background script has two main roles:
1. Sending data to the database
2. Reading the user's settings for the extension (more generally, it can access the Chrome local storage)

Note: Under the [./diagrams folder](./diagrams/), you can find a UML diagram 

## Content Script Code