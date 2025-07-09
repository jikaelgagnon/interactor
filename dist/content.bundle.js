/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/communication/activity.ts":
/*!***************************************!*\
  !*** ./src/communication/activity.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ActivityType: () => (/* binding */ ActivityType)
/* harmony export */ });
/**
 * Defines a list of the possible activity types that can be recorded by the Monitor class
 */
var ActivityType;
(function (ActivityType) {
    ActivityType["SelfLoop"] = "Self-Loop";
    ActivityType["StateChange"] = "State Change";
    ActivityType["Interaction"] = "Interaction";
})(ActivityType || (ActivityType = {}));



/***/ }),

/***/ "./src/communication/backgroundmessage.ts":
/*!************************************************!*\
  !*** ./src/communication/backgroundmessage.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BackgroundMessage: () => (/* binding */ BackgroundMessage)
/* harmony export */ });

/**
 * A class used to send messages from the content to the background script in a consistent format.
 */
class BackgroundMessage {
    /**
     * @param senderMethod - enum type of the method sending the message
     * @param payload - the data being sent to the database
     */
    constructor(senderMethod, payload) {
        this.senderMethod = senderMethod;
        this.payload = payload;
    }
}


/***/ }),

/***/ "./src/communication/sender.ts":
/*!*************************************!*\
  !*** ./src/communication/sender.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SenderMethod: () => (/* binding */ SenderMethod)
/* harmony export */ });
var SenderMethod;
(function (SenderMethod) {
    SenderMethod["InitializeSession"] = "Initialize Session";
    SenderMethod["InteractionDetection"] = "Interaction Detection";
    SenderMethod["NavigationDetection"] = "Navigation Detection";
    SenderMethod["CloseSession"] = "Close Session";
})(SenderMethod || (SenderMethod = {}));



/***/ }),

/***/ "./src/configs/linkedin_config.json":
/*!******************************************!*\
  !*** ./src/configs/linkedin_config.json ***!
  \******************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"baseURL":"https://www.linkedin.com","events":["pause","play","seeked","seeking","scroll","click","ended","keypress"],"paths":{"/*":{"selectors":[{"selector":"button[aria-label^=\'React\']","name":"React Button"},{"selector":"button[aria-label=\'Comment\']","name":"Comment Button"},{"selector":"button[aria-label=\'Send in a private message\']","name":"Send Button"},{"selector":"button.social-reshare-button","name":"Repost Button"},{"selector":"button.follow","name":"Follow Button"},{"selector":"div.update-components-actor__container","name":"Profile Header"},{"selector":"button[aria-label$=\'to connect\']","name":"Connect Button"},{"selector":"button[aria-label^=\'Message\']","name":"Message Button"},{"selector":":has(> span[title^=\'Home\'])","name":"Home Button"},{"selector":":has(> span[title^=\'My network\'])","name":"My Network Button"},{"selector":":has(> span[title^=\'Jobs\'])","name":"Jobs Button"},{"selector":":has(> span[title^=\'Messaging\'])","name":"Messaging Button"},{"selector":":has(> span[title^=\'Notifications\'])","name":"Notifications Button"},{"selector":"div.feed-shared-update-v2__content","name":"Post Content"}]}}}');

/***/ }),

