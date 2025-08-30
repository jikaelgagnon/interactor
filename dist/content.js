/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/common/communication/activity.ts":
/*!**********************************************!*\
  !*** ./src/common/communication/activity.ts ***!
  \**********************************************/
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

/***/ "./src/common/communication/messaging.ts":
/*!***********************************************!*\
  !*** ./src/common/communication/messaging.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageToBackground = void 0;
/**
 * A class used to send messages from the content to the background script in a consistent format.
 */
class MessageToBackground {
    /**
     * @param senderMethod - enum type of the method sending the message
     * @param payload - the data being sent to the database
     */
    constructor(senderMethod, payload) {
        this.senderMethod = senderMethod;
        this.payload = payload;
    }
}
exports.MessageToBackground = MessageToBackground;


/***/ }),

/***/ "./src/common/communication/sender.ts":
/*!********************************************!*\
  !*** ./src/common/communication/sender.ts ***!
  \********************************************/
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

/***/ "./src/common/dbdocument.ts":
/*!**********************************!*\
  !*** ./src/common/dbdocument.ts ***!
  \**********************************/
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

/***/ "./src/content.ts":
/*!************************!*\
  !*** ./src/content.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const monitor_1 = __webpack_require__(/*! ./content/monitor */ "./src/content/monitor.ts");
const youtube_config_json_1 = __importDefault(__webpack_require__(/*! ./content/configs/youtube_config.json */ "./src/content/configs/youtube_config.json"));
// import tiktokConfig from './configs/tiktok_config.json';
// import linkedinConfig from './configs/linkedin_config.json';
const config_1 = __webpack_require__(/*! ./content/config */ "./src/content/config.ts");
// import { ActivityType } from "./communication/activity";
const sender_1 = __webpack_require__(/*! ./common/communication/sender */ "./src/common/communication/sender.ts");
const getHomepageVideos = () => {
    // console.log("---- EXTRACTING HOMEPAGE LINKS ---");
    const contentDivs = Array.from(document.querySelectorAll("#content.ytd-rich-item-renderer")).filter((div) => {
        // Check if element is actually visible
        const rect = div.getBoundingClientRect();
        return (rect.width > 0 &&
            rect.height > 0 &&
            getComputedStyle(div).visibility !== "hidden");
    });
    const videos = contentDivs
        .map((contentDiv) => {
        var _a, _b, _c;
        // Get the direct anchor child
        const anchor = contentDiv.querySelector(":scope > yt-lockup-view-model a");
        const span = contentDiv.querySelector("h3 a span.yt-core-attributed-string");
        return {
            link: (_a = anchor === null || anchor === void 0 ? void 0 : anchor.href) !== null && _a !== void 0 ? _a : "",
            title: (_c = (_b = span === null || span === void 0 ? void 0 : span.textContent) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : "",
        };
    })
        .filter((video) => video.link !== "");
    const metadata = { videos: videos };
    return metadata;
};
const getRecommendedVideos = () => {
    console.log("---- EXTRACTING RECOMMENDED LINKS ----");
    const contentDivs = Array.from(document.querySelectorAll("yt-lockup-view-model")).filter((div) => {
        // Check if element is actually visible
        const rect = div.getBoundingClientRect();
        return (rect.width > 0 &&
            rect.height > 0 &&
            getComputedStyle(div).visibility !== "hidden");
    });
    const videos = contentDivs
        .map((contentDiv) => {
        var _a, _b, _c;
        // Get the anchor with the video link
        const anchor = contentDiv.querySelector('a[href^="/watch"]');
        const span = contentDiv.querySelector("h3 a span.yt-core-attributed-string");
        return {
            link: (_a = anchor === null || anchor === void 0 ? void 0 : anchor.href) !== null && _a !== void 0 ? _a : "",
            title: (_c = (_b = span === null || span === void 0 ? void 0 : span.textContent) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : "",
        };
    })
        .filter((video) => video.link !== "");
    // console.log("Printing the first 5 videos");
    // console.table(videos.slice(0,5));
    const metadata = { videos: videos };
    return metadata;
};
const extractors = [
    new config_1.ExtractorData(sender_1.SenderMethod.InteractionDetection, "/", getHomepageVideos),
    new config_1.ExtractorData(sender_1.SenderMethod.InteractionDetection, "/watch?v=*", getRecommendedVideos),
];
const ytConfigLoader = new config_1.ConfigLoader(youtube_config_json_1.default, extractors);
new monitor_1.Monitor(ytConfigLoader);
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


/***/ }),

/***/ "./src/content/config.ts":
/*!*******************************!*\
  !*** ./src/content/config.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExtractorList = exports.ExtractorData = exports.ConfigLoader = void 0;
const sender_1 = __webpack_require__(/*! ../common/communication/sender */ "./src/common/communication/sender.ts");
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
        this.extractors
            .filter((e) => {
            const isCorrectActivity = e.eventType == eventType || e.eventType == sender_1.SenderMethod.Any;
            const p = new URLPattern(e.urlPattern, this.baseURL);
            const isURLMatch = p.test(currentURL);
            return isCorrectActivity && isURLMatch;
        })
            .forEach((e) => (extractedData = Object.assign(Object.assign({}, extractedData), e.extractor())));
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

/***/ "./src/content/configs/youtube_config.json":
/*!*************************************************!*\
  !*** ./src/content/configs/youtube_config.json ***!
  \*************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"baseURL":"https://www.youtube.com","events":["click"],"paths":{"/*":[{"selector":"#logo-icon","name":"YouTube Logo"},{"selector":"ytm-shorts-lockup-view-model-v2","name":"Shorts on Miniplayer"},{"selector":"div#chip-shape-container, yt-tab-shape[tab-title]","name":"Category Button"},{"selector":"div#left-arrow-button","name":"Category back button"},{"selector":"div#right-arrow-button","name":"Category forward button"},{"selector":"a.yt-simple-endpoint.style-scope.ytd-guide-entry-renderer#endpoint, a.yt-simple-endpoint.style-scope.ytd-mini-guide-entry-renderer#endpoint","name":"Side Navigation Button"},{"selector":"yt-icon-button#guide-button","name":"Guide Button"},{"selector":"ytd-video-renderer, ytd-rich-item-renderer","name":"Video"},{"selector":"yt-lockup-view-model","name":"Content Collection"}],"/":[],"/feed/*":[{"selector":"ytd-video-renderer[is-history]","name":"History Video"},{"selector":"ytd-grid-movie-renderer","name":"Movie Thumbnail"}],"/channel/*":[{"selector":"ytd-default-promo-panel-renderer","name":"Promo Video"}],"/@:id{/*}?":[{"selector":"yt-tab-shape[tab-title=\\"Home\\"]","name":"Creator Home"},{"selector":"yt-tab-shape[tab-title=\\"Videos\\"]","name":"Creator Videos"},{"selector":"yt-tab-shape[tab-title=\\"Playlists\\"]","name":"Creator Playlists"},{"selector":"yt-tab-shape[tab-title=\\"Shorts\\"]","name":"Creator Shorts"},{"selector":"yt-tab-shape[tab-title=\\"Live\\"]","name":"Creator Live"},{"selector":"yt-tab-shape[tab-title=\\"Posts\\"]","name":"Creator Posts"},{"selector":"div.yt-subscribe-button-view-model-wiz__container","name":"Creator Subscribe Button"},{"selector":"ytd-video-renderer.style-scope.ytd-channel-featured-content-renderer","name":"Creator Featured Video"},{"selector":"ytd-grid-video-renderer.style-scope.yt-horizontal-list-renderer","name":"Creator Video"}],"/playlist?list=*":[{"selector":"div#content.style-scope.ytd-playlist-video-renderer","name":"Video Inside Playlist"}],"/shorts/:id":[{"selector":"#like-button[is-shorts]","name":"Shorts Like Button"},{"selector":"#dislike-button[is-shorts]","name":"Shorts Dislike Button"},{"selector":"div#comments-button","name":"Comments Button"},{"selector":"ytd-player#player","name":"Shorts Video Player"}],"/watch?v=*":[{"selector":"ytd-compact-video-renderer.style-scope.ytd-item-section-renderer","name":"Watch Page Recommended Video"},{"selector":"ytd-toggle-button-renderer#dislike-button","name":"Comment Dislike Button"},{"selector":"ytd-toggle-button-renderer#like-button","name":"Comment Like Button"},{"selector":"ytd-video-owner-renderer.style-scope.ytd-watch-metadata","name":"Channel Link"},{"selector":"like-button-view-model.ytLikeButtonViewModelHost","name":"Video Like Button"},{"selector":"dislike-button-view-model.ytDislikeButtonViewModelHost","name":"Video Dislike Button"},{"selector":"div#subscribe-button","name":"Subscribe Button"},{"selector":"div#player","name":"Video Player"},{"selector":"button[title=\'Share\']","name":"Share Button"}],"/results?search_query=*":[{"selector":"ytd-video-renderer.style-scope.ytd-vertical-list-renderer","name":"Top Search Page Video"},{"selector":"ytd-video-renderer.style-scope.ytd-item-section-renderer","name":"Search Page Video"},{"selector":"yt-lockup-view-model.ytd-item-section-renderer","name":"Playlist"}]}}');

/***/ }),

