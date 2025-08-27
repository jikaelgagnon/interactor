/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/communication/activity.ts":
/*!***************************************!*\
  !*** ./src/communication/activity.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActivityType = void 0;
/**
 * Defines a list of the possible activity types that can be recorded by the Monitor class
 */
var ActivityType;
(function (ActivityType) {
    ActivityType["SelfLoop"] = "Self-Loop";
    ActivityType["StateChange"] = "State Change";
    ActivityType["Interaction"] = "Interaction";
    ActivityType["Both"] = "Both";
})(ActivityType || (exports.ActivityType = ActivityType = {}));


/***/ }),

/***/ "./src/communication/backgroundmessage.ts":
/*!************************************************!*\
  !*** ./src/communication/backgroundmessage.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BackgroundMessage = void 0;
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
exports.BackgroundMessage = BackgroundMessage;


/***/ }),

/***/ "./src/communication/sender.ts":
/*!*************************************!*\
  !*** ./src/communication/sender.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SenderMethod = void 0;
var SenderMethod;
(function (SenderMethod) {
    SenderMethod["InitializeSession"] = "Initialize Session";
    SenderMethod["InteractionDetection"] = "Interaction Detection";
    SenderMethod["NavigationDetection"] = "Navigation Detection";
    SenderMethod["CloseSession"] = "Close Session";
    SenderMethod["Any"] = "Any";
})(SenderMethod || (exports.SenderMethod = SenderMethod = {}));


/***/ }),

/***/ "./src/configs/youtube_config.json":
/*!*****************************************!*\
  !*** ./src/configs/youtube_config.json ***!
  \*****************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"baseURL":"https://www.youtube.com","events":["click"],"paths":{"/*":{"selectors":[{"selector":"#logo-icon","name":"YouTube Logo"},{"selector":"ytm-shorts-lockup-view-model-v2","name":"Shorts on Miniplayer"},{"selector":"div#chip-shape-container, yt-tab-shape[tab-title]","name":"Category Button"},{"selector":"div#left-arrow-button","name":"Category back button"},{"selector":"div#right-arrow-button","name":"Category forward button"},{"selector":"a.yt-simple-endpoint.style-scope.ytd-guide-entry-renderer#endpoint, a.yt-simple-endpoint.style-scope.ytd-mini-guide-entry-renderer#endpoint","name":"Side Navigation Button"},{"selector":"yt-icon-button#guide-button","name":"Guide Button"},{"selector":"ytd-video-renderer, ytd-rich-item-renderer","name":"Video"},{"selector":"yt-lockup-view-model","name":"Content Collection"}]},"/":{},"/feed/*":{"selectors":[{"selector":"ytd-video-renderer[is-history]","name":"History Video"},{"selector":"ytd-grid-movie-renderer","name":"Movie Thumbnail"}]},"/channel/*":{"selectors":[{"selector":"ytd-default-promo-panel-renderer","name":"Promo Video"}]},"/@:id{/*}?":{"selectors":[{"selector":"yt-tab-shape[tab-title=\\"Home\\"]","name":"Creator Home"},{"selector":"yt-tab-shape[tab-title=\\"Videos\\"]","name":"Creator Videos"},{"selector":"yt-tab-shape[tab-title=\\"Playlists\\"]","name":"Creator Playlists"},{"selector":"yt-tab-shape[tab-title=\\"Shorts\\"]","name":"Creator Shorts"},{"selector":"yt-tab-shape[tab-title=\\"Live\\"]","name":"Creator Live"},{"selector":"yt-tab-shape[tab-title=\\"Posts\\"]","name":"Creator Posts"},{"selector":"div.yt-subscribe-button-view-model-wiz__container","name":"Creator Subscribe Button"},{"selector":"ytd-video-renderer.style-scope.ytd-channel-featured-content-renderer","name":"Creator Featured Video"},{"selector":"ytd-grid-video-renderer.style-scope.yt-horizontal-list-renderer","name":"Creator Video"}]},"/playlist?list=*":{"selectors":[{"selector":"div#content.style-scope.ytd-playlist-video-renderer","name":"Video Inside Playlist"}]},"/shorts/:id":{"selectors":[{"selector":"#like-button[is-shorts]","name":"Shorts Like Button"},{"selector":"#dislike-button[is-shorts]","name":"Shorts Dislike Button"},{"selector":"div#comments-button","name":"Comments Button"},{"selector":"ytd-player#player","name":"Shorts Video Player"}]},"/watch?v=*":{"selectors":[{"selector":"ytd-compact-video-renderer.style-scope.ytd-item-section-renderer","name":"Watch Page Recommended Video"},{"selector":"ytd-toggle-button-renderer#dislike-button","name":"Comment Dislike Button"},{"selector":"ytd-toggle-button-renderer#like-button","name":"Comment Like Button"},{"selector":"ytd-video-owner-renderer.style-scope.ytd-watch-metadata","name":"Channel Link"},{"selector":"like-button-view-model.ytLikeButtonViewModelHost","name":"Video Like Button"},{"selector":"dislike-button-view-model.ytDislikeButtonViewModelHost","name":"Video Dislike Button"},{"selector":"div#subscribe-button","name":"Subscribe Button"},{"selector":"div#player","name":"Video Player"},{"selector":"button[title=\'Share\']","name":"Share Button"}]},"/results?search_query=*":{"selectors":[{"selector":"ytd-video-renderer.style-scope.ytd-vertical-list-renderer","name":"Top Search Page Video"},{"selector":"ytd-video-renderer.style-scope.ytd-item-section-renderer","name":"Search Page Video"},{"selector":"yt-lockup-view-model.ytd-item-section-renderer","name":"Playlist"}]}}}');

/***/ }),

/***/ "./src/content.ts":
/*!************************!*\
  !*** ./src/content.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const monitor_1 = __webpack_require__(/*! ./interactions/monitor */ "./src/interactions/monitor.ts");
const youtube_config_json_1 = __importDefault(__webpack_require__(/*! ./configs/youtube_config.json */ "./src/configs/youtube_config.json"));
const config_1 = __webpack_require__(/*! ./interactions/config */ "./src/interactions/config.ts");
const sender_1 = __webpack_require__(/*! ./communication/sender */ "./src/communication/sender.ts");
try {
    const getHomepageVideos = () => {
        // console.log("---- EXTRACTING HOMEPAGE LINKS ---");
        const contentDivs = Array.from(document.querySelectorAll('#content.ytd-rich-item-renderer'))
            .filter(div => {
            // Check if element is actually visible
            const rect = div.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 &&
                getComputedStyle(div).visibility !== 'hidden';
        });
        const videos = contentDivs.map(contentDiv => {
            var _a, _b, _c;
            // Get the direct anchor child
            const anchor = contentDiv.querySelector(':scope > yt-lockup-view-model a');
            const span = contentDiv.querySelector('h3 a span.yt-core-attributed-string');
            return {
                link: (_a = anchor === null || anchor === void 0 ? void 0 : anchor.href) !== null && _a !== void 0 ? _a : '',
                title: (_c = (_b = span === null || span === void 0 ? void 0 : span.textContent) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : ''
            };
        }).filter(video => video.link !== '');
        return { "videos": videos };
    };
    const getRecommendedVideos = () => {
        console.log("---- EXTRACTING RECOMMENDED LINKS ---");
        const contentDivs = Array.from(document.querySelectorAll('yt-lockup-view-model')).filter(div => {
            // Check if element is actually visible
            const rect = div.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 &&
                getComputedStyle(div).visibility !== 'hidden';
        });
        const videos = contentDivs.map(contentDiv => {
            var _a, _b, _c;
            // Get the anchor with the video link
            const anchor = contentDiv.querySelector('a[href^="/watch"]');
            const span = contentDiv.querySelector('h3 a span.yt-core-attributed-string');
            return {
                link: (_a = anchor === null || anchor === void 0 ? void 0 : anchor.href) !== null && _a !== void 0 ? _a : '',
                title: (_c = (_b = span === null || span === void 0 ? void 0 : span.textContent) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : ''
            };
        }).filter(video => video.link !== '');
        // console.log("Printing the first 5 videos");
        // console.table(videos.slice(0,5));
        return { "videos": videos };
    };
    const extractors = [new config_1.ExtractorData(sender_1.SenderMethod.InteractionDetection, "/", getHomepageVideos),
        new config_1.ExtractorData(sender_1.SenderMethod.InteractionDetection, "/watch?v=*", getRecommendedVideos)];
    const ytConfigLoader = new config_1.ConfigLoader(youtube_config_json_1.default, extractors);
    const ytInteractor = new monitor_1.Monitor(ytConfigLoader);
    // const tiktokIDSelector = (): object => {
    //     let vid = document.querySelector("div.xgplayer-container.tiktok-web-player");
    //     if (!vid){
    //         console.log("no url found!");
    //         return {};
    //     }
    //     let id = vid.id.split("-").at(-1);
    //     let url = `https://tiktok.com/share/video/${id}`;
    //     return {
    //         "uniqueURL": url
    //     };
    // }
    // console.log(tiktokConfig);
    // const tiktokConfigLoader = new ConfigLoader(tiktokConfig);
    // tiktokConfigLoader.injectExtractor("/*", tiktokIDSelector);
    // const tiktokInteractor = new Monitor(tiktokConfigLoader.config);
    // // console.log(tiktokConfig);
    // const linkedinConfigLoader = new ConfigLoader(linkedinConfig);
    // const linkedinInteractor = new Monitor(linkedinConfigLoader.config);
}
catch (error) {
    console.error('Content script error:', error);
}


/***/ }),

/***/ "./src/database/dbdocument.ts":
/*!************************************!*\
  !*** ./src/database/dbdocument.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SessionDocument = exports.ActivityDocument = exports.DBDocument = void 0;
/**
 * A class defining documents that are sent to the database from the content script
 */
class DBDocument {
    constructor(url, title) {
        this.sourceURL = url;
        this.sourceDocumentTitle = title;
    }
}
exports.DBDocument = DBDocument;
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
exports.ActivityDocument = ActivityDocument;
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
exports.SessionDocument = SessionDocument;


/***/ }),

/***/ "./src/interactions/config.ts":
/*!************************************!*\
  !*** ./src/interactions/config.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExtractorList = exports.ExtractorData = exports.ConfigLoader = void 0;
const sender_1 = __webpack_require__(/*! ../communication/sender */ "./src/communication/sender.ts");
class ExtractorData {
    constructor(activityType, urlPattern, extractor) {
        this.eventType = activityType;
        this.urlPattern = urlPattern;
        this.extractor = extractor;
    }
}
exports.ExtractorData = ExtractorData;
class ExtractorList {
    constructor(extractors = [], baseURL) {
        this.extractors = extractors;
        this.baseURL = baseURL;
    }
    extract(currentURL, eventType) {
        console.log(`Attempting extraction for url: ${currentURL} and event type ${eventType}`);
        let extractedData = {};
        this.extractors.filter(e => {
            const isCorrectActivity = (e.eventType == eventType || e.eventType == sender_1.SenderMethod.Any);
            // @ts-ignore: Ignoring TypeScript error for URLPattern not found
            const p = new URLPattern(e.urlPattern, this.baseURL);
            const isURLMatch = p.test(currentURL);
            return isCorrectActivity && isURLMatch;
        }).forEach(e => extractedData = Object.assign(Object.assign({}, extractedData), e.extractor()));
        return extractedData;
    }
}
exports.ExtractorList = ExtractorList;
class ConfigLoader {
    constructor(config, extractorList = []) {
        this.config = config;
        this.extractorList = new ExtractorList(extractorList, config.baseURL);
    }
}
exports.ConfigLoader = ConfigLoader;