/***/ "./src/configs/tiktok_config.json":
/*!****************************************!*\
  !*** ./src/configs/tiktok_config.json ***!
  \****************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"baseURL":"https://www.tiktok.com","events":["pause","play","seeked","seeking","scroll","click","ended","keypress"],"paths":{"/*":{"selectors":[{"selector":"a[data-e2e=\\"tiktok-logo\\"]","name":"TikTok Logo"},{"selector":"span[data-e2e=\\"like-icon\\"]","name":"Like Button"},{"selector":"span[data-e2e=\\"comment-icon\\"]","name":"Comment Button"},{"selector":"span[data-e2e=\\"share-icon\\"]","name":"Share Button"},{"selector":"button[aria-label^=\\"Add to Favorites.\\"]","name":"Share Button"},{"selector":"button[aria-label=\\"For You\\"]","name":"Home Button"},{"selector":"button[aria-label=\\"Explore\\"]","name":"Explore Button"},{"selector":"button[aria-label=\\"Following\\"]","name":"Following Button"},{"selector":"button[aria-label=\\"Upload\\"]","name":"Upload Button"},{"selector":"button[aria-label=\\"LIVE\\"]","name":"LIVE Button"},{"selector":"button[aria-label=\\"Profile\\"]","name":"Profile Button"},{"selector":"button[aria-label=\\"Search\\"]","name":"Search Button"},{"selector":"button[aria-label=\\"Friends\\"]","name":"Friends Button"},{"selector":"button[aria-label=\\"Activity\\"]","name":"Activity Button"},{"selector":"button[aria-label=\\"Messages\\"]","name":"Messages Button"},{"selector":"video","name":"Video"},{"selector":"div[data-e2e=\\"recommend-card\\"]","name":"Profile Recommendation"},{"selector":"button[data-e2e=\\"card-followbutton\\"]","name":"Profile Recommendation Follow Button"},{"selector":"a[data-e2e=\\"video-author-avatar\\"]","name":"Author Avatar"},{"selector":"button[data-e2e=\\"feed-follow\\"]","name":"Feed Follow Button"},{"selector":"button[data-e2e=\\"follow-button\\"]","name":"Profile Follow Button"},{"selector":"button[data-e2e=\\"message-button\\"]","name":"Profile Message Button"},{"selector":"button[data-e2e=\\"share-btn\\"]","name":"Profile Share Button"},{"selector":"button[aria-label=\\"Latest\\"]","name":"Profile Latest Button"},{"selector":"button[aria-label=\\"Popular\\"]","name":"Profile Popular Button"},{"selector":"button[aria-label=\\"Oldest\\"]","name":"Profile Oldest Button"},{"selector":"button[aria-label*=\\"Likes\\"]","name":"Profile Video Like Button"},{"selector":"div[data-e2e*=\\"comment-like-icon\\"], div[aria-label^=\\"Like video\\"]","name":"Comment Like Button"},{"selector":"a[data-e2e=\\"video-music\\"]","name":"Video Music Button"},{"selector":"button.css-189kgrc-ButtonCategoryItemContainer.e13i6o248, button.css-qexeba-ButtonCategoryItemContainer.e13i6o248","name":"Category Button"}]}}}');

/***/ }),

