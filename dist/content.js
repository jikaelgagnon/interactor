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

/***/ "./src/common/communication/backgroundmessage.ts":
/*!*******************************************************!*\
  !*** ./src/common/communication/backgroundmessage.ts ***!
  \*******************************************************/
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
    const metadata = { videos: videos };
    return metadata;
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
    const metadata = { videos: videos };
    return metadata;
};
const extractors = [new config_1.ExtractorData(sender_1.SenderMethod.InteractionDetection, "/", getHomepageVideos),
    new config_1.ExtractorData(sender_1.SenderMethod.InteractionDetection, "/watch?v=*", getRecommendedVideos)];
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
        this.extractors.filter(e => {
            const isCorrectActivity = (e.eventType == eventType || e.eventType == sender_1.SenderMethod.Any);
            const p = new URLPattern(e.urlPattern, this.baseURL);
            const isURLMatch = p.test(currentURL);
            return (isCorrectActivity && isURLMatch);
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
const backgroundmessage_1 = __webpack_require__(/*! ../common/communication/backgroundmessage */ "./src/common/communication/backgroundmessage.ts");
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
                        veryDifferentColors: ["#00FF00", "#0000FF", "#FF0000", "#01FFFE", "#FFA6FE", "#FFDB66", "#006401", "#010067", "#95003A", "#007DB5", "#FF00F6", "#FFEEE8", "#774D00", "#90FB92", "#0076FF", "#D5FF00", "#FF937E", "#6A826C", "#FF029D", "#FE8900", "#7A4782", "#7E2DD2", "#85A900", "#FF0056", "#A42400", "#00AE7E", "#683D3B", "#BDC6FF", "#263400", "#BDD393", "#00B917", "#9E008E", "#001544", "#C28C9F", "#FF74A3", "#01D0FF", "#004754", "#E56FFE", "#788231", "#0E4CA1", "#91D0CB", "#BE9970", "#968AE8", "#BB8800", "#43002C", "#DEFF74", "#00FFC6", "#FFE502", "#620E00", "#008F9C", "#98FF52", "#7544B1", "#B500FF", "#00FF78", "#FF6E41", "#005F39", "#6B6882", "#5FAD4E", "#A75740", "#A5FFD2", "#FFB167", "#009BFF", "#E85EBE"]
                    });
                    if (!instance.stringToColorHash[str]) {
                        instance.stringToColorHash[str] = instance.veryDifferentColors[instance.nextVeryDifferntColorIdx++];
                        console.log(`%c The colour for ${str}`, `color: ${instance.stringToColorHash[str]}`);
                    }
                    return instance.stringToColorHash[str];
                }
            };
        })();
        const config = configLoader.config;
        this.htmlEventsToMonitor = (_a = config.events) !== null && _a !== void 0 ? _a : ['click'];
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
            if (document.visibilityState === 'visible') {
                this.initializeMonitor()
                    .then(() => {
                    document.removeEventListener('visibilitychange', runWhenVisible);
                })
                    .catch(error => {
                    console.error('Error initializing monitor:', error);
                    // Still remove listener even if there's an error
                    document.removeEventListener('visibilitychange', runWhenVisible);
                });
            }
        };
        if (document.readyState === 'complete') {
            runWhenVisible(); // This will now be synchronous
        }
        else {
            window.addEventListener('load', () => {
                runWhenVisible();
            });
        }
        document.addEventListener('visibilitychange', runWhenVisible);
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
            if (response && (response === null || response === void 0 ? void 0 : response.status) === "Session initialized" && response.highlight) {
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
            subtree: true
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
        this.currentPageData.selectorNamePairs.forEach(selectorNamePair => {
            const elements = document.querySelectorAll(`:is(${selectorNamePair.selector}):not([${this.htmlMonitoringAttribute}])`);
            const name = selectorNamePair.name;
            for (const element of elements) {
                if (this.enableHighlighting) {
                    element.style.border = `2px solid ${this.StringToColor.next(name)}`;
                }
                element.setAttribute(this.htmlMonitoringAttribute, 'true');
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
    createInteractionRecord(element, name, event) {
        console.log("Detected interaction event");
        const pageSpecificData = {
            html: element.getHTML(),
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
                    throw new Error('Extension context invalidated');
                }
                const message = new backgroundmessage_1.BackgroundMessage(senderMethod, payload);
                const response = yield chrome.runtime.sendMessage(message);
                // Chrome returns undefined if no listeners, check if that's expected
                if (response === undefined) {
                    console.error('No response from background script');
                }
                return response;
            }
            catch (error) {
                console.error('Background message failed:', error);
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
    onInteractionDetection(element, e, name) {
        console.log("interaction event detected");
        console.log(`Event detected with event type: ${e.type}`);
        console.log(`Event triggered by`, element);
        // console.log(element.innerHTML);
        // console.log(element.getHTML());
        const record = this.createInteractionRecord(element, name, e);
        this.sendMessageToBackground(sender_1.SenderMethod.InteractionDetection, record)
            .catch(error => {
            console.error('Failed to send interaction data:', error);
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
        if (typeof (record) !== "undefined" && typeof (sender) !== "undefined") {
            this.sendMessageToBackground(sender, record).catch(error => {
                console.error('Failed to send interaction data:', error);
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
            currentSelectorNamePairs = currentSelectorNamePairs.concat(selectorNamePairs);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDN0YscUJBQXFCO1lBQ3JCLE1BQU0sT0FBTyxHQUFlLElBQUksVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDL0QsTUFBTSxLQUFLLEdBQVksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDckQsT0FBTyxLQUFLLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLG1CQUFtQixDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUVELE9BQU8sbUJBQW1CLENBQUM7SUFDL0IsQ0FBQztJQUVEOzs7O09BSUc7SUFFSyxvQkFBb0IsQ0FBQyxtQkFBNkI7UUFDdEQsSUFBSSx3QkFBd0IsR0FBdUIsRUFBRSxDQUFDO1FBQ3RELEtBQUssTUFBTSxVQUFVLElBQUksbUJBQW1CLEVBQUUsQ0FBQztZQUMzQyxNQUFNLGlCQUFpQixHQUF1QixJQUFJLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEYsd0JBQXdCLEdBQUcsd0JBQXdCLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDO1FBQ2pGLENBQUM7UUFDRCxPQUFPLHdCQUF3QixDQUFDO0lBQ3BDLENBQUM7Q0FDSjtBQTdERCw0QkE2REM7Ozs7Ozs7VUNqRUQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvY29tbW9uL2NvbW11bmljYXRpb24vYWN0aXZpdHkudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb21tb24vY29tbXVuaWNhdGlvbi9iYWNrZ3JvdW5kbWVzc2FnZS50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbW1vbi9jb21tdW5pY2F0aW9uL3NlbmRlci50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbW1vbi9kYmRvY3VtZW50LnRzIiwid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvY29udGVudC50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbnRlbnQvY29uZmlnLnRzIiwid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvY29udGVudC9tb25pdG9yLnRzIiwid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvY29udGVudC9wYWdlZGF0YS50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2ludGVyYWN0b3Ivd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIERlZmluZXMgYSBsaXN0IG9mIHRoZSBwb3NzaWJsZSBhY3Rpdml0eSB0eXBlcyB0aGF0IGNhbiBiZSByZWNvcmRlZCBieSB0aGUgTW9uaXRvciBjbGFzc1xuICovXG5lbnVtIEFjdGl2aXR5VHlwZSB7XG4gICAgU2VsZkxvb3AgPSBcIlNlbGYtTG9vcFwiLFxuICAgIFN0YXRlQ2hhbmdlID0gXCJTdGF0ZSBDaGFuZ2VcIixcbiAgICBJbnRlcmFjdGlvbiA9IFwiSW50ZXJhY3Rpb25cIixcbiAgICBCb3RoID0gXCJCb3RoXCJcbn1cblxuZXhwb3J0IHtBY3Rpdml0eVR5cGV9IiwiaW1wb3J0IHtEQkRvY3VtZW50IH0gZnJvbSBcIi4uL2RiZG9jdW1lbnRcIjtcbmltcG9ydCB7IFNlbmRlck1ldGhvZCB9IGZyb20gXCIuL3NlbmRlclwiO1xuZXhwb3J0IHtCYWNrZ3JvdW5kTWVzc2FnZSwgTWVzc2FnZVJlc3BvbnNlfTtcbi8qKlxuICogQSBjbGFzcyB1c2VkIHRvIHNlbmQgbWVzc2FnZXMgZnJvbSB0aGUgY29udGVudCB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHQgaW4gYSBjb25zaXN0ZW50IGZvcm1hdC5cbiAqL1xuY2xhc3MgQmFja2dyb3VuZE1lc3NhZ2Uge1xuICAgIHNlbmRlck1ldGhvZDogU2VuZGVyTWV0aG9kO1xuICAgIHBheWxvYWQ6IERCRG9jdW1lbnQ7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHNlbmRlck1ldGhvZCAtIGVudW0gdHlwZSBvZiB0aGUgbWV0aG9kIHNlbmRpbmcgdGhlIG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0gcGF5bG9hZCAtIHRoZSBkYXRhIGJlaW5nIHNlbnQgdG8gdGhlIGRhdGFiYXNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKHNlbmRlck1ldGhvZDogU2VuZGVyTWV0aG9kLCBwYXlsb2FkOiBEQkRvY3VtZW50KSB7XG4gICAgICAgIHRoaXMuc2VuZGVyTWV0aG9kID0gc2VuZGVyTWV0aG9kO1xuICAgICAgICB0aGlzLnBheWxvYWQgPSBwYXlsb2FkO1xuICAgIH1cbn1cblxuaW50ZXJmYWNlIE1lc3NhZ2VSZXNwb25zZSB7XG4gIHN0YXR1czogc3RyaW5nO1xuICBoaWdobGlnaHQ/OiBib29sZWFuO1xufSIsImVudW0gU2VuZGVyTWV0aG9ke1xuICAgIEluaXRpYWxpemVTZXNzaW9uID0gXCJJbml0aWFsaXplIFNlc3Npb25cIixcbiAgICBJbnRlcmFjdGlvbkRldGVjdGlvbiA9IFwiSW50ZXJhY3Rpb24gRGV0ZWN0aW9uXCIsXG4gICAgTmF2aWdhdGlvbkRldGVjdGlvbiA9IFwiTmF2aWdhdGlvbiBEZXRlY3Rpb25cIixcbiAgICBDbG9zZVNlc3Npb24gPSBcIkNsb3NlIFNlc3Npb25cIixcbiAgICBBbnkgPSBcIkFueVwiXG59XG5leHBvcnQge1NlbmRlck1ldGhvZH07IiwiaW1wb3J0IHsgQWN0aXZpdHlUeXBlIH0gZnJvbSBcIi4vY29tbXVuaWNhdGlvbi9hY3Rpdml0eVwiO1xyXG4vKipcclxuICogQSBjbGFzcyBkZWZpbmluZyBkb2N1bWVudHMgdGhhdCBhcmUgc2VudCB0byB0aGUgZGF0YWJhc2UgZnJvbSB0aGUgY29udGVudCBzY3JpcHRcclxuICovXHJcbmNsYXNzIERCRG9jdW1lbnQge1xyXG4gICAgLy8gVVJMIGF0IHdoaWNodCB0aGUgZXZlbnQgd2FzIGNyZWF0ZWRcclxuICAgIHNvdXJjZVVSTDogc3RyaW5nO1xyXG4gICAgc291cmNlRG9jdW1lbnRUaXRsZTogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCB0aXRsZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zb3VyY2VVUkwgPSB1cmw7XHJcbiAgICAgICAgdGhpcy5zb3VyY2VEb2N1bWVudFRpdGxlID0gdGl0bGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmludGVyZmFjZSBFeHRyYWN0ZWRNZXRhZGF0YU9iamVjdCB7XHJcbiAgICBba2V5OiBzdHJpbmddOiBFeHRyYWN0ZWRNZXRhZGF0YTtcclxufVxyXG5cclxudHlwZSBFeHRyYWN0ZWRNZXRhZGF0YSA9XHJcbiAgICB8IHN0cmluZ1xyXG4gICAgfCBFeHRyYWN0ZWRNZXRhZGF0YVtdXHJcbiAgICB8IEV4dHJhY3RlZE1ldGFkYXRhT2JqZWN0XHJcbiAgICB8IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IC8vIGV4cGxpY2l0bHkgYWxsb3cgb2JqZWN0cyB3aXRoIHN0cmluZyB2YWx1ZXNcclxuXHJcbi8qKlxyXG4gKiBBIGNoaWxkIG9mIERCRG9jdW1lbnQgdGhhdCByZXByZXNlbnRzIGFjdGl2aXRpZXNcclxuICovXHJcblxyXG5jbGFzcyBBY3Rpdml0eURvY3VtZW50IGV4dGVuZHMgREJEb2N1bWVudHtcclxuICAgIC8vIFRoZSB0eXBlIG9mIGFjdGl2aXR5IGJlaW5nIGxvZ2dlZC4gRWl0aGVyIFwic3RhdGVfY2hhZ2VcIiwgXCJzZWxmX2xvb3BcIiwgb3IgXCJpbnRlcmFjdGlvblwiXHJcbiAgICBhY3Rpdml0eVR5cGU6IEFjdGl2aXR5VHlwZSB8IHN0cmluZztcclxuICAgIC8vIFRpbWVzdGFtcCBmb3Igd2hlbiB0aGUgZG9jdW1lbnQgd2FzIGNyZWF0ZWRcclxuICAgIGNyZWF0ZWRBdDogRGF0ZSB8IHN0cmluZztcclxuICAgIC8vIEV2ZW50IHR5cGUgKGVnLiBjbGljaywgc2Nyb2xsLCBldGMuLi4pXHJcbiAgICBldmVudFR5cGU6IHN0cmluZ1xyXG4gICAgLy8gTWV0YWRhdGEgYWJvdXQgdGhlIGV2ZW50XHJcbiAgICBtZXRhZGF0YT86IEV4dHJhY3RlZE1ldGFkYXRhO1xyXG4gICAgY29uc3RydWN0b3IodHlwZTogQWN0aXZpdHlUeXBlLCBldmVudDogRXZlbnQsIG1ldGFkYXRhOiBFeHRyYWN0ZWRNZXRhZGF0YSwgdXJsOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcih1cmwsIHRpdGxlKTtcclxuICAgICAgICB0aGlzLmFjdGl2aXR5VHlwZSA9IHR5cGU7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVkQXQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRUeXBlID0gZXZlbnQudHlwZVxyXG4gICAgICAgIHRoaXMubWV0YWRhdGEgPSBtZXRhZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgY2hpbGQgb2YgREJEb2N1bWVudCB0aGF0IHJlcHJlc2VudHMgdGhlIHN0YXJ0IG9mIGEgc2Vzc2lvblxyXG4gKi9cclxuXHJcbmNsYXNzIFNlc3Npb25Eb2N1bWVudCBleHRlbmRzIERCRG9jdW1lbnR7XHJcbiAgICBzdGFydFRpbWU6IERhdGU7XHJcbiAgICBlbmRUaW1lPzogRGF0ZTtcclxuICAgIGVtYWlsID0gXCJFbWFpbCBub3Qgc2V0XCI7XHJcbiAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgdGl0bGU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKHVybCwgdGl0bGUpO1xyXG4gICAgICAgIHRoaXMuc3RhcnRUaW1lID0gbmV3IERhdGUoKTtcclxuICAgIH1cclxuICAgIHNldEVtYWlsKGVtYWlsOiBzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuZW1haWwgPSBlbWFpbDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtEQkRvY3VtZW50LCBBY3Rpdml0eURvY3VtZW50LCBTZXNzaW9uRG9jdW1lbnQsIEV4dHJhY3RlZE1ldGFkYXRhfTsiLCJpbXBvcnQgeyBNb25pdG9yIH0gZnJvbSBcIi4vY29udGVudC9tb25pdG9yXCI7XG5pbXBvcnQgeXRDb25maWcgZnJvbSAnLi9jb250ZW50L2NvbmZpZ3MveW91dHViZV9jb25maWcuanNvbic7XG4vLyBpbXBvcnQgdGlrdG9rQ29uZmlnIGZyb20gJy4vY29uZmlncy90aWt0b2tfY29uZmlnLmpzb24nO1xuLy8gaW1wb3J0IGxpbmtlZGluQ29uZmlnIGZyb20gJy4vY29uZmlncy9saW5rZWRpbl9jb25maWcuanNvbic7XG5pbXBvcnQgeyBDb25maWdMb2FkZXIsIEV4dHJhY3RvckRhdGEgfSBmcm9tIFwiLi9jb250ZW50L2NvbmZpZ1wiO1xuLy8gaW1wb3J0IHsgQWN0aXZpdHlUeXBlIH0gZnJvbSBcIi4vY29tbXVuaWNhdGlvbi9hY3Rpdml0eVwiO1xuaW1wb3J0IHsgU2VuZGVyTWV0aG9kIH0gZnJvbSBcIi4vY29tbW9uL2NvbW11bmljYXRpb24vc2VuZGVyXCI7XG5pbXBvcnQgeyBFeHRyYWN0ZWRNZXRhZGF0YSB9IGZyb20gXCIuL2NvbW1vbi9kYmRvY3VtZW50XCI7XG5cblxuY29uc3QgZ2V0SG9tZXBhZ2VWaWRlb3MgPSAoKTogRXh0cmFjdGVkTWV0YWRhdGEgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKFwiLS0tLSBFWFRSQUNUSU5HIEhPTUVQQUdFIExJTktTIC0tLVwiKTtcbiAgICBjb25zdCBjb250ZW50RGl2cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI2NvbnRlbnQueXRkLXJpY2gtaXRlbS1yZW5kZXJlcicpKVxuICAgICAgICAuZmlsdGVyKGRpdiA9PiB7XG4gICAgICAgICAgICAvLyBDaGVjayBpZiBlbGVtZW50IGlzIGFjdHVhbGx5IHZpc2libGVcbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBkaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICByZXR1cm4gcmVjdC53aWR0aCA+IDAgJiYgcmVjdC5oZWlnaHQgPiAwICYmIFxuICAgICAgICAgICAgICAgIGdldENvbXB1dGVkU3R5bGUoZGl2KS52aXNpYmlsaXR5ICE9PSAnaGlkZGVuJztcbiAgICAgICAgfSk7XG4gICAgXG4gICAgY29uc3QgdmlkZW9zID0gY29udGVudERpdnMubWFwKGNvbnRlbnREaXYgPT4ge1xuICAgICAgICAvLyBHZXQgdGhlIGRpcmVjdCBhbmNob3IgY2hpbGRcbiAgICAgICAgY29uc3QgYW5jaG9yID0gY29udGVudERpdi5xdWVyeVNlbGVjdG9yKCc6c2NvcGUgPiB5dC1sb2NrdXAtdmlldy1tb2RlbCBhJykgYXMgSFRNTEFuY2hvckVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IHNwYW4gPSBjb250ZW50RGl2LnF1ZXJ5U2VsZWN0b3IoJ2gzIGEgc3Bhbi55dC1jb3JlLWF0dHJpYnV0ZWQtc3RyaW5nJyk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGluazogYW5jaG9yPy5ocmVmID8/ICcnLFxuICAgICAgICAgICAgdGl0bGU6IHNwYW4/LnRleHRDb250ZW50Py50cmltKCkgPz8gJydcbiAgICAgICAgfTtcbiAgICB9KS5maWx0ZXIodmlkZW8gPT4gdmlkZW8ubGluayAhPT0gJycpO1xuICAgIGNvbnN0IG1ldGFkYXRhOiBFeHRyYWN0ZWRNZXRhZGF0YSA9IHt2aWRlb3M6IHZpZGVvc307XG4gICAgcmV0dXJuIG1ldGFkYXRhXG59O1xuXG5jb25zdCBnZXRSZWNvbW1lbmRlZFZpZGVvcyA9ICgpOiBFeHRyYWN0ZWRNZXRhZGF0YSA9PiB7XG4gICAgY29uc29sZS5sb2coXCItLS0tIEVYVFJBQ1RJTkcgUkVDT01NRU5ERUQgTElOS1MgLS0tXCIpO1xuICAgIGNvbnN0IGNvbnRlbnREaXZzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCd5dC1sb2NrdXAtdmlldy1tb2RlbCcpKS5maWx0ZXIoZGl2ID0+IHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgZWxlbWVudCBpcyBhY3R1YWxseSB2aXNpYmxlXG4gICAgICAgIGNvbnN0IHJlY3QgPSBkaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHJldHVybiByZWN0LndpZHRoID4gMCAmJiByZWN0LmhlaWdodCA+IDAgJiYgXG4gICAgICAgICAgICBnZXRDb21wdXRlZFN0eWxlKGRpdikudmlzaWJpbGl0eSAhPT0gJ2hpZGRlbic7XG4gICAgfSk7XG4gICAgXG4gICAgY29uc3QgdmlkZW9zOiBFeHRyYWN0ZWRNZXRhZGF0YSA9IGNvbnRlbnREaXZzLm1hcChjb250ZW50RGl2ID0+IHtcbiAgICAgICAgLy8gR2V0IHRoZSBhbmNob3Igd2l0aCB0aGUgdmlkZW8gbGlua1xuICAgICAgICBjb25zdCBhbmNob3IgPSBjb250ZW50RGl2LnF1ZXJ5U2VsZWN0b3IoJ2FbaHJlZl49XCIvd2F0Y2hcIl0nKSEgYXMgSFRNTEFuY2hvckVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IHNwYW4gPSBjb250ZW50RGl2LnF1ZXJ5U2VsZWN0b3IoJ2gzIGEgc3Bhbi55dC1jb3JlLWF0dHJpYnV0ZWQtc3RyaW5nJykhO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxpbms6IGFuY2hvcj8uaHJlZiA/PyAnJyxcbiAgICAgICAgICAgIHRpdGxlOiBzcGFuPy50ZXh0Q29udGVudD8udHJpbSgpID8/ICcnXG4gICAgICAgIH07XG4gICAgfSkuZmlsdGVyKHZpZGVvID0+IHZpZGVvLmxpbmsgIT09ICcnKTtcbiAgICBcbiAgICAvLyBjb25zb2xlLmxvZyhcIlByaW50aW5nIHRoZSBmaXJzdCA1IHZpZGVvc1wiKTtcbiAgICAvLyBjb25zb2xlLnRhYmxlKHZpZGVvcy5zbGljZSgwLDUpKTtcbiAgICBjb25zdCBtZXRhZGF0YTogRXh0cmFjdGVkTWV0YWRhdGEgPSB7dmlkZW9zOiB2aWRlb3N9O1xuICAgIHJldHVybiBtZXRhZGF0YTtcbn07XG5cbmNvbnN0IGV4dHJhY3RvcnMgPSBbbmV3IEV4dHJhY3RvckRhdGEoU2VuZGVyTWV0aG9kLkludGVyYWN0aW9uRGV0ZWN0aW9uLCBcIi9cIiwgZ2V0SG9tZXBhZ2VWaWRlb3MpLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBFeHRyYWN0b3JEYXRhKFNlbmRlck1ldGhvZC5JbnRlcmFjdGlvbkRldGVjdGlvbiwgXCIvd2F0Y2g/dj0qXCIsIGdldFJlY29tbWVuZGVkVmlkZW9zKV1cblxuY29uc3QgeXRDb25maWdMb2FkZXIgPSBuZXcgQ29uZmlnTG9hZGVyKHl0Q29uZmlnLCBleHRyYWN0b3JzKTtcblxubmV3IE1vbml0b3IoeXRDb25maWdMb2FkZXIpO1xuXG4vLyBjb25zdCB0aWt0b2tJRFNlbGVjdG9yID0gKCk6IG9iamVjdCA9PiB7XG4vLyAgICAgbGV0IHZpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYueGdwbGF5ZXItY29udGFpbmVyLnRpa3Rvay13ZWItcGxheWVyXCIpO1xuLy8gICAgIGlmICghdmlkKXtcbi8vICAgICAgICAgY29uc29sZS5sb2coXCJubyB1cmwgZm91bmQhXCIpO1xuLy8gICAgICAgICByZXR1cm4ge307XG4vLyAgICAgfVxuLy8gICAgIGxldCBpZCA9IHZpZC5pZC5zcGxpdChcIi1cIikuYXQoLTEpO1xuLy8gICAgIGxldCB1cmwgPSBgaHR0cHM6Ly90aWt0b2suY29tL3NoYXJlL3ZpZGVvLyR7aWR9YDtcbi8vICAgICByZXR1cm4ge1xuLy8gICAgICAgICBcInVuaXF1ZVVSTFwiOiB1cmxcbi8vICAgICB9O1xuLy8gfVxuXG5cblxuLy8gY29uc29sZS5sb2codGlrdG9rQ29uZmlnKTtcbi8vIGNvbnN0IHRpa3Rva0NvbmZpZ0xvYWRlciA9IG5ldyBDb25maWdMb2FkZXIodGlrdG9rQ29uZmlnKTtcbi8vIHRpa3Rva0NvbmZpZ0xvYWRlci5pbmplY3RFeHRyYWN0b3IoXCIvKlwiLCB0aWt0b2tJRFNlbGVjdG9yKTtcbi8vIGNvbnN0IHRpa3Rva0ludGVyYWN0b3IgPSBuZXcgTW9uaXRvcih0aWt0b2tDb25maWdMb2FkZXIuY29uZmlnKTtcblxuLy8gLy8gY29uc29sZS5sb2codGlrdG9rQ29uZmlnKTtcbi8vIGNvbnN0IGxpbmtlZGluQ29uZmlnTG9hZGVyID0gbmV3IENvbmZpZ0xvYWRlcihsaW5rZWRpbkNvbmZpZyk7XG4vLyBjb25zdCBsaW5rZWRpbkludGVyYWN0b3IgPSBuZXcgTW9uaXRvcihsaW5rZWRpbkNvbmZpZ0xvYWRlci5jb25maWcpOyIsImltcG9ydCB7IFNlbmRlck1ldGhvZCB9IGZyb20gXCIuLi9jb21tb24vY29tbXVuaWNhdGlvbi9zZW5kZXJcIjtcbmltcG9ydCB7RXh0cmFjdGVkTWV0YWRhdGF9IGZyb20gXCIuLi9jb21tb24vZGJkb2N1bWVudFwiXG5cbmV4cG9ydCB7Q29uZmlnLCBDb25maWdMb2FkZXIsIFVSTFBhdHRlcm5Ub1NlbGVjdG9ycywgU2VsZWN0b3JOYW1lUGFpciwgRXh0cmFjdG9yRGF0YSwgRXh0cmFjdG9yTGlzdH07XG5cblxuaW50ZXJmYWNlIFNlbGVjdG9yTmFtZVBhaXIgeyBcbiAgICBzZWxlY3Rvcjogc3RyaW5nOyBuYW1lOiBzdHJpbmcgXG59XG50eXBlIFVSTFBhdHRlcm5Ub1NlbGVjdG9ycyA9IFJlY29yZDxzdHJpbmcsIFNlbGVjdG9yTmFtZVBhaXJbXT47XG5cblxuaW50ZXJmYWNlIENvbmZpZyB7XG4gICAgLyoqXG4gICAgICogQW4gaW50ZXJmYWNlIHRoYXQgY29udGFpbnMgYWxsIHRoZSBkYXRhIHJlcXVpcmVkIHRvIGluc3RhbnRpYXRlIGEgTW9uaXRvci5cbiAgICAgKi9cbiAgICAvLyBUaGUgYmFzZSBVUkwgdGhhdCB0aGUgbW9uaXRvciBzaG91bGQgc3RhcnQgYXRcbiAgICBiYXNlVVJMOiBzdHJpbmc7XG4gICAgLy8gQSBtYXBwaW5nIG9mIFVSTCBwYXR0ZXJucyB0byBwYXRoIGRhdGEuIFRoZSBVUkwgUGF0dGVybiBzaG91bGQgZm9sbG93IHRoZSBcbiAgICAvLyBVUkwgUGF0dGVybiBBUEkgc3ludGF4LiBUaGVzZSBhcmUgYXBwZW5kZWQgdG8gdGhlIGJhc2VVUkwgd2hlbiBjaGVja2luZyBmb3IgbWF0Y2hlc1xuICAgIC8vIEV4OiBiYXNlVVJMOiB3d3cueW91dHViZS5jb20sIHBhdGg6IC9zaG9ydHMvOmlkIC0+IHd3dy55b3V0dWJlLmNvbS9zaG9ydHMvOmlkXG4gICAgcGF0aHM6IFVSTFBhdHRlcm5Ub1NlbGVjdG9ycztcbiAgICAvLyBJbmRpY2F0ZXMgd2hldGhlciB0aGUgTW9uaXRvciBzaG91bGQgYmUgaW4gZGVidWcgbW9kZS4gSWYgdHJ1ZSwgYWRkIGNvbG91cmVkIGJveGVzXG4gICAgLy8gYXJvdW5kIHNlbGVjdGVkIEhUTUwgZWxlbWVudHNcbiAgICBkZWJ1Zz86IGJvb2xlYW47XG4gICAgLy8gQSBsaXN0IG9mIGV2ZW50IHR5cGVzIHRvIG1vbml0b3IuIEJ5IGRlZmF1bHQsIHRoaXMgaXMganVzdCBbXCJjbGlja1wiXVxuICAgIGV2ZW50cz86IHN0cmluZ1tdO1xufVxuXG5jbGFzcyBFeHRyYWN0b3JEYXRhIHtcbiAgICBldmVudFR5cGU6IFNlbmRlck1ldGhvZDtcbiAgICB1cmxQYXR0ZXJuOiBzdHJpbmc7XG4gICAgZXh0cmFjdG9yOiAoKSA9PiBFeHRyYWN0ZWRNZXRhZGF0YTtcbiAgICBjb25zdHJ1Y3RvcihhY3Rpdml0eVR5cGU6IFNlbmRlck1ldGhvZCwgdXJsUGF0dGVybjogc3RyaW5nLCBleHRyYWN0b3I6ICgpID0+IEV4dHJhY3RlZE1ldGFkYXRhKXtcbiAgICAgICAgdGhpcy5ldmVudFR5cGUgPSBhY3Rpdml0eVR5cGU7XG4gICAgICAgIHRoaXMudXJsUGF0dGVybiA9IHVybFBhdHRlcm47XG4gICAgICAgIHRoaXMuZXh0cmFjdG9yID0gZXh0cmFjdG9yO1xuICAgIH1cbn1cblxuY2xhc3MgRXh0cmFjdG9yTGlzdCB7XG4gICAgcHJpdmF0ZSBleHRyYWN0b3JzOiBFeHRyYWN0b3JEYXRhW107XG4gICAgcHJpdmF0ZSBiYXNlVVJMOiBzdHJpbmc7XG4gICAgY29uc3RydWN0b3IoZXh0cmFjdG9yczogRXh0cmFjdG9yRGF0YVtdID0gW10sIGJhc2VVUkw6IHN0cmluZyl7XG4gICAgICAgIHRoaXMuZXh0cmFjdG9ycyA9IGV4dHJhY3RvcnM7XG4gICAgICAgIHRoaXMuYmFzZVVSTCA9IGJhc2VVUkw7XG4gICAgfVxuXG4gICAgcHVibGljIGV4dHJhY3QoY3VycmVudFVSTDogc3RyaW5nLCBldmVudFR5cGU6IFNlbmRlck1ldGhvZCk6IEV4dHJhY3RlZE1ldGFkYXRhe1xuICAgICAgICBjb25zb2xlLmxvZyhgQXR0ZW1wdGluZyBleHRyYWN0aW9uIGZvciB1cmw6ICR7Y3VycmVudFVSTH0gYW5kIGV2ZW50IHR5cGUgJHtldmVudFR5cGV9YCk7XG4gICAgICAgIGxldCBleHRyYWN0ZWREYXRhOiBFeHRyYWN0ZWRNZXRhZGF0YSA9IHt9O1xuICAgICAgICB0aGlzLmV4dHJhY3RvcnMuZmlsdGVyKGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzQ29ycmVjdEFjdGl2aXR5OiBib29sZWFuID0gKGUuZXZlbnRUeXBlID09IGV2ZW50VHlwZSB8fCBlLmV2ZW50VHlwZSA9PSBTZW5kZXJNZXRob2QuQW55KTtcbiAgICAgICAgICAgICAgICBjb25zdCBwOiBVUkxQYXR0ZXJuID0gbmV3IFVSTFBhdHRlcm4oZS51cmxQYXR0ZXJuLCB0aGlzLmJhc2VVUkwpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzVVJMTWF0Y2g6IGJvb2xlYW4gPSBwLnRlc3QoY3VycmVudFVSTCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChpc0NvcnJlY3RBY3Rpdml0eSAmJiBpc1VSTE1hdGNoKTtcbiAgICAgICAgICAgIH0pLmZvckVhY2goZSA9PlxuICAgICAgICAgICAgICAgIGV4dHJhY3RlZERhdGEgPSB7Li4uIGV4dHJhY3RlZERhdGEgYXMgb2JqZWN0LCAuLi4gZS5leHRyYWN0b3IoKSBhcyBvYmplY3R9XG4gICAgICAgICAgICApXG4gICAgICAgIHJldHVybiBleHRyYWN0ZWREYXRhO1xuICAgIH1cbn1cblxuY2xhc3MgQ29uZmlnTG9hZGVyIHtcbiAgICBwdWJsaWMgY29uZmlnOiBDb25maWc7XG4gICAgcHVibGljIGV4dHJhY3Rvckxpc3Q6IEV4dHJhY3Rvckxpc3Q7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb25maWc6IENvbmZpZywgZXh0cmFjdG9yTGlzdDogRXh0cmFjdG9yRGF0YVtdID0gW10pe1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy5leHRyYWN0b3JMaXN0ID0gbmV3IEV4dHJhY3Rvckxpc3QoZXh0cmFjdG9yTGlzdCwgY29uZmlnLmJhc2VVUkwpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEJhY2tncm91bmRNZXNzYWdlLCBNZXNzYWdlUmVzcG9uc2V9IGZyb20gXCIuLi9jb21tb24vY29tbXVuaWNhdGlvbi9iYWNrZ3JvdW5kbWVzc2FnZVwiO1xyXG5pbXBvcnQge0RCRG9jdW1lbnQsIEFjdGl2aXR5RG9jdW1lbnQsIFNlc3Npb25Eb2N1bWVudCwgRXh0cmFjdGVkTWV0YWRhdGF9IGZyb20gXCIuLi9jb21tb24vZGJkb2N1bWVudFwiO1xyXG5pbXBvcnQge0NvbmZpZ0xvYWRlciwgRXh0cmFjdG9yTGlzdH0gZnJvbSBcIi4vY29uZmlnXCI7XHJcbmltcG9ydCB7IFBhZ2VEYXRhIH0gZnJvbSBcIi4vcGFnZWRhdGFcIjtcclxuaW1wb3J0IHsgQWN0aXZpdHlUeXBlIH0gZnJvbSBcIi4uL2NvbW1vbi9jb21tdW5pY2F0aW9uL2FjdGl2aXR5XCI7XHJcbmltcG9ydCB7U2VuZGVyTWV0aG9kfSBmcm9tIFwiLi4vY29tbW9uL2NvbW11bmljYXRpb24vc2VuZGVyXCJcclxuXHJcbi8qKlxyXG4gKiBUaGlzIGNsYXNzIHJlYWRzIGZyb20gYSBwcm92aWRlZCBDb25maWcgb2JqZWN0IGFuZCBhdHRhY2hlcyBsaXN0ZW5lcnMgdG8gdGhlIGVsZW1lbnRzIHNwZWNpZmllZCBpbiB0aGUgc2VsZWN0b3JzLlxyXG4gKiBXaGVuIHRoZXNlIGVsZW1lbnRzIGFyZSBpbnRlcmFjdGVkIHdpdGgsIG9yIHdoZW4gYSBuYXZpZ2F0aW9uIG9jY3VycywgYSBkb2N1bWVudCBpcyBzZW50IHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdFxyXG4gKiB0byBiZSBhcHBlbmRlZCB0byB0aGUgZGF0YWJhc2UuIFRoaXMgY2xhc3MgaXMgaW5zdGFudGlhdGVkIGluIGNvbnRlbnQudHMuXHJcbiAqIFxyXG4gKiBAcGFyYW0gaW50ZXJhY3Rpb25FdmVudHMgLSBBIGxpc3Qgb2YgdGhlIHR5cGUgb2YgZXZlbnRzIHdlIHdhbnQgdG8gbW9uaXRvciBhcyBpbnRlcmFjdGlvbnMgKGVnLiBjbGljaywgc2Nyb2xsLCBldGMuKS4gRGVmYXVsdCBpcyBjbGlja1xyXG4gKiBAcGFyYW0gZGVidWcgLSBJZiB0cnVlLCBoaWdobGlnaHQgYWxsIHNlbGVjdGVkIEhUTUwgZWxlbWVudHMgd2l0aCBjb2xvdXJlZCBib3hlc1xyXG4gKiBAcGFyYW0gcGF0aHMgLSBBbiBvYmplY3QgbWFwcGluZyBwYXRoIHBhdHRlcm5zIHRvIHRoZWlyIGNvcnJlc3BvbmRpbmcgQ1NTIHNlbGVjdG9ycyBQYXRoIHBhdHRlcm5zIGFyZSBjb25zaXN0ZW50IHdpdGggdGhlICBVUkwgUGF0dGVybiBBUEkgU3ludGF4OiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvVVJMX1BhdHRlcm5fQVBJXHJcbiAqIEBwYXJhbSBiYXNlVVJMIC0gQmFzZSB1cmwgZm9yIHRoZSBwYWdlIChlZy4gd3d3LnlvdXR1YmUuY29tKS4gQWxsIHBhdGhzIGFyZSBhcHBlbmRlZCB0byB0aGlzIHdoZW4gbWF0Y2hpbmcgVVJsc1xyXG4gKiBAcGFyYW0gY3VycmVudFBhZ2VEYXRhIC0gQ29udGFpbnMgZGF0YSByZWxldmFudCB0byB0aGUgY3VycmVudCBwYWdlLlxyXG4gKiBAcGFyYW0gaW50ZXJhY3Rpb25BdHRyaWJ1dGUgLSBBdHRyaWJ1dGUgYWRkZWQgdG8gYWxsIGVsZW1lbnRzIGJlaW5nIG1vbml0b3JlZFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE1vbml0b3Ige1xyXG4gICAgLy8gQSBsaXN0IG9mIHRoZSB0eXBlIG9mIGV2ZW50cyB3ZSB3YW50IHRvIG1vbml0b3IgYXMgaW50ZXJhY3Rpb25zIChlZy4gY2xpY2ssIHNjcm9sbCwgZXRjLikuIERlZmF1bHQgaXMgY2xpY2tcclxuICAgIGh0bWxFdmVudHNUb01vbml0b3I6IHN0cmluZ1tdO1xyXG4gICAgLy8gSWYgdHJ1ZSwgaGlnaGxpZ2h0IGFsbCBzZWxlY3RlZCBIVE1MIGVsZW1lbnRzIHdpdGggY29sb3VyZWQgYm94ZXNcclxuICAgIGVuYWJsZUhpZ2hsaWdodGluZzogYm9vbGVhbjtcclxuICAgIC8vIENvbnRhaW5zIGRhdGEgcmVsZXZhbnQgdG8gdGhlIGN1cnJlbnQgcGFnZS5cclxuICAgIGN1cnJlbnRQYWdlRGF0YTogUGFnZURhdGE7XHJcbiAgICAvLyBBdHRyaWJ1dGUgYWRkZWQgdG8gYWxsIGVsZW1lbnRzIGJlaW5nIG1vbml0b3JlZFxyXG4gICAgaHRtbE1vbml0b3JpbmdBdHRyaWJ1dGU6IHN0cmluZztcclxuXHJcbiAgICBleHRyYWN0b3JMaXN0OiBFeHRyYWN0b3JMaXN0O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZ0xvYWRlcjogQ29uZmlnTG9hZGVyKSB7XHJcbiAgICAgICAgY29uc3QgY29uZmlnID0gY29uZmlnTG9hZGVyLmNvbmZpZztcclxuICAgICAgICB0aGlzLmh0bWxFdmVudHNUb01vbml0b3IgPSBjb25maWcuZXZlbnRzID8/IFsnY2xpY2snXTtcclxuICAgICAgICB0aGlzLmVuYWJsZUhpZ2hsaWdodGluZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGFnZURhdGEgPSBuZXcgUGFnZURhdGEoY29uZmlnKTtcclxuICAgICAgICB0aGlzLmh0bWxNb25pdG9yaW5nQXR0cmlidXRlID0gXCJtb25pdG9yaW5nLWludGVyYWN0aW9uc1wiXHJcbiAgICAgICAgdGhpcy5leHRyYWN0b3JMaXN0ID0gY29uZmlnTG9hZGVyLmV4dHJhY3Rvckxpc3Q7XHJcbiAgICAgICAgLy8gT25seSBpbml0aWFsaXplIG1vbml0b3IgaWYgdGhlIFVSTCBtYXRjaGVzIGFuZCBcclxuICAgICAgICAvLyB0aGUgY29udGVudCBvZiB0aGUgcGFnZSBpcyB2aXNpYmxlXHJcbiAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gPT09IGNvbmZpZy5iYXNlVVJMKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW50aXRpYWxpemVXaGVuVmlzaWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGludGl0aWFsaXplV2hlblZpc2libGUoKTogdm9pZHtcclxuICAgICAgICBjb25zdCBydW5XaGVuVmlzaWJsZSA9ICgpID0+IHsgXHJcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09ICd2aXNpYmxlJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplTW9uaXRvcigpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgcnVuV2hlblZpc2libGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgaW5pdGlhbGl6aW5nIG1vbml0b3I6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTdGlsbCByZW1vdmUgbGlzdGVuZXIgZXZlbiBpZiB0aGVyZSdzIGFuIGVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCBydW5XaGVuVmlzaWJsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xyXG4gICAgICAgICAgICBydW5XaGVuVmlzaWJsZSgpOyAvLyBUaGlzIHdpbGwgbm93IGJlIHN5bmNocm9ub3VzXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBydW5XaGVuVmlzaWJsZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCBydW5XaGVuVmlzaWJsZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIG1vbml0b3JcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhc3luYyBpbml0aWFsaXplTW9uaXRvcigpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImluaXRpYWxpemluZyBtb25pdG9yXCIpO1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRVUkw6IHN0cmluZyA9IGRvY3VtZW50LmxvY2F0aW9uLmhyZWY7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGFnZURhdGEudXBkYXRlKGN1cnJlbnRVUkwpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZXMgYSBuZXcgZW50cnkgaW4gdGhlIERCIGRlc2NyaWJpbmcgdGhlIHN0YXRlIGF0IHRoZSBzdGFydCBvZiB0aGUgc2Vzc2lvblxyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmluaXRpYWxpemVTZXNzaW9uKCk7XHJcbiAgICAgICAgICAgIC8vIEJpbmRzIGxpc3RlbmVycyB0byB0aGUgSFRNTCBlbGVtZW50cyBzcGVjaWZpZWQgaW4gdGhlIGNvbmZpZyBmb3IgYWxsIG1hdGNoaW5nIHBhdGggcGF0dGVybnNcclxuICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gaW5pdGlhbGl6ZSBzZXNzaW9uOlwiLCBlcnIpO1xyXG4gICAgICAgIH1cclxufVxyXG5cclxuICAgIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBuZXcgZW50cnkgaW4gdGhlIERCIGRlc2NyaWJpbmcgdGhlIHN0YXRlIGF0IHRoZSBzdGFydCBvZiB0aGUgc2Vzc2lvblxyXG4gICAqL1xyXG4gICAgcHJpdmF0ZSBhc3luYyBpbml0aWFsaXplU2Vzc2lvbigpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBjdXJyZW50U3RhdGU6IERCRG9jdW1lbnQgPSBuZXcgU2Vzc2lvbkRvY3VtZW50KHRoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkwsIGRvY3VtZW50LnRpdGxlKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkNoZWNraW5nIGhpZ2hsaWdodFwiKTtcclxuICAgICAgICBjb25zdCByZXNwb25zZTogTWVzc2FnZVJlc3BvbnNlIHwgbnVsbCA9IGF3YWl0IHRoaXMuc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoU2VuZGVyTWV0aG9kLkluaXRpYWxpemVTZXNzaW9uLCBjdXJyZW50U3RhdGUpO1xyXG4gICAgICAgIGlmIChyZXNwb25zZSAmJiByZXNwb25zZT8uc3RhdHVzID09PSBcIlNlc3Npb24gaW5pdGlhbGl6ZWRcIiAmJiByZXNwb25zZS5oaWdobGlnaHQpIHtcclxuICAgICAgICAgICAgdGhpcy5lbmFibGVIaWdobGlnaHRpbmcgPSByZXNwb25zZS5oaWdobGlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKGBIaWdobGlnaHQgaXMgc2V0IHRvICR7dGhpcy5lbmFibGVIaWdobGlnaHRpbmd9YClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgKiBCaW5kcyBldmVudCBsaXN0ZW5lcnMgZm9yIG11dGF0aW9ucyBhbmQgbmF2aWdhdGlvblxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgYmluZEV2ZW50cygpOiB2b2lkIHtcclxuICAgICAgICAvLyBXaGVuZXZlciBuZXcgY29udGVudCBpcyBsb2FkZWQsIGF0dGFjaCBvYnNlcnZlcnMgdG8gZWFjaCBIVE1MIGVsZW1lbnQgdGhhdCBtYXRjaGVzIHRoZSBzZWxlY3RvcnMgaW4gdGhlIGNvbmZpZ3NcclxuICAgICAgICBjb25zdCBvYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHRoaXMuYWRkTGlzdGVuZXJzVG9OZXdNYXRjaGVzKCkpO1xyXG4gICAgICAgIC8vIE1ha2UgdGhlIG11dGF0aW9uIG9ic2VydmVyIG9ic2VydmUgdGhlIGVudGlyZSBkb2N1bWVudCBmb3IgY2hhbmdlc1xyXG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwge1xyXG4gICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXHJcbiAgICAgICAgICAgIHN1YnRyZWU6IHRydWVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gQWRkIGFuIGV2ZW50IGxpc3RlbmVyIHRvIGRldGVjdCBuYXZpZ2F0aW9ucyBvbiB0aGUgcGFnZVxyXG4gICAgICAgIG5hdmlnYXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcIm5hdmlnYXRlXCIsIChlOiBOYXZpZ2F0aW9uRXZlbnQpID0+IHRoaXMub25OYXZpZ2F0aW9uRGV0ZWN0aW9uKGUpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgKiBBZGRzIGxpc3RlbmVycyB0byBtdXRhdGlvbnMgKGllLiBuZXdseSByZW5kZXJlZCBlbGVtZW50cykgYW5kIG1hcmtzIHRoZW0gd2l0aCB0aGlzLmludGVyYWN0dGlvbkF0dHJpYnV0ZS5cclxuICAgKiBJZiBkZWJ1ZyBtb2RlIGlzIG9uLCB0aGlzIHdpbGwgYWRkIGEgY29sb3VyZnVsIGJvcmRlciB0byB0aGVzZSBlbGVtZW50cy5cclxuICAgKi9cclxuXHJcbiAgICBwcml2YXRlIGFkZExpc3RlbmVyc1RvTmV3TWF0Y2hlcygpOiB2b2lkIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImFkZGluZyBzZWxlY3RvcnNcIik7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYFZhbHVlIG9mIGhpZ2hsaWdodDogJHt0aGlzLmhpZ2hsaWdodH1gKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkN1cnJlbnQgcGFnZSBkYXRhOlwiKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRQYWdlRGF0YSk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGFnZURhdGEuc2VsZWN0b3JOYW1lUGFpcnMuZm9yRWFjaChzZWxlY3Rvck5hbWVQYWlyID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZWxlbWVudHM6IE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgOmlzKCR7c2VsZWN0b3JOYW1lUGFpci5zZWxlY3Rvcn0pOm5vdChbJHt0aGlzLmh0bWxNb25pdG9yaW5nQXR0cmlidXRlfV0pYCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG5hbWU6IHN0cmluZyA9IHNlbGVjdG9yTmFtZVBhaXIubmFtZTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIGVsZW1lbnRzKXtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVuYWJsZUhpZ2hsaWdodGluZyl7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXIgPSBgMnB4IHNvbGlkICR7dGhpcy5TdHJpbmdUb0NvbG9yLm5leHQobmFtZSl9YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKHRoaXMuaHRtbE1vbml0b3JpbmdBdHRyaWJ1dGUsICd0cnVlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpZSBvZiB0aGlzLmh0bWxFdmVudHNUb01vbml0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoaWUsIChlOiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uSW50ZXJhY3Rpb25EZXRlY3Rpb24oZWxlbWVudCwgZSwgbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0LlxyXG4gICAqIEBwYXJhbSBhY3Rpdml0eVR5cGUgLSAgdGhlIHR5cGUgb2YgYWN0aXZpdHkgKHNlbGYgbG9vcCBvciBzdGF0ZSBjaGFuZ2UpXHJcbiAgICogQHBhcmFtIGV2ZW50IC0gdGhlIEhUTUwgZXZlbnQgdGhhdCBvY2N1cmVkXHJcbiAgICogXHJcbiAgICogQHJldHVybnMgQSBkb2N1bWVudCBkZXNjcmliaW5nIHNlbGYgbG9vcFxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlTmF2aWdhdGlvblJlY29yZChhY3Rpdml0eVR5cGU6IEFjdGl2aXR5VHlwZSwgZXZlbnQ6IEV2ZW50KTogREJEb2N1bWVudCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJEZXRlY3RlZCBzZWxmIGxvb3AgY2hhbmdlIGV2ZW50XCIpO1xyXG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gdGhpcy5leHRyYWN0b3JMaXN0LmV4dHJhY3QodGhpcy5jdXJyZW50UGFnZURhdGEuY3VycmVudFVSTCwgU2VuZGVyTWV0aG9kLk5hdmlnYXRpb25EZXRlY3Rpb24pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicHJpbnRpbmcgbWV0YWRhdGFcIik7XHJcbiAgICAgICAgY29uc29sZS5sb2cobWV0YWRhdGEpO1xyXG4gICAgICAgIHJldHVybiBuZXcgQWN0aXZpdHlEb2N1bWVudChhY3Rpdml0eVR5cGUsIGV2ZW50LCBtZXRhZGF0YSwgdGhpcy5jdXJyZW50UGFnZURhdGEuY3VycmVudFVSTCwgZG9jdW1lbnQudGl0bGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIFNlbmRzIGEgbWVzc2FnZSB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHQuXHJcbiAgICogQHBhcmFtIGVsZW1lbnQgLSB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJlZCB0aGUgZXZlbnRcclxuICAgKiBAcGFyYW0gbmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBlbGVtZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBjYWxsYmFjayAoYXMgZGVmaW5lZCBpbiB0aGUgY29uZmlnKVxyXG4gICAqIEBwYXJhbSBldmVudCAtIHRoZSBIVE1MIGV2ZW50IHRoYXQgb2NjdXJlZFxyXG4gICAqIEByZXR1cm5zIEEgZG9jdW1lbnQgaW50ZXJhY3Rpb24gc2VsZiBsb29wXHJcbiAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVJbnRlcmFjdGlvblJlY29yZChlbGVtZW50OiBFbGVtZW50LCBuYW1lOiBzdHJpbmcsIGV2ZW50OiBFdmVudCk6IERCRG9jdW1lbnQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGV0ZWN0ZWQgaW50ZXJhY3Rpb24gZXZlbnRcIik7XHJcbiAgICAgICAgY29uc3QgcGFnZVNwZWNpZmljRGF0YTogb2JqZWN0ID0ge1xyXG4gICAgICAgICAgICBodG1sOiBlbGVtZW50LmdldEhUTUwoKSxcclxuICAgICAgICAgICAgZWxlbWVudE5hbWU6IG5hbWUsXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCBleHRyYWN0ZWREYXRhID0gdGhpcy5leHRyYWN0b3JMaXN0LmV4dHJhY3QodGhpcy5jdXJyZW50UGFnZURhdGEuY3VycmVudFVSTCwgXHJcbiAgICAgICAgICAgIFNlbmRlck1ldGhvZC5JbnRlcmFjdGlvbkRldGVjdGlvbik7XHJcblxyXG4gICAgICAgIGNvbnN0IG1ldGFkYXRhOiBFeHRyYWN0ZWRNZXRhZGF0YSA9IHsuLi4gcGFnZVNwZWNpZmljRGF0YSwgLi4uIGV4dHJhY3RlZERhdGEgYXMgb2JqZWN0fSBhcyBFeHRyYWN0ZWRNZXRhZGF0YTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJwcmludGluZyBtZXRhZGF0YVwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhtZXRhZGF0YSk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEFjdGl2aXR5RG9jdW1lbnQoQWN0aXZpdHlUeXBlLkludGVyYWN0aW9uLCBldmVudCwgbWV0YWRhdGEsIHRoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkwsIGRvY3VtZW50LnRpdGxlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0LlxyXG4gICAqIEBwYXJhbSBzZW5kZXJNZXRob2QgLSB0aGUgbmFtZSBvZiB0aGUgZnVuY3Rpb24gdGhhdCdzIHNlbmRpbmcgdGhlIG1lc3NhZ2UgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0XHJcbiAgICogQHBhcmFtIHBheWxvYWQgLSB0aGUgZGF0YSBiZWluZyBzZW50IHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdFxyXG4gICAqIFxyXG4gICAqIEByZXR1cm5zIFJlc3BvbnNlIGluZGljYXRpbmcgd2hldGhlciB0aGUgbWVzc2FnZSBzdWNjZWVkZWRcclxuICAgKi9cclxuXHJcbiAgICBwcml2YXRlIGFzeW5jIHNlbmRNZXNzYWdlVG9CYWNrZ3JvdW5kKHNlbmRlck1ldGhvZDogU2VuZGVyTWV0aG9kLCBwYXlsb2FkOiBEQkRvY3VtZW50KTogUHJvbWlzZTxNZXNzYWdlUmVzcG9uc2UgfCBudWxsPiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgcnVudGltZSBpcyBhdmFpbGFibGUgKGV4dGVuc2lvbiBjb250ZXh0IHN0aWxsIHZhbGlkKVxyXG4gICAgICAgICAgICBpZiAoIWNocm9tZS5ydW50aW1lPy5pZCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHRlbnNpb24gY29udGV4dCBpbnZhbGlkYXRlZCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlIDogQmFja2dyb3VuZE1lc3NhZ2UgPSBuZXcgQmFja2dyb3VuZE1lc3NhZ2Uoc2VuZGVyTWV0aG9kLCBwYXlsb2FkKTtcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgOiBNZXNzYWdlUmVzcG9uc2UgPSBhd2FpdCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShtZXNzYWdlKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIENocm9tZSByZXR1cm5zIHVuZGVmaW5lZCBpZiBubyBsaXN0ZW5lcnMsIGNoZWNrIGlmIHRoYXQncyBleHBlY3RlZFxyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignTm8gcmVzcG9uc2UgZnJvbSBiYWNrZ3JvdW5kIHNjcmlwdCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdCYWNrZ3JvdW5kIG1lc3NhZ2UgZmFpbGVkOicsIGVycm9yKTtcclxuICAgICAgICAgICAgLy8gRGVjaWRlIHdoZXRoZXIgdG8gdGhyb3cgb3IgaGFuZGxlIGdyYWNlZnVsbHkgYmFzZWQgb24geW91ciBuZWVkc1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDsgLy8gb3IgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIENhbGxiYWNrIHRoYXQgY3JlYXRlcyBhIHBheWxvYWQgZGVzY3JpYmluZyB0aGUgaW50ZXJhY3Rpb24gdGhhdCBvY2N1cmVkIGFuZCBzZW5kcyBpdCB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHRcclxuICAgKiBAcGFyYW0gZWxlbWVudCAtIHRoZSBldmVudCB0aGF0IHRyaWdnZXJlZCB0aGUgY2FsbGJhY2tcclxuICAgKiBAcGFyYW0gbmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBlbGVtZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBjYWxsYmFjayAoYXMgZGVmaW5lZCBpbiB0aGUgY29uZmlnKVxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgb25JbnRlcmFjdGlvbkRldGVjdGlvbihlbGVtZW50OiBFbGVtZW50LCBlOiBFdmVudCwgbmFtZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJpbnRlcmFjdGlvbiBldmVudCBkZXRlY3RlZFwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgRXZlbnQgZGV0ZWN0ZWQgd2l0aCBldmVudCB0eXBlOiAke2UudHlwZX1gKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgRXZlbnQgdHJpZ2dlcmVkIGJ5YCwgZWxlbWVudCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudC5pbm5lckhUTUwpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnQuZ2V0SFRNTCgpKTtcclxuICAgICAgICBjb25zdCByZWNvcmQ6IERCRG9jdW1lbnQgPSB0aGlzLmNyZWF0ZUludGVyYWN0aW9uUmVjb3JkKGVsZW1lbnQsIG5hbWUsIGUpO1xyXG4gICAgICAgIHRoaXMuc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoU2VuZGVyTWV0aG9kLkludGVyYWN0aW9uRGV0ZWN0aW9uLCByZWNvcmQpXHJcbiAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHNlbmQgaW50ZXJhY3Rpb24gZGF0YTonLCBlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpc05ld0Jhc2VVUkwodXJsOiBzdHJpbmcgfCBudWxsKTogYm9vbGVhbntcclxuICAgICAgICByZXR1cm4gdXJsICYmIHRoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkxcclxuICAgICAgICAgICAgPyB1cmwuc3BsaXQoXCIuXCIpWzFdICE9PSB0aGlzLmN1cnJlbnRQYWdlRGF0YS5jdXJyZW50VVJMLnNwbGl0KFwiLlwiKVsxXVxyXG4gICAgICAgICAgICA6IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsbGJhY2sgdGhhdCBjcmVhdGVzIGEgcGF5bG9hZCBkZXNjcmliaW5nIHRoZSBuYXZpZ2F0aW9uIHRoYXQgb2NjdXJlZCBhbmQgc2VuZHMgaXQgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0XHJcbiAgICAgKiBAcGFyYW0gbmF2RXZlbnQgLSB0aGUgZXZlbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIGNhbGxiYWNrXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgb25OYXZpZ2F0aW9uRGV0ZWN0aW9uKG5hdkV2ZW50OiBOYXZpZ2F0aW9uRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBkZXN0VXJsOiBzdHJpbmcgfCBudWxsID0gbmF2RXZlbnQuZGVzdGluYXRpb24udXJsO1xyXG4gICAgICAgIGNvbnN0IGJhc2VVUkxDaGFuZ2U6IGJvb2xlYW4gPSB0aGlzLmlzTmV3QmFzZVVSTChkZXN0VXJsKTtcclxuICAgICAgICBsZXQgcmVjb3JkOiBEQkRvY3VtZW50IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGxldCBzZW5kZXI6IFNlbmRlck1ldGhvZCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlRGF0YS5jdXJyZW50VVJMID0gbmF2RXZlbnQuZGVzdGluYXRpb24udXJsID8/IFwiTk8gVVJMIEZPVU5EXCI7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGBOYXZpZ2F0aW9uIGRldGVjdGVkIHdpdGggZXZlbnQgdHlwZTogJHtuYXZFdmVudC50eXBlfWApXHJcbiAgICAgICAgaWYgKGJhc2VVUkxDaGFuZ2Upe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVSTCBiYXNlIGNoYW5nZSBkZXRlY3RlZC4gQ2xvc2luZyBwcm9ncmFtLlwiKTtcclxuICAgICAgICAgICAgcmVjb3JkID0gbmV3IERCRG9jdW1lbnQodGhpcy5jdXJyZW50UGFnZURhdGEuY3VycmVudFVSTCwgZG9jdW1lbnQudGl0bGUpXHJcbiAgICAgICAgICAgIHNlbmRlciA9IFNlbmRlck1ldGhvZC5DbG9zZVNlc3Npb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG5hdkV2ZW50Lm5hdmlnYXRpb25UeXBlID09PSBcInB1c2hcIikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlB1c2ggZXZlbnQgZGV0ZWN0ZWQuXCIpO1xyXG4gICAgICAgICAgICByZWNvcmQgPSB0aGlzLmNyZWF0ZU5hdmlnYXRpb25SZWNvcmQoQWN0aXZpdHlUeXBlLlN0YXRlQ2hhbmdlICxuYXZFdmVudCk7XHJcbiAgICAgICAgICAgIHNlbmRlciA9IFNlbmRlck1ldGhvZC5OYXZpZ2F0aW9uRGV0ZWN0aW9uO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlRGF0YS51cGRhdGUoZG9jdW1lbnQubG9jYXRpb24uaHJlZik7XHJcbiAgICAgICAgfSBlbHNlIGlmIChuYXZFdmVudC5uYXZpZ2F0aW9uVHlwZSA9PT0gXCJyZXBsYWNlXCIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXBsYWNlIGV2ZW50IGRldGVjdGVkLlwiKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJlY29yZCA9IHRoaXMuY3JlYXRlTmF2aWdhdGlvblJlY29yZChBY3Rpdml0eVR5cGUuU2VsZkxvb3AgLG5hdkV2ZW50KTtcclxuICAgICAgICAgICAgc2VuZGVyID0gU2VuZGVyTWV0aG9kLk5hdmlnYXRpb25EZXRlY3Rpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mKHJlY29yZCkgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mKHNlbmRlcikgIT09IFwidW5kZWZpbmVkXCIpe1xyXG4gICAgICAgICAgICB0aGlzLnNlbmRNZXNzYWdlVG9CYWNrZ3JvdW5kKHNlbmRlciwgcmVjb3JkKS5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gc2VuZCBpbnRlcmFjdGlvbiBkYXRhOicsIGVycm9yKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgKiBHZW5lcmF0ZXMgYSB1bmlxdWUgY29sb3IgZnJvbSBhIGdpdmVuIHN0cmluZ1xyXG4gICAqIFNvdXJjZTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzMxMDM3MzgzIFxyXG4gICAqIEByZXR1cm5zIENvbG9yIGhleCBjb2RlXHJcbiAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBTdHJpbmdUb0NvbG9yID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpbnRlcmZhY2UgQ29sb3JJbnN0YW5jZSB7XHJcbiAgICAgICAgICAgIHN0cmluZ1RvQ29sb3JIYXNoOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xyXG4gICAgICAgICAgICBuZXh0VmVyeURpZmZlcm50Q29sb3JJZHg6IG51bWJlcjtcclxuICAgICAgICAgICAgdmVyeURpZmZlcmVudENvbG9yczogc3RyaW5nW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaW5zdGFuY2U6IENvbG9ySW5zdGFuY2UgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbmV4dDogZnVuY3Rpb24gc3RyaW5nVG9Db2xvcihzdHI6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZSA/Pz0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0cmluZ1RvQ29sb3JIYXNoOiB7fSxcclxuICAgICAgICAgICAgICAgICAgICBuZXh0VmVyeURpZmZlcm50Q29sb3JJZHg6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgdmVyeURpZmZlcmVudENvbG9yczogW1wiIzAwRkYwMFwiLCBcIiMwMDAwRkZcIiwgXCIjRkYwMDAwXCIsIFwiIzAxRkZGRVwiLCBcIiNGRkE2RkVcIiwgXCIjRkZEQjY2XCIsIFwiIzAwNjQwMVwiLCBcIiMwMTAwNjdcIiwgXCIjOTUwMDNBXCIsIFwiIzAwN0RCNVwiLCBcIiNGRjAwRjZcIiwgXCIjRkZFRUU4XCIsIFwiIzc3NEQwMFwiLCBcIiM5MEZCOTJcIiwgXCIjMDA3NkZGXCIsIFwiI0Q1RkYwMFwiLCBcIiNGRjkzN0VcIiwgXCIjNkE4MjZDXCIsIFwiI0ZGMDI5RFwiLCBcIiNGRTg5MDBcIiwgXCIjN0E0NzgyXCIsIFwiIzdFMkREMlwiLCBcIiM4NUE5MDBcIiwgXCIjRkYwMDU2XCIsIFwiI0E0MjQwMFwiLCBcIiMwMEFFN0VcIiwgXCIjNjgzRDNCXCIsIFwiI0JEQzZGRlwiLCBcIiMyNjM0MDBcIiwgXCIjQkREMzkzXCIsIFwiIzAwQjkxN1wiLCBcIiM5RTAwOEVcIiwgXCIjMDAxNTQ0XCIsIFwiI0MyOEM5RlwiLCBcIiNGRjc0QTNcIiwgXCIjMDFEMEZGXCIsIFwiIzAwNDc1NFwiLCBcIiNFNTZGRkVcIiwgXCIjNzg4MjMxXCIsIFwiIzBFNENBMVwiLCBcIiM5MUQwQ0JcIiwgXCIjQkU5OTcwXCIsIFwiIzk2OEFFOFwiLCBcIiNCQjg4MDBcIiwgXCIjNDMwMDJDXCIsIFwiI0RFRkY3NFwiLCBcIiMwMEZGQzZcIiwgXCIjRkZFNTAyXCIsIFwiIzYyMEUwMFwiLCBcIiMwMDhGOUNcIiwgXCIjOThGRjUyXCIsIFwiIzc1NDRCMVwiLCBcIiNCNTAwRkZcIiwgXCIjMDBGRjc4XCIsIFwiI0ZGNkU0MVwiLCBcIiMwMDVGMzlcIiwgXCIjNkI2ODgyXCIsIFwiIzVGQUQ0RVwiLCBcIiNBNzU3NDBcIiwgXCIjQTVGRkQyXCIsIFwiI0ZGQjE2N1wiLCBcIiMwMDlCRkZcIiwgXCIjRTg1RUJFXCJdXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghaW5zdGFuY2Uuc3RyaW5nVG9Db2xvckhhc2hbc3RyXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoW3N0cl0gPSBpbnN0YW5jZS52ZXJ5RGlmZmVyZW50Q29sb3JzW2luc3RhbmNlLm5leHRWZXJ5RGlmZmVybnRDb2xvcklkeCsrXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgJWMgVGhlIGNvbG91ciBmb3IgJHtzdHJ9YCwgYGNvbG9yOiAke2luc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoW3N0cl19YCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5zdGFuY2Uuc3RyaW5nVG9Db2xvckhhc2hbc3RyXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KSgpO1xyXG59XHJcbiIsImltcG9ydCB7VVJMUGF0dGVyblRvU2VsZWN0b3JzLCBTZWxlY3Rvck5hbWVQYWlyLCBDb25maWd9IGZyb20gXCIuL2NvbmZpZ1wiO1xyXG4vKipcclxuICogQSBjbGFzcyByZXNwb25zaWJsZSBmb3IgdHJhY2tpbmcgdGhlIHN0YXRlIG9mIHRoZSBwYWdlIHRoYXQgdGhlIHVzZXIgaXMgY3VycmVudGx5IG9uLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFBhZ2VEYXRhIHtcclxuICAgIC8vIEN1cnJlbnQgVVJMIG9mIHRoZSBwYWdlXHJcbiAgICBjdXJyZW50VVJMITogc3RyaW5nO1xyXG4gICAgLy8gQ1NTIHNlbGVjdG9ycyBiZWluZyBhcHBsaWVkIHRvIHRoZSBwYWdlXHJcbiAgICBzZWxlY3Rvck5hbWVQYWlycyE6IFNlbGVjdG9yTmFtZVBhaXJbXTtcclxuICAgIGJhc2VVUkw6IHN0cmluZztcclxuICAgIHVybFBhdHRlcm5Ub1NlbGVjdG9yRGF0YTogVVJMUGF0dGVyblRvU2VsZWN0b3JzO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29uZmlnKXtcclxuICAgICAgICB0aGlzLnVybFBhdHRlcm5Ub1NlbGVjdG9yRGF0YSA9IGNvbmZpZy5wYXRocztcclxuICAgICAgICB0aGlzLmJhc2VVUkwgPSBjb25maWcuYmFzZVVSTDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlcyB0aGUgVVJMIGFuZCB0aGUgbGlzdCBvZiBDU1Mgc2VsZWN0b3JzIGZvciB0aGUgVVJMXHJcbiAgICAgKiBAcGFyYW0gbmV3VVJMOiBUaGUgZnVsbCB1cmwgb2YgdGhlIGN1cnJlbnQgcGFnZVxyXG4gICAgICovXHJcbiAgICB1cGRhdGUobmV3VVJMOiBzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuY3VycmVudFVSTCA9IG5ld1VSTDtcclxuICAgICAgICBjb25zdCBtYXRjaGluZ1VSTFBhdHRlcm5zOiBzdHJpbmdbXSA9IHRoaXMuZ2V0TWF0Y2hpbmdQYXR0ZXJucygpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0b3JOYW1lUGFpcnMgPSB0aGlzLmdldFNlbGVjdG9yTmFtZVBhaXJzKG1hdGNoaW5nVVJMUGF0dGVybnMpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIGBtYXRjaFBhdGhEYXRhYCB0byBiZSB0aGUgUGF0aERhdGEgZm9yIHRoZSBVUkwgcGF0dGVybiB3aXRoIHRoZSBjbG9zZXQgbWF0Y2ggdG8gYHRoaXMuYmFzZVVSTGBcclxuICAgICAqIGFuZCByZXR1cm5zIGEgbGlzdCBvZiBhbGwgbWF0Y2hlcy4gQWRkaXRpb25hbGx5LCBpdCB1cGRhdGVzIHdoZXRoZXIgdGhlIGN1cnJlbnQgcGF0aFxyXG4gICAgICogaW5jbHVkZXMgYW4gaWQuXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm5zIEEgbGlzdCBvZiBhbGwgcGF0dGVybnMgaW4gdGhlIGNvbmZpZyB0aGF0IG1hdGNoIGBiYXNlVVJMYFxyXG4gICAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBnZXRNYXRjaGluZ1BhdHRlcm5zKCk6IHN0cmluZ1tde1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwidXBkYXRpbmcgcGFnZSBkYXRhXCIpO1xyXG5cclxuICAgICAgICAvLyBHZXQgYSBsaXN0IG9mIGFsbCB0aGUgcGF0aHMgdGhhdCBtYXRjaCB0aGUgY3VycmVudCBVUkxcclxuICAgICAgICBjb25zdCBtYXRjaGluZ1VSTFBhdHRlcm5zOiBzdHJpbmdbXSA9IE9iamVjdC5rZXlzKHRoaXMudXJsUGF0dGVyblRvU2VsZWN0b3JEYXRhKS5maWx0ZXIoKHBhdGgpID0+IHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocGF0aCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhdHRlcm46IFVSTFBhdHRlcm4gPSBuZXcgVVJMUGF0dGVybihwYXRoLCB0aGlzLmJhc2VVUkwpO1xyXG4gICAgICAgICAgICBjb25zdCBtYXRjaDogYm9vbGVhbiA9IHBhdHRlcm4udGVzdCh0aGlzLmN1cnJlbnRVUkwpO1xyXG4gICAgICAgICAgICByZXR1cm4gbWF0Y2g7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChtYXRjaGluZ1VSTFBhdHRlcm5zLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vIG1hdGNoZXMgZm91bmRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbWF0Y2hpbmdVUkxQYXR0ZXJucztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBtYXRjaGluZ1VSTFBhdHRlcm5zOiBBIGxpc3Qgb2YgYWxsIG1hdGNoaW5nIHBhdGhzIHRvIHRoZSBjdXJyZW50IHVybFxyXG4gICAgICogXHJcbiAgICAgKiBAcmV0dXJucyBBIGxpc3Qgb2YgYWxsIHNlbGVjdG9ycyBmb3IgdGhlIG1hdGNoaW5nIHBhdGhzXHJcbiAgICAgKi9cclxuXHJcbiAgICBwcml2YXRlIGdldFNlbGVjdG9yTmFtZVBhaXJzKG1hdGNoaW5nVVJMUGF0dGVybnM6IHN0cmluZ1tdKTogU2VsZWN0b3JOYW1lUGFpcltdIHtcclxuICAgICAgICBsZXQgY3VycmVudFNlbGVjdG9yTmFtZVBhaXJzOiBTZWxlY3Rvck5hbWVQYWlyW10gPSBbXTtcclxuICAgICAgICBmb3IgKGNvbnN0IHVybFBhdHRlcm4gb2YgbWF0Y2hpbmdVUkxQYXR0ZXJucykge1xyXG4gICAgICAgICAgICBjb25zdCBzZWxlY3Rvck5hbWVQYWlyczogU2VsZWN0b3JOYW1lUGFpcltdID0gdGhpcy51cmxQYXR0ZXJuVG9TZWxlY3RvckRhdGFbdXJsUGF0dGVybl07XHJcbiAgICAgICAgICAgIGN1cnJlbnRTZWxlY3Rvck5hbWVQYWlycyA9IGN1cnJlbnRTZWxlY3Rvck5hbWVQYWlycy5jb25jYXQoc2VsZWN0b3JOYW1lUGFpcnMpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjdXJyZW50U2VsZWN0b3JOYW1lUGFpcnM7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2NvbnRlbnQudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=