/***/ "./src/content/monitor.ts":
/*!********************************!*\
  !*** ./src/content/monitor.ts ***!
  \********************************/
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
const messaging_1 = __webpack_require__(/*! ../common/communication/messaging */ "./src/common/communication/messaging.ts");
const dbdocument_1 = __webpack_require__(/*! ../common/dbdocument */ "./src/common/dbdocument.ts");
const pagedata_1 = __webpack_require__(/*! ./pagedata */ "./src/content/pagedata.ts");
const activity_1 = __webpack_require__(/*! ../common/communication/activity */ "./src/common/communication/activity.ts");
const sender_1 = __webpack_require__(/*! ../common/communication/sender */ "./src/common/communication/sender.ts");
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
        var _a;
        /**
         * Generates a unique color from a given string
         * Source: https://stackoverflow.com/a/31037383
         * @returns Color hex code
         */
        this.StringToColor = (function () {
            let instance = null;
            return {
                next: function stringToColor(str) {
                    instance !== null && instance !== void 0 ? instance : (instance = {
                        stringToColorHash: {},
                        nextVeryDifferntColorIdx: 0,
                        veryDifferentColors: [
                            "#00FF00",
                            "#0000FF",
                            "#FF0000",
                            "#01FFFE",
                            "#FFA6FE",
                            "#FFDB66",
                            "#006401",
                            "#010067",
                            "#95003A",
                            "#007DB5",
                            "#FF00F6",
                            "#FFEEE8",
                            "#774D00",
                            "#90FB92",
                            "#0076FF",
                            "#D5FF00",
                            "#FF937E",
                            "#6A826C",
                            "#FF029D",
                            "#FE8900",
                            "#7A4782",
                            "#7E2DD2",
                            "#85A900",
                            "#FF0056",
                            "#A42400",
                            "#00AE7E",
                            "#683D3B",
                            "#BDC6FF",
                            "#263400",
                            "#BDD393",
                            "#00B917",
                            "#9E008E",
                            "#001544",
                            "#C28C9F",
                            "#FF74A3",
                            "#01D0FF",
                            "#004754",
                            "#E56FFE",
                            "#788231",
                            "#0E4CA1",
                            "#91D0CB",
                            "#BE9970",
                            "#968AE8",
                            "#BB8800",
                            "#43002C",
                            "#DEFF74",
                            "#00FFC6",
                            "#FFE502",
                            "#620E00",
                            "#008F9C",
                            "#98FF52",
                            "#7544B1",
                            "#B500FF",
                            "#00FF78",
                            "#FF6E41",
                            "#005F39",
                            "#6B6882",
                            "#5FAD4E",
                            "#A75740",
                            "#A5FFD2",
                            "#FFB167",
                            "#009BFF",
                            "#E85EBE",
                        ],
                    });
                    if (!instance.stringToColorHash[str]) {
                        instance.stringToColorHash[str] =
                            instance.veryDifferentColors[instance.nextVeryDifferntColorIdx++];
                        console.log(`%c The colour for ${str}`, `color: ${instance.stringToColorHash[str]}`);
                    }
                    return instance.stringToColorHash[str];
                },
            };
        })();
        const config = configLoader.config;
        this.htmlEventsToMonitor = (_a = config.events) !== null && _a !== void 0 ? _a : ["click"];
        this.enableHighlighting = true;
        this.currentPageData = new pagedata_1.PageData(config);
        this.htmlMonitoringAttribute = "monitoring-interactions";
        this.extractorList = configLoader.extractorList;
        // Only initialize monitor if the URL matches and
        // the content of the page is visible
        if (window.location.origin === config.baseURL) {
            this.intitializeWhenVisible();
        }
    }
    intitializeWhenVisible() {
        const runWhenVisible = () => {
            if (document.visibilityState === "visible") {
                this.initializeMonitor()
                    .then(() => {
                    document.removeEventListener("visibilitychange", runWhenVisible);
                })
                    .catch((error) => {
                    console.error("Error initializing monitor:", error);
                    // Still remove listener even if there's an error
                    document.removeEventListener("visibilitychange", runWhenVisible);
                });
            }
        };
        if (document.readyState === "complete") {
            runWhenVisible(); // This will now be synchronous
        }
        else {
            window.addEventListener("load", () => {
                runWhenVisible();
            });
        }
        document.addEventListener("visibilitychange", runWhenVisible);
    }
    /**
     * Initializes the monitor
     */
    initializeMonitor() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("initializing monitor");
            const currentURL = document.location.href;
            this.currentPageData.update(currentURL);
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
     * Creates a new entry in the DB describing the state at the start of the session
     */
    initializeSession() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentState = new dbdocument_1.SessionDocument(this.currentPageData.currentURL, document.title);
            console.log("Checking highlight");
            const response = yield this.sendMessageToBackground(sender_1.SenderMethod.InitializeSession, currentState);
            if (response &&
                (response === null || response === void 0 ? void 0 : response.status) === "Session initialized" &&
                response.highlight) {
                this.enableHighlighting = response.highlight;
            }
            console.log(`Highlight is set to ${this.enableHighlighting}`);
        });
    }
    /**
     * Binds event listeners for mutations and navigation
     */
    bindEvents() {
        // Whenever new content is loaded, attach observers to each HTML element that matches the selectors in the configs
        const observer = new MutationObserver(() => this.addListenersToNewMatches());
        // Make the mutation observer observe the entire document for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
        // Add an event listener to detect navigations on the page
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
        this.currentPageData.selectorNamePairs.forEach((selectorNamePair) => {
            const elements = document.querySelectorAll(`:is(${selectorNamePair.selector}):not([${this.htmlMonitoringAttribute}])`);
            const name = selectorNamePair.name;
            for (const element of elements) {
                if (this.enableHighlighting) {
                    element.style.border = `2px solid ${this.StringToColor.next(name)}`;
                }
                element.setAttribute(this.htmlMonitoringAttribute, "true");
                for (const ie of this.htmlEventsToMonitor) {
                    element.addEventListener(ie, (e) => {
                        this.onInteractionDetection(element, e, name);
                    }, true);
                }
            }
        });
    }
    /**
     * Sends a message to the background script.
     * @param activityType -  the type of activity (self loop or state change)
     * @param event - the HTML event that occured
     *
     * @returns A document describing self loop
     */
    createNavigationRecord(activityType, event) {
        console.log("Detected self loop change event");
        const metadata = this.extractorList.extract(this.currentPageData.currentURL, sender_1.SenderMethod.NavigationDetection);
        console.log("printing metadata");
        console.log(metadata);
        return new dbdocument_1.ActivityDocument(activityType, event, metadata, this.currentPageData.currentURL, document.title);
    }
    /**
     * Sends a message to the background script.
     * @param element - the element that triggered the event
     * @param name - the name of the element that triggered the callback (as defined in the config)
     * @param event - the HTML event that occured
     * @returns A document interaction self loop
     */
    createInteractionRecord(name, event) {
        console.log("Detected interaction event");
        const pageSpecificData = {
            elementName: name,
        };
        const extractedData = this.extractorList.extract(this.currentPageData.currentURL, sender_1.SenderMethod.InteractionDetection);
        const metadata = Object.assign(Object.assign({}, pageSpecificData), extractedData);
        console.log("printing metadata");
        console.log(metadata);
        return new dbdocument_1.ActivityDocument(activity_1.ActivityType.Interaction, event, metadata, this.currentPageData.currentURL, document.title);
    }
    /**
     * Sends a message to the background script.
     * @param senderMethod - the name of the function that's sending the message to the background script
     * @param payload - the data being sent to the background script
     *
     * @returns Response indicating whether the message succeeded
     */
    sendMessageToBackground(senderMethod, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Check if runtime is available (extension context still valid)
                if (!((_a = chrome.runtime) === null || _a === void 0 ? void 0 : _a.id)) {
                    throw new Error("Extension context invalidated");
                }
                const message = new messaging_1.MessageToBackground(senderMethod, payload);
                const response = yield chrome.runtime.sendMessage(message);
                // Chrome returns undefined if no listeners, check if that's expected
                if (response === undefined) {
                    console.error("No response from background script");
                }
                return response;
            }
            catch (error) {
                console.error("Background message failed:", error);
                // Decide whether to throw or handle gracefully based on your needs
                return null; // or throw error;
            }
        });
    }
    /**
     * Callback that creates a payload describing the interaction that occured and sends it to the background script
     * @param element - the event that triggered the callback
     * @param name - the name of the element that triggered the callback (as defined in the config)
     */
    onInteractionDetection(element, event, name) {
        console.log("interaction event detected");
        console.log(`Event detected with event type: ${event.type}`);
        console.log(`Event triggered by`, element);
        // console.log(element.innerHTML);
        // console.log(element.getHTML());
        const record = this.createInteractionRecord(name, event);
        this.sendMessageToBackground(sender_1.SenderMethod.InteractionDetection, record).catch((error) => {
            console.error("Failed to send interaction data:", error);
        });
    }
    isNewBaseURL(url) {
        return url && this.currentPageData.currentURL
            ? url.split(".")[1] !== this.currentPageData.currentURL.split(".")[1]
            : false;
    }
    /**
     * Callback that creates a payload describing the navigation that occured and sends it to the background script
     * @param navEvent - the event that triggered the callback
     */
    onNavigationDetection(navEvent) {
        var _a;
        const destUrl = navEvent.destination.url;
        const baseURLChange = this.isNewBaseURL(destUrl);
        let record = undefined;
        let sender = undefined;
        this.currentPageData.currentURL = (_a = navEvent.destination.url) !== null && _a !== void 0 ? _a : "NO URL FOUND";
        console.log(`Navigation detected with event type: ${navEvent.type}`);
        if (baseURLChange) {
            console.log("URL base change detected. Closing program.");
            record = new dbdocument_1.DBDocument(this.currentPageData.currentURL, document.title);
            sender = sender_1.SenderMethod.CloseSession;
        }
        else if (navEvent.navigationType === "push") {
            console.log("Push event detected.");
            record = this.createNavigationRecord(activity_1.ActivityType.StateChange, navEvent);
            sender = sender_1.SenderMethod.NavigationDetection;
            this.currentPageData.update(document.location.href);
        }
        else if (navEvent.navigationType === "replace") {
            console.log("Replace event detected.");
            record = this.createNavigationRecord(activity_1.ActivityType.SelfLoop, navEvent);
            sender = sender_1.SenderMethod.NavigationDetection;
        }
        if (typeof record !== "undefined" && typeof sender !== "undefined") {
            this.sendMessageToBackground(sender, record).catch((error) => {
                console.error("Failed to send interaction data:", error);
            });
        }
    }
}
exports.Monitor = Monitor;


/***/ }),

/***/ "./src/content/pagedata.ts":
/*!*********************************!*\
  !*** ./src/content/pagedata.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PageData = void 0;
/**
 * A class responsible for tracking the state of the page that the user is currently on.
 */