/***/ "./src/configs/youtube_config.json":
/*!*****************************************!*\
  !*** ./src/configs/youtube_config.json ***!
  \*****************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"baseURL":"https://www.youtube.com","events":["pause","play","seeked","seeking","scroll","click","ended","keypress"],"paths":{"/*":{"selectors":[{"selector":"#logo-icon","name":"YouTube Logo"},{"selector":"ytm-shorts-lockup-view-model-v2","name":"Shorts on Miniplayer"},{"selector":"div#chip-shape-container, yt-tab-shape[tab-title]","name":"Category Button"},{"selector":"div#left-arrow-button","name":"Category back button"},{"selector":"div#right-arrow-button","name":"Category forward button"},{"selector":"a.yt-simple-endpoint.style-scope.ytd-guide-entry-renderer#endpoint, a.yt-simple-endpoint.style-scope.ytd-mini-guide-entry-renderer#endpoint","name":"Side Navigation Button"},{"selector":"yt-icon-button#guide-button","name":"Guide Button"},{"selector":"ytd-video-renderer, ytd-rich-item-renderer","name":"Video"},{"selector":"yt-lockup-view-model","name":"Content Collection"}]},"/":{},"/feed/*":{"selectors":[{"selector":"ytd-video-renderer[is-history]","name":"History Video"},{"selector":"ytd-grid-movie-renderer","name":"Movie Thumbnail"}]},"/channel/*":{"selectors":[{"selector":"ytd-default-promo-panel-renderer","name":"Promo Video"}]},"/@:id{/*}?":{"selectors":[{"selector":"yt-tab-shape[tab-title=\\"Home\\"]","name":"Creator Home"},{"selector":"yt-tab-shape[tab-title=\\"Videos\\"]","name":"Creator Videos"},{"selector":"yt-tab-shape[tab-title=\\"Playlists\\"]","name":"Creator Playlists"},{"selector":"yt-tab-shape[tab-title=\\"Shorts\\"]","name":"Creator Shorts"},{"selector":"yt-tab-shape[tab-title=\\"Live\\"]","name":"Creator Live"},{"selector":"yt-tab-shape[tab-title=\\"Posts\\"]","name":"Creator Posts"},{"selector":"div.yt-subscribe-button-view-model-wiz__container","name":"Creator Subscribe Button"},{"selector":"ytd-video-renderer.style-scope.ytd-channel-featured-content-renderer","name":"Creator Featured Video"},{"selector":"ytd-grid-video-renderer.style-scope.yt-horizontal-list-renderer","name":"Creator Video"}]},"/playlist?list=*":{"selectors":[{"selector":"div#content.style-scope.ytd-playlist-video-renderer","name":"Video Inside Playlist"}]},"/shorts/:id":{"selectors":[{"selector":"#like-button[is-shorts]","name":"Shorts Like Button"},{"selector":"#dislike-button[is-shorts]","name":"Shorts Dislike Button"},{"selector":"div#comments-button","name":"Comments Button"},{"selector":"ytd-player#player","name":"Shorts Video Player"}]},"/watch?v=*":{"selectors":[{"selector":"ytd-compact-video-renderer.style-scope.ytd-item-section-renderer","name":"Watch Page Recommended Video"},{"selector":"ytd-toggle-button-renderer#dislike-button","name":"Comment Dislike Button"},{"selector":"ytd-toggle-button-renderer#like-button","name":"Comment Like Button"},{"selector":"ytd-video-owner-renderer.style-scope.ytd-watch-metadata","name":"Channel Link"},{"selector":"like-button-view-model.ytLikeButtonViewModelHost","name":"Video Like Button"},{"selector":"dislike-button-view-model.ytDislikeButtonViewModelHost","name":"Video Dislike Button"},{"selector":"div#subscribe-button","name":"Subscribe Button"},{"selector":"div#player","name":"Video Player"},{"selector":"button[title=\'Share\']","name":"Share Button"}]},"/results?search_query=*":{"selectors":[{"selector":"ytd-video-renderer.style-scope.ytd-vertical-list-renderer","name":"Top Search Page Video"},{"selector":"ytd-video-renderer.style-scope.ytd-item-section-renderer","name":"Search Page Video"},{"selector":"yt-lockup-view-model.ytd-item-section-renderer","name":"Playlist"}]}}}');

/***/ }),

/***/ "./src/database/dbdocument.ts":
/*!************************************!*\
  !*** ./src/database/dbdocument.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ActivityDocument: () => (/* binding */ ActivityDocument),
/* harmony export */   DBDocument: () => (/* binding */ DBDocument),
/* harmony export */   SessionDocument: () => (/* binding */ SessionDocument)
/* harmony export */ });
/**
 * A class defining documents that are sent to the database from the content script
 */
class DBDocument {
    constructor(url, title) {
        this.sourceURL = url;
        this.sourceDocumentTitle = title;
    }
}
/**
 * A child of DBDocument that represents activities
 */
class ActivityDocument extends DBDocument {
    constructor(type, event, metadata, url, title) {
        super(url, title);
        this.activityType = type;
        this.createdAt = new Date();
        this.eventType = event.type;
        this.metadata = metadata;
    }
}
/**
 * A child of DBDocument that represents the start of a session
 */
class SessionDocument extends DBDocument {
    constructor(url, title) {
        super(url, title);
        this.email = "Email not set";
        this.startTime = new Date();
    }
    setEmail(email) {
        this.email = email;
    }
}



/***/ }),

/***/ "./src/interactions/config.ts":
/*!************************************!*\
  !*** ./src/interactions/config.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConfigLoader: () => (/* binding */ ConfigLoader)
/* harmony export */ });

class ConfigLoader {
    constructor(config) {
        this.config = config;
    }
    /**
     * A function that adds a data extractor for a given URL pattern. If the current URL
     * most closely matches this pattern out of all patterns in the config, then this
     * function will be called and the received ID will be included in the metadata of
     * each log that occurs on the page.
     * @param urlPattern - the pattern being matched
     * @param dataExtractor - the function to extract data
     */
    addIDSelector(urlPattern, dataExtractor) {
        const paths = this.config.paths;
        if (!(urlPattern in paths)) {
            throw new Error("Trying to add ID selector to path that doesn't exist");
        }
        paths[urlPattern].dataExtractor = dataExtractor;
    }
}