/***/ }),

/***/ "./src/interactions/monitor.ts":
/*!*************************************!*\
  !*** ./src/interactions/monitor.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Monitor = void 0;
const backgroundmessage_1 = __webpack_require__(/*! ../communication/backgroundmessage */ "./src/communication/backgroundmessage.ts");
const dbdocument_1 = __webpack_require__(/*! ../database/dbdocument */ "./src/database/dbdocument.ts");
const pagedata_1 = __webpack_require__(/*! ./pagedata */ "./src/interactions/pagedata.ts");
const activity_1 = __webpack_require__(/*! ../communication/activity */ "./src/communication/activity.ts");
const sender_1 = __webpack_require__(/*! ../communication/sender */ "./src/communication/sender.ts");
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
    constructor(configLoader) {
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
        const config = configLoader.config;
        this.interactionEvents = config.events ? config.events : ['click'];
        this.highlight = true;
        this.paths = config.paths;
        this.baseURL = config.baseURL;
        this.currentPageData = new pagedata_1.PageData();
        this.interactionAttribute = "monitoring-interactions";
        this.extractorList = configLoader.extractorList;
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
        return __awaiter(this, void 0, void 0, function* () {
            console.log("initializing monitor");
            this.updateCurrentPageData(document.location.href);
            try {
                // Creates a new entry in the DB describing the state at the start of the session
                yield this.initializeSession();
                // Binds listeners to the HTML elements specified in the config for all matching path patterns
                this.bindEvents();
            }
            catch (err) {
                console.error("Failed to initialize session:", err);
            }
        });
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
        return __awaiter(this, void 0, void 0, function* () {
            const currentState = new dbdocument_1.SessionDocument(this.currentPageData.url, document.title);
            console.log("Checking highlight");
            const response = yield this.sendMessageToBackground(sender_1.SenderMethod.InitializeSession, currentState);
            this.highlight = response.highlight;
            console.log(`Highlight is set to ${this.highlight}`);
        });
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
        // console.log(`Value of highlight: ${this.highlight}`);
        // console.log("Current page data:");
        // console.log(this.currentPageData);
        this.currentPageData.selectors.forEach(interaction => {
            let elements = document.querySelectorAll(`:is(${interaction["selector"]}):not([${this.interactionAttribute}])`);
            let name = interaction["name"];
            elements.forEach(element => {
                if (this.highlight)
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
        console.log("Detected state change event");
        const metadata = this.extractorList.extract(this.currentPageData.url, sender_1.SenderMethod.NavigationDetection);
        console.log("printing metadata");
        console.log(metadata);
        return new dbdocument_1.ActivityDocument(activity_1.ActivityType.StateChange, event, metadata, this.currentPageData.url, document.title);
    }
    /**
   * Sends a message to the background script.
   * @param event - the HTML event that occured
   * @param urlChange - indicates whether the self-loop resulted in a url change
   *
   * @returns A document describing self loop
   */
    createSelfLoopRecord(event, urlChange) {
        console.log("Detected self loop change event");
        const metadata = this.extractorList.extract(this.currentPageData.url, sender_1.SenderMethod.NavigationDetection);
        console.log("printing metadata");
        console.log(metadata);
        return new dbdocument_1.ActivityDocument(activity_1.ActivityType.SelfLoop, event, metadata, this.currentPageData.url, document.title);
    }
    /**
   * Sends a message to the background script.
   * @param element - the element that triggered the event
   * @param name - the name of the element that triggered the callback (as defined in the config)
   * @param event - the HTML event that occured
   * @returns A document interaction self loop
   */
    createInteractionRecord(element, name, event) {
        console.log("Detected interaction event");
        let metadata = {
            html: element.getHTML(),
            elementName: name,
        };
        let extractedData = this.extractorList.extract(this.currentPageData.url, sender_1.SenderMethod.InteractionDetection);
        metadata = Object.assign(Object.assign({}, metadata), extractedData);
        console.log("printing metadata");
        console.log(metadata);
        return new dbdocument_1.ActivityDocument(activity_1.ActivityType.Interaction, event, metadata, this.currentPageData.url, document.title);
    }
    /**
   * Sends a message to the background script.
   * @param sender - the name of the function that's sending the message to the background script
   * @param payload - the data being sent to the background script
   *
   * @returns Response indicating whether the message succeeded
   */
    sendMessageToBackground(senderMethod, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let message = new backgroundmessage_1.BackgroundMessage(senderMethod, payload);
            const response = yield chrome.runtime.sendMessage(message);
            return response;
        });
    }
    /**
   * Callback that creates a payload describing the interaction that occured and sends it to the background script
   * @param e - the event that triggered the callback
   * @param name - the name of the element that triggered the callback (as defined in the config)
   */
    onInteractionDetection(element, e, name) {
        console.log("interaction event detected");
        console.log(`Event detected with event type: ${e.type}`);
        console.log(`Event triggered by ${element}`);
        // console.log(element.innerHTML);
        // console.log(element.getHTML());
        const record = this.createInteractionRecord(element, name, e);
        this.sendMessageToBackground(sender_1.SenderMethod.InteractionDetection, record);
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
            console.log("URL base change detected. Closing program.");
            this.sendMessageToBackground(sender_1.SenderMethod.CloseSession, new dbdocument_1.DBDocument(this.currentPageData.url, document.title));
        }
        else if (navEvent.navigationType === "push") {
            console.log("Push event detected.");
            const record = this.createStateChangeRecord(navEvent);
            this.sendMessageToBackground(sender_1.SenderMethod.NavigationDetection, record);
            this.updateCurrentPageData(this.currentPageData.url);
        }
        else if (navEvent.navigationType === "replace") {
            console.log("Replace event detected.");
            const record = this.createSelfLoopRecord(navEvent, urlChange);
            this.sendMessageToBackground(sender_1.SenderMethod.NavigationDetection, record);
        }
    }
}
exports.Monitor = Monitor;


/***/ }),

