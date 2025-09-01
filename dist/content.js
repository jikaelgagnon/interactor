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
    ActivityType["Traversal"] = "Traversal";
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
    constructor(sourceURL, sourceDocumentTitle) {
        super(sourceURL, sourceDocumentTitle);
        this.email = null;
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
const personal_site_json_1 = __importDefault(__webpack_require__(/*! ./content/configs/personal_site.json */ "./src/content/configs/personal_site.json"));
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
history.pushState(null, document.title, location.href);
window.addEventListener('popstate', function (event) {
    history.pushState(null, document.title, location.href);
});
const personalConfigLoader = new config_1.ConfigLoader(personal_site_json_1.default, []);
new monitor_1.Monitor(personalConfigLoader);
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

/***/ "./src/content/configs/personal_site.json":
/*!************************************************!*\
  !*** ./src/content/configs/personal_site.json ***!
  \************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"baseURL":"https://jikaelgagnon.github.io","events":["click"],"paths":{"/*":[{"selector":".nav-link[href=\'/blog/\']","name":"Blog Link"}]}}');

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
            console.log("initializing Monitor for", config.baseURL);
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
            this.currentPageData.update(document.location.href);
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
        console.log("binding events");
        this.addListenersToNewMatches(); // attach to all existing elements
        // Whenever new content is loaded, attach observers to each HTML element that matches the selectors in the configs
        const observer = new MutationObserver(() => this.addListenersToNewMatches());
        // Make the mutation observer observe the entire document for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
        console.log("adding navigation listener");
        // Add an event listener to detect navigations on the page
        navigation.addEventListener("navigate", (e) => this.onNavigationDetection(e));
    }
    /**
     * Adds listeners to mutations (ie. newly rendered elements) and marks them with this.interacttionAttribute.
     * If debug mode is on, this will add a colourful border to these elements.
     */
    addListenersToNewMatches() {
        console.log("adding selectors");
        console.log("Current page data:");
        console.log(this.currentPageData);
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
        const metadata = this.extractorList.extract(this.currentPageData.currentURL, // runs for "prev page"
        sender_1.SenderMethod.NavigationDetection);
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
    isNewBaseURL(newURL) {
        console.log("checking if url updated");
        if (newURL === null) {
            console.log("new url is null");
            return false;
        }
        const currentHostname = new URL(this.currentPageData.currentURL).hostname;
        const newHostname = new URL(newURL).hostname;
        console.log("current hostname", currentHostname);
        console.log("new hostname", newHostname);
        return currentHostname !== newHostname;
    }
    /**
     * Callback that creates a payload describing the navigation that occured and sends it to the background script
     * @param navEvent - the event that triggered the callback
     */
    onNavigationDetection(navEvent) {
        const destUrl = navEvent.destination.url;
        const baseURLChange = this.isNewBaseURL(destUrl);
        let record = undefined;
        let sender = undefined;
        console.log(`before creating nav record, current URL is ${this.currentPageData.currentURL}`);
        if (baseURLChange) {
            console.log("URL base change detected. Closing program.");
            record = new dbdocument_1.DBDocument(this.currentPageData.currentURL, document.title);
            sender = sender_1.SenderMethod.CloseSession;
        }
        else if (navEvent.navigationType === "push") {
            console.log("Push event detected.");
            record = this.createNavigationRecord(activity_1.ActivityType.StateChange, navEvent);
            sender = sender_1.SenderMethod.NavigationDetection;
        }
        else if (navEvent.navigationType === "replace") {
            console.log("Replace event detected.");
            record = this.createNavigationRecord(activity_1.ActivityType.SelfLoop, navEvent);
            sender = sender_1.SenderMethod.NavigationDetection;
        }
        else if (navEvent.navigationType === "traverse") {
            console.log("Traverse event detected.");
            record = this.createNavigationRecord(activity_1.ActivityType.Traversal, navEvent);
            console.log(record);
            sender = sender_1.SenderMethod.NavigationDetection;
        }
        else {
            console.log("matched none of the above");
            console.log("event:");
            console.log(navEvent);
            console.log(navEvent.navigationType);
        }
        console.log(`after creating nav record, current URL is ${this.currentPageData.currentURL}`);
        if (destUrl) {
            this.currentPageData.update(destUrl);
        }
        console.log(`at end of on nav detect, current URL is ${this.currentPageData.currentURL}`);
        if (typeof record !== "undefined" && typeof sender !== "undefined") {
            this.sendMessageToBackground(sender, record).catch((error) => {
                console.error("Failed to send interaction data:", error);
            });
        }
        else {
            console.log("not sending due to undefined");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCxJQUFLLFlBTUo7QUFORCxXQUFLLFlBQVk7SUFDZixzQ0FBc0I7SUFDdEIsNENBQTRCO0lBQzVCLDJDQUEyQjtJQUMzQix1Q0FBdUI7SUFDdkIsNkJBQWE7QUFDZixDQUFDLEVBTkksWUFBWSw0QkFBWixZQUFZLFFBTWhCOzs7Ozs7Ozs7Ozs7OztBQ05EOztHQUVHO0FBQ0gsTUFBTSxtQkFBbUI7SUFHdkI7OztPQUdHO0lBQ0gsWUFBWSxZQUEwQixFQUFFLE9BQW1CO1FBQ3pELElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWTtRQUNoQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU87SUFDeEIsQ0FBQztDQUNGO0FBZlEsa0RBQW1COzs7Ozs7Ozs7Ozs7OztBQ0Y1QixJQUFLLFlBTUo7QUFORCxXQUFLLFlBQVk7SUFDZix3REFBd0M7SUFDeEMsOERBQThDO0lBQzlDLDREQUE0QztJQUM1Qyw4Q0FBOEI7SUFDOUIsMkJBQVc7QUFDYixDQUFDLEVBTkksWUFBWSw0QkFBWixZQUFZLFFBTWhCOzs7Ozs7Ozs7Ozs7OztBQ0xEOztHQUVHO0FBQ0gsTUFBTSxVQUFVO0lBS2QsWUFBWSxHQUFXLEVBQUUsS0FBYTtRQUNwQyxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUc7UUFDcEIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUs7SUFDbEMsQ0FBQztDQUNGO0FBeURRLGdDQUFVO0FBN0NuQjs7R0FFRztBQUVILE1BQU0sZ0JBQWlCLFNBQVEsVUFBVTtJQVN2QyxZQUNFLElBQWtCLEVBQ2xCLEtBQVksRUFDWixRQUEyQixFQUMzQixHQUFXLEVBQ1gsS0FBYTtRQUViLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSTtRQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFO1FBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUk7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRO0lBQzFCLENBQUM7Q0FDRjtBQW1Cb0IsNENBQWdCO0FBakJyQzs7R0FFRztBQUVILE1BQU0sZUFBZ0IsU0FBUSxVQUFVO0lBSXRDLFlBQVksU0FBaUIsRUFBRSxtQkFBMkI7UUFDeEQsS0FBSyxDQUFDLFNBQVMsRUFBRSxtQkFBbUIsQ0FBQztRQUZ2QyxVQUFLLEdBQWtCLElBQUk7UUFHekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRTtJQUM3QixDQUFDO0lBQ0QsUUFBUSxDQUFDLEtBQWE7UUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLO0lBQ3BCLENBQUM7Q0FDRjtBQUVzQywwQ0FBZTs7Ozs7Ozs7Ozs7Ozs7OztBQ3RFdEQsMkZBQTJDO0FBQzNDLDZKQUE0RDtBQUM1RCwwSkFBaUU7QUFDakUsMkRBQTJEO0FBQzNELCtEQUErRDtBQUMvRCx3RkFBOEQ7QUFDOUQsMkRBQTJEO0FBQzNELGtIQUE0RDtBQUc1RCxNQUFNLGlCQUFpQixHQUFHLEdBQXNCLEVBQUU7SUFDaEQscURBQXFEO0lBQ3JELE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQzVCLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUM3RCxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ2YsdUNBQXVDO1FBQ3ZDLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRTtRQUN4QyxPQUFPLENBQ0wsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDO1lBQ2QsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDO1lBQ2YsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxLQUFLLFFBQVEsQ0FDOUM7SUFDSCxDQUFDLENBQUM7SUFFRixNQUFNLE1BQU0sR0FBRyxXQUFXO1NBQ3ZCLEdBQUcsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFOztRQUNsQiw4QkFBOEI7UUFDOUIsTUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FDckMsaUNBQWlDLENBQ2I7UUFDdEIsTUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FDbkMscUNBQXFDLENBQ3RDO1FBRUQsT0FBTztZQUNMLElBQUksRUFBRSxZQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsSUFBSSxtQ0FBSSxFQUFFO1lBQ3hCLEtBQUssRUFBRSxnQkFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLFdBQVcsMENBQUUsSUFBSSxFQUFFLG1DQUFJLEVBQUU7U0FDdkM7SUFDSCxDQUFDLENBQUM7U0FDRCxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDO0lBQ3ZDLE1BQU0sUUFBUSxHQUFzQixFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7SUFDdEQsT0FBTyxRQUFRO0FBQ2pCLENBQUM7QUFFRCxNQUFNLG9CQUFvQixHQUFHLEdBQXNCLEVBQUU7SUFDbkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsQ0FBQztJQUNyRCxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUM1QixRQUFRLENBQUMsZ0JBQWdCLENBQUMsc0JBQXNCLENBQUMsQ0FDbEQsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNmLHVDQUF1QztRQUN2QyxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMscUJBQXFCLEVBQUU7UUFDeEMsT0FBTyxDQUNMLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQztZQUNkLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQztZQUNmLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsS0FBSyxRQUFRLENBQzlDO0lBQ0gsQ0FBQyxDQUFDO0lBRUYsTUFBTSxNQUFNLEdBQXNCLFdBQVc7U0FDMUMsR0FBRyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7O1FBQ2xCLHFDQUFxQztRQUNyQyxNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsYUFBYSxDQUNyQyxtQkFBbUIsQ0FDRTtRQUN2QixNQUFNLElBQUksR0FBRyxVQUFVLENBQUMsYUFBYSxDQUNuQyxxQ0FBcUMsQ0FDckM7UUFFRixPQUFPO1lBQ0wsSUFBSSxFQUFFLFlBQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxJQUFJLG1DQUFJLEVBQUU7WUFDeEIsS0FBSyxFQUFFLGdCQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsV0FBVywwQ0FBRSxJQUFJLEVBQUUsbUNBQUksRUFBRTtTQUN2QztJQUNILENBQUMsQ0FBQztTQUNELE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxFQUFFLENBQUM7SUFFdkMsOENBQThDO0lBQzlDLG9DQUFvQztJQUNwQyxNQUFNLFFBQVEsR0FBc0IsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFO0lBQ3RELE9BQU8sUUFBUTtBQUNqQixDQUFDO0FBRUQsTUFBTSxVQUFVLEdBQUc7SUFDakIsSUFBSSxzQkFBYSxDQUFDLHFCQUFZLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFLGlCQUFpQixDQUFDO0lBQzVFLElBQUksc0JBQWEsQ0FDZixxQkFBWSxDQUFDLG9CQUFvQixFQUNqQyxZQUFZLEVBQ1osb0JBQW9CLENBQ3JCO0NBQ0Y7QUFFRCxNQUFNLGNBQWMsR0FBRyxJQUFJLHFCQUFZLENBQUMsNkJBQVEsRUFBRSxVQUFVLENBQUM7QUFFN0QsSUFBSSxpQkFBTyxDQUFDLGNBQWMsQ0FBQztBQUUzQixPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2RCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLFVBQVUsS0FBSztJQUMvQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzRCxDQUFDLENBQUMsQ0FBQztBQUVILE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxxQkFBWSxDQUFDLDRCQUFjLEVBQUUsRUFBRSxDQUFDO0FBQ2pFLElBQUksaUJBQU8sQ0FBQyxvQkFBb0IsQ0FBQztBQUVqQywyQ0FBMkM7QUFDM0Msb0ZBQW9GO0FBQ3BGLGlCQUFpQjtBQUNqQix3Q0FBd0M7QUFDeEMscUJBQXFCO0FBQ3JCLFFBQVE7QUFDUix5Q0FBeUM7QUFDekMsd0RBQXdEO0FBQ3hELGVBQWU7QUFDZiwyQkFBMkI7QUFDM0IsU0FBUztBQUNULElBQUk7QUFFSiw2QkFBNkI7QUFDN0IsNkRBQTZEO0FBQzdELDhEQUE4RDtBQUM5RCxtRUFBbUU7QUFFbkUsZ0NBQWdDO0FBQ2hDLGlFQUFpRTtBQUNqRSx1RUFBdUU7Ozs7Ozs7Ozs7Ozs7O0FDMUh2RSxtSEFBNkQ7QUFtQzdELE1BQU0sYUFBYTtJQUlqQixZQUNFLFlBQTBCLEVBQzFCLFVBQWtCLEVBQ2xCLFNBQWtDO1FBRWxDLElBQUksQ0FBQyxTQUFTLEdBQUcsWUFBWTtRQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVU7UUFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTO0lBQzVCLENBQUM7Q0FDRjtBQXhDQyxzQ0FBYTtBQTBDZixNQUFNLGFBQWE7SUFHakIsWUFBWSxhQUE4QixFQUFFLEVBQUUsT0FBZTtRQUMzRCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVU7UUFDNUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPO0lBQ3hCLENBQUM7SUFFTSxPQUFPLENBQ1osVUFBa0IsRUFDbEIsU0FBdUI7UUFFdkIsT0FBTyxDQUFDLEdBQUcsQ0FDVCxrQ0FBa0MsVUFBVSxtQkFBbUIsU0FBUyxFQUFFLENBQzNFO1FBQ0QsSUFBSSxhQUFhLEdBQXNCLEVBQUU7UUFDekMsSUFBSSxDQUFDLFVBQVU7YUFDWixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUNaLE1BQU0saUJBQWlCLEdBQ3JCLENBQUMsQ0FBQyxTQUFTLElBQUksU0FBUyxJQUFJLENBQUMsQ0FBQyxTQUFTLElBQUkscUJBQVksQ0FBQyxHQUFHO1lBQzdELE1BQU0sQ0FBQyxHQUFlLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUNoRSxNQUFNLFVBQVUsR0FBWSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUM5QyxPQUFPLGlCQUFpQixJQUFJLFVBQVU7UUFDeEMsQ0FBQyxDQUFDO2FBQ0QsT0FBTyxDQUNOLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FDSixDQUFDLGFBQWEsbUNBQ1IsYUFBd0IsR0FDeEIsQ0FBQyxDQUFDLFNBQVMsRUFBYSxDQUM3QixDQUFDLENBQ0w7UUFDSCxPQUFPLGFBQWE7SUFDdEIsQ0FBQztDQUNGO0FBMUVDLHNDQUFhO0FBNEVmLE1BQU0sWUFBWTtJQUloQixZQUFZLE1BQWMsRUFBRSxnQkFBaUMsRUFBRTtRQUM3RCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU07UUFDcEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLGFBQWEsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUN2RSxDQUFDO0NBQ0Y7QUF4RkMsb0NBQVk7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNMZCw0SEFHMEM7QUFDMUMsbUdBSzZCO0FBRTdCLHNGQUFxQztBQUNyQyx5SEFBK0Q7QUFDL0QsbUhBQTZEO0FBRTdEOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsTUFBYSxPQUFPO0lBWWxCLFlBQVksWUFBMEI7O1FBK1V0Qzs7OztXQUlHO1FBRUssa0JBQWEsR0FBRyxDQUFDO1lBT3ZCLElBQUksUUFBUSxHQUF5QixJQUFJO1lBRXpDLE9BQU87Z0JBQ0wsSUFBSSxFQUFFLFNBQVMsYUFBYSxDQUFDLEdBQVc7b0JBQ3RDLFFBQVEsYUFBUixRQUFRLGNBQVIsUUFBUSxJQUFSLFFBQVEsR0FBSzt3QkFDWCxpQkFBaUIsRUFBRSxFQUFFO3dCQUNyQix3QkFBd0IsRUFBRSxDQUFDO3dCQUMzQixtQkFBbUIsRUFBRTs0QkFDbkIsU0FBUzs0QkFDVCxTQUFTOzRCQUNULFNBQVM7NEJBQ1QsU0FBUzs0QkFDVCxTQUFTOzRCQUNULFNBQVM7NEJBQ1QsU0FBUzs0QkFDVCxTQUFTOzRCQUNULFNBQVM7NEJBQ1QsU0FBUzs0QkFDVCxTQUFTOzRCQUNULFNBQVM7NEJBQ1QsU0FBUzs0QkFDVCxTQUFTOzRCQUNULFNBQVM7NEJBQ1QsU0FBUzs0QkFDVCxTQUFTOzRCQUNULFNBQVM7NEJBQ1QsU0FBUzs0QkFDVCxTQUFTOzRCQUNULFNBQVM7NEJBQ1QsU0FBUzs0QkFDVCxTQUFTOzRCQUNULFNBQVM7NEJBQ1QsU0FBUzs0QkFDVCxTQUFTOzRCQUNULFNBQVM7NEJBQ1QsU0FBUzs0QkFDVCxTQUFTOzRCQUNULFNBQVM7NEJBQ1QsU0FBUzs0QkFDVCxTQUFTOzRCQUNULFNBQVM7NEJBQ1QsU0FBUzs0QkFDVCxTQUFTOzRCQUNULFNBQVM7NEJBQ1QsU0FBUzs0QkFDVCxTQUFTOzRCQUNULFNBQVM7NEJBQ1QsU0FBUzs0QkFDVCxTQUFTOzRCQUNULFNBQVM7NEJBQ1QsU0FBUzs0QkFDVCxTQUFTOzRCQUNULFNBQVM7NEJBQ1QsU0FBUzs0QkFDVCxTQUFTOzRCQUNULFNBQVM7NEJBQ1QsU0FBUzs0QkFDVCxTQUFTOzRCQUNULFNBQVM7NEJBQ1QsU0FBUzs0QkFDVCxTQUFTOzRCQUNULFNBQVM7NEJBQ1QsU0FBUzs0QkFDVCxTQUFTOzRCQUNULFNBQVM7NEJBQ1QsU0FBUzs0QkFDVCxTQUFTOzRCQUNULFNBQVM7NEJBQ1QsU0FBUzs0QkFDVCxTQUFTOzRCQUNULFNBQVM7eUJBQ1Y7cUJBQ0Y7b0JBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO3dCQUNyQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDOzRCQUM3QixRQUFRLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLHdCQUF3QixFQUFFLENBQUM7d0JBQ25FLE9BQU8sQ0FBQyxHQUFHLENBQ1QscUJBQXFCLEdBQUcsRUFBRSxFQUMxQixVQUFVLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUM1QztvQkFDSCxDQUFDO29CQUNELE9BQU8sUUFBUSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQztnQkFDeEMsQ0FBQzthQUNGO1FBQ0gsQ0FBQyxDQUFDLEVBQUU7UUFoYkYsTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLE1BQU07UUFDbEMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLFlBQU0sQ0FBQyxNQUFNLG1DQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3JELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJO1FBQzlCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxtQkFBUSxDQUFDLE1BQU0sQ0FBQztRQUMzQyxJQUFJLENBQUMsdUJBQXVCLEdBQUcseUJBQXlCO1FBQ3hELElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDLGFBQWE7UUFDL0MsaURBQWlEO1FBQ2pELHFDQUFxQztRQUNyQyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDdkQsSUFBSSxDQUFDLHNCQUFzQixFQUFFO1FBQy9CLENBQUM7SUFDSCxDQUFDO0lBRU8sc0JBQXNCO1FBQzVCLE1BQU0sY0FBYyxHQUFHLEdBQUcsRUFBRTtZQUMxQixJQUFJLFFBQVEsQ0FBQyxlQUFlLEtBQUssU0FBUyxFQUFFLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtxQkFDckIsSUFBSSxDQUFDLEdBQUcsRUFBRTtvQkFDVCxRQUFRLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLEVBQUUsY0FBYyxDQUFDO2dCQUNsRSxDQUFDLENBQUM7cUJBQ0QsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7b0JBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxLQUFLLENBQUM7b0JBQ25ELGlEQUFpRDtvQkFDakQsUUFBUSxDQUFDLG1CQUFtQixDQUFDLGtCQUFrQixFQUFFLGNBQWMsQ0FBQztnQkFDbEUsQ0FBQyxDQUFDO1lBQ04sQ0FBQztRQUNILENBQUM7UUFFRCxJQUFJLFFBQVEsQ0FBQyxVQUFVLEtBQUssVUFBVSxFQUFFLENBQUM7WUFDdkMsY0FBYyxFQUFFLEVBQUMsK0JBQStCO1FBQ2xELENBQUM7YUFBTSxDQUFDO1lBQ04sTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7Z0JBQ25DLGNBQWMsRUFBRTtZQUNsQixDQUFDLENBQUM7UUFDSixDQUFDO1FBRUQsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLGNBQWMsQ0FBQztJQUMvRCxDQUFDO0lBRUQ7O09BRUc7SUFDVyxpQkFBaUI7O1lBQzdCLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQ25ELElBQUksQ0FBQztnQkFDSCxpRkFBaUY7Z0JBQ2pGLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixFQUFFO2dCQUM5Qiw4RkFBOEY7Z0JBQzlGLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsQ0FBQztZQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7Z0JBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQywrQkFBK0IsRUFBRSxHQUFHLENBQUM7WUFDckQsQ0FBQztRQUNILENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ1csaUJBQWlCOztZQUM3QixNQUFNLFlBQVksR0FBZSxJQUFJLDRCQUFlLENBQ2xELElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUMvQixRQUFRLENBQUMsS0FBSyxDQUNmO1lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQztZQUNqQyxNQUFNLFFBQVEsR0FBMkIsTUFBTSxJQUFJLENBQUMsdUJBQXVCLENBQ3pFLHFCQUFZLENBQUMsaUJBQWlCLEVBQzlCLFlBQVksQ0FDYjtZQUNELElBQ0UsUUFBUTtnQkFDUixTQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsTUFBTSxNQUFLLHFCQUFxQjtnQkFDMUMsUUFBUSxDQUFDLFNBQVMsRUFDbEIsQ0FBQztnQkFDRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsUUFBUSxDQUFDLFNBQVM7WUFDOUMsQ0FBQztZQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQy9ELENBQUM7S0FBQTtJQUVEOztPQUVHO0lBRUssVUFBVTtRQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDO1FBQzdCLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxFQUFDLGtDQUFrQztRQUNsRSxrSEFBa0g7UUFDbEgsTUFBTSxRQUFRLEdBQXFCLElBQUksZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQzNELElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUNoQztRQUNELHFFQUFxRTtRQUNyRSxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFDOUIsU0FBUyxFQUFFLElBQUk7WUFDZixPQUFPLEVBQUUsSUFBSTtTQUNkLENBQUM7UUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDO1FBQ3pDLDBEQUEwRDtRQUMxRCxVQUFVLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBa0IsRUFBRSxFQUFFLENBQzdELElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FDOUI7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBRUssd0JBQXdCO1FBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFO1lBQ2xFLE1BQU0sUUFBUSxHQUE0QixRQUFRLENBQUMsZ0JBQWdCLENBQ2pFLE9BQU8sZ0JBQWdCLENBQUMsUUFBUSxVQUFVLElBQUksQ0FBQyx1QkFBdUIsSUFBSSxDQUMzRTtZQUNELE1BQU0sSUFBSSxHQUFXLGdCQUFnQixDQUFDLElBQUk7WUFDMUMsS0FBSyxNQUFNLE9BQU8sSUFBSSxRQUFRLEVBQUUsQ0FBQztnQkFDL0IsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztvQkFDNUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsYUFBYSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDckUsQ0FBQztnQkFDRCxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxNQUFNLENBQUM7Z0JBRTFELEtBQUssTUFBTSxFQUFFLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7b0JBQzFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FDdEIsRUFBRSxFQUNGLENBQUMsQ0FBUSxFQUFFLEVBQUU7d0JBQ1gsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDO29CQUMvQyxDQUFDLEVBQ0QsSUFBSSxDQUNMO2dCQUNILENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUVLLHNCQUFzQixDQUM1QixZQUEwQixFQUMxQixLQUFZO1FBRVosTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQ3pDLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLHVCQUF1QjtRQUN4RCxxQkFBWSxDQUFDLG1CQUFtQixDQUNqQztRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUM7UUFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7UUFDckIsT0FBTyxJQUFJLDZCQUFnQixDQUN6QixZQUFZLEVBQ1osS0FBSyxFQUNMLFFBQVEsRUFDUixJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFDL0IsUUFBUSxDQUFDLEtBQUssQ0FDZjtJQUNILENBQUM7SUFFRDs7Ozs7O09BTUc7SUFFSyx1QkFBdUIsQ0FBQyxJQUFZLEVBQUUsS0FBWTtRQUN4RCxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDO1FBQ3pDLE1BQU0sZ0JBQWdCLEdBQVc7WUFDL0IsV0FBVyxFQUFFLElBQUk7U0FDbEI7UUFDRCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FDOUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQy9CLHFCQUFZLENBQUMsb0JBQW9CLENBQ2xDO1FBRUQsTUFBTSxRQUFRLEdBQXNCLGdDQUMvQixnQkFBZ0IsR0FDZixhQUF3QixDQUNSO1FBRXRCLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUM7UUFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7UUFFckIsT0FBTyxJQUFJLDZCQUFnQixDQUN6Qix1QkFBWSxDQUFDLFdBQVcsRUFDeEIsS0FBSyxFQUNMLFFBQVEsRUFDUixJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFDL0IsUUFBUSxDQUFDLEtBQUssQ0FDZjtJQUNILENBQUM7SUFFRDs7Ozs7O09BTUc7SUFFVyx1QkFBdUIsQ0FDbkMsWUFBMEIsRUFDMUIsT0FBbUI7OztZQUVuQixJQUFJLENBQUM7Z0JBQ0gsZ0VBQWdFO2dCQUNoRSxJQUFJLENBQUMsYUFBTSxDQUFDLE9BQU8sMENBQUUsRUFBRSxHQUFFLENBQUM7b0JBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUM7Z0JBQ2xELENBQUM7Z0JBRUQsTUFBTSxPQUFPLEdBQXdCLElBQUksK0JBQW1CLENBQzFELFlBQVksRUFDWixPQUFPLENBQ1I7Z0JBQ0QsTUFBTSxRQUFRLEdBQ1osTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUM7Z0JBRTNDLHFFQUFxRTtnQkFDckUsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFLENBQUM7b0JBQzNCLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0NBQW9DLENBQUM7Z0JBQ3JELENBQUM7Z0JBQ0QsT0FBTyxRQUFRO1lBQ2pCLENBQUM7WUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO2dCQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsNEJBQTRCLEVBQUUsS0FBSyxDQUFDO2dCQUNsRCxtRUFBbUU7Z0JBQ25FLE9BQU8sSUFBSSxFQUFDLGtCQUFrQjtZQUNoQyxDQUFDO1FBQ0gsQ0FBQztLQUFBO0lBRUQ7Ozs7T0FJRztJQUVLLHNCQUFzQixDQUM1QixPQUFnQixFQUNoQixLQUFZLEVBQ1osSUFBWTtRQUVaLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUM7UUFDekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzVELE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsT0FBTyxDQUFDO1FBQzFDLGtDQUFrQztRQUNsQyxrQ0FBa0M7UUFDbEMsTUFBTSxNQUFNLEdBQWUsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksRUFBRSxLQUFLLENBQUM7UUFDcEUsSUFBSSxDQUFDLHVCQUF1QixDQUMxQixxQkFBWSxDQUFDLG9CQUFvQixFQUNqQyxNQUFNLENBQ1AsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxFQUFFLEtBQUssQ0FBQztRQUMxRCxDQUFDLENBQUM7SUFDSixDQUFDO0lBRU8sWUFBWSxDQUFDLE1BQXFCO1FBQ3hDLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUM7UUFDdEMsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQztZQUM5QixPQUFPLEtBQUs7UUFDZCxDQUFDO1FBQ0QsTUFBTSxlQUFlLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRO1FBQ3pFLE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVE7UUFFNUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxlQUFlLENBQUM7UUFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsV0FBVyxDQUFDO1FBRXhDLE9BQU8sZUFBZSxLQUFLLFdBQVc7SUFDeEMsQ0FBQztJQUVEOzs7T0FHRztJQUNLLHFCQUFxQixDQUFDLFFBQXlCO1FBQ3JELE1BQU0sT0FBTyxHQUFrQixRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUc7UUFDdkQsTUFBTSxhQUFhLEdBQVksSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUM7UUFDekQsSUFBSSxNQUFNLEdBQTJCLFNBQVM7UUFDOUMsSUFBSSxNQUFNLEdBQTZCLFNBQVM7UUFFaEQsT0FBTyxDQUFDLEdBQUcsQ0FDVCw4Q0FBOEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsQ0FDaEY7UUFDRCxJQUFJLGFBQWEsRUFBRSxDQUFDO1lBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsNENBQTRDLENBQUM7WUFDekQsTUFBTSxHQUFHLElBQUksdUJBQVUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDO1lBQ3hFLE1BQU0sR0FBRyxxQkFBWSxDQUFDLFlBQVk7UUFDcEMsQ0FBQzthQUFNLElBQUksUUFBUSxDQUFDLGNBQWMsS0FBSyxNQUFNLEVBQUUsQ0FBQztZQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDO1lBQ25DLE1BQU0sR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsdUJBQVksQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDO1lBQ3hFLE1BQU0sR0FBRyxxQkFBWSxDQUFDLG1CQUFtQjtRQUMzQyxDQUFDO2FBQU0sSUFBSSxRQUFRLENBQUMsY0FBYyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ2pELE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUM7WUFDdEMsTUFBTSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyx1QkFBWSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUM7WUFDckUsTUFBTSxHQUFHLHFCQUFZLENBQUMsbUJBQW1CO1FBQzNDLENBQUM7YUFDSSxJQUFJLFFBQVEsQ0FBQyxjQUFjLEtBQUssVUFBVSxFQUFFLENBQUM7WUFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQztZQUN2QyxNQUFNLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLHVCQUFZLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQztZQUN0RSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUNuQixNQUFNLEdBQUcscUJBQVksQ0FBQyxtQkFBbUI7UUFDM0MsQ0FBQzthQUNJLENBQUM7WUFDSixPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDO1lBQ3hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO1lBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO1lBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQztRQUN0QyxDQUFDO1FBRUQsT0FBTyxDQUFDLEdBQUcsQ0FDVCw2Q0FBNkMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsQ0FDL0U7UUFFRCxJQUFJLE9BQU8sRUFBRSxDQUFDO1lBQ1osSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ3RDLENBQUM7UUFFRCxPQUFPLENBQUMsR0FBRyxDQUNULDJDQUEyQyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxDQUM3RTtRQUVELElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsRUFBRSxDQUFDO1lBQ25FLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQzNELE9BQU8sQ0FBQyxLQUFLLENBQUMsa0NBQWtDLEVBQUUsS0FBSyxDQUFDO1lBQzFELENBQUMsQ0FBQztRQUNKLENBQUM7YUFDRyxDQUFDO1lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQztRQUM3QyxDQUFDO0lBQ0gsQ0FBQztDQXFHRjtBQTliRCwwQkE4YkM7Ozs7Ozs7Ozs7Ozs7O0FDeGREOztHQUVHO0FBQ0gsTUFBYSxRQUFRO0lBUW5CLFlBQVksTUFBYztRQUN4QixJQUFJLENBQUMsd0JBQXdCLEdBQUcsTUFBTSxDQUFDLEtBQUs7UUFDNUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTztJQUMvQixDQUFDO0lBQ0Q7OztPQUdHO0lBQ0gsTUFBTSxDQUFDLE1BQWM7UUFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNO1FBQ3hCLE1BQU0sbUJBQW1CLEdBQWEsSUFBSSxDQUFDLG1CQUFtQixFQUFFO1FBQ2hFLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsbUJBQW1CLENBQUM7SUFDekUsQ0FBQztJQUNEOzs7Ozs7T0FNRztJQUVLLG1CQUFtQjtRQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDO1FBRWpDLHlEQUF5RDtRQUN6RCxNQUFNLG1CQUFtQixHQUFhLE1BQU0sQ0FBQyxJQUFJLENBQy9DLElBQUksQ0FBQyx3QkFBd0IsQ0FDOUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNoQixxQkFBcUI7WUFDckIsTUFBTSxPQUFPLEdBQWUsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDOUQsTUFBTSxLQUFLLEdBQVksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ3BELE9BQU8sS0FBSztRQUNkLENBQUMsQ0FBQztRQUVGLElBQUksbUJBQW1CLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUM7UUFDakMsQ0FBQztRQUVELE9BQU8sbUJBQW1CO0lBQzVCLENBQUM7SUFFRDs7OztPQUlHO0lBRUssb0JBQW9CLENBQzFCLG1CQUE2QjtRQUU3QixJQUFJLHdCQUF3QixHQUF1QixFQUFFO1FBQ3JELEtBQUssTUFBTSxVQUFVLElBQUksbUJBQW1CLEVBQUUsQ0FBQztZQUM3QyxNQUFNLGlCQUFpQixHQUNyQixJQUFJLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDO1lBQzNDLHdCQUF3QjtnQkFDdEIsd0JBQXdCLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDO1FBQ3RELENBQUM7UUFDRCxPQUFPLHdCQUF3QjtJQUNqQyxDQUFDO0NBQ0Y7QUFuRUQsNEJBbUVDOzs7Ozs7O1VDdkVEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbW1vbi9jb21tdW5pY2F0aW9uL2FjdGl2aXR5LnRzIiwid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvY29tbW9uL2NvbW11bmljYXRpb24vbWVzc2FnaW5nLnRzIiwid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvY29tbW9uL2NvbW11bmljYXRpb24vc2VuZGVyLnRzIiwid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvY29tbW9uL2RiZG9jdW1lbnQudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb250ZW50LnRzIiwid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvY29udGVudC9jb25maWcudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb250ZW50L21vbml0b3IudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb250ZW50L3BhZ2VkYXRhLnRzIiwid2VicGFjazovL2ludGVyYWN0b3Ivd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2ludGVyYWN0b3Ivd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2ludGVyYWN0b3Ivd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRGVmaW5lcyBhIGxpc3Qgb2YgdGhlIHBvc3NpYmxlIGFjdGl2aXR5IHR5cGVzIHRoYXQgY2FuIGJlIHJlY29yZGVkIGJ5IHRoZSBNb25pdG9yIGNsYXNzXG4gKi9cbmVudW0gQWN0aXZpdHlUeXBlIHtcbiAgU2VsZkxvb3AgPSBcIlNlbGYtTG9vcFwiLFxuICBTdGF0ZUNoYW5nZSA9IFwiU3RhdGUgQ2hhbmdlXCIsXG4gIEludGVyYWN0aW9uID0gXCJJbnRlcmFjdGlvblwiLFxuICBUcmF2ZXJzYWwgPSBcIlRyYXZlcnNhbFwiLFxuICBCb3RoID0gXCJCb3RoXCIsXG59XG5cbmV4cG9ydCB7IEFjdGl2aXR5VHlwZSB9XG4iLCJpbXBvcnQgeyBEQkRvY3VtZW50IH0gZnJvbSBcIi4uL2RiZG9jdW1lbnRcIlxuaW1wb3J0IHsgU2VuZGVyTWV0aG9kIH0gZnJvbSBcIi4vc2VuZGVyXCJcbmV4cG9ydCB7IE1lc3NhZ2VUb0JhY2tncm91bmQsIE1lc3NhZ2VSZXNwb25zZSB9XG4vKipcbiAqIEEgY2xhc3MgdXNlZCB0byBzZW5kIG1lc3NhZ2VzIGZyb20gdGhlIGNvbnRlbnQgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0IGluIGEgY29uc2lzdGVudCBmb3JtYXQuXG4gKi9cbmNsYXNzIE1lc3NhZ2VUb0JhY2tncm91bmQge1xuICBzZW5kZXJNZXRob2Q6IFNlbmRlck1ldGhvZFxuICBwYXlsb2FkOiBEQkRvY3VtZW50XG4gIC8qKlxuICAgKiBAcGFyYW0gc2VuZGVyTWV0aG9kIC0gZW51bSB0eXBlIG9mIHRoZSBtZXRob2Qgc2VuZGluZyB0aGUgbWVzc2FnZVxuICAgKiBAcGFyYW0gcGF5bG9hZCAtIHRoZSBkYXRhIGJlaW5nIHNlbnQgdG8gdGhlIGRhdGFiYXNlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzZW5kZXJNZXRob2Q6IFNlbmRlck1ldGhvZCwgcGF5bG9hZDogREJEb2N1bWVudCkge1xuICAgIHRoaXMuc2VuZGVyTWV0aG9kID0gc2VuZGVyTWV0aG9kXG4gICAgdGhpcy5wYXlsb2FkID0gcGF5bG9hZFxuICB9XG59XG5cbmludGVyZmFjZSBNZXNzYWdlUmVzcG9uc2Uge1xuICBzdGF0dXM6IHN0cmluZ1xuICBoaWdobGlnaHQ/OiBib29sZWFuXG59XG4iLCJlbnVtIFNlbmRlck1ldGhvZCB7XG4gIEluaXRpYWxpemVTZXNzaW9uID0gXCJJbml0aWFsaXplIFNlc3Npb25cIixcbiAgSW50ZXJhY3Rpb25EZXRlY3Rpb24gPSBcIkludGVyYWN0aW9uIERldGVjdGlvblwiLFxuICBOYXZpZ2F0aW9uRGV0ZWN0aW9uID0gXCJOYXZpZ2F0aW9uIERldGVjdGlvblwiLFxuICBDbG9zZVNlc3Npb24gPSBcIkNsb3NlIFNlc3Npb25cIixcbiAgQW55ID0gXCJBbnlcIixcbn1cbmV4cG9ydCB7IFNlbmRlck1ldGhvZCB9XG4iLCJpbXBvcnQgeyBBY3Rpdml0eVR5cGUgfSBmcm9tIFwiLi9jb21tdW5pY2F0aW9uL2FjdGl2aXR5XCJcbi8qKlxuICogQSBjbGFzcyBkZWZpbmluZyBkb2N1bWVudHMgdGhhdCBhcmUgc2VudCB0byB0aGUgZGF0YWJhc2UgZnJvbSB0aGUgY29udGVudCBzY3JpcHRcbiAqL1xuY2xhc3MgREJEb2N1bWVudCB7XG4gIC8vIFVSTCBhdCB3aGljaHQgdGhlIGV2ZW50IHdhcyBjcmVhdGVkXG4gIHNvdXJjZVVSTDogc3RyaW5nXG4gIHNvdXJjZURvY3VtZW50VGl0bGU6IHN0cmluZ1xuXG4gIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCB0aXRsZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zb3VyY2VVUkwgPSB1cmxcbiAgICB0aGlzLnNvdXJjZURvY3VtZW50VGl0bGUgPSB0aXRsZVxuICB9XG59XG5cbmludGVyZmFjZSBFeHRyYWN0ZWRNZXRhZGF0YU9iamVjdCB7XG4gIFtrZXk6IHN0cmluZ106IEV4dHJhY3RlZE1ldGFkYXRhXG59XG5cbnR5cGUgRXh0cmFjdGVkTWV0YWRhdGEgPVxuICB8IHN0cmluZ1xuICB8IEV4dHJhY3RlZE1ldGFkYXRhW11cbiAgfCBFeHRyYWN0ZWRNZXRhZGF0YU9iamVjdFxuICB8IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gLy8gZXhwbGljaXRseSBhbGxvdyBvYmplY3RzIHdpdGggc3RyaW5nIHZhbHVlc1xuXG4vKipcbiAqIEEgY2hpbGQgb2YgREJEb2N1bWVudCB0aGF0IHJlcHJlc2VudHMgYWN0aXZpdGllc1xuICovXG5cbmNsYXNzIEFjdGl2aXR5RG9jdW1lbnQgZXh0ZW5kcyBEQkRvY3VtZW50IHtcbiAgLy8gVGhlIHR5cGUgb2YgYWN0aXZpdHkgYmVpbmcgbG9nZ2VkLiBFaXRoZXIgXCJzdGF0ZV9jaGFnZVwiLCBcInNlbGZfbG9vcFwiLCBvciBcImludGVyYWN0aW9uXCJcbiAgYWN0aXZpdHlUeXBlOiBBY3Rpdml0eVR5cGUgfCBzdHJpbmdcbiAgLy8gVGltZXN0YW1wIGZvciB3aGVuIHRoZSBkb2N1bWVudCB3YXMgY3JlYXRlZFxuICBjcmVhdGVkQXQ6IERhdGUgfCBzdHJpbmdcbiAgLy8gRXZlbnQgdHlwZSAoZWcuIGNsaWNrLCBzY3JvbGwsIGV0Yy4uLilcbiAgZXZlbnRUeXBlOiBzdHJpbmdcbiAgLy8gTWV0YWRhdGEgYWJvdXQgdGhlIGV2ZW50XG4gIG1ldGFkYXRhPzogRXh0cmFjdGVkTWV0YWRhdGFcbiAgY29uc3RydWN0b3IoXG4gICAgdHlwZTogQWN0aXZpdHlUeXBlLFxuICAgIGV2ZW50OiBFdmVudCxcbiAgICBtZXRhZGF0YTogRXh0cmFjdGVkTWV0YWRhdGEsXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgdGl0bGU6IHN0cmluZyxcbiAgKSB7XG4gICAgc3VwZXIodXJsLCB0aXRsZSlcbiAgICB0aGlzLmFjdGl2aXR5VHlwZSA9IHR5cGVcbiAgICB0aGlzLmNyZWF0ZWRBdCA9IG5ldyBEYXRlKClcbiAgICB0aGlzLmV2ZW50VHlwZSA9IGV2ZW50LnR5cGVcbiAgICB0aGlzLm1ldGFkYXRhID0gbWV0YWRhdGFcbiAgfVxufVxuXG4vKipcbiAqIEEgY2hpbGQgb2YgREJEb2N1bWVudCB0aGF0IHJlcHJlc2VudHMgdGhlIHN0YXJ0IG9mIGEgc2Vzc2lvblxuICovXG5cbmNsYXNzIFNlc3Npb25Eb2N1bWVudCBleHRlbmRzIERCRG9jdW1lbnQge1xuICBzdGFydFRpbWU6IERhdGUgfCBudWxsXG4gIGVuZFRpbWU/OiBEYXRlIHwgbnVsbFxuICBlbWFpbDogc3RyaW5nIHwgbnVsbCA9IG51bGxcbiAgY29uc3RydWN0b3Ioc291cmNlVVJMOiBzdHJpbmcsIHNvdXJjZURvY3VtZW50VGl0bGU6IHN0cmluZykge1xuICAgIHN1cGVyKHNvdXJjZVVSTCwgc291cmNlRG9jdW1lbnRUaXRsZSlcbiAgICB0aGlzLnN0YXJ0VGltZSA9IG5ldyBEYXRlKClcbiAgfVxuICBzZXRFbWFpbChlbWFpbDogc3RyaW5nKSB7XG4gICAgdGhpcy5lbWFpbCA9IGVtYWlsXG4gIH1cbn1cblxuZXhwb3J0IHsgREJEb2N1bWVudCwgQWN0aXZpdHlEb2N1bWVudCwgU2Vzc2lvbkRvY3VtZW50LCBFeHRyYWN0ZWRNZXRhZGF0YSB9XG4iLCJpbXBvcnQgeyBNb25pdG9yIH0gZnJvbSBcIi4vY29udGVudC9tb25pdG9yXCJcbmltcG9ydCB5dENvbmZpZyBmcm9tIFwiLi9jb250ZW50L2NvbmZpZ3MveW91dHViZV9jb25maWcuanNvblwiXG5pbXBvcnQgcGVyc29uYWxDb25maWcgZnJvbSBcIi4vY29udGVudC9jb25maWdzL3BlcnNvbmFsX3NpdGUuanNvblwiXG4vLyBpbXBvcnQgdGlrdG9rQ29uZmlnIGZyb20gJy4vY29uZmlncy90aWt0b2tfY29uZmlnLmpzb24nO1xuLy8gaW1wb3J0IGxpbmtlZGluQ29uZmlnIGZyb20gJy4vY29uZmlncy9saW5rZWRpbl9jb25maWcuanNvbic7XG5pbXBvcnQgeyBDb25maWdMb2FkZXIsIEV4dHJhY3RvckRhdGEgfSBmcm9tIFwiLi9jb250ZW50L2NvbmZpZ1wiXG4vLyBpbXBvcnQgeyBBY3Rpdml0eVR5cGUgfSBmcm9tIFwiLi9jb21tdW5pY2F0aW9uL2FjdGl2aXR5XCI7XG5pbXBvcnQgeyBTZW5kZXJNZXRob2QgfSBmcm9tIFwiLi9jb21tb24vY29tbXVuaWNhdGlvbi9zZW5kZXJcIlxuaW1wb3J0IHsgRXh0cmFjdGVkTWV0YWRhdGEgfSBmcm9tIFwiLi9jb21tb24vZGJkb2N1bWVudFwiXG5cbmNvbnN0IGdldEhvbWVwYWdlVmlkZW9zID0gKCk6IEV4dHJhY3RlZE1ldGFkYXRhID0+IHtcbiAgLy8gY29uc29sZS5sb2coXCItLS0tIEVYVFJBQ1RJTkcgSE9NRVBBR0UgTElOS1MgLS0tXCIpO1xuICBjb25zdCBjb250ZW50RGl2cyA9IEFycmF5LmZyb20oXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNjb250ZW50Lnl0ZC1yaWNoLWl0ZW0tcmVuZGVyZXJcIiksXG4gICkuZmlsdGVyKChkaXYpID0+IHtcbiAgICAvLyBDaGVjayBpZiBlbGVtZW50IGlzIGFjdHVhbGx5IHZpc2libGVcbiAgICBjb25zdCByZWN0ID0gZGl2LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgcmV0dXJuIChcbiAgICAgIHJlY3Qud2lkdGggPiAwICYmXG4gICAgICByZWN0LmhlaWdodCA+IDAgJiZcbiAgICAgIGdldENvbXB1dGVkU3R5bGUoZGl2KS52aXNpYmlsaXR5ICE9PSBcImhpZGRlblwiXG4gICAgKVxuICB9KVxuXG4gIGNvbnN0IHZpZGVvcyA9IGNvbnRlbnREaXZzXG4gICAgLm1hcCgoY29udGVudERpdikgPT4ge1xuICAgICAgLy8gR2V0IHRoZSBkaXJlY3QgYW5jaG9yIGNoaWxkXG4gICAgICBjb25zdCBhbmNob3IgPSBjb250ZW50RGl2LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIFwiOnNjb3BlID4geXQtbG9ja3VwLXZpZXctbW9kZWwgYVwiLFxuICAgICAgKSBhcyBIVE1MQW5jaG9yRWxlbWVudFxuICAgICAgY29uc3Qgc3BhbiA9IGNvbnRlbnREaXYucXVlcnlTZWxlY3RvcihcbiAgICAgICAgXCJoMyBhIHNwYW4ueXQtY29yZS1hdHRyaWJ1dGVkLXN0cmluZ1wiLFxuICAgICAgKVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBsaW5rOiBhbmNob3I/LmhyZWYgPz8gXCJcIixcbiAgICAgICAgdGl0bGU6IHNwYW4/LnRleHRDb250ZW50Py50cmltKCkgPz8gXCJcIixcbiAgICAgIH1cbiAgICB9KVxuICAgIC5maWx0ZXIoKHZpZGVvKSA9PiB2aWRlby5saW5rICE9PSBcIlwiKVxuICBjb25zdCBtZXRhZGF0YTogRXh0cmFjdGVkTWV0YWRhdGEgPSB7IHZpZGVvczogdmlkZW9zIH1cbiAgcmV0dXJuIG1ldGFkYXRhXG59XG5cbmNvbnN0IGdldFJlY29tbWVuZGVkVmlkZW9zID0gKCk6IEV4dHJhY3RlZE1ldGFkYXRhID0+IHtcbiAgY29uc29sZS5sb2coXCItLS0tIEVYVFJBQ1RJTkcgUkVDT01NRU5ERUQgTElOS1MgLS0tLVwiKVxuICBjb25zdCBjb250ZW50RGl2cyA9IEFycmF5LmZyb20oXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInl0LWxvY2t1cC12aWV3LW1vZGVsXCIpLFxuICApLmZpbHRlcigoZGl2KSA9PiB7XG4gICAgLy8gQ2hlY2sgaWYgZWxlbWVudCBpcyBhY3R1YWxseSB2aXNpYmxlXG4gICAgY29uc3QgcmVjdCA9IGRpdi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIHJldHVybiAoXG4gICAgICByZWN0LndpZHRoID4gMCAmJlxuICAgICAgcmVjdC5oZWlnaHQgPiAwICYmXG4gICAgICBnZXRDb21wdXRlZFN0eWxlKGRpdikudmlzaWJpbGl0eSAhPT0gXCJoaWRkZW5cIlxuICAgIClcbiAgfSlcblxuICBjb25zdCB2aWRlb3M6IEV4dHJhY3RlZE1ldGFkYXRhID0gY29udGVudERpdnNcbiAgICAubWFwKChjb250ZW50RGl2KSA9PiB7XG4gICAgICAvLyBHZXQgdGhlIGFuY2hvciB3aXRoIHRoZSB2aWRlbyBsaW5rXG4gICAgICBjb25zdCBhbmNob3IgPSBjb250ZW50RGl2LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICdhW2hyZWZePVwiL3dhdGNoXCJdJyxcbiAgICAgICkhIGFzIEhUTUxBbmNob3JFbGVtZW50XG4gICAgICBjb25zdCBzcGFuID0gY29udGVudERpdi5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBcImgzIGEgc3Bhbi55dC1jb3JlLWF0dHJpYnV0ZWQtc3RyaW5nXCIsXG4gICAgICApIVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBsaW5rOiBhbmNob3I/LmhyZWYgPz8gXCJcIixcbiAgICAgICAgdGl0bGU6IHNwYW4/LnRleHRDb250ZW50Py50cmltKCkgPz8gXCJcIixcbiAgICAgIH1cbiAgICB9KVxuICAgIC5maWx0ZXIoKHZpZGVvKSA9PiB2aWRlby5saW5rICE9PSBcIlwiKVxuXG4gIC8vIGNvbnNvbGUubG9nKFwiUHJpbnRpbmcgdGhlIGZpcnN0IDUgdmlkZW9zXCIpO1xuICAvLyBjb25zb2xlLnRhYmxlKHZpZGVvcy5zbGljZSgwLDUpKTtcbiAgY29uc3QgbWV0YWRhdGE6IEV4dHJhY3RlZE1ldGFkYXRhID0geyB2aWRlb3M6IHZpZGVvcyB9XG4gIHJldHVybiBtZXRhZGF0YVxufVxuXG5jb25zdCBleHRyYWN0b3JzID0gW1xuICBuZXcgRXh0cmFjdG9yRGF0YShTZW5kZXJNZXRob2QuSW50ZXJhY3Rpb25EZXRlY3Rpb24sIFwiL1wiLCBnZXRIb21lcGFnZVZpZGVvcyksXG4gIG5ldyBFeHRyYWN0b3JEYXRhKFxuICAgIFNlbmRlck1ldGhvZC5JbnRlcmFjdGlvbkRldGVjdGlvbixcbiAgICBcIi93YXRjaD92PSpcIixcbiAgICBnZXRSZWNvbW1lbmRlZFZpZGVvcyxcbiAgKSxcbl1cblxuY29uc3QgeXRDb25maWdMb2FkZXIgPSBuZXcgQ29uZmlnTG9hZGVyKHl0Q29uZmlnLCBleHRyYWN0b3JzKVxuXG5uZXcgTW9uaXRvcih5dENvbmZpZ0xvYWRlcilcblxuaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgZG9jdW1lbnQudGl0bGUsIGxvY2F0aW9uLmhyZWYpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgZG9jdW1lbnQudGl0bGUsIGxvY2F0aW9uLmhyZWYpO1xufSk7XG5cbmNvbnN0IHBlcnNvbmFsQ29uZmlnTG9hZGVyID0gbmV3IENvbmZpZ0xvYWRlcihwZXJzb25hbENvbmZpZywgW10pXG5uZXcgTW9uaXRvcihwZXJzb25hbENvbmZpZ0xvYWRlcilcblxuLy8gY29uc3QgdGlrdG9rSURTZWxlY3RvciA9ICgpOiBvYmplY3QgPT4ge1xuLy8gICAgIGxldCB2aWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LnhncGxheWVyLWNvbnRhaW5lci50aWt0b2std2ViLXBsYXllclwiKTtcbi8vICAgICBpZiAoIXZpZCl7XG4vLyAgICAgICAgIGNvbnNvbGUubG9nKFwibm8gdXJsIGZvdW5kIVwiKTtcbi8vICAgICAgICAgcmV0dXJuIHt9O1xuLy8gICAgIH1cbi8vICAgICBsZXQgaWQgPSB2aWQuaWQuc3BsaXQoXCItXCIpLmF0KC0xKTtcbi8vICAgICBsZXQgdXJsID0gYGh0dHBzOi8vdGlrdG9rLmNvbS9zaGFyZS92aWRlby8ke2lkfWA7XG4vLyAgICAgcmV0dXJuIHtcbi8vICAgICAgICAgXCJ1bmlxdWVVUkxcIjogdXJsXG4vLyAgICAgfTtcbi8vIH1cblxuLy8gY29uc29sZS5sb2codGlrdG9rQ29uZmlnKTtcbi8vIGNvbnN0IHRpa3Rva0NvbmZpZ0xvYWRlciA9IG5ldyBDb25maWdMb2FkZXIodGlrdG9rQ29uZmlnKTtcbi8vIHRpa3Rva0NvbmZpZ0xvYWRlci5pbmplY3RFeHRyYWN0b3IoXCIvKlwiLCB0aWt0b2tJRFNlbGVjdG9yKTtcbi8vIGNvbnN0IHRpa3Rva0ludGVyYWN0b3IgPSBuZXcgTW9uaXRvcih0aWt0b2tDb25maWdMb2FkZXIuY29uZmlnKTtcblxuLy8gLy8gY29uc29sZS5sb2codGlrdG9rQ29uZmlnKTtcbi8vIGNvbnN0IGxpbmtlZGluQ29uZmlnTG9hZGVyID0gbmV3IENvbmZpZ0xvYWRlcihsaW5rZWRpbkNvbmZpZyk7XG4vLyBjb25zdCBsaW5rZWRpbkludGVyYWN0b3IgPSBuZXcgTW9uaXRvcihsaW5rZWRpbkNvbmZpZ0xvYWRlci5jb25maWcpO1xuIiwiaW1wb3J0IHsgU2VuZGVyTWV0aG9kIH0gZnJvbSBcIi4uL2NvbW1vbi9jb21tdW5pY2F0aW9uL3NlbmRlclwiXG5pbXBvcnQgeyBFeHRyYWN0ZWRNZXRhZGF0YSB9IGZyb20gXCIuLi9jb21tb24vZGJkb2N1bWVudFwiXG5cbmV4cG9ydCB7XG4gIENvbmZpZyxcbiAgQ29uZmlnTG9hZGVyLFxuICBVUkxQYXR0ZXJuVG9TZWxlY3RvcnMsXG4gIFNlbGVjdG9yTmFtZVBhaXIsXG4gIEV4dHJhY3RvckRhdGEsXG4gIEV4dHJhY3Rvckxpc3QsXG59XG5cbmludGVyZmFjZSBTZWxlY3Rvck5hbWVQYWlyIHtcbiAgc2VsZWN0b3I6IHN0cmluZ1xuICBuYW1lOiBzdHJpbmdcbn1cbnR5cGUgVVJMUGF0dGVyblRvU2VsZWN0b3JzID0gUmVjb3JkPHN0cmluZywgU2VsZWN0b3JOYW1lUGFpcltdPlxuXG5pbnRlcmZhY2UgQ29uZmlnIHtcbiAgLyoqXG4gICAqIEFuIGludGVyZmFjZSB0aGF0IGNvbnRhaW5zIGFsbCB0aGUgZGF0YSByZXF1aXJlZCB0byBpbnN0YW50aWF0ZSBhIE1vbml0b3IuXG4gICAqL1xuICAvLyBUaGUgYmFzZSBVUkwgdGhhdCB0aGUgbW9uaXRvciBzaG91bGQgc3RhcnQgYXRcbiAgYmFzZVVSTDogc3RyaW5nXG4gIC8vIEEgbWFwcGluZyBvZiBVUkwgcGF0dGVybnMgdG8gcGF0aCBkYXRhLiBUaGUgVVJMIFBhdHRlcm4gc2hvdWxkIGZvbGxvdyB0aGVcbiAgLy8gVVJMIFBhdHRlcm4gQVBJIHN5bnRheC4gVGhlc2UgYXJlIGFwcGVuZGVkIHRvIHRoZSBiYXNlVVJMIHdoZW4gY2hlY2tpbmcgZm9yIG1hdGNoZXNcbiAgLy8gRXg6IGJhc2VVUkw6IHd3dy55b3V0dWJlLmNvbSwgcGF0aDogL3Nob3J0cy86aWQgLT4gd3d3LnlvdXR1YmUuY29tL3Nob3J0cy86aWRcbiAgcGF0aHM6IFVSTFBhdHRlcm5Ub1NlbGVjdG9yc1xuICAvLyBJbmRpY2F0ZXMgd2hldGhlciB0aGUgTW9uaXRvciBzaG91bGQgYmUgaW4gZGVidWcgbW9kZS4gSWYgdHJ1ZSwgYWRkIGNvbG91cmVkIGJveGVzXG4gIC8vIGFyb3VuZCBzZWxlY3RlZCBIVE1MIGVsZW1lbnRzXG4gIGRlYnVnPzogYm9vbGVhblxuICAvLyBBIGxpc3Qgb2YgZXZlbnQgdHlwZXMgdG8gbW9uaXRvci4gQnkgZGVmYXVsdCwgdGhpcyBpcyBqdXN0IFtcImNsaWNrXCJdXG4gIGV2ZW50cz86IHN0cmluZ1tdXG59XG5cbmNsYXNzIEV4dHJhY3RvckRhdGEge1xuICBldmVudFR5cGU6IFNlbmRlck1ldGhvZFxuICB1cmxQYXR0ZXJuOiBzdHJpbmdcbiAgZXh0cmFjdG9yOiAoKSA9PiBFeHRyYWN0ZWRNZXRhZGF0YVxuICBjb25zdHJ1Y3RvcihcbiAgICBhY3Rpdml0eVR5cGU6IFNlbmRlck1ldGhvZCxcbiAgICB1cmxQYXR0ZXJuOiBzdHJpbmcsXG4gICAgZXh0cmFjdG9yOiAoKSA9PiBFeHRyYWN0ZWRNZXRhZGF0YSxcbiAgKSB7XG4gICAgdGhpcy5ldmVudFR5cGUgPSBhY3Rpdml0eVR5cGVcbiAgICB0aGlzLnVybFBhdHRlcm4gPSB1cmxQYXR0ZXJuXG4gICAgdGhpcy5leHRyYWN0b3IgPSBleHRyYWN0b3JcbiAgfVxufVxuXG5jbGFzcyBFeHRyYWN0b3JMaXN0IHtcbiAgcHJpdmF0ZSBleHRyYWN0b3JzOiBFeHRyYWN0b3JEYXRhW11cbiAgcHJpdmF0ZSBiYXNlVVJMOiBzdHJpbmdcbiAgY29uc3RydWN0b3IoZXh0cmFjdG9yczogRXh0cmFjdG9yRGF0YVtdID0gW10sIGJhc2VVUkw6IHN0cmluZykge1xuICAgIHRoaXMuZXh0cmFjdG9ycyA9IGV4dHJhY3RvcnNcbiAgICB0aGlzLmJhc2VVUkwgPSBiYXNlVVJMXG4gIH1cblxuICBwdWJsaWMgZXh0cmFjdChcbiAgICBjdXJyZW50VVJMOiBzdHJpbmcsXG4gICAgZXZlbnRUeXBlOiBTZW5kZXJNZXRob2QsXG4gICk6IEV4dHJhY3RlZE1ldGFkYXRhIHtcbiAgICBjb25zb2xlLmxvZyhcbiAgICAgIGBBdHRlbXB0aW5nIGV4dHJhY3Rpb24gZm9yIHVybDogJHtjdXJyZW50VVJMfSBhbmQgZXZlbnQgdHlwZSAke2V2ZW50VHlwZX1gLFxuICAgIClcbiAgICBsZXQgZXh0cmFjdGVkRGF0YTogRXh0cmFjdGVkTWV0YWRhdGEgPSB7fVxuICAgIHRoaXMuZXh0cmFjdG9yc1xuICAgICAgLmZpbHRlcigoZSkgPT4ge1xuICAgICAgICBjb25zdCBpc0NvcnJlY3RBY3Rpdml0eTogYm9vbGVhbiA9XG4gICAgICAgICAgZS5ldmVudFR5cGUgPT0gZXZlbnRUeXBlIHx8IGUuZXZlbnRUeXBlID09IFNlbmRlck1ldGhvZC5BbnlcbiAgICAgICAgY29uc3QgcDogVVJMUGF0dGVybiA9IG5ldyBVUkxQYXR0ZXJuKGUudXJsUGF0dGVybiwgdGhpcy5iYXNlVVJMKVxuICAgICAgICBjb25zdCBpc1VSTE1hdGNoOiBib29sZWFuID0gcC50ZXN0KGN1cnJlbnRVUkwpXG4gICAgICAgIHJldHVybiBpc0NvcnJlY3RBY3Rpdml0eSAmJiBpc1VSTE1hdGNoXG4gICAgICB9KVxuICAgICAgLmZvckVhY2goXG4gICAgICAgIChlKSA9PlxuICAgICAgICAgIChleHRyYWN0ZWREYXRhID0ge1xuICAgICAgICAgICAgLi4uKGV4dHJhY3RlZERhdGEgYXMgb2JqZWN0KSxcbiAgICAgICAgICAgIC4uLihlLmV4dHJhY3RvcigpIGFzIG9iamVjdCksXG4gICAgICAgICAgfSksXG4gICAgICApXG4gICAgcmV0dXJuIGV4dHJhY3RlZERhdGFcbiAgfVxufVxuXG5jbGFzcyBDb25maWdMb2FkZXIge1xuICBwdWJsaWMgY29uZmlnOiBDb25maWdcbiAgcHVibGljIGV4dHJhY3Rvckxpc3Q6IEV4dHJhY3Rvckxpc3RcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IENvbmZpZywgZXh0cmFjdG9yTGlzdDogRXh0cmFjdG9yRGF0YVtdID0gW10pIHtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZ1xuICAgIHRoaXMuZXh0cmFjdG9yTGlzdCA9IG5ldyBFeHRyYWN0b3JMaXN0KGV4dHJhY3Rvckxpc3QsIGNvbmZpZy5iYXNlVVJMKVxuICB9XG59XG4iLCJpbXBvcnQge1xuICBNZXNzYWdlVG9CYWNrZ3JvdW5kLFxuICBNZXNzYWdlUmVzcG9uc2UsXG59IGZyb20gXCIuLi9jb21tb24vY29tbXVuaWNhdGlvbi9tZXNzYWdpbmdcIlxuaW1wb3J0IHtcbiAgREJEb2N1bWVudCxcbiAgQWN0aXZpdHlEb2N1bWVudCxcbiAgU2Vzc2lvbkRvY3VtZW50LFxuICBFeHRyYWN0ZWRNZXRhZGF0YSxcbn0gZnJvbSBcIi4uL2NvbW1vbi9kYmRvY3VtZW50XCJcbmltcG9ydCB7IENvbmZpZ0xvYWRlciwgRXh0cmFjdG9yTGlzdCB9IGZyb20gXCIuL2NvbmZpZ1wiXG5pbXBvcnQgeyBQYWdlRGF0YSB9IGZyb20gXCIuL3BhZ2VkYXRhXCJcbmltcG9ydCB7IEFjdGl2aXR5VHlwZSB9IGZyb20gXCIuLi9jb21tb24vY29tbXVuaWNhdGlvbi9hY3Rpdml0eVwiXG5pbXBvcnQgeyBTZW5kZXJNZXRob2QgfSBmcm9tIFwiLi4vY29tbW9uL2NvbW11bmljYXRpb24vc2VuZGVyXCJcblxuLyoqXG4gKiBUaGlzIGNsYXNzIHJlYWRzIGZyb20gYSBwcm92aWRlZCBDb25maWcgb2JqZWN0IGFuZCBhdHRhY2hlcyBsaXN0ZW5lcnMgdG8gdGhlIGVsZW1lbnRzIHNwZWNpZmllZCBpbiB0aGUgc2VsZWN0b3JzLlxuICogV2hlbiB0aGVzZSBlbGVtZW50cyBhcmUgaW50ZXJhY3RlZCB3aXRoLCBvciB3aGVuIGEgbmF2aWdhdGlvbiBvY2N1cnMsIGEgZG9jdW1lbnQgaXMgc2VudCB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHRcbiAqIHRvIGJlIGFwcGVuZGVkIHRvIHRoZSBkYXRhYmFzZS4gVGhpcyBjbGFzcyBpcyBpbnN0YW50aWF0ZWQgaW4gY29udGVudC50cy5cbiAqXG4gKiBAcGFyYW0gaW50ZXJhY3Rpb25FdmVudHMgLSBBIGxpc3Qgb2YgdGhlIHR5cGUgb2YgZXZlbnRzIHdlIHdhbnQgdG8gbW9uaXRvciBhcyBpbnRlcmFjdGlvbnMgKGVnLiBjbGljaywgc2Nyb2xsLCBldGMuKS4gRGVmYXVsdCBpcyBjbGlja1xuICogQHBhcmFtIGRlYnVnIC0gSWYgdHJ1ZSwgaGlnaGxpZ2h0IGFsbCBzZWxlY3RlZCBIVE1MIGVsZW1lbnRzIHdpdGggY29sb3VyZWQgYm94ZXNcbiAqIEBwYXJhbSBwYXRocyAtIEFuIG9iamVjdCBtYXBwaW5nIHBhdGggcGF0dGVybnMgdG8gdGhlaXIgY29ycmVzcG9uZGluZyBDU1Mgc2VsZWN0b3JzIFBhdGggcGF0dGVybnMgYXJlIGNvbnNpc3RlbnQgd2l0aCB0aGUgIFVSTCBQYXR0ZXJuIEFQSSBTeW50YXg6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9VUkxfUGF0dGVybl9BUElcbiAqIEBwYXJhbSBiYXNlVVJMIC0gQmFzZSB1cmwgZm9yIHRoZSBwYWdlIChlZy4gd3d3LnlvdXR1YmUuY29tKS4gQWxsIHBhdGhzIGFyZSBhcHBlbmRlZCB0byB0aGlzIHdoZW4gbWF0Y2hpbmcgVVJsc1xuICogQHBhcmFtIGN1cnJlbnRQYWdlRGF0YSAtIENvbnRhaW5zIGRhdGEgcmVsZXZhbnQgdG8gdGhlIGN1cnJlbnQgcGFnZS5cbiAqIEBwYXJhbSBpbnRlcmFjdGlvbkF0dHJpYnV0ZSAtIEF0dHJpYnV0ZSBhZGRlZCB0byBhbGwgZWxlbWVudHMgYmVpbmcgbW9uaXRvcmVkXG4gKi9cbmV4cG9ydCBjbGFzcyBNb25pdG9yIHtcbiAgLy8gQSBsaXN0IG9mIHRoZSB0eXBlIG9mIGV2ZW50cyB3ZSB3YW50IHRvIG1vbml0b3IgYXMgaW50ZXJhY3Rpb25zIChlZy4gY2xpY2ssIHNjcm9sbCwgZXRjLikuIERlZmF1bHQgaXMgY2xpY2tcbiAgaHRtbEV2ZW50c1RvTW9uaXRvcjogc3RyaW5nW11cbiAgLy8gSWYgdHJ1ZSwgaGlnaGxpZ2h0IGFsbCBzZWxlY3RlZCBIVE1MIGVsZW1lbnRzIHdpdGggY29sb3VyZWQgYm94ZXNcbiAgZW5hYmxlSGlnaGxpZ2h0aW5nOiBib29sZWFuXG4gIC8vIENvbnRhaW5zIGRhdGEgcmVsZXZhbnQgdG8gdGhlIGN1cnJlbnQgcGFnZS5cbiAgY3VycmVudFBhZ2VEYXRhOiBQYWdlRGF0YVxuICAvLyBBdHRyaWJ1dGUgYWRkZWQgdG8gYWxsIGVsZW1lbnRzIGJlaW5nIG1vbml0b3JlZFxuICBodG1sTW9uaXRvcmluZ0F0dHJpYnV0ZTogc3RyaW5nXG5cbiAgZXh0cmFjdG9yTGlzdDogRXh0cmFjdG9yTGlzdFxuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZ0xvYWRlcjogQ29uZmlnTG9hZGVyKSB7XG4gICAgY29uc3QgY29uZmlnID0gY29uZmlnTG9hZGVyLmNvbmZpZ1xuICAgIHRoaXMuaHRtbEV2ZW50c1RvTW9uaXRvciA9IGNvbmZpZy5ldmVudHMgPz8gW1wiY2xpY2tcIl1cbiAgICB0aGlzLmVuYWJsZUhpZ2hsaWdodGluZyA9IHRydWVcbiAgICB0aGlzLmN1cnJlbnRQYWdlRGF0YSA9IG5ldyBQYWdlRGF0YShjb25maWcpXG4gICAgdGhpcy5odG1sTW9uaXRvcmluZ0F0dHJpYnV0ZSA9IFwibW9uaXRvcmluZy1pbnRlcmFjdGlvbnNcIlxuICAgIHRoaXMuZXh0cmFjdG9yTGlzdCA9IGNvbmZpZ0xvYWRlci5leHRyYWN0b3JMaXN0XG4gICAgLy8gT25seSBpbml0aWFsaXplIG1vbml0b3IgaWYgdGhlIFVSTCBtYXRjaGVzIGFuZFxuICAgIC8vIHRoZSBjb250ZW50IG9mIHRoZSBwYWdlIGlzIHZpc2libGVcbiAgICBpZiAod2luZG93LmxvY2F0aW9uLm9yaWdpbiA9PT0gY29uZmlnLmJhc2VVUkwpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiaW5pdGlhbGl6aW5nIE1vbml0b3IgZm9yXCIsIGNvbmZpZy5iYXNlVVJMKVxuICAgICAgdGhpcy5pbnRpdGlhbGl6ZVdoZW5WaXNpYmxlKClcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGludGl0aWFsaXplV2hlblZpc2libGUoKTogdm9pZCB7XG4gICAgY29uc3QgcnVuV2hlblZpc2libGUgPSAoKSA9PiB7XG4gICAgICBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSBcInZpc2libGVcIikge1xuICAgICAgICB0aGlzLmluaXRpYWxpemVNb25pdG9yKClcbiAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidmlzaWJpbGl0eWNoYW5nZVwiLCBydW5XaGVuVmlzaWJsZSlcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBpbml0aWFsaXppbmcgbW9uaXRvcjpcIiwgZXJyb3IpXG4gICAgICAgICAgICAvLyBTdGlsbCByZW1vdmUgbGlzdGVuZXIgZXZlbiBpZiB0aGVyZSdzIGFuIGVycm9yXG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidmlzaWJpbGl0eWNoYW5nZVwiLCBydW5XaGVuVmlzaWJsZSlcbiAgICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIpIHtcbiAgICAgIHJ1bldoZW5WaXNpYmxlKCkgLy8gVGhpcyB3aWxsIG5vdyBiZSBzeW5jaHJvbm91c1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xuICAgICAgICBydW5XaGVuVmlzaWJsZSgpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ2aXNpYmlsaXR5Y2hhbmdlXCIsIHJ1bldoZW5WaXNpYmxlKVxuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBtb25pdG9yXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIGluaXRpYWxpemVNb25pdG9yKCkge1xuICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLnVwZGF0ZShkb2N1bWVudC5sb2NhdGlvbi5ocmVmKVxuICAgIHRyeSB7XG4gICAgICAvLyBDcmVhdGVzIGEgbmV3IGVudHJ5IGluIHRoZSBEQiBkZXNjcmliaW5nIHRoZSBzdGF0ZSBhdCB0aGUgc3RhcnQgb2YgdGhlIHNlc3Npb25cbiAgICAgIGF3YWl0IHRoaXMuaW5pdGlhbGl6ZVNlc3Npb24oKVxuICAgICAgLy8gQmluZHMgbGlzdGVuZXJzIHRvIHRoZSBIVE1MIGVsZW1lbnRzIHNwZWNpZmllZCBpbiB0aGUgY29uZmlnIGZvciBhbGwgbWF0Y2hpbmcgcGF0aCBwYXR0ZXJuc1xuICAgICAgdGhpcy5iaW5kRXZlbnRzKClcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gaW5pdGlhbGl6ZSBzZXNzaW9uOlwiLCBlcnIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgZW50cnkgaW4gdGhlIERCIGRlc2NyaWJpbmcgdGhlIHN0YXRlIGF0IHRoZSBzdGFydCBvZiB0aGUgc2Vzc2lvblxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyBpbml0aWFsaXplU2Vzc2lvbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBjdXJyZW50U3RhdGU6IERCRG9jdW1lbnQgPSBuZXcgU2Vzc2lvbkRvY3VtZW50KFxuICAgICAgdGhpcy5jdXJyZW50UGFnZURhdGEuY3VycmVudFVSTCxcbiAgICAgIGRvY3VtZW50LnRpdGxlLFxuICAgIClcbiAgICBjb25zb2xlLmxvZyhcIkNoZWNraW5nIGhpZ2hsaWdodFwiKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBNZXNzYWdlUmVzcG9uc2UgfCBudWxsID0gYXdhaXQgdGhpcy5zZW5kTWVzc2FnZVRvQmFja2dyb3VuZChcbiAgICAgIFNlbmRlck1ldGhvZC5Jbml0aWFsaXplU2Vzc2lvbixcbiAgICAgIGN1cnJlbnRTdGF0ZSxcbiAgICApXG4gICAgaWYgKFxuICAgICAgcmVzcG9uc2UgJiZcbiAgICAgIHJlc3BvbnNlPy5zdGF0dXMgPT09IFwiU2Vzc2lvbiBpbml0aWFsaXplZFwiICYmXG4gICAgICByZXNwb25zZS5oaWdobGlnaHRcbiAgICApIHtcbiAgICAgIHRoaXMuZW5hYmxlSGlnaGxpZ2h0aW5nID0gcmVzcG9uc2UuaGlnaGxpZ2h0XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKGBIaWdobGlnaHQgaXMgc2V0IHRvICR7dGhpcy5lbmFibGVIaWdobGlnaHRpbmd9YClcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kcyBldmVudCBsaXN0ZW5lcnMgZm9yIG11dGF0aW9ucyBhbmQgbmF2aWdhdGlvblxuICAgKi9cblxuICBwcml2YXRlIGJpbmRFdmVudHMoKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coXCJiaW5kaW5nIGV2ZW50c1wiKVxuICAgIHRoaXMuYWRkTGlzdGVuZXJzVG9OZXdNYXRjaGVzKCkgLy8gYXR0YWNoIHRvIGFsbCBleGlzdGluZyBlbGVtZW50c1xuICAgIC8vIFdoZW5ldmVyIG5ldyBjb250ZW50IGlzIGxvYWRlZCwgYXR0YWNoIG9ic2VydmVycyB0byBlYWNoIEhUTUwgZWxlbWVudCB0aGF0IG1hdGNoZXMgdGhlIHNlbGVjdG9ycyBpbiB0aGUgY29uZmlnc1xuICAgIGNvbnN0IG9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT5cbiAgICAgIHRoaXMuYWRkTGlzdGVuZXJzVG9OZXdNYXRjaGVzKCksXG4gICAgKVxuICAgIC8vIE1ha2UgdGhlIG11dGF0aW9uIG9ic2VydmVyIG9ic2VydmUgdGhlIGVudGlyZSBkb2N1bWVudCBmb3IgY2hhbmdlc1xuICAgIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwge1xuICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICB9KVxuICAgIGNvbnNvbGUubG9nKFwiYWRkaW5nIG5hdmlnYXRpb24gbGlzdGVuZXJcIilcbiAgICAvLyBBZGQgYW4gZXZlbnQgbGlzdGVuZXIgdG8gZGV0ZWN0IG5hdmlnYXRpb25zIG9uIHRoZSBwYWdlXG4gICAgbmF2aWdhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibmF2aWdhdGVcIiwgKGU6IE5hdmlnYXRpb25FdmVudCkgPT5cbiAgICAgIHRoaXMub25OYXZpZ2F0aW9uRGV0ZWN0aW9uKGUpLFxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGxpc3RlbmVycyB0byBtdXRhdGlvbnMgKGllLiBuZXdseSByZW5kZXJlZCBlbGVtZW50cykgYW5kIG1hcmtzIHRoZW0gd2l0aCB0aGlzLmludGVyYWN0dGlvbkF0dHJpYnV0ZS5cbiAgICogSWYgZGVidWcgbW9kZSBpcyBvbiwgdGhpcyB3aWxsIGFkZCBhIGNvbG91cmZ1bCBib3JkZXIgdG8gdGhlc2UgZWxlbWVudHMuXG4gICAqL1xuXG4gIHByaXZhdGUgYWRkTGlzdGVuZXJzVG9OZXdNYXRjaGVzKCk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKFwiYWRkaW5nIHNlbGVjdG9yc1wiKTtcbiAgICBjb25zb2xlLmxvZyhcIkN1cnJlbnQgcGFnZSBkYXRhOlwiKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRQYWdlRGF0YSk7XG4gICAgdGhpcy5jdXJyZW50UGFnZURhdGEuc2VsZWN0b3JOYW1lUGFpcnMuZm9yRWFjaCgoc2VsZWN0b3JOYW1lUGFpcikgPT4ge1xuICAgICAgY29uc3QgZWxlbWVudHM6IE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgYDppcygke3NlbGVjdG9yTmFtZVBhaXIuc2VsZWN0b3J9KTpub3QoWyR7dGhpcy5odG1sTW9uaXRvcmluZ0F0dHJpYnV0ZX1dKWAsXG4gICAgICApXG4gICAgICBjb25zdCBuYW1lOiBzdHJpbmcgPSBzZWxlY3Rvck5hbWVQYWlyLm5hbWVcbiAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBlbGVtZW50cykge1xuICAgICAgICBpZiAodGhpcy5lbmFibGVIaWdobGlnaHRpbmcpIHtcbiAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlciA9IGAycHggc29saWQgJHt0aGlzLlN0cmluZ1RvQ29sb3IubmV4dChuYW1lKX1gXG4gICAgICAgIH1cbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUodGhpcy5odG1sTW9uaXRvcmluZ0F0dHJpYnV0ZSwgXCJ0cnVlXCIpXG5cbiAgICAgICAgZm9yIChjb25zdCBpZSBvZiB0aGlzLmh0bWxFdmVudHNUb01vbml0b3IpIHtcbiAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBpZSxcbiAgICAgICAgICAgIChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLm9uSW50ZXJhY3Rpb25EZXRlY3Rpb24oZWxlbWVudCwgZSwgbmFtZSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0cnVlLFxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBtZXNzYWdlIHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdC5cbiAgICogQHBhcmFtIGFjdGl2aXR5VHlwZSAtICB0aGUgdHlwZSBvZiBhY3Rpdml0eSAoc2VsZiBsb29wIG9yIHN0YXRlIGNoYW5nZSlcbiAgICogQHBhcmFtIGV2ZW50IC0gdGhlIEhUTUwgZXZlbnQgdGhhdCBvY2N1cmVkXG4gICAqXG4gICAqIEByZXR1cm5zIEEgZG9jdW1lbnQgZGVzY3JpYmluZyBzZWxmIGxvb3BcbiAgICovXG5cbiAgcHJpdmF0ZSBjcmVhdGVOYXZpZ2F0aW9uUmVjb3JkKFxuICAgIGFjdGl2aXR5VHlwZTogQWN0aXZpdHlUeXBlLFxuICAgIGV2ZW50OiBFdmVudCxcbiAgKTogREJEb2N1bWVudCB7XG4gICAgY29uc3QgbWV0YWRhdGEgPSB0aGlzLmV4dHJhY3Rvckxpc3QuZXh0cmFjdChcbiAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkwsIC8vIHJ1bnMgZm9yIFwicHJldiBwYWdlXCJcbiAgICAgIFNlbmRlck1ldGhvZC5OYXZpZ2F0aW9uRGV0ZWN0aW9uLFxuICAgIClcbiAgICBjb25zb2xlLmxvZyhcInByaW50aW5nIG1ldGFkYXRhXCIpXG4gICAgY29uc29sZS5sb2cobWV0YWRhdGEpXG4gICAgcmV0dXJuIG5ldyBBY3Rpdml0eURvY3VtZW50KFxuICAgICAgYWN0aXZpdHlUeXBlLFxuICAgICAgZXZlbnQsXG4gICAgICBtZXRhZGF0YSxcbiAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkwsXG4gICAgICBkb2N1bWVudC50aXRsZSxcbiAgICApXG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBtZXNzYWdlIHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdC5cbiAgICogQHBhcmFtIGVsZW1lbnQgLSB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJlZCB0aGUgZXZlbnRcbiAgICogQHBhcmFtIG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJlZCB0aGUgY2FsbGJhY2sgKGFzIGRlZmluZWQgaW4gdGhlIGNvbmZpZylcbiAgICogQHBhcmFtIGV2ZW50IC0gdGhlIEhUTUwgZXZlbnQgdGhhdCBvY2N1cmVkXG4gICAqIEByZXR1cm5zIEEgZG9jdW1lbnQgaW50ZXJhY3Rpb24gc2VsZiBsb29wXG4gICAqL1xuXG4gIHByaXZhdGUgY3JlYXRlSW50ZXJhY3Rpb25SZWNvcmQobmFtZTogc3RyaW5nLCBldmVudDogRXZlbnQpOiBEQkRvY3VtZW50IHtcbiAgICBjb25zb2xlLmxvZyhcIkRldGVjdGVkIGludGVyYWN0aW9uIGV2ZW50XCIpXG4gICAgY29uc3QgcGFnZVNwZWNpZmljRGF0YTogb2JqZWN0ID0ge1xuICAgICAgZWxlbWVudE5hbWU6IG5hbWUsXG4gICAgfVxuICAgIGNvbnN0IGV4dHJhY3RlZERhdGEgPSB0aGlzLmV4dHJhY3Rvckxpc3QuZXh0cmFjdChcbiAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkwsXG4gICAgICBTZW5kZXJNZXRob2QuSW50ZXJhY3Rpb25EZXRlY3Rpb24sXG4gICAgKVxuXG4gICAgY29uc3QgbWV0YWRhdGE6IEV4dHJhY3RlZE1ldGFkYXRhID0ge1xuICAgICAgLi4ucGFnZVNwZWNpZmljRGF0YSxcbiAgICAgIC4uLihleHRyYWN0ZWREYXRhIGFzIG9iamVjdCksXG4gICAgfSBhcyBFeHRyYWN0ZWRNZXRhZGF0YVxuXG4gICAgY29uc29sZS5sb2coXCJwcmludGluZyBtZXRhZGF0YVwiKVxuICAgIGNvbnNvbGUubG9nKG1ldGFkYXRhKVxuXG4gICAgcmV0dXJuIG5ldyBBY3Rpdml0eURvY3VtZW50KFxuICAgICAgQWN0aXZpdHlUeXBlLkludGVyYWN0aW9uLFxuICAgICAgZXZlbnQsXG4gICAgICBtZXRhZGF0YSxcbiAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkwsXG4gICAgICBkb2N1bWVudC50aXRsZSxcbiAgICApXG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBtZXNzYWdlIHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdC5cbiAgICogQHBhcmFtIHNlbmRlck1ldGhvZCAtIHRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvbiB0aGF0J3Mgc2VuZGluZyB0aGUgbWVzc2FnZSB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHRcbiAgICogQHBhcmFtIHBheWxvYWQgLSB0aGUgZGF0YSBiZWluZyBzZW50IHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdFxuICAgKlxuICAgKiBAcmV0dXJucyBSZXNwb25zZSBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIG1lc3NhZ2Ugc3VjY2VlZGVkXG4gICAqL1xuXG4gIHByaXZhdGUgYXN5bmMgc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoXG4gICAgc2VuZGVyTWV0aG9kOiBTZW5kZXJNZXRob2QsXG4gICAgcGF5bG9hZDogREJEb2N1bWVudCxcbiAgKTogUHJvbWlzZTxNZXNzYWdlUmVzcG9uc2UgfCBudWxsPiB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIENoZWNrIGlmIHJ1bnRpbWUgaXMgYXZhaWxhYmxlIChleHRlbnNpb24gY29udGV4dCBzdGlsbCB2YWxpZClcbiAgICAgIGlmICghY2hyb21lLnJ1bnRpbWU/LmlkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4dGVuc2lvbiBjb250ZXh0IGludmFsaWRhdGVkXCIpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1lc3NhZ2U6IE1lc3NhZ2VUb0JhY2tncm91bmQgPSBuZXcgTWVzc2FnZVRvQmFja2dyb3VuZChcbiAgICAgICAgc2VuZGVyTWV0aG9kLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgKVxuICAgICAgY29uc3QgcmVzcG9uc2U6IE1lc3NhZ2VSZXNwb25zZSA9XG4gICAgICAgIGF3YWl0IGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1lc3NhZ2UpXG5cbiAgICAgIC8vIENocm9tZSByZXR1cm5zIHVuZGVmaW5lZCBpZiBubyBsaXN0ZW5lcnMsIGNoZWNrIGlmIHRoYXQncyBleHBlY3RlZFxuICAgICAgaWYgKHJlc3BvbnNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIk5vIHJlc3BvbnNlIGZyb20gYmFja2dyb3VuZCBzY3JpcHRcIilcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNwb25zZVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQmFja2dyb3VuZCBtZXNzYWdlIGZhaWxlZDpcIiwgZXJyb3IpXG4gICAgICAvLyBEZWNpZGUgd2hldGhlciB0byB0aHJvdyBvciBoYW5kbGUgZ3JhY2VmdWxseSBiYXNlZCBvbiB5b3VyIG5lZWRzXG4gICAgICByZXR1cm4gbnVsbCAvLyBvciB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgdGhhdCBjcmVhdGVzIGEgcGF5bG9hZCBkZXNjcmliaW5nIHRoZSBpbnRlcmFjdGlvbiB0aGF0IG9jY3VyZWQgYW5kIHNlbmRzIGl0IHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdFxuICAgKiBAcGFyYW0gZWxlbWVudCAtIHRoZSBldmVudCB0aGF0IHRyaWdnZXJlZCB0aGUgY2FsbGJhY2tcbiAgICogQHBhcmFtIG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJlZCB0aGUgY2FsbGJhY2sgKGFzIGRlZmluZWQgaW4gdGhlIGNvbmZpZylcbiAgICovXG5cbiAgcHJpdmF0ZSBvbkludGVyYWN0aW9uRGV0ZWN0aW9uKFxuICAgIGVsZW1lbnQ6IEVsZW1lbnQsXG4gICAgZXZlbnQ6IEV2ZW50LFxuICAgIG5hbWU6IHN0cmluZyxcbiAgKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coXCJpbnRlcmFjdGlvbiBldmVudCBkZXRlY3RlZFwiKVxuICAgIGNvbnNvbGUubG9nKGBFdmVudCBkZXRlY3RlZCB3aXRoIGV2ZW50IHR5cGU6ICR7ZXZlbnQudHlwZX1gKVxuICAgIGNvbnNvbGUubG9nKGBFdmVudCB0cmlnZ2VyZWQgYnlgLCBlbGVtZW50KVxuICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnQuaW5uZXJIVE1MKTtcbiAgICAvLyBjb25zb2xlLmxvZyhlbGVtZW50LmdldEhUTUwoKSk7XG4gICAgY29uc3QgcmVjb3JkOiBEQkRvY3VtZW50ID0gdGhpcy5jcmVhdGVJbnRlcmFjdGlvblJlY29yZChuYW1lLCBldmVudClcbiAgICB0aGlzLnNlbmRNZXNzYWdlVG9CYWNrZ3JvdW5kKFxuICAgICAgU2VuZGVyTWV0aG9kLkludGVyYWN0aW9uRGV0ZWN0aW9uLFxuICAgICAgcmVjb3JkLFxuICAgICkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIHNlbmQgaW50ZXJhY3Rpb24gZGF0YTpcIiwgZXJyb3IpXG4gICAgfSlcbiAgfVxuXG4gIHByaXZhdGUgaXNOZXdCYXNlVVJMKG5ld1VSTDogc3RyaW5nIHwgbnVsbCk6IGJvb2xlYW4ge1xuICAgIGNvbnNvbGUubG9nKFwiY2hlY2tpbmcgaWYgdXJsIHVwZGF0ZWRcIilcbiAgICBpZiAobmV3VVJMID09PSBudWxsKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIm5ldyB1cmwgaXMgbnVsbFwiKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGNvbnN0IGN1cnJlbnRIb3N0bmFtZSA9IG5ldyBVUkwodGhpcy5jdXJyZW50UGFnZURhdGEuY3VycmVudFVSTCkuaG9zdG5hbWVcbiAgICBjb25zdCBuZXdIb3N0bmFtZSA9IG5ldyBVUkwobmV3VVJMKS5ob3N0bmFtZVxuXG4gICAgY29uc29sZS5sb2coXCJjdXJyZW50IGhvc3RuYW1lXCIsIGN1cnJlbnRIb3N0bmFtZSlcbiAgICBjb25zb2xlLmxvZyhcIm5ldyBob3N0bmFtZVwiLCBuZXdIb3N0bmFtZSlcblxuICAgIHJldHVybiBjdXJyZW50SG9zdG5hbWUgIT09IG5ld0hvc3RuYW1lXG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgdGhhdCBjcmVhdGVzIGEgcGF5bG9hZCBkZXNjcmliaW5nIHRoZSBuYXZpZ2F0aW9uIHRoYXQgb2NjdXJlZCBhbmQgc2VuZHMgaXQgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0XG4gICAqIEBwYXJhbSBuYXZFdmVudCAtIHRoZSBldmVudCB0aGF0IHRyaWdnZXJlZCB0aGUgY2FsbGJhY2tcbiAgICovXG4gIHByaXZhdGUgb25OYXZpZ2F0aW9uRGV0ZWN0aW9uKG5hdkV2ZW50OiBOYXZpZ2F0aW9uRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBkZXN0VXJsOiBzdHJpbmcgfCBudWxsID0gbmF2RXZlbnQuZGVzdGluYXRpb24udXJsXG4gICAgY29uc3QgYmFzZVVSTENoYW5nZTogYm9vbGVhbiA9IHRoaXMuaXNOZXdCYXNlVVJMKGRlc3RVcmwpXG4gICAgbGV0IHJlY29yZDogREJEb2N1bWVudCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuICAgIGxldCBzZW5kZXI6IFNlbmRlck1ldGhvZCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuXG4gICAgY29uc29sZS5sb2coXG4gICAgICBgYmVmb3JlIGNyZWF0aW5nIG5hdiByZWNvcmQsIGN1cnJlbnQgVVJMIGlzICR7dGhpcy5jdXJyZW50UGFnZURhdGEuY3VycmVudFVSTH1gLFxuICAgIClcbiAgICBpZiAoYmFzZVVSTENoYW5nZSkge1xuICAgICAgY29uc29sZS5sb2coXCJVUkwgYmFzZSBjaGFuZ2UgZGV0ZWN0ZWQuIENsb3NpbmcgcHJvZ3JhbS5cIilcbiAgICAgIHJlY29yZCA9IG5ldyBEQkRvY3VtZW50KHRoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkwsIGRvY3VtZW50LnRpdGxlKVxuICAgICAgc2VuZGVyID0gU2VuZGVyTWV0aG9kLkNsb3NlU2Vzc2lvblxuICAgIH0gZWxzZSBpZiAobmF2RXZlbnQubmF2aWdhdGlvblR5cGUgPT09IFwicHVzaFwiKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIlB1c2ggZXZlbnQgZGV0ZWN0ZWQuXCIpXG4gICAgICByZWNvcmQgPSB0aGlzLmNyZWF0ZU5hdmlnYXRpb25SZWNvcmQoQWN0aXZpdHlUeXBlLlN0YXRlQ2hhbmdlLCBuYXZFdmVudClcbiAgICAgIHNlbmRlciA9IFNlbmRlck1ldGhvZC5OYXZpZ2F0aW9uRGV0ZWN0aW9uXG4gICAgfSBlbHNlIGlmIChuYXZFdmVudC5uYXZpZ2F0aW9uVHlwZSA9PT0gXCJyZXBsYWNlXCIpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiUmVwbGFjZSBldmVudCBkZXRlY3RlZC5cIilcbiAgICAgIHJlY29yZCA9IHRoaXMuY3JlYXRlTmF2aWdhdGlvblJlY29yZChBY3Rpdml0eVR5cGUuU2VsZkxvb3AsIG5hdkV2ZW50KVxuICAgICAgc2VuZGVyID0gU2VuZGVyTWV0aG9kLk5hdmlnYXRpb25EZXRlY3Rpb25cbiAgICB9XG4gICAgZWxzZSBpZiAobmF2RXZlbnQubmF2aWdhdGlvblR5cGUgPT09IFwidHJhdmVyc2VcIikge1xuICAgICAgY29uc29sZS5sb2coXCJUcmF2ZXJzZSBldmVudCBkZXRlY3RlZC5cIilcbiAgICAgIHJlY29yZCA9IHRoaXMuY3JlYXRlTmF2aWdhdGlvblJlY29yZChBY3Rpdml0eVR5cGUuVHJhdmVyc2FsLCBuYXZFdmVudClcbiAgICAgIGNvbnNvbGUubG9nKHJlY29yZClcbiAgICAgIHNlbmRlciA9IFNlbmRlck1ldGhvZC5OYXZpZ2F0aW9uRGV0ZWN0aW9uXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coXCJtYXRjaGVkIG5vbmUgb2YgdGhlIGFib3ZlXCIpXG4gICAgICBjb25zb2xlLmxvZyhcImV2ZW50OlwiKVxuICAgICAgY29uc29sZS5sb2cobmF2RXZlbnQpXG4gICAgICBjb25zb2xlLmxvZyhuYXZFdmVudC5uYXZpZ2F0aW9uVHlwZSlcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhcbiAgICAgIGBhZnRlciBjcmVhdGluZyBuYXYgcmVjb3JkLCBjdXJyZW50IFVSTCBpcyAke3RoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkx9YCxcbiAgICApXG5cbiAgICBpZiAoZGVzdFVybCkge1xuICAgICAgdGhpcy5jdXJyZW50UGFnZURhdGEudXBkYXRlKGRlc3RVcmwpXG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coXG4gICAgICBgYXQgZW5kIG9mIG9uIG5hdiBkZXRlY3QsIGN1cnJlbnQgVVJMIGlzICR7dGhpcy5jdXJyZW50UGFnZURhdGEuY3VycmVudFVSTH1gLFxuICAgIClcblxuICAgIGlmICh0eXBlb2YgcmVjb3JkICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBzZW5kZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRoaXMuc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoc2VuZGVyLCByZWNvcmQpLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIHNlbmQgaW50ZXJhY3Rpb24gZGF0YTpcIiwgZXJyb3IpXG4gICAgICB9KVxuICAgIH1cbiAgICBlbHNle1xuICAgICAgY29uc29sZS5sb2coXCJub3Qgc2VuZGluZyBkdWUgdG8gdW5kZWZpbmVkXCIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhIHVuaXF1ZSBjb2xvciBmcm9tIGEgZ2l2ZW4gc3RyaW5nXG4gICAqIFNvdXJjZTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzMxMDM3MzgzXG4gICAqIEByZXR1cm5zIENvbG9yIGhleCBjb2RlXG4gICAqL1xuXG4gIHByaXZhdGUgU3RyaW5nVG9Db2xvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgaW50ZXJmYWNlIENvbG9ySW5zdGFuY2Uge1xuICAgICAgc3RyaW5nVG9Db2xvckhhc2g6IFJlY29yZDxzdHJpbmcsIHN0cmluZz5cbiAgICAgIG5leHRWZXJ5RGlmZmVybnRDb2xvcklkeDogbnVtYmVyXG4gICAgICB2ZXJ5RGlmZmVyZW50Q29sb3JzOiBzdHJpbmdbXVxuICAgIH1cblxuICAgIGxldCBpbnN0YW5jZTogQ29sb3JJbnN0YW5jZSB8IG51bGwgPSBudWxsXG5cbiAgICByZXR1cm4ge1xuICAgICAgbmV4dDogZnVuY3Rpb24gc3RyaW5nVG9Db2xvcihzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGluc3RhbmNlID8/PSB7XG4gICAgICAgICAgc3RyaW5nVG9Db2xvckhhc2g6IHt9LFxuICAgICAgICAgIG5leHRWZXJ5RGlmZmVybnRDb2xvcklkeDogMCxcbiAgICAgICAgICB2ZXJ5RGlmZmVyZW50Q29sb3JzOiBbXG4gICAgICAgICAgICBcIiMwMEZGMDBcIixcbiAgICAgICAgICAgIFwiIzAwMDBGRlwiLFxuICAgICAgICAgICAgXCIjRkYwMDAwXCIsXG4gICAgICAgICAgICBcIiMwMUZGRkVcIixcbiAgICAgICAgICAgIFwiI0ZGQTZGRVwiLFxuICAgICAgICAgICAgXCIjRkZEQjY2XCIsXG4gICAgICAgICAgICBcIiMwMDY0MDFcIixcbiAgICAgICAgICAgIFwiIzAxMDA2N1wiLFxuICAgICAgICAgICAgXCIjOTUwMDNBXCIsXG4gICAgICAgICAgICBcIiMwMDdEQjVcIixcbiAgICAgICAgICAgIFwiI0ZGMDBGNlwiLFxuICAgICAgICAgICAgXCIjRkZFRUU4XCIsXG4gICAgICAgICAgICBcIiM3NzREMDBcIixcbiAgICAgICAgICAgIFwiIzkwRkI5MlwiLFxuICAgICAgICAgICAgXCIjMDA3NkZGXCIsXG4gICAgICAgICAgICBcIiNENUZGMDBcIixcbiAgICAgICAgICAgIFwiI0ZGOTM3RVwiLFxuICAgICAgICAgICAgXCIjNkE4MjZDXCIsXG4gICAgICAgICAgICBcIiNGRjAyOURcIixcbiAgICAgICAgICAgIFwiI0ZFODkwMFwiLFxuICAgICAgICAgICAgXCIjN0E0NzgyXCIsXG4gICAgICAgICAgICBcIiM3RTJERDJcIixcbiAgICAgICAgICAgIFwiIzg1QTkwMFwiLFxuICAgICAgICAgICAgXCIjRkYwMDU2XCIsXG4gICAgICAgICAgICBcIiNBNDI0MDBcIixcbiAgICAgICAgICAgIFwiIzAwQUU3RVwiLFxuICAgICAgICAgICAgXCIjNjgzRDNCXCIsXG4gICAgICAgICAgICBcIiNCREM2RkZcIixcbiAgICAgICAgICAgIFwiIzI2MzQwMFwiLFxuICAgICAgICAgICAgXCIjQkREMzkzXCIsXG4gICAgICAgICAgICBcIiMwMEI5MTdcIixcbiAgICAgICAgICAgIFwiIzlFMDA4RVwiLFxuICAgICAgICAgICAgXCIjMDAxNTQ0XCIsXG4gICAgICAgICAgICBcIiNDMjhDOUZcIixcbiAgICAgICAgICAgIFwiI0ZGNzRBM1wiLFxuICAgICAgICAgICAgXCIjMDFEMEZGXCIsXG4gICAgICAgICAgICBcIiMwMDQ3NTRcIixcbiAgICAgICAgICAgIFwiI0U1NkZGRVwiLFxuICAgICAgICAgICAgXCIjNzg4MjMxXCIsXG4gICAgICAgICAgICBcIiMwRTRDQTFcIixcbiAgICAgICAgICAgIFwiIzkxRDBDQlwiLFxuICAgICAgICAgICAgXCIjQkU5OTcwXCIsXG4gICAgICAgICAgICBcIiM5NjhBRThcIixcbiAgICAgICAgICAgIFwiI0JCODgwMFwiLFxuICAgICAgICAgICAgXCIjNDMwMDJDXCIsXG4gICAgICAgICAgICBcIiNERUZGNzRcIixcbiAgICAgICAgICAgIFwiIzAwRkZDNlwiLFxuICAgICAgICAgICAgXCIjRkZFNTAyXCIsXG4gICAgICAgICAgICBcIiM2MjBFMDBcIixcbiAgICAgICAgICAgIFwiIzAwOEY5Q1wiLFxuICAgICAgICAgICAgXCIjOThGRjUyXCIsXG4gICAgICAgICAgICBcIiM3NTQ0QjFcIixcbiAgICAgICAgICAgIFwiI0I1MDBGRlwiLFxuICAgICAgICAgICAgXCIjMDBGRjc4XCIsXG4gICAgICAgICAgICBcIiNGRjZFNDFcIixcbiAgICAgICAgICAgIFwiIzAwNUYzOVwiLFxuICAgICAgICAgICAgXCIjNkI2ODgyXCIsXG4gICAgICAgICAgICBcIiM1RkFENEVcIixcbiAgICAgICAgICAgIFwiI0E3NTc0MFwiLFxuICAgICAgICAgICAgXCIjQTVGRkQyXCIsXG4gICAgICAgICAgICBcIiNGRkIxNjdcIixcbiAgICAgICAgICAgIFwiIzAwOUJGRlwiLFxuICAgICAgICAgICAgXCIjRTg1RUJFXCIsXG4gICAgICAgICAgXSxcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaW5zdGFuY2Uuc3RyaW5nVG9Db2xvckhhc2hbc3RyXSkge1xuICAgICAgICAgIGluc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoW3N0cl0gPVxuICAgICAgICAgICAgaW5zdGFuY2UudmVyeURpZmZlcmVudENvbG9yc1tpbnN0YW5jZS5uZXh0VmVyeURpZmZlcm50Q29sb3JJZHgrK11cbiAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIGAlYyBUaGUgY29sb3VyIGZvciAke3N0cn1gLFxuICAgICAgICAgICAgYGNvbG9yOiAke2luc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoW3N0cl19YCxcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoW3N0cl1cbiAgICAgIH0sXG4gICAgfVxuICB9KSgpXG59XG4iLCJpbXBvcnQgeyBVUkxQYXR0ZXJuVG9TZWxlY3RvcnMsIFNlbGVjdG9yTmFtZVBhaXIsIENvbmZpZyB9IGZyb20gXCIuL2NvbmZpZ1wiXG4vKipcbiAqIEEgY2xhc3MgcmVzcG9uc2libGUgZm9yIHRyYWNraW5nIHRoZSBzdGF0ZSBvZiB0aGUgcGFnZSB0aGF0IHRoZSB1c2VyIGlzIGN1cnJlbnRseSBvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIFBhZ2VEYXRhIHtcbiAgLy8gQ3VycmVudCBVUkwgb2YgdGhlIHBhZ2VcbiAgY3VycmVudFVSTCE6IHN0cmluZ1xuICAvLyBDU1Mgc2VsZWN0b3JzIGJlaW5nIGFwcGxpZWQgdG8gdGhlIHBhZ2VcbiAgc2VsZWN0b3JOYW1lUGFpcnMhOiBTZWxlY3Rvck5hbWVQYWlyW11cbiAgYmFzZVVSTDogc3RyaW5nXG4gIHVybFBhdHRlcm5Ub1NlbGVjdG9yRGF0YTogVVJMUGF0dGVyblRvU2VsZWN0b3JzXG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBDb25maWcpIHtcbiAgICB0aGlzLnVybFBhdHRlcm5Ub1NlbGVjdG9yRGF0YSA9IGNvbmZpZy5wYXRoc1xuICAgIHRoaXMuYmFzZVVSTCA9IGNvbmZpZy5iYXNlVVJMXG4gIH1cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIFVSTCBhbmQgdGhlIGxpc3Qgb2YgQ1NTIHNlbGVjdG9ycyBmb3IgdGhlIFVSTFxuICAgKiBAcGFyYW0gbmV3VVJMOiBUaGUgZnVsbCB1cmwgb2YgdGhlIGN1cnJlbnQgcGFnZVxuICAgKi9cbiAgdXBkYXRlKG5ld1VSTDogc3RyaW5nKSB7XG4gICAgdGhpcy5jdXJyZW50VVJMID0gbmV3VVJMXG4gICAgY29uc3QgbWF0Y2hpbmdVUkxQYXR0ZXJuczogc3RyaW5nW10gPSB0aGlzLmdldE1hdGNoaW5nUGF0dGVybnMoKVxuICAgIHRoaXMuc2VsZWN0b3JOYW1lUGFpcnMgPSB0aGlzLmdldFNlbGVjdG9yTmFtZVBhaXJzKG1hdGNoaW5nVVJMUGF0dGVybnMpXG4gIH1cbiAgLyoqXG4gICAqIFNldHMgYG1hdGNoUGF0aERhdGFgIHRvIGJlIHRoZSBQYXRoRGF0YSBmb3IgdGhlIFVSTCBwYXR0ZXJuIHdpdGggdGhlIGNsb3NldCBtYXRjaCB0byBgdGhpcy5iYXNlVVJMYFxuICAgKiBhbmQgcmV0dXJucyBhIGxpc3Qgb2YgYWxsIG1hdGNoZXMuIEFkZGl0aW9uYWxseSwgaXQgdXBkYXRlcyB3aGV0aGVyIHRoZSBjdXJyZW50IHBhdGhcbiAgICogaW5jbHVkZXMgYW4gaWQuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgbGlzdCBvZiBhbGwgcGF0dGVybnMgaW4gdGhlIGNvbmZpZyB0aGF0IG1hdGNoIGBiYXNlVVJMYFxuICAgKi9cblxuICBwcml2YXRlIGdldE1hdGNoaW5nUGF0dGVybnMoKTogc3RyaW5nW10ge1xuICAgIGNvbnNvbGUubG9nKFwidXBkYXRpbmcgcGFnZSBkYXRhXCIpXG5cbiAgICAvLyBHZXQgYSBsaXN0IG9mIGFsbCB0aGUgcGF0aHMgdGhhdCBtYXRjaCB0aGUgY3VycmVudCBVUkxcbiAgICBjb25zdCBtYXRjaGluZ1VSTFBhdHRlcm5zOiBzdHJpbmdbXSA9IE9iamVjdC5rZXlzKFxuICAgICAgdGhpcy51cmxQYXR0ZXJuVG9TZWxlY3RvckRhdGEsXG4gICAgKS5maWx0ZXIoKHBhdGgpID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHBhdGgpO1xuICAgICAgY29uc3QgcGF0dGVybjogVVJMUGF0dGVybiA9IG5ldyBVUkxQYXR0ZXJuKHBhdGgsIHRoaXMuYmFzZVVSTClcbiAgICAgIGNvbnN0IG1hdGNoOiBib29sZWFuID0gcGF0dGVybi50ZXN0KHRoaXMuY3VycmVudFVSTClcbiAgICAgIHJldHVybiBtYXRjaFxuICAgIH0pXG5cbiAgICBpZiAobWF0Y2hpbmdVUkxQYXR0ZXJucy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnNvbGUubG9nKFwibm8gbWF0Y2hlcyBmb3VuZFwiKVxuICAgIH1cblxuICAgIHJldHVybiBtYXRjaGluZ1VSTFBhdHRlcm5zXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIG1hdGNoaW5nVVJMUGF0dGVybnM6IEEgbGlzdCBvZiBhbGwgbWF0Y2hpbmcgcGF0aHMgdG8gdGhlIGN1cnJlbnQgdXJsXG4gICAqXG4gICAqIEByZXR1cm5zIEEgbGlzdCBvZiBhbGwgc2VsZWN0b3JzIGZvciB0aGUgbWF0Y2hpbmcgcGF0aHNcbiAgICovXG5cbiAgcHJpdmF0ZSBnZXRTZWxlY3Rvck5hbWVQYWlycyhcbiAgICBtYXRjaGluZ1VSTFBhdHRlcm5zOiBzdHJpbmdbXSxcbiAgKTogU2VsZWN0b3JOYW1lUGFpcltdIHtcbiAgICBsZXQgY3VycmVudFNlbGVjdG9yTmFtZVBhaXJzOiBTZWxlY3Rvck5hbWVQYWlyW10gPSBbXVxuICAgIGZvciAoY29uc3QgdXJsUGF0dGVybiBvZiBtYXRjaGluZ1VSTFBhdHRlcm5zKSB7XG4gICAgICBjb25zdCBzZWxlY3Rvck5hbWVQYWlyczogU2VsZWN0b3JOYW1lUGFpcltdID1cbiAgICAgICAgdGhpcy51cmxQYXR0ZXJuVG9TZWxlY3RvckRhdGFbdXJsUGF0dGVybl1cbiAgICAgIGN1cnJlbnRTZWxlY3Rvck5hbWVQYWlycyA9XG4gICAgICAgIGN1cnJlbnRTZWxlY3Rvck5hbWVQYWlycy5jb25jYXQoc2VsZWN0b3JOYW1lUGFpcnMpXG4gICAgfVxuICAgIHJldHVybiBjdXJyZW50U2VsZWN0b3JOYW1lUGFpcnNcbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2NvbnRlbnQudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=