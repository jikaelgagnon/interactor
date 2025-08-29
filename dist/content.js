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
   * @param event - the HTML event that occured
   * @returns A document describing the state change
   */
    createStateChangeRecord(event) {
        console.log("Detected state change event");
        const metadata = this.extractorList.extract(this.currentPageData.currentURL, sender_1.SenderMethod.NavigationDetection);
        console.log("printing metadata");
        console.log(metadata);
        return new dbdocument_1.ActivityDocument(activity_1.ActivityType.StateChange, event, metadata, this.currentPageData.currentURL, document.title);
    }
    /**
   * Sends a message to the background script.
   * @param event - the HTML event that occured
   * @param urlChange - indicates whether the self-loop resulted in a url change
   *
   * @returns A document describing self loop
   */
    createSelfLoopRecord(event) {
        console.log("Detected self loop change event");
        const metadata = this.extractorList.extract(this.currentPageData.currentURL, sender_1.SenderMethod.NavigationDetection);
        console.log("printing metadata");
        console.log(metadata);
        return new dbdocument_1.ActivityDocument(activity_1.ActivityType.SelfLoop, event, metadata, this.currentPageData.currentURL, document.title);
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
        const extractedData = this.extractorList.extract(this.currentPageData.currentURL, sender_1.SenderMethod.InteractionDetection);
        metadata = Object.assign(Object.assign({}, metadata), extractedData);
        console.log("printing metadata");
        console.log(metadata);
        return new dbdocument_1.ActivityDocument(activity_1.ActivityType.Interaction, event, metadata, this.currentPageData.currentURL, document.title);
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
   * @param e - the event that triggered the callback
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
            // Maybe queue for retry, or just log and continue
        });
    }
    isNewBaseURL(url) {
        return url && this.currentPageData.currentURL
            ? url.split(".")[1] !== this.currentPageData.currentURL.split(".")[1]
            : false;
    }
    /**
     * Callback that creates a payload describing the navigation that occured and sends it to the background script
     * @param e - the event that triggered the callback
     * @param name - the name of the element that triggered the callback (as defined in the config)
     */
    onNavigationDetection(navEvent) {
        const destUrl = navEvent.destination.url;
        const baseURLChange = this.isNewBaseURL(destUrl);
        // const urlChange = !(navEvent.destination.url === this.currentPageData.url);
        // let sourceState = this.getCleanStateName();
        // let match = this.currentPageData.checkForMatch(navEvent.destination.url);
        if (destUrl) {
            this.currentPageData.currentURL = navEvent.destination.url;
        }
        else {
            console.log("No destination URL found in navigate event. Setting to empty string");
            this.currentPageData.currentURL = "NO URL FOUND";
        }
        // let destState = this.getCleanStateName();
        console.log(`Navigation detected with event type: ${navEvent.type}`);
        if (baseURLChange) {
            console.log("URL base change detected. Closing program.");
            this.sendMessageToBackground(sender_1.SenderMethod.CloseSession, new dbdocument_1.DBDocument(this.currentPageData.currentURL, document.title)).catch(error => {
                console.error('Failed to send interaction data:', error);
            });
        }
        else if (navEvent.navigationType === "push") {
            console.log("Push event detected.");
            const record = this.createStateChangeRecord(navEvent);
            this.sendMessageToBackground(sender_1.SenderMethod.NavigationDetection, record).catch(error => {
                console.error('Failed to send interaction data:', error);
            });
            this.currentPageData.update(document.location.href);
        }
        else if (navEvent.navigationType === "replace") {
            console.log("Replace event detected.");
            const record = this.createSelfLoopRecord(navEvent);
            this.sendMessageToBackground(sender_1.SenderMethod.NavigationDetection, record).catch(error => {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQyxFQUFFLENBQUM7WUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFFRCxPQUFPLG1CQUFtQixDQUFDO0lBQy9CLENBQUM7SUFFRDs7OztPQUlHO0lBRUssb0JBQW9CLENBQUMsbUJBQTZCO1FBQ3RELElBQUksd0JBQXdCLEdBQXVCLEVBQUUsQ0FBQztRQUN0RCxLQUFLLE1BQU0sVUFBVSxJQUFJLG1CQUFtQixFQUFFLENBQUM7WUFDM0MsTUFBTSxpQkFBaUIsR0FBdUIsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hGLHdCQUF3QixHQUFHLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztRQUNqRixDQUFDO1FBQ0QsT0FBTyx3QkFBd0IsQ0FBQztJQUNwQyxDQUFDO0NBQ0o7QUE3REQsNEJBNkRDOzs7Ozs7O1VDakVEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbW1vbi9jb21tdW5pY2F0aW9uL2FjdGl2aXR5LnRzIiwid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvY29tbW9uL2NvbW11bmljYXRpb24vYmFja2dyb3VuZG1lc3NhZ2UudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb21tb24vY29tbXVuaWNhdGlvbi9zZW5kZXIudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb21tb24vZGJkb2N1bWVudC50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbnRlbnQudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb250ZW50L2NvbmZpZy50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbnRlbnQvbW9uaXRvci50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbnRlbnQvcGFnZWRhdGEudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBEZWZpbmVzIGEgbGlzdCBvZiB0aGUgcG9zc2libGUgYWN0aXZpdHkgdHlwZXMgdGhhdCBjYW4gYmUgcmVjb3JkZWQgYnkgdGhlIE1vbml0b3IgY2xhc3NcbiAqL1xuZW51bSBBY3Rpdml0eVR5cGUge1xuICAgIFNlbGZMb29wID0gXCJTZWxmLUxvb3BcIixcbiAgICBTdGF0ZUNoYW5nZSA9IFwiU3RhdGUgQ2hhbmdlXCIsXG4gICAgSW50ZXJhY3Rpb24gPSBcIkludGVyYWN0aW9uXCIsXG4gICAgQm90aCA9IFwiQm90aFwiXG59XG5cbmV4cG9ydCB7QWN0aXZpdHlUeXBlfSIsImltcG9ydCB7REJEb2N1bWVudCB9IGZyb20gXCIuLi9kYmRvY3VtZW50XCI7XG5pbXBvcnQgeyBTZW5kZXJNZXRob2QgfSBmcm9tIFwiLi9zZW5kZXJcIjtcbmV4cG9ydCB7QmFja2dyb3VuZE1lc3NhZ2UsIE1lc3NhZ2VSZXNwb25zZX07XG4vKipcbiAqIEEgY2xhc3MgdXNlZCB0byBzZW5kIG1lc3NhZ2VzIGZyb20gdGhlIGNvbnRlbnQgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0IGluIGEgY29uc2lzdGVudCBmb3JtYXQuXG4gKi9cbmNsYXNzIEJhY2tncm91bmRNZXNzYWdlIHtcbiAgICBzZW5kZXJNZXRob2Q6IFNlbmRlck1ldGhvZDtcbiAgICBwYXlsb2FkOiBEQkRvY3VtZW50O1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBzZW5kZXJNZXRob2QgLSBlbnVtIHR5cGUgb2YgdGhlIG1ldGhvZCBzZW5kaW5nIHRoZSBtZXNzYWdlXG4gICAgICogQHBhcmFtIHBheWxvYWQgLSB0aGUgZGF0YSBiZWluZyBzZW50IHRvIHRoZSBkYXRhYmFzZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yIChzZW5kZXJNZXRob2Q6IFNlbmRlck1ldGhvZCwgcGF5bG9hZDogREJEb2N1bWVudCkge1xuICAgICAgICB0aGlzLnNlbmRlck1ldGhvZCA9IHNlbmRlck1ldGhvZDtcbiAgICAgICAgdGhpcy5wYXlsb2FkID0gcGF5bG9hZDtcbiAgICB9XG59XG5cbmludGVyZmFjZSBNZXNzYWdlUmVzcG9uc2Uge1xuICBzdGF0dXM6IHN0cmluZztcbiAgaGlnaGxpZ2h0PzogYm9vbGVhbjtcbn0iLCJlbnVtIFNlbmRlck1ldGhvZHtcbiAgICBJbml0aWFsaXplU2Vzc2lvbiA9IFwiSW5pdGlhbGl6ZSBTZXNzaW9uXCIsXG4gICAgSW50ZXJhY3Rpb25EZXRlY3Rpb24gPSBcIkludGVyYWN0aW9uIERldGVjdGlvblwiLFxuICAgIE5hdmlnYXRpb25EZXRlY3Rpb24gPSBcIk5hdmlnYXRpb24gRGV0ZWN0aW9uXCIsXG4gICAgQ2xvc2VTZXNzaW9uID0gXCJDbG9zZSBTZXNzaW9uXCIsXG4gICAgQW55ID0gXCJBbnlcIlxufVxuZXhwb3J0IHtTZW5kZXJNZXRob2R9OyIsImltcG9ydCB7IEFjdGl2aXR5VHlwZSB9IGZyb20gXCIuL2NvbW11bmljYXRpb24vYWN0aXZpdHlcIjtcclxuLyoqXHJcbiAqIEEgY2xhc3MgZGVmaW5pbmcgZG9jdW1lbnRzIHRoYXQgYXJlIHNlbnQgdG8gdGhlIGRhdGFiYXNlIGZyb20gdGhlIGNvbnRlbnQgc2NyaXB0XHJcbiAqL1xyXG5jbGFzcyBEQkRvY3VtZW50IHtcclxuICAgIC8vIFVSTCBhdCB3aGljaHQgdGhlIGV2ZW50IHdhcyBjcmVhdGVkXHJcbiAgICBzb3VyY2VVUkw6IHN0cmluZztcclxuICAgIHNvdXJjZURvY3VtZW50VGl0bGU6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgdGl0bGU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc291cmNlVVJMID0gdXJsO1xyXG4gICAgICAgIHRoaXMuc291cmNlRG9jdW1lbnRUaXRsZSA9IHRpdGxlO1xyXG4gICAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgRXh0cmFjdGVkTWV0YWRhdGFPYmplY3Qge1xyXG4gICAgW2tleTogc3RyaW5nXTogRXh0cmFjdGVkTWV0YWRhdGE7XHJcbn1cclxuXHJcbnR5cGUgRXh0cmFjdGVkTWV0YWRhdGEgPVxyXG4gICAgfCBzdHJpbmdcclxuICAgIHwgRXh0cmFjdGVkTWV0YWRhdGFbXVxyXG4gICAgfCBFeHRyYWN0ZWRNZXRhZGF0YU9iamVjdFxyXG4gICAgfCBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+OyAvLyBleHBsaWNpdGx5IGFsbG93IG9iamVjdHMgd2l0aCBzdHJpbmcgdmFsdWVzXHJcblxyXG4vKipcclxuICogQSBjaGlsZCBvZiBEQkRvY3VtZW50IHRoYXQgcmVwcmVzZW50cyBhY3Rpdml0aWVzXHJcbiAqL1xyXG5cclxuY2xhc3MgQWN0aXZpdHlEb2N1bWVudCBleHRlbmRzIERCRG9jdW1lbnR7XHJcbiAgICAvLyBUaGUgdHlwZSBvZiBhY3Rpdml0eSBiZWluZyBsb2dnZWQuIEVpdGhlciBcInN0YXRlX2NoYWdlXCIsIFwic2VsZl9sb29wXCIsIG9yIFwiaW50ZXJhY3Rpb25cIlxyXG4gICAgYWN0aXZpdHlUeXBlOiBBY3Rpdml0eVR5cGUgfCBzdHJpbmc7XHJcbiAgICAvLyBUaW1lc3RhbXAgZm9yIHdoZW4gdGhlIGRvY3VtZW50IHdhcyBjcmVhdGVkXHJcbiAgICBjcmVhdGVkQXQ6IERhdGUgfCBzdHJpbmc7XHJcbiAgICAvLyBFdmVudCB0eXBlIChlZy4gY2xpY2ssIHNjcm9sbCwgZXRjLi4uKVxyXG4gICAgZXZlbnRUeXBlOiBzdHJpbmdcclxuICAgIC8vIE1ldGFkYXRhIGFib3V0IHRoZSBldmVudFxyXG4gICAgbWV0YWRhdGE/OiBFeHRyYWN0ZWRNZXRhZGF0YTtcclxuICAgIGNvbnN0cnVjdG9yKHR5cGU6IEFjdGl2aXR5VHlwZSwgZXZlbnQ6IEV2ZW50LCBtZXRhZGF0YTogRXh0cmFjdGVkTWV0YWRhdGEsIHVybDogc3RyaW5nLCB0aXRsZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIodXJsLCB0aXRsZSk7XHJcbiAgICAgICAgdGhpcy5hY3Rpdml0eVR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlZEF0ID0gbmV3IERhdGUoKTtcclxuICAgICAgICB0aGlzLmV2ZW50VHlwZSA9IGV2ZW50LnR5cGVcclxuICAgICAgICB0aGlzLm1ldGFkYXRhID0gbWV0YWRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIGNoaWxkIG9mIERCRG9jdW1lbnQgdGhhdCByZXByZXNlbnRzIHRoZSBzdGFydCBvZiBhIHNlc3Npb25cclxuICovXHJcblxyXG5jbGFzcyBTZXNzaW9uRG9jdW1lbnQgZXh0ZW5kcyBEQkRvY3VtZW50e1xyXG4gICAgc3RhcnRUaW1lOiBEYXRlO1xyXG4gICAgZW5kVGltZT86IERhdGU7XHJcbiAgICBlbWFpbCA9IFwiRW1haWwgbm90IHNldFwiO1xyXG4gICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcih1cmwsIHRpdGxlKTtcclxuICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IG5ldyBEYXRlKCk7XHJcbiAgICB9XHJcbiAgICBzZXRFbWFpbChlbWFpbDogc3RyaW5nKXtcclxuICAgICAgICB0aGlzLmVtYWlsID0gZW1haWw7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7REJEb2N1bWVudCwgQWN0aXZpdHlEb2N1bWVudCwgU2Vzc2lvbkRvY3VtZW50LCBFeHRyYWN0ZWRNZXRhZGF0YX07IiwiaW1wb3J0IHsgTW9uaXRvciB9IGZyb20gXCIuL2NvbnRlbnQvbW9uaXRvclwiO1xuaW1wb3J0IHl0Q29uZmlnIGZyb20gJy4vY29udGVudC9jb25maWdzL3lvdXR1YmVfY29uZmlnLmpzb24nO1xuLy8gaW1wb3J0IHRpa3Rva0NvbmZpZyBmcm9tICcuL2NvbmZpZ3MvdGlrdG9rX2NvbmZpZy5qc29uJztcbi8vIGltcG9ydCBsaW5rZWRpbkNvbmZpZyBmcm9tICcuL2NvbmZpZ3MvbGlua2VkaW5fY29uZmlnLmpzb24nO1xuaW1wb3J0IHsgQ29uZmlnTG9hZGVyLCBFeHRyYWN0b3JEYXRhIH0gZnJvbSBcIi4vY29udGVudC9jb25maWdcIjtcbi8vIGltcG9ydCB7IEFjdGl2aXR5VHlwZSB9IGZyb20gXCIuL2NvbW11bmljYXRpb24vYWN0aXZpdHlcIjtcbmltcG9ydCB7IFNlbmRlck1ldGhvZCB9IGZyb20gXCIuL2NvbW1vbi9jb21tdW5pY2F0aW9uL3NlbmRlclwiO1xuaW1wb3J0IHsgRXh0cmFjdGVkTWV0YWRhdGEgfSBmcm9tIFwiLi9jb21tb24vZGJkb2N1bWVudFwiO1xuXG5cbmNvbnN0IGdldEhvbWVwYWdlVmlkZW9zID0gKCk6IEV4dHJhY3RlZE1ldGFkYXRhID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZyhcIi0tLS0gRVhUUkFDVElORyBIT01FUEFHRSBMSU5LUyAtLS1cIik7XG4gICAgY29uc3QgY29udGVudERpdnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNjb250ZW50Lnl0ZC1yaWNoLWl0ZW0tcmVuZGVyZXInKSlcbiAgICAgICAgLmZpbHRlcihkaXYgPT4ge1xuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgZWxlbWVudCBpcyBhY3R1YWxseSB2aXNpYmxlXG4gICAgICAgICAgICBjb25zdCByZWN0ID0gZGl2LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgcmV0dXJuIHJlY3Qud2lkdGggPiAwICYmIHJlY3QuaGVpZ2h0ID4gMCAmJiBcbiAgICAgICAgICAgICAgICBnZXRDb21wdXRlZFN0eWxlKGRpdikudmlzaWJpbGl0eSAhPT0gJ2hpZGRlbic7XG4gICAgICAgIH0pO1xuICAgIFxuICAgIGNvbnN0IHZpZGVvcyA9IGNvbnRlbnREaXZzLm1hcChjb250ZW50RGl2ID0+IHtcbiAgICAgICAgLy8gR2V0IHRoZSBkaXJlY3QgYW5jaG9yIGNoaWxkXG4gICAgICAgIGNvbnN0IGFuY2hvciA9IGNvbnRlbnREaXYucXVlcnlTZWxlY3RvcignOnNjb3BlID4geXQtbG9ja3VwLXZpZXctbW9kZWwgYScpIGFzIEhUTUxBbmNob3JFbGVtZW50O1xuICAgICAgICBjb25zdCBzcGFuID0gY29udGVudERpdi5xdWVyeVNlbGVjdG9yKCdoMyBhIHNwYW4ueXQtY29yZS1hdHRyaWJ1dGVkLXN0cmluZycpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxpbms6IGFuY2hvcj8uaHJlZiA/PyAnJyxcbiAgICAgICAgICAgIHRpdGxlOiBzcGFuPy50ZXh0Q29udGVudD8udHJpbSgpID8/ICcnXG4gICAgICAgIH07XG4gICAgfSkuZmlsdGVyKHZpZGVvID0+IHZpZGVvLmxpbmsgIT09ICcnKTtcbiAgICBjb25zdCBtZXRhZGF0YTogRXh0cmFjdGVkTWV0YWRhdGEgPSB7dmlkZW9zOiB2aWRlb3N9O1xuICAgIHJldHVybiBtZXRhZGF0YVxufTtcblxuY29uc3QgZ2V0UmVjb21tZW5kZWRWaWRlb3MgPSAoKTogRXh0cmFjdGVkTWV0YWRhdGEgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiLS0tLSBFWFRSQUNUSU5HIFJFQ09NTUVOREVEIExJTktTIC0tLVwiKTtcbiAgICBjb25zdCBjb250ZW50RGl2cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgneXQtbG9ja3VwLXZpZXctbW9kZWwnKSkuZmlsdGVyKGRpdiA9PiB7XG4gICAgICAgIC8vIENoZWNrIGlmIGVsZW1lbnQgaXMgYWN0dWFsbHkgdmlzaWJsZVxuICAgICAgICBjb25zdCByZWN0ID0gZGl2LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICByZXR1cm4gcmVjdC53aWR0aCA+IDAgJiYgcmVjdC5oZWlnaHQgPiAwICYmIFxuICAgICAgICAgICAgZ2V0Q29tcHV0ZWRTdHlsZShkaXYpLnZpc2liaWxpdHkgIT09ICdoaWRkZW4nO1xuICAgIH0pO1xuICAgIFxuICAgIGNvbnN0IHZpZGVvczogRXh0cmFjdGVkTWV0YWRhdGEgPSBjb250ZW50RGl2cy5tYXAoY29udGVudERpdiA9PiB7XG4gICAgICAgIC8vIEdldCB0aGUgYW5jaG9yIHdpdGggdGhlIHZpZGVvIGxpbmtcbiAgICAgICAgY29uc3QgYW5jaG9yID0gY29udGVudERpdi5xdWVyeVNlbGVjdG9yKCdhW2hyZWZePVwiL3dhdGNoXCJdJykhIGFzIEhUTUxBbmNob3JFbGVtZW50O1xuICAgICAgICBjb25zdCBzcGFuID0gY29udGVudERpdi5xdWVyeVNlbGVjdG9yKCdoMyBhIHNwYW4ueXQtY29yZS1hdHRyaWJ1dGVkLXN0cmluZycpITtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsaW5rOiBhbmNob3I/LmhyZWYgPz8gJycsXG4gICAgICAgICAgICB0aXRsZTogc3Bhbj8udGV4dENvbnRlbnQ/LnRyaW0oKSA/PyAnJ1xuICAgICAgICB9O1xuICAgIH0pLmZpbHRlcih2aWRlbyA9PiB2aWRlby5saW5rICE9PSAnJyk7XG4gICAgXG4gICAgLy8gY29uc29sZS5sb2coXCJQcmludGluZyB0aGUgZmlyc3QgNSB2aWRlb3NcIik7XG4gICAgLy8gY29uc29sZS50YWJsZSh2aWRlb3Muc2xpY2UoMCw1KSk7XG4gICAgY29uc3QgbWV0YWRhdGE6IEV4dHJhY3RlZE1ldGFkYXRhID0ge3ZpZGVvczogdmlkZW9zfTtcbiAgICByZXR1cm4gbWV0YWRhdGE7XG59O1xuXG5jb25zdCBleHRyYWN0b3JzID0gW25ldyBFeHRyYWN0b3JEYXRhKFNlbmRlck1ldGhvZC5JbnRlcmFjdGlvbkRldGVjdGlvbiwgXCIvXCIsIGdldEhvbWVwYWdlVmlkZW9zKSwgXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgRXh0cmFjdG9yRGF0YShTZW5kZXJNZXRob2QuSW50ZXJhY3Rpb25EZXRlY3Rpb24sIFwiL3dhdGNoP3Y9KlwiLCBnZXRSZWNvbW1lbmRlZFZpZGVvcyldXG5cbmNvbnN0IHl0Q29uZmlnTG9hZGVyID0gbmV3IENvbmZpZ0xvYWRlcih5dENvbmZpZywgZXh0cmFjdG9ycyk7XG5cbm5ldyBNb25pdG9yKHl0Q29uZmlnTG9hZGVyKTtcblxuLy8gY29uc3QgdGlrdG9rSURTZWxlY3RvciA9ICgpOiBvYmplY3QgPT4ge1xuLy8gICAgIGxldCB2aWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LnhncGxheWVyLWNvbnRhaW5lci50aWt0b2std2ViLXBsYXllclwiKTtcbi8vICAgICBpZiAoIXZpZCl7XG4vLyAgICAgICAgIGNvbnNvbGUubG9nKFwibm8gdXJsIGZvdW5kIVwiKTtcbi8vICAgICAgICAgcmV0dXJuIHt9O1xuLy8gICAgIH1cbi8vICAgICBsZXQgaWQgPSB2aWQuaWQuc3BsaXQoXCItXCIpLmF0KC0xKTtcbi8vICAgICBsZXQgdXJsID0gYGh0dHBzOi8vdGlrdG9rLmNvbS9zaGFyZS92aWRlby8ke2lkfWA7XG4vLyAgICAgcmV0dXJuIHtcbi8vICAgICAgICAgXCJ1bmlxdWVVUkxcIjogdXJsXG4vLyAgICAgfTtcbi8vIH1cblxuXG5cbi8vIGNvbnNvbGUubG9nKHRpa3Rva0NvbmZpZyk7XG4vLyBjb25zdCB0aWt0b2tDb25maWdMb2FkZXIgPSBuZXcgQ29uZmlnTG9hZGVyKHRpa3Rva0NvbmZpZyk7XG4vLyB0aWt0b2tDb25maWdMb2FkZXIuaW5qZWN0RXh0cmFjdG9yKFwiLypcIiwgdGlrdG9rSURTZWxlY3Rvcik7XG4vLyBjb25zdCB0aWt0b2tJbnRlcmFjdG9yID0gbmV3IE1vbml0b3IodGlrdG9rQ29uZmlnTG9hZGVyLmNvbmZpZyk7XG5cbi8vIC8vIGNvbnNvbGUubG9nKHRpa3Rva0NvbmZpZyk7XG4vLyBjb25zdCBsaW5rZWRpbkNvbmZpZ0xvYWRlciA9IG5ldyBDb25maWdMb2FkZXIobGlua2VkaW5Db25maWcpO1xuLy8gY29uc3QgbGlua2VkaW5JbnRlcmFjdG9yID0gbmV3IE1vbml0b3IobGlua2VkaW5Db25maWdMb2FkZXIuY29uZmlnKTsiLCJpbXBvcnQgeyBTZW5kZXJNZXRob2QgfSBmcm9tIFwiLi4vY29tbW9uL2NvbW11bmljYXRpb24vc2VuZGVyXCI7XG5pbXBvcnQge0V4dHJhY3RlZE1ldGFkYXRhfSBmcm9tIFwiLi4vY29tbW9uL2RiZG9jdW1lbnRcIlxuXG5leHBvcnQge0NvbmZpZywgQ29uZmlnTG9hZGVyLCBVUkxQYXR0ZXJuVG9TZWxlY3RvcnMsIFNlbGVjdG9yTmFtZVBhaXIsIEV4dHJhY3RvckRhdGEsIEV4dHJhY3Rvckxpc3R9O1xuXG5cbmludGVyZmFjZSBTZWxlY3Rvck5hbWVQYWlyIHsgXG4gICAgc2VsZWN0b3I6IHN0cmluZzsgbmFtZTogc3RyaW5nIFxufVxudHlwZSBVUkxQYXR0ZXJuVG9TZWxlY3RvcnMgPSBSZWNvcmQ8c3RyaW5nLCBTZWxlY3Rvck5hbWVQYWlyW10+O1xuXG5cbmludGVyZmFjZSBDb25maWcge1xuICAgIC8qKlxuICAgICAqIEFuIGludGVyZmFjZSB0aGF0IGNvbnRhaW5zIGFsbCB0aGUgZGF0YSByZXF1aXJlZCB0byBpbnN0YW50aWF0ZSBhIE1vbml0b3IuXG4gICAgICovXG4gICAgLy8gVGhlIGJhc2UgVVJMIHRoYXQgdGhlIG1vbml0b3Igc2hvdWxkIHN0YXJ0IGF0XG4gICAgYmFzZVVSTDogc3RyaW5nO1xuICAgIC8vIEEgbWFwcGluZyBvZiBVUkwgcGF0dGVybnMgdG8gcGF0aCBkYXRhLiBUaGUgVVJMIFBhdHRlcm4gc2hvdWxkIGZvbGxvdyB0aGUgXG4gICAgLy8gVVJMIFBhdHRlcm4gQVBJIHN5bnRheC4gVGhlc2UgYXJlIGFwcGVuZGVkIHRvIHRoZSBiYXNlVVJMIHdoZW4gY2hlY2tpbmcgZm9yIG1hdGNoZXNcbiAgICAvLyBFeDogYmFzZVVSTDogd3d3LnlvdXR1YmUuY29tLCBwYXRoOiAvc2hvcnRzLzppZCAtPiB3d3cueW91dHViZS5jb20vc2hvcnRzLzppZFxuICAgIHBhdGhzOiBVUkxQYXR0ZXJuVG9TZWxlY3RvcnM7XG4gICAgLy8gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIE1vbml0b3Igc2hvdWxkIGJlIGluIGRlYnVnIG1vZGUuIElmIHRydWUsIGFkZCBjb2xvdXJlZCBib3hlc1xuICAgIC8vIGFyb3VuZCBzZWxlY3RlZCBIVE1MIGVsZW1lbnRzXG4gICAgZGVidWc/OiBib29sZWFuO1xuICAgIC8vIEEgbGlzdCBvZiBldmVudCB0eXBlcyB0byBtb25pdG9yLiBCeSBkZWZhdWx0LCB0aGlzIGlzIGp1c3QgW1wiY2xpY2tcIl1cbiAgICBldmVudHM/OiBzdHJpbmdbXTtcbn1cblxuY2xhc3MgRXh0cmFjdG9yRGF0YSB7XG4gICAgZXZlbnRUeXBlOiBTZW5kZXJNZXRob2Q7XG4gICAgdXJsUGF0dGVybjogc3RyaW5nO1xuICAgIGV4dHJhY3RvcjogKCkgPT4gRXh0cmFjdGVkTWV0YWRhdGE7XG4gICAgY29uc3RydWN0b3IoYWN0aXZpdHlUeXBlOiBTZW5kZXJNZXRob2QsIHVybFBhdHRlcm46IHN0cmluZywgZXh0cmFjdG9yOiAoKSA9PiBFeHRyYWN0ZWRNZXRhZGF0YSl7XG4gICAgICAgIHRoaXMuZXZlbnRUeXBlID0gYWN0aXZpdHlUeXBlO1xuICAgICAgICB0aGlzLnVybFBhdHRlcm4gPSB1cmxQYXR0ZXJuO1xuICAgICAgICB0aGlzLmV4dHJhY3RvciA9IGV4dHJhY3RvcjtcbiAgICB9XG59XG5cbmNsYXNzIEV4dHJhY3Rvckxpc3Qge1xuICAgIHByaXZhdGUgZXh0cmFjdG9yczogRXh0cmFjdG9yRGF0YVtdO1xuICAgIHByaXZhdGUgYmFzZVVSTDogc3RyaW5nO1xuICAgIGNvbnN0cnVjdG9yKGV4dHJhY3RvcnM6IEV4dHJhY3RvckRhdGFbXSA9IFtdLCBiYXNlVVJMOiBzdHJpbmcpe1xuICAgICAgICB0aGlzLmV4dHJhY3RvcnMgPSBleHRyYWN0b3JzO1xuICAgICAgICB0aGlzLmJhc2VVUkwgPSBiYXNlVVJMO1xuICAgIH1cblxuICAgIHB1YmxpYyBleHRyYWN0KGN1cnJlbnRVUkw6IHN0cmluZywgZXZlbnRUeXBlOiBTZW5kZXJNZXRob2QpOiBFeHRyYWN0ZWRNZXRhZGF0YXtcbiAgICAgICAgY29uc29sZS5sb2coYEF0dGVtcHRpbmcgZXh0cmFjdGlvbiBmb3IgdXJsOiAke2N1cnJlbnRVUkx9IGFuZCBldmVudCB0eXBlICR7ZXZlbnRUeXBlfWApO1xuICAgICAgICBsZXQgZXh0cmFjdGVkRGF0YTogRXh0cmFjdGVkTWV0YWRhdGEgPSB7fTtcbiAgICAgICAgdGhpcy5leHRyYWN0b3JzLmZpbHRlcihlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0NvcnJlY3RBY3Rpdml0eTogYm9vbGVhbiA9IChlLmV2ZW50VHlwZSA9PSBldmVudFR5cGUgfHwgZS5ldmVudFR5cGUgPT0gU2VuZGVyTWV0aG9kLkFueSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcDogVVJMUGF0dGVybiA9IG5ldyBVUkxQYXR0ZXJuKGUudXJsUGF0dGVybiwgdGhpcy5iYXNlVVJMKTtcbiAgICAgICAgICAgICAgICBjb25zdCBpc1VSTE1hdGNoOiBib29sZWFuID0gcC50ZXN0KGN1cnJlbnRVUkwpO1xuICAgICAgICAgICAgICAgIHJldHVybiAoaXNDb3JyZWN0QWN0aXZpdHkgJiYgaXNVUkxNYXRjaCk7XG4gICAgICAgICAgICB9KS5mb3JFYWNoKGUgPT5cbiAgICAgICAgICAgICAgICBleHRyYWN0ZWREYXRhID0gey4uLiBleHRyYWN0ZWREYXRhIGFzIG9iamVjdCwgLi4uIGUuZXh0cmFjdG9yKCkgYXMgb2JqZWN0fVxuICAgICAgICAgICAgKVxuICAgICAgICByZXR1cm4gZXh0cmFjdGVkRGF0YTtcbiAgICB9XG59XG5cbmNsYXNzIENvbmZpZ0xvYWRlciB7XG4gICAgcHVibGljIGNvbmZpZzogQ29uZmlnO1xuICAgIHB1YmxpYyBleHRyYWN0b3JMaXN0OiBFeHRyYWN0b3JMaXN0O1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlnOiBDb25maWcsIGV4dHJhY3Rvckxpc3Q6IEV4dHJhY3RvckRhdGFbXSA9IFtdKXtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgICAgIHRoaXMuZXh0cmFjdG9yTGlzdCA9IG5ldyBFeHRyYWN0b3JMaXN0KGV4dHJhY3Rvckxpc3QsIGNvbmZpZy5iYXNlVVJMKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBCYWNrZ3JvdW5kTWVzc2FnZSwgTWVzc2FnZVJlc3BvbnNlfSBmcm9tIFwiLi4vY29tbW9uL2NvbW11bmljYXRpb24vYmFja2dyb3VuZG1lc3NhZ2VcIjtcclxuaW1wb3J0IHtEQkRvY3VtZW50LCBBY3Rpdml0eURvY3VtZW50LCBTZXNzaW9uRG9jdW1lbnQsIEV4dHJhY3RlZE1ldGFkYXRhfSBmcm9tIFwiLi4vY29tbW9uL2RiZG9jdW1lbnRcIjtcclxuaW1wb3J0IHtDb25maWdMb2FkZXIsIEV4dHJhY3Rvckxpc3R9IGZyb20gXCIuL2NvbmZpZ1wiO1xyXG5pbXBvcnQgeyBQYWdlRGF0YSB9IGZyb20gXCIuL3BhZ2VkYXRhXCI7XHJcbmltcG9ydCB7IEFjdGl2aXR5VHlwZSB9IGZyb20gXCIuLi9jb21tb24vY29tbXVuaWNhdGlvbi9hY3Rpdml0eVwiO1xyXG5pbXBvcnQge1NlbmRlck1ldGhvZH0gZnJvbSBcIi4uL2NvbW1vbi9jb21tdW5pY2F0aW9uL3NlbmRlclwiXHJcblxyXG4vKipcclxuICogVGhpcyBjbGFzcyByZWFkcyBmcm9tIGEgcHJvdmlkZWQgQ29uZmlnIG9iamVjdCBhbmQgYXR0YWNoZXMgbGlzdGVuZXJzIHRvIHRoZSBlbGVtZW50cyBzcGVjaWZpZWQgaW4gdGhlIHNlbGVjdG9ycy5cclxuICogV2hlbiB0aGVzZSBlbGVtZW50cyBhcmUgaW50ZXJhY3RlZCB3aXRoLCBvciB3aGVuIGEgbmF2aWdhdGlvbiBvY2N1cnMsIGEgZG9jdW1lbnQgaXMgc2VudCB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHRcclxuICogdG8gYmUgYXBwZW5kZWQgdG8gdGhlIGRhdGFiYXNlLiBUaGlzIGNsYXNzIGlzIGluc3RhbnRpYXRlZCBpbiBjb250ZW50LnRzLlxyXG4gKiBcclxuICogQHBhcmFtIGludGVyYWN0aW9uRXZlbnRzIC0gQSBsaXN0IG9mIHRoZSB0eXBlIG9mIGV2ZW50cyB3ZSB3YW50IHRvIG1vbml0b3IgYXMgaW50ZXJhY3Rpb25zIChlZy4gY2xpY2ssIHNjcm9sbCwgZXRjLikuIERlZmF1bHQgaXMgY2xpY2tcclxuICogQHBhcmFtIGRlYnVnIC0gSWYgdHJ1ZSwgaGlnaGxpZ2h0IGFsbCBzZWxlY3RlZCBIVE1MIGVsZW1lbnRzIHdpdGggY29sb3VyZWQgYm94ZXNcclxuICogQHBhcmFtIHBhdGhzIC0gQW4gb2JqZWN0IG1hcHBpbmcgcGF0aCBwYXR0ZXJucyB0byB0aGVpciBjb3JyZXNwb25kaW5nIENTUyBzZWxlY3RvcnMgUGF0aCBwYXR0ZXJucyBhcmUgY29uc2lzdGVudCB3aXRoIHRoZSAgVVJMIFBhdHRlcm4gQVBJIFN5bnRheDogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1VSTF9QYXR0ZXJuX0FQSVxyXG4gKiBAcGFyYW0gYmFzZVVSTCAtIEJhc2UgdXJsIGZvciB0aGUgcGFnZSAoZWcuIHd3dy55b3V0dWJlLmNvbSkuIEFsbCBwYXRocyBhcmUgYXBwZW5kZWQgdG8gdGhpcyB3aGVuIG1hdGNoaW5nIFVSbHNcclxuICogQHBhcmFtIGN1cnJlbnRQYWdlRGF0YSAtIENvbnRhaW5zIGRhdGEgcmVsZXZhbnQgdG8gdGhlIGN1cnJlbnQgcGFnZS5cclxuICogQHBhcmFtIGludGVyYWN0aW9uQXR0cmlidXRlIC0gQXR0cmlidXRlIGFkZGVkIHRvIGFsbCBlbGVtZW50cyBiZWluZyBtb25pdG9yZWRcclxuICovXHJcbmV4cG9ydCBjbGFzcyBNb25pdG9yIHtcclxuICAgIC8vIEEgbGlzdCBvZiB0aGUgdHlwZSBvZiBldmVudHMgd2Ugd2FudCB0byBtb25pdG9yIGFzIGludGVyYWN0aW9ucyAoZWcuIGNsaWNrLCBzY3JvbGwsIGV0Yy4pLiBEZWZhdWx0IGlzIGNsaWNrXHJcbiAgICBodG1sRXZlbnRzVG9Nb25pdG9yOiBzdHJpbmdbXTtcclxuICAgIC8vIElmIHRydWUsIGhpZ2hsaWdodCBhbGwgc2VsZWN0ZWQgSFRNTCBlbGVtZW50cyB3aXRoIGNvbG91cmVkIGJveGVzXHJcbiAgICBlbmFibGVIaWdobGlnaHRpbmc6IGJvb2xlYW47XHJcbiAgICAvLyBDb250YWlucyBkYXRhIHJlbGV2YW50IHRvIHRoZSBjdXJyZW50IHBhZ2UuXHJcbiAgICBjdXJyZW50UGFnZURhdGE6IFBhZ2VEYXRhO1xyXG4gICAgLy8gQXR0cmlidXRlIGFkZGVkIHRvIGFsbCBlbGVtZW50cyBiZWluZyBtb25pdG9yZWRcclxuICAgIGh0bWxNb25pdG9yaW5nQXR0cmlidXRlOiBzdHJpbmc7XHJcblxyXG4gICAgZXh0cmFjdG9yTGlzdDogRXh0cmFjdG9yTGlzdDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWdMb2FkZXI6IENvbmZpZ0xvYWRlcikge1xyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IGNvbmZpZ0xvYWRlci5jb25maWc7XHJcbiAgICAgICAgdGhpcy5odG1sRXZlbnRzVG9Nb25pdG9yID0gY29uZmlnLmV2ZW50cyA/PyBbJ2NsaWNrJ107XHJcbiAgICAgICAgdGhpcy5lbmFibGVIaWdobGlnaHRpbmcgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhID0gbmV3IFBhZ2VEYXRhKGNvbmZpZyk7XHJcbiAgICAgICAgdGhpcy5odG1sTW9uaXRvcmluZ0F0dHJpYnV0ZSA9IFwibW9uaXRvcmluZy1pbnRlcmFjdGlvbnNcIlxyXG4gICAgICAgIHRoaXMuZXh0cmFjdG9yTGlzdCA9IGNvbmZpZ0xvYWRlci5leHRyYWN0b3JMaXN0O1xyXG4gICAgICAgIC8vIE9ubHkgaW5pdGlhbGl6ZSBtb25pdG9yIGlmIHRoZSBVUkwgbWF0Y2hlcyBhbmQgXHJcbiAgICAgICAgLy8gdGhlIGNvbnRlbnQgb2YgdGhlIHBhZ2UgaXMgdmlzaWJsZVxyXG4gICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24ub3JpZ2luID09PSBjb25maWcuYmFzZVVSTCkge1xyXG4gICAgICAgICAgICB0aGlzLmludGl0aWFsaXplV2hlblZpc2libGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbnRpdGlhbGl6ZVdoZW5WaXNpYmxlKCk6IHZvaWR7XHJcbiAgICAgICAgY29uc3QgcnVuV2hlblZpc2libGUgPSAoKSA9PiB7IFxyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAndmlzaWJsZScpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZU1vbml0b3IoKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIHJ1bldoZW5WaXNpYmxlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGluaXRpYWxpemluZyBtb25pdG9yOicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3RpbGwgcmVtb3ZlIGxpc3RlbmVyIGV2ZW4gaWYgdGhlcmUncyBhbiBlcnJvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgcnVuV2hlblZpc2libGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcclxuICAgICAgICAgICAgcnVuV2hlblZpc2libGUoKTsgLy8gVGhpcyB3aWxsIG5vdyBiZSBzeW5jaHJvbm91c1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcnVuV2hlblZpc2libGUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgcnVuV2hlblZpc2libGUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemVzIHRoZSBtb25pdG9yXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYXN5bmMgaW5pdGlhbGl6ZU1vbml0b3IoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJpbml0aWFsaXppbmcgbW9uaXRvclwiKTtcclxuICAgICAgICBjb25zdCBjdXJyZW50VVJMOiBzdHJpbmcgPSBkb2N1bWVudC5sb2NhdGlvbi5ocmVmO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLnVwZGF0ZShjdXJyZW50VVJMKTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGVzIGEgbmV3IGVudHJ5IGluIHRoZSBEQiBkZXNjcmliaW5nIHRoZSBzdGF0ZSBhdCB0aGUgc3RhcnQgb2YgdGhlIHNlc3Npb25cclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5pbml0aWFsaXplU2Vzc2lvbigpO1xyXG4gICAgICAgICAgICAvLyBCaW5kcyBsaXN0ZW5lcnMgdG8gdGhlIEhUTUwgZWxlbWVudHMgc3BlY2lmaWVkIGluIHRoZSBjb25maWcgZm9yIGFsbCBtYXRjaGluZyBwYXRoIHBhdHRlcm5zXHJcbiAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIGluaXRpYWxpemUgc2Vzc2lvbjpcIiwgZXJyKTtcclxuICAgICAgICB9XHJcbn1cclxuXHJcbiAgICAvKipcclxuICAgKiBDcmVhdGVzIGEgbmV3IGVudHJ5IGluIHRoZSBEQiBkZXNjcmliaW5nIHRoZSBzdGF0ZSBhdCB0aGUgc3RhcnQgb2YgdGhlIHNlc3Npb25cclxuICAgKi9cclxuICAgIHByaXZhdGUgYXN5bmMgaW5pdGlhbGl6ZVNlc3Npb24oKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgY29uc3QgY3VycmVudFN0YXRlOiBEQkRvY3VtZW50ID0gbmV3IFNlc3Npb25Eb2N1bWVudCh0aGlzLmN1cnJlbnRQYWdlRGF0YS5jdXJyZW50VVJMLCBkb2N1bWVudC50aXRsZSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJDaGVja2luZyBoaWdobGlnaHRcIik7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2U6IE1lc3NhZ2VSZXNwb25zZSB8IG51bGwgPSBhd2FpdCB0aGlzLnNlbmRNZXNzYWdlVG9CYWNrZ3JvdW5kKFNlbmRlck1ldGhvZC5Jbml0aWFsaXplU2Vzc2lvbiwgY3VycmVudFN0YXRlKTtcclxuICAgICAgICBpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2U/LnN0YXR1cyA9PT0gXCJTZXNzaW9uIGluaXRpYWxpemVkXCIgJiYgcmVzcG9uc2UuaGlnaGxpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlSGlnaGxpZ2h0aW5nID0gcmVzcG9uc2UuaGlnaGxpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyhgSGlnaGxpZ2h0IGlzIHNldCB0byAke3RoaXMuZW5hYmxlSGlnaGxpZ2h0aW5nfWApXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogQmluZHMgZXZlbnQgbGlzdGVuZXJzIGZvciBtdXRhdGlvbnMgYW5kIG5hdmlnYXRpb25cclxuICAgKi9cclxuXHJcbiAgICBwcml2YXRlIGJpbmRFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgLy8gV2hlbmV2ZXIgbmV3IGNvbnRlbnQgaXMgbG9hZGVkLCBhdHRhY2ggb2JzZXJ2ZXJzIHRvIGVhY2ggSFRNTCBlbGVtZW50IHRoYXQgbWF0Y2hlcyB0aGUgc2VsZWN0b3JzIGluIHRoZSBjb25maWdzXHJcbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB0aGlzLmFkZExpc3RlbmVyc1RvTmV3TWF0Y2hlcygpKTtcclxuICAgICAgICAvLyBNYWtlIHRoZSBtdXRhdGlvbiBvYnNlcnZlciBvYnNlcnZlIHRoZSBlbnRpcmUgZG9jdW1lbnQgZm9yIGNoYW5nZXNcclxuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHtcclxuICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxyXG4gICAgICAgICAgICBzdWJ0cmVlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBhbiBldmVudCBsaXN0ZW5lciB0byBkZXRlY3QgbmF2aWdhdGlvbnMgb24gdGhlIHBhZ2VcclxuICAgICAgICBuYXZpZ2F0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJuYXZpZ2F0ZVwiLCAoZTogTmF2aWdhdGlvbkV2ZW50KSA9PiB0aGlzLm9uTmF2aWdhdGlvbkRldGVjdGlvbihlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogQWRkcyBsaXN0ZW5lcnMgdG8gbXV0YXRpb25zIChpZS4gbmV3bHkgcmVuZGVyZWQgZWxlbWVudHMpIGFuZCBtYXJrcyB0aGVtIHdpdGggdGhpcy5pbnRlcmFjdHRpb25BdHRyaWJ1dGUuXHJcbiAgICogSWYgZGVidWcgbW9kZSBpcyBvbiwgdGhpcyB3aWxsIGFkZCBhIGNvbG91cmZ1bCBib3JkZXIgdG8gdGhlc2UgZWxlbWVudHMuXHJcbiAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBhZGRMaXN0ZW5lcnNUb05ld01hdGNoZXMoKTogdm9pZCB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJhZGRpbmcgc2VsZWN0b3JzXCIpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBWYWx1ZSBvZiBoaWdobGlnaHQ6ICR7dGhpcy5oaWdobGlnaHR9YCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJDdXJyZW50IHBhZ2UgZGF0YTpcIik7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5jdXJyZW50UGFnZURhdGEpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLnNlbGVjdG9yTmFtZVBhaXJzLmZvckVhY2goc2VsZWN0b3JOYW1lUGFpciA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRzOiBOb2RlTGlzdE9mPEhUTUxFbGVtZW50PiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYDppcygke3NlbGVjdG9yTmFtZVBhaXIuc2VsZWN0b3J9KTpub3QoWyR7dGhpcy5odG1sTW9uaXRvcmluZ0F0dHJpYnV0ZX1dKWApO1xyXG4gICAgICAgICAgICBjb25zdCBuYW1lOiBzdHJpbmcgPSBzZWxlY3Rvck5hbWVQYWlyLm5hbWU7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBlbGVtZW50cyl7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5lbmFibGVIaWdobGlnaHRpbmcpe1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm9yZGVyID0gYDJweCBzb2xpZCAke3RoaXMuU3RyaW5nVG9Db2xvci5uZXh0KG5hbWUpfWA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSh0aGlzLmh0bWxNb25pdG9yaW5nQXR0cmlidXRlLCAndHJ1ZScpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaWUgb2YgdGhpcy5odG1sRXZlbnRzVG9Nb25pdG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGllLCAoZTogRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkludGVyYWN0aW9uRGV0ZWN0aW9uKGVsZW1lbnQsIGUsIG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogU2VuZHMgYSBtZXNzYWdlIHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdC5cclxuICAgKiBAcGFyYW0gZXZlbnQgLSB0aGUgSFRNTCBldmVudCB0aGF0IG9jY3VyZWRcclxuICAgKiBAcmV0dXJucyBBIGRvY3VtZW50IGRlc2NyaWJpbmcgdGhlIHN0YXRlIGNoYW5nZVxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlU3RhdGVDaGFuZ2VSZWNvcmQoZXZlbnQ6IEV2ZW50KTogREJEb2N1bWVudCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJEZXRlY3RlZCBzdGF0ZSBjaGFuZ2UgZXZlbnRcIik7XHJcbiAgICAgICAgY29uc3QgbWV0YWRhdGE6IEV4dHJhY3RlZE1ldGFkYXRhID0gdGhpcy5leHRyYWN0b3JMaXN0LmV4dHJhY3QodGhpcy5jdXJyZW50UGFnZURhdGEuY3VycmVudFVSTCwgU2VuZGVyTWV0aG9kLk5hdmlnYXRpb25EZXRlY3Rpb24pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicHJpbnRpbmcgbWV0YWRhdGFcIik7XHJcbiAgICAgICAgY29uc29sZS5sb2cobWV0YWRhdGEpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEFjdGl2aXR5RG9jdW1lbnQoQWN0aXZpdHlUeXBlLlN0YXRlQ2hhbmdlLCBldmVudCwgbWV0YWRhdGEsIHRoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkwsIGRvY3VtZW50LnRpdGxlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0LlxyXG4gICAqIEBwYXJhbSBldmVudCAtIHRoZSBIVE1MIGV2ZW50IHRoYXQgb2NjdXJlZFxyXG4gICAqIEBwYXJhbSB1cmxDaGFuZ2UgLSBpbmRpY2F0ZXMgd2hldGhlciB0aGUgc2VsZi1sb29wIHJlc3VsdGVkIGluIGEgdXJsIGNoYW5nZVxyXG4gICAqIFxyXG4gICAqIEByZXR1cm5zIEEgZG9jdW1lbnQgZGVzY3JpYmluZyBzZWxmIGxvb3BcclxuICAgKi9cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVNlbGZMb29wUmVjb3JkKGV2ZW50OiBFdmVudCk6IERCRG9jdW1lbnQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGV0ZWN0ZWQgc2VsZiBsb29wIGNoYW5nZSBldmVudFwiKTtcclxuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IHRoaXMuZXh0cmFjdG9yTGlzdC5leHRyYWN0KHRoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkwsIFNlbmRlck1ldGhvZC5OYXZpZ2F0aW9uRGV0ZWN0aW9uKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInByaW50aW5nIG1ldGFkYXRhXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG1ldGFkYXRhKTtcclxuICAgICAgICByZXR1cm4gbmV3IEFjdGl2aXR5RG9jdW1lbnQoQWN0aXZpdHlUeXBlLlNlbGZMb29wLCBldmVudCwgbWV0YWRhdGEsIHRoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkwsIGRvY3VtZW50LnRpdGxlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0LlxyXG4gICAqIEBwYXJhbSBlbGVtZW50IC0gdGhlIGVsZW1lbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIGV2ZW50XHJcbiAgICogQHBhcmFtIG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJlZCB0aGUgY2FsbGJhY2sgKGFzIGRlZmluZWQgaW4gdGhlIGNvbmZpZylcclxuICAgKiBAcGFyYW0gZXZlbnQgLSB0aGUgSFRNTCBldmVudCB0aGF0IG9jY3VyZWRcclxuICAgKiBAcmV0dXJucyBBIGRvY3VtZW50IGludGVyYWN0aW9uIHNlbGYgbG9vcFxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlSW50ZXJhY3Rpb25SZWNvcmQoZWxlbWVudDogRWxlbWVudCwgbmFtZTogc3RyaW5nLCBldmVudDogRXZlbnQpOiBEQkRvY3VtZW50IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkRldGVjdGVkIGludGVyYWN0aW9uIGV2ZW50XCIpO1xyXG4gICAgICAgIGxldCBtZXRhZGF0YToge2h0bWw6IHN0cmluZywgZWxlbWVudE5hbWU6IHN0cmluZzsgaWQ/OiBzdHJpbmd9ID0ge1xyXG4gICAgICAgICAgICBodG1sOiBlbGVtZW50LmdldEhUTUwoKSxcclxuICAgICAgICAgICAgZWxlbWVudE5hbWU6IG5hbWUsXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCBleHRyYWN0ZWREYXRhID0gdGhpcy5leHRyYWN0b3JMaXN0LmV4dHJhY3QodGhpcy5jdXJyZW50UGFnZURhdGEuY3VycmVudFVSTCwgU2VuZGVyTWV0aG9kLkludGVyYWN0aW9uRGV0ZWN0aW9uKTtcclxuXHJcbiAgICAgICAgbWV0YWRhdGEgPSB7Li4uIG1ldGFkYXRhLCAuLi4gZXh0cmFjdGVkRGF0YSBhcyBvYmplY3R9O1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcInByaW50aW5nIG1ldGFkYXRhXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG1ldGFkYXRhKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgQWN0aXZpdHlEb2N1bWVudChBY3Rpdml0eVR5cGUuSW50ZXJhY3Rpb24sIGV2ZW50LCBtZXRhZGF0YSwgdGhpcy5jdXJyZW50UGFnZURhdGEuY3VycmVudFVSTCwgZG9jdW1lbnQudGl0bGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIFNlbmRzIGEgbWVzc2FnZSB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHQuXHJcbiAgICogQHBhcmFtIHNlbmRlciAtIHRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvbiB0aGF0J3Mgc2VuZGluZyB0aGUgbWVzc2FnZSB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHRcclxuICAgKiBAcGFyYW0gcGF5bG9hZCAtIHRoZSBkYXRhIGJlaW5nIHNlbnQgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0XHJcbiAgICogXHJcbiAgICogQHJldHVybnMgUmVzcG9uc2UgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBtZXNzYWdlIHN1Y2NlZWRlZFxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoc2VuZGVyTWV0aG9kOiBTZW5kZXJNZXRob2QsIHBheWxvYWQ6IERCRG9jdW1lbnQpOiBQcm9taXNlPE1lc3NhZ2VSZXNwb25zZSB8IG51bGw+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyBDaGVjayBpZiBydW50aW1lIGlzIGF2YWlsYWJsZSAoZXh0ZW5zaW9uIGNvbnRleHQgc3RpbGwgdmFsaWQpXHJcbiAgICAgICAgICAgIGlmICghY2hyb21lLnJ1bnRpbWU/LmlkKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4dGVuc2lvbiBjb250ZXh0IGludmFsaWRhdGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgOiBCYWNrZ3JvdW5kTWVzc2FnZSA9IG5ldyBCYWNrZ3JvdW5kTWVzc2FnZShzZW5kZXJNZXRob2QsIHBheWxvYWQpO1xyXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA6IE1lc3NhZ2VSZXNwb25zZSA9IGF3YWl0IGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hyb21lIHJldHVybnMgdW5kZWZpbmVkIGlmIG5vIGxpc3RlbmVycywgY2hlY2sgaWYgdGhhdCdzIGV4cGVjdGVkXHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdObyByZXNwb25zZSBmcm9tIGJhY2tncm91bmQgc2NyaXB0Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0JhY2tncm91bmQgbWVzc2FnZSBmYWlsZWQ6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICAvLyBEZWNpZGUgd2hldGhlciB0byB0aHJvdyBvciBoYW5kbGUgZ3JhY2VmdWxseSBiYXNlZCBvbiB5b3VyIG5lZWRzXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsOyAvLyBvciB0aHJvdyBlcnJvcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogQ2FsbGJhY2sgdGhhdCBjcmVhdGVzIGEgcGF5bG9hZCBkZXNjcmliaW5nIHRoZSBpbnRlcmFjdGlvbiB0aGF0IG9jY3VyZWQgYW5kIHNlbmRzIGl0IHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdFxyXG4gICAqIEBwYXJhbSBlIC0gdGhlIGV2ZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBjYWxsYmFja1xyXG4gICAqIEBwYXJhbSBuYW1lIC0gdGhlIG5hbWUgb2YgdGhlIGVsZW1lbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIGNhbGxiYWNrIChhcyBkZWZpbmVkIGluIHRoZSBjb25maWcpXHJcbiAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBvbkludGVyYWN0aW9uRGV0ZWN0aW9uKGVsZW1lbnQ6IEVsZW1lbnQsIGU6IEV2ZW50LCBuYW1lOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImludGVyYWN0aW9uIGV2ZW50IGRldGVjdGVkXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBFdmVudCBkZXRlY3RlZCB3aXRoIGV2ZW50IHR5cGU6ICR7ZS50eXBlfWApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBFdmVudCB0cmlnZ2VyZWQgYnlgLCBlbGVtZW50KTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhlbGVtZW50LmlubmVySFRNTCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudC5nZXRIVE1MKCkpO1xyXG4gICAgICAgIGNvbnN0IHJlY29yZCA9IHRoaXMuY3JlYXRlSW50ZXJhY3Rpb25SZWNvcmQoZWxlbWVudCwgbmFtZSwgZSk7XHJcbiAgICAgICAgdGhpcy5zZW5kTWVzc2FnZVRvQmFja2dyb3VuZChTZW5kZXJNZXRob2QuSW50ZXJhY3Rpb25EZXRlY3Rpb24sIHJlY29yZClcclxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gc2VuZCBpbnRlcmFjdGlvbiBkYXRhOicsIGVycm9yKTtcclxuICAgICAgICAgICAgLy8gTWF5YmUgcXVldWUgZm9yIHJldHJ5LCBvciBqdXN0IGxvZyBhbmQgY29udGludWVcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGlzTmV3QmFzZVVSTCh1cmw6IHN0cmluZyB8IG51bGwpe1xyXG4gICAgICAgIHJldHVybiB1cmwgJiYgdGhpcy5jdXJyZW50UGFnZURhdGEuY3VycmVudFVSTFxyXG4gICAgICAgICAgICA/IHVybC5zcGxpdChcIi5cIilbMV0gIT09IHRoaXMuY3VycmVudFBhZ2VEYXRhLmN1cnJlbnRVUkwuc3BsaXQoXCIuXCIpWzFdXHJcbiAgICAgICAgICAgIDogZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsYmFjayB0aGF0IGNyZWF0ZXMgYSBwYXlsb2FkIGRlc2NyaWJpbmcgdGhlIG5hdmlnYXRpb24gdGhhdCBvY2N1cmVkIGFuZCBzZW5kcyBpdCB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHRcclxuICAgICAqIEBwYXJhbSBlIC0gdGhlIGV2ZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBjYWxsYmFja1xyXG4gICAgICogQHBhcmFtIG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJlZCB0aGUgY2FsbGJhY2sgKGFzIGRlZmluZWQgaW4gdGhlIGNvbmZpZylcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBvbk5hdmlnYXRpb25EZXRlY3Rpb24obmF2RXZlbnQ6IE5hdmlnYXRpb25FdmVudCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGRlc3RVcmwgPSBuYXZFdmVudC5kZXN0aW5hdGlvbi51cmw7XHJcbiAgICAgICAgY29uc3QgYmFzZVVSTENoYW5nZSA9IHRoaXMuaXNOZXdCYXNlVVJMKGRlc3RVcmwpO1xyXG4gICAgICAgIC8vIGNvbnN0IHVybENoYW5nZSA9ICEobmF2RXZlbnQuZGVzdGluYXRpb24udXJsID09PSB0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmwpO1xyXG4gICAgICAgIC8vIGxldCBzb3VyY2VTdGF0ZSA9IHRoaXMuZ2V0Q2xlYW5TdGF0ZU5hbWUoKTtcclxuICAgICAgICAvLyBsZXQgbWF0Y2ggPSB0aGlzLmN1cnJlbnRQYWdlRGF0YS5jaGVja0Zvck1hdGNoKG5hdkV2ZW50LmRlc3RpbmF0aW9uLnVybCk7XHJcbiAgICAgICAgaWYgKGRlc3RVcmwpe1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlRGF0YS5jdXJyZW50VVJMID0gbmF2RXZlbnQuZGVzdGluYXRpb24udXJsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJObyBkZXN0aW5hdGlvbiBVUkwgZm91bmQgaW4gbmF2aWdhdGUgZXZlbnQuIFNldHRpbmcgdG8gZW1wdHkgc3RyaW5nXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlRGF0YS5jdXJyZW50VVJMID0gXCJOTyBVUkwgRk9VTkRcIjtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGxldCBkZXN0U3RhdGUgPSB0aGlzLmdldENsZWFuU3RhdGVOYW1lKCk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGBOYXZpZ2F0aW9uIGRldGVjdGVkIHdpdGggZXZlbnQgdHlwZTogJHtuYXZFdmVudC50eXBlfWApXHJcbiAgICAgICAgaWYgKGJhc2VVUkxDaGFuZ2Upe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVSTCBiYXNlIGNoYW5nZSBkZXRlY3RlZC4gQ2xvc2luZyBwcm9ncmFtLlwiKTtcclxuICAgICAgICAgICAgdGhpcy5zZW5kTWVzc2FnZVRvQmFja2dyb3VuZChTZW5kZXJNZXRob2QuQ2xvc2VTZXNzaW9uLCBuZXcgREJEb2N1bWVudCh0aGlzLmN1cnJlbnRQYWdlRGF0YS5jdXJyZW50VVJMLCBkb2N1bWVudC50aXRsZSkpLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHNlbmQgaW50ZXJhY3Rpb24gZGF0YTonLCBlcnJvcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChuYXZFdmVudC5uYXZpZ2F0aW9uVHlwZSA9PT0gXCJwdXNoXCIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQdXNoIGV2ZW50IGRldGVjdGVkLlwiKTtcclxuICAgICAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5jcmVhdGVTdGF0ZUNoYW5nZVJlY29yZChuYXZFdmVudCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoU2VuZGVyTWV0aG9kLk5hdmlnYXRpb25EZXRlY3Rpb24sIHJlY29yZCkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gc2VuZCBpbnRlcmFjdGlvbiBkYXRhOicsIGVycm9yKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLnVwZGF0ZShkb2N1bWVudC5sb2NhdGlvbi5ocmVmKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG5hdkV2ZW50Lm5hdmlnYXRpb25UeXBlID09PSBcInJlcGxhY2VcIikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlcGxhY2UgZXZlbnQgZGV0ZWN0ZWQuXCIpO1xyXG4gICAgICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmNyZWF0ZVNlbGZMb29wUmVjb3JkKG5hdkV2ZW50KTtcclxuICAgICAgICAgICAgdGhpcy5zZW5kTWVzc2FnZVRvQmFja2dyb3VuZChTZW5kZXJNZXRob2QuTmF2aWdhdGlvbkRldGVjdGlvbiwgcmVjb3JkKS5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBzZW5kIGludGVyYWN0aW9uIGRhdGE6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAqIEdlbmVyYXRlcyBhIHVuaXF1ZSBjb2xvciBmcm9tIGEgZ2l2ZW4gc3RyaW5nXHJcbiAgICogU291cmNlOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzEwMzczODMgXHJcbiAgICogQHJldHVybnMgQ29sb3IgaGV4IGNvZGVcclxuICAgKi9cclxuXHJcbiAgICBwcml2YXRlIFN0cmluZ1RvQ29sb3IgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGludGVyZmFjZSBDb2xvckluc3RhbmNlIHtcclxuICAgICAgICAgICAgc3RyaW5nVG9Db2xvckhhc2g6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XHJcbiAgICAgICAgICAgIG5leHRWZXJ5RGlmZmVybnRDb2xvcklkeDogbnVtYmVyO1xyXG4gICAgICAgICAgICB2ZXJ5RGlmZmVyZW50Q29sb3JzOiBzdHJpbmdbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpbnN0YW5jZTogQ29sb3JJbnN0YW5jZSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBuZXh0OiBmdW5jdGlvbiBzdHJpbmdUb0NvbG9yKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlID8/PSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nVG9Db2xvckhhc2g6IHt9LFxyXG4gICAgICAgICAgICAgICAgICAgIG5leHRWZXJ5RGlmZmVybnRDb2xvcklkeDogMCxcclxuICAgICAgICAgICAgICAgICAgICB2ZXJ5RGlmZmVyZW50Q29sb3JzOiBbXCIjMDBGRjAwXCIsIFwiIzAwMDBGRlwiLCBcIiNGRjAwMDBcIiwgXCIjMDFGRkZFXCIsIFwiI0ZGQTZGRVwiLCBcIiNGRkRCNjZcIiwgXCIjMDA2NDAxXCIsIFwiIzAxMDA2N1wiLCBcIiM5NTAwM0FcIiwgXCIjMDA3REI1XCIsIFwiI0ZGMDBGNlwiLCBcIiNGRkVFRThcIiwgXCIjNzc0RDAwXCIsIFwiIzkwRkI5MlwiLCBcIiMwMDc2RkZcIiwgXCIjRDVGRjAwXCIsIFwiI0ZGOTM3RVwiLCBcIiM2QTgyNkNcIiwgXCIjRkYwMjlEXCIsIFwiI0ZFODkwMFwiLCBcIiM3QTQ3ODJcIiwgXCIjN0UyREQyXCIsIFwiIzg1QTkwMFwiLCBcIiNGRjAwNTZcIiwgXCIjQTQyNDAwXCIsIFwiIzAwQUU3RVwiLCBcIiM2ODNEM0JcIiwgXCIjQkRDNkZGXCIsIFwiIzI2MzQwMFwiLCBcIiNCREQzOTNcIiwgXCIjMDBCOTE3XCIsIFwiIzlFMDA4RVwiLCBcIiMwMDE1NDRcIiwgXCIjQzI4QzlGXCIsIFwiI0ZGNzRBM1wiLCBcIiMwMUQwRkZcIiwgXCIjMDA0NzU0XCIsIFwiI0U1NkZGRVwiLCBcIiM3ODgyMzFcIiwgXCIjMEU0Q0ExXCIsIFwiIzkxRDBDQlwiLCBcIiNCRTk5NzBcIiwgXCIjOTY4QUU4XCIsIFwiI0JCODgwMFwiLCBcIiM0MzAwMkNcIiwgXCIjREVGRjc0XCIsIFwiIzAwRkZDNlwiLCBcIiNGRkU1MDJcIiwgXCIjNjIwRTAwXCIsIFwiIzAwOEY5Q1wiLCBcIiM5OEZGNTJcIiwgXCIjNzU0NEIxXCIsIFwiI0I1MDBGRlwiLCBcIiMwMEZGNzhcIiwgXCIjRkY2RTQxXCIsIFwiIzAwNUYzOVwiLCBcIiM2QjY4ODJcIiwgXCIjNUZBRDRFXCIsIFwiI0E3NTc0MFwiLCBcIiNBNUZGRDJcIiwgXCIjRkZCMTY3XCIsIFwiIzAwOUJGRlwiLCBcIiNFODVFQkVcIl1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFpbnN0YW5jZS5zdHJpbmdUb0NvbG9ySGFzaFtzdHJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2Uuc3RyaW5nVG9Db2xvckhhc2hbc3RyXSA9IGluc3RhbmNlLnZlcnlEaWZmZXJlbnRDb2xvcnNbaW5zdGFuY2UubmV4dFZlcnlEaWZmZXJudENvbG9ySWR4KytdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAlYyBUaGUgY29sb3VyIGZvciAke3N0cn1gLCBgY29sb3I6ICR7aW5zdGFuY2Uuc3RyaW5nVG9Db2xvckhhc2hbc3RyXX1gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZS5zdHJpbmdUb0NvbG9ySGFzaFtzdHJdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pKCk7XHJcbn1cclxuIiwiaW1wb3J0IHtVUkxQYXR0ZXJuVG9TZWxlY3RvcnMsIFNlbGVjdG9yTmFtZVBhaXIsIENvbmZpZ30gZnJvbSBcIi4vY29uZmlnXCI7XHJcbi8qKlxyXG4gKiBBIGNsYXNzIHJlc3BvbnNpYmxlIGZvciB0cmFja2luZyB0aGUgc3RhdGUgb2YgdGhlIHBhZ2UgdGhhdCB0aGUgdXNlciBpcyBjdXJyZW50bHkgb24uXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUGFnZURhdGEge1xyXG4gICAgLy8gQ3VycmVudCBVUkwgb2YgdGhlIHBhZ2VcclxuICAgIGN1cnJlbnRVUkwhOiBzdHJpbmc7XHJcbiAgICAvLyBDU1Mgc2VsZWN0b3JzIGJlaW5nIGFwcGxpZWQgdG8gdGhlIHBhZ2VcclxuICAgIHNlbGVjdG9yTmFtZVBhaXJzITogU2VsZWN0b3JOYW1lUGFpcltdO1xyXG4gICAgYmFzZVVSTDogc3RyaW5nO1xyXG4gICAgdXJsUGF0dGVyblRvU2VsZWN0b3JEYXRhOiBVUkxQYXR0ZXJuVG9TZWxlY3RvcnM7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29uZmlnOiBDb25maWcpe1xyXG4gICAgICAgIHRoaXMudXJsUGF0dGVyblRvU2VsZWN0b3JEYXRhID0gY29uZmlnLnBhdGhzO1xyXG4gICAgICAgIHRoaXMuYmFzZVVSTCA9IGNvbmZpZy5iYXNlVVJMO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGRhdGVzIHRoZSBVUkwgYW5kIHRoZSBsaXN0IG9mIENTUyBzZWxlY3RvcnMgZm9yIHRoZSBVUkxcclxuICAgICAqIEBwYXJhbSBuZXdVUkw6IFRoZSBmdWxsIHVybCBvZiB0aGUgY3VycmVudCBwYWdlXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZShuZXdVUkw6IHN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VVJMID0gbmV3VVJMO1xyXG4gICAgICAgIGNvbnN0IG1hdGNoaW5nVVJMUGF0dGVybnM6IHN0cmluZ1tdID0gdGhpcy5nZXRNYXRjaGluZ1BhdHRlcm5zKCk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3Rvck5hbWVQYWlycyA9IHRoaXMuZ2V0U2VsZWN0b3JOYW1lUGFpcnMobWF0Y2hpbmdVUkxQYXR0ZXJucyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNldHMgYG1hdGNoUGF0aERhdGFgIHRvIGJlIHRoZSBQYXRoRGF0YSBmb3IgdGhlIFVSTCBwYXR0ZXJuIHdpdGggdGhlIGNsb3NldCBtYXRjaCB0byBgdGhpcy5iYXNlVVJMYFxyXG4gICAgICogYW5kIHJldHVybnMgYSBsaXN0IG9mIGFsbCBtYXRjaGVzLiBBZGRpdGlvbmFsbHksIGl0IHVwZGF0ZXMgd2hldGhlciB0aGUgY3VycmVudCBwYXRoXHJcbiAgICAgKiBpbmNsdWRlcyBhbiBpZC5cclxuICAgICAqIFxyXG4gICAgICogQHJldHVybnMgQSBsaXN0IG9mIGFsbCBwYXR0ZXJucyBpbiB0aGUgY29uZmlnIHRoYXQgbWF0Y2ggYGJhc2VVUkxgXHJcbiAgICAgKi9cclxuXHJcbiAgICBwcml2YXRlIGdldE1hdGNoaW5nUGF0dGVybnMoKTogc3RyaW5nW117XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ1cGRhdGluZyBwYWdlIGRhdGFcIik7XHJcblxyXG4gICAgICAgIC8vIEdldCBhIGxpc3Qgb2YgYWxsIHRoZSBwYXRocyB0aGF0IG1hdGNoIHRoZSBjdXJyZW50IFVSTFxyXG4gICAgICAgIGNvbnN0IG1hdGNoaW5nVVJMUGF0dGVybnM6IHN0cmluZ1tdID0gT2JqZWN0LmtleXModGhpcy51cmxQYXR0ZXJuVG9TZWxlY3RvckRhdGEpLmZpbHRlcigocGF0aCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhwYXRoKTtcclxuICAgICAgICAgICAgY29uc3QgcGF0dGVybjogVVJMUGF0dGVybiA9IG5ldyBVUkxQYXR0ZXJuKHBhdGgsIHRoaXMuYmFzZVVSTCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoOiBib29sZWFuID0gcGF0dGVybi50ZXN0KHRoaXMuY3VycmVudFVSTCk7XHJcbiAgICAgICAgICAgIHJldHVybiBtYXRjaDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKG1hdGNoaW5nVVJMUGF0dGVybnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm8gbWF0Y2hlcyBmb3VuZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBtYXRjaGluZ1VSTFBhdHRlcm5zO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIG1hdGNoaW5nVVJMUGF0dGVybnM6IEEgbGlzdCBvZiBhbGwgbWF0Y2hpbmcgcGF0aHMgdG8gdGhlIGN1cnJlbnQgdXJsXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm5zIEEgbGlzdCBvZiBhbGwgc2VsZWN0b3JzIGZvciB0aGUgbWF0Y2hpbmcgcGF0aHNcclxuICAgICAqL1xyXG5cclxuICAgIHByaXZhdGUgZ2V0U2VsZWN0b3JOYW1lUGFpcnMobWF0Y2hpbmdVUkxQYXR0ZXJuczogc3RyaW5nW10pOiBTZWxlY3Rvck5hbWVQYWlyW10ge1xyXG4gICAgICAgIGxldCBjdXJyZW50U2VsZWN0b3JOYW1lUGFpcnM6IFNlbGVjdG9yTmFtZVBhaXJbXSA9IFtdO1xyXG4gICAgICAgIGZvciAoY29uc3QgdXJsUGF0dGVybiBvZiBtYXRjaGluZ1VSTFBhdHRlcm5zKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdG9yTmFtZVBhaXJzOiBTZWxlY3Rvck5hbWVQYWlyW10gPSB0aGlzLnVybFBhdHRlcm5Ub1NlbGVjdG9yRGF0YVt1cmxQYXR0ZXJuXTtcclxuICAgICAgICAgICAgY3VycmVudFNlbGVjdG9yTmFtZVBhaXJzID0gY3VycmVudFNlbGVjdG9yTmFtZVBhaXJzLmNvbmNhdChzZWxlY3Rvck5hbWVQYWlycylcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRTZWxlY3Rvck5hbWVQYWlycztcclxuICAgIH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvY29udGVudC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==