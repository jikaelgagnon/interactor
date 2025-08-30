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

- `Config`: Contains the base URL to be _monitored_. Additionally, it contains list of all the URL patterns, HTML elements, and events that will be monitored and logged.
- `ExtractorList`: Contains a list of `ExtractorData` objects. These objects are used to extract additional metadata from a specified URL.

Subsequentlyy, the class goes through the following steps:

1. Upon initialization, `Monitor` creates an instance of `PageData`; this class stores the current URL and CSS selectors being applied to the page. When the user navigates to a new page, this data is updated.
2. It sends a message to background script to get the user's settings. This message is contained in a `DBDocument`. This class is used as a wrapper for all data sent to the database.
3. It attaches event listeners to all monitored HTML elements, creates a `MutationObserver` that looks for new elements and attaches elements to them, and adds a listener for navigations.
4. Whenever the user interacts with the page / navigates, a message is sent to the background script. This runs continuously until the user closes the tab / changes to a new website.

## Background Script Code

Essentially all relevant code can be found in [background.ts](./src/background.ts). This file runs immediately when the user accesses a relevant URL. It starts by creating an instance of `SessionManager`. This object manages a list of `TabSessionData` objects (these are stored in a field called `cachedTabSessions`). Each of these objects contains logged data from a different one of the user's active tabs. Upon instatiation of `SessionManager`, it checks the user's settings to see whether it should be sending their data to the database; sets up listeners for tab removal, tab updates, and receiving messages; and prunes stale sessions (more on this later). We need to fully understand what the code does in each of these cases:

### Case 1: Receiving a message

Different types of messages can be received which will lead to different behaviour.

#### `InitializeSession`

When the first activity is recorded in a new tab, the content script sends the URL and current time to the background script. Here it will create a new `TabSessionData` object that will be used to store all the activity data. It also stores the same data in the Chrome local storage. If `USE_DB` is set to true, it creates an entry in the database for the tab. Later, once the tab is closed, all activities will be "flushed" to this entry.

#### `InteractionDetection / NavigationDetection`

When activities are detected, both the `TabSessionData` object for that tab and chrome local storage are updated to include the new activity. The mirrored activity data in the background script and the chrome local storage act as safeguard against crashes. Think of the version in the background script as the "fast to access but possibly wrong" version and the Chrome local storage as the "slower to access but probably right" version. The key is the `loadSession` method:

```ts
  /**
   * Tries to get data from cache. Otherwise, gets it from chrome local storage.
   * Note that by the way this program is constructed, sessionCache data != Chrome storage data <==> sessionCache data is empty.
   * Thus, we can be certain that the output of this function can be trusted.
   * @param tabId
   * @returns
   */
  public async loadSession(tabId: number): Promise<TabSessionData | null> {
    if (this.cachedTabSessions.has(tabId)) return this.cachedTabSessions.get(tabId)!;

    const result = await chrome.storage.local.get(String(tabId));
    if (!result[tabId]) {
      console.error("Tried to load a session that doesn't exist in local storage");
      return null};
    const typedResult = result as Record<number, StoredSessionData>;
    const storedData = typedResult[tabId];

    const session = new TabSessionData();
    session.sessionId = storedData.sessionId;
    session.sessionInfo = storedData.sessionInfo;
    session.activityList = storedData.documents ?? [];
    session.baseUrl = storedData.baseUrl ?? "";
    session.setTabId(tabId);
    this.cachedTabSessions.set(tabId, session);
    return session;
  }
```

This is used whenever we are about flush to the DB.

Note: Activities _are not immediately sent to the DB_; this will be done later.

#### Cases 2/3: Tab close / tab update

If the tab is updated and the base URL changes or the tab is closed, then we

1. Flush all the cached activities to the DB
2. Set the end time in the DB
3. Delete from the cache

### So what was pruning?

As a safeguard, the code "prunes" the local storage for "stale" sessions. This just means that on startup, it cleans out any data that stayed in the chrome local storage. It's highly unlikely that any data would be there, but it's a safeguard in case something went wrong. Idea is "we only want complete data". If something crashed and it corrupt, throw it all out.

TODO? Review popup code? Doesnt seem super important...