/***/ "./src/interactions/pagedata.ts":
/*!**************************************!*\
  !*** ./src/interactions/pagedata.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PageData = void 0;
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
     * @param patterns: A list of all the paths defined in a config
     *
     * @returns A list of all patterns in the config that match `baseURL`
     */
    updateMatchData(baseURL, patterns) {
        console.log("updating page data");
        let closestMatch = ""; // the pattern that most closely matches the current URL
        // Get a list of all the paths that match the current URL
        const matches = Object.keys(patterns).filter((path) => {
            // console.log(path);
            // @ts-ignore: Ignoring TypeScript error for URLPattern not found
            const p = new URLPattern(path, baseURL);
            const match = p.test(this.url);
            // Closest match is the longest pattern that matches the current URL
            if (match && path.length > closestMatch.length) {
                closestMatch = path;
            }
            return match;
        });
        this.currentPattern = closestMatch;
        if (matches.length === 0) {
            console.log("no matches found");
        }
        // this.urlUsesId = closestMatch.endsWith(":id");
        this.matchPathData = patterns[closestMatch];
        return matches;
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
exports.PageData = PageData;


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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/content.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDO1FBRUQsaURBQWlEO1FBQ2pELElBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzVDLE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFFRDs7Ozs7T0FLRztJQUVLLFlBQVksQ0FBQyxPQUFpQixFQUFFLEtBQXlCO1FBQzdELElBQUksZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO1FBQzFCLEtBQUssTUFBTSxJQUFJLElBQUksT0FBTyxFQUFFLENBQUM7WUFDekIsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLElBQUksUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7Z0JBQ3hCLEtBQUssTUFBTSxRQUFRLElBQUksUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7b0JBQzNDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDcEMsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQ0QsT0FBTyxnQkFBZ0IsQ0FBQztJQUM1QixDQUFDO0NBQ0o7QUEvRUQsNEJBK0VDOzs7Ozs7O1VDbkZEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbW11bmljYXRpb24vYWN0aXZpdHkudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb21tdW5pY2F0aW9uL2JhY2tncm91bmRtZXNzYWdlLnRzIiwid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvY29tbXVuaWNhdGlvbi9zZW5kZXIudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb250ZW50LnRzIiwid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvZGF0YWJhc2UvZGJkb2N1bWVudC50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2ludGVyYWN0aW9ucy9jb25maWcudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9pbnRlcmFjdGlvbnMvbW9uaXRvci50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2ludGVyYWN0aW9ucy9wYWdlZGF0YS50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2ludGVyYWN0b3Ivd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIERlZmluZXMgYSBsaXN0IG9mIHRoZSBwb3NzaWJsZSBhY3Rpdml0eSB0eXBlcyB0aGF0IGNhbiBiZSByZWNvcmRlZCBieSB0aGUgTW9uaXRvciBjbGFzc1xuICovXG5lbnVtIEFjdGl2aXR5VHlwZSB7XG4gICAgU2VsZkxvb3AgPSBcIlNlbGYtTG9vcFwiLFxuICAgIFN0YXRlQ2hhbmdlID0gXCJTdGF0ZSBDaGFuZ2VcIixcbiAgICBJbnRlcmFjdGlvbiA9IFwiSW50ZXJhY3Rpb25cIixcbiAgICBCb3RoID0gXCJCb3RoXCJcbn1cblxuZXhwb3J0IHtBY3Rpdml0eVR5cGV9IiwiaW1wb3J0IHtEQkRvY3VtZW50IH0gZnJvbSBcIi4uL2RhdGFiYXNlL2RiZG9jdW1lbnRcIjtcbmltcG9ydCB7IFNlbmRlck1ldGhvZCB9IGZyb20gXCIuL3NlbmRlclwiO1xuZXhwb3J0IHtCYWNrZ3JvdW5kTWVzc2FnZX07XG4vKipcbiAqIEEgY2xhc3MgdXNlZCB0byBzZW5kIG1lc3NhZ2VzIGZyb20gdGhlIGNvbnRlbnQgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0IGluIGEgY29uc2lzdGVudCBmb3JtYXQuXG4gKi9cbmNsYXNzIEJhY2tncm91bmRNZXNzYWdlIHtcbiAgICBzZW5kZXJNZXRob2Q6IFNlbmRlck1ldGhvZDtcbiAgICBwYXlsb2FkOiBEQkRvY3VtZW50O1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBzZW5kZXJNZXRob2QgLSBlbnVtIHR5cGUgb2YgdGhlIG1ldGhvZCBzZW5kaW5nIHRoZSBtZXNzYWdlXG4gICAgICogQHBhcmFtIHBheWxvYWQgLSB0aGUgZGF0YSBiZWluZyBzZW50IHRvIHRoZSBkYXRhYmFzZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yIChzZW5kZXJNZXRob2Q6IFNlbmRlck1ldGhvZCwgcGF5bG9hZDogREJEb2N1bWVudCkge1xuICAgICAgICB0aGlzLnNlbmRlck1ldGhvZCA9IHNlbmRlck1ldGhvZDtcbiAgICAgICAgdGhpcy5wYXlsb2FkID0gcGF5bG9hZDtcbiAgICB9XG59IiwiZW51bSBTZW5kZXJNZXRob2R7XG4gICAgSW5pdGlhbGl6ZVNlc3Npb24gPSBcIkluaXRpYWxpemUgU2Vzc2lvblwiLFxuICAgIEludGVyYWN0aW9uRGV0ZWN0aW9uID0gXCJJbnRlcmFjdGlvbiBEZXRlY3Rpb25cIixcbiAgICBOYXZpZ2F0aW9uRGV0ZWN0aW9uID0gXCJOYXZpZ2F0aW9uIERldGVjdGlvblwiLFxuICAgIENsb3NlU2Vzc2lvbiA9IFwiQ2xvc2UgU2Vzc2lvblwiLFxuICAgIEFueSA9IFwiQW55XCJcbn1cbmV4cG9ydCB7U2VuZGVyTWV0aG9kfTsiLCJpbXBvcnQgeyBNb25pdG9yIH0gZnJvbSBcIi4vaW50ZXJhY3Rpb25zL21vbml0b3JcIjtcbmltcG9ydCB5dENvbmZpZyBmcm9tICcuL2NvbmZpZ3MveW91dHViZV9jb25maWcuanNvbic7XG5pbXBvcnQgdGlrdG9rQ29uZmlnIGZyb20gJy4vY29uZmlncy90aWt0b2tfY29uZmlnLmpzb24nO1xuaW1wb3J0IGxpbmtlZGluQ29uZmlnIGZyb20gJy4vY29uZmlncy9saW5rZWRpbl9jb25maWcuanNvbic7XG5pbXBvcnQgeyBDb25maWdMb2FkZXIsIEV4dHJhY3RvckRhdGEgfSBmcm9tIFwiLi9pbnRlcmFjdGlvbnMvY29uZmlnXCI7XG5pbXBvcnQgeyBBY3Rpdml0eVR5cGUgfSBmcm9tIFwiLi9jb21tdW5pY2F0aW9uL2FjdGl2aXR5XCI7XG5pbXBvcnQgeyBTZW5kZXJNZXRob2QgfSBmcm9tIFwiLi9jb21tdW5pY2F0aW9uL3NlbmRlclwiO1xuXG50cnlcbntcbiAgICBjb25zdCBnZXRIb21lcGFnZVZpZGVvcyA9ICgpOiBvYmplY3QgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0tLS0gRVhUUkFDVElORyBIT01FUEFHRSBMSU5LUyAtLS1cIik7XG4gICAgICAgIGNvbnN0IGNvbnRlbnREaXZzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjY29udGVudC55dGQtcmljaC1pdGVtLXJlbmRlcmVyJykpXG4gICAgICAgICAgICAuZmlsdGVyKGRpdiA9PiB7XG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgZWxlbWVudCBpcyBhY3R1YWxseSB2aXNpYmxlXG4gICAgICAgICAgICAgICAgY29uc3QgcmVjdCA9IGRpdi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVjdC53aWR0aCA+IDAgJiYgcmVjdC5oZWlnaHQgPiAwICYmIFxuICAgICAgICAgICAgICAgICAgICBnZXRDb21wdXRlZFN0eWxlKGRpdikudmlzaWJpbGl0eSAhPT0gJ2hpZGRlbic7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHZpZGVvcyA9IGNvbnRlbnREaXZzLm1hcChjb250ZW50RGl2ID0+IHtcbiAgICAgICAgICAgIC8vIEdldCB0aGUgZGlyZWN0IGFuY2hvciBjaGlsZFxuICAgICAgICAgICAgY29uc3QgYW5jaG9yID0gY29udGVudERpdi5xdWVyeVNlbGVjdG9yKCc6c2NvcGUgPiB5dC1sb2NrdXAtdmlldy1tb2RlbCBhJykgYXMgSFRNTEFuY2hvckVsZW1lbnQgfCBudWxsO1xuICAgICAgICAgICAgY29uc3Qgc3BhbiA9IGNvbnRlbnREaXYucXVlcnlTZWxlY3RvcignaDMgYSBzcGFuLnl0LWNvcmUtYXR0cmlidXRlZC1zdHJpbmcnKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBsaW5rOiBhbmNob3I/LmhyZWYgPz8gJycsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHNwYW4/LnRleHRDb250ZW50Py50cmltKCkgPz8gJydcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pLmZpbHRlcih2aWRlbyA9PiB2aWRlby5saW5rICE9PSAnJyk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1widmlkZW9zXCI6IHZpZGVvc307XG4gICAgfTtcblxuICAgIGNvbnN0IGdldFJlY29tbWVuZGVkVmlkZW9zID0gKCk6IG9iamVjdCA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLSBFWFRSQUNUSU5HIFJFQ09NTUVOREVEIExJTktTIC0tLVwiKTtcbiAgICAgICAgY29uc3QgY29udGVudERpdnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3l0LWxvY2t1cC12aWV3LW1vZGVsJykpLmZpbHRlcihkaXYgPT4ge1xuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgZWxlbWVudCBpcyBhY3R1YWxseSB2aXNpYmxlXG4gICAgICAgICAgICBjb25zdCByZWN0ID0gZGl2LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgcmV0dXJuIHJlY3Qud2lkdGggPiAwICYmIHJlY3QuaGVpZ2h0ID4gMCAmJiBcbiAgICAgICAgICAgICAgICBnZXRDb21wdXRlZFN0eWxlKGRpdikudmlzaWJpbGl0eSAhPT0gJ2hpZGRlbic7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgdmlkZW9zOiBvYmplY3QgPSBjb250ZW50RGl2cy5tYXAoY29udGVudERpdiA9PiB7XG4gICAgICAgICAgICAvLyBHZXQgdGhlIGFuY2hvciB3aXRoIHRoZSB2aWRlbyBsaW5rXG4gICAgICAgICAgICBjb25zdCBhbmNob3IgPSBjb250ZW50RGl2LnF1ZXJ5U2VsZWN0b3IoJ2FbaHJlZl49XCIvd2F0Y2hcIl0nKSBhcyBIVE1MQW5jaG9yRWxlbWVudCB8IG51bGw7XG4gICAgICAgICAgICBjb25zdCBzcGFuID0gY29udGVudERpdi5xdWVyeVNlbGVjdG9yKCdoMyBhIHNwYW4ueXQtY29yZS1hdHRyaWJ1dGVkLXN0cmluZycpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGxpbms6IGFuY2hvcj8uaHJlZiA/PyAnJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogc3Bhbj8udGV4dENvbnRlbnQ/LnRyaW0oKSA/PyAnJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSkuZmlsdGVyKHZpZGVvID0+IHZpZGVvLmxpbmsgIT09ICcnKTtcbiAgICAgICAgXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUHJpbnRpbmcgdGhlIGZpcnN0IDUgdmlkZW9zXCIpO1xuICAgICAgICAvLyBjb25zb2xlLnRhYmxlKHZpZGVvcy5zbGljZSgwLDUpKTtcbiAgICAgICAgcmV0dXJuIHtcInZpZGVvc1wiOiB2aWRlb3N9O1xuICAgIH07XG5cbiAgICBjb25zdCBleHRyYWN0b3JzID0gW25ldyBFeHRyYWN0b3JEYXRhKFNlbmRlck1ldGhvZC5JbnRlcmFjdGlvbkRldGVjdGlvbiwgXCIvXCIsIGdldEhvbWVwYWdlVmlkZW9zKSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEV4dHJhY3RvckRhdGEoU2VuZGVyTWV0aG9kLkludGVyYWN0aW9uRGV0ZWN0aW9uLCBcIi93YXRjaD92PSpcIiwgZ2V0UmVjb21tZW5kZWRWaWRlb3MpXVxuXG4gICAgY29uc3QgeXRDb25maWdMb2FkZXIgPSBuZXcgQ29uZmlnTG9hZGVyKHl0Q29uZmlnLCBleHRyYWN0b3JzKTtcblxuICAgIGNvbnN0IHl0SW50ZXJhY3RvciA9IG5ldyBNb25pdG9yKHl0Q29uZmlnTG9hZGVyKTtcblxuICAgIC8vIGNvbnN0IHRpa3Rva0lEU2VsZWN0b3IgPSAoKTogb2JqZWN0ID0+IHtcbiAgICAvLyAgICAgbGV0IHZpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYueGdwbGF5ZXItY29udGFpbmVyLnRpa3Rvay13ZWItcGxheWVyXCIpO1xuICAgIC8vICAgICBpZiAoIXZpZCl7XG4gICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhcIm5vIHVybCBmb3VuZCFcIik7XG4gICAgLy8gICAgICAgICByZXR1cm4ge307XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgbGV0IGlkID0gdmlkLmlkLnNwbGl0KFwiLVwiKS5hdCgtMSk7XG4gICAgLy8gICAgIGxldCB1cmwgPSBgaHR0cHM6Ly90aWt0b2suY29tL3NoYXJlL3ZpZGVvLyR7aWR9YDtcbiAgICAvLyAgICAgcmV0dXJuIHtcbiAgICAvLyAgICAgICAgIFwidW5pcXVlVVJMXCI6IHVybFxuICAgIC8vICAgICB9O1xuICAgIC8vIH1cblxuXG5cbiAgICAvLyBjb25zb2xlLmxvZyh0aWt0b2tDb25maWcpO1xuICAgIC8vIGNvbnN0IHRpa3Rva0NvbmZpZ0xvYWRlciA9IG5ldyBDb25maWdMb2FkZXIodGlrdG9rQ29uZmlnKTtcbiAgICAvLyB0aWt0b2tDb25maWdMb2FkZXIuaW5qZWN0RXh0cmFjdG9yKFwiLypcIiwgdGlrdG9rSURTZWxlY3Rvcik7XG4gICAgLy8gY29uc3QgdGlrdG9rSW50ZXJhY3RvciA9IG5ldyBNb25pdG9yKHRpa3Rva0NvbmZpZ0xvYWRlci5jb25maWcpO1xuXG4gICAgLy8gLy8gY29uc29sZS5sb2codGlrdG9rQ29uZmlnKTtcbiAgICAvLyBjb25zdCBsaW5rZWRpbkNvbmZpZ0xvYWRlciA9IG5ldyBDb25maWdMb2FkZXIobGlua2VkaW5Db25maWcpO1xuICAgIC8vIGNvbnN0IGxpbmtlZGluSW50ZXJhY3RvciA9IG5ldyBNb25pdG9yKGxpbmtlZGluQ29uZmlnTG9hZGVyLmNvbmZpZyk7XG59IGNhdGNoIChlcnJvcil7XG4gICAgY29uc29sZS5lcnJvcignQ29udGVudCBzY3JpcHQgZXJyb3I6JywgZXJyb3IpO1xufSIsImltcG9ydCB7IEFjdGl2aXR5VHlwZSB9IGZyb20gXCIuLi9jb21tdW5pY2F0aW9uL2FjdGl2aXR5XCI7XHJcbi8qKlxyXG4gKiBBIGNsYXNzIGRlZmluaW5nIGRvY3VtZW50cyB0aGF0IGFyZSBzZW50IHRvIHRoZSBkYXRhYmFzZSBmcm9tIHRoZSBjb250ZW50IHNjcmlwdFxyXG4gKi9cclxuY2xhc3MgREJEb2N1bWVudCB7XHJcbiAgICAvLyBVUkwgYXQgd2hpY2h0IHRoZSBldmVudCB3YXMgY3JlYXRlZFxyXG4gICAgc291cmNlVVJMOiBzdHJpbmc7XHJcbiAgICBzb3VyY2VEb2N1bWVudFRpdGxlOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnNvdXJjZVVSTCA9IHVybDtcclxuICAgICAgICB0aGlzLnNvdXJjZURvY3VtZW50VGl0bGUgPSB0aXRsZTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgY2hpbGQgb2YgREJEb2N1bWVudCB0aGF0IHJlcHJlc2VudHMgYWN0aXZpdGllc1xyXG4gKi9cclxuXHJcbmNsYXNzIEFjdGl2aXR5RG9jdW1lbnQgZXh0ZW5kcyBEQkRvY3VtZW50e1xyXG4gICAgLy8gVGhlIHR5cGUgb2YgYWN0aXZpdHkgYmVpbmcgbG9nZ2VkLiBFaXRoZXIgXCJzdGF0ZV9jaGFnZVwiLCBcInNlbGZfbG9vcFwiLCBvciBcImludGVyYWN0aW9uXCJcclxuICAgIGFjdGl2aXR5VHlwZTogQWN0aXZpdHlUeXBlO1xyXG4gICAgLy8gVGltZXN0YW1wIGZvciB3aGVuIHRoZSBkb2N1bWVudCB3YXMgY3JlYXRlZFxyXG4gICAgY3JlYXRlZEF0OiBEYXRlO1xyXG4gICAgLy8gRXZlbnQgdHlwZSAoZWcuIGNsaWNrLCBzY3JvbGwsIGV0Yy4uLilcclxuICAgIGV2ZW50VHlwZTogc3RyaW5nXHJcbiAgICAvLyBNZXRhZGF0YSBhYm91dCB0aGUgZXZlbnRcclxuICAgIG1ldGFkYXRhOiBPYmplY3Q7XHJcbiAgICBjb25zdHJ1Y3Rvcih0eXBlOiBBY3Rpdml0eVR5cGUsIGV2ZW50OiBFdmVudCwgbWV0YWRhdGE6IE9iamVjdCwgdXJsOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcih1cmwsIHRpdGxlKTtcclxuICAgICAgICB0aGlzLmFjdGl2aXR5VHlwZSA9IHR5cGU7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVkQXQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRUeXBlID0gZXZlbnQudHlwZVxyXG4gICAgICAgIHRoaXMubWV0YWRhdGEgPSBtZXRhZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgY2hpbGQgb2YgREJEb2N1bWVudCB0aGF0IHJlcHJlc2VudHMgdGhlIHN0YXJ0IG9mIGEgc2Vzc2lvblxyXG4gKi9cclxuXHJcbmNsYXNzIFNlc3Npb25Eb2N1bWVudCBleHRlbmRzIERCRG9jdW1lbnR7XHJcbiAgICBzdGFydFRpbWU6IERhdGU7XHJcbiAgICBlbmRUaW1lPzogRGF0ZTtcclxuICAgIGVtYWlsOiBzdHJpbmcgPSBcIkVtYWlsIG5vdCBzZXRcIjtcclxuICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCB0aXRsZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIodXJsLCB0aXRsZSk7XHJcbiAgICAgICAgdGhpcy5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgc2V0RW1haWwoZW1haWw6IHN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5lbWFpbCA9IGVtYWlsO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge0RCRG9jdW1lbnQsIEFjdGl2aXR5RG9jdW1lbnQsIFNlc3Npb25Eb2N1bWVudH07IiwiaW1wb3J0IHsgU2VuZGVyTWV0aG9kIH0gZnJvbSBcIi4uL2NvbW11bmljYXRpb24vc2VuZGVyXCI7XG5cbmV4cG9ydCB7U2VsZWN0b3JOYW1lUGFpciwgQ29uZmlnLCBDb25maWdMb2FkZXIsIFBhdHRlcm5EYXRhLCBQYXR0ZXJuU2VsZWN0b3JNYXAsIEV4dHJhY3RvckRhdGEsIEV4dHJhY3Rvckxpc3R9O1xuXG5pbnRlcmZhY2UgU2VsZWN0b3JOYW1lUGFpcntcbiAgICAvKipcbiAgICAgKiBBbiBpbnRlcmZhY2UgdG8gbWFwIENTUyBzZWxlY3RvcnMgdG8gaHVtYW4gcmVhZGFibGUgbmFtZXNcbiAgICAgKi9cbiAgICAvLyBUaGUgQ1NTIHNlbGVjdG9yXG4gICAgc2VsZWN0b3I6IHN0cmluZztcbiAgICAvLyBUaGUgaHVtYW4gcmVhZGFibGUgbmFtZSBmb3IgdGhlIENTUyBzZWxlY3RvclxuICAgIG5hbWU6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFBhdHRlcm5TZWxlY3Rvck1hcCB7XG4gICAgLyoqXG4gICAgICogQSBtYXBwaW5nIG9mIFVSTCBwYXR0ZXJucyB0byBwYXRoIGRhdGEuXG4gICAgICogVGhlIFVSTCBQYXR0ZXJuIHNob3VsZCBmb2xsb3cgdGhlIFVSTCBQYXR0ZXJuIEFQSSBzeW50YXguXG4gICAgICogVGhlc2UgYXJlIGFwcGVuZGVkIHRvIHRoZSBiYXNlVVJMIHdoZW4gY2hlY2tpbmcgZm9yIG1hdGNoZXMuXG4gICAgICogRXg6IGJhc2VVUkw6IHd3dy55b3V0dWJlLmNvbSwgcGF0aDogL3Nob3J0cy86aWQgLT4gd3d3LnlvdXR1YmUuY29tL3Nob3J0cy86aWRcbiAgICAgKi9cbiAgICBbcGF0aDogc3RyaW5nXTogUGF0dGVybkRhdGE7XG59XG5cbmludGVyZmFjZSBQYXR0ZXJuRGF0YSB7XG4gICAgLyoqXG4gICAgICogQW4gaW50ZXJmYWNlIHRvIGJ1bmRsZSB0b2dldGhlciBkYXRhIGluIHRoZSBDb25maWcgZm9yIGEgZ2l2ZW4gcGF0aCBwYXR0ZXJuLlxuICAgICAqIEl0IGNvbnRhaW5zIGEgbGlzdCBvZiBDU1Mgc2VsZWN0b3JzIGZvciB0aGUgcGF0aCBwYXR0ZXJuIGFuZCBvcHRpb25hbGx5XG4gICAgICogYW4gaWRTZWxlY3RvciBmdW5jdGlvbiB0aGF0IGV4dHJhY3RzIGFuIElEIGZyb20gcGFnZXMgd2l0aCB0aGUgY29ycmVzcG9uZGluZyBVUkxcbiAgICAgKi9cbiAgICAvLyBBIGxpc3Qgb2Ygc2VsZWN0b3JzIGFuZCBuYW1lcyBmb3IgdGhlIHBhZ2VcbiAgICBzZWxlY3RvcnM/OiBTZWxlY3Rvck5hbWVQYWlyW107XG4gICAgLy8gQSBmdW5jdGlvbiB0aGF0IGV4dHJhY3RzIG1ldGFkYXRhIGZyb20gdGhlIHBhZ2VcbiAgICBkYXRhRXh0cmFjdG9yPzogKCkgPT4gb2JqZWN0O1xufVxuXG5pbnRlcmZhY2UgQ29uZmlnIHtcbiAgICAvKipcbiAgICAgKiBBbiBpbnRlcmZhY2UgdGhhdCBjb250YWlucyBhbGwgdGhlIGRhdGEgcmVxdWlyZWQgdG8gaW5zdGFudGlhdGUgYSBNb25pdG9yLlxuICAgICAqL1xuICAgIC8vIFRoZSBiYXNlIFVSTCB0aGF0IHRoZSBtb25pdG9yIHNob3VsZCBzdGFydCBhdFxuICAgIGJhc2VVUkw6IHN0cmluZztcbiAgICAvLyBBIG1hcHBpbmcgb2YgVVJMIHBhdHRlcm5zIHRvIHBhdGggZGF0YS4gVGhlIFVSTCBQYXR0ZXJuIHNob3VsZCBmb2xsb3cgdGhlIFxuICAgIC8vIFVSTCBQYXR0ZXJuIEFQSSBzeW50YXguIFRoZXNlIGFyZSBhcHBlbmRlZCB0byB0aGUgYmFzZVVSTCB3aGVuIGNoZWNraW5nIGZvciBtYXRjaGVzXG4gICAgLy8gRXg6IGJhc2VVUkw6IHd3dy55b3V0dWJlLmNvbSwgcGF0aDogL3Nob3J0cy86aWQgLT4gd3d3LnlvdXR1YmUuY29tL3Nob3J0cy86aWRcbiAgICBwYXRoczogUGF0dGVyblNlbGVjdG9yTWFwO1xuICAgIC8vIEluZGljYXRlcyB3aGV0aGVyIHRoZSBNb25pdG9yIHNob3VsZCBiZSBpbiBkZWJ1ZyBtb2RlLiBJZiB0cnVlLCBhZGQgY29sb3VyZWQgYm94ZXNcbiAgICAvLyBhcm91bmQgc2VsZWN0ZWQgSFRNTCBlbGVtZW50c1xuICAgIGRlYnVnPzogYm9vbGVhbjtcbiAgICAvLyBBIGxpc3Qgb2YgZXZlbnQgdHlwZXMgdG8gbW9uaXRvci4gQnkgZGVmYXVsdCwgdGhpcyBpcyBqdXN0IFtcImNsaWNrXCJdXG4gICAgZXZlbnRzPzogc3RyaW5nW107XG59XG5cbmNsYXNzIEV4dHJhY3RvckRhdGEge1xuICAgIGV2ZW50VHlwZTogU2VuZGVyTWV0aG9kO1xuICAgIHVybFBhdHRlcm46IHN0cmluZztcbiAgICBleHRyYWN0b3I6ICgpID0+IG9iamVjdDtcbiAgICBjb25zdHJ1Y3RvcihhY3Rpdml0eVR5cGU6IFNlbmRlck1ldGhvZCwgdXJsUGF0dGVybjogc3RyaW5nLCBleHRyYWN0b3I6ICgpID0+IG9iamVjdCl7XG4gICAgICAgIHRoaXMuZXZlbnRUeXBlID0gYWN0aXZpdHlUeXBlO1xuICAgICAgICB0aGlzLnVybFBhdHRlcm4gPSB1cmxQYXR0ZXJuO1xuICAgICAgICB0aGlzLmV4dHJhY3RvciA9IGV4dHJhY3RvcjtcbiAgICB9XG59XG5cbmNsYXNzIEV4dHJhY3Rvckxpc3Qge1xuICAgIHByaXZhdGUgZXh0cmFjdG9yczogRXh0cmFjdG9yRGF0YVtdO1xuICAgIHByaXZhdGUgYmFzZVVSTDogc3RyaW5nO1xuICAgIGNvbnN0cnVjdG9yKGV4dHJhY3RvcnM6IEV4dHJhY3RvckRhdGFbXSA9IFtdLCBiYXNlVVJMOiBzdHJpbmcpe1xuICAgICAgICB0aGlzLmV4dHJhY3RvcnMgPSBleHRyYWN0b3JzO1xuICAgICAgICB0aGlzLmJhc2VVUkwgPSBiYXNlVVJMO1xuICAgIH1cblxuICAgIHB1YmxpYyBleHRyYWN0KGN1cnJlbnRVUkw6IHN0cmluZywgZXZlbnRUeXBlOiBTZW5kZXJNZXRob2Qpe1xuICAgICAgICBjb25zb2xlLmxvZyhgQXR0ZW1wdGluZyBleHRyYWN0aW9uIGZvciB1cmw6ICR7Y3VycmVudFVSTH0gYW5kIGV2ZW50IHR5cGUgJHtldmVudFR5cGV9YCk7XG4gICAgICAgIGxldCBleHRyYWN0ZWREYXRhOiBvYmplY3QgPSB7fTtcbiAgICAgICAgdGhpcy5leHRyYWN0b3JzLmZpbHRlcihlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0NvcnJlY3RBY3Rpdml0eSA9IChlLmV2ZW50VHlwZSA9PSBldmVudFR5cGUgfHwgZS5ldmVudFR5cGUgPT0gU2VuZGVyTWV0aG9kLkFueSk7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZTogSWdub3JpbmcgVHlwZVNjcmlwdCBlcnJvciBmb3IgVVJMUGF0dGVybiBub3QgZm91bmRcbiAgICAgICAgICAgICAgICBjb25zdCBwID0gbmV3IFVSTFBhdHRlcm4oZS51cmxQYXR0ZXJuLCB0aGlzLmJhc2VVUkwpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzVVJMTWF0Y2ggPSBwLnRlc3QoY3VycmVudFVSTCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzQ29ycmVjdEFjdGl2aXR5ICYmIGlzVVJMTWF0Y2g7XG4gICAgICAgICAgICB9KS5mb3JFYWNoKGUgPT5cbiAgICAgICAgICAgICAgICBleHRyYWN0ZWREYXRhID0gey4uLiBleHRyYWN0ZWREYXRhLCAuLi4gZS5leHRyYWN0b3IoKX1cbiAgICAgICAgICAgIClcbiAgICAgICAgcmV0dXJuIGV4dHJhY3RlZERhdGE7XG4gICAgfVxufVxuXG5jbGFzcyBDb25maWdMb2FkZXIge1xuICAgIHB1YmxpYyBjb25maWc6IENvbmZpZztcbiAgICBwdWJsaWMgZXh0cmFjdG9yTGlzdDogRXh0cmFjdG9yTGlzdDtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29uZmlnLCBleHRyYWN0b3JMaXN0OiBFeHRyYWN0b3JEYXRhW10gPSBbXSl7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICB0aGlzLmV4dHJhY3Rvckxpc3QgPSBuZXcgRXh0cmFjdG9yTGlzdChleHRyYWN0b3JMaXN0LCBjb25maWcuYmFzZVVSTCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQmFja2dyb3VuZE1lc3NhZ2UgfSBmcm9tIFwiLi4vY29tbXVuaWNhdGlvbi9iYWNrZ3JvdW5kbWVzc2FnZVwiO1xyXG5pbXBvcnQge0RCRG9jdW1lbnQsIEFjdGl2aXR5RG9jdW1lbnQsIFNlc3Npb25Eb2N1bWVudH0gZnJvbSBcIi4uL2RhdGFiYXNlL2RiZG9jdW1lbnRcIjtcclxuaW1wb3J0IHsgQ29uZmlnLCBDb25maWdMb2FkZXIsIEV4dHJhY3Rvckxpc3QsIFBhdHRlcm5TZWxlY3Rvck1hcH0gZnJvbSBcIi4vY29uZmlnXCI7XHJcbmltcG9ydCB7IFBhZ2VEYXRhIH0gZnJvbSBcIi4vcGFnZWRhdGFcIjtcclxuaW1wb3J0IHsgQWN0aXZpdHlUeXBlIH0gZnJvbSBcIi4uL2NvbW11bmljYXRpb24vYWN0aXZpdHlcIjtcclxuaW1wb3J0IHtTZW5kZXJNZXRob2R9IGZyb20gXCIuLi9jb21tdW5pY2F0aW9uL3NlbmRlclwiXHJcblxyXG4vKipcclxuICogVGhpcyBjbGFzcyByZWFkcyBmcm9tIGEgcHJvdmlkZWQgQ29uZmlnIG9iamVjdCBhbmQgYXR0YWNoZXMgbGlzdGVuZXJzIHRvIHRoZSBlbGVtZW50cyBzcGVjaWZpZWQgaW4gdGhlIHNlbGVjdG9ycy5cclxuICogV2hlbiB0aGVzZSBlbGVtZW50cyBhcmUgaW50ZXJhY3RlZCB3aXRoLCBvciB3aGVuIGEgbmF2aWdhdGlvbiBvY2N1cnMsIGEgZG9jdW1lbnQgaXMgc2VudCB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHRcclxuICogdG8gYmUgYXBwZW5kZWQgdG8gdGhlIGRhdGFiYXNlLiBUaGlzIGNsYXNzIGlzIGluc3RhbnRpYXRlZCBpbiBjb250ZW50LnRzLlxyXG4gKiBcclxuICogQHBhcmFtIGludGVyYWN0aW9uRXZlbnRzIC0gQSBsaXN0IG9mIHRoZSB0eXBlIG9mIGV2ZW50cyB3ZSB3YW50IHRvIG1vbml0b3IgYXMgaW50ZXJhY3Rpb25zIChlZy4gY2xpY2ssIHNjcm9sbCwgZXRjLikuIERlZmF1bHQgaXMgY2xpY2tcclxuICogQHBhcmFtIGRlYnVnIC0gSWYgdHJ1ZSwgaGlnaGxpZ2h0IGFsbCBzZWxlY3RlZCBIVE1MIGVsZW1lbnRzIHdpdGggY29sb3VyZWQgYm94ZXNcclxuICogQHBhcmFtIHBhdGhzIC0gQW4gb2JqZWN0IG1hcHBpbmcgcGF0aCBwYXR0ZXJucyB0byB0aGVpciBjb3JyZXNwb25kaW5nIENTUyBzZWxlY3RvcnMgUGF0aCBwYXR0ZXJucyBhcmUgY29uc2lzdGVudCB3aXRoIHRoZSAgVVJMIFBhdHRlcm4gQVBJIFN5bnRheDogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1VSTF9QYXR0ZXJuX0FQSVxyXG4gKiBAcGFyYW0gYmFzZVVSTCAtIEJhc2UgdXJsIGZvciB0aGUgcGFnZSAoZWcuIHd3dy55b3V0dWJlLmNvbSkuIEFsbCBwYXRocyBhcmUgYXBwZW5kZWQgdG8gdGhpcyB3aGVuIG1hdGNoaW5nIFVSbHNcclxuICogQHBhcmFtIGN1cnJlbnRQYWdlRGF0YSAtIENvbnRhaW5zIGRhdGEgcmVsZXZhbnQgdG8gdGhlIGN1cnJlbnQgcGFnZS5cclxuICogQHBhcmFtIGludGVyYWN0aW9uQXR0cmlidXRlIC0gQXR0cmlidXRlIGFkZGVkIHRvIGFsbCBlbGVtZW50cyBiZWluZyBtb25pdG9yZWRcclxuICovXHJcbmV4cG9ydCBjbGFzcyBNb25pdG9yIHtcclxuICAgIC8vIEEgbGlzdCBvZiB0aGUgdHlwZSBvZiBldmVudHMgd2Ugd2FudCB0byBtb25pdG9yIGFzIGludGVyYWN0aW9ucyAoZWcuIGNsaWNrLCBzY3JvbGwsIGV0Yy4pLiBEZWZhdWx0IGlzIGNsaWNrXHJcbiAgICBpbnRlcmFjdGlvbkV2ZW50czogc3RyaW5nW107XHJcbiAgICAvLyBJZiB0cnVlLCBoaWdobGlnaHQgYWxsIHNlbGVjdGVkIEhUTUwgZWxlbWVudHMgd2l0aCBjb2xvdXJlZCBib3hlc1xyXG4gICAgaGlnaGxpZ2h0OiBib29sZWFuO1xyXG4gICAgLy8gQW4gb2JqZWN0IG1hcHBpbmcgcGF0aCBwYXR0ZXJucyB0byB0aGVpciBjb3JyZXNwb25kaW5nIENTUyBzZWxlY3RvcnNcclxuICAgIC8vIFBhdGggcGF0dGVybnMgYXJlIGNvbnNpc3RlbnQgd2l0aCB0aGUgVVJMIFBhdHRlcm4gQVBJIFN5bnRheDogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1VSTF9QYXR0ZXJuX0FQSVxyXG4gICAgcGF0aHM6IFBhdHRlcm5TZWxlY3Rvck1hcDtcclxuICAgIC8vIEJhc2UgdXJsIGZvciB0aGUgcGFnZSAoZWcuIHd3dy55b3V0dWJlLmNvbSkuIEFsbCBwYXRocyBhcmUgYXBwZW5kZWQgdG8gdGhpcyB3aGVuIG1hdGNoaW5nIFVSbHNcclxuICAgIGJhc2VVUkw6IHN0cmluZztcclxuICAgIC8vIENvbnRhaW5zIGRhdGEgcmVsZXZhbnQgdG8gdGhlIGN1cnJlbnQgcGFnZS5cclxuICAgIGN1cnJlbnRQYWdlRGF0YTogUGFnZURhdGE7XHJcbiAgICAvLyBBdHRyaWJ1dGUgYWRkZWQgdG8gYWxsIGVsZW1lbnRzIGJlaW5nIG1vbml0b3JlZFxyXG4gICAgaW50ZXJhY3Rpb25BdHRyaWJ1dGU6IHN0cmluZztcclxuXHJcbiAgICBleHRyYWN0b3JMaXN0OiBFeHRyYWN0b3JMaXN0O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZ0xvYWRlcjogQ29uZmlnTG9hZGVyKSB7XHJcbiAgICAgICAgY29uc3QgY29uZmlnID0gY29uZmlnTG9hZGVyLmNvbmZpZztcclxuICAgICAgICB0aGlzLmludGVyYWN0aW9uRXZlbnRzID0gY29uZmlnLmV2ZW50cyA/IGNvbmZpZy5ldmVudHMgOiBbJ2NsaWNrJ107XHJcbiAgICAgICAgdGhpcy5oaWdobGlnaHQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucGF0aHMgPSBjb25maWcucGF0aHM7XHJcbiAgICAgICAgdGhpcy5iYXNlVVJMID0gY29uZmlnLmJhc2VVUkw7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGFnZURhdGEgPSBuZXcgUGFnZURhdGEoKTtcclxuICAgICAgICB0aGlzLmludGVyYWN0aW9uQXR0cmlidXRlID0gXCJtb25pdG9yaW5nLWludGVyYWN0aW9uc1wiXHJcbiAgICAgICAgdGhpcy5leHRyYWN0b3JMaXN0ID0gY29uZmlnTG9hZGVyLmV4dHJhY3Rvckxpc3Q7XHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24ub3JpZ2luID09PSB0aGlzLmJhc2VVUkwpIHtcclxuICAgICAgICAgICAgY29uc3QgcnVuV2hlblZpc2libGUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAndmlzaWJsZScpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxpemVNb25pdG9yKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIHJ1bldoZW5WaXNpYmxlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcclxuICAgICAgICAgICAgcnVuV2hlblZpc2libGUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHJ1bldoZW5WaXNpYmxlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCBydW5XaGVuVmlzaWJsZSk7XHJcbiAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgbW9uaXRvciBpZiBiYXNlIFVSTCBtYXRjaGVzIHRoZSBjdXJyZW50IFVSTFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFzeW5jIGluaXRpYWxpemVNb25pdG9yKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW5pdGlhbGl6aW5nIG1vbml0b3JcIik7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDdXJyZW50UGFnZURhdGEoZG9jdW1lbnQubG9jYXRpb24uaHJlZik7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gQ3JlYXRlcyBhIG5ldyBlbnRyeSBpbiB0aGUgREIgZGVzY3JpYmluZyB0aGUgc3RhdGUgYXQgdGhlIHN0YXJ0IG9mIHRoZSBzZXNzaW9uXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuaW5pdGlhbGl6ZVNlc3Npb24oKTtcclxuICAgICAgICAgICAgLy8gQmluZHMgbGlzdGVuZXJzIHRvIHRoZSBIVE1MIGVsZW1lbnRzIHNwZWNpZmllZCBpbiB0aGUgY29uZmlnIGZvciBhbGwgbWF0Y2hpbmcgcGF0aCBwYXR0ZXJuc1xyXG4gICAgICAgICAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBpbml0aWFsaXplIHNlc3Npb246XCIsIGVycik7XHJcbiAgICAgICAgfVxyXG59XHJcbiAgICAvKipcclxuICAgKiBVcGRhdGVzIHRoZSBwYWdlIGRhdGEgd2hlbmV2ZXIgYSBuZXcgcGFnZSBpcyBkZXRlY3RlZFxyXG4gICAqIEBwYXJhbSB1cmwgLSB0aGUgdXJsIG9mIHRoZSBuZXcgcGFnZVxyXG4gICAqL1xyXG4gICAgcHJpdmF0ZSB1cGRhdGVDdXJyZW50UGFnZURhdGEodXJsOiBzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLnVwZGF0ZSh0aGlzLmJhc2VVUkwsIHVybCwgdGhpcy5wYXRocyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIG5ldyBlbnRyeSBpbiB0aGUgREIgZGVzY3JpYmluZyB0aGUgc3RhdGUgYXQgdGhlIHN0YXJ0IG9mIHRoZSBzZXNzaW9uXHJcbiAgICovXHJcbiAgICBwcml2YXRlIGFzeW5jIGluaXRpYWxpemVTZXNzaW9uKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRTdGF0ZSA9IG5ldyBTZXNzaW9uRG9jdW1lbnQodGhpcy5jdXJyZW50UGFnZURhdGEudXJsLCBkb2N1bWVudC50aXRsZSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJDaGVja2luZyBoaWdobGlnaHRcIik7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnNlbmRNZXNzYWdlVG9CYWNrZ3JvdW5kKFNlbmRlck1ldGhvZC5Jbml0aWFsaXplU2Vzc2lvbiwgY3VycmVudFN0YXRlKTtcclxuICAgICAgICB0aGlzLmhpZ2hsaWdodCA9IHJlc3BvbnNlLmhpZ2hsaWdodDtcclxuICAgICAgICBjb25zb2xlLmxvZyhgSGlnaGxpZ2h0IGlzIHNldCB0byAke3RoaXMuaGlnaGxpZ2h0fWApXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogQmluZHMgZXZlbnQgbGlzdGVuZXJzIGZvciBtdXRhdGlvbnMgYW5kIG5hdmlnYXRpb25cclxuICAgKi9cclxuXHJcbiAgICBwcml2YXRlIGJpbmRFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgLy8gV2hlbmV2ZXIgbmV3IGNvbnRlbnQgaXMgbG9hZGVkLCBhdHRhY2ggb2JzZXJ2ZXJzIHRvIGVhY2ggSFRNTCBlbGVtZW50IHRoYXQgbWF0Y2hlcyB0aGUgc2VsZWN0b3JzIGluIHRoZSBjb25maWdzXHJcbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zOiBNdXRhdGlvblJlY29yZFtdLCBvYnM6IE11dGF0aW9uT2JzZXJ2ZXIpID0+IHRoaXMuYWRkTGlzdGVuZXJzVG9OZXdNYXRjaGVzKCkpO1xyXG4gICAgICAgIC8vIE1ha2UgdGhlIG11dGF0aW9uIG9ic2VydmVyIG9ic2VydmUgdGhlIGVudGlyZSBkb2N1bWVudCBmb3IgY2hhbmdlc1xyXG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwge1xyXG4gICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXHJcbiAgICAgICAgICAgIHN1YnRyZWU6IHRydWVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gQWRkIGFuIGV2ZW50IGxpc3RlbmVyIHRvIGRldGVjdCBuYXZpZ2F0aW9ucyBvbiB0aGUgcGFnZVxyXG4gICAgICAgIC8vIEB0cy1pZ25vcmU6IElnbm9yaW5nIFR5cGVTY3JpcHQgZXJyb3IgZm9yIG5hdmlnYXRpb24gbm90IGZvdW5kXHJcbiAgICAgICAgbmF2aWdhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibmF2aWdhdGVcIiwgKGU6IEV2ZW50KSA9PiB0aGlzLm9uTmF2aWdhdGlvbkRldGVjdGlvbihlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogQWRkcyBsaXN0ZW5lcnMgdG8gbXV0YXRpb25zIChpZS4gbmV3bHkgcmVuZGVyZWQgZWxlbWVudHMpIGFuZCBtYXJrcyB0aGVtIHdpdGggdGhpcy5pbnRlcmFjdHRpb25BdHRyaWJ1dGUuXHJcbiAgICogSWYgZGVidWcgbW9kZSBpcyBvbiwgdGhpcyB3aWxsIGFkZCBhIGNvbG91cmZ1bCBib3JkZXIgdG8gdGhlc2UgZWxlbWVudHMuXHJcbiAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBhZGRMaXN0ZW5lcnNUb05ld01hdGNoZXMoKTogdm9pZCB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJhZGRpbmcgc2VsZWN0b3JzXCIpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBWYWx1ZSBvZiBoaWdobGlnaHQ6ICR7dGhpcy5oaWdobGlnaHR9YCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJDdXJyZW50IHBhZ2UgZGF0YTpcIik7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5jdXJyZW50UGFnZURhdGEpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLnNlbGVjdG9ycy5mb3JFYWNoKGludGVyYWN0aW9uID0+IHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgOmlzKCR7aW50ZXJhY3Rpb25bXCJzZWxlY3RvclwiXX0pOm5vdChbJHt0aGlzLmludGVyYWN0aW9uQXR0cmlidXRlfV0pYCk7XHJcbiAgICAgICAgICAgIGxldCBuYW1lID0gaW50ZXJhY3Rpb25bXCJuYW1lXCJdO1xyXG4gICAgICAgICAgICBlbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGlnaGxpZ2h0KSAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkuc3R5bGUuYm9yZGVyID0gYDJweCBzb2xpZCAke3RoaXMuU3RyaW5nVG9Db2xvci5uZXh0KG5hbWUpfWA7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSh0aGlzLmludGVyYWN0aW9uQXR0cmlidXRlLCAndHJ1ZScpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pbnRlcmFjdGlvbkV2ZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmludGVyYWN0aW9uRXZlbnRzW2ldLCAoZTogRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkludGVyYWN0aW9uRGV0ZWN0aW9uKGVsZW1lbnQsIGUsIG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0LlxyXG4gICAqIEBwYXJhbSBldmVudCAtIHRoZSBIVE1MIGV2ZW50IHRoYXQgb2NjdXJlZFxyXG4gICAqIEByZXR1cm5zIEEgZG9jdW1lbnQgZGVzY3JpYmluZyB0aGUgc3RhdGUgY2hhbmdlXHJcbiAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTdGF0ZUNoYW5nZVJlY29yZChldmVudDogRXZlbnQpOiBEQkRvY3VtZW50IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkRldGVjdGVkIHN0YXRlIGNoYW5nZSBldmVudFwiKTtcclxuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IHRoaXMuZXh0cmFjdG9yTGlzdC5leHRyYWN0KHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCwgU2VuZGVyTWV0aG9kLk5hdmlnYXRpb25EZXRlY3Rpb24pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicHJpbnRpbmcgbWV0YWRhdGFcIik7XHJcbiAgICAgICAgY29uc29sZS5sb2cobWV0YWRhdGEpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEFjdGl2aXR5RG9jdW1lbnQoQWN0aXZpdHlUeXBlLlN0YXRlQ2hhbmdlLCBldmVudCwgbWV0YWRhdGEsIHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCwgZG9jdW1lbnQudGl0bGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIFNlbmRzIGEgbWVzc2FnZSB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHQuXHJcbiAgICogQHBhcmFtIGV2ZW50IC0gdGhlIEhUTUwgZXZlbnQgdGhhdCBvY2N1cmVkXHJcbiAgICogQHBhcmFtIHVybENoYW5nZSAtIGluZGljYXRlcyB3aGV0aGVyIHRoZSBzZWxmLWxvb3AgcmVzdWx0ZWQgaW4gYSB1cmwgY2hhbmdlXHJcbiAgICogXHJcbiAgICogQHJldHVybnMgQSBkb2N1bWVudCBkZXNjcmliaW5nIHNlbGYgbG9vcFxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlU2VsZkxvb3BSZWNvcmQoZXZlbnQ6IEV2ZW50LCB1cmxDaGFuZ2U6IGJvb2xlYW4pOiBEQkRvY3VtZW50IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkRldGVjdGVkIHNlbGYgbG9vcCBjaGFuZ2UgZXZlbnRcIik7XHJcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSB0aGlzLmV4dHJhY3Rvckxpc3QuZXh0cmFjdCh0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmwsIFNlbmRlck1ldGhvZC5OYXZpZ2F0aW9uRGV0ZWN0aW9uKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInByaW50aW5nIG1ldGFkYXRhXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG1ldGFkYXRhKTtcclxuICAgICAgICByZXR1cm4gbmV3IEFjdGl2aXR5RG9jdW1lbnQoQWN0aXZpdHlUeXBlLlNlbGZMb29wLCBldmVudCwgbWV0YWRhdGEsIHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCwgZG9jdW1lbnQudGl0bGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIFNlbmRzIGEgbWVzc2FnZSB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHQuXHJcbiAgICogQHBhcmFtIGVsZW1lbnQgLSB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJlZCB0aGUgZXZlbnRcclxuICAgKiBAcGFyYW0gbmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBlbGVtZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBjYWxsYmFjayAoYXMgZGVmaW5lZCBpbiB0aGUgY29uZmlnKVxyXG4gICAqIEBwYXJhbSBldmVudCAtIHRoZSBIVE1MIGV2ZW50IHRoYXQgb2NjdXJlZFxyXG4gICAqIEByZXR1cm5zIEEgZG9jdW1lbnQgaW50ZXJhY3Rpb24gc2VsZiBsb29wXHJcbiAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVJbnRlcmFjdGlvblJlY29yZChlbGVtZW50OiBFbGVtZW50LCBuYW1lOiBzdHJpbmcsIGV2ZW50OiBFdmVudCk6IERCRG9jdW1lbnQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGV0ZWN0ZWQgaW50ZXJhY3Rpb24gZXZlbnRcIik7XHJcbiAgICAgICAgbGV0IG1ldGFkYXRhOiB7aHRtbDogc3RyaW5nLCBlbGVtZW50TmFtZTogc3RyaW5nOyBpZD86IHN0cmluZ30gPSB7XHJcbiAgICAgICAgICAgIGh0bWw6IGVsZW1lbnQuZ2V0SFRNTCgpLFxyXG4gICAgICAgICAgICBlbGVtZW50TmFtZTogbmFtZSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCBleHRyYWN0ZWREYXRhID0gdGhpcy5leHRyYWN0b3JMaXN0LmV4dHJhY3QodGhpcy5jdXJyZW50UGFnZURhdGEudXJsLCBTZW5kZXJNZXRob2QuSW50ZXJhY3Rpb25EZXRlY3Rpb24pO1xyXG5cclxuICAgICAgICBtZXRhZGF0YSA9IHsuLi4gbWV0YWRhdGEsIC4uLiBleHRyYWN0ZWREYXRhfTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJwcmludGluZyBtZXRhZGF0YVwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhtZXRhZGF0YSk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEFjdGl2aXR5RG9jdW1lbnQoQWN0aXZpdHlUeXBlLkludGVyYWN0aW9uLCBldmVudCwgbWV0YWRhdGEsIHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCwgZG9jdW1lbnQudGl0bGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIFNlbmRzIGEgbWVzc2FnZSB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHQuXHJcbiAgICogQHBhcmFtIHNlbmRlciAtIHRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvbiB0aGF0J3Mgc2VuZGluZyB0aGUgbWVzc2FnZSB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHRcclxuICAgKiBAcGFyYW0gcGF5bG9hZCAtIHRoZSBkYXRhIGJlaW5nIHNlbnQgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0XHJcbiAgICogXHJcbiAgICogQHJldHVybnMgUmVzcG9uc2UgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBtZXNzYWdlIHN1Y2NlZWRlZFxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoc2VuZGVyTWV0aG9kOiBTZW5kZXJNZXRob2QsIHBheWxvYWQ6IERCRG9jdW1lbnQpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIGxldCBtZXNzYWdlID0gbmV3IEJhY2tncm91bmRNZXNzYWdlKHNlbmRlck1ldGhvZCwgcGF5bG9hZCk7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShtZXNzYWdlKTtcclxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogQ2FsbGJhY2sgdGhhdCBjcmVhdGVzIGEgcGF5bG9hZCBkZXNjcmliaW5nIHRoZSBpbnRlcmFjdGlvbiB0aGF0IG9jY3VyZWQgYW5kIHNlbmRzIGl0IHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdFxyXG4gICAqIEBwYXJhbSBlIC0gdGhlIGV2ZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBjYWxsYmFja1xyXG4gICAqIEBwYXJhbSBuYW1lIC0gdGhlIG5hbWUgb2YgdGhlIGVsZW1lbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIGNhbGxiYWNrIChhcyBkZWZpbmVkIGluIHRoZSBjb25maWcpXHJcbiAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBvbkludGVyYWN0aW9uRGV0ZWN0aW9uKGVsZW1lbnQ6IEVsZW1lbnQsIGU6IEV2ZW50LCBuYW1lOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImludGVyYWN0aW9uIGV2ZW50IGRldGVjdGVkXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBFdmVudCBkZXRlY3RlZCB3aXRoIGV2ZW50IHR5cGU6ICR7ZS50eXBlfWApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBFdmVudCB0cmlnZ2VyZWQgYnkgJHtlbGVtZW50fWApO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnQuaW5uZXJIVE1MKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhlbGVtZW50LmdldEhUTUwoKSk7XHJcbiAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5jcmVhdGVJbnRlcmFjdGlvblJlY29yZChlbGVtZW50LCBuYW1lLCBlKTtcclxuICAgICAgICB0aGlzLnNlbmRNZXNzYWdlVG9CYWNrZ3JvdW5kKFNlbmRlck1ldGhvZC5JbnRlcmFjdGlvbkRldGVjdGlvbiwgcmVjb3JkKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGxiYWNrIHRoYXQgY3JlYXRlcyBhIHBheWxvYWQgZGVzY3JpYmluZyB0aGUgbmF2aWdhdGlvbiB0aGF0IG9jY3VyZWQgYW5kIHNlbmRzIGl0IHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdFxyXG4gICAgICogQHBhcmFtIGUgLSB0aGUgZXZlbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIGNhbGxiYWNrXHJcbiAgICAgKiBAcGFyYW0gbmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBlbGVtZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBjYWxsYmFjayAoYXMgZGVmaW5lZCBpbiB0aGUgY29uZmlnKVxyXG4gICAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBvbk5hdmlnYXRpb25EZXRlY3Rpb24obmF2RXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGxldCBiYXNlVVJMQ2hhbmdlID0gbmF2RXZlbnQuZGVzdGluYXRpb24udXJsLnNwbGl0KFwiLlwiKVsxXSAhPSB0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmwuc3BsaXQoXCIuXCIpWzFdXHJcbiAgICAgICAgbGV0IHVybENoYW5nZSA9ICEobmF2RXZlbnQuZGVzdGluYXRpb24udXJsID09PSB0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmwpO1xyXG4gICAgICAgIC8vIGxldCBzb3VyY2VTdGF0ZSA9IHRoaXMuZ2V0Q2xlYW5TdGF0ZU5hbWUoKTtcclxuICAgICAgICAvLyBsZXQgbWF0Y2ggPSB0aGlzLmN1cnJlbnRQYWdlRGF0YS5jaGVja0Zvck1hdGNoKG5hdkV2ZW50LmRlc3RpbmF0aW9uLnVybCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCA9IG5hdkV2ZW50LmRlc3RpbmF0aW9uLnVybDtcclxuICAgICAgICAvLyBsZXQgZGVzdFN0YXRlID0gdGhpcy5nZXRDbGVhblN0YXRlTmFtZSgpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhgTmF2aWdhdGlvbiBkZXRlY3RlZCB3aXRoIGV2ZW50IHR5cGU6ICR7bmF2RXZlbnQudHlwZX1gKVxyXG4gICAgICAgIGlmIChiYXNlVVJMQ2hhbmdlKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJVUkwgYmFzZSBjaGFuZ2UgZGV0ZWN0ZWQuIENsb3NpbmcgcHJvZ3JhbS5cIik7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoU2VuZGVyTWV0aG9kLkNsb3NlU2Vzc2lvbiwgbmV3IERCRG9jdW1lbnQodGhpcy5jdXJyZW50UGFnZURhdGEudXJsLCBkb2N1bWVudC50aXRsZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChuYXZFdmVudC5uYXZpZ2F0aW9uVHlwZSA9PT0gXCJwdXNoXCIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQdXNoIGV2ZW50IGRldGVjdGVkLlwiKTtcclxuICAgICAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5jcmVhdGVTdGF0ZUNoYW5nZVJlY29yZChuYXZFdmVudCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoU2VuZGVyTWV0aG9kLk5hdmlnYXRpb25EZXRlY3Rpb24sIHJlY29yZCk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ3VycmVudFBhZ2VEYXRhKHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChuYXZFdmVudC5uYXZpZ2F0aW9uVHlwZSA9PT0gXCJyZXBsYWNlXCIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXBsYWNlIGV2ZW50IGRldGVjdGVkLlwiKTtcclxuICAgICAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5jcmVhdGVTZWxmTG9vcFJlY29yZChuYXZFdmVudCwgdXJsQ2hhbmdlKTtcclxuICAgICAgICAgICAgdGhpcy5zZW5kTWVzc2FnZVRvQmFja2dyb3VuZChTZW5kZXJNZXRob2QuTmF2aWdhdGlvbkRldGVjdGlvbiwgcmVjb3JkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAqIEdlbmVyYXRlcyBhIHVuaXF1ZSBjb2xvciBmcm9tIGEgZ2l2ZW4gc3RyaW5nXHJcbiAgICogU291cmNlOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzEwMzczODMgXHJcbiAgICogQHJldHVybnMgQ29sb3IgaGV4IGNvZGVcclxuICAgKi9cclxuXHJcbiAgICBwcml2YXRlIFN0cmluZ1RvQ29sb3IgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGxldCBpbnN0YW5jZTogYW55ID0gbnVsbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbmV4dDogZnVuY3Rpb24gc3RyaW5nVG9Db2xvcihzdHI6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5zdGFuY2UgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UubmV4dFZlcnlEaWZmZXJudENvbG9ySWR4ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZS52ZXJ5RGlmZmVyZW50Q29sb3JzID0gW1wiIzAwRkYwMFwiLCBcIiMwMDAwRkZcIiwgXCIjRkYwMDAwXCIsIFwiIzAxRkZGRVwiLCBcIiNGRkE2RkVcIiwgXCIjRkZEQjY2XCIsIFwiIzAwNjQwMVwiLCBcIiMwMTAwNjdcIiwgXCIjOTUwMDNBXCIsIFwiIzAwN0RCNVwiLCBcIiNGRjAwRjZcIiwgXCIjRkZFRUU4XCIsIFwiIzc3NEQwMFwiLCBcIiM5MEZCOTJcIiwgXCIjMDA3NkZGXCIsIFwiI0Q1RkYwMFwiLCBcIiNGRjkzN0VcIiwgXCIjNkE4MjZDXCIsIFwiI0ZGMDI5RFwiLCBcIiNGRTg5MDBcIiwgXCIjN0E0NzgyXCIsIFwiIzdFMkREMlwiLCBcIiM4NUE5MDBcIiwgXCIjRkYwMDU2XCIsIFwiI0E0MjQwMFwiLCBcIiMwMEFFN0VcIiwgXCIjNjgzRDNCXCIsIFwiI0JEQzZGRlwiLCBcIiMyNjM0MDBcIiwgXCIjQkREMzkzXCIsIFwiIzAwQjkxN1wiLCBcIiM5RTAwOEVcIiwgXCIjMDAxNTQ0XCIsIFwiI0MyOEM5RlwiLCBcIiNGRjc0QTNcIiwgXCIjMDFEMEZGXCIsIFwiIzAwNDc1NFwiLCBcIiNFNTZGRkVcIiwgXCIjNzg4MjMxXCIsIFwiIzBFNENBMVwiLCBcIiM5MUQwQ0JcIiwgXCIjQkU5OTcwXCIsIFwiIzk2OEFFOFwiLCBcIiNCQjg4MDBcIiwgXCIjNDMwMDJDXCIsIFwiI0RFRkY3NFwiLCBcIiMwMEZGQzZcIiwgXCIjRkZFNTAyXCIsIFwiIzYyMEUwMFwiLCBcIiMwMDhGOUNcIiwgXCIjOThGRjUyXCIsIFwiIzc1NDRCMVwiLCBcIiNCNTAwRkZcIiwgXCIjMDBGRjc4XCIsIFwiI0ZGNkU0MVwiLCBcIiMwMDVGMzlcIiwgXCIjNkI2ODgyXCIsIFwiIzVGQUQ0RVwiLCBcIiNBNzU3NDBcIiwgXCIjQTVGRkQyXCIsIFwiI0ZGQjE2N1wiLCBcIiMwMDlCRkZcIiwgXCIjRTg1RUJFXCJdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghaW5zdGFuY2Uuc3RyaW5nVG9Db2xvckhhc2hbc3RyXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoW3N0cl0gPSBpbnN0YW5jZS52ZXJ5RGlmZmVyZW50Q29sb3JzW2luc3RhbmNlLm5leHRWZXJ5RGlmZmVybnRDb2xvcklkeCsrXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgJWMgVGhlIGNvbG91ciBmb3IgJHtzdHJ9YCwgYGNvbG9yOiAke2luc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoW3N0cl19YCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5zdGFuY2Uuc3RyaW5nVG9Db2xvckhhc2hbc3RyXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KSgpO1xyXG59XHJcbiIsImltcG9ydCB7U2VsZWN0b3JOYW1lUGFpciwgUGF0dGVybkRhdGEsIFBhdHRlcm5TZWxlY3Rvck1hcCB9IGZyb20gXCIuL2NvbmZpZ1wiO1xyXG4vKipcclxuICogQSBjbGFzcyByZXNwb25zaWJsZSBmb3IgdHJhY2tpbmcgdGhlIHN0YXRlIG9mIHRoZSBwYWdlIHRoYXQgdGhlIHVzZXIgaXMgY3VycmVudGx5IG9uLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFBhZ2VEYXRhIHtcclxuICAgIC8vIFVSTCBvZiB0aGUgcGFnZVxyXG4gICAgdXJsITogc3RyaW5nO1xyXG4gICAgLy8gQ1NTIHNlbGVjdG9ycyBiZWluZyBhcHBsaWVkIHRvIHRoZSBwYWdlXHJcbiAgICBzZWxlY3RvcnMhOiBTZWxlY3Rvck5hbWVQYWlyW107XHJcbiAgICAvLyBUaGUgVVJMIHBhdHRlcm4sIENTUyBzZWxlY3RvcnMsIGFuZCBvcHRpb25hbGx5IGEgZnVuY3Rpb24gZm9yIGdldHRpbmcgcGFnZSBJRCBcclxuICAgIC8vIGZvciB0aGUgcGF0dGVybiB0aGF0IG1vc3QgY2xvc2VseSBtYXRjaGVzIHRoaXMudXJsXHJcbiAgICAvLyBFeDogSWYgdGhlIHVybCBpcyB3d3cueW91dHViZS5jb20vc2hvcnRzL0FCQyBhbmQgdGhlIHBhdHRlcm5zIGFyZSAvKiBhbmQgL3Nob3J0cy86aWQsIHRoZW4gXHJcbiAgICAvLyBtYXRjaFBhdGhEYXRhIHdvdWxkIGNvbnRhaW4gdGhlIFBhdGhEYXRhIGZvciAvc2hvcnRzLzppZCwgc2luY2UgaXRzIGEgY2xvc2VyIG1hdGNoIHRvIHRoZSBVUkwuXHJcbiAgICBtYXRjaFBhdGhEYXRhITogUGF0dGVybkRhdGE7IFxyXG4gICAgY3VycmVudFBhdHRlcm4hOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZXMgdGhlIHN0YXRlIG9mIHRoZSBQYWdlRGF0YVxyXG4gICAgICogQHBhcmFtIGJhc2VVUkw6IFRoZSBiYXNlIHVybCBmb3IgdGhlIHBhZ2UgKGVnLiB3d3cueW91dHViZS5jb20pXHJcbiAgICAgKiBAcGFyYW0gdXJsOiBUaGUgZnVsbCB1cmwgb2YgdGhlIGN1cnJlbnQgcGFnZVxyXG4gICAgICogQHBhcmFtIHBhdGhzOiBBIGxpc3Qgb2YgYWxsIHRoZSBwYXRocyBkZWZpbmVkIGluIGEgY29uZmlnXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZShiYXNlVVJMOiBzdHJpbmcsIHVybDogc3RyaW5nLCBwYXRoczogUGF0dGVyblNlbGVjdG9yTWFwKXtcclxuICAgICAgICB0aGlzLnVybCA9IHVybDtcclxuICAgICAgICBsZXQgbWF0Y2hlcyA9IHRoaXMudXBkYXRlTWF0Y2hEYXRhKGJhc2VVUkwsIHBhdGhzKTtcclxuICAgICAgICB0aGlzLnNlbGVjdG9ycyA9IHRoaXMuZ2V0U2VsZWN0b3JzKG1hdGNoZXMsIHBhdGhzKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyBgbWF0Y2hQYXRoRGF0YWAgdG8gYmUgdGhlIFBhdGhEYXRhIGZvciB0aGUgVVJMIHBhdHRlcm4gd2l0aCB0aGUgY2xvc2V0IG1hdGNoIHRvIGBiYXNlVVJMYFxyXG4gICAgICogYW5kIHJldHVybnMgYSBsaXN0IG9mIGFsbCBtYXRjaGVzLiBBZGRpdGlvbmFsbHksIGl0IHVwZGF0ZXMgd2hldGhlciB0aGUgY3VycmVudCBwYXRoXHJcbiAgICAgKiBpbmNsdWRlcyBhbiBpZC5cclxuICAgICAqIEBwYXJhbSBiYXNlVVJMOiBUaGUgYmFzZSB1cmwgZm9yIHRoZSBwYWdlIChlZy4gd3d3LnlvdXR1YmUuY29tKVxyXG4gICAgICogQHBhcmFtIHBhdHRlcm5zOiBBIGxpc3Qgb2YgYWxsIHRoZSBwYXRocyBkZWZpbmVkIGluIGEgY29uZmlnXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm5zIEEgbGlzdCBvZiBhbGwgcGF0dGVybnMgaW4gdGhlIGNvbmZpZyB0aGF0IG1hdGNoIGBiYXNlVVJMYFxyXG4gICAgICovXHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVNYXRjaERhdGEoYmFzZVVSTDogc3RyaW5nLCBwYXR0ZXJuczogUGF0dGVyblNlbGVjdG9yTWFwKTogc3RyaW5nW117XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ1cGRhdGluZyBwYWdlIGRhdGFcIik7XHJcbiAgICAgICAgbGV0IGNsb3Nlc3RNYXRjaCA9IFwiXCI7IC8vIHRoZSBwYXR0ZXJuIHRoYXQgbW9zdCBjbG9zZWx5IG1hdGNoZXMgdGhlIGN1cnJlbnQgVVJMXHJcblxyXG4gICAgICAgIC8vIEdldCBhIGxpc3Qgb2YgYWxsIHRoZSBwYXRocyB0aGF0IG1hdGNoIHRoZSBjdXJyZW50IFVSTFxyXG4gICAgICAgIGNvbnN0IG1hdGNoZXMgPSBPYmplY3Qua2V5cyhwYXR0ZXJucykuZmlsdGVyKChwYXRoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHBhdGgpO1xyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlOiBJZ25vcmluZyBUeXBlU2NyaXB0IGVycm9yIGZvciBVUkxQYXR0ZXJuIG5vdCBmb3VuZFxyXG4gICAgICAgICAgICBjb25zdCBwID0gbmV3IFVSTFBhdHRlcm4ocGF0aCwgYmFzZVVSTCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gcC50ZXN0KHRoaXMudXJsKTtcclxuICAgICAgICAgICAgLy8gQ2xvc2VzdCBtYXRjaCBpcyB0aGUgbG9uZ2VzdCBwYXR0ZXJuIHRoYXQgbWF0Y2hlcyB0aGUgY3VycmVudCBVUkxcclxuICAgICAgICAgICAgaWYgKG1hdGNoICYmIHBhdGgubGVuZ3RoID4gY2xvc2VzdE1hdGNoLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgY2xvc2VzdE1hdGNoID0gcGF0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbWF0Y2g7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFBhdHRlcm4gPSBjbG9zZXN0TWF0Y2g7XHJcblxyXG4gICAgICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vIG1hdGNoZXMgZm91bmRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB0aGlzLnVybFVzZXNJZCA9IGNsb3Nlc3RNYXRjaC5lbmRzV2l0aChcIjppZFwiKTtcclxuICAgICAgICB0aGlzLm1hdGNoUGF0aERhdGEgPSBwYXR0ZXJuc1tjbG9zZXN0TWF0Y2hdO1xyXG4gICAgICAgIHJldHVybiBtYXRjaGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIG1hdGNoZXM6IEEgbGlzdCBvZiBhbGwgbWF0Y2hpbmcgcGF0aHMgdG8gdGhlIGN1cnJlbnQgdXJsXHJcbiAgICAgKiBAcGFyYW0gcGF0aHM6IEEgbGlzdCBvZiBhbGwgdGhlIHBhdGhzIGRlZmluZWQgaW4gYSBjb25maWdcclxuICAgICAqIFxyXG4gICAgICogQHJldHVybnMgQSBsaXN0IG9mIGFsbCBzZWxlY3RvcnMgZm9yIHRoZSBtYXRjaGluZyBwYXRoc1xyXG4gICAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBnZXRTZWxlY3RvcnMobWF0Y2hlczogc3RyaW5nW10sIHBhdGhzOiBQYXR0ZXJuU2VsZWN0b3JNYXApOiBTZWxlY3Rvck5hbWVQYWlyW10ge1xyXG4gICAgICAgIGxldCBjdXJyZW50U2VsZWN0b3JzID0gW107XHJcbiAgICAgICAgZm9yIChjb25zdCBwYXRoIG9mIG1hdGNoZXMpIHtcclxuICAgICAgICAgICAgbGV0IHBhdGhEYXRhID0gcGF0aHNbcGF0aF07XHJcbiAgICAgICAgICAgIGlmIChwYXRoRGF0YVtcInNlbGVjdG9yc1wiXSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBwYXRoRGF0YVtcInNlbGVjdG9yc1wiXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTZWxlY3RvcnMucHVzaChzZWxlY3Rvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRTZWxlY3RvcnM7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2NvbnRlbnQudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=