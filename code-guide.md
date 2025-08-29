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

Note: A UML diagram can be found in [./diagrams folder](./diagrams/mermaid_readme.md) alongside the Mermaid code used to generate it.

All code can be found in the [src](./src/) folder.

## Content Script Code

The first place to look to understand the content-related code is in [content.ts itself](./src/content.ts). Most of the code here won't make sense right away. The key takeaway is that this file is used to instantiate an instance of the `Monitor` class, who's constructor takes as input a `ConfigLoader`. `Monitor` does the bulk of the work on the content; the code is found in [monitor.ts](./src/content/monitor.ts).

### `Monitor`

This class takes as input a `ConfigLoader`, which itself contains a `Config` and an `ExtractorList`.

- `Config`: Contains the base URL to be *monitored*. Additionally, it contains list of all the URL patterns, HTML elements, and events that will be monitored and logged. 
- `ExtractorList`: Contains a list of `ExtractorData` objects. These objects are used to extract additional metadata from a specified URL.

Subsequentlyy, the class goes through the following steps:

1. Upon initialization, `Monitor` creates an instance of `PageData`; this class stores the current URL and CSS selectors being applied to the page. When the user navigates to a new page, this data is updated.
2. It sends a message to background script to get the user's settings. This message is contained in a 


