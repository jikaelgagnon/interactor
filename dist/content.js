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
        this.addListenersToNewMatches();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDaEIscUJBQXFCO1lBQ3JCLE1BQU0sT0FBTyxHQUFlLElBQUksVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQzlELE1BQU0sS0FBSyxHQUFZLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUNwRCxPQUFPLEtBQUs7UUFDZCxDQUFDLENBQUM7UUFFRixJQUFJLG1CQUFtQixDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDO1FBQ2pDLENBQUM7UUFFRCxPQUFPLG1CQUFtQjtJQUM1QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUVLLG9CQUFvQixDQUMxQixtQkFBNkI7UUFFN0IsSUFBSSx3QkFBd0IsR0FBdUIsRUFBRTtRQUNyRCxLQUFLLE1BQU0sVUFBVSxJQUFJLG1CQUFtQixFQUFFLENBQUM7WUFDN0MsTUFBTSxpQkFBaUIsR0FDckIsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQztZQUMzQyx3QkFBd0I7Z0JBQ3RCLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztRQUN0RCxDQUFDO1FBQ0QsT0FBTyx3QkFBd0I7SUFDakMsQ0FBQztDQUNGO0FBbkVELDRCQW1FQzs7Ozs7OztVQ3ZFRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb21tb24vY29tbXVuaWNhdGlvbi9hY3Rpdml0eS50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbW1vbi9jb21tdW5pY2F0aW9uL21lc3NhZ2luZy50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbW1vbi9jb21tdW5pY2F0aW9uL3NlbmRlci50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbW1vbi9kYmRvY3VtZW50LnRzIiwid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvY29udGVudC50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbnRlbnQvY29uZmlnLnRzIiwid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvY29udGVudC9tb25pdG9yLnRzIiwid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvY29udGVudC9wYWdlZGF0YS50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2ludGVyYWN0b3Ivd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIERlZmluZXMgYSBsaXN0IG9mIHRoZSBwb3NzaWJsZSBhY3Rpdml0eSB0eXBlcyB0aGF0IGNhbiBiZSByZWNvcmRlZCBieSB0aGUgTW9uaXRvciBjbGFzc1xuICovXG5lbnVtIEFjdGl2aXR5VHlwZSB7XG4gIFNlbGZMb29wID0gXCJTZWxmLUxvb3BcIixcbiAgU3RhdGVDaGFuZ2UgPSBcIlN0YXRlIENoYW5nZVwiLFxuICBJbnRlcmFjdGlvbiA9IFwiSW50ZXJhY3Rpb25cIixcbiAgQm90aCA9IFwiQm90aFwiLFxufVxuXG5leHBvcnQgeyBBY3Rpdml0eVR5cGUgfVxuIiwiaW1wb3J0IHsgREJEb2N1bWVudCB9IGZyb20gXCIuLi9kYmRvY3VtZW50XCJcbmltcG9ydCB7IFNlbmRlck1ldGhvZCB9IGZyb20gXCIuL3NlbmRlclwiXG5leHBvcnQgeyBNZXNzYWdlVG9CYWNrZ3JvdW5kLCBNZXNzYWdlUmVzcG9uc2UgfVxuLyoqXG4gKiBBIGNsYXNzIHVzZWQgdG8gc2VuZCBtZXNzYWdlcyBmcm9tIHRoZSBjb250ZW50IHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdCBpbiBhIGNvbnNpc3RlbnQgZm9ybWF0LlxuICovXG5jbGFzcyBNZXNzYWdlVG9CYWNrZ3JvdW5kIHtcbiAgc2VuZGVyTWV0aG9kOiBTZW5kZXJNZXRob2RcbiAgcGF5bG9hZDogREJEb2N1bWVudFxuICAvKipcbiAgICogQHBhcmFtIHNlbmRlck1ldGhvZCAtIGVudW0gdHlwZSBvZiB0aGUgbWV0aG9kIHNlbmRpbmcgdGhlIG1lc3NhZ2VcbiAgICogQHBhcmFtIHBheWxvYWQgLSB0aGUgZGF0YSBiZWluZyBzZW50IHRvIHRoZSBkYXRhYmFzZVxuICAgKi9cbiAgY29uc3RydWN0b3Ioc2VuZGVyTWV0aG9kOiBTZW5kZXJNZXRob2QsIHBheWxvYWQ6IERCRG9jdW1lbnQpIHtcbiAgICB0aGlzLnNlbmRlck1ldGhvZCA9IHNlbmRlck1ldGhvZFxuICAgIHRoaXMucGF5bG9hZCA9IHBheWxvYWRcbiAgfVxufVxuXG5pbnRlcmZhY2UgTWVzc2FnZVJlc3BvbnNlIHtcbiAgc3RhdHVzOiBzdHJpbmdcbiAgaGlnaGxpZ2h0PzogYm9vbGVhblxufVxuIiwiZW51bSBTZW5kZXJNZXRob2Qge1xuICBJbml0aWFsaXplU2Vzc2lvbiA9IFwiSW5pdGlhbGl6ZSBTZXNzaW9uXCIsXG4gIEludGVyYWN0aW9uRGV0ZWN0aW9uID0gXCJJbnRlcmFjdGlvbiBEZXRlY3Rpb25cIixcbiAgTmF2aWdhdGlvbkRldGVjdGlvbiA9IFwiTmF2aWdhdGlvbiBEZXRlY3Rpb25cIixcbiAgQ2xvc2VTZXNzaW9uID0gXCJDbG9zZSBTZXNzaW9uXCIsXG4gIEFueSA9IFwiQW55XCIsXG59XG5leHBvcnQgeyBTZW5kZXJNZXRob2QgfVxuIiwiaW1wb3J0IHsgQWN0aXZpdHlUeXBlIH0gZnJvbSBcIi4vY29tbXVuaWNhdGlvbi9hY3Rpdml0eVwiXG4vKipcbiAqIEEgY2xhc3MgZGVmaW5pbmcgZG9jdW1lbnRzIHRoYXQgYXJlIHNlbnQgdG8gdGhlIGRhdGFiYXNlIGZyb20gdGhlIGNvbnRlbnQgc2NyaXB0XG4gKi9cbmNsYXNzIERCRG9jdW1lbnQge1xuICAvLyBVUkwgYXQgd2hpY2h0IHRoZSBldmVudCB3YXMgY3JlYXRlZFxuICBzb3VyY2VVUkw6IHN0cmluZ1xuICBzb3VyY2VEb2N1bWVudFRpdGxlOiBzdHJpbmdcblxuICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgdGl0bGU6IHN0cmluZykge1xuICAgIHRoaXMuc291cmNlVVJMID0gdXJsXG4gICAgdGhpcy5zb3VyY2VEb2N1bWVudFRpdGxlID0gdGl0bGVcbiAgfVxufVxuXG5pbnRlcmZhY2UgRXh0cmFjdGVkTWV0YWRhdGFPYmplY3Qge1xuICBba2V5OiBzdHJpbmddOiBFeHRyYWN0ZWRNZXRhZGF0YVxufVxuXG50eXBlIEV4dHJhY3RlZE1ldGFkYXRhID1cbiAgfCBzdHJpbmdcbiAgfCBFeHRyYWN0ZWRNZXRhZGF0YVtdXG4gIHwgRXh0cmFjdGVkTWV0YWRhdGFPYmplY3RcbiAgfCBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IC8vIGV4cGxpY2l0bHkgYWxsb3cgb2JqZWN0cyB3aXRoIHN0cmluZyB2YWx1ZXNcblxuLyoqXG4gKiBBIGNoaWxkIG9mIERCRG9jdW1lbnQgdGhhdCByZXByZXNlbnRzIGFjdGl2aXRpZXNcbiAqL1xuXG5jbGFzcyBBY3Rpdml0eURvY3VtZW50IGV4dGVuZHMgREJEb2N1bWVudCB7XG4gIC8vIFRoZSB0eXBlIG9mIGFjdGl2aXR5IGJlaW5nIGxvZ2dlZC4gRWl0aGVyIFwic3RhdGVfY2hhZ2VcIiwgXCJzZWxmX2xvb3BcIiwgb3IgXCJpbnRlcmFjdGlvblwiXG4gIGFjdGl2aXR5VHlwZTogQWN0aXZpdHlUeXBlIHwgc3RyaW5nXG4gIC8vIFRpbWVzdGFtcCBmb3Igd2hlbiB0aGUgZG9jdW1lbnQgd2FzIGNyZWF0ZWRcbiAgY3JlYXRlZEF0OiBEYXRlIHwgc3RyaW5nXG4gIC8vIEV2ZW50IHR5cGUgKGVnLiBjbGljaywgc2Nyb2xsLCBldGMuLi4pXG4gIGV2ZW50VHlwZTogc3RyaW5nXG4gIC8vIE1ldGFkYXRhIGFib3V0IHRoZSBldmVudFxuICBtZXRhZGF0YT86IEV4dHJhY3RlZE1ldGFkYXRhXG4gIGNvbnN0cnVjdG9yKFxuICAgIHR5cGU6IEFjdGl2aXR5VHlwZSxcbiAgICBldmVudDogRXZlbnQsXG4gICAgbWV0YWRhdGE6IEV4dHJhY3RlZE1ldGFkYXRhLFxuICAgIHVybDogc3RyaW5nLFxuICAgIHRpdGxlOiBzdHJpbmcsXG4gICkge1xuICAgIHN1cGVyKHVybCwgdGl0bGUpXG4gICAgdGhpcy5hY3Rpdml0eVR5cGUgPSB0eXBlXG4gICAgdGhpcy5jcmVhdGVkQXQgPSBuZXcgRGF0ZSgpXG4gICAgdGhpcy5ldmVudFR5cGUgPSBldmVudC50eXBlXG4gICAgdGhpcy5tZXRhZGF0YSA9IG1ldGFkYXRhXG4gIH1cbn1cblxuLyoqXG4gKiBBIGNoaWxkIG9mIERCRG9jdW1lbnQgdGhhdCByZXByZXNlbnRzIHRoZSBzdGFydCBvZiBhIHNlc3Npb25cbiAqL1xuXG5jbGFzcyBTZXNzaW9uRG9jdW1lbnQgZXh0ZW5kcyBEQkRvY3VtZW50IHtcbiAgc3RhcnRUaW1lOiBEYXRlIHwgbnVsbFxuICBlbmRUaW1lPzogRGF0ZSB8IG51bGxcbiAgZW1haWw6IHN0cmluZyB8IG51bGwgPSBudWxsXG4gIGNvbnN0cnVjdG9yKHNvdXJjZVVSTDogc3RyaW5nLCBzb3VyY2VEb2N1bWVudFRpdGxlOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzb3VyY2VVUkwsIHNvdXJjZURvY3VtZW50VGl0bGUpXG4gICAgdGhpcy5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpXG4gIH1cbiAgc2V0RW1haWwoZW1haWw6IHN0cmluZykge1xuICAgIHRoaXMuZW1haWwgPSBlbWFpbFxuICB9XG59XG5cbmV4cG9ydCB7IERCRG9jdW1lbnQsIEFjdGl2aXR5RG9jdW1lbnQsIFNlc3Npb25Eb2N1bWVudCwgRXh0cmFjdGVkTWV0YWRhdGEgfVxuIiwiaW1wb3J0IHsgTW9uaXRvciB9IGZyb20gXCIuL2NvbnRlbnQvbW9uaXRvclwiXG5pbXBvcnQgeXRDb25maWcgZnJvbSBcIi4vY29udGVudC9jb25maWdzL3lvdXR1YmVfY29uZmlnLmpzb25cIlxuaW1wb3J0IHBlcnNvbmFsQ29uZmlnIGZyb20gXCIuL2NvbnRlbnQvY29uZmlncy9wZXJzb25hbF9zaXRlLmpzb25cIlxuLy8gaW1wb3J0IHRpa3Rva0NvbmZpZyBmcm9tICcuL2NvbmZpZ3MvdGlrdG9rX2NvbmZpZy5qc29uJztcbi8vIGltcG9ydCBsaW5rZWRpbkNvbmZpZyBmcm9tICcuL2NvbmZpZ3MvbGlua2VkaW5fY29uZmlnLmpzb24nO1xuaW1wb3J0IHsgQ29uZmlnTG9hZGVyLCBFeHRyYWN0b3JEYXRhIH0gZnJvbSBcIi4vY29udGVudC9jb25maWdcIlxuLy8gaW1wb3J0IHsgQWN0aXZpdHlUeXBlIH0gZnJvbSBcIi4vY29tbXVuaWNhdGlvbi9hY3Rpdml0eVwiO1xuaW1wb3J0IHsgU2VuZGVyTWV0aG9kIH0gZnJvbSBcIi4vY29tbW9uL2NvbW11bmljYXRpb24vc2VuZGVyXCJcbmltcG9ydCB7IEV4dHJhY3RlZE1ldGFkYXRhIH0gZnJvbSBcIi4vY29tbW9uL2RiZG9jdW1lbnRcIlxuXG5jb25zdCBnZXRIb21lcGFnZVZpZGVvcyA9ICgpOiBFeHRyYWN0ZWRNZXRhZGF0YSA9PiB7XG4gIC8vIGNvbnNvbGUubG9nKFwiLS0tLSBFWFRSQUNUSU5HIEhPTUVQQUdFIExJTktTIC0tLVwiKTtcbiAgY29uc3QgY29udGVudERpdnMgPSBBcnJheS5mcm9tKFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjY29udGVudC55dGQtcmljaC1pdGVtLXJlbmRlcmVyXCIpLFxuICApLmZpbHRlcigoZGl2KSA9PiB7XG4gICAgLy8gQ2hlY2sgaWYgZWxlbWVudCBpcyBhY3R1YWxseSB2aXNpYmxlXG4gICAgY29uc3QgcmVjdCA9IGRpdi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIHJldHVybiAoXG4gICAgICByZWN0LndpZHRoID4gMCAmJlxuICAgICAgcmVjdC5oZWlnaHQgPiAwICYmXG4gICAgICBnZXRDb21wdXRlZFN0eWxlKGRpdikudmlzaWJpbGl0eSAhPT0gXCJoaWRkZW5cIlxuICAgIClcbiAgfSlcblxuICBjb25zdCB2aWRlb3MgPSBjb250ZW50RGl2c1xuICAgIC5tYXAoKGNvbnRlbnREaXYpID0+IHtcbiAgICAgIC8vIEdldCB0aGUgZGlyZWN0IGFuY2hvciBjaGlsZFxuICAgICAgY29uc3QgYW5jaG9yID0gY29udGVudERpdi5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBcIjpzY29wZSA+IHl0LWxvY2t1cC12aWV3LW1vZGVsIGFcIixcbiAgICAgICkgYXMgSFRNTEFuY2hvckVsZW1lbnRcbiAgICAgIGNvbnN0IHNwYW4gPSBjb250ZW50RGl2LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIFwiaDMgYSBzcGFuLnl0LWNvcmUtYXR0cmlidXRlZC1zdHJpbmdcIixcbiAgICAgIClcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGluazogYW5jaG9yPy5ocmVmID8/IFwiXCIsXG4gICAgICAgIHRpdGxlOiBzcGFuPy50ZXh0Q29udGVudD8udHJpbSgpID8/IFwiXCIsXG4gICAgICB9XG4gICAgfSlcbiAgICAuZmlsdGVyKCh2aWRlbykgPT4gdmlkZW8ubGluayAhPT0gXCJcIilcbiAgY29uc3QgbWV0YWRhdGE6IEV4dHJhY3RlZE1ldGFkYXRhID0geyB2aWRlb3M6IHZpZGVvcyB9XG4gIHJldHVybiBtZXRhZGF0YVxufVxuXG5jb25zdCBnZXRSZWNvbW1lbmRlZFZpZGVvcyA9ICgpOiBFeHRyYWN0ZWRNZXRhZGF0YSA9PiB7XG4gIGNvbnNvbGUubG9nKFwiLS0tLSBFWFRSQUNUSU5HIFJFQ09NTUVOREVEIExJTktTIC0tLS1cIilcbiAgY29uc3QgY29udGVudERpdnMgPSBBcnJheS5mcm9tKFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ5dC1sb2NrdXAtdmlldy1tb2RlbFwiKSxcbiAgKS5maWx0ZXIoKGRpdikgPT4ge1xuICAgIC8vIENoZWNrIGlmIGVsZW1lbnQgaXMgYWN0dWFsbHkgdmlzaWJsZVxuICAgIGNvbnN0IHJlY3QgPSBkaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICByZXR1cm4gKFxuICAgICAgcmVjdC53aWR0aCA+IDAgJiZcbiAgICAgIHJlY3QuaGVpZ2h0ID4gMCAmJlxuICAgICAgZ2V0Q29tcHV0ZWRTdHlsZShkaXYpLnZpc2liaWxpdHkgIT09IFwiaGlkZGVuXCJcbiAgICApXG4gIH0pXG5cbiAgY29uc3QgdmlkZW9zOiBFeHRyYWN0ZWRNZXRhZGF0YSA9IGNvbnRlbnREaXZzXG4gICAgLm1hcCgoY29udGVudERpdikgPT4ge1xuICAgICAgLy8gR2V0IHRoZSBhbmNob3Igd2l0aCB0aGUgdmlkZW8gbGlua1xuICAgICAgY29uc3QgYW5jaG9yID0gY29udGVudERpdi5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAnYVtocmVmXj1cIi93YXRjaFwiXScsXG4gICAgICApISBhcyBIVE1MQW5jaG9yRWxlbWVudFxuICAgICAgY29uc3Qgc3BhbiA9IGNvbnRlbnREaXYucXVlcnlTZWxlY3RvcihcbiAgICAgICAgXCJoMyBhIHNwYW4ueXQtY29yZS1hdHRyaWJ1dGVkLXN0cmluZ1wiLFxuICAgICAgKSFcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGluazogYW5jaG9yPy5ocmVmID8/IFwiXCIsXG4gICAgICAgIHRpdGxlOiBzcGFuPy50ZXh0Q29udGVudD8udHJpbSgpID8/IFwiXCIsXG4gICAgICB9XG4gICAgfSlcbiAgICAuZmlsdGVyKCh2aWRlbykgPT4gdmlkZW8ubGluayAhPT0gXCJcIilcblxuICAvLyBjb25zb2xlLmxvZyhcIlByaW50aW5nIHRoZSBmaXJzdCA1IHZpZGVvc1wiKTtcbiAgLy8gY29uc29sZS50YWJsZSh2aWRlb3Muc2xpY2UoMCw1KSk7XG4gIGNvbnN0IG1ldGFkYXRhOiBFeHRyYWN0ZWRNZXRhZGF0YSA9IHsgdmlkZW9zOiB2aWRlb3MgfVxuICByZXR1cm4gbWV0YWRhdGFcbn1cblxuY29uc3QgZXh0cmFjdG9ycyA9IFtcbiAgbmV3IEV4dHJhY3RvckRhdGEoU2VuZGVyTWV0aG9kLkludGVyYWN0aW9uRGV0ZWN0aW9uLCBcIi9cIiwgZ2V0SG9tZXBhZ2VWaWRlb3MpLFxuICBuZXcgRXh0cmFjdG9yRGF0YShcbiAgICBTZW5kZXJNZXRob2QuSW50ZXJhY3Rpb25EZXRlY3Rpb24sXG4gICAgXCIvd2F0Y2g/dj0qXCIsXG4gICAgZ2V0UmVjb21tZW5kZWRWaWRlb3MsXG4gICksXG5dXG5cbmNvbnN0IHl0Q29uZmlnTG9hZGVyID0gbmV3IENvbmZpZ0xvYWRlcih5dENvbmZpZywgZXh0cmFjdG9ycylcblxubmV3IE1vbml0b3IoeXRDb25maWdMb2FkZXIpXG5cbmNvbnN0IHBlcnNvbmFsQ29uZmlnTG9hZGVyID0gbmV3IENvbmZpZ0xvYWRlcihwZXJzb25hbENvbmZpZywgW10pXG5uZXcgTW9uaXRvcihwZXJzb25hbENvbmZpZ0xvYWRlcilcbi8vIGNvbnN0IHRpa3Rva0lEU2VsZWN0b3IgPSAoKTogb2JqZWN0ID0+IHtcbi8vICAgICBsZXQgdmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi54Z3BsYXllci1jb250YWluZXIudGlrdG9rLXdlYi1wbGF5ZXJcIik7XG4vLyAgICAgaWYgKCF2aWQpe1xuLy8gICAgICAgICBjb25zb2xlLmxvZyhcIm5vIHVybCBmb3VuZCFcIik7XG4vLyAgICAgICAgIHJldHVybiB7fTtcbi8vICAgICB9XG4vLyAgICAgbGV0IGlkID0gdmlkLmlkLnNwbGl0KFwiLVwiKS5hdCgtMSk7XG4vLyAgICAgbGV0IHVybCA9IGBodHRwczovL3Rpa3Rvay5jb20vc2hhcmUvdmlkZW8vJHtpZH1gO1xuLy8gICAgIHJldHVybiB7XG4vLyAgICAgICAgIFwidW5pcXVlVVJMXCI6IHVybFxuLy8gICAgIH07XG4vLyB9XG5cbi8vIGNvbnNvbGUubG9nKHRpa3Rva0NvbmZpZyk7XG4vLyBjb25zdCB0aWt0b2tDb25maWdMb2FkZXIgPSBuZXcgQ29uZmlnTG9hZGVyKHRpa3Rva0NvbmZpZyk7XG4vLyB0aWt0b2tDb25maWdMb2FkZXIuaW5qZWN0RXh0cmFjdG9yKFwiLypcIiwgdGlrdG9rSURTZWxlY3Rvcik7XG4vLyBjb25zdCB0aWt0b2tJbnRlcmFjdG9yID0gbmV3IE1vbml0b3IodGlrdG9rQ29uZmlnTG9hZGVyLmNvbmZpZyk7XG5cbi8vIC8vIGNvbnNvbGUubG9nKHRpa3Rva0NvbmZpZyk7XG4vLyBjb25zdCBsaW5rZWRpbkNvbmZpZ0xvYWRlciA9IG5ldyBDb25maWdMb2FkZXIobGlua2VkaW5Db25maWcpO1xuLy8gY29uc3QgbGlua2VkaW5JbnRlcmFjdG9yID0gbmV3IE1vbml0b3IobGlua2VkaW5Db25maWdMb2FkZXIuY29uZmlnKTtcbiIsImltcG9ydCB7IFNlbmRlck1ldGhvZCB9IGZyb20gXCIuLi9jb21tb24vY29tbXVuaWNhdGlvbi9zZW5kZXJcIlxuaW1wb3J0IHsgRXh0cmFjdGVkTWV0YWRhdGEgfSBmcm9tIFwiLi4vY29tbW9uL2RiZG9jdW1lbnRcIlxuXG5leHBvcnQge1xuICBDb25maWcsXG4gIENvbmZpZ0xvYWRlcixcbiAgVVJMUGF0dGVyblRvU2VsZWN0b3JzLFxuICBTZWxlY3Rvck5hbWVQYWlyLFxuICBFeHRyYWN0b3JEYXRhLFxuICBFeHRyYWN0b3JMaXN0LFxufVxuXG5pbnRlcmZhY2UgU2VsZWN0b3JOYW1lUGFpciB7XG4gIHNlbGVjdG9yOiBzdHJpbmdcbiAgbmFtZTogc3RyaW5nXG59XG50eXBlIFVSTFBhdHRlcm5Ub1NlbGVjdG9ycyA9IFJlY29yZDxzdHJpbmcsIFNlbGVjdG9yTmFtZVBhaXJbXT5cblxuaW50ZXJmYWNlIENvbmZpZyB7XG4gIC8qKlxuICAgKiBBbiBpbnRlcmZhY2UgdGhhdCBjb250YWlucyBhbGwgdGhlIGRhdGEgcmVxdWlyZWQgdG8gaW5zdGFudGlhdGUgYSBNb25pdG9yLlxuICAgKi9cbiAgLy8gVGhlIGJhc2UgVVJMIHRoYXQgdGhlIG1vbml0b3Igc2hvdWxkIHN0YXJ0IGF0XG4gIGJhc2VVUkw6IHN0cmluZ1xuICAvLyBBIG1hcHBpbmcgb2YgVVJMIHBhdHRlcm5zIHRvIHBhdGggZGF0YS4gVGhlIFVSTCBQYXR0ZXJuIHNob3VsZCBmb2xsb3cgdGhlXG4gIC8vIFVSTCBQYXR0ZXJuIEFQSSBzeW50YXguIFRoZXNlIGFyZSBhcHBlbmRlZCB0byB0aGUgYmFzZVVSTCB3aGVuIGNoZWNraW5nIGZvciBtYXRjaGVzXG4gIC8vIEV4OiBiYXNlVVJMOiB3d3cueW91dHViZS5jb20sIHBhdGg6IC9zaG9ydHMvOmlkIC0+IHd3dy55b3V0dWJlLmNvbS9zaG9ydHMvOmlkXG4gIHBhdGhzOiBVUkxQYXR0ZXJuVG9TZWxlY3RvcnNcbiAgLy8gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIE1vbml0b3Igc2hvdWxkIGJlIGluIGRlYnVnIG1vZGUuIElmIHRydWUsIGFkZCBjb2xvdXJlZCBib3hlc1xuICAvLyBhcm91bmQgc2VsZWN0ZWQgSFRNTCBlbGVtZW50c1xuICBkZWJ1Zz86IGJvb2xlYW5cbiAgLy8gQSBsaXN0IG9mIGV2ZW50IHR5cGVzIHRvIG1vbml0b3IuIEJ5IGRlZmF1bHQsIHRoaXMgaXMganVzdCBbXCJjbGlja1wiXVxuICBldmVudHM/OiBzdHJpbmdbXVxufVxuXG5jbGFzcyBFeHRyYWN0b3JEYXRhIHtcbiAgZXZlbnRUeXBlOiBTZW5kZXJNZXRob2RcbiAgdXJsUGF0dGVybjogc3RyaW5nXG4gIGV4dHJhY3RvcjogKCkgPT4gRXh0cmFjdGVkTWV0YWRhdGFcbiAgY29uc3RydWN0b3IoXG4gICAgYWN0aXZpdHlUeXBlOiBTZW5kZXJNZXRob2QsXG4gICAgdXJsUGF0dGVybjogc3RyaW5nLFxuICAgIGV4dHJhY3RvcjogKCkgPT4gRXh0cmFjdGVkTWV0YWRhdGEsXG4gICkge1xuICAgIHRoaXMuZXZlbnRUeXBlID0gYWN0aXZpdHlUeXBlXG4gICAgdGhpcy51cmxQYXR0ZXJuID0gdXJsUGF0dGVyblxuICAgIHRoaXMuZXh0cmFjdG9yID0gZXh0cmFjdG9yXG4gIH1cbn1cblxuY2xhc3MgRXh0cmFjdG9yTGlzdCB7XG4gIHByaXZhdGUgZXh0cmFjdG9yczogRXh0cmFjdG9yRGF0YVtdXG4gIHByaXZhdGUgYmFzZVVSTDogc3RyaW5nXG4gIGNvbnN0cnVjdG9yKGV4dHJhY3RvcnM6IEV4dHJhY3RvckRhdGFbXSA9IFtdLCBiYXNlVVJMOiBzdHJpbmcpIHtcbiAgICB0aGlzLmV4dHJhY3RvcnMgPSBleHRyYWN0b3JzXG4gICAgdGhpcy5iYXNlVVJMID0gYmFzZVVSTFxuICB9XG5cbiAgcHVibGljIGV4dHJhY3QoXG4gICAgY3VycmVudFVSTDogc3RyaW5nLFxuICAgIGV2ZW50VHlwZTogU2VuZGVyTWV0aG9kLFxuICApOiBFeHRyYWN0ZWRNZXRhZGF0YSB7XG4gICAgY29uc29sZS5sb2coXG4gICAgICBgQXR0ZW1wdGluZyBleHRyYWN0aW9uIGZvciB1cmw6ICR7Y3VycmVudFVSTH0gYW5kIGV2ZW50IHR5cGUgJHtldmVudFR5cGV9YCxcbiAgICApXG4gICAgbGV0IGV4dHJhY3RlZERhdGE6IEV4dHJhY3RlZE1ldGFkYXRhID0ge31cbiAgICB0aGlzLmV4dHJhY3RvcnNcbiAgICAgIC5maWx0ZXIoKGUpID0+IHtcbiAgICAgICAgY29uc3QgaXNDb3JyZWN0QWN0aXZpdHk6IGJvb2xlYW4gPVxuICAgICAgICAgIGUuZXZlbnRUeXBlID09IGV2ZW50VHlwZSB8fCBlLmV2ZW50VHlwZSA9PSBTZW5kZXJNZXRob2QuQW55XG4gICAgICAgIGNvbnN0IHA6IFVSTFBhdHRlcm4gPSBuZXcgVVJMUGF0dGVybihlLnVybFBhdHRlcm4sIHRoaXMuYmFzZVVSTClcbiAgICAgICAgY29uc3QgaXNVUkxNYXRjaDogYm9vbGVhbiA9IHAudGVzdChjdXJyZW50VVJMKVxuICAgICAgICByZXR1cm4gaXNDb3JyZWN0QWN0aXZpdHkgJiYgaXNVUkxNYXRjaFxuICAgICAgfSlcbiAgICAgIC5mb3JFYWNoKFxuICAgICAgICAoZSkgPT5cbiAgICAgICAgICAoZXh0cmFjdGVkRGF0YSA9IHtcbiAgICAgICAgICAgIC4uLihleHRyYWN0ZWREYXRhIGFzIG9iamVjdCksXG4gICAgICAgICAgICAuLi4oZS5leHRyYWN0b3IoKSBhcyBvYmplY3QpLFxuICAgICAgICAgIH0pLFxuICAgICAgKVxuICAgIHJldHVybiBleHRyYWN0ZWREYXRhXG4gIH1cbn1cblxuY2xhc3MgQ29uZmlnTG9hZGVyIHtcbiAgcHVibGljIGNvbmZpZzogQ29uZmlnXG4gIHB1YmxpYyBleHRyYWN0b3JMaXN0OiBFeHRyYWN0b3JMaXN0XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBDb25maWcsIGV4dHJhY3Rvckxpc3Q6IEV4dHJhY3RvckRhdGFbXSA9IFtdKSB7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWdcbiAgICB0aGlzLmV4dHJhY3Rvckxpc3QgPSBuZXcgRXh0cmFjdG9yTGlzdChleHRyYWN0b3JMaXN0LCBjb25maWcuYmFzZVVSTClcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgTWVzc2FnZVRvQmFja2dyb3VuZCxcbiAgTWVzc2FnZVJlc3BvbnNlLFxufSBmcm9tIFwiLi4vY29tbW9uL2NvbW11bmljYXRpb24vbWVzc2FnaW5nXCJcbmltcG9ydCB7XG4gIERCRG9jdW1lbnQsXG4gIEFjdGl2aXR5RG9jdW1lbnQsXG4gIFNlc3Npb25Eb2N1bWVudCxcbiAgRXh0cmFjdGVkTWV0YWRhdGEsXG59IGZyb20gXCIuLi9jb21tb24vZGJkb2N1bWVudFwiXG5pbXBvcnQgeyBDb25maWdMb2FkZXIsIEV4dHJhY3Rvckxpc3QgfSBmcm9tIFwiLi9jb25maWdcIlxuaW1wb3J0IHsgUGFnZURhdGEgfSBmcm9tIFwiLi9wYWdlZGF0YVwiXG5pbXBvcnQgeyBBY3Rpdml0eVR5cGUgfSBmcm9tIFwiLi4vY29tbW9uL2NvbW11bmljYXRpb24vYWN0aXZpdHlcIlxuaW1wb3J0IHsgU2VuZGVyTWV0aG9kIH0gZnJvbSBcIi4uL2NvbW1vbi9jb21tdW5pY2F0aW9uL3NlbmRlclwiXG5cbi8qKlxuICogVGhpcyBjbGFzcyByZWFkcyBmcm9tIGEgcHJvdmlkZWQgQ29uZmlnIG9iamVjdCBhbmQgYXR0YWNoZXMgbGlzdGVuZXJzIHRvIHRoZSBlbGVtZW50cyBzcGVjaWZpZWQgaW4gdGhlIHNlbGVjdG9ycy5cbiAqIFdoZW4gdGhlc2UgZWxlbWVudHMgYXJlIGludGVyYWN0ZWQgd2l0aCwgb3Igd2hlbiBhIG5hdmlnYXRpb24gb2NjdXJzLCBhIGRvY3VtZW50IGlzIHNlbnQgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0XG4gKiB0byBiZSBhcHBlbmRlZCB0byB0aGUgZGF0YWJhc2UuIFRoaXMgY2xhc3MgaXMgaW5zdGFudGlhdGVkIGluIGNvbnRlbnQudHMuXG4gKlxuICogQHBhcmFtIGludGVyYWN0aW9uRXZlbnRzIC0gQSBsaXN0IG9mIHRoZSB0eXBlIG9mIGV2ZW50cyB3ZSB3YW50IHRvIG1vbml0b3IgYXMgaW50ZXJhY3Rpb25zIChlZy4gY2xpY2ssIHNjcm9sbCwgZXRjLikuIERlZmF1bHQgaXMgY2xpY2tcbiAqIEBwYXJhbSBkZWJ1ZyAtIElmIHRydWUsIGhpZ2hsaWdodCBhbGwgc2VsZWN0ZWQgSFRNTCBlbGVtZW50cyB3aXRoIGNvbG91cmVkIGJveGVzXG4gKiBAcGFyYW0gcGF0aHMgLSBBbiBvYmplY3QgbWFwcGluZyBwYXRoIHBhdHRlcm5zIHRvIHRoZWlyIGNvcnJlc3BvbmRpbmcgQ1NTIHNlbGVjdG9ycyBQYXRoIHBhdHRlcm5zIGFyZSBjb25zaXN0ZW50IHdpdGggdGhlICBVUkwgUGF0dGVybiBBUEkgU3ludGF4OiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvVVJMX1BhdHRlcm5fQVBJXG4gKiBAcGFyYW0gYmFzZVVSTCAtIEJhc2UgdXJsIGZvciB0aGUgcGFnZSAoZWcuIHd3dy55b3V0dWJlLmNvbSkuIEFsbCBwYXRocyBhcmUgYXBwZW5kZWQgdG8gdGhpcyB3aGVuIG1hdGNoaW5nIFVSbHNcbiAqIEBwYXJhbSBjdXJyZW50UGFnZURhdGEgLSBDb250YWlucyBkYXRhIHJlbGV2YW50IHRvIHRoZSBjdXJyZW50IHBhZ2UuXG4gKiBAcGFyYW0gaW50ZXJhY3Rpb25BdHRyaWJ1dGUgLSBBdHRyaWJ1dGUgYWRkZWQgdG8gYWxsIGVsZW1lbnRzIGJlaW5nIG1vbml0b3JlZFxuICovXG5leHBvcnQgY2xhc3MgTW9uaXRvciB7XG4gIC8vIEEgbGlzdCBvZiB0aGUgdHlwZSBvZiBldmVudHMgd2Ugd2FudCB0byBtb25pdG9yIGFzIGludGVyYWN0aW9ucyAoZWcuIGNsaWNrLCBzY3JvbGwsIGV0Yy4pLiBEZWZhdWx0IGlzIGNsaWNrXG4gIGh0bWxFdmVudHNUb01vbml0b3I6IHN0cmluZ1tdXG4gIC8vIElmIHRydWUsIGhpZ2hsaWdodCBhbGwgc2VsZWN0ZWQgSFRNTCBlbGVtZW50cyB3aXRoIGNvbG91cmVkIGJveGVzXG4gIGVuYWJsZUhpZ2hsaWdodGluZzogYm9vbGVhblxuICAvLyBDb250YWlucyBkYXRhIHJlbGV2YW50IHRvIHRoZSBjdXJyZW50IHBhZ2UuXG4gIGN1cnJlbnRQYWdlRGF0YTogUGFnZURhdGFcbiAgLy8gQXR0cmlidXRlIGFkZGVkIHRvIGFsbCBlbGVtZW50cyBiZWluZyBtb25pdG9yZWRcbiAgaHRtbE1vbml0b3JpbmdBdHRyaWJ1dGU6IHN0cmluZ1xuXG4gIGV4dHJhY3Rvckxpc3Q6IEV4dHJhY3Rvckxpc3RcblxuICBjb25zdHJ1Y3Rvcihjb25maWdMb2FkZXI6IENvbmZpZ0xvYWRlcikge1xuICAgIGNvbnN0IGNvbmZpZyA9IGNvbmZpZ0xvYWRlci5jb25maWdcbiAgICB0aGlzLmh0bWxFdmVudHNUb01vbml0b3IgPSBjb25maWcuZXZlbnRzID8/IFtcImNsaWNrXCJdXG4gICAgdGhpcy5lbmFibGVIaWdobGlnaHRpbmcgPSB0cnVlXG4gICAgdGhpcy5jdXJyZW50UGFnZURhdGEgPSBuZXcgUGFnZURhdGEoY29uZmlnKVxuICAgIHRoaXMuaHRtbE1vbml0b3JpbmdBdHRyaWJ1dGUgPSBcIm1vbml0b3JpbmctaW50ZXJhY3Rpb25zXCJcbiAgICB0aGlzLmV4dHJhY3Rvckxpc3QgPSBjb25maWdMb2FkZXIuZXh0cmFjdG9yTGlzdFxuICAgIC8vIE9ubHkgaW5pdGlhbGl6ZSBtb25pdG9yIGlmIHRoZSBVUkwgbWF0Y2hlcyBhbmRcbiAgICAvLyB0aGUgY29udGVudCBvZiB0aGUgcGFnZSBpcyB2aXNpYmxlXG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gPT09IGNvbmZpZy5iYXNlVVJMKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImluaXRpYWxpemluZyBNb25pdG9yIGZvclwiLCBjb25maWcuYmFzZVVSTClcbiAgICAgIHRoaXMuaW50aXRpYWxpemVXaGVuVmlzaWJsZSgpXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbnRpdGlhbGl6ZVdoZW5WaXNpYmxlKCk6IHZvaWQge1xuICAgIGNvbnN0IHJ1bldoZW5WaXNpYmxlID0gKCkgPT4ge1xuICAgICAgaWYgKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gXCJ2aXNpYmxlXCIpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplTW9uaXRvcigpXG4gICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInZpc2liaWxpdHljaGFuZ2VcIiwgcnVuV2hlblZpc2libGUpXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgaW5pdGlhbGl6aW5nIG1vbml0b3I6XCIsIGVycm9yKVxuICAgICAgICAgICAgLy8gU3RpbGwgcmVtb3ZlIGxpc3RlbmVyIGV2ZW4gaWYgdGhlcmUncyBhbiBlcnJvclxuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInZpc2liaWxpdHljaGFuZ2VcIiwgcnVuV2hlblZpc2libGUpXG4gICAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiKSB7XG4gICAgICBydW5XaGVuVmlzaWJsZSgpIC8vIFRoaXMgd2lsbCBub3cgYmUgc3luY2hyb25vdXNcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcbiAgICAgICAgcnVuV2hlblZpc2libGUoKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidmlzaWJpbGl0eWNoYW5nZVwiLCBydW5XaGVuVmlzaWJsZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgbW9uaXRvclxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyBpbml0aWFsaXplTW9uaXRvcigpIHtcbiAgICB0aGlzLmN1cnJlbnRQYWdlRGF0YS51cGRhdGUoZG9jdW1lbnQubG9jYXRpb24uaHJlZilcbiAgICB0cnkge1xuICAgICAgLy8gQ3JlYXRlcyBhIG5ldyBlbnRyeSBpbiB0aGUgREIgZGVzY3JpYmluZyB0aGUgc3RhdGUgYXQgdGhlIHN0YXJ0IG9mIHRoZSBzZXNzaW9uXG4gICAgICBhd2FpdCB0aGlzLmluaXRpYWxpemVTZXNzaW9uKClcbiAgICAgIC8vIEJpbmRzIGxpc3RlbmVycyB0byB0aGUgSFRNTCBlbGVtZW50cyBzcGVjaWZpZWQgaW4gdGhlIGNvbmZpZyBmb3IgYWxsIG1hdGNoaW5nIHBhdGggcGF0dGVybnNcbiAgICAgIHRoaXMuYmluZEV2ZW50cygpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIGluaXRpYWxpemUgc2Vzc2lvbjpcIiwgZXJyKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGVudHJ5IGluIHRoZSBEQiBkZXNjcmliaW5nIHRoZSBzdGF0ZSBhdCB0aGUgc3RhcnQgb2YgdGhlIHNlc3Npb25cbiAgICovXG4gIHByaXZhdGUgYXN5bmMgaW5pdGlhbGl6ZVNlc3Npb24oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgY3VycmVudFN0YXRlOiBEQkRvY3VtZW50ID0gbmV3IFNlc3Npb25Eb2N1bWVudChcbiAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkwsXG4gICAgICBkb2N1bWVudC50aXRsZSxcbiAgICApXG4gICAgY29uc29sZS5sb2coXCJDaGVja2luZyBoaWdobGlnaHRcIilcbiAgICBjb25zdCByZXNwb25zZTogTWVzc2FnZVJlc3BvbnNlIHwgbnVsbCA9IGF3YWl0IHRoaXMuc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoXG4gICAgICBTZW5kZXJNZXRob2QuSW5pdGlhbGl6ZVNlc3Npb24sXG4gICAgICBjdXJyZW50U3RhdGUsXG4gICAgKVxuICAgIGlmIChcbiAgICAgIHJlc3BvbnNlICYmXG4gICAgICByZXNwb25zZT8uc3RhdHVzID09PSBcIlNlc3Npb24gaW5pdGlhbGl6ZWRcIiAmJlxuICAgICAgcmVzcG9uc2UuaGlnaGxpZ2h0XG4gICAgKSB7XG4gICAgICB0aGlzLmVuYWJsZUhpZ2hsaWdodGluZyA9IHJlc3BvbnNlLmhpZ2hsaWdodFxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhgSGlnaGxpZ2h0IGlzIHNldCB0byAke3RoaXMuZW5hYmxlSGlnaGxpZ2h0aW5nfWApXG4gIH1cblxuICAvKipcbiAgICogQmluZHMgZXZlbnQgbGlzdGVuZXJzIGZvciBtdXRhdGlvbnMgYW5kIG5hdmlnYXRpb25cbiAgICovXG5cbiAgcHJpdmF0ZSBiaW5kRXZlbnRzKCk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKFwiYmluZGluZyBldmVudHNcIilcbiAgICB0aGlzLmFkZExpc3RlbmVyc1RvTmV3TWF0Y2hlcygpXG4gICAgLy8gV2hlbmV2ZXIgbmV3IGNvbnRlbnQgaXMgbG9hZGVkLCBhdHRhY2ggb2JzZXJ2ZXJzIHRvIGVhY2ggSFRNTCBlbGVtZW50IHRoYXQgbWF0Y2hlcyB0aGUgc2VsZWN0b3JzIGluIHRoZSBjb25maWdzXG4gICAgY29uc3Qgb2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PlxuICAgICAgdGhpcy5hZGRMaXN0ZW5lcnNUb05ld01hdGNoZXMoKSxcbiAgICApXG4gICAgLy8gTWFrZSB0aGUgbXV0YXRpb24gb2JzZXJ2ZXIgb2JzZXJ2ZSB0aGUgZW50aXJlIGRvY3VtZW50IGZvciBjaGFuZ2VzXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7XG4gICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgIH0pXG4gICAgY29uc29sZS5sb2coXCJhZGRpbmcgbmF2aWdhdGlvbiBsaXN0ZW5lclwiKVxuICAgIC8vIEFkZCBhbiBldmVudCBsaXN0ZW5lciB0byBkZXRlY3QgbmF2aWdhdGlvbnMgb24gdGhlIHBhZ2VcbiAgICBuYXZpZ2F0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJuYXZpZ2F0ZVwiLCAoZTogTmF2aWdhdGlvbkV2ZW50KSA9PlxuICAgICAgdGhpcy5vbk5hdmlnYXRpb25EZXRlY3Rpb24oZSksXG4gICAgKVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgbGlzdGVuZXJzIHRvIG11dGF0aW9ucyAoaWUuIG5ld2x5IHJlbmRlcmVkIGVsZW1lbnRzKSBhbmQgbWFya3MgdGhlbSB3aXRoIHRoaXMuaW50ZXJhY3R0aW9uQXR0cmlidXRlLlxuICAgKiBJZiBkZWJ1ZyBtb2RlIGlzIG9uLCB0aGlzIHdpbGwgYWRkIGEgY29sb3VyZnVsIGJvcmRlciB0byB0aGVzZSBlbGVtZW50cy5cbiAgICovXG5cbiAgcHJpdmF0ZSBhZGRMaXN0ZW5lcnNUb05ld01hdGNoZXMoKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coXCJhZGRpbmcgc2VsZWN0b3JzXCIpO1xuICAgIGNvbnNvbGUubG9nKFwiQ3VycmVudCBwYWdlIGRhdGE6XCIpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuY3VycmVudFBhZ2VEYXRhKTtcbiAgICB0aGlzLmN1cnJlbnRQYWdlRGF0YS5zZWxlY3Rvck5hbWVQYWlycy5mb3JFYWNoKChzZWxlY3Rvck5hbWVQYWlyKSA9PiB7XG4gICAgICBjb25zdCBlbGVtZW50czogTm9kZUxpc3RPZjxIVE1MRWxlbWVudD4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICBgOmlzKCR7c2VsZWN0b3JOYW1lUGFpci5zZWxlY3Rvcn0pOm5vdChbJHt0aGlzLmh0bWxNb25pdG9yaW5nQXR0cmlidXRlfV0pYCxcbiAgICAgIClcbiAgICAgIGNvbnN0IG5hbWU6IHN0cmluZyA9IHNlbGVjdG9yTmFtZVBhaXIubmFtZVxuICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XG4gICAgICAgIGlmICh0aGlzLmVuYWJsZUhpZ2hsaWdodGluZykge1xuICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm9yZGVyID0gYDJweCBzb2xpZCAke3RoaXMuU3RyaW5nVG9Db2xvci5uZXh0KG5hbWUpfWBcbiAgICAgICAgfVxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSh0aGlzLmh0bWxNb25pdG9yaW5nQXR0cmlidXRlLCBcInRydWVcIilcblxuICAgICAgICBmb3IgKGNvbnN0IGllIG9mIHRoaXMuaHRtbEV2ZW50c1RvTW9uaXRvcikge1xuICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIGllLFxuICAgICAgICAgICAgKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMub25JbnRlcmFjdGlvbkRldGVjdGlvbihlbGVtZW50LCBlLCBuYW1lKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0LlxuICAgKiBAcGFyYW0gYWN0aXZpdHlUeXBlIC0gIHRoZSB0eXBlIG9mIGFjdGl2aXR5IChzZWxmIGxvb3Agb3Igc3RhdGUgY2hhbmdlKVxuICAgKiBAcGFyYW0gZXZlbnQgLSB0aGUgSFRNTCBldmVudCB0aGF0IG9jY3VyZWRcbiAgICpcbiAgICogQHJldHVybnMgQSBkb2N1bWVudCBkZXNjcmliaW5nIHNlbGYgbG9vcFxuICAgKi9cblxuICBwcml2YXRlIGNyZWF0ZU5hdmlnYXRpb25SZWNvcmQoXG4gICAgYWN0aXZpdHlUeXBlOiBBY3Rpdml0eVR5cGUsXG4gICAgZXZlbnQ6IEV2ZW50LFxuICApOiBEQkRvY3VtZW50IHtcbiAgICBjb25zdCBtZXRhZGF0YSA9IHRoaXMuZXh0cmFjdG9yTGlzdC5leHRyYWN0KFxuICAgICAgdGhpcy5jdXJyZW50UGFnZURhdGEuY3VycmVudFVSTCwgLy8gcnVucyBmb3IgXCJwcmV2IHBhZ2VcIlxuICAgICAgU2VuZGVyTWV0aG9kLk5hdmlnYXRpb25EZXRlY3Rpb24sXG4gICAgKVxuICAgIGNvbnNvbGUubG9nKFwicHJpbnRpbmcgbWV0YWRhdGFcIilcbiAgICBjb25zb2xlLmxvZyhtZXRhZGF0YSlcbiAgICByZXR1cm4gbmV3IEFjdGl2aXR5RG9jdW1lbnQoXG4gICAgICBhY3Rpdml0eVR5cGUsXG4gICAgICBldmVudCxcbiAgICAgIG1ldGFkYXRhLFxuICAgICAgdGhpcy5jdXJyZW50UGFnZURhdGEuY3VycmVudFVSTCxcbiAgICAgIGRvY3VtZW50LnRpdGxlLFxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0LlxuICAgKiBAcGFyYW0gZWxlbWVudCAtIHRoZSBlbGVtZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBldmVudFxuICAgKiBAcGFyYW0gbmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBlbGVtZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBjYWxsYmFjayAoYXMgZGVmaW5lZCBpbiB0aGUgY29uZmlnKVxuICAgKiBAcGFyYW0gZXZlbnQgLSB0aGUgSFRNTCBldmVudCB0aGF0IG9jY3VyZWRcbiAgICogQHJldHVybnMgQSBkb2N1bWVudCBpbnRlcmFjdGlvbiBzZWxmIGxvb3BcbiAgICovXG5cbiAgcHJpdmF0ZSBjcmVhdGVJbnRlcmFjdGlvblJlY29yZChuYW1lOiBzdHJpbmcsIGV2ZW50OiBFdmVudCk6IERCRG9jdW1lbnQge1xuICAgIGNvbnNvbGUubG9nKFwiRGV0ZWN0ZWQgaW50ZXJhY3Rpb24gZXZlbnRcIilcbiAgICBjb25zdCBwYWdlU3BlY2lmaWNEYXRhOiBvYmplY3QgPSB7XG4gICAgICBlbGVtZW50TmFtZTogbmFtZSxcbiAgICB9XG4gICAgY29uc3QgZXh0cmFjdGVkRGF0YSA9IHRoaXMuZXh0cmFjdG9yTGlzdC5leHRyYWN0KFxuICAgICAgdGhpcy5jdXJyZW50UGFnZURhdGEuY3VycmVudFVSTCxcbiAgICAgIFNlbmRlck1ldGhvZC5JbnRlcmFjdGlvbkRldGVjdGlvbixcbiAgICApXG5cbiAgICBjb25zdCBtZXRhZGF0YTogRXh0cmFjdGVkTWV0YWRhdGEgPSB7XG4gICAgICAuLi5wYWdlU3BlY2lmaWNEYXRhLFxuICAgICAgLi4uKGV4dHJhY3RlZERhdGEgYXMgb2JqZWN0KSxcbiAgICB9IGFzIEV4dHJhY3RlZE1ldGFkYXRhXG5cbiAgICBjb25zb2xlLmxvZyhcInByaW50aW5nIG1ldGFkYXRhXCIpXG4gICAgY29uc29sZS5sb2cobWV0YWRhdGEpXG5cbiAgICByZXR1cm4gbmV3IEFjdGl2aXR5RG9jdW1lbnQoXG4gICAgICBBY3Rpdml0eVR5cGUuSW50ZXJhY3Rpb24sXG4gICAgICBldmVudCxcbiAgICAgIG1ldGFkYXRhLFxuICAgICAgdGhpcy5jdXJyZW50UGFnZURhdGEuY3VycmVudFVSTCxcbiAgICAgIGRvY3VtZW50LnRpdGxlLFxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0LlxuICAgKiBAcGFyYW0gc2VuZGVyTWV0aG9kIC0gdGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uIHRoYXQncyBzZW5kaW5nIHRoZSBtZXNzYWdlIHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdFxuICAgKiBAcGFyYW0gcGF5bG9hZCAtIHRoZSBkYXRhIGJlaW5nIHNlbnQgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0XG4gICAqXG4gICAqIEByZXR1cm5zIFJlc3BvbnNlIGluZGljYXRpbmcgd2hldGhlciB0aGUgbWVzc2FnZSBzdWNjZWVkZWRcbiAgICovXG5cbiAgcHJpdmF0ZSBhc3luYyBzZW5kTWVzc2FnZVRvQmFja2dyb3VuZChcbiAgICBzZW5kZXJNZXRob2Q6IFNlbmRlck1ldGhvZCxcbiAgICBwYXlsb2FkOiBEQkRvY3VtZW50LFxuICApOiBQcm9taXNlPE1lc3NhZ2VSZXNwb25zZSB8IG51bGw+IHtcbiAgICB0cnkge1xuICAgICAgLy8gQ2hlY2sgaWYgcnVudGltZSBpcyBhdmFpbGFibGUgKGV4dGVuc2lvbiBjb250ZXh0IHN0aWxsIHZhbGlkKVxuICAgICAgaWYgKCFjaHJvbWUucnVudGltZT8uaWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXh0ZW5zaW9uIGNvbnRleHQgaW52YWxpZGF0ZWRcIilcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWVzc2FnZTogTWVzc2FnZVRvQmFja2dyb3VuZCA9IG5ldyBNZXNzYWdlVG9CYWNrZ3JvdW5kKFxuICAgICAgICBzZW5kZXJNZXRob2QsXG4gICAgICAgIHBheWxvYWQsXG4gICAgICApXG4gICAgICBjb25zdCByZXNwb25zZTogTWVzc2FnZVJlc3BvbnNlID1cbiAgICAgICAgYXdhaXQgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UobWVzc2FnZSlcblxuICAgICAgLy8gQ2hyb21lIHJldHVybnMgdW5kZWZpbmVkIGlmIG5vIGxpc3RlbmVycywgY2hlY2sgaWYgdGhhdCdzIGV4cGVjdGVkXG4gICAgICBpZiAocmVzcG9uc2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiTm8gcmVzcG9uc2UgZnJvbSBiYWNrZ3JvdW5kIHNjcmlwdFwiKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJCYWNrZ3JvdW5kIG1lc3NhZ2UgZmFpbGVkOlwiLCBlcnJvcilcbiAgICAgIC8vIERlY2lkZSB3aGV0aGVyIHRvIHRocm93IG9yIGhhbmRsZSBncmFjZWZ1bGx5IGJhc2VkIG9uIHlvdXIgbmVlZHNcbiAgICAgIHJldHVybiBudWxsIC8vIG9yIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0aGF0IGNyZWF0ZXMgYSBwYXlsb2FkIGRlc2NyaWJpbmcgdGhlIGludGVyYWN0aW9uIHRoYXQgb2NjdXJlZCBhbmQgc2VuZHMgaXQgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0XG4gICAqIEBwYXJhbSBlbGVtZW50IC0gdGhlIGV2ZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBjYWxsYmFja1xuICAgKiBAcGFyYW0gbmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBlbGVtZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBjYWxsYmFjayAoYXMgZGVmaW5lZCBpbiB0aGUgY29uZmlnKVxuICAgKi9cblxuICBwcml2YXRlIG9uSW50ZXJhY3Rpb25EZXRlY3Rpb24oXG4gICAgZWxlbWVudDogRWxlbWVudCxcbiAgICBldmVudDogRXZlbnQsXG4gICAgbmFtZTogc3RyaW5nLFxuICApOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZyhcImludGVyYWN0aW9uIGV2ZW50IGRldGVjdGVkXCIpXG4gICAgY29uc29sZS5sb2coYEV2ZW50IGRldGVjdGVkIHdpdGggZXZlbnQgdHlwZTogJHtldmVudC50eXBlfWApXG4gICAgY29uc29sZS5sb2coYEV2ZW50IHRyaWdnZXJlZCBieWAsIGVsZW1lbnQpXG4gICAgLy8gY29uc29sZS5sb2coZWxlbWVudC5pbm5lckhUTUwpO1xuICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnQuZ2V0SFRNTCgpKTtcbiAgICBjb25zdCByZWNvcmQ6IERCRG9jdW1lbnQgPSB0aGlzLmNyZWF0ZUludGVyYWN0aW9uUmVjb3JkKG5hbWUsIGV2ZW50KVxuICAgIHRoaXMuc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoXG4gICAgICBTZW5kZXJNZXRob2QuSW50ZXJhY3Rpb25EZXRlY3Rpb24sXG4gICAgICByZWNvcmQsXG4gICAgKS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gc2VuZCBpbnRlcmFjdGlvbiBkYXRhOlwiLCBlcnJvcilcbiAgICB9KVxuICB9XG5cbiAgcHJpdmF0ZSBpc05ld0Jhc2VVUkwobmV3VVJMOiBzdHJpbmcgfCBudWxsKTogYm9vbGVhbiB7XG4gICAgY29uc29sZS5sb2coXCJjaGVja2luZyBpZiB1cmwgdXBkYXRlZFwiKVxuICAgIGlmIChuZXdVUkwgPT09IG51bGwpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwibmV3IHVybCBpcyBudWxsXCIpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgY29uc3QgY3VycmVudEhvc3RuYW1lID0gbmV3IFVSTCh0aGlzLmN1cnJlbnRQYWdlRGF0YS5jdXJyZW50VVJMKS5ob3N0bmFtZVxuICAgIGNvbnN0IG5ld0hvc3RuYW1lID0gbmV3IFVSTChuZXdVUkwpLmhvc3RuYW1lXG5cbiAgICBjb25zb2xlLmxvZyhcImN1cnJlbnQgaG9zdG5hbWVcIiwgY3VycmVudEhvc3RuYW1lKVxuICAgIGNvbnNvbGUubG9nKFwibmV3IGhvc3RuYW1lXCIsIG5ld0hvc3RuYW1lKVxuXG4gICAgcmV0dXJuIGN1cnJlbnRIb3N0bmFtZSAhPT0gbmV3SG9zdG5hbWVcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0aGF0IGNyZWF0ZXMgYSBwYXlsb2FkIGRlc2NyaWJpbmcgdGhlIG5hdmlnYXRpb24gdGhhdCBvY2N1cmVkIGFuZCBzZW5kcyBpdCB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHRcbiAgICogQHBhcmFtIG5hdkV2ZW50IC0gdGhlIGV2ZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBjYWxsYmFja1xuICAgKi9cbiAgcHJpdmF0ZSBvbk5hdmlnYXRpb25EZXRlY3Rpb24obmF2RXZlbnQ6IE5hdmlnYXRpb25FdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGRlc3RVcmw6IHN0cmluZyB8IG51bGwgPSBuYXZFdmVudC5kZXN0aW5hdGlvbi51cmxcbiAgICBjb25zdCBiYXNlVVJMQ2hhbmdlOiBib29sZWFuID0gdGhpcy5pc05ld0Jhc2VVUkwoZGVzdFVybClcbiAgICBsZXQgcmVjb3JkOiBEQkRvY3VtZW50IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG4gICAgbGV0IHNlbmRlcjogU2VuZGVyTWV0aG9kIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG5cbiAgICBjb25zb2xlLmxvZyhcbiAgICAgIGBiZWZvcmUgY3JlYXRpbmcgbmF2IHJlY29yZCwgY3VycmVudCBVUkwgaXMgJHt0aGlzLmN1cnJlbnRQYWdlRGF0YS5jdXJyZW50VVJMfWAsXG4gICAgKVxuICAgIGlmIChiYXNlVVJMQ2hhbmdlKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIlVSTCBiYXNlIGNoYW5nZSBkZXRlY3RlZC4gQ2xvc2luZyBwcm9ncmFtLlwiKVxuICAgICAgcmVjb3JkID0gbmV3IERCRG9jdW1lbnQodGhpcy5jdXJyZW50UGFnZURhdGEuY3VycmVudFVSTCwgZG9jdW1lbnQudGl0bGUpXG4gICAgICBzZW5kZXIgPSBTZW5kZXJNZXRob2QuQ2xvc2VTZXNzaW9uXG4gICAgfSBlbHNlIGlmIChuYXZFdmVudC5uYXZpZ2F0aW9uVHlwZSA9PT0gXCJwdXNoXCIpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiUHVzaCBldmVudCBkZXRlY3RlZC5cIilcbiAgICAgIHJlY29yZCA9IHRoaXMuY3JlYXRlTmF2aWdhdGlvblJlY29yZChBY3Rpdml0eVR5cGUuU3RhdGVDaGFuZ2UsIG5hdkV2ZW50KVxuICAgICAgc2VuZGVyID0gU2VuZGVyTWV0aG9kLk5hdmlnYXRpb25EZXRlY3Rpb25cbiAgICB9IGVsc2UgaWYgKG5hdkV2ZW50Lm5hdmlnYXRpb25UeXBlID09PSBcInJlcGxhY2VcIikge1xuICAgICAgY29uc29sZS5sb2coXCJSZXBsYWNlIGV2ZW50IGRldGVjdGVkLlwiKVxuICAgICAgcmVjb3JkID0gdGhpcy5jcmVhdGVOYXZpZ2F0aW9uUmVjb3JkKEFjdGl2aXR5VHlwZS5TZWxmTG9vcCwgbmF2RXZlbnQpXG4gICAgICBzZW5kZXIgPSBTZW5kZXJNZXRob2QuTmF2aWdhdGlvbkRldGVjdGlvblxuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKFxuICAgICAgYGFmdGVyIGNyZWF0aW5nIG5hdiByZWNvcmQsIGN1cnJlbnQgVVJMIGlzICR7dGhpcy5jdXJyZW50UGFnZURhdGEuY3VycmVudFVSTH1gLFxuICAgIClcblxuICAgIGlmIChkZXN0VXJsKSB7XG4gICAgICB0aGlzLmN1cnJlbnRQYWdlRGF0YS51cGRhdGUoZGVzdFVybClcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhcbiAgICAgIGBhdCBlbmQgb2Ygb24gbmF2IGRldGVjdCwgY3VycmVudCBVUkwgaXMgJHt0aGlzLmN1cnJlbnRQYWdlRGF0YS5jdXJyZW50VVJMfWAsXG4gICAgKVxuXG4gICAgaWYgKHR5cGVvZiByZWNvcmQgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIHNlbmRlciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5zZW5kTWVzc2FnZVRvQmFja2dyb3VuZChzZW5kZXIsIHJlY29yZCkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gc2VuZCBpbnRlcmFjdGlvbiBkYXRhOlwiLCBlcnJvcilcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhIHVuaXF1ZSBjb2xvciBmcm9tIGEgZ2l2ZW4gc3RyaW5nXG4gICAqIFNvdXJjZTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzMxMDM3MzgzXG4gICAqIEByZXR1cm5zIENvbG9yIGhleCBjb2RlXG4gICAqL1xuXG4gIHByaXZhdGUgU3RyaW5nVG9Db2xvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgaW50ZXJmYWNlIENvbG9ySW5zdGFuY2Uge1xuICAgICAgc3RyaW5nVG9Db2xvckhhc2g6IFJlY29yZDxzdHJpbmcsIHN0cmluZz5cbiAgICAgIG5leHRWZXJ5RGlmZmVybnRDb2xvcklkeDogbnVtYmVyXG4gICAgICB2ZXJ5RGlmZmVyZW50Q29sb3JzOiBzdHJpbmdbXVxuICAgIH1cblxuICAgIGxldCBpbnN0YW5jZTogQ29sb3JJbnN0YW5jZSB8IG51bGwgPSBudWxsXG5cbiAgICByZXR1cm4ge1xuICAgICAgbmV4dDogZnVuY3Rpb24gc3RyaW5nVG9Db2xvcihzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGluc3RhbmNlID8/PSB7XG4gICAgICAgICAgc3RyaW5nVG9Db2xvckhhc2g6IHt9LFxuICAgICAgICAgIG5leHRWZXJ5RGlmZmVybnRDb2xvcklkeDogMCxcbiAgICAgICAgICB2ZXJ5RGlmZmVyZW50Q29sb3JzOiBbXG4gICAgICAgICAgICBcIiMwMEZGMDBcIixcbiAgICAgICAgICAgIFwiIzAwMDBGRlwiLFxuICAgICAgICAgICAgXCIjRkYwMDAwXCIsXG4gICAgICAgICAgICBcIiMwMUZGRkVcIixcbiAgICAgICAgICAgIFwiI0ZGQTZGRVwiLFxuICAgICAgICAgICAgXCIjRkZEQjY2XCIsXG4gICAgICAgICAgICBcIiMwMDY0MDFcIixcbiAgICAgICAgICAgIFwiIzAxMDA2N1wiLFxuICAgICAgICAgICAgXCIjOTUwMDNBXCIsXG4gICAgICAgICAgICBcIiMwMDdEQjVcIixcbiAgICAgICAgICAgIFwiI0ZGMDBGNlwiLFxuICAgICAgICAgICAgXCIjRkZFRUU4XCIsXG4gICAgICAgICAgICBcIiM3NzREMDBcIixcbiAgICAgICAgICAgIFwiIzkwRkI5MlwiLFxuICAgICAgICAgICAgXCIjMDA3NkZGXCIsXG4gICAgICAgICAgICBcIiNENUZGMDBcIixcbiAgICAgICAgICAgIFwiI0ZGOTM3RVwiLFxuICAgICAgICAgICAgXCIjNkE4MjZDXCIsXG4gICAgICAgICAgICBcIiNGRjAyOURcIixcbiAgICAgICAgICAgIFwiI0ZFODkwMFwiLFxuICAgICAgICAgICAgXCIjN0E0NzgyXCIsXG4gICAgICAgICAgICBcIiM3RTJERDJcIixcbiAgICAgICAgICAgIFwiIzg1QTkwMFwiLFxuICAgICAgICAgICAgXCIjRkYwMDU2XCIsXG4gICAgICAgICAgICBcIiNBNDI0MDBcIixcbiAgICAgICAgICAgIFwiIzAwQUU3RVwiLFxuICAgICAgICAgICAgXCIjNjgzRDNCXCIsXG4gICAgICAgICAgICBcIiNCREM2RkZcIixcbiAgICAgICAgICAgIFwiIzI2MzQwMFwiLFxuICAgICAgICAgICAgXCIjQkREMzkzXCIsXG4gICAgICAgICAgICBcIiMwMEI5MTdcIixcbiAgICAgICAgICAgIFwiIzlFMDA4RVwiLFxuICAgICAgICAgICAgXCIjMDAxNTQ0XCIsXG4gICAgICAgICAgICBcIiNDMjhDOUZcIixcbiAgICAgICAgICAgIFwiI0ZGNzRBM1wiLFxuICAgICAgICAgICAgXCIjMDFEMEZGXCIsXG4gICAgICAgICAgICBcIiMwMDQ3NTRcIixcbiAgICAgICAgICAgIFwiI0U1NkZGRVwiLFxuICAgICAgICAgICAgXCIjNzg4MjMxXCIsXG4gICAgICAgICAgICBcIiMwRTRDQTFcIixcbiAgICAgICAgICAgIFwiIzkxRDBDQlwiLFxuICAgICAgICAgICAgXCIjQkU5OTcwXCIsXG4gICAgICAgICAgICBcIiM5NjhBRThcIixcbiAgICAgICAgICAgIFwiI0JCODgwMFwiLFxuICAgICAgICAgICAgXCIjNDMwMDJDXCIsXG4gICAgICAgICAgICBcIiNERUZGNzRcIixcbiAgICAgICAgICAgIFwiIzAwRkZDNlwiLFxuICAgICAgICAgICAgXCIjRkZFNTAyXCIsXG4gICAgICAgICAgICBcIiM2MjBFMDBcIixcbiAgICAgICAgICAgIFwiIzAwOEY5Q1wiLFxuICAgICAgICAgICAgXCIjOThGRjUyXCIsXG4gICAgICAgICAgICBcIiM3NTQ0QjFcIixcbiAgICAgICAgICAgIFwiI0I1MDBGRlwiLFxuICAgICAgICAgICAgXCIjMDBGRjc4XCIsXG4gICAgICAgICAgICBcIiNGRjZFNDFcIixcbiAgICAgICAgICAgIFwiIzAwNUYzOVwiLFxuICAgICAgICAgICAgXCIjNkI2ODgyXCIsXG4gICAgICAgICAgICBcIiM1RkFENEVcIixcbiAgICAgICAgICAgIFwiI0E3NTc0MFwiLFxuICAgICAgICAgICAgXCIjQTVGRkQyXCIsXG4gICAgICAgICAgICBcIiNGRkIxNjdcIixcbiAgICAgICAgICAgIFwiIzAwOUJGRlwiLFxuICAgICAgICAgICAgXCIjRTg1RUJFXCIsXG4gICAgICAgICAgXSxcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaW5zdGFuY2Uuc3RyaW5nVG9Db2xvckhhc2hbc3RyXSkge1xuICAgICAgICAgIGluc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoW3N0cl0gPVxuICAgICAgICAgICAgaW5zdGFuY2UudmVyeURpZmZlcmVudENvbG9yc1tpbnN0YW5jZS5uZXh0VmVyeURpZmZlcm50Q29sb3JJZHgrK11cbiAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIGAlYyBUaGUgY29sb3VyIGZvciAke3N0cn1gLFxuICAgICAgICAgICAgYGNvbG9yOiAke2luc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoW3N0cl19YCxcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoW3N0cl1cbiAgICAgIH0sXG4gICAgfVxuICB9KSgpXG59XG4iLCJpbXBvcnQgeyBVUkxQYXR0ZXJuVG9TZWxlY3RvcnMsIFNlbGVjdG9yTmFtZVBhaXIsIENvbmZpZyB9IGZyb20gXCIuL2NvbmZpZ1wiXG4vKipcbiAqIEEgY2xhc3MgcmVzcG9uc2libGUgZm9yIHRyYWNraW5nIHRoZSBzdGF0ZSBvZiB0aGUgcGFnZSB0aGF0IHRoZSB1c2VyIGlzIGN1cnJlbnRseSBvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIFBhZ2VEYXRhIHtcbiAgLy8gQ3VycmVudCBVUkwgb2YgdGhlIHBhZ2VcbiAgY3VycmVudFVSTCE6IHN0cmluZ1xuICAvLyBDU1Mgc2VsZWN0b3JzIGJlaW5nIGFwcGxpZWQgdG8gdGhlIHBhZ2VcbiAgc2VsZWN0b3JOYW1lUGFpcnMhOiBTZWxlY3Rvck5hbWVQYWlyW11cbiAgYmFzZVVSTDogc3RyaW5nXG4gIHVybFBhdHRlcm5Ub1NlbGVjdG9yRGF0YTogVVJMUGF0dGVyblRvU2VsZWN0b3JzXG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBDb25maWcpIHtcbiAgICB0aGlzLnVybFBhdHRlcm5Ub1NlbGVjdG9yRGF0YSA9IGNvbmZpZy5wYXRoc1xuICAgIHRoaXMuYmFzZVVSTCA9IGNvbmZpZy5iYXNlVVJMXG4gIH1cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIFVSTCBhbmQgdGhlIGxpc3Qgb2YgQ1NTIHNlbGVjdG9ycyBmb3IgdGhlIFVSTFxuICAgKiBAcGFyYW0gbmV3VVJMOiBUaGUgZnVsbCB1cmwgb2YgdGhlIGN1cnJlbnQgcGFnZVxuICAgKi9cbiAgdXBkYXRlKG5ld1VSTDogc3RyaW5nKSB7XG4gICAgdGhpcy5jdXJyZW50VVJMID0gbmV3VVJMXG4gICAgY29uc3QgbWF0Y2hpbmdVUkxQYXR0ZXJuczogc3RyaW5nW10gPSB0aGlzLmdldE1hdGNoaW5nUGF0dGVybnMoKVxuICAgIHRoaXMuc2VsZWN0b3JOYW1lUGFpcnMgPSB0aGlzLmdldFNlbGVjdG9yTmFtZVBhaXJzKG1hdGNoaW5nVVJMUGF0dGVybnMpXG4gIH1cbiAgLyoqXG4gICAqIFNldHMgYG1hdGNoUGF0aERhdGFgIHRvIGJlIHRoZSBQYXRoRGF0YSBmb3IgdGhlIFVSTCBwYXR0ZXJuIHdpdGggdGhlIGNsb3NldCBtYXRjaCB0byBgdGhpcy5iYXNlVVJMYFxuICAgKiBhbmQgcmV0dXJucyBhIGxpc3Qgb2YgYWxsIG1hdGNoZXMuIEFkZGl0aW9uYWxseSwgaXQgdXBkYXRlcyB3aGV0aGVyIHRoZSBjdXJyZW50IHBhdGhcbiAgICogaW5jbHVkZXMgYW4gaWQuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgbGlzdCBvZiBhbGwgcGF0dGVybnMgaW4gdGhlIGNvbmZpZyB0aGF0IG1hdGNoIGBiYXNlVVJMYFxuICAgKi9cblxuICBwcml2YXRlIGdldE1hdGNoaW5nUGF0dGVybnMoKTogc3RyaW5nW10ge1xuICAgIGNvbnNvbGUubG9nKFwidXBkYXRpbmcgcGFnZSBkYXRhXCIpXG5cbiAgICAvLyBHZXQgYSBsaXN0IG9mIGFsbCB0aGUgcGF0aHMgdGhhdCBtYXRjaCB0aGUgY3VycmVudCBVUkxcbiAgICBjb25zdCBtYXRjaGluZ1VSTFBhdHRlcm5zOiBzdHJpbmdbXSA9IE9iamVjdC5rZXlzKFxuICAgICAgdGhpcy51cmxQYXR0ZXJuVG9TZWxlY3RvckRhdGEsXG4gICAgKS5maWx0ZXIoKHBhdGgpID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHBhdGgpO1xuICAgICAgY29uc3QgcGF0dGVybjogVVJMUGF0dGVybiA9IG5ldyBVUkxQYXR0ZXJuKHBhdGgsIHRoaXMuYmFzZVVSTClcbiAgICAgIGNvbnN0IG1hdGNoOiBib29sZWFuID0gcGF0dGVybi50ZXN0KHRoaXMuY3VycmVudFVSTClcbiAgICAgIHJldHVybiBtYXRjaFxuICAgIH0pXG5cbiAgICBpZiAobWF0Y2hpbmdVUkxQYXR0ZXJucy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnNvbGUubG9nKFwibm8gbWF0Y2hlcyBmb3VuZFwiKVxuICAgIH1cblxuICAgIHJldHVybiBtYXRjaGluZ1VSTFBhdHRlcm5zXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIG1hdGNoaW5nVVJMUGF0dGVybnM6IEEgbGlzdCBvZiBhbGwgbWF0Y2hpbmcgcGF0aHMgdG8gdGhlIGN1cnJlbnQgdXJsXG4gICAqXG4gICAqIEByZXR1cm5zIEEgbGlzdCBvZiBhbGwgc2VsZWN0b3JzIGZvciB0aGUgbWF0Y2hpbmcgcGF0aHNcbiAgICovXG5cbiAgcHJpdmF0ZSBnZXRTZWxlY3Rvck5hbWVQYWlycyhcbiAgICBtYXRjaGluZ1VSTFBhdHRlcm5zOiBzdHJpbmdbXSxcbiAgKTogU2VsZWN0b3JOYW1lUGFpcltdIHtcbiAgICBsZXQgY3VycmVudFNlbGVjdG9yTmFtZVBhaXJzOiBTZWxlY3Rvck5hbWVQYWlyW10gPSBbXVxuICAgIGZvciAoY29uc3QgdXJsUGF0dGVybiBvZiBtYXRjaGluZ1VSTFBhdHRlcm5zKSB7XG4gICAgICBjb25zdCBzZWxlY3Rvck5hbWVQYWlyczogU2VsZWN0b3JOYW1lUGFpcltdID1cbiAgICAgICAgdGhpcy51cmxQYXR0ZXJuVG9TZWxlY3RvckRhdGFbdXJsUGF0dGVybl1cbiAgICAgIGN1cnJlbnRTZWxlY3Rvck5hbWVQYWlycyA9XG4gICAgICAgIGN1cnJlbnRTZWxlY3Rvck5hbWVQYWlycy5jb25jYXQoc2VsZWN0b3JOYW1lUGFpcnMpXG4gICAgfVxuICAgIHJldHVybiBjdXJyZW50U2VsZWN0b3JOYW1lUGFpcnNcbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2NvbnRlbnQudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=