class PageData {
    constructor(config) {
        this.urlPatternToSelectorData = config.paths;
        this.baseURL = config.baseURL;
    }
    /**
     * Updates the URL and the list of CSS selectors for the URL
     * @param newURL: The full url of the current page
     */
    update(newURL) {
        this.currentURL = newURL;
        const matchingURLPatterns = this.getMatchingPatterns();
        this.selectorNamePairs = this.getSelectorNamePairs(matchingURLPatterns);
    }
    /**
     * Sets `matchPathData` to be the PathData for the URL pattern with the closet match to `this.baseURL`
     * and returns a list of all matches. Additionally, it updates whether the current path
     * includes an id.
     *
     * @returns A list of all patterns in the config that match `baseURL`
     */
    getMatchingPatterns() {
        console.log("updating page data");
        // Get a list of all the paths that match the current URL
        const matchingURLPatterns = Object.keys(this.urlPatternToSelectorData).filter((path) => {
            // console.log(path);
            const pattern = new URLPattern(path, this.baseURL);
            const match = pattern.test(this.currentURL);
            return match;
        });
        if (matchingURLPatterns.length === 0) {
            console.log("no matches found");
        }
        return matchingURLPatterns;
    }
    /**
     * @param matchingURLPatterns: A list of all matching paths to the current url
     *
     * @returns A list of all selectors for the matching paths
     */
    getSelectorNamePairs(matchingURLPatterns) {
        let currentSelectorNamePairs = [];
        for (const urlPattern of matchingURLPatterns) {
            const selectorNamePairs = this.urlPatternToSelectorData[urlPattern];
            currentSelectorNamePairs =
                currentSelectorNamePairs.concat(selectorNamePairs);
        }
        return currentSelectorNamePairs;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNELE9BQU8sd0JBQXdCO0lBQ2pDLENBQUM7Q0FDRjtBQW5FRCw0QkFtRUM7Ozs7Ozs7VUN2RUQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvY29tbW9uL2NvbW11bmljYXRpb24vYWN0aXZpdHkudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb21tb24vY29tbXVuaWNhdGlvbi9tZXNzYWdpbmcudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb21tb24vY29tbXVuaWNhdGlvbi9zZW5kZXIudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb21tb24vZGJkb2N1bWVudC50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbnRlbnQudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb250ZW50L2NvbmZpZy50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbnRlbnQvbW9uaXRvci50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbnRlbnQvcGFnZWRhdGEudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBEZWZpbmVzIGEgbGlzdCBvZiB0aGUgcG9zc2libGUgYWN0aXZpdHkgdHlwZXMgdGhhdCBjYW4gYmUgcmVjb3JkZWQgYnkgdGhlIE1vbml0b3IgY2xhc3NcbiAqL1xuZW51bSBBY3Rpdml0eVR5cGUge1xuICBTZWxmTG9vcCA9IFwiU2VsZi1Mb29wXCIsXG4gIFN0YXRlQ2hhbmdlID0gXCJTdGF0ZSBDaGFuZ2VcIixcbiAgSW50ZXJhY3Rpb24gPSBcIkludGVyYWN0aW9uXCIsXG4gIEJvdGggPSBcIkJvdGhcIixcbn1cblxuZXhwb3J0IHsgQWN0aXZpdHlUeXBlIH1cbiIsImltcG9ydCB7IERCRG9jdW1lbnQgfSBmcm9tIFwiLi4vZGJkb2N1bWVudFwiXG5pbXBvcnQgeyBTZW5kZXJNZXRob2QgfSBmcm9tIFwiLi9zZW5kZXJcIlxuZXhwb3J0IHsgTWVzc2FnZVRvQmFja2dyb3VuZCwgTWVzc2FnZVJlc3BvbnNlIH1cbi8qKlxuICogQSBjbGFzcyB1c2VkIHRvIHNlbmQgbWVzc2FnZXMgZnJvbSB0aGUgY29udGVudCB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHQgaW4gYSBjb25zaXN0ZW50IGZvcm1hdC5cbiAqL1xuY2xhc3MgTWVzc2FnZVRvQmFja2dyb3VuZCB7XG4gIHNlbmRlck1ldGhvZDogU2VuZGVyTWV0aG9kXG4gIHBheWxvYWQ6IERCRG9jdW1lbnRcbiAgLyoqXG4gICAqIEBwYXJhbSBzZW5kZXJNZXRob2QgLSBlbnVtIHR5cGUgb2YgdGhlIG1ldGhvZCBzZW5kaW5nIHRoZSBtZXNzYWdlXG4gICAqIEBwYXJhbSBwYXlsb2FkIC0gdGhlIGRhdGEgYmVpbmcgc2VudCB0byB0aGUgZGF0YWJhc2VcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNlbmRlck1ldGhvZDogU2VuZGVyTWV0aG9kLCBwYXlsb2FkOiBEQkRvY3VtZW50KSB7XG4gICAgdGhpcy5zZW5kZXJNZXRob2QgPSBzZW5kZXJNZXRob2RcbiAgICB0aGlzLnBheWxvYWQgPSBwYXlsb2FkXG4gIH1cbn1cblxuaW50ZXJmYWNlIE1lc3NhZ2VSZXNwb25zZSB7XG4gIHN0YXR1czogc3RyaW5nXG4gIGhpZ2hsaWdodD86IGJvb2xlYW5cbn1cbiIsImVudW0gU2VuZGVyTWV0aG9kIHtcbiAgSW5pdGlhbGl6ZVNlc3Npb24gPSBcIkluaXRpYWxpemUgU2Vzc2lvblwiLFxuICBJbnRlcmFjdGlvbkRldGVjdGlvbiA9IFwiSW50ZXJhY3Rpb24gRGV0ZWN0aW9uXCIsXG4gIE5hdmlnYXRpb25EZXRlY3Rpb24gPSBcIk5hdmlnYXRpb24gRGV0ZWN0aW9uXCIsXG4gIENsb3NlU2Vzc2lvbiA9IFwiQ2xvc2UgU2Vzc2lvblwiLFxuICBBbnkgPSBcIkFueVwiLFxufVxuZXhwb3J0IHsgU2VuZGVyTWV0aG9kIH1cbiIsImltcG9ydCB7IEFjdGl2aXR5VHlwZSB9IGZyb20gXCIuL2NvbW11bmljYXRpb24vYWN0aXZpdHlcIlxuLyoqXG4gKiBBIGNsYXNzIGRlZmluaW5nIGRvY3VtZW50cyB0aGF0IGFyZSBzZW50IHRvIHRoZSBkYXRhYmFzZSBmcm9tIHRoZSBjb250ZW50IHNjcmlwdFxuICovXG5jbGFzcyBEQkRvY3VtZW50IHtcbiAgLy8gVVJMIGF0IHdoaWNodCB0aGUgZXZlbnQgd2FzIGNyZWF0ZWRcbiAgc291cmNlVVJMOiBzdHJpbmdcbiAgc291cmNlRG9jdW1lbnRUaXRsZTogc3RyaW5nXG5cbiAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcpIHtcbiAgICB0aGlzLnNvdXJjZVVSTCA9IHVybFxuICAgIHRoaXMuc291cmNlRG9jdW1lbnRUaXRsZSA9IHRpdGxlXG4gIH1cbn1cblxuaW50ZXJmYWNlIEV4dHJhY3RlZE1ldGFkYXRhT2JqZWN0IHtcbiAgW2tleTogc3RyaW5nXTogRXh0cmFjdGVkTWV0YWRhdGFcbn1cblxudHlwZSBFeHRyYWN0ZWRNZXRhZGF0YSA9XG4gIHwgc3RyaW5nXG4gIHwgRXh0cmFjdGVkTWV0YWRhdGFbXVxuICB8IEV4dHJhY3RlZE1ldGFkYXRhT2JqZWN0XG4gIHwgUmVjb3JkPHN0cmluZywgc3RyaW5nPiAvLyBleHBsaWNpdGx5IGFsbG93IG9iamVjdHMgd2l0aCBzdHJpbmcgdmFsdWVzXG5cbi8qKlxuICogQSBjaGlsZCBvZiBEQkRvY3VtZW50IHRoYXQgcmVwcmVzZW50cyBhY3Rpdml0aWVzXG4gKi9cblxuY2xhc3MgQWN0aXZpdHlEb2N1bWVudCBleHRlbmRzIERCRG9jdW1lbnQge1xuICAvLyBUaGUgdHlwZSBvZiBhY3Rpdml0eSBiZWluZyBsb2dnZWQuIEVpdGhlciBcInN0YXRlX2NoYWdlXCIsIFwic2VsZl9sb29wXCIsIG9yIFwiaW50ZXJhY3Rpb25cIlxuICBhY3Rpdml0eVR5cGU6IEFjdGl2aXR5VHlwZSB8IHN0cmluZ1xuICAvLyBUaW1lc3RhbXAgZm9yIHdoZW4gdGhlIGRvY3VtZW50IHdhcyBjcmVhdGVkXG4gIGNyZWF0ZWRBdDogRGF0ZSB8IHN0cmluZ1xuICAvLyBFdmVudCB0eXBlIChlZy4gY2xpY2ssIHNjcm9sbCwgZXRjLi4uKVxuICBldmVudFR5cGU6IHN0cmluZ1xuICAvLyBNZXRhZGF0YSBhYm91dCB0aGUgZXZlbnRcbiAgbWV0YWRhdGE/OiBFeHRyYWN0ZWRNZXRhZGF0YVxuICBjb25zdHJ1Y3RvcihcbiAgICB0eXBlOiBBY3Rpdml0eVR5cGUsXG4gICAgZXZlbnQ6IEV2ZW50LFxuICAgIG1ldGFkYXRhOiBFeHRyYWN0ZWRNZXRhZGF0YSxcbiAgICB1cmw6IHN0cmluZyxcbiAgICB0aXRsZTogc3RyaW5nLFxuICApIHtcbiAgICBzdXBlcih1cmwsIHRpdGxlKVxuICAgIHRoaXMuYWN0aXZpdHlUeXBlID0gdHlwZVxuICAgIHRoaXMuY3JlYXRlZEF0ID0gbmV3IERhdGUoKVxuICAgIHRoaXMuZXZlbnRUeXBlID0gZXZlbnQudHlwZVxuICAgIHRoaXMubWV0YWRhdGEgPSBtZXRhZGF0YVxuICB9XG59XG5cbi8qKlxuICogQSBjaGlsZCBvZiBEQkRvY3VtZW50IHRoYXQgcmVwcmVzZW50cyB0aGUgc3RhcnQgb2YgYSBzZXNzaW9uXG4gKi9cblxuY2xhc3MgU2Vzc2lvbkRvY3VtZW50IGV4dGVuZHMgREJEb2N1bWVudCB7XG4gIHN0YXJ0VGltZTogRGF0ZVxuICBlbmRUaW1lPzogRGF0ZVxuICBlbWFpbCA9IFwiRW1haWwgbm90IHNldFwiXG4gIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCB0aXRsZTogc3RyaW5nKSB7XG4gICAgc3VwZXIodXJsLCB0aXRsZSlcbiAgICB0aGlzLnN0YXJ0VGltZSA9IG5ldyBEYXRlKClcbiAgfVxuICBzZXRFbWFpbChlbWFpbDogc3RyaW5nKSB7XG4gICAgdGhpcy5lbWFpbCA9IGVtYWlsXG4gIH1cbn1cblxuZXhwb3J0IHsgREJEb2N1bWVudCwgQWN0aXZpdHlEb2N1bWVudCwgU2Vzc2lvbkRvY3VtZW50LCBFeHRyYWN0ZWRNZXRhZGF0YSB9XG4iLCJpbXBvcnQgeyBNb25pdG9yIH0gZnJvbSBcIi4vY29udGVudC9tb25pdG9yXCJcbmltcG9ydCB5dENvbmZpZyBmcm9tIFwiLi9jb250ZW50L2NvbmZpZ3MveW91dHViZV9jb25maWcuanNvblwiXG4vLyBpbXBvcnQgdGlrdG9rQ29uZmlnIGZyb20gJy4vY29uZmlncy90aWt0b2tfY29uZmlnLmpzb24nO1xuLy8gaW1wb3J0IGxpbmtlZGluQ29uZmlnIGZyb20gJy4vY29uZmlncy9saW5rZWRpbl9jb25maWcuanNvbic7XG5pbXBvcnQgeyBDb25maWdMb2FkZXIsIEV4dHJhY3RvckRhdGEgfSBmcm9tIFwiLi9jb250ZW50L2NvbmZpZ1wiXG4vLyBpbXBvcnQgeyBBY3Rpdml0eVR5cGUgfSBmcm9tIFwiLi9jb21tdW5pY2F0aW9uL2FjdGl2aXR5XCI7XG5pbXBvcnQgeyBTZW5kZXJNZXRob2QgfSBmcm9tIFwiLi9jb21tb24vY29tbXVuaWNhdGlvbi9zZW5kZXJcIlxuaW1wb3J0IHsgRXh0cmFjdGVkTWV0YWRhdGEgfSBmcm9tIFwiLi9jb21tb24vZGJkb2N1bWVudFwiXG5cbmNvbnN0IGdldEhvbWVwYWdlVmlkZW9zID0gKCk6IEV4dHJhY3RlZE1ldGFkYXRhID0+IHtcbiAgLy8gY29uc29sZS5sb2coXCItLS0tIEVYVFJBQ1RJTkcgSE9NRVBBR0UgTElOS1MgLS0tXCIpO1xuICBjb25zdCBjb250ZW50RGl2cyA9IEFycmF5LmZyb20oXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNjb250ZW50Lnl0ZC1yaWNoLWl0ZW0tcmVuZGVyZXJcIiksXG4gICkuZmlsdGVyKChkaXYpID0+IHtcbiAgICAvLyBDaGVjayBpZiBlbGVtZW50IGlzIGFjdHVhbGx5IHZpc2libGVcbiAgICBjb25zdCByZWN0ID0gZGl2LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgcmV0dXJuIChcbiAgICAgIHJlY3Qud2lkdGggPiAwICYmXG4gICAgICByZWN0LmhlaWdodCA+IDAgJiZcbiAgICAgIGdldENvbXB1dGVkU3R5bGUoZGl2KS52aXNpYmlsaXR5ICE9PSBcImhpZGRlblwiXG4gICAgKVxuICB9KVxuXG4gIGNvbnN0IHZpZGVvcyA9IGNvbnRlbnREaXZzXG4gICAgLm1hcCgoY29udGVudERpdikgPT4ge1xuICAgICAgLy8gR2V0IHRoZSBkaXJlY3QgYW5jaG9yIGNoaWxkXG4gICAgICBjb25zdCBhbmNob3IgPSBjb250ZW50RGl2LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIFwiOnNjb3BlID4geXQtbG9ja3VwLXZpZXctbW9kZWwgYVwiLFxuICAgICAgKSBhcyBIVE1MQW5jaG9yRWxlbWVudFxuICAgICAgY29uc3Qgc3BhbiA9IGNvbnRlbnREaXYucXVlcnlTZWxlY3RvcihcbiAgICAgICAgXCJoMyBhIHNwYW4ueXQtY29yZS1hdHRyaWJ1dGVkLXN0cmluZ1wiLFxuICAgICAgKVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBsaW5rOiBhbmNob3I/LmhyZWYgPz8gXCJcIixcbiAgICAgICAgdGl0bGU6IHNwYW4/LnRleHRDb250ZW50Py50cmltKCkgPz8gXCJcIixcbiAgICAgIH1cbiAgICB9KVxuICAgIC5maWx0ZXIoKHZpZGVvKSA9PiB2aWRlby5saW5rICE9PSBcIlwiKVxuICBjb25zdCBtZXRhZGF0YTogRXh0cmFjdGVkTWV0YWRhdGEgPSB7IHZpZGVvczogdmlkZW9zIH1cbiAgcmV0dXJuIG1ldGFkYXRhXG59XG5cbmNvbnN0IGdldFJlY29tbWVuZGVkVmlkZW9zID0gKCk6IEV4dHJhY3RlZE1ldGFkYXRhID0+IHtcbiAgY29uc29sZS5sb2coXCItLS0tIEVYVFJBQ1RJTkcgUkVDT01NRU5ERUQgTElOS1MgLS0tLVwiKVxuICBjb25zdCBjb250ZW50RGl2cyA9IEFycmF5LmZyb20oXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInl0LWxvY2t1cC12aWV3LW1vZGVsXCIpLFxuICApLmZpbHRlcigoZGl2KSA9PiB7XG4gICAgLy8gQ2hlY2sgaWYgZWxlbWVudCBpcyBhY3R1YWxseSB2aXNpYmxlXG4gICAgY29uc3QgcmVjdCA9IGRpdi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIHJldHVybiAoXG4gICAgICByZWN0LndpZHRoID4gMCAmJlxuICAgICAgcmVjdC5oZWlnaHQgPiAwICYmXG4gICAgICBnZXRDb21wdXRlZFN0eWxlKGRpdikudmlzaWJpbGl0eSAhPT0gXCJoaWRkZW5cIlxuICAgIClcbiAgfSlcblxuICBjb25zdCB2aWRlb3M6IEV4dHJhY3RlZE1ldGFkYXRhID0gY29udGVudERpdnNcbiAgICAubWFwKChjb250ZW50RGl2KSA9PiB7XG4gICAgICAvLyBHZXQgdGhlIGFuY2hvciB3aXRoIHRoZSB2aWRlbyBsaW5rXG4gICAgICBjb25zdCBhbmNob3IgPSBjb250ZW50RGl2LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICdhW2hyZWZePVwiL3dhdGNoXCJdJyxcbiAgICAgICkhIGFzIEhUTUxBbmNob3JFbGVtZW50XG4gICAgICBjb25zdCBzcGFuID0gY29udGVudERpdi5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBcImgzIGEgc3Bhbi55dC1jb3JlLWF0dHJpYnV0ZWQtc3RyaW5nXCIsXG4gICAgICApIVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBsaW5rOiBhbmNob3I/LmhyZWYgPz8gXCJcIixcbiAgICAgICAgdGl0bGU6IHNwYW4/LnRleHRDb250ZW50Py50cmltKCkgPz8gXCJcIixcbiAgICAgIH1cbiAgICB9KVxuICAgIC5maWx0ZXIoKHZpZGVvKSA9PiB2aWRlby5saW5rICE9PSBcIlwiKVxuXG4gIC8vIGNvbnNvbGUubG9nKFwiUHJpbnRpbmcgdGhlIGZpcnN0IDUgdmlkZW9zXCIpO1xuICAvLyBjb25zb2xlLnRhYmxlKHZpZGVvcy5zbGljZSgwLDUpKTtcbiAgY29uc3QgbWV0YWRhdGE6IEV4dHJhY3RlZE1ldGFkYXRhID0geyB2aWRlb3M6IHZpZGVvcyB9XG4gIHJldHVybiBtZXRhZGF0YVxufVxuXG5jb25zdCBleHRyYWN0b3JzID0gW1xuICBuZXcgRXh0cmFjdG9yRGF0YShTZW5kZXJNZXRob2QuSW50ZXJhY3Rpb25EZXRlY3Rpb24sIFwiL1wiLCBnZXRIb21lcGFnZVZpZGVvcyksXG4gIG5ldyBFeHRyYWN0b3JEYXRhKFxuICAgIFNlbmRlck1ldGhvZC5JbnRlcmFjdGlvbkRldGVjdGlvbixcbiAgICBcIi93YXRjaD92PSpcIixcbiAgICBnZXRSZWNvbW1lbmRlZFZpZGVvcyxcbiAgKSxcbl1cblxuY29uc3QgeXRDb25maWdMb2FkZXIgPSBuZXcgQ29uZmlnTG9hZGVyKHl0Q29uZmlnLCBleHRyYWN0b3JzKVxuXG5uZXcgTW9uaXRvcih5dENvbmZpZ0xvYWRlcilcblxuLy8gY29uc3QgdGlrdG9rSURTZWxlY3RvciA9ICgpOiBvYmplY3QgPT4ge1xuLy8gICAgIGxldCB2aWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LnhncGxheWVyLWNvbnRhaW5lci50aWt0b2std2ViLXBsYXllclwiKTtcbi8vICAgICBpZiAoIXZpZCl7XG4vLyAgICAgICAgIGNvbnNvbGUubG9nKFwibm8gdXJsIGZvdW5kIVwiKTtcbi8vICAgICAgICAgcmV0dXJuIHt9O1xuLy8gICAgIH1cbi8vICAgICBsZXQgaWQgPSB2aWQuaWQuc3BsaXQoXCItXCIpLmF0KC0xKTtcbi8vICAgICBsZXQgdXJsID0gYGh0dHBzOi8vdGlrdG9rLmNvbS9zaGFyZS92aWRlby8ke2lkfWA7XG4vLyAgICAgcmV0dXJuIHtcbi8vICAgICAgICAgXCJ1bmlxdWVVUkxcIjogdXJsXG4vLyAgICAgfTtcbi8vIH1cblxuLy8gY29uc29sZS5sb2codGlrdG9rQ29uZmlnKTtcbi8vIGNvbnN0IHRpa3Rva0NvbmZpZ0xvYWRlciA9IG5ldyBDb25maWdMb2FkZXIodGlrdG9rQ29uZmlnKTtcbi8vIHRpa3Rva0NvbmZpZ0xvYWRlci5pbmplY3RFeHRyYWN0b3IoXCIvKlwiLCB0aWt0b2tJRFNlbGVjdG9yKTtcbi8vIGNvbnN0IHRpa3Rva0ludGVyYWN0b3IgPSBuZXcgTW9uaXRvcih0aWt0b2tDb25maWdMb2FkZXIuY29uZmlnKTtcblxuLy8gLy8gY29uc29sZS5sb2codGlrdG9rQ29uZmlnKTtcbi8vIGNvbnN0IGxpbmtlZGluQ29uZmlnTG9hZGVyID0gbmV3IENvbmZpZ0xvYWRlcihsaW5rZWRpbkNvbmZpZyk7XG4vLyBjb25zdCBsaW5rZWRpbkludGVyYWN0b3IgPSBuZXcgTW9uaXRvcihsaW5rZWRpbkNvbmZpZ0xvYWRlci5jb25maWcpO1xuIiwiaW1wb3J0IHsgU2VuZGVyTWV0aG9kIH0gZnJvbSBcIi4uL2NvbW1vbi9jb21tdW5pY2F0aW9uL3NlbmRlclwiXG5pbXBvcnQgeyBFeHRyYWN0ZWRNZXRhZGF0YSB9IGZyb20gXCIuLi9jb21tb24vZGJkb2N1bWVudFwiXG5cbmV4cG9ydCB7XG4gIENvbmZpZyxcbiAgQ29uZmlnTG9hZGVyLFxuICBVUkxQYXR0ZXJuVG9TZWxlY3RvcnMsXG4gIFNlbGVjdG9yTmFtZVBhaXIsXG4gIEV4dHJhY3RvckRhdGEsXG4gIEV4dHJhY3Rvckxpc3QsXG59XG5cbmludGVyZmFjZSBTZWxlY3Rvck5hbWVQYWlyIHtcbiAgc2VsZWN0b3I6IHN0cmluZ1xuICBuYW1lOiBzdHJpbmdcbn1cbnR5cGUgVVJMUGF0dGVyblRvU2VsZWN0b3JzID0gUmVjb3JkPHN0cmluZywgU2VsZWN0b3JOYW1lUGFpcltdPlxuXG5pbnRlcmZhY2UgQ29uZmlnIHtcbiAgLyoqXG4gICAqIEFuIGludGVyZmFjZSB0aGF0IGNvbnRhaW5zIGFsbCB0aGUgZGF0YSByZXF1aXJlZCB0byBpbnN0YW50aWF0ZSBhIE1vbml0b3IuXG4gICAqL1xuICAvLyBUaGUgYmFzZSBVUkwgdGhhdCB0aGUgbW9uaXRvciBzaG91bGQgc3RhcnQgYXRcbiAgYmFzZVVSTDogc3RyaW5nXG4gIC8vIEEgbWFwcGluZyBvZiBVUkwgcGF0dGVybnMgdG8gcGF0aCBkYXRhLiBUaGUgVVJMIFBhdHRlcm4gc2hvdWxkIGZvbGxvdyB0aGVcbiAgLy8gVVJMIFBhdHRlcm4gQVBJIHN5bnRheC4gVGhlc2UgYXJlIGFwcGVuZGVkIHRvIHRoZSBiYXNlVVJMIHdoZW4gY2hlY2tpbmcgZm9yIG1hdGNoZXNcbiAgLy8gRXg6IGJhc2VVUkw6IHd3dy55b3V0dWJlLmNvbSwgcGF0aDogL3Nob3J0cy86aWQgLT4gd3d3LnlvdXR1YmUuY29tL3Nob3J0cy86aWRcbiAgcGF0aHM6IFVSTFBhdHRlcm5Ub1NlbGVjdG9yc1xuICAvLyBJbmRpY2F0ZXMgd2hldGhlciB0aGUgTW9uaXRvciBzaG91bGQgYmUgaW4gZGVidWcgbW9kZS4gSWYgdHJ1ZSwgYWRkIGNvbG91cmVkIGJveGVzXG4gIC8vIGFyb3VuZCBzZWxlY3RlZCBIVE1MIGVsZW1lbnRzXG4gIGRlYnVnPzogYm9vbGVhblxuICAvLyBBIGxpc3Qgb2YgZXZlbnQgdHlwZXMgdG8gbW9uaXRvci4gQnkgZGVmYXVsdCwgdGhpcyBpcyBqdXN0IFtcImNsaWNrXCJdXG4gIGV2ZW50cz86IHN0cmluZ1tdXG59XG5cbmNsYXNzIEV4dHJhY3RvckRhdGEge1xuICBldmVudFR5cGU6IFNlbmRlck1ldGhvZFxuICB1cmxQYXR0ZXJuOiBzdHJpbmdcbiAgZXh0cmFjdG9yOiAoKSA9PiBFeHRyYWN0ZWRNZXRhZGF0YVxuICBjb25zdHJ1Y3RvcihcbiAgICBhY3Rpdml0eVR5cGU6IFNlbmRlck1ldGhvZCxcbiAgICB1cmxQYXR0ZXJuOiBzdHJpbmcsXG4gICAgZXh0cmFjdG9yOiAoKSA9PiBFeHRyYWN0ZWRNZXRhZGF0YSxcbiAgKSB7XG4gICAgdGhpcy5ldmVudFR5cGUgPSBhY3Rpdml0eVR5cGVcbiAgICB0aGlzLnVybFBhdHRlcm4gPSB1cmxQYXR0ZXJuXG4gICAgdGhpcy5leHRyYWN0b3IgPSBleHRyYWN0b3JcbiAgfVxufVxuXG5jbGFzcyBFeHRyYWN0b3JMaXN0IHtcbiAgcHJpdmF0ZSBleHRyYWN0b3JzOiBFeHRyYWN0b3JEYXRhW11cbiAgcHJpdmF0ZSBiYXNlVVJMOiBzdHJpbmdcbiAgY29uc3RydWN0b3IoZXh0cmFjdG9yczogRXh0cmFjdG9yRGF0YVtdID0gW10sIGJhc2VVUkw6IHN0cmluZykge1xuICAgIHRoaXMuZXh0cmFjdG9ycyA9IGV4dHJhY3RvcnNcbiAgICB0aGlzLmJhc2VVUkwgPSBiYXNlVVJMXG4gIH1cblxuICBwdWJsaWMgZXh0cmFjdChcbiAgICBjdXJyZW50VVJMOiBzdHJpbmcsXG4gICAgZXZlbnRUeXBlOiBTZW5kZXJNZXRob2QsXG4gICk6IEV4dHJhY3RlZE1ldGFkYXRhIHtcbiAgICBjb25zb2xlLmxvZyhcbiAgICAgIGBBdHRlbXB0aW5nIGV4dHJhY3Rpb24gZm9yIHVybDogJHtjdXJyZW50VVJMfSBhbmQgZXZlbnQgdHlwZSAke2V2ZW50VHlwZX1gLFxuICAgIClcbiAgICBsZXQgZXh0cmFjdGVkRGF0YTogRXh0cmFjdGVkTWV0YWRhdGEgPSB7fVxuICAgIHRoaXMuZXh0cmFjdG9yc1xuICAgICAgLmZpbHRlcigoZSkgPT4ge1xuICAgICAgICBjb25zdCBpc0NvcnJlY3RBY3Rpdml0eTogYm9vbGVhbiA9XG4gICAgICAgICAgZS5ldmVudFR5cGUgPT0gZXZlbnRUeXBlIHx8IGUuZXZlbnRUeXBlID09IFNlbmRlck1ldGhvZC5BbnlcbiAgICAgICAgY29uc3QgcDogVVJMUGF0dGVybiA9IG5ldyBVUkxQYXR0ZXJuKGUudXJsUGF0dGVybiwgdGhpcy5iYXNlVVJMKVxuICAgICAgICBjb25zdCBpc1VSTE1hdGNoOiBib29sZWFuID0gcC50ZXN0KGN1cnJlbnRVUkwpXG4gICAgICAgIHJldHVybiBpc0NvcnJlY3RBY3Rpdml0eSAmJiBpc1VSTE1hdGNoXG4gICAgICB9KVxuICAgICAgLmZvckVhY2goXG4gICAgICAgIChlKSA9PlxuICAgICAgICAgIChleHRyYWN0ZWREYXRhID0ge1xuICAgICAgICAgICAgLi4uKGV4dHJhY3RlZERhdGEgYXMgb2JqZWN0KSxcbiAgICAgICAgICAgIC4uLihlLmV4dHJhY3RvcigpIGFzIG9iamVjdCksXG4gICAgICAgICAgfSksXG4gICAgICApXG4gICAgcmV0dXJuIGV4dHJhY3RlZERhdGFcbiAgfVxufVxuXG5jbGFzcyBDb25maWdMb2FkZXIge1xuICBwdWJsaWMgY29uZmlnOiBDb25maWdcbiAgcHVibGljIGV4dHJhY3Rvckxpc3Q6IEV4dHJhY3Rvckxpc3RcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IENvbmZpZywgZXh0cmFjdG9yTGlzdDogRXh0cmFjdG9yRGF0YVtdID0gW10pIHtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZ1xuICAgIHRoaXMuZXh0cmFjdG9yTGlzdCA9IG5ldyBFeHRyYWN0b3JMaXN0KGV4dHJhY3Rvckxpc3QsIGNvbmZpZy5iYXNlVVJMKVxuICB9XG59XG4iLCJpbXBvcnQge1xuICBNZXNzYWdlVG9CYWNrZ3JvdW5kLFxuICBNZXNzYWdlUmVzcG9uc2UsXG59IGZyb20gXCIuLi9jb21tb24vY29tbXVuaWNhdGlvbi9tZXNzYWdpbmdcIlxuaW1wb3J0IHtcbiAgREJEb2N1bWVudCxcbiAgQWN0aXZpdHlEb2N1bWVudCxcbiAgU2Vzc2lvbkRvY3VtZW50LFxuICBFeHRyYWN0ZWRNZXRhZGF0YSxcbn0gZnJvbSBcIi4uL2NvbW1vbi9kYmRvY3VtZW50XCJcbmltcG9ydCB7IENvbmZpZ0xvYWRlciwgRXh0cmFjdG9yTGlzdCB9IGZyb20gXCIuL2NvbmZpZ1wiXG5pbXBvcnQgeyBQYWdlRGF0YSB9IGZyb20gXCIuL3BhZ2VkYXRhXCJcbmltcG9ydCB7IEFjdGl2aXR5VHlwZSB9IGZyb20gXCIuLi9jb21tb24vY29tbXVuaWNhdGlvbi9hY3Rpdml0eVwiXG5pbXBvcnQgeyBTZW5kZXJNZXRob2QgfSBmcm9tIFwiLi4vY29tbW9uL2NvbW11bmljYXRpb24vc2VuZGVyXCJcblxuLyoqXG4gKiBUaGlzIGNsYXNzIHJlYWRzIGZyb20gYSBwcm92aWRlZCBDb25maWcgb2JqZWN0IGFuZCBhdHRhY2hlcyBsaXN0ZW5lcnMgdG8gdGhlIGVsZW1lbnRzIHNwZWNpZmllZCBpbiB0aGUgc2VsZWN0b3JzLlxuICogV2hlbiB0aGVzZSBlbGVtZW50cyBhcmUgaW50ZXJhY3RlZCB3aXRoLCBvciB3aGVuIGEgbmF2aWdhdGlvbiBvY2N1cnMsIGEgZG9jdW1lbnQgaXMgc2VudCB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHRcbiAqIHRvIGJlIGFwcGVuZGVkIHRvIHRoZSBkYXRhYmFzZS4gVGhpcyBjbGFzcyBpcyBpbnN0YW50aWF0ZWQgaW4gY29udGVudC50cy5cbiAqXG4gKiBAcGFyYW0gaW50ZXJhY3Rpb25FdmVudHMgLSBBIGxpc3Qgb2YgdGhlIHR5cGUgb2YgZXZlbnRzIHdlIHdhbnQgdG8gbW9uaXRvciBhcyBpbnRlcmFjdGlvbnMgKGVnLiBjbGljaywgc2Nyb2xsLCBldGMuKS4gRGVmYXVsdCBpcyBjbGlja1xuICogQHBhcmFtIGRlYnVnIC0gSWYgdHJ1ZSwgaGlnaGxpZ2h0IGFsbCBzZWxlY3RlZCBIVE1MIGVsZW1lbnRzIHdpdGggY29sb3VyZWQgYm94ZXNcbiAqIEBwYXJhbSBwYXRocyAtIEFuIG9iamVjdCBtYXBwaW5nIHBhdGggcGF0dGVybnMgdG8gdGhlaXIgY29ycmVzcG9uZGluZyBDU1Mgc2VsZWN0b3JzIFBhdGggcGF0dGVybnMgYXJlIGNvbnNpc3RlbnQgd2l0aCB0aGUgIFVSTCBQYXR0ZXJuIEFQSSBTeW50YXg6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9VUkxfUGF0dGVybl9BUElcbiAqIEBwYXJhbSBiYXNlVVJMIC0gQmFzZSB1cmwgZm9yIHRoZSBwYWdlIChlZy4gd3d3LnlvdXR1YmUuY29tKS4gQWxsIHBhdGhzIGFyZSBhcHBlbmRlZCB0byB0aGlzIHdoZW4gbWF0Y2hpbmcgVVJsc1xuICogQHBhcmFtIGN1cnJlbnRQYWdlRGF0YSAtIENvbnRhaW5zIGRhdGEgcmVsZXZhbnQgdG8gdGhlIGN1cnJlbnQgcGFnZS5cbiAqIEBwYXJhbSBpbnRlcmFjdGlvbkF0dHJpYnV0ZSAtIEF0dHJpYnV0ZSBhZGRlZCB0byBhbGwgZWxlbWVudHMgYmVpbmcgbW9uaXRvcmVkXG4gKi9cbmV4cG9ydCBjbGFzcyBNb25pdG9yIHtcbiAgLy8gQSBsaXN0IG9mIHRoZSB0eXBlIG9mIGV2ZW50cyB3ZSB3YW50IHRvIG1vbml0b3IgYXMgaW50ZXJhY3Rpb25zIChlZy4gY2xpY2ssIHNjcm9sbCwgZXRjLikuIERlZmF1bHQgaXMgY2xpY2tcbiAgaHRtbEV2ZW50c1RvTW9uaXRvcjogc3RyaW5nW11cbiAgLy8gSWYgdHJ1ZSwgaGlnaGxpZ2h0IGFsbCBzZWxlY3RlZCBIVE1MIGVsZW1lbnRzIHdpdGggY29sb3VyZWQgYm94ZXNcbiAgZW5hYmxlSGlnaGxpZ2h0aW5nOiBib29sZWFuXG4gIC8vIENvbnRhaW5zIGRhdGEgcmVsZXZhbnQgdG8gdGhlIGN1cnJlbnQgcGFnZS5cbiAgY3VycmVudFBhZ2VEYXRhOiBQYWdlRGF0YVxuICAvLyBBdHRyaWJ1dGUgYWRkZWQgdG8gYWxsIGVsZW1lbnRzIGJlaW5nIG1vbml0b3JlZFxuICBodG1sTW9uaXRvcmluZ0F0dHJpYnV0ZTogc3RyaW5nXG5cbiAgZXh0cmFjdG9yTGlzdDogRXh0cmFjdG9yTGlzdFxuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZ0xvYWRlcjogQ29uZmlnTG9hZGVyKSB7XG4gICAgY29uc3QgY29uZmlnID0gY29uZmlnTG9hZGVyLmNvbmZpZ1xuICAgIHRoaXMuaHRtbEV2ZW50c1RvTW9uaXRvciA9IGNvbmZpZy5ldmVudHMgPz8gW1wiY2xpY2tcIl1cbiAgICB0aGlzLmVuYWJsZUhpZ2hsaWdodGluZyA9IHRydWVcbiAgICB0aGlzLmN1cnJlbnRQYWdlRGF0YSA9IG5ldyBQYWdlRGF0YShjb25maWcpXG4gICAgdGhpcy5odG1sTW9uaXRvcmluZ0F0dHJpYnV0ZSA9IFwibW9uaXRvcmluZy1pbnRlcmFjdGlvbnNcIlxuICAgIHRoaXMuZXh0cmFjdG9yTGlzdCA9IGNvbmZpZ0xvYWRlci5leHRyYWN0b3JMaXN0XG4gICAgLy8gT25seSBpbml0aWFsaXplIG1vbml0b3IgaWYgdGhlIFVSTCBtYXRjaGVzIGFuZFxuICAgIC8vIHRoZSBjb250ZW50IG9mIHRoZSBwYWdlIGlzIHZpc2libGVcbiAgICBpZiAod2luZG93LmxvY2F0aW9uLm9yaWdpbiA9PT0gY29uZmlnLmJhc2VVUkwpIHtcbiAgICAgIHRoaXMuaW50aXRpYWxpemVXaGVuVmlzaWJsZSgpXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbnRpdGlhbGl6ZVdoZW5WaXNpYmxlKCk6IHZvaWQge1xuICAgIGNvbnN0IHJ1bldoZW5WaXNpYmxlID0gKCkgPT4ge1xuICAgICAgaWYgKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gXCJ2aXNpYmxlXCIpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplTW9uaXRvcigpXG4gICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInZpc2liaWxpdHljaGFuZ2VcIiwgcnVuV2hlblZpc2libGUpXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgaW5pdGlhbGl6aW5nIG1vbml0b3I6XCIsIGVycm9yKVxuICAgICAgICAgICAgLy8gU3RpbGwgcmVtb3ZlIGxpc3RlbmVyIGV2ZW4gaWYgdGhlcmUncyBhbiBlcnJvclxuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInZpc2liaWxpdHljaGFuZ2VcIiwgcnVuV2hlblZpc2libGUpXG4gICAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiKSB7XG4gICAgICBydW5XaGVuVmlzaWJsZSgpIC8vIFRoaXMgd2lsbCBub3cgYmUgc3luY2hyb25vdXNcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcbiAgICAgICAgcnVuV2hlblZpc2libGUoKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidmlzaWJpbGl0eWNoYW5nZVwiLCBydW5XaGVuVmlzaWJsZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgbW9uaXRvclxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyBpbml0aWFsaXplTW9uaXRvcigpIHtcbiAgICBjb25zb2xlLmxvZyhcImluaXRpYWxpemluZyBtb25pdG9yXCIpXG4gICAgY29uc3QgY3VycmVudFVSTDogc3RyaW5nID0gZG9jdW1lbnQubG9jYXRpb24uaHJlZlxuICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLnVwZGF0ZShjdXJyZW50VVJMKVxuICAgIHRyeSB7XG4gICAgICAvLyBDcmVhdGVzIGEgbmV3IGVudHJ5IGluIHRoZSBEQiBkZXNjcmliaW5nIHRoZSBzdGF0ZSBhdCB0aGUgc3RhcnQgb2YgdGhlIHNlc3Npb25cbiAgICAgIGF3YWl0IHRoaXMuaW5pdGlhbGl6ZVNlc3Npb24oKVxuICAgICAgLy8gQmluZHMgbGlzdGVuZXJzIHRvIHRoZSBIVE1MIGVsZW1lbnRzIHNwZWNpZmllZCBpbiB0aGUgY29uZmlnIGZvciBhbGwgbWF0Y2hpbmcgcGF0aCBwYXR0ZXJuc1xuICAgICAgdGhpcy5iaW5kRXZlbnRzKClcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gaW5pdGlhbGl6ZSBzZXNzaW9uOlwiLCBlcnIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgZW50cnkgaW4gdGhlIERCIGRlc2NyaWJpbmcgdGhlIHN0YXRlIGF0IHRoZSBzdGFydCBvZiB0aGUgc2Vzc2lvblxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyBpbml0aWFsaXplU2Vzc2lvbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBjdXJyZW50U3RhdGU6IERCRG9jdW1lbnQgPSBuZXcgU2Vzc2lvbkRvY3VtZW50KFxuICAgICAgdGhpcy5jdXJyZW50UGFnZURhdGEuY3VycmVudFVSTCxcbiAgICAgIGRvY3VtZW50LnRpdGxlLFxuICAgIClcbiAgICBjb25zb2xlLmxvZyhcIkNoZWNraW5nIGhpZ2hsaWdodFwiKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBNZXNzYWdlUmVzcG9uc2UgfCBudWxsID0gYXdhaXQgdGhpcy5zZW5kTWVzc2FnZVRvQmFja2dyb3VuZChcbiAgICAgIFNlbmRlck1ldGhvZC5Jbml0aWFsaXplU2Vzc2lvbixcbiAgICAgIGN1cnJlbnRTdGF0ZSxcbiAgICApXG4gICAgaWYgKFxuICAgICAgcmVzcG9uc2UgJiZcbiAgICAgIHJlc3BvbnNlPy5zdGF0dXMgPT09IFwiU2Vzc2lvbiBpbml0aWFsaXplZFwiICYmXG4gICAgICByZXNwb25zZS5oaWdobGlnaHRcbiAgICApIHtcbiAgICAgIHRoaXMuZW5hYmxlSGlnaGxpZ2h0aW5nID0gcmVzcG9uc2UuaGlnaGxpZ2h0XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKGBIaWdobGlnaHQgaXMgc2V0IHRvICR7dGhpcy5lbmFibGVIaWdobGlnaHRpbmd9YClcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kcyBldmVudCBsaXN0ZW5lcnMgZm9yIG11dGF0aW9ucyBhbmQgbmF2aWdhdGlvblxuICAgKi9cblxuICBwcml2YXRlIGJpbmRFdmVudHMoKTogdm9pZCB7XG4gICAgLy8gV2hlbmV2ZXIgbmV3IGNvbnRlbnQgaXMgbG9hZGVkLCBhdHRhY2ggb2JzZXJ2ZXJzIHRvIGVhY2ggSFRNTCBlbGVtZW50IHRoYXQgbWF0Y2hlcyB0aGUgc2VsZWN0b3JzIGluIHRoZSBjb25maWdzXG4gICAgY29uc3Qgb2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PlxuICAgICAgdGhpcy5hZGRMaXN0ZW5lcnNUb05ld01hdGNoZXMoKSxcbiAgICApXG4gICAgLy8gTWFrZSB0aGUgbXV0YXRpb24gb2JzZXJ2ZXIgb2JzZXJ2ZSB0aGUgZW50aXJlIGRvY3VtZW50IGZvciBjaGFuZ2VzXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7XG4gICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgIH0pXG5cbiAgICAvLyBBZGQgYW4gZXZlbnQgbGlzdGVuZXIgdG8gZGV0ZWN0IG5hdmlnYXRpb25zIG9uIHRoZSBwYWdlXG4gICAgbmF2aWdhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibmF2aWdhdGVcIiwgKGU6IE5hdmlnYXRpb25FdmVudCkgPT5cbiAgICAgIHRoaXMub25OYXZpZ2F0aW9uRGV0ZWN0aW9uKGUpLFxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGxpc3RlbmVycyB0byBtdXRhdGlvbnMgKGllLiBuZXdseSByZW5kZXJlZCBlbGVtZW50cykgYW5kIG1hcmtzIHRoZW0gd2l0aCB0aGlzLmludGVyYWN0dGlvbkF0dHJpYnV0ZS5cbiAgICogSWYgZGVidWcgbW9kZSBpcyBvbiwgdGhpcyB3aWxsIGFkZCBhIGNvbG91cmZ1bCBib3JkZXIgdG8gdGhlc2UgZWxlbWVudHMuXG4gICAqL1xuXG4gIHByaXZhdGUgYWRkTGlzdGVuZXJzVG9OZXdNYXRjaGVzKCk6IHZvaWQge1xuICAgIC8vIGNvbnNvbGUubG9nKFwiYWRkaW5nIHNlbGVjdG9yc1wiKTtcbiAgICAvLyBjb25zb2xlLmxvZyhgVmFsdWUgb2YgaGlnaGxpZ2h0OiAke3RoaXMuaGlnaGxpZ2h0fWApO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiQ3VycmVudCBwYWdlIGRhdGE6XCIpO1xuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuY3VycmVudFBhZ2VEYXRhKTtcbiAgICB0aGlzLmN1cnJlbnRQYWdlRGF0YS5zZWxlY3Rvck5hbWVQYWlycy5mb3JFYWNoKChzZWxlY3Rvck5hbWVQYWlyKSA9PiB7XG4gICAgICBjb25zdCBlbGVtZW50czogTm9kZUxpc3RPZjxIVE1MRWxlbWVudD4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICBgOmlzKCR7c2VsZWN0b3JOYW1lUGFpci5zZWxlY3Rvcn0pOm5vdChbJHt0aGlzLmh0bWxNb25pdG9yaW5nQXR0cmlidXRlfV0pYCxcbiAgICAgIClcbiAgICAgIGNvbnN0IG5hbWU6IHN0cmluZyA9IHNlbGVjdG9yTmFtZVBhaXIubmFtZVxuICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XG4gICAgICAgIGlmICh0aGlzLmVuYWJsZUhpZ2hsaWdodGluZykge1xuICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm9yZGVyID0gYDJweCBzb2xpZCAke3RoaXMuU3RyaW5nVG9Db2xvci5uZXh0KG5hbWUpfWBcbiAgICAgICAgfVxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSh0aGlzLmh0bWxNb25pdG9yaW5nQXR0cmlidXRlLCBcInRydWVcIilcblxuICAgICAgICBmb3IgKGNvbnN0IGllIG9mIHRoaXMuaHRtbEV2ZW50c1RvTW9uaXRvcikge1xuICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIGllLFxuICAgICAgICAgICAgKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMub25JbnRlcmFjdGlvbkRldGVjdGlvbihlbGVtZW50LCBlLCBuYW1lKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0LlxuICAgKiBAcGFyYW0gYWN0aXZpdHlUeXBlIC0gIHRoZSB0eXBlIG9mIGFjdGl2aXR5IChzZWxmIGxvb3Agb3Igc3RhdGUgY2hhbmdlKVxuICAgKiBAcGFyYW0gZXZlbnQgLSB0aGUgSFRNTCBldmVudCB0aGF0IG9jY3VyZWRcbiAgICpcbiAgICogQHJldHVybnMgQSBkb2N1bWVudCBkZXNjcmliaW5nIHNlbGYgbG9vcFxuICAgKi9cblxuICBwcml2YXRlIGNyZWF0ZU5hdmlnYXRpb25SZWNvcmQoXG4gICAgYWN0aXZpdHlUeXBlOiBBY3Rpdml0eVR5cGUsXG4gICAgZXZlbnQ6IEV2ZW50LFxuICApOiBEQkRvY3VtZW50IHtcbiAgICBjb25zb2xlLmxvZyhcIkRldGVjdGVkIHNlbGYgbG9vcCBjaGFuZ2UgZXZlbnRcIilcbiAgICBjb25zdCBtZXRhZGF0YSA9IHRoaXMuZXh0cmFjdG9yTGlzdC5leHRyYWN0KFxuICAgICAgdGhpcy5jdXJyZW50UGFnZURhdGEuY3VycmVudFVSTCxcbiAgICAgIFNlbmRlck1ldGhvZC5OYXZpZ2F0aW9uRGV0ZWN0aW9uLFxuICAgIClcbiAgICBjb25zb2xlLmxvZyhcInByaW50aW5nIG1ldGFkYXRhXCIpXG4gICAgY29uc29sZS5sb2cobWV0YWRhdGEpXG4gICAgcmV0dXJuIG5ldyBBY3Rpdml0eURvY3VtZW50KFxuICAgICAgYWN0aXZpdHlUeXBlLFxuICAgICAgZXZlbnQsXG4gICAgICBtZXRhZGF0YSxcbiAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkwsXG4gICAgICBkb2N1bWVudC50aXRsZSxcbiAgICApXG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBtZXNzYWdlIHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdC5cbiAgICogQHBhcmFtIGVsZW1lbnQgLSB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJlZCB0aGUgZXZlbnRcbiAgICogQHBhcmFtIG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJlZCB0aGUgY2FsbGJhY2sgKGFzIGRlZmluZWQgaW4gdGhlIGNvbmZpZylcbiAgICogQHBhcmFtIGV2ZW50IC0gdGhlIEhUTUwgZXZlbnQgdGhhdCBvY2N1cmVkXG4gICAqIEByZXR1cm5zIEEgZG9jdW1lbnQgaW50ZXJhY3Rpb24gc2VsZiBsb29wXG4gICAqL1xuXG4gIHByaXZhdGUgY3JlYXRlSW50ZXJhY3Rpb25SZWNvcmQobmFtZTogc3RyaW5nLCBldmVudDogRXZlbnQpOiBEQkRvY3VtZW50IHtcbiAgICBjb25zb2xlLmxvZyhcIkRldGVjdGVkIGludGVyYWN0aW9uIGV2ZW50XCIpXG4gICAgY29uc3QgcGFnZVNwZWNpZmljRGF0YTogb2JqZWN0ID0ge1xuICAgICAgZWxlbWVudE5hbWU6IG5hbWUsXG4gICAgfVxuICAgIGNvbnN0IGV4dHJhY3RlZERhdGEgPSB0aGlzLmV4dHJhY3Rvckxpc3QuZXh0cmFjdChcbiAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkwsXG4gICAgICBTZW5kZXJNZXRob2QuSW50ZXJhY3Rpb25EZXRlY3Rpb24sXG4gICAgKVxuXG4gICAgY29uc3QgbWV0YWRhdGE6IEV4dHJhY3RlZE1ldGFkYXRhID0ge1xuICAgICAgLi4ucGFnZVNwZWNpZmljRGF0YSxcbiAgICAgIC4uLihleHRyYWN0ZWREYXRhIGFzIG9iamVjdCksXG4gICAgfSBhcyBFeHRyYWN0ZWRNZXRhZGF0YVxuXG4gICAgY29uc29sZS5sb2coXCJwcmludGluZyBtZXRhZGF0YVwiKVxuICAgIGNvbnNvbGUubG9nKG1ldGFkYXRhKVxuXG4gICAgcmV0dXJuIG5ldyBBY3Rpdml0eURvY3VtZW50KFxuICAgICAgQWN0aXZpdHlUeXBlLkludGVyYWN0aW9uLFxuICAgICAgZXZlbnQsXG4gICAgICBtZXRhZGF0YSxcbiAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkwsXG4gICAgICBkb2N1bWVudC50aXRsZSxcbiAgICApXG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBtZXNzYWdlIHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdC5cbiAgICogQHBhcmFtIHNlbmRlck1ldGhvZCAtIHRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvbiB0aGF0J3Mgc2VuZGluZyB0aGUgbWVzc2FnZSB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHRcbiAgICogQHBhcmFtIHBheWxvYWQgLSB0aGUgZGF0YSBiZWluZyBzZW50IHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdFxuICAgKlxuICAgKiBAcmV0dXJucyBSZXNwb25zZSBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIG1lc3NhZ2Ugc3VjY2VlZGVkXG4gICAqL1xuXG4gIHByaXZhdGUgYXN5bmMgc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoXG4gICAgc2VuZGVyTWV0aG9kOiBTZW5kZXJNZXRob2QsXG4gICAgcGF5bG9hZDogREJEb2N1bWVudCxcbiAgKTogUHJvbWlzZTxNZXNzYWdlUmVzcG9uc2UgfCBudWxsPiB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIENoZWNrIGlmIHJ1bnRpbWUgaXMgYXZhaWxhYmxlIChleHRlbnNpb24gY29udGV4dCBzdGlsbCB2YWxpZClcbiAgICAgIGlmICghY2hyb21lLnJ1bnRpbWU/LmlkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4dGVuc2lvbiBjb250ZXh0IGludmFsaWRhdGVkXCIpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1lc3NhZ2U6IE1lc3NhZ2VUb0JhY2tncm91bmQgPSBuZXcgTWVzc2FnZVRvQmFja2dyb3VuZChcbiAgICAgICAgc2VuZGVyTWV0aG9kLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgKVxuICAgICAgY29uc3QgcmVzcG9uc2U6IE1lc3NhZ2VSZXNwb25zZSA9XG4gICAgICAgIGF3YWl0IGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1lc3NhZ2UpXG5cbiAgICAgIC8vIENocm9tZSByZXR1cm5zIHVuZGVmaW5lZCBpZiBubyBsaXN0ZW5lcnMsIGNoZWNrIGlmIHRoYXQncyBleHBlY3RlZFxuICAgICAgaWYgKHJlc3BvbnNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIk5vIHJlc3BvbnNlIGZyb20gYmFja2dyb3VuZCBzY3JpcHRcIilcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNwb25zZVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQmFja2dyb3VuZCBtZXNzYWdlIGZhaWxlZDpcIiwgZXJyb3IpXG4gICAgICAvLyBEZWNpZGUgd2hldGhlciB0byB0aHJvdyBvciBoYW5kbGUgZ3JhY2VmdWxseSBiYXNlZCBvbiB5b3VyIG5lZWRzXG4gICAgICByZXR1cm4gbnVsbCAvLyBvciB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgdGhhdCBjcmVhdGVzIGEgcGF5bG9hZCBkZXNjcmliaW5nIHRoZSBpbnRlcmFjdGlvbiB0aGF0IG9jY3VyZWQgYW5kIHNlbmRzIGl0IHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdFxuICAgKiBAcGFyYW0gZWxlbWVudCAtIHRoZSBldmVudCB0aGF0IHRyaWdnZXJlZCB0aGUgY2FsbGJhY2tcbiAgICogQHBhcmFtIG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJlZCB0aGUgY2FsbGJhY2sgKGFzIGRlZmluZWQgaW4gdGhlIGNvbmZpZylcbiAgICovXG5cbiAgcHJpdmF0ZSBvbkludGVyYWN0aW9uRGV0ZWN0aW9uKFxuICAgIGVsZW1lbnQ6IEVsZW1lbnQsXG4gICAgZXZlbnQ6IEV2ZW50LFxuICAgIG5hbWU6IHN0cmluZyxcbiAgKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coXCJpbnRlcmFjdGlvbiBldmVudCBkZXRlY3RlZFwiKVxuICAgIGNvbnNvbGUubG9nKGBFdmVudCBkZXRlY3RlZCB3aXRoIGV2ZW50IHR5cGU6ICR7ZXZlbnQudHlwZX1gKVxuICAgIGNvbnNvbGUubG9nKGBFdmVudCB0cmlnZ2VyZWQgYnlgLCBlbGVtZW50KVxuICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnQuaW5uZXJIVE1MKTtcbiAgICAvLyBjb25zb2xlLmxvZyhlbGVtZW50LmdldEhUTUwoKSk7XG4gICAgY29uc3QgcmVjb3JkOiBEQkRvY3VtZW50ID0gdGhpcy5jcmVhdGVJbnRlcmFjdGlvblJlY29yZChuYW1lLCBldmVudClcbiAgICB0aGlzLnNlbmRNZXNzYWdlVG9CYWNrZ3JvdW5kKFxuICAgICAgU2VuZGVyTWV0aG9kLkludGVyYWN0aW9uRGV0ZWN0aW9uLFxuICAgICAgcmVjb3JkLFxuICAgICkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIHNlbmQgaW50ZXJhY3Rpb24gZGF0YTpcIiwgZXJyb3IpXG4gICAgfSlcbiAgfVxuXG4gIHByaXZhdGUgaXNOZXdCYXNlVVJMKHVybDogc3RyaW5nIHwgbnVsbCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB1cmwgJiYgdGhpcy5jdXJyZW50UGFnZURhdGEuY3VycmVudFVSTFxuICAgICAgPyB1cmwuc3BsaXQoXCIuXCIpWzFdICE9PSB0aGlzLmN1cnJlbnRQYWdlRGF0YS5jdXJyZW50VVJMLnNwbGl0KFwiLlwiKVsxXVxuICAgICAgOiBmYWxzZVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRoYXQgY3JlYXRlcyBhIHBheWxvYWQgZGVzY3JpYmluZyB0aGUgbmF2aWdhdGlvbiB0aGF0IG9jY3VyZWQgYW5kIHNlbmRzIGl0IHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdFxuICAgKiBAcGFyYW0gbmF2RXZlbnQgLSB0aGUgZXZlbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIGNhbGxiYWNrXG4gICAqL1xuICBwcml2YXRlIG9uTmF2aWdhdGlvbkRldGVjdGlvbihuYXZFdmVudDogTmF2aWdhdGlvbkV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgZGVzdFVybDogc3RyaW5nIHwgbnVsbCA9IG5hdkV2ZW50LmRlc3RpbmF0aW9uLnVybFxuICAgIGNvbnN0IGJhc2VVUkxDaGFuZ2U6IGJvb2xlYW4gPSB0aGlzLmlzTmV3QmFzZVVSTChkZXN0VXJsKVxuICAgIGxldCByZWNvcmQ6IERCRG9jdW1lbnQgfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcbiAgICBsZXQgc2VuZGVyOiBTZW5kZXJNZXRob2QgfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcbiAgICB0aGlzLmN1cnJlbnRQYWdlRGF0YS5jdXJyZW50VVJMID0gbmF2RXZlbnQuZGVzdGluYXRpb24udXJsID8/IFwiTk8gVVJMIEZPVU5EXCJcblxuICAgIGNvbnNvbGUubG9nKGBOYXZpZ2F0aW9uIGRldGVjdGVkIHdpdGggZXZlbnQgdHlwZTogJHtuYXZFdmVudC50eXBlfWApXG4gICAgaWYgKGJhc2VVUkxDaGFuZ2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiVVJMIGJhc2UgY2hhbmdlIGRldGVjdGVkLiBDbG9zaW5nIHByb2dyYW0uXCIpXG4gICAgICByZWNvcmQgPSBuZXcgREJEb2N1bWVudCh0aGlzLmN1cnJlbnRQYWdlRGF0YS5jdXJyZW50VVJMLCBkb2N1bWVudC50aXRsZSlcbiAgICAgIHNlbmRlciA9IFNlbmRlck1ldGhvZC5DbG9zZVNlc3Npb25cbiAgICB9IGVsc2UgaWYgKG5hdkV2ZW50Lm5hdmlnYXRpb25UeXBlID09PSBcInB1c2hcIikge1xuICAgICAgY29uc29sZS5sb2coXCJQdXNoIGV2ZW50IGRldGVjdGVkLlwiKVxuICAgICAgcmVjb3JkID0gdGhpcy5jcmVhdGVOYXZpZ2F0aW9uUmVjb3JkKEFjdGl2aXR5VHlwZS5TdGF0ZUNoYW5nZSwgbmF2RXZlbnQpXG4gICAgICBzZW5kZXIgPSBTZW5kZXJNZXRob2QuTmF2aWdhdGlvbkRldGVjdGlvblxuICAgICAgdGhpcy5jdXJyZW50UGFnZURhdGEudXBkYXRlKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYpXG4gICAgfSBlbHNlIGlmIChuYXZFdmVudC5uYXZpZ2F0aW9uVHlwZSA9PT0gXCJyZXBsYWNlXCIpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiUmVwbGFjZSBldmVudCBkZXRlY3RlZC5cIilcblxuICAgICAgcmVjb3JkID0gdGhpcy5jcmVhdGVOYXZpZ2F0aW9uUmVjb3JkKEFjdGl2aXR5VHlwZS5TZWxmTG9vcCwgbmF2RXZlbnQpXG4gICAgICBzZW5kZXIgPSBTZW5kZXJNZXRob2QuTmF2aWdhdGlvbkRldGVjdGlvblxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcmVjb3JkICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBzZW5kZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRoaXMuc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoc2VuZGVyLCByZWNvcmQpLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIHNlbmQgaW50ZXJhY3Rpb24gZGF0YTpcIiwgZXJyb3IpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYSB1bmlxdWUgY29sb3IgZnJvbSBhIGdpdmVuIHN0cmluZ1xuICAgKiBTb3VyY2U6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zMTAzNzM4M1xuICAgKiBAcmV0dXJucyBDb2xvciBoZXggY29kZVxuICAgKi9cblxuICBwcml2YXRlIFN0cmluZ1RvQ29sb3IgPSAoZnVuY3Rpb24gKCkge1xuICAgIGludGVyZmFjZSBDb2xvckluc3RhbmNlIHtcbiAgICAgIHN0cmluZ1RvQ29sb3JIYXNoOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+XG4gICAgICBuZXh0VmVyeURpZmZlcm50Q29sb3JJZHg6IG51bWJlclxuICAgICAgdmVyeURpZmZlcmVudENvbG9yczogc3RyaW5nW11cbiAgICB9XG5cbiAgICBsZXQgaW5zdGFuY2U6IENvbG9ySW5zdGFuY2UgfCBudWxsID0gbnVsbFxuXG4gICAgcmV0dXJuIHtcbiAgICAgIG5leHQ6IGZ1bmN0aW9uIHN0cmluZ1RvQ29sb3Ioc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpbnN0YW5jZSA/Pz0ge1xuICAgICAgICAgIHN0cmluZ1RvQ29sb3JIYXNoOiB7fSxcbiAgICAgICAgICBuZXh0VmVyeURpZmZlcm50Q29sb3JJZHg6IDAsXG4gICAgICAgICAgdmVyeURpZmZlcmVudENvbG9yczogW1xuICAgICAgICAgICAgXCIjMDBGRjAwXCIsXG4gICAgICAgICAgICBcIiMwMDAwRkZcIixcbiAgICAgICAgICAgIFwiI0ZGMDAwMFwiLFxuICAgICAgICAgICAgXCIjMDFGRkZFXCIsXG4gICAgICAgICAgICBcIiNGRkE2RkVcIixcbiAgICAgICAgICAgIFwiI0ZGREI2NlwiLFxuICAgICAgICAgICAgXCIjMDA2NDAxXCIsXG4gICAgICAgICAgICBcIiMwMTAwNjdcIixcbiAgICAgICAgICAgIFwiIzk1MDAzQVwiLFxuICAgICAgICAgICAgXCIjMDA3REI1XCIsXG4gICAgICAgICAgICBcIiNGRjAwRjZcIixcbiAgICAgICAgICAgIFwiI0ZGRUVFOFwiLFxuICAgICAgICAgICAgXCIjNzc0RDAwXCIsXG4gICAgICAgICAgICBcIiM5MEZCOTJcIixcbiAgICAgICAgICAgIFwiIzAwNzZGRlwiLFxuICAgICAgICAgICAgXCIjRDVGRjAwXCIsXG4gICAgICAgICAgICBcIiNGRjkzN0VcIixcbiAgICAgICAgICAgIFwiIzZBODI2Q1wiLFxuICAgICAgICAgICAgXCIjRkYwMjlEXCIsXG4gICAgICAgICAgICBcIiNGRTg5MDBcIixcbiAgICAgICAgICAgIFwiIzdBNDc4MlwiLFxuICAgICAgICAgICAgXCIjN0UyREQyXCIsXG4gICAgICAgICAgICBcIiM4NUE5MDBcIixcbiAgICAgICAgICAgIFwiI0ZGMDA1NlwiLFxuICAgICAgICAgICAgXCIjQTQyNDAwXCIsXG4gICAgICAgICAgICBcIiMwMEFFN0VcIixcbiAgICAgICAgICAgIFwiIzY4M0QzQlwiLFxuICAgICAgICAgICAgXCIjQkRDNkZGXCIsXG4gICAgICAgICAgICBcIiMyNjM0MDBcIixcbiAgICAgICAgICAgIFwiI0JERDM5M1wiLFxuICAgICAgICAgICAgXCIjMDBCOTE3XCIsXG4gICAgICAgICAgICBcIiM5RTAwOEVcIixcbiAgICAgICAgICAgIFwiIzAwMTU0NFwiLFxuICAgICAgICAgICAgXCIjQzI4QzlGXCIsXG4gICAgICAgICAgICBcIiNGRjc0QTNcIixcbiAgICAgICAgICAgIFwiIzAxRDBGRlwiLFxuICAgICAgICAgICAgXCIjMDA0NzU0XCIsXG4gICAgICAgICAgICBcIiNFNTZGRkVcIixcbiAgICAgICAgICAgIFwiIzc4ODIzMVwiLFxuICAgICAgICAgICAgXCIjMEU0Q0ExXCIsXG4gICAgICAgICAgICBcIiM5MUQwQ0JcIixcbiAgICAgICAgICAgIFwiI0JFOTk3MFwiLFxuICAgICAgICAgICAgXCIjOTY4QUU4XCIsXG4gICAgICAgICAgICBcIiNCQjg4MDBcIixcbiAgICAgICAgICAgIFwiIzQzMDAyQ1wiLFxuICAgICAgICAgICAgXCIjREVGRjc0XCIsXG4gICAgICAgICAgICBcIiMwMEZGQzZcIixcbiAgICAgICAgICAgIFwiI0ZGRTUwMlwiLFxuICAgICAgICAgICAgXCIjNjIwRTAwXCIsXG4gICAgICAgICAgICBcIiMwMDhGOUNcIixcbiAgICAgICAgICAgIFwiIzk4RkY1MlwiLFxuICAgICAgICAgICAgXCIjNzU0NEIxXCIsXG4gICAgICAgICAgICBcIiNCNTAwRkZcIixcbiAgICAgICAgICAgIFwiIzAwRkY3OFwiLFxuICAgICAgICAgICAgXCIjRkY2RTQxXCIsXG4gICAgICAgICAgICBcIiMwMDVGMzlcIixcbiAgICAgICAgICAgIFwiIzZCNjg4MlwiLFxuICAgICAgICAgICAgXCIjNUZBRDRFXCIsXG4gICAgICAgICAgICBcIiNBNzU3NDBcIixcbiAgICAgICAgICAgIFwiI0E1RkZEMlwiLFxuICAgICAgICAgICAgXCIjRkZCMTY3XCIsXG4gICAgICAgICAgICBcIiMwMDlCRkZcIixcbiAgICAgICAgICAgIFwiI0U4NUVCRVwiLFxuICAgICAgICAgIF0sXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWluc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoW3N0cl0pIHtcbiAgICAgICAgICBpbnN0YW5jZS5zdHJpbmdUb0NvbG9ySGFzaFtzdHJdID1cbiAgICAgICAgICAgIGluc3RhbmNlLnZlcnlEaWZmZXJlbnRDb2xvcnNbaW5zdGFuY2UubmV4dFZlcnlEaWZmZXJudENvbG9ySWR4KytdXG4gICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBgJWMgVGhlIGNvbG91ciBmb3IgJHtzdHJ9YCxcbiAgICAgICAgICAgIGBjb2xvcjogJHtpbnN0YW5jZS5zdHJpbmdUb0NvbG9ySGFzaFtzdHJdfWAsXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnN0YW5jZS5zdHJpbmdUb0NvbG9ySGFzaFtzdHJdXG4gICAgICB9LFxuICAgIH1cbiAgfSkoKVxufVxuIiwiaW1wb3J0IHsgVVJMUGF0dGVyblRvU2VsZWN0b3JzLCBTZWxlY3Rvck5hbWVQYWlyLCBDb25maWcgfSBmcm9tIFwiLi9jb25maWdcIlxuLyoqXG4gKiBBIGNsYXNzIHJlc3BvbnNpYmxlIGZvciB0cmFja2luZyB0aGUgc3RhdGUgb2YgdGhlIHBhZ2UgdGhhdCB0aGUgdXNlciBpcyBjdXJyZW50bHkgb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBQYWdlRGF0YSB7XG4gIC8vIEN1cnJlbnQgVVJMIG9mIHRoZSBwYWdlXG4gIGN1cnJlbnRVUkwhOiBzdHJpbmdcbiAgLy8gQ1NTIHNlbGVjdG9ycyBiZWluZyBhcHBsaWVkIHRvIHRoZSBwYWdlXG4gIHNlbGVjdG9yTmFtZVBhaXJzITogU2VsZWN0b3JOYW1lUGFpcltdXG4gIGJhc2VVUkw6IHN0cmluZ1xuICB1cmxQYXR0ZXJuVG9TZWxlY3RvckRhdGE6IFVSTFBhdHRlcm5Ub1NlbGVjdG9yc1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29uZmlnKSB7XG4gICAgdGhpcy51cmxQYXR0ZXJuVG9TZWxlY3RvckRhdGEgPSBjb25maWcucGF0aHNcbiAgICB0aGlzLmJhc2VVUkwgPSBjb25maWcuYmFzZVVSTFxuICB9XG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBVUkwgYW5kIHRoZSBsaXN0IG9mIENTUyBzZWxlY3RvcnMgZm9yIHRoZSBVUkxcbiAgICogQHBhcmFtIG5ld1VSTDogVGhlIGZ1bGwgdXJsIG9mIHRoZSBjdXJyZW50IHBhZ2VcbiAgICovXG4gIHVwZGF0ZShuZXdVUkw6IHN0cmluZykge1xuICAgIHRoaXMuY3VycmVudFVSTCA9IG5ld1VSTFxuICAgIGNvbnN0IG1hdGNoaW5nVVJMUGF0dGVybnM6IHN0cmluZ1tdID0gdGhpcy5nZXRNYXRjaGluZ1BhdHRlcm5zKClcbiAgICB0aGlzLnNlbGVjdG9yTmFtZVBhaXJzID0gdGhpcy5nZXRTZWxlY3Rvck5hbWVQYWlycyhtYXRjaGluZ1VSTFBhdHRlcm5zKVxuICB9XG4gIC8qKlxuICAgKiBTZXRzIGBtYXRjaFBhdGhEYXRhYCB0byBiZSB0aGUgUGF0aERhdGEgZm9yIHRoZSBVUkwgcGF0dGVybiB3aXRoIHRoZSBjbG9zZXQgbWF0Y2ggdG8gYHRoaXMuYmFzZVVSTGBcbiAgICogYW5kIHJldHVybnMgYSBsaXN0IG9mIGFsbCBtYXRjaGVzLiBBZGRpdGlvbmFsbHksIGl0IHVwZGF0ZXMgd2hldGhlciB0aGUgY3VycmVudCBwYXRoXG4gICAqIGluY2x1ZGVzIGFuIGlkLlxuICAgKlxuICAgKiBAcmV0dXJucyBBIGxpc3Qgb2YgYWxsIHBhdHRlcm5zIGluIHRoZSBjb25maWcgdGhhdCBtYXRjaCBgYmFzZVVSTGBcbiAgICovXG5cbiAgcHJpdmF0ZSBnZXRNYXRjaGluZ1BhdHRlcm5zKCk6IHN0cmluZ1tdIHtcbiAgICBjb25zb2xlLmxvZyhcInVwZGF0aW5nIHBhZ2UgZGF0YVwiKVxuXG4gICAgLy8gR2V0IGEgbGlzdCBvZiBhbGwgdGhlIHBhdGhzIHRoYXQgbWF0Y2ggdGhlIGN1cnJlbnQgVVJMXG4gICAgY29uc3QgbWF0Y2hpbmdVUkxQYXR0ZXJuczogc3RyaW5nW10gPSBPYmplY3Qua2V5cyhcbiAgICAgIHRoaXMudXJsUGF0dGVyblRvU2VsZWN0b3JEYXRhLFxuICAgICkuZmlsdGVyKChwYXRoKSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhwYXRoKTtcbiAgICAgIGNvbnN0IHBhdHRlcm46IFVSTFBhdHRlcm4gPSBuZXcgVVJMUGF0dGVybihwYXRoLCB0aGlzLmJhc2VVUkwpXG4gICAgICBjb25zdCBtYXRjaDogYm9vbGVhbiA9IHBhdHRlcm4udGVzdCh0aGlzLmN1cnJlbnRVUkwpXG4gICAgICByZXR1cm4gbWF0Y2hcbiAgICB9KVxuXG4gICAgaWYgKG1hdGNoaW5nVVJMUGF0dGVybnMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIm5vIG1hdGNoZXMgZm91bmRcIilcbiAgICB9XG5cbiAgICByZXR1cm4gbWF0Y2hpbmdVUkxQYXR0ZXJuc1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBtYXRjaGluZ1VSTFBhdHRlcm5zOiBBIGxpc3Qgb2YgYWxsIG1hdGNoaW5nIHBhdGhzIHRvIHRoZSBjdXJyZW50IHVybFxuICAgKlxuICAgKiBAcmV0dXJucyBBIGxpc3Qgb2YgYWxsIHNlbGVjdG9ycyBmb3IgdGhlIG1hdGNoaW5nIHBhdGhzXG4gICAqL1xuXG4gIHByaXZhdGUgZ2V0U2VsZWN0b3JOYW1lUGFpcnMoXG4gICAgbWF0Y2hpbmdVUkxQYXR0ZXJuczogc3RyaW5nW10sXG4gICk6IFNlbGVjdG9yTmFtZVBhaXJbXSB7XG4gICAgbGV0IGN1cnJlbnRTZWxlY3Rvck5hbWVQYWlyczogU2VsZWN0b3JOYW1lUGFpcltdID0gW11cbiAgICBmb3IgKGNvbnN0IHVybFBhdHRlcm4gb2YgbWF0Y2hpbmdVUkxQYXR0ZXJucykge1xuICAgICAgY29uc3Qgc2VsZWN0b3JOYW1lUGFpcnM6IFNlbGVjdG9yTmFtZVBhaXJbXSA9XG4gICAgICAgIHRoaXMudXJsUGF0dGVyblRvU2VsZWN0b3JEYXRhW3VybFBhdHRlcm5dXG4gICAgICBjdXJyZW50U2VsZWN0b3JOYW1lUGFpcnMgPVxuICAgICAgICBjdXJyZW50U2VsZWN0b3JOYW1lUGFpcnMuY29uY2F0KHNlbGVjdG9yTmFtZVBhaXJzKVxuICAgIH1cbiAgICByZXR1cm4gY3VycmVudFNlbGVjdG9yTmFtZVBhaXJzXG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9jb250ZW50LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9