/***/ }),

/***/ "./src/interactions/monitor.ts":
/*!*************************************!*\
  !*** ./src/interactions/monitor.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Monitor: () => (/* binding */ Monitor)
/* harmony export */ });
/* harmony import */ var _communication_backgroundmessage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../communication/backgroundmessage */ "./src/communication/backgroundmessage.ts");
/* harmony import */ var _database_dbdocument__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../database/dbdocument */ "./src/database/dbdocument.ts");
/* harmony import */ var _pagedata__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pagedata */ "./src/interactions/pagedata.ts");
/* harmony import */ var _communication_activity__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../communication/activity */ "./src/communication/activity.ts");
/* harmony import */ var _communication_sender__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../communication/sender */ "./src/communication/sender.ts");





/**
 * This class reads from a provided Config object and attaches listeners to the elements specified in the selectors.
 * When these elements are interacted with, or when a navigation occurs, a document is sent to the background script
 * to be appended to the database. This class is instantiated in content.ts.
 *
 * @param interactionEvents - A list of the type of events we want to monitor as interactions (eg. click, scroll, etc.). Default is click
 * @param debug - If true, highlight all selected HTML elements with coloured boxes
 * @param paths - An object mapping path patterns to their corresponding CSS selectors Path patterns are consistent with the  URL Pattern API Syntax: https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API
 * @param baseURL - Base url for the page (eg. www.youtube.com). All paths are appended to this when matching URls
 * @param currentPageData - Contains data relevant to the current page.
 * @param interactionAttribute - Attribute added to all elements being monitored
 */
