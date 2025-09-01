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
        const currentHostname = (new URL(this.currentPageData.currentURL)).hostname;
        const newHostname = (new URL(newURL)).hostname;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFVLENBQUM7WUFDcEQsT0FBTyxLQUFLO1FBQ2QsQ0FBQyxDQUFDO1FBRUYsSUFBSSxtQkFBbUIsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztRQUNqQyxDQUFDO1FBRUQsT0FBTyxtQkFBbUI7SUFDNUIsQ0FBQztJQUVEOzs7O09BSUc7SUFFSyxvQkFBb0IsQ0FDMUIsbUJBQTZCO1FBRTdCLElBQUksd0JBQXdCLEdBQXVCLEVBQUU7UUFDckQsS0FBSyxNQUFNLFVBQVUsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1lBQzdDLE1BQU0saUJBQWlCLEdBQ3JCLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUM7WUFDM0Msd0JBQXdCO2dCQUN0Qix3QkFBd0IsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUM7UUFDdEQsQ0FBQztRQUNELE9BQU8sd0JBQXdCO0lBQ2pDLENBQUM7Q0FDRjtBQW5FRCw0QkFtRUM7Ozs7Ozs7VUN2RUQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvY29tbW9uL2NvbW11bmljYXRpb24vYWN0aXZpdHkudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb21tb24vY29tbXVuaWNhdGlvbi9tZXNzYWdpbmcudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb21tb24vY29tbXVuaWNhdGlvbi9zZW5kZXIudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb21tb24vZGJkb2N1bWVudC50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbnRlbnQudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb250ZW50L2NvbmZpZy50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbnRlbnQvbW9uaXRvci50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbnRlbnQvcGFnZWRhdGEudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBEZWZpbmVzIGEgbGlzdCBvZiB0aGUgcG9zc2libGUgYWN0aXZpdHkgdHlwZXMgdGhhdCBjYW4gYmUgcmVjb3JkZWQgYnkgdGhlIE1vbml0b3IgY2xhc3NcbiAqL1xuZW51bSBBY3Rpdml0eVR5cGUge1xuICBTZWxmTG9vcCA9IFwiU2VsZi1Mb29wXCIsXG4gIFN0YXRlQ2hhbmdlID0gXCJTdGF0ZSBDaGFuZ2VcIixcbiAgSW50ZXJhY3Rpb24gPSBcIkludGVyYWN0aW9uXCIsXG4gIEJvdGggPSBcIkJvdGhcIixcbn1cblxuZXhwb3J0IHsgQWN0aXZpdHlUeXBlIH1cbiIsImltcG9ydCB7IERCRG9jdW1lbnQgfSBmcm9tIFwiLi4vZGJkb2N1bWVudFwiXG5pbXBvcnQgeyBTZW5kZXJNZXRob2QgfSBmcm9tIFwiLi9zZW5kZXJcIlxuZXhwb3J0IHsgTWVzc2FnZVRvQmFja2dyb3VuZCwgTWVzc2FnZVJlc3BvbnNlIH1cbi8qKlxuICogQSBjbGFzcyB1c2VkIHRvIHNlbmQgbWVzc2FnZXMgZnJvbSB0aGUgY29udGVudCB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHQgaW4gYSBjb25zaXN0ZW50IGZvcm1hdC5cbiAqL1xuY2xhc3MgTWVzc2FnZVRvQmFja2dyb3VuZCB7XG4gIHNlbmRlck1ldGhvZDogU2VuZGVyTWV0aG9kXG4gIHBheWxvYWQ6IERCRG9jdW1lbnRcbiAgLyoqXG4gICAqIEBwYXJhbSBzZW5kZXJNZXRob2QgLSBlbnVtIHR5cGUgb2YgdGhlIG1ldGhvZCBzZW5kaW5nIHRoZSBtZXNzYWdlXG4gICAqIEBwYXJhbSBwYXlsb2FkIC0gdGhlIGRhdGEgYmVpbmcgc2VudCB0byB0aGUgZGF0YWJhc2VcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNlbmRlck1ldGhvZDogU2VuZGVyTWV0aG9kLCBwYXlsb2FkOiBEQkRvY3VtZW50KSB7XG4gICAgdGhpcy5zZW5kZXJNZXRob2QgPSBzZW5kZXJNZXRob2RcbiAgICB0aGlzLnBheWxvYWQgPSBwYXlsb2FkXG4gIH1cbn1cblxuaW50ZXJmYWNlIE1lc3NhZ2VSZXNwb25zZSB7XG4gIHN0YXR1czogc3RyaW5nXG4gIGhpZ2hsaWdodD86IGJvb2xlYW5cbn1cbiIsImVudW0gU2VuZGVyTWV0aG9kIHtcbiAgSW5pdGlhbGl6ZVNlc3Npb24gPSBcIkluaXRpYWxpemUgU2Vzc2lvblwiLFxuICBJbnRlcmFjdGlvbkRldGVjdGlvbiA9IFwiSW50ZXJhY3Rpb24gRGV0ZWN0aW9uXCIsXG4gIE5hdmlnYXRpb25EZXRlY3Rpb24gPSBcIk5hdmlnYXRpb24gRGV0ZWN0aW9uXCIsXG4gIENsb3NlU2Vzc2lvbiA9IFwiQ2xvc2UgU2Vzc2lvblwiLFxuICBBbnkgPSBcIkFueVwiLFxufVxuZXhwb3J0IHsgU2VuZGVyTWV0aG9kIH1cbiIsImltcG9ydCB7IEFjdGl2aXR5VHlwZSB9IGZyb20gXCIuL2NvbW11bmljYXRpb24vYWN0aXZpdHlcIlxuLyoqXG4gKiBBIGNsYXNzIGRlZmluaW5nIGRvY3VtZW50cyB0aGF0IGFyZSBzZW50IHRvIHRoZSBkYXRhYmFzZSBmcm9tIHRoZSBjb250ZW50IHNjcmlwdFxuICovXG5jbGFzcyBEQkRvY3VtZW50IHtcbiAgLy8gVVJMIGF0IHdoaWNodCB0aGUgZXZlbnQgd2FzIGNyZWF0ZWRcbiAgc291cmNlVVJMOiBzdHJpbmc7XG4gIHNvdXJjZURvY3VtZW50VGl0bGU6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgdGl0bGU6IHN0cmluZykge1xuICAgIHRoaXMuc291cmNlVVJMID0gdXJsXG4gICAgdGhpcy5zb3VyY2VEb2N1bWVudFRpdGxlID0gdGl0bGVcbiAgfVxufVxuXG5pbnRlcmZhY2UgRXh0cmFjdGVkTWV0YWRhdGFPYmplY3Qge1xuICBba2V5OiBzdHJpbmddOiBFeHRyYWN0ZWRNZXRhZGF0YVxufVxuXG50eXBlIEV4dHJhY3RlZE1ldGFkYXRhID1cbiAgfCBzdHJpbmdcbiAgfCBFeHRyYWN0ZWRNZXRhZGF0YVtdXG4gIHwgRXh0cmFjdGVkTWV0YWRhdGFPYmplY3RcbiAgfCBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IC8vIGV4cGxpY2l0bHkgYWxsb3cgb2JqZWN0cyB3aXRoIHN0cmluZyB2YWx1ZXNcblxuLyoqXG4gKiBBIGNoaWxkIG9mIERCRG9jdW1lbnQgdGhhdCByZXByZXNlbnRzIGFjdGl2aXRpZXNcbiAqL1xuXG5jbGFzcyBBY3Rpdml0eURvY3VtZW50IGV4dGVuZHMgREJEb2N1bWVudCB7XG4gIC8vIFRoZSB0eXBlIG9mIGFjdGl2aXR5IGJlaW5nIGxvZ2dlZC4gRWl0aGVyIFwic3RhdGVfY2hhZ2VcIiwgXCJzZWxmX2xvb3BcIiwgb3IgXCJpbnRlcmFjdGlvblwiXG4gIGFjdGl2aXR5VHlwZTogQWN0aXZpdHlUeXBlIHwgc3RyaW5nXG4gIC8vIFRpbWVzdGFtcCBmb3Igd2hlbiB0aGUgZG9jdW1lbnQgd2FzIGNyZWF0ZWRcbiAgY3JlYXRlZEF0OiBEYXRlIHwgc3RyaW5nXG4gIC8vIEV2ZW50IHR5cGUgKGVnLiBjbGljaywgc2Nyb2xsLCBldGMuLi4pXG4gIGV2ZW50VHlwZTogc3RyaW5nXG4gIC8vIE1ldGFkYXRhIGFib3V0IHRoZSBldmVudFxuICBtZXRhZGF0YT86IEV4dHJhY3RlZE1ldGFkYXRhXG4gIGNvbnN0cnVjdG9yKFxuICAgIHR5cGU6IEFjdGl2aXR5VHlwZSxcbiAgICBldmVudDogRXZlbnQsXG4gICAgbWV0YWRhdGE6IEV4dHJhY3RlZE1ldGFkYXRhLFxuICAgIHVybDogc3RyaW5nLFxuICAgIHRpdGxlOiBzdHJpbmcsXG4gICkge1xuICAgIHN1cGVyKHVybCwgdGl0bGUpXG4gICAgdGhpcy5hY3Rpdml0eVR5cGUgPSB0eXBlXG4gICAgdGhpcy5jcmVhdGVkQXQgPSBuZXcgRGF0ZSgpXG4gICAgdGhpcy5ldmVudFR5cGUgPSBldmVudC50eXBlXG4gICAgdGhpcy5tZXRhZGF0YSA9IG1ldGFkYXRhXG4gIH1cbn1cblxuLyoqXG4gKiBBIGNoaWxkIG9mIERCRG9jdW1lbnQgdGhhdCByZXByZXNlbnRzIHRoZSBzdGFydCBvZiBhIHNlc3Npb25cbiAqL1xuXG5jbGFzcyBTZXNzaW9uRG9jdW1lbnQgZXh0ZW5kcyBEQkRvY3VtZW50IHtcbiAgc3RhcnRUaW1lOiBEYXRlIHwgbnVsbFxuICBlbmRUaW1lPzogRGF0ZSB8IG51bGxcbiAgZW1haWw6IFN0cmluZyB8IG51bGwgPSBudWxsXG4gIGNvbnN0cnVjdG9yKHNvdXJjZVVSTDogc3RyaW5nLCBzb3VyY2VEb2N1bWVudFRpdGxlOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzb3VyY2VVUkwsIHNvdXJjZURvY3VtZW50VGl0bGUpXG4gICAgdGhpcy5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpXG4gIH1cbiAgc2V0RW1haWwoZW1haWw6IHN0cmluZykge1xuICAgIHRoaXMuZW1haWwgPSBlbWFpbFxuICB9XG59XG5cbmV4cG9ydCB7IERCRG9jdW1lbnQsIEFjdGl2aXR5RG9jdW1lbnQsIFNlc3Npb25Eb2N1bWVudCwgRXh0cmFjdGVkTWV0YWRhdGEgfVxuIiwiaW1wb3J0IHsgTW9uaXRvciB9IGZyb20gXCIuL2NvbnRlbnQvbW9uaXRvclwiXG5pbXBvcnQgeXRDb25maWcgZnJvbSBcIi4vY29udGVudC9jb25maWdzL3lvdXR1YmVfY29uZmlnLmpzb25cIlxuaW1wb3J0IHBlcnNvbmFsQ29uZmlnIGZyb20gXCIuL2NvbnRlbnQvY29uZmlncy9wZXJzb25hbF9zaXRlLmpzb25cIlxuLy8gaW1wb3J0IHRpa3Rva0NvbmZpZyBmcm9tICcuL2NvbmZpZ3MvdGlrdG9rX2NvbmZpZy5qc29uJztcbi8vIGltcG9ydCBsaW5rZWRpbkNvbmZpZyBmcm9tICcuL2NvbmZpZ3MvbGlua2VkaW5fY29uZmlnLmpzb24nO1xuaW1wb3J0IHsgQ29uZmlnTG9hZGVyLCBFeHRyYWN0b3JEYXRhIH0gZnJvbSBcIi4vY29udGVudC9jb25maWdcIlxuLy8gaW1wb3J0IHsgQWN0aXZpdHlUeXBlIH0gZnJvbSBcIi4vY29tbXVuaWNhdGlvbi9hY3Rpdml0eVwiO1xuaW1wb3J0IHsgU2VuZGVyTWV0aG9kIH0gZnJvbSBcIi4vY29tbW9uL2NvbW11bmljYXRpb24vc2VuZGVyXCJcbmltcG9ydCB7IEV4dHJhY3RlZE1ldGFkYXRhIH0gZnJvbSBcIi4vY29tbW9uL2RiZG9jdW1lbnRcIlxuXG5jb25zdCBnZXRIb21lcGFnZVZpZGVvcyA9ICgpOiBFeHRyYWN0ZWRNZXRhZGF0YSA9PiB7XG4gIC8vIGNvbnNvbGUubG9nKFwiLS0tLSBFWFRSQUNUSU5HIEhPTUVQQUdFIExJTktTIC0tLVwiKTtcbiAgY29uc3QgY29udGVudERpdnMgPSBBcnJheS5mcm9tKFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjY29udGVudC55dGQtcmljaC1pdGVtLXJlbmRlcmVyXCIpLFxuICApLmZpbHRlcigoZGl2KSA9PiB7XG4gICAgLy8gQ2hlY2sgaWYgZWxlbWVudCBpcyBhY3R1YWxseSB2aXNpYmxlXG4gICAgY29uc3QgcmVjdCA9IGRpdi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIHJldHVybiAoXG4gICAgICByZWN0LndpZHRoID4gMCAmJlxuICAgICAgcmVjdC5oZWlnaHQgPiAwICYmXG4gICAgICBnZXRDb21wdXRlZFN0eWxlKGRpdikudmlzaWJpbGl0eSAhPT0gXCJoaWRkZW5cIlxuICAgIClcbiAgfSlcblxuICBjb25zdCB2aWRlb3MgPSBjb250ZW50RGl2c1xuICAgIC5tYXAoKGNvbnRlbnREaXYpID0+IHtcbiAgICAgIC8vIEdldCB0aGUgZGlyZWN0IGFuY2hvciBjaGlsZFxuICAgICAgY29uc3QgYW5jaG9yID0gY29udGVudERpdi5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBcIjpzY29wZSA+IHl0LWxvY2t1cC12aWV3LW1vZGVsIGFcIixcbiAgICAgICkgYXMgSFRNTEFuY2hvckVsZW1lbnRcbiAgICAgIGNvbnN0IHNwYW4gPSBjb250ZW50RGl2LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIFwiaDMgYSBzcGFuLnl0LWNvcmUtYXR0cmlidXRlZC1zdHJpbmdcIixcbiAgICAgIClcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGluazogYW5jaG9yPy5ocmVmID8/IFwiXCIsXG4gICAgICAgIHRpdGxlOiBzcGFuPy50ZXh0Q29udGVudD8udHJpbSgpID8/IFwiXCIsXG4gICAgICB9XG4gICAgfSlcbiAgICAuZmlsdGVyKCh2aWRlbykgPT4gdmlkZW8ubGluayAhPT0gXCJcIilcbiAgY29uc3QgbWV0YWRhdGE6IEV4dHJhY3RlZE1ldGFkYXRhID0geyB2aWRlb3M6IHZpZGVvcyB9XG4gIHJldHVybiBtZXRhZGF0YVxufVxuXG5jb25zdCBnZXRSZWNvbW1lbmRlZFZpZGVvcyA9ICgpOiBFeHRyYWN0ZWRNZXRhZGF0YSA9PiB7XG4gIGNvbnNvbGUubG9nKFwiLS0tLSBFWFRSQUNUSU5HIFJFQ09NTUVOREVEIExJTktTIC0tLS1cIilcbiAgY29uc3QgY29udGVudERpdnMgPSBBcnJheS5mcm9tKFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ5dC1sb2NrdXAtdmlldy1tb2RlbFwiKSxcbiAgKS5maWx0ZXIoKGRpdikgPT4ge1xuICAgIC8vIENoZWNrIGlmIGVsZW1lbnQgaXMgYWN0dWFsbHkgdmlzaWJsZVxuICAgIGNvbnN0IHJlY3QgPSBkaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICByZXR1cm4gKFxuICAgICAgcmVjdC53aWR0aCA+IDAgJiZcbiAgICAgIHJlY3QuaGVpZ2h0ID4gMCAmJlxuICAgICAgZ2V0Q29tcHV0ZWRTdHlsZShkaXYpLnZpc2liaWxpdHkgIT09IFwiaGlkZGVuXCJcbiAgICApXG4gIH0pXG5cbiAgY29uc3QgdmlkZW9zOiBFeHRyYWN0ZWRNZXRhZGF0YSA9IGNvbnRlbnREaXZzXG4gICAgLm1hcCgoY29udGVudERpdikgPT4ge1xuICAgICAgLy8gR2V0IHRoZSBhbmNob3Igd2l0aCB0aGUgdmlkZW8gbGlua1xuICAgICAgY29uc3QgYW5jaG9yID0gY29udGVudERpdi5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAnYVtocmVmXj1cIi93YXRjaFwiXScsXG4gICAgICApISBhcyBIVE1MQW5jaG9yRWxlbWVudFxuICAgICAgY29uc3Qgc3BhbiA9IGNvbnRlbnREaXYucXVlcnlTZWxlY3RvcihcbiAgICAgICAgXCJoMyBhIHNwYW4ueXQtY29yZS1hdHRyaWJ1dGVkLXN0cmluZ1wiLFxuICAgICAgKSFcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGluazogYW5jaG9yPy5ocmVmID8/IFwiXCIsXG4gICAgICAgIHRpdGxlOiBzcGFuPy50ZXh0Q29udGVudD8udHJpbSgpID8/IFwiXCIsXG4gICAgICB9XG4gICAgfSlcbiAgICAuZmlsdGVyKCh2aWRlbykgPT4gdmlkZW8ubGluayAhPT0gXCJcIilcblxuICAvLyBjb25zb2xlLmxvZyhcIlByaW50aW5nIHRoZSBmaXJzdCA1IHZpZGVvc1wiKTtcbiAgLy8gY29uc29sZS50YWJsZSh2aWRlb3Muc2xpY2UoMCw1KSk7XG4gIGNvbnN0IG1ldGFkYXRhOiBFeHRyYWN0ZWRNZXRhZGF0YSA9IHsgdmlkZW9zOiB2aWRlb3MgfVxuICByZXR1cm4gbWV0YWRhdGFcbn1cblxuY29uc3QgZXh0cmFjdG9ycyA9IFtcbiAgbmV3IEV4dHJhY3RvckRhdGEoU2VuZGVyTWV0aG9kLkludGVyYWN0aW9uRGV0ZWN0aW9uLCBcIi9cIiwgZ2V0SG9tZXBhZ2VWaWRlb3MpLFxuICBuZXcgRXh0cmFjdG9yRGF0YShcbiAgICBTZW5kZXJNZXRob2QuSW50ZXJhY3Rpb25EZXRlY3Rpb24sXG4gICAgXCIvd2F0Y2g/dj0qXCIsXG4gICAgZ2V0UmVjb21tZW5kZWRWaWRlb3MsXG4gICksXG5dXG5cbmNvbnN0IHl0Q29uZmlnTG9hZGVyID0gbmV3IENvbmZpZ0xvYWRlcih5dENvbmZpZywgZXh0cmFjdG9ycylcblxubmV3IE1vbml0b3IoeXRDb25maWdMb2FkZXIpXG5cbmNvbnN0IHBlcnNvbmFsQ29uZmlnTG9hZGVyID0gbmV3IENvbmZpZ0xvYWRlcihwZXJzb25hbENvbmZpZywgW10pXG5uZXcgTW9uaXRvcihwZXJzb25hbENvbmZpZ0xvYWRlcilcblxuXG4vLyBjb25zdCB0aWt0b2tJRFNlbGVjdG9yID0gKCk6IG9iamVjdCA9PiB7XG4vLyAgICAgbGV0IHZpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYueGdwbGF5ZXItY29udGFpbmVyLnRpa3Rvay13ZWItcGxheWVyXCIpO1xuLy8gICAgIGlmICghdmlkKXtcbi8vICAgICAgICAgY29uc29sZS5sb2coXCJubyB1cmwgZm91bmQhXCIpO1xuLy8gICAgICAgICByZXR1cm4ge307XG4vLyAgICAgfVxuLy8gICAgIGxldCBpZCA9IHZpZC5pZC5zcGxpdChcIi1cIikuYXQoLTEpO1xuLy8gICAgIGxldCB1cmwgPSBgaHR0cHM6Ly90aWt0b2suY29tL3NoYXJlL3ZpZGVvLyR7aWR9YDtcbi8vICAgICByZXR1cm4ge1xuLy8gICAgICAgICBcInVuaXF1ZVVSTFwiOiB1cmxcbi8vICAgICB9O1xuLy8gfVxuXG4vLyBjb25zb2xlLmxvZyh0aWt0b2tDb25maWcpO1xuLy8gY29uc3QgdGlrdG9rQ29uZmlnTG9hZGVyID0gbmV3IENvbmZpZ0xvYWRlcih0aWt0b2tDb25maWcpO1xuLy8gdGlrdG9rQ29uZmlnTG9hZGVyLmluamVjdEV4dHJhY3RvcihcIi8qXCIsIHRpa3Rva0lEU2VsZWN0b3IpO1xuLy8gY29uc3QgdGlrdG9rSW50ZXJhY3RvciA9IG5ldyBNb25pdG9yKHRpa3Rva0NvbmZpZ0xvYWRlci5jb25maWcpO1xuXG4vLyAvLyBjb25zb2xlLmxvZyh0aWt0b2tDb25maWcpO1xuLy8gY29uc3QgbGlua2VkaW5Db25maWdMb2FkZXIgPSBuZXcgQ29uZmlnTG9hZGVyKGxpbmtlZGluQ29uZmlnKTtcbi8vIGNvbnN0IGxpbmtlZGluSW50ZXJhY3RvciA9IG5ldyBNb25pdG9yKGxpbmtlZGluQ29uZmlnTG9hZGVyLmNvbmZpZyk7XG4iLCJpbXBvcnQgeyBTZW5kZXJNZXRob2QgfSBmcm9tIFwiLi4vY29tbW9uL2NvbW11bmljYXRpb24vc2VuZGVyXCJcbmltcG9ydCB7IEV4dHJhY3RlZE1ldGFkYXRhIH0gZnJvbSBcIi4uL2NvbW1vbi9kYmRvY3VtZW50XCJcblxuZXhwb3J0IHtcbiAgQ29uZmlnLFxuICBDb25maWdMb2FkZXIsXG4gIFVSTFBhdHRlcm5Ub1NlbGVjdG9ycyxcbiAgU2VsZWN0b3JOYW1lUGFpcixcbiAgRXh0cmFjdG9yRGF0YSxcbiAgRXh0cmFjdG9yTGlzdCxcbn1cblxuaW50ZXJmYWNlIFNlbGVjdG9yTmFtZVBhaXIge1xuICBzZWxlY3Rvcjogc3RyaW5nXG4gIG5hbWU6IHN0cmluZ1xufVxudHlwZSBVUkxQYXR0ZXJuVG9TZWxlY3RvcnMgPSBSZWNvcmQ8c3RyaW5nLCBTZWxlY3Rvck5hbWVQYWlyW10+XG5cbmludGVyZmFjZSBDb25maWcge1xuICAvKipcbiAgICogQW4gaW50ZXJmYWNlIHRoYXQgY29udGFpbnMgYWxsIHRoZSBkYXRhIHJlcXVpcmVkIHRvIGluc3RhbnRpYXRlIGEgTW9uaXRvci5cbiAgICovXG4gIC8vIFRoZSBiYXNlIFVSTCB0aGF0IHRoZSBtb25pdG9yIHNob3VsZCBzdGFydCBhdFxuICBiYXNlVVJMOiBzdHJpbmdcbiAgLy8gQSBtYXBwaW5nIG9mIFVSTCBwYXR0ZXJucyB0byBwYXRoIGRhdGEuIFRoZSBVUkwgUGF0dGVybiBzaG91bGQgZm9sbG93IHRoZVxuICAvLyBVUkwgUGF0dGVybiBBUEkgc3ludGF4LiBUaGVzZSBhcmUgYXBwZW5kZWQgdG8gdGhlIGJhc2VVUkwgd2hlbiBjaGVja2luZyBmb3IgbWF0Y2hlc1xuICAvLyBFeDogYmFzZVVSTDogd3d3LnlvdXR1YmUuY29tLCBwYXRoOiAvc2hvcnRzLzppZCAtPiB3d3cueW91dHViZS5jb20vc2hvcnRzLzppZFxuICBwYXRoczogVVJMUGF0dGVyblRvU2VsZWN0b3JzXG4gIC8vIEluZGljYXRlcyB3aGV0aGVyIHRoZSBNb25pdG9yIHNob3VsZCBiZSBpbiBkZWJ1ZyBtb2RlLiBJZiB0cnVlLCBhZGQgY29sb3VyZWQgYm94ZXNcbiAgLy8gYXJvdW5kIHNlbGVjdGVkIEhUTUwgZWxlbWVudHNcbiAgZGVidWc/OiBib29sZWFuXG4gIC8vIEEgbGlzdCBvZiBldmVudCB0eXBlcyB0byBtb25pdG9yLiBCeSBkZWZhdWx0LCB0aGlzIGlzIGp1c3QgW1wiY2xpY2tcIl1cbiAgZXZlbnRzPzogc3RyaW5nW11cbn1cblxuY2xhc3MgRXh0cmFjdG9yRGF0YSB7XG4gIGV2ZW50VHlwZTogU2VuZGVyTWV0aG9kXG4gIHVybFBhdHRlcm46IHN0cmluZ1xuICBleHRyYWN0b3I6ICgpID0+IEV4dHJhY3RlZE1ldGFkYXRhXG4gIGNvbnN0cnVjdG9yKFxuICAgIGFjdGl2aXR5VHlwZTogU2VuZGVyTWV0aG9kLFxuICAgIHVybFBhdHRlcm46IHN0cmluZyxcbiAgICBleHRyYWN0b3I6ICgpID0+IEV4dHJhY3RlZE1ldGFkYXRhLFxuICApIHtcbiAgICB0aGlzLmV2ZW50VHlwZSA9IGFjdGl2aXR5VHlwZVxuICAgIHRoaXMudXJsUGF0dGVybiA9IHVybFBhdHRlcm5cbiAgICB0aGlzLmV4dHJhY3RvciA9IGV4dHJhY3RvclxuICB9XG59XG5cbmNsYXNzIEV4dHJhY3Rvckxpc3Qge1xuICBwcml2YXRlIGV4dHJhY3RvcnM6IEV4dHJhY3RvckRhdGFbXVxuICBwcml2YXRlIGJhc2VVUkw6IHN0cmluZ1xuICBjb25zdHJ1Y3RvcihleHRyYWN0b3JzOiBFeHRyYWN0b3JEYXRhW10gPSBbXSwgYmFzZVVSTDogc3RyaW5nKSB7XG4gICAgdGhpcy5leHRyYWN0b3JzID0gZXh0cmFjdG9yc1xuICAgIHRoaXMuYmFzZVVSTCA9IGJhc2VVUkxcbiAgfVxuXG4gIHB1YmxpYyBleHRyYWN0KFxuICAgIGN1cnJlbnRVUkw6IHN0cmluZyxcbiAgICBldmVudFR5cGU6IFNlbmRlck1ldGhvZCxcbiAgKTogRXh0cmFjdGVkTWV0YWRhdGEge1xuICAgIGNvbnNvbGUubG9nKFxuICAgICAgYEF0dGVtcHRpbmcgZXh0cmFjdGlvbiBmb3IgdXJsOiAke2N1cnJlbnRVUkx9IGFuZCBldmVudCB0eXBlICR7ZXZlbnRUeXBlfWAsXG4gICAgKVxuICAgIGxldCBleHRyYWN0ZWREYXRhOiBFeHRyYWN0ZWRNZXRhZGF0YSA9IHt9XG4gICAgdGhpcy5leHRyYWN0b3JzXG4gICAgICAuZmlsdGVyKChlKSA9PiB7XG4gICAgICAgIGNvbnN0IGlzQ29ycmVjdEFjdGl2aXR5OiBib29sZWFuID1cbiAgICAgICAgICBlLmV2ZW50VHlwZSA9PSBldmVudFR5cGUgfHwgZS5ldmVudFR5cGUgPT0gU2VuZGVyTWV0aG9kLkFueVxuICAgICAgICBjb25zdCBwOiBVUkxQYXR0ZXJuID0gbmV3IFVSTFBhdHRlcm4oZS51cmxQYXR0ZXJuLCB0aGlzLmJhc2VVUkwpXG4gICAgICAgIGNvbnN0IGlzVVJMTWF0Y2g6IGJvb2xlYW4gPSBwLnRlc3QoY3VycmVudFVSTClcbiAgICAgICAgcmV0dXJuIGlzQ29ycmVjdEFjdGl2aXR5ICYmIGlzVVJMTWF0Y2hcbiAgICAgIH0pXG4gICAgICAuZm9yRWFjaChcbiAgICAgICAgKGUpID0+XG4gICAgICAgICAgKGV4dHJhY3RlZERhdGEgPSB7XG4gICAgICAgICAgICAuLi4oZXh0cmFjdGVkRGF0YSBhcyBvYmplY3QpLFxuICAgICAgICAgICAgLi4uKGUuZXh0cmFjdG9yKCkgYXMgb2JqZWN0KSxcbiAgICAgICAgICB9KSxcbiAgICAgIClcbiAgICByZXR1cm4gZXh0cmFjdGVkRGF0YVxuICB9XG59XG5cbmNsYXNzIENvbmZpZ0xvYWRlciB7XG4gIHB1YmxpYyBjb25maWc6IENvbmZpZ1xuICBwdWJsaWMgZXh0cmFjdG9yTGlzdDogRXh0cmFjdG9yTGlzdFxuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29uZmlnLCBleHRyYWN0b3JMaXN0OiBFeHRyYWN0b3JEYXRhW10gPSBbXSkge1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnXG4gICAgdGhpcy5leHRyYWN0b3JMaXN0ID0gbmV3IEV4dHJhY3Rvckxpc3QoZXh0cmFjdG9yTGlzdCwgY29uZmlnLmJhc2VVUkwpXG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIE1lc3NhZ2VUb0JhY2tncm91bmQsXG4gIE1lc3NhZ2VSZXNwb25zZSxcbn0gZnJvbSBcIi4uL2NvbW1vbi9jb21tdW5pY2F0aW9uL21lc3NhZ2luZ1wiXG5pbXBvcnQge1xuICBEQkRvY3VtZW50LFxuICBBY3Rpdml0eURvY3VtZW50LFxuICBTZXNzaW9uRG9jdW1lbnQsXG4gIEV4dHJhY3RlZE1ldGFkYXRhLFxufSBmcm9tIFwiLi4vY29tbW9uL2RiZG9jdW1lbnRcIlxuaW1wb3J0IHsgQ29uZmlnTG9hZGVyLCBFeHRyYWN0b3JMaXN0IH0gZnJvbSBcIi4vY29uZmlnXCJcbmltcG9ydCB7IFBhZ2VEYXRhIH0gZnJvbSBcIi4vcGFnZWRhdGFcIlxuaW1wb3J0IHsgQWN0aXZpdHlUeXBlIH0gZnJvbSBcIi4uL2NvbW1vbi9jb21tdW5pY2F0aW9uL2FjdGl2aXR5XCJcbmltcG9ydCB7IFNlbmRlck1ldGhvZCB9IGZyb20gXCIuLi9jb21tb24vY29tbXVuaWNhdGlvbi9zZW5kZXJcIlxuXG4vKipcbiAqIFRoaXMgY2xhc3MgcmVhZHMgZnJvbSBhIHByb3ZpZGVkIENvbmZpZyBvYmplY3QgYW5kIGF0dGFjaGVzIGxpc3RlbmVycyB0byB0aGUgZWxlbWVudHMgc3BlY2lmaWVkIGluIHRoZSBzZWxlY3RvcnMuXG4gKiBXaGVuIHRoZXNlIGVsZW1lbnRzIGFyZSBpbnRlcmFjdGVkIHdpdGgsIG9yIHdoZW4gYSBuYXZpZ2F0aW9uIG9jY3VycywgYSBkb2N1bWVudCBpcyBzZW50IHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdFxuICogdG8gYmUgYXBwZW5kZWQgdG8gdGhlIGRhdGFiYXNlLiBUaGlzIGNsYXNzIGlzIGluc3RhbnRpYXRlZCBpbiBjb250ZW50LnRzLlxuICpcbiAqIEBwYXJhbSBpbnRlcmFjdGlvbkV2ZW50cyAtIEEgbGlzdCBvZiB0aGUgdHlwZSBvZiBldmVudHMgd2Ugd2FudCB0byBtb25pdG9yIGFzIGludGVyYWN0aW9ucyAoZWcuIGNsaWNrLCBzY3JvbGwsIGV0Yy4pLiBEZWZhdWx0IGlzIGNsaWNrXG4gKiBAcGFyYW0gZGVidWcgLSBJZiB0cnVlLCBoaWdobGlnaHQgYWxsIHNlbGVjdGVkIEhUTUwgZWxlbWVudHMgd2l0aCBjb2xvdXJlZCBib3hlc1xuICogQHBhcmFtIHBhdGhzIC0gQW4gb2JqZWN0IG1hcHBpbmcgcGF0aCBwYXR0ZXJucyB0byB0aGVpciBjb3JyZXNwb25kaW5nIENTUyBzZWxlY3RvcnMgUGF0aCBwYXR0ZXJucyBhcmUgY29uc2lzdGVudCB3aXRoIHRoZSAgVVJMIFBhdHRlcm4gQVBJIFN5bnRheDogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1VSTF9QYXR0ZXJuX0FQSVxuICogQHBhcmFtIGJhc2VVUkwgLSBCYXNlIHVybCBmb3IgdGhlIHBhZ2UgKGVnLiB3d3cueW91dHViZS5jb20pLiBBbGwgcGF0aHMgYXJlIGFwcGVuZGVkIHRvIHRoaXMgd2hlbiBtYXRjaGluZyBVUmxzXG4gKiBAcGFyYW0gY3VycmVudFBhZ2VEYXRhIC0gQ29udGFpbnMgZGF0YSByZWxldmFudCB0byB0aGUgY3VycmVudCBwYWdlLlxuICogQHBhcmFtIGludGVyYWN0aW9uQXR0cmlidXRlIC0gQXR0cmlidXRlIGFkZGVkIHRvIGFsbCBlbGVtZW50cyBiZWluZyBtb25pdG9yZWRcbiAqL1xuZXhwb3J0IGNsYXNzIE1vbml0b3Ige1xuICAvLyBBIGxpc3Qgb2YgdGhlIHR5cGUgb2YgZXZlbnRzIHdlIHdhbnQgdG8gbW9uaXRvciBhcyBpbnRlcmFjdGlvbnMgKGVnLiBjbGljaywgc2Nyb2xsLCBldGMuKS4gRGVmYXVsdCBpcyBjbGlja1xuICBodG1sRXZlbnRzVG9Nb25pdG9yOiBzdHJpbmdbXVxuICAvLyBJZiB0cnVlLCBoaWdobGlnaHQgYWxsIHNlbGVjdGVkIEhUTUwgZWxlbWVudHMgd2l0aCBjb2xvdXJlZCBib3hlc1xuICBlbmFibGVIaWdobGlnaHRpbmc6IGJvb2xlYW5cbiAgLy8gQ29udGFpbnMgZGF0YSByZWxldmFudCB0byB0aGUgY3VycmVudCBwYWdlLlxuICBjdXJyZW50UGFnZURhdGE6IFBhZ2VEYXRhXG4gIC8vIEF0dHJpYnV0ZSBhZGRlZCB0byBhbGwgZWxlbWVudHMgYmVpbmcgbW9uaXRvcmVkXG4gIGh0bWxNb25pdG9yaW5nQXR0cmlidXRlOiBzdHJpbmdcblxuICBleHRyYWN0b3JMaXN0OiBFeHRyYWN0b3JMaXN0XG5cbiAgY29uc3RydWN0b3IoY29uZmlnTG9hZGVyOiBDb25maWdMb2FkZXIpIHtcbiAgICBjb25zdCBjb25maWcgPSBjb25maWdMb2FkZXIuY29uZmlnXG4gICAgdGhpcy5odG1sRXZlbnRzVG9Nb25pdG9yID0gY29uZmlnLmV2ZW50cyA/PyBbXCJjbGlja1wiXVxuICAgIHRoaXMuZW5hYmxlSGlnaGxpZ2h0aW5nID0gdHJ1ZVxuICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhID0gbmV3IFBhZ2VEYXRhKGNvbmZpZylcbiAgICB0aGlzLmh0bWxNb25pdG9yaW5nQXR0cmlidXRlID0gXCJtb25pdG9yaW5nLWludGVyYWN0aW9uc1wiXG4gICAgdGhpcy5leHRyYWN0b3JMaXN0ID0gY29uZmlnTG9hZGVyLmV4dHJhY3Rvckxpc3RcbiAgICAvLyBPbmx5IGluaXRpYWxpemUgbW9uaXRvciBpZiB0aGUgVVJMIG1hdGNoZXMgYW5kXG4gICAgLy8gdGhlIGNvbnRlbnQgb2YgdGhlIHBhZ2UgaXMgdmlzaWJsZVxuICAgIGlmICh3aW5kb3cubG9jYXRpb24ub3JpZ2luID09PSBjb25maWcuYmFzZVVSTCkge1xuICAgICAgdGhpcy5pbnRpdGlhbGl6ZVdoZW5WaXNpYmxlKClcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGludGl0aWFsaXplV2hlblZpc2libGUoKTogdm9pZCB7XG4gICAgY29uc3QgcnVuV2hlblZpc2libGUgPSAoKSA9PiB7XG4gICAgICBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSBcInZpc2libGVcIikge1xuICAgICAgICB0aGlzLmluaXRpYWxpemVNb25pdG9yKClcbiAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidmlzaWJpbGl0eWNoYW5nZVwiLCBydW5XaGVuVmlzaWJsZSlcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBpbml0aWFsaXppbmcgbW9uaXRvcjpcIiwgZXJyb3IpXG4gICAgICAgICAgICAvLyBTdGlsbCByZW1vdmUgbGlzdGVuZXIgZXZlbiBpZiB0aGVyZSdzIGFuIGVycm9yXG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidmlzaWJpbGl0eWNoYW5nZVwiLCBydW5XaGVuVmlzaWJsZSlcbiAgICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIpIHtcbiAgICAgIHJ1bldoZW5WaXNpYmxlKCkgLy8gVGhpcyB3aWxsIG5vdyBiZSBzeW5jaHJvbm91c1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xuICAgICAgICBydW5XaGVuVmlzaWJsZSgpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ2aXNpYmlsaXR5Y2hhbmdlXCIsIHJ1bldoZW5WaXNpYmxlKVxuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBtb25pdG9yXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIGluaXRpYWxpemVNb25pdG9yKCkge1xuICAgIGNvbnNvbGUubG9nKFwiaW5pdGlhbGl6aW5nIG1vbml0b3JcIilcbiAgICB0aGlzLmN1cnJlbnRQYWdlRGF0YS51cGRhdGUoZG9jdW1lbnQubG9jYXRpb24uaHJlZilcbiAgICB0cnkge1xuICAgICAgLy8gQ3JlYXRlcyBhIG5ldyBlbnRyeSBpbiB0aGUgREIgZGVzY3JpYmluZyB0aGUgc3RhdGUgYXQgdGhlIHN0YXJ0IG9mIHRoZSBzZXNzaW9uXG4gICAgICBhd2FpdCB0aGlzLmluaXRpYWxpemVTZXNzaW9uKClcbiAgICAgIC8vIEJpbmRzIGxpc3RlbmVycyB0byB0aGUgSFRNTCBlbGVtZW50cyBzcGVjaWZpZWQgaW4gdGhlIGNvbmZpZyBmb3IgYWxsIG1hdGNoaW5nIHBhdGggcGF0dGVybnNcbiAgICAgIHRoaXMuYmluZEV2ZW50cygpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIGluaXRpYWxpemUgc2Vzc2lvbjpcIiwgZXJyKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGVudHJ5IGluIHRoZSBEQiBkZXNjcmliaW5nIHRoZSBzdGF0ZSBhdCB0aGUgc3RhcnQgb2YgdGhlIHNlc3Npb25cbiAgICovXG4gIHByaXZhdGUgYXN5bmMgaW5pdGlhbGl6ZVNlc3Npb24oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgY3VycmVudFN0YXRlOiBEQkRvY3VtZW50ID0gbmV3IFNlc3Npb25Eb2N1bWVudChcbiAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkwsXG4gICAgICBkb2N1bWVudC50aXRsZSxcbiAgICApXG4gICAgY29uc29sZS5sb2coXCJDaGVja2luZyBoaWdobGlnaHRcIilcbiAgICBjb25zdCByZXNwb25zZTogTWVzc2FnZVJlc3BvbnNlIHwgbnVsbCA9IGF3YWl0IHRoaXMuc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoXG4gICAgICBTZW5kZXJNZXRob2QuSW5pdGlhbGl6ZVNlc3Npb24sXG4gICAgICBjdXJyZW50U3RhdGUsXG4gICAgKVxuICAgIGlmIChcbiAgICAgIHJlc3BvbnNlICYmXG4gICAgICByZXNwb25zZT8uc3RhdHVzID09PSBcIlNlc3Npb24gaW5pdGlhbGl6ZWRcIiAmJlxuICAgICAgcmVzcG9uc2UuaGlnaGxpZ2h0XG4gICAgKSB7XG4gICAgICB0aGlzLmVuYWJsZUhpZ2hsaWdodGluZyA9IHJlc3BvbnNlLmhpZ2hsaWdodFxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhgSGlnaGxpZ2h0IGlzIHNldCB0byAke3RoaXMuZW5hYmxlSGlnaGxpZ2h0aW5nfWApXG4gIH1cblxuICAvKipcbiAgICogQmluZHMgZXZlbnQgbGlzdGVuZXJzIGZvciBtdXRhdGlvbnMgYW5kIG5hdmlnYXRpb25cbiAgICovXG5cbiAgcHJpdmF0ZSBiaW5kRXZlbnRzKCk6IHZvaWQge1xuICAgIC8vIFdoZW5ldmVyIG5ldyBjb250ZW50IGlzIGxvYWRlZCwgYXR0YWNoIG9ic2VydmVycyB0byBlYWNoIEhUTUwgZWxlbWVudCB0aGF0IG1hdGNoZXMgdGhlIHNlbGVjdG9ycyBpbiB0aGUgY29uZmlnc1xuICAgIGNvbnN0IG9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT5cbiAgICAgIHRoaXMuYWRkTGlzdGVuZXJzVG9OZXdNYXRjaGVzKCksXG4gICAgKVxuICAgIC8vIE1ha2UgdGhlIG11dGF0aW9uIG9ic2VydmVyIG9ic2VydmUgdGhlIGVudGlyZSBkb2N1bWVudCBmb3IgY2hhbmdlc1xuICAgIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwge1xuICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICB9KVxuXG4gICAgLy8gQWRkIGFuIGV2ZW50IGxpc3RlbmVyIHRvIGRldGVjdCBuYXZpZ2F0aW9ucyBvbiB0aGUgcGFnZVxuICAgIG5hdmlnYXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcIm5hdmlnYXRlXCIsIChlOiBOYXZpZ2F0aW9uRXZlbnQpID0+XG4gICAgICB0aGlzLm9uTmF2aWdhdGlvbkRldGVjdGlvbihlKSxcbiAgICApXG4gIH1cblxuICAvKipcbiAgICogQWRkcyBsaXN0ZW5lcnMgdG8gbXV0YXRpb25zIChpZS4gbmV3bHkgcmVuZGVyZWQgZWxlbWVudHMpIGFuZCBtYXJrcyB0aGVtIHdpdGggdGhpcy5pbnRlcmFjdHRpb25BdHRyaWJ1dGUuXG4gICAqIElmIGRlYnVnIG1vZGUgaXMgb24sIHRoaXMgd2lsbCBhZGQgYSBjb2xvdXJmdWwgYm9yZGVyIHRvIHRoZXNlIGVsZW1lbnRzLlxuICAgKi9cblxuICBwcml2YXRlIGFkZExpc3RlbmVyc1RvTmV3TWF0Y2hlcygpOiB2b2lkIHtcbiAgICAvLyBjb25zb2xlLmxvZyhcImFkZGluZyBzZWxlY3RvcnNcIik7XG4gICAgLy8gY29uc29sZS5sb2coYFZhbHVlIG9mIGhpZ2hsaWdodDogJHt0aGlzLmhpZ2hsaWdodH1gKTtcbiAgICAvLyBjb25zb2xlLmxvZyhcIkN1cnJlbnQgcGFnZSBkYXRhOlwiKTtcbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRQYWdlRGF0YSk7XG4gICAgdGhpcy5jdXJyZW50UGFnZURhdGEuc2VsZWN0b3JOYW1lUGFpcnMuZm9yRWFjaCgoc2VsZWN0b3JOYW1lUGFpcikgPT4ge1xuICAgICAgY29uc3QgZWxlbWVudHM6IE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgYDppcygke3NlbGVjdG9yTmFtZVBhaXIuc2VsZWN0b3J9KTpub3QoWyR7dGhpcy5odG1sTW9uaXRvcmluZ0F0dHJpYnV0ZX1dKWAsXG4gICAgICApXG4gICAgICBjb25zdCBuYW1lOiBzdHJpbmcgPSBzZWxlY3Rvck5hbWVQYWlyLm5hbWVcbiAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBlbGVtZW50cykge1xuICAgICAgICBpZiAodGhpcy5lbmFibGVIaWdobGlnaHRpbmcpIHtcbiAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlciA9IGAycHggc29saWQgJHt0aGlzLlN0cmluZ1RvQ29sb3IubmV4dChuYW1lKX1gXG4gICAgICAgIH1cbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUodGhpcy5odG1sTW9uaXRvcmluZ0F0dHJpYnV0ZSwgXCJ0cnVlXCIpXG5cbiAgICAgICAgZm9yIChjb25zdCBpZSBvZiB0aGlzLmh0bWxFdmVudHNUb01vbml0b3IpIHtcbiAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBpZSxcbiAgICAgICAgICAgIChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLm9uSW50ZXJhY3Rpb25EZXRlY3Rpb24oZWxlbWVudCwgZSwgbmFtZSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0cnVlLFxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBtZXNzYWdlIHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdC5cbiAgICogQHBhcmFtIGFjdGl2aXR5VHlwZSAtICB0aGUgdHlwZSBvZiBhY3Rpdml0eSAoc2VsZiBsb29wIG9yIHN0YXRlIGNoYW5nZSlcbiAgICogQHBhcmFtIGV2ZW50IC0gdGhlIEhUTUwgZXZlbnQgdGhhdCBvY2N1cmVkXG4gICAqXG4gICAqIEByZXR1cm5zIEEgZG9jdW1lbnQgZGVzY3JpYmluZyBzZWxmIGxvb3BcbiAgICovXG5cbiAgcHJpdmF0ZSBjcmVhdGVOYXZpZ2F0aW9uUmVjb3JkKFxuICAgIGFjdGl2aXR5VHlwZTogQWN0aXZpdHlUeXBlLFxuICAgIGV2ZW50OiBFdmVudCxcbiAgKTogREJEb2N1bWVudCB7XG4gICAgY29uc3QgbWV0YWRhdGEgPSB0aGlzLmV4dHJhY3Rvckxpc3QuZXh0cmFjdChcbiAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkwsIC8vIHJ1bnMgZm9yIFwicHJldiBwYWdlXCJcbiAgICAgIFNlbmRlck1ldGhvZC5OYXZpZ2F0aW9uRGV0ZWN0aW9uLFxuICAgIClcbiAgICBjb25zb2xlLmxvZyhcInByaW50aW5nIG1ldGFkYXRhXCIpXG4gICAgY29uc29sZS5sb2cobWV0YWRhdGEpXG4gICAgcmV0dXJuIG5ldyBBY3Rpdml0eURvY3VtZW50KFxuICAgICAgYWN0aXZpdHlUeXBlLFxuICAgICAgZXZlbnQsXG4gICAgICBtZXRhZGF0YSxcbiAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkwsXG4gICAgICBkb2N1bWVudC50aXRsZSxcbiAgICApXG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBtZXNzYWdlIHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdC5cbiAgICogQHBhcmFtIGVsZW1lbnQgLSB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJlZCB0aGUgZXZlbnRcbiAgICogQHBhcmFtIG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJlZCB0aGUgY2FsbGJhY2sgKGFzIGRlZmluZWQgaW4gdGhlIGNvbmZpZylcbiAgICogQHBhcmFtIGV2ZW50IC0gdGhlIEhUTUwgZXZlbnQgdGhhdCBvY2N1cmVkXG4gICAqIEByZXR1cm5zIEEgZG9jdW1lbnQgaW50ZXJhY3Rpb24gc2VsZiBsb29wXG4gICAqL1xuXG4gIHByaXZhdGUgY3JlYXRlSW50ZXJhY3Rpb25SZWNvcmQobmFtZTogc3RyaW5nLCBldmVudDogRXZlbnQpOiBEQkRvY3VtZW50IHtcbiAgICBjb25zb2xlLmxvZyhcIkRldGVjdGVkIGludGVyYWN0aW9uIGV2ZW50XCIpXG4gICAgY29uc3QgcGFnZVNwZWNpZmljRGF0YTogb2JqZWN0ID0ge1xuICAgICAgZWxlbWVudE5hbWU6IG5hbWUsXG4gICAgfVxuICAgIGNvbnN0IGV4dHJhY3RlZERhdGEgPSB0aGlzLmV4dHJhY3Rvckxpc3QuZXh0cmFjdChcbiAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkwsXG4gICAgICBTZW5kZXJNZXRob2QuSW50ZXJhY3Rpb25EZXRlY3Rpb24sXG4gICAgKVxuXG4gICAgY29uc3QgbWV0YWRhdGE6IEV4dHJhY3RlZE1ldGFkYXRhID0ge1xuICAgICAgLi4ucGFnZVNwZWNpZmljRGF0YSxcbiAgICAgIC4uLihleHRyYWN0ZWREYXRhIGFzIG9iamVjdCksXG4gICAgfSBhcyBFeHRyYWN0ZWRNZXRhZGF0YVxuXG4gICAgY29uc29sZS5sb2coXCJwcmludGluZyBtZXRhZGF0YVwiKVxuICAgIGNvbnNvbGUubG9nKG1ldGFkYXRhKVxuXG4gICAgcmV0dXJuIG5ldyBBY3Rpdml0eURvY3VtZW50KFxuICAgICAgQWN0aXZpdHlUeXBlLkludGVyYWN0aW9uLFxuICAgICAgZXZlbnQsXG4gICAgICBtZXRhZGF0YSxcbiAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkwsXG4gICAgICBkb2N1bWVudC50aXRsZSxcbiAgICApXG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBtZXNzYWdlIHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdC5cbiAgICogQHBhcmFtIHNlbmRlck1ldGhvZCAtIHRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvbiB0aGF0J3Mgc2VuZGluZyB0aGUgbWVzc2FnZSB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHRcbiAgICogQHBhcmFtIHBheWxvYWQgLSB0aGUgZGF0YSBiZWluZyBzZW50IHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdFxuICAgKlxuICAgKiBAcmV0dXJucyBSZXNwb25zZSBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIG1lc3NhZ2Ugc3VjY2VlZGVkXG4gICAqL1xuXG4gIHByaXZhdGUgYXN5bmMgc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoXG4gICAgc2VuZGVyTWV0aG9kOiBTZW5kZXJNZXRob2QsXG4gICAgcGF5bG9hZDogREJEb2N1bWVudCxcbiAgKTogUHJvbWlzZTxNZXNzYWdlUmVzcG9uc2UgfCBudWxsPiB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIENoZWNrIGlmIHJ1bnRpbWUgaXMgYXZhaWxhYmxlIChleHRlbnNpb24gY29udGV4dCBzdGlsbCB2YWxpZClcbiAgICAgIGlmICghY2hyb21lLnJ1bnRpbWU/LmlkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4dGVuc2lvbiBjb250ZXh0IGludmFsaWRhdGVkXCIpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1lc3NhZ2U6IE1lc3NhZ2VUb0JhY2tncm91bmQgPSBuZXcgTWVzc2FnZVRvQmFja2dyb3VuZChcbiAgICAgICAgc2VuZGVyTWV0aG9kLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgKVxuICAgICAgY29uc3QgcmVzcG9uc2U6IE1lc3NhZ2VSZXNwb25zZSA9XG4gICAgICAgIGF3YWl0IGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1lc3NhZ2UpXG5cbiAgICAgIC8vIENocm9tZSByZXR1cm5zIHVuZGVmaW5lZCBpZiBubyBsaXN0ZW5lcnMsIGNoZWNrIGlmIHRoYXQncyBleHBlY3RlZFxuICAgICAgaWYgKHJlc3BvbnNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIk5vIHJlc3BvbnNlIGZyb20gYmFja2dyb3VuZCBzY3JpcHRcIilcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNwb25zZVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQmFja2dyb3VuZCBtZXNzYWdlIGZhaWxlZDpcIiwgZXJyb3IpXG4gICAgICAvLyBEZWNpZGUgd2hldGhlciB0byB0aHJvdyBvciBoYW5kbGUgZ3JhY2VmdWxseSBiYXNlZCBvbiB5b3VyIG5lZWRzXG4gICAgICByZXR1cm4gbnVsbCAvLyBvciB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgdGhhdCBjcmVhdGVzIGEgcGF5bG9hZCBkZXNjcmliaW5nIHRoZSBpbnRlcmFjdGlvbiB0aGF0IG9jY3VyZWQgYW5kIHNlbmRzIGl0IHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdFxuICAgKiBAcGFyYW0gZWxlbWVudCAtIHRoZSBldmVudCB0aGF0IHRyaWdnZXJlZCB0aGUgY2FsbGJhY2tcbiAgICogQHBhcmFtIG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJlZCB0aGUgY2FsbGJhY2sgKGFzIGRlZmluZWQgaW4gdGhlIGNvbmZpZylcbiAgICovXG5cbiAgcHJpdmF0ZSBvbkludGVyYWN0aW9uRGV0ZWN0aW9uKFxuICAgIGVsZW1lbnQ6IEVsZW1lbnQsXG4gICAgZXZlbnQ6IEV2ZW50LFxuICAgIG5hbWU6IHN0cmluZyxcbiAgKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coXCJpbnRlcmFjdGlvbiBldmVudCBkZXRlY3RlZFwiKVxuICAgIGNvbnNvbGUubG9nKGBFdmVudCBkZXRlY3RlZCB3aXRoIGV2ZW50IHR5cGU6ICR7ZXZlbnQudHlwZX1gKVxuICAgIGNvbnNvbGUubG9nKGBFdmVudCB0cmlnZ2VyZWQgYnlgLCBlbGVtZW50KVxuICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnQuaW5uZXJIVE1MKTtcbiAgICAvLyBjb25zb2xlLmxvZyhlbGVtZW50LmdldEhUTUwoKSk7XG4gICAgY29uc3QgcmVjb3JkOiBEQkRvY3VtZW50ID0gdGhpcy5jcmVhdGVJbnRlcmFjdGlvblJlY29yZChuYW1lLCBldmVudClcbiAgICB0aGlzLnNlbmRNZXNzYWdlVG9CYWNrZ3JvdW5kKFxuICAgICAgU2VuZGVyTWV0aG9kLkludGVyYWN0aW9uRGV0ZWN0aW9uLFxuICAgICAgcmVjb3JkLFxuICAgICkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIHNlbmQgaW50ZXJhY3Rpb24gZGF0YTpcIiwgZXJyb3IpXG4gICAgfSlcbiAgfVxuXG4gIHByaXZhdGUgaXNOZXdCYXNlVVJMKG5ld1VSTDogc3RyaW5nIHwgbnVsbCk6IGJvb2xlYW4ge1xuICAgIGNvbnNvbGUubG9nKFwiY2hlY2tpbmcgaWYgdXJsIHVwZGF0ZWRcIilcbiAgICBpZiAobmV3VVJMID09PSBudWxsKXtcbiAgICAgIGNvbnNvbGUubG9nKFwibmV3IHVybCBpcyBudWxsXCIpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IGN1cnJlbnRIb3N0bmFtZSA9IChuZXcgVVJMKHRoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkwpKS5ob3N0bmFtZVxuICAgIGNvbnN0IG5ld0hvc3RuYW1lID0gKG5ldyBVUkwobmV3VVJMKSkuaG9zdG5hbWVcblxuICAgIGNvbnNvbGUubG9nKFwiY3VycmVudCBob3N0bmFtZVwiLCBjdXJyZW50SG9zdG5hbWUpO1xuICAgIGNvbnNvbGUubG9nKFwibmV3IGhvc3RuYW1lXCIsIG5ld0hvc3RuYW1lKTtcblxuICAgIHJldHVybiBjdXJyZW50SG9zdG5hbWUgIT09IG5ld0hvc3RuYW1lXG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgdGhhdCBjcmVhdGVzIGEgcGF5bG9hZCBkZXNjcmliaW5nIHRoZSBuYXZpZ2F0aW9uIHRoYXQgb2NjdXJlZCBhbmQgc2VuZHMgaXQgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0XG4gICAqIEBwYXJhbSBuYXZFdmVudCAtIHRoZSBldmVudCB0aGF0IHRyaWdnZXJlZCB0aGUgY2FsbGJhY2tcbiAgICovXG4gIHByaXZhdGUgb25OYXZpZ2F0aW9uRGV0ZWN0aW9uKG5hdkV2ZW50OiBOYXZpZ2F0aW9uRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBkZXN0VXJsOiBzdHJpbmcgfCBudWxsID0gbmF2RXZlbnQuZGVzdGluYXRpb24udXJsXG4gICAgY29uc3QgYmFzZVVSTENoYW5nZTogYm9vbGVhbiA9IHRoaXMuaXNOZXdCYXNlVVJMKGRlc3RVcmwpXG4gICAgbGV0IHJlY29yZDogREJEb2N1bWVudCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuICAgIGxldCBzZW5kZXI6IFNlbmRlck1ldGhvZCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuXG4gICAgY29uc29sZS5sb2coYGJlZm9yZSBjcmVhdGluZyBuYXYgcmVjb3JkLCBjdXJyZW50IFVSTCBpcyAke3RoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkx9YClcbiAgICBpZiAoYmFzZVVSTENoYW5nZSkge1xuICAgICAgY29uc29sZS5sb2coXCJVUkwgYmFzZSBjaGFuZ2UgZGV0ZWN0ZWQuIENsb3NpbmcgcHJvZ3JhbS5cIilcbiAgICAgIHJlY29yZCA9IG5ldyBEQkRvY3VtZW50KHRoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkwsIGRvY3VtZW50LnRpdGxlKVxuICAgICAgc2VuZGVyID0gU2VuZGVyTWV0aG9kLkNsb3NlU2Vzc2lvblxuICAgIH0gZWxzZSBpZiAobmF2RXZlbnQubmF2aWdhdGlvblR5cGUgPT09IFwicHVzaFwiKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIlB1c2ggZXZlbnQgZGV0ZWN0ZWQuXCIpXG4gICAgICByZWNvcmQgPSB0aGlzLmNyZWF0ZU5hdmlnYXRpb25SZWNvcmQoQWN0aXZpdHlUeXBlLlN0YXRlQ2hhbmdlLCBuYXZFdmVudClcbiAgICAgIHNlbmRlciA9IFNlbmRlck1ldGhvZC5OYXZpZ2F0aW9uRGV0ZWN0aW9uXG4gICAgfSBlbHNlIGlmIChuYXZFdmVudC5uYXZpZ2F0aW9uVHlwZSA9PT0gXCJyZXBsYWNlXCIpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiUmVwbGFjZSBldmVudCBkZXRlY3RlZC5cIilcbiAgICAgIHJlY29yZCA9IHRoaXMuY3JlYXRlTmF2aWdhdGlvblJlY29yZChBY3Rpdml0eVR5cGUuU2VsZkxvb3AsIG5hdkV2ZW50KVxuICAgICAgc2VuZGVyID0gU2VuZGVyTWV0aG9kLk5hdmlnYXRpb25EZXRlY3Rpb25cbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhgYWZ0ZXIgY3JlYXRpbmcgbmF2IHJlY29yZCwgY3VycmVudCBVUkwgaXMgJHt0aGlzLmN1cnJlbnRQYWdlRGF0YS5jdXJyZW50VVJMfWApXG5cbiAgICBpZiAoZGVzdFVybCl7XG4gICAgICB0aGlzLmN1cnJlbnRQYWdlRGF0YS51cGRhdGUoZGVzdFVybCk7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coYGF0IGVuZCBvZiBvbiBuYXYgZGV0ZWN0LCBjdXJyZW50IFVSTCBpcyAke3RoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkx9YClcblxuXG4gICAgaWYgKHR5cGVvZiByZWNvcmQgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIHNlbmRlciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5zZW5kTWVzc2FnZVRvQmFja2dyb3VuZChzZW5kZXIsIHJlY29yZCkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gc2VuZCBpbnRlcmFjdGlvbiBkYXRhOlwiLCBlcnJvcilcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhIHVuaXF1ZSBjb2xvciBmcm9tIGEgZ2l2ZW4gc3RyaW5nXG4gICAqIFNvdXJjZTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzMxMDM3MzgzXG4gICAqIEByZXR1cm5zIENvbG9yIGhleCBjb2RlXG4gICAqL1xuXG4gIHByaXZhdGUgU3RyaW5nVG9Db2xvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgaW50ZXJmYWNlIENvbG9ySW5zdGFuY2Uge1xuICAgICAgc3RyaW5nVG9Db2xvckhhc2g6IFJlY29yZDxzdHJpbmcsIHN0cmluZz5cbiAgICAgIG5leHRWZXJ5RGlmZmVybnRDb2xvcklkeDogbnVtYmVyXG4gICAgICB2ZXJ5RGlmZmVyZW50Q29sb3JzOiBzdHJpbmdbXVxuICAgIH1cblxuICAgIGxldCBpbnN0YW5jZTogQ29sb3JJbnN0YW5jZSB8IG51bGwgPSBudWxsXG5cbiAgICByZXR1cm4ge1xuICAgICAgbmV4dDogZnVuY3Rpb24gc3RyaW5nVG9Db2xvcihzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGluc3RhbmNlID8/PSB7XG4gICAgICAgICAgc3RyaW5nVG9Db2xvckhhc2g6IHt9LFxuICAgICAgICAgIG5leHRWZXJ5RGlmZmVybnRDb2xvcklkeDogMCxcbiAgICAgICAgICB2ZXJ5RGlmZmVyZW50Q29sb3JzOiBbXG4gICAgICAgICAgICBcIiMwMEZGMDBcIixcbiAgICAgICAgICAgIFwiIzAwMDBGRlwiLFxuICAgICAgICAgICAgXCIjRkYwMDAwXCIsXG4gICAgICAgICAgICBcIiMwMUZGRkVcIixcbiAgICAgICAgICAgIFwiI0ZGQTZGRVwiLFxuICAgICAgICAgICAgXCIjRkZEQjY2XCIsXG4gICAgICAgICAgICBcIiMwMDY0MDFcIixcbiAgICAgICAgICAgIFwiIzAxMDA2N1wiLFxuICAgICAgICAgICAgXCIjOTUwMDNBXCIsXG4gICAgICAgICAgICBcIiMwMDdEQjVcIixcbiAgICAgICAgICAgIFwiI0ZGMDBGNlwiLFxuICAgICAgICAgICAgXCIjRkZFRUU4XCIsXG4gICAgICAgICAgICBcIiM3NzREMDBcIixcbiAgICAgICAgICAgIFwiIzkwRkI5MlwiLFxuICAgICAgICAgICAgXCIjMDA3NkZGXCIsXG4gICAgICAgICAgICBcIiNENUZGMDBcIixcbiAgICAgICAgICAgIFwiI0ZGOTM3RVwiLFxuICAgICAgICAgICAgXCIjNkE4MjZDXCIsXG4gICAgICAgICAgICBcIiNGRjAyOURcIixcbiAgICAgICAgICAgIFwiI0ZFODkwMFwiLFxuICAgICAgICAgICAgXCIjN0E0NzgyXCIsXG4gICAgICAgICAgICBcIiM3RTJERDJcIixcbiAgICAgICAgICAgIFwiIzg1QTkwMFwiLFxuICAgICAgICAgICAgXCIjRkYwMDU2XCIsXG4gICAgICAgICAgICBcIiNBNDI0MDBcIixcbiAgICAgICAgICAgIFwiIzAwQUU3RVwiLFxuICAgICAgICAgICAgXCIjNjgzRDNCXCIsXG4gICAgICAgICAgICBcIiNCREM2RkZcIixcbiAgICAgICAgICAgIFwiIzI2MzQwMFwiLFxuICAgICAgICAgICAgXCIjQkREMzkzXCIsXG4gICAgICAgICAgICBcIiMwMEI5MTdcIixcbiAgICAgICAgICAgIFwiIzlFMDA4RVwiLFxuICAgICAgICAgICAgXCIjMDAxNTQ0XCIsXG4gICAgICAgICAgICBcIiNDMjhDOUZcIixcbiAgICAgICAgICAgIFwiI0ZGNzRBM1wiLFxuICAgICAgICAgICAgXCIjMDFEMEZGXCIsXG4gICAgICAgICAgICBcIiMwMDQ3NTRcIixcbiAgICAgICAgICAgIFwiI0U1NkZGRVwiLFxuICAgICAgICAgICAgXCIjNzg4MjMxXCIsXG4gICAgICAgICAgICBcIiMwRTRDQTFcIixcbiAgICAgICAgICAgIFwiIzkxRDBDQlwiLFxuICAgICAgICAgICAgXCIjQkU5OTcwXCIsXG4gICAgICAgICAgICBcIiM5NjhBRThcIixcbiAgICAgICAgICAgIFwiI0JCODgwMFwiLFxuICAgICAgICAgICAgXCIjNDMwMDJDXCIsXG4gICAgICAgICAgICBcIiNERUZGNzRcIixcbiAgICAgICAgICAgIFwiIzAwRkZDNlwiLFxuICAgICAgICAgICAgXCIjRkZFNTAyXCIsXG4gICAgICAgICAgICBcIiM2MjBFMDBcIixcbiAgICAgICAgICAgIFwiIzAwOEY5Q1wiLFxuICAgICAgICAgICAgXCIjOThGRjUyXCIsXG4gICAgICAgICAgICBcIiM3NTQ0QjFcIixcbiAgICAgICAgICAgIFwiI0I1MDBGRlwiLFxuICAgICAgICAgICAgXCIjMDBGRjc4XCIsXG4gICAgICAgICAgICBcIiNGRjZFNDFcIixcbiAgICAgICAgICAgIFwiIzAwNUYzOVwiLFxuICAgICAgICAgICAgXCIjNkI2ODgyXCIsXG4gICAgICAgICAgICBcIiM1RkFENEVcIixcbiAgICAgICAgICAgIFwiI0E3NTc0MFwiLFxuICAgICAgICAgICAgXCIjQTVGRkQyXCIsXG4gICAgICAgICAgICBcIiNGRkIxNjdcIixcbiAgICAgICAgICAgIFwiIzAwOUJGRlwiLFxuICAgICAgICAgICAgXCIjRTg1RUJFXCIsXG4gICAgICAgICAgXSxcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaW5zdGFuY2Uuc3RyaW5nVG9Db2xvckhhc2hbc3RyXSkge1xuICAgICAgICAgIGluc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoW3N0cl0gPVxuICAgICAgICAgICAgaW5zdGFuY2UudmVyeURpZmZlcmVudENvbG9yc1tpbnN0YW5jZS5uZXh0VmVyeURpZmZlcm50Q29sb3JJZHgrK11cbiAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIGAlYyBUaGUgY29sb3VyIGZvciAke3N0cn1gLFxuICAgICAgICAgICAgYGNvbG9yOiAke2luc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoW3N0cl19YCxcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoW3N0cl1cbiAgICAgIH0sXG4gICAgfVxuICB9KSgpXG59XG4iLCJpbXBvcnQgeyBVUkxQYXR0ZXJuVG9TZWxlY3RvcnMsIFNlbGVjdG9yTmFtZVBhaXIsIENvbmZpZyB9IGZyb20gXCIuL2NvbmZpZ1wiXG4vKipcbiAqIEEgY2xhc3MgcmVzcG9uc2libGUgZm9yIHRyYWNraW5nIHRoZSBzdGF0ZSBvZiB0aGUgcGFnZSB0aGF0IHRoZSB1c2VyIGlzIGN1cnJlbnRseSBvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIFBhZ2VEYXRhIHtcbiAgLy8gQ3VycmVudCBVUkwgb2YgdGhlIHBhZ2VcbiAgY3VycmVudFVSTCE6IHN0cmluZ1xuICAvLyBDU1Mgc2VsZWN0b3JzIGJlaW5nIGFwcGxpZWQgdG8gdGhlIHBhZ2VcbiAgc2VsZWN0b3JOYW1lUGFpcnMhOiBTZWxlY3Rvck5hbWVQYWlyW11cbiAgYmFzZVVSTDogc3RyaW5nXG4gIHVybFBhdHRlcm5Ub1NlbGVjdG9yRGF0YTogVVJMUGF0dGVyblRvU2VsZWN0b3JzXG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBDb25maWcpIHtcbiAgICB0aGlzLnVybFBhdHRlcm5Ub1NlbGVjdG9yRGF0YSA9IGNvbmZpZy5wYXRoc1xuICAgIHRoaXMuYmFzZVVSTCA9IGNvbmZpZy5iYXNlVVJMXG4gIH1cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIFVSTCBhbmQgdGhlIGxpc3Qgb2YgQ1NTIHNlbGVjdG9ycyBmb3IgdGhlIFVSTFxuICAgKiBAcGFyYW0gbmV3VVJMOiBUaGUgZnVsbCB1cmwgb2YgdGhlIGN1cnJlbnQgcGFnZVxuICAgKi9cbiAgdXBkYXRlKG5ld1VSTDogc3RyaW5nKSB7XG4gICAgdGhpcy5jdXJyZW50VVJMID0gbmV3VVJMO1xuICAgIGNvbnN0IG1hdGNoaW5nVVJMUGF0dGVybnM6IHN0cmluZ1tdID0gdGhpcy5nZXRNYXRjaGluZ1BhdHRlcm5zKClcbiAgICB0aGlzLnNlbGVjdG9yTmFtZVBhaXJzID0gdGhpcy5nZXRTZWxlY3Rvck5hbWVQYWlycyhtYXRjaGluZ1VSTFBhdHRlcm5zKVxuICB9XG4gIC8qKlxuICAgKiBTZXRzIGBtYXRjaFBhdGhEYXRhYCB0byBiZSB0aGUgUGF0aERhdGEgZm9yIHRoZSBVUkwgcGF0dGVybiB3aXRoIHRoZSBjbG9zZXQgbWF0Y2ggdG8gYHRoaXMuYmFzZVVSTGBcbiAgICogYW5kIHJldHVybnMgYSBsaXN0IG9mIGFsbCBtYXRjaGVzLiBBZGRpdGlvbmFsbHksIGl0IHVwZGF0ZXMgd2hldGhlciB0aGUgY3VycmVudCBwYXRoXG4gICAqIGluY2x1ZGVzIGFuIGlkLlxuICAgKlxuICAgKiBAcmV0dXJucyBBIGxpc3Qgb2YgYWxsIHBhdHRlcm5zIGluIHRoZSBjb25maWcgdGhhdCBtYXRjaCBgYmFzZVVSTGBcbiAgICovXG5cbiAgcHJpdmF0ZSBnZXRNYXRjaGluZ1BhdHRlcm5zKCk6IHN0cmluZ1tdIHtcbiAgICBjb25zb2xlLmxvZyhcInVwZGF0aW5nIHBhZ2UgZGF0YVwiKVxuXG4gICAgLy8gR2V0IGEgbGlzdCBvZiBhbGwgdGhlIHBhdGhzIHRoYXQgbWF0Y2ggdGhlIGN1cnJlbnQgVVJMXG4gICAgY29uc3QgbWF0Y2hpbmdVUkxQYXR0ZXJuczogc3RyaW5nW10gPSBPYmplY3Qua2V5cyhcbiAgICAgIHRoaXMudXJsUGF0dGVyblRvU2VsZWN0b3JEYXRhLFxuICAgICkuZmlsdGVyKChwYXRoKSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhwYXRoKTtcbiAgICAgIGNvbnN0IHBhdHRlcm46IFVSTFBhdHRlcm4gPSBuZXcgVVJMUGF0dGVybihwYXRoLCB0aGlzLmJhc2VVUkwpXG4gICAgICBjb25zdCBtYXRjaDogYm9vbGVhbiA9IHBhdHRlcm4udGVzdCh0aGlzLmN1cnJlbnRVUkwpXG4gICAgICByZXR1cm4gbWF0Y2hcbiAgICB9KVxuXG4gICAgaWYgKG1hdGNoaW5nVVJMUGF0dGVybnMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIm5vIG1hdGNoZXMgZm91bmRcIilcbiAgICB9XG5cbiAgICByZXR1cm4gbWF0Y2hpbmdVUkxQYXR0ZXJuc1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBtYXRjaGluZ1VSTFBhdHRlcm5zOiBBIGxpc3Qgb2YgYWxsIG1hdGNoaW5nIHBhdGhzIHRvIHRoZSBjdXJyZW50IHVybFxuICAgKlxuICAgKiBAcmV0dXJucyBBIGxpc3Qgb2YgYWxsIHNlbGVjdG9ycyBmb3IgdGhlIG1hdGNoaW5nIHBhdGhzXG4gICAqL1xuXG4gIHByaXZhdGUgZ2V0U2VsZWN0b3JOYW1lUGFpcnMoXG4gICAgbWF0Y2hpbmdVUkxQYXR0ZXJuczogc3RyaW5nW10sXG4gICk6IFNlbGVjdG9yTmFtZVBhaXJbXSB7XG4gICAgbGV0IGN1cnJlbnRTZWxlY3Rvck5hbWVQYWlyczogU2VsZWN0b3JOYW1lUGFpcltdID0gW11cbiAgICBmb3IgKGNvbnN0IHVybFBhdHRlcm4gb2YgbWF0Y2hpbmdVUkxQYXR0ZXJucykge1xuICAgICAgY29uc3Qgc2VsZWN0b3JOYW1lUGFpcnM6IFNlbGVjdG9yTmFtZVBhaXJbXSA9XG4gICAgICAgIHRoaXMudXJsUGF0dGVyblRvU2VsZWN0b3JEYXRhW3VybFBhdHRlcm5dXG4gICAgICBjdXJyZW50U2VsZWN0b3JOYW1lUGFpcnMgPVxuICAgICAgICBjdXJyZW50U2VsZWN0b3JOYW1lUGFpcnMuY29uY2F0KHNlbGVjdG9yTmFtZVBhaXJzKVxuICAgIH1cbiAgICByZXR1cm4gY3VycmVudFNlbGVjdG9yTmFtZVBhaXJzXG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9jb250ZW50LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9