class Monitor {
    constructor(config) {
        /**
       * Generates a unique color from a given string
       * Source: https://stackoverflow.com/a/31037383
       * @returns Color hex code
       */
        this.StringToColor = (function () {
            let instance = null;
            return {
                next: function stringToColor(str) {
                    if (instance === null) {
                        instance = {};
                        instance.stringToColorHash = {};
                        instance.nextVeryDifferntColorIdx = 0;
                        instance.veryDifferentColors = ["#00FF00", "#0000FF", "#FF0000", "#01FFFE", "#FFA6FE", "#FFDB66", "#006401", "#010067", "#95003A", "#007DB5", "#FF00F6", "#FFEEE8", "#774D00", "#90FB92", "#0076FF", "#D5FF00", "#FF937E", "#6A826C", "#FF029D", "#FE8900", "#7A4782", "#7E2DD2", "#85A900", "#FF0056", "#A42400", "#00AE7E", "#683D3B", "#BDC6FF", "#263400", "#BDD393", "#00B917", "#9E008E", "#001544", "#C28C9F", "#FF74A3", "#01D0FF", "#004754", "#E56FFE", "#788231", "#0E4CA1", "#91D0CB", "#BE9970", "#968AE8", "#BB8800", "#43002C", "#DEFF74", "#00FFC6", "#FFE502", "#620E00", "#008F9C", "#98FF52", "#7544B1", "#B500FF", "#00FF78", "#FF6E41", "#005F39", "#6B6882", "#5FAD4E", "#A75740", "#A5FFD2", "#FFB167", "#009BFF", "#E85EBE"];
                    }
                    if (!instance.stringToColorHash[str]) {
                        instance.stringToColorHash[str] = instance.veryDifferentColors[instance.nextVeryDifferntColorIdx++];
                        console.log(`%c The colour for ${str}`, `color: ${instance.stringToColorHash[str]}`);
                    }
                    return instance.stringToColorHash[str];
                }
            };
        })();
        this.interactionEvents = config.events ? config.events : ['click'];
        this.debug = config.debug ? config.debug : true;
        this.paths = config.paths;
        this.baseURL = config.baseURL;
        this.currentPageData = new _pagedata__WEBPACK_IMPORTED_MODULE_2__.PageData();
        this.interactionAttribute = "monitoring-interactions";
        // Check if this page should be monitored
        // if (window.location.origin === this.baseURL) {
        //     this.initializeMonitor();
        // } else {
        //     console.log(`Skipping monitoring. Current origin (${window.location.origin}) does not match base URL (${this.baseURL}).`);
        // }
        if (window.location.origin === this.baseURL) {
            const runWhenVisible = () => {
                if (document.visibilityState === 'visible') {
                    this.initializeMonitor();
                    document.removeEventListener('visibilitychange', runWhenVisible);
                }
            };
            if (document.readyState === 'complete') {
                runWhenVisible();
            }
            else {
                window.addEventListener('load', runWhenVisible);
            }
            document.addEventListener('visibilitychange', runWhenVisible);
        }
    }
    /**
 * Initializes the monitor if base URL matches the current URL
 */
    initializeMonitor() {
        this.updateCurrentPageData(document.location.href);
        // Creates a new entry in the DB describing the state at the start of the session
        this.initializeSession();
        // Binds listeners to the HTML elements specified in the config for all matching path patterns
        this.bindEvents();
    }
    /**
   * Updates the page data whenever a new page is detected
   * @param url - the url of the new page
   */
    updateCurrentPageData(url) {
        this.currentPageData.update(this.baseURL, url, this.paths);
    }
    /**
   * Creates a new entry in the DB describing the state at the start of the session
   */
    initializeSession() {
        const currentState = new _database_dbdocument__WEBPACK_IMPORTED_MODULE_1__.SessionDocument(this.currentPageData.url, document.title);
        this.sendMessageToBackground(_communication_sender__WEBPACK_IMPORTED_MODULE_4__.SenderMethod.InitializeSession, currentState);
    }
    /**
   * Binds event listeners for mutations and navigation
   */
    bindEvents() {
        // Whenever new content is loaded, attach observers to each HTML element that matches the selectors in the configs
        const observer = new MutationObserver((mutations, obs) => this.addListenersToNewMatches());
        // Make the mutation observer observe the entire document for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        // Add an event listener to detect navigations on the page
        // @ts-ignore: Ignoring TypeScript error for navigation not found
        navigation.addEventListener("navigate", (e) => this.onNavigationDetection(e));
    }
    /**
   * Adds listeners to mutations (ie. newly rendered elements) and marks them with this.interacttionAttribute.
   * If debug mode is on, this will add a colourful border to these elements.
   */
    addListenersToNewMatches() {
        // console.log("adding selectors");
        // console.log("Current page data:");
        // console.log(this.currentPageData);
        this.currentPageData.selectors.forEach(interaction => {
            let elements = document.querySelectorAll(`:is(${interaction["selector"]}):not([${this.interactionAttribute}])`);
            let name = interaction["name"];
            elements.forEach(element => {
                if (this.debug)
                    element.style.border = `2px solid ${this.StringToColor.next(name)}`;
                element.setAttribute(this.interactionAttribute, 'true');
                for (let i = 0; i < this.interactionEvents.length; i++) {
                    element.addEventListener(this.interactionEvents[i], (e) => {
                        this.onInteractionDetection(element, e, name);
                    }, true);
                }
            });
        });
    }
    /**
   * Sends a message to the background script.
   * @param event - the HTML event that occured
   * @returns A document describing the state change
   */
    createStateChangeRecord(event) {
        const metadata = this.currentPageData.extractData();
        return new _database_dbdocument__WEBPACK_IMPORTED_MODULE_1__.ActivityDocument(_communication_activity__WEBPACK_IMPORTED_MODULE_3__.ActivityType.StateChange, event, metadata, this.currentPageData.url, document.title);
    }
    /**
   * Sends a message to the background script.
   * @param event - the HTML event that occured
   * @param urlChange - indicates whether the self-loop resulted in a url change
   *
   * @returns A document describing self loop
   */
    createSelfLoopRecord(event, urlChange) {
        const metadata = this.currentPageData.extractData();
        return new _database_dbdocument__WEBPACK_IMPORTED_MODULE_1__.ActivityDocument(_communication_activity__WEBPACK_IMPORTED_MODULE_3__.ActivityType.SelfLoop, event, metadata, this.currentPageData.url, document.title);
    }
    /**
   * Sends a message to the background script.
   * @param element - the element that triggered the event
   * @param name - the name of the element that triggered the callback (as defined in the config)
   * @param event - the HTML event that occured
   * @returns A document interaction self loop
   */
    createInteractionRecord(element, name, event) {
        let metadata = {
            html: element.getHTML(),
            elementName: name,
        };
        let extractedData = this.currentPageData.extractData();
        metadata = Object.assign(Object.assign({}, metadata), extractedData);
        return new _database_dbdocument__WEBPACK_IMPORTED_MODULE_1__.ActivityDocument(_communication_activity__WEBPACK_IMPORTED_MODULE_3__.ActivityType.Interaction, event, metadata, this.currentPageData.url, document.title);
    }
    /**
   * Sends a message to the background script.
   * @param sender - the name of the function that's sending the message to the background script
   * @param payload - the data being sent to the background script
   *
   * @returns Response indicating whether the message succeeded
   */
    async sendMessageToBackground(senderMethod, payload) {
        let message = new _communication_backgroundmessage__WEBPACK_IMPORTED_MODULE_0__.BackgroundMessage(senderMethod, payload);
        const response = await chrome.runtime.sendMessage(message);
        return response;
    }
    /**
   * Callback that creates a payload describing the interaction that occured and sends it to the background script
   * @param e - the event that triggered the callback
   * @param name - the name of the element that triggered the callback (as defined in the config)
   */
    onInteractionDetection(element, e, name) {
        console.log(`Event detected with event type: ${e.type}`);
        console.log(`Event triggered by ${element}`);
        console.log(element.innerHTML);
        console.log(element.getHTML());
        const record = this.createInteractionRecord(element, name, e);
        this.sendMessageToBackground(_communication_sender__WEBPACK_IMPORTED_MODULE_4__.SenderMethod.InteractionDetection, record);
    }
    /**
     * Callback that creates a payload describing the navigation that occured and sends it to the background script
     * @param e - the event that triggered the callback
     * @param name - the name of the element that triggered the callback (as defined in the config)
     */
    onNavigationDetection(navEvent) {
        let baseURLChange = navEvent.destination.url.split(".")[1] != this.currentPageData.url.split(".")[1];
        let urlChange = !(navEvent.destination.url === this.currentPageData.url);
        // let sourceState = this.getCleanStateName();
        // let match = this.currentPageData.checkForMatch(navEvent.destination.url);
        this.currentPageData.url = navEvent.destination.url;
        // let destState = this.getCleanStateName();
        console.log(`Navigation detected with event type: ${navEvent.type}`);
        if (baseURLChange) {
            this.sendMessageToBackground(_communication_sender__WEBPACK_IMPORTED_MODULE_4__.SenderMethod.CloseSession, new _database_dbdocument__WEBPACK_IMPORTED_MODULE_1__.DBDocument(this.currentPageData.url, document.title));
        }
        else if (navEvent.navigationType === "push") {
            this.updateCurrentPageData(this.currentPageData.url);
            const record = this.createStateChangeRecord(navEvent);
            this.sendMessageToBackground(_communication_sender__WEBPACK_IMPORTED_MODULE_4__.SenderMethod.NavigationDetection, record);
        }
        else if (navEvent.navigationType === "replace") {
            const record = this.createSelfLoopRecord(navEvent, urlChange);
            this.sendMessageToBackground(_communication_sender__WEBPACK_IMPORTED_MODULE_4__.SenderMethod.NavigationDetection, record);
        }
    }
}


/***/ }),

/***/ "./src/interactions/pagedata.ts":
/*!**************************************!*\
  !*** ./src/interactions/pagedata.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PageData: () => (/* binding */ PageData)
/* harmony export */ });
/**
 * A class responsible for tracking the state of the page that the user is currently on.
 */
class PageData {
    /**
     * Updates the state of the PageData
     * @param baseURL: The base url for the page (eg. www.youtube.com)
     * @param url: The full url of the current page
     * @param paths: A list of all the paths defined in a config
     */
    update(baseURL, url, paths) {
        this.url = url;
        let matches = this.updateMatchData(baseURL, paths);
        this.selectors = this.getSelectors(matches, paths);
    }
    /**
     * Sets `matchPathData` to be the PathData for the URL pattern with the closet match to `baseURL`
     * and returns a list of all matches. Additionally, it updates whether the current path
     * includes an id.
     * @param baseURL: The base url for the page (eg. www.youtube.com)
     * @param paths: A list of all the paths defined in a config
     *
     * @returns A list of all paths in the config that match `baseURL`
     */
    updateMatchData(baseURL, paths) {
        let closestMatch = ""; // the pattern that most closely matches the current URL
        // Get a list of all the paths that match the current URL
        const matches = Object.keys(paths).filter((path) => {
            console.log(path);
            // @ts-ignore: Ignoring TypeScript error for URLPattern not found
            const p = new URLPattern(path, baseURL);
            const match = p.test(this.url);
            // Closest match is the longest pattern that matches the current URL
            if (match && path.length > closestMatch.length) {
                closestMatch = path;
            }
            return match;
        });
        if (matches.length === 0) {
            console.log("no matches found");
        }
        // this.urlUsesId = closestMatch.endsWith(":id");
        this.matchPathData = paths[closestMatch];
        return matches;
    }
    /**
     * @returns Result of if it exsits`matchPathData.idSelector`, else it returns an empty string
     */
    extractData() {
        var _a, _b;
        return ((_b = (_a = this.matchPathData).dataExtractor) === null || _b === void 0 ? void 0 : _b.call(_a)) || {};
    }
    /**
     * @param matches: A list of all matching paths to the current url
     * @param paths: A list of all the paths defined in a config
     *
     * @returns A list of all selectors for the matching paths
     */
    getSelectors(matches, paths) {
        let currentSelectors = [];
        for (const path of matches) {
            let pathData = paths[path];
            if (pathData["selectors"]) {
                for (const selector of pathData["selectors"]) {
                    currentSelectors.push(selector);
                }
            }
        }
        return currentSelectors;
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./src/content.ts ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _interactions_monitor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./interactions/monitor */ "./src/interactions/monitor.ts");
/* harmony import */ var _configs_youtube_config_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./configs/youtube_config.json */ "./src/configs/youtube_config.json");
/* harmony import */ var _configs_tiktok_config_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./configs/tiktok_config.json */ "./src/configs/tiktok_config.json");
/* harmony import */ var _configs_linkedin_config_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./configs/linkedin_config.json */ "./src/configs/linkedin_config.json");
/* harmony import */ var _interactions_config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./interactions/config */ "./src/interactions/config.ts");





const ytConfigLoader = new _interactions_config__WEBPACK_IMPORTED_MODULE_4__.ConfigLoader(_configs_youtube_config_json__WEBPACK_IMPORTED_MODULE_1__);
const ytInteractor = new _interactions_monitor__WEBPACK_IMPORTED_MODULE_0__.Monitor(ytConfigLoader.config);
const tiktokIDSelector = () => {
    let vid = document.querySelector("div.xgplayer-container.tiktok-web-player");
    if (!vid) {
        console.log("no url found!");
        return {};
    }
    let id = vid.id.split("-").at(-1);
    let url = `https://tiktok.com/share/video/${id}`;
    return {
        "uniqueURL": url
    };
};
// console.log(tiktokConfig);
const tiktokConfigLoader = new _interactions_config__WEBPACK_IMPORTED_MODULE_4__.ConfigLoader(_configs_tiktok_config_json__WEBPACK_IMPORTED_MODULE_2__);
tiktokConfigLoader.addIDSelector("/*", tiktokIDSelector);
const tiktokInteractor = new _interactions_monitor__WEBPACK_IMPORTED_MODULE_0__.Monitor(tiktokConfigLoader.config);
// console.log(tiktokConfig);
const linkedinConfigLoader = new _interactions_config__WEBPACK_IMPORTED_MODULE_4__.ConfigLoader(_configs_linkedin_config_json__WEBPACK_IMPORTED_MODULE_3__);
const linkedinInteractor = new _interactions_monitor__WEBPACK_IMPORTED_MODULE_0__.Monitor(linkedinConfigLoader.config);

})();

/******/ })()
;
//# sourceMappingURL=content.bundle.js.map