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

/***/ "./src/content/configs/youtube_config.json":
/*!*************************************************!*\
  !*** ./src/content/configs/youtube_config.json ***!
  \*************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"baseURL":"https://www.youtube.com","events":["click"],"paths":{"/*":{"selectors":[{"selector":"#logo-icon","name":"YouTube Logo"},{"selector":"ytm-shorts-lockup-view-model-v2","name":"Shorts on Miniplayer"},{"selector":"div#chip-shape-container, yt-tab-shape[tab-title]","name":"Category Button"},{"selector":"div#left-arrow-button","name":"Category back button"},{"selector":"div#right-arrow-button","name":"Category forward button"},{"selector":"a.yt-simple-endpoint.style-scope.ytd-guide-entry-renderer#endpoint, a.yt-simple-endpoint.style-scope.ytd-mini-guide-entry-renderer#endpoint","name":"Side Navigation Button"},{"selector":"yt-icon-button#guide-button","name":"Guide Button"},{"selector":"ytd-video-renderer, ytd-rich-item-renderer","name":"Video"},{"selector":"yt-lockup-view-model","name":"Content Collection"}]},"/":{},"/feed/*":{"selectors":[{"selector":"ytd-video-renderer[is-history]","name":"History Video"},{"selector":"ytd-grid-movie-renderer","name":"Movie Thumbnail"}]},"/channel/*":{"selectors":[{"selector":"ytd-default-promo-panel-renderer","name":"Promo Video"}]},"/@:id{/*}?":{"selectors":[{"selector":"yt-tab-shape[tab-title=\\"Home\\"]","name":"Creator Home"},{"selector":"yt-tab-shape[tab-title=\\"Videos\\"]","name":"Creator Videos"},{"selector":"yt-tab-shape[tab-title=\\"Playlists\\"]","name":"Creator Playlists"},{"selector":"yt-tab-shape[tab-title=\\"Shorts\\"]","name":"Creator Shorts"},{"selector":"yt-tab-shape[tab-title=\\"Live\\"]","name":"Creator Live"},{"selector":"yt-tab-shape[tab-title=\\"Posts\\"]","name":"Creator Posts"},{"selector":"div.yt-subscribe-button-view-model-wiz__container","name":"Creator Subscribe Button"},{"selector":"ytd-video-renderer.style-scope.ytd-channel-featured-content-renderer","name":"Creator Featured Video"},{"selector":"ytd-grid-video-renderer.style-scope.yt-horizontal-list-renderer","name":"Creator Video"}]},"/playlist?list=*":{"selectors":[{"selector":"div#content.style-scope.ytd-playlist-video-renderer","name":"Video Inside Playlist"}]},"/shorts/:id":{"selectors":[{"selector":"#like-button[is-shorts]","name":"Shorts Like Button"},{"selector":"#dislike-button[is-shorts]","name":"Shorts Dislike Button"},{"selector":"div#comments-button","name":"Comments Button"},{"selector":"ytd-player#player","name":"Shorts Video Player"}]},"/watch?v=*":{"selectors":[{"selector":"ytd-compact-video-renderer.style-scope.ytd-item-section-renderer","name":"Watch Page Recommended Video"},{"selector":"ytd-toggle-button-renderer#dislike-button","name":"Comment Dislike Button"},{"selector":"ytd-toggle-button-renderer#like-button","name":"Comment Like Button"},{"selector":"ytd-video-owner-renderer.style-scope.ytd-watch-metadata","name":"Channel Link"},{"selector":"like-button-view-model.ytLikeButtonViewModelHost","name":"Video Like Button"},{"selector":"dislike-button-view-model.ytDislikeButtonViewModelHost","name":"Video Dislike Button"},{"selector":"div#subscribe-button","name":"Subscribe Button"},{"selector":"div#player","name":"Video Player"},{"selector":"button[title=\'Share\']","name":"Share Button"}]},"/results?search_query=*":{"selectors":[{"selector":"ytd-video-renderer.style-scope.ytd-vertical-list-renderer","name":"Top Search Page Video"},{"selector":"ytd-video-renderer.style-scope.ytd-item-section-renderer","name":"Search Page Video"},{"selector":"yt-lockup-view-model.ytd-item-section-renderer","name":"Playlist"}]}}}');

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
        this.interactionEvents = (_a = config.events) !== null && _a !== void 0 ? _a : ['click'];
        this.highlight = true;
        this.paths = config.paths;
        this.baseURL = config.baseURL;
        this.currentPageData = new pagedata_1.PageData();
        this.interactionAttribute = "monitoring-interactions";
        this.extractorList = configLoader.extractorList;
        if (window.location.origin === this.baseURL) {
            const runWhenVisible = () => {
                if (document.visibilityState === 'visible') {
                    // Wrap the async call and handle errors
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
            if ((response === null || response === void 0 ? void 0 : response.status) === "Session initialized" && response.highlight) {
                this.highlight = response.highlight; // TypeScript knows highlight exists here
            }
            console.log(`Highlight is set to ${this.highlight}`);
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
        this.currentPageData.selectors.forEach(interaction => {
            const elements = document.querySelectorAll(`:is(${interaction.selector}):not([${this.interactionAttribute}])`);
            const name = interaction.name;
            for (const element of elements) {
                if (this.highlight)
                    element.style.border = `2px solid ${this.StringToColor.next(name)}`;
                element.setAttribute(this.interactionAttribute, 'true');
                for (const ie of this.interactionEvents) {
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
    createSelfLoopRecord(event) {
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
        const extractedData = this.extractorList.extract(this.currentPageData.url, sender_1.SenderMethod.InteractionDetection);
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
    /**
     * Callback that creates a payload describing the navigation that occured and sends it to the background script
     * @param e - the event that triggered the callback
     * @param name - the name of the element that triggered the callback (as defined in the config)
     */
    onNavigationDetection(navEvent) {
        const destUrl = navEvent.destination.url;
        const baseURLChange = destUrl && this.currentPageData.url
            ? destUrl.split(".")[1] !== this.currentPageData.url.split(".")[1]
            : false;
        // const urlChange = !(navEvent.destination.url === this.currentPageData.url);
        // let sourceState = this.getCleanStateName();
        // let match = this.currentPageData.checkForMatch(navEvent.destination.url);
        if (destUrl) {
            this.currentPageData.url = navEvent.destination.url;
        }
        else {
            console.log("No destination URL found in navigate event. Setting to empty string");
            this.currentPageData.url = "NO URL FOUND";
        }
        // let destState = this.getCleanStateName();
        console.log(`Navigation detected with event type: ${navEvent.type}`);
        if (baseURLChange) {
            console.log("URL base change detected. Closing program.");
            this.sendMessageToBackground(sender_1.SenderMethod.CloseSession, new dbdocument_1.DBDocument(this.currentPageData.url, document.title)).catch(error => {
                console.error('Failed to send interaction data:', error);
            });
        }
        else if (navEvent.navigationType === "push") {
            console.log("Push event detected.");
            const record = this.createStateChangeRecord(navEvent);
            this.sendMessageToBackground(sender_1.SenderMethod.NavigationDetection, record).catch(error => {
                console.error('Failed to send interaction data:', error);
            });
            this.updateCurrentPageData(this.currentPageData.url);
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
    /**
     * Updates the state of the PageData
     * @param baseURL: The base url for the page (eg. www.youtube.com)
     * @param url: The full url of the current page
     * @param paths: A list of all the paths defined in a config
     */
    update(baseURL, url, paths) {
        this.url = url;
        const matches = this.updateMatchData(baseURL, paths);
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
        const currentSelectors = [];
        for (const path of matches) {
            const pathData = paths[path];
            if (pathData.selectors) {
                for (const selector of pathData.selectors) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RW5DLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUVELGlEQUFpRDtRQUNqRCxJQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM1QyxPQUFPLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFFSyxZQUFZLENBQUMsT0FBaUIsRUFBRSxLQUF5QjtRQUM3RCxNQUFNLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztRQUM1QixLQUFLLE1BQU0sSUFBSSxJQUFJLE9BQU8sRUFBRSxDQUFDO1lBQ3pCLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QixJQUFJLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDckIsS0FBSyxNQUFNLFFBQVEsSUFBSSxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQ3hDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDcEMsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQ0QsT0FBTyxnQkFBZ0IsQ0FBQztJQUM1QixDQUFDO0NBQ0o7QUE5RUQsNEJBOEVDOzs7Ozs7O1VDbEZEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbW1vbi9jb21tdW5pY2F0aW9uL2FjdGl2aXR5LnRzIiwid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvY29tbW9uL2NvbW11bmljYXRpb24vYmFja2dyb3VuZG1lc3NhZ2UudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb21tb24vY29tbXVuaWNhdGlvbi9zZW5kZXIudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb21tb24vZGJkb2N1bWVudC50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbnRlbnQudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb250ZW50L2NvbmZpZy50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbnRlbnQvbW9uaXRvci50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbnRlbnQvcGFnZWRhdGEudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBEZWZpbmVzIGEgbGlzdCBvZiB0aGUgcG9zc2libGUgYWN0aXZpdHkgdHlwZXMgdGhhdCBjYW4gYmUgcmVjb3JkZWQgYnkgdGhlIE1vbml0b3IgY2xhc3NcbiAqL1xuZW51bSBBY3Rpdml0eVR5cGUge1xuICAgIFNlbGZMb29wID0gXCJTZWxmLUxvb3BcIixcbiAgICBTdGF0ZUNoYW5nZSA9IFwiU3RhdGUgQ2hhbmdlXCIsXG4gICAgSW50ZXJhY3Rpb24gPSBcIkludGVyYWN0aW9uXCIsXG4gICAgQm90aCA9IFwiQm90aFwiXG59XG5cbmV4cG9ydCB7QWN0aXZpdHlUeXBlfSIsImltcG9ydCB7REJEb2N1bWVudCB9IGZyb20gXCIuLi9kYmRvY3VtZW50XCI7XG5pbXBvcnQgeyBTZW5kZXJNZXRob2QgfSBmcm9tIFwiLi9zZW5kZXJcIjtcbmV4cG9ydCB7QmFja2dyb3VuZE1lc3NhZ2UsIE1lc3NhZ2VSZXNwb25zZX07XG4vKipcbiAqIEEgY2xhc3MgdXNlZCB0byBzZW5kIG1lc3NhZ2VzIGZyb20gdGhlIGNvbnRlbnQgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0IGluIGEgY29uc2lzdGVudCBmb3JtYXQuXG4gKi9cbmNsYXNzIEJhY2tncm91bmRNZXNzYWdlIHtcbiAgICBzZW5kZXJNZXRob2Q6IFNlbmRlck1ldGhvZDtcbiAgICBwYXlsb2FkOiBEQkRvY3VtZW50O1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBzZW5kZXJNZXRob2QgLSBlbnVtIHR5cGUgb2YgdGhlIG1ldGhvZCBzZW5kaW5nIHRoZSBtZXNzYWdlXG4gICAgICogQHBhcmFtIHBheWxvYWQgLSB0aGUgZGF0YSBiZWluZyBzZW50IHRvIHRoZSBkYXRhYmFzZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yIChzZW5kZXJNZXRob2Q6IFNlbmRlck1ldGhvZCwgcGF5bG9hZDogREJEb2N1bWVudCkge1xuICAgICAgICB0aGlzLnNlbmRlck1ldGhvZCA9IHNlbmRlck1ldGhvZDtcbiAgICAgICAgdGhpcy5wYXlsb2FkID0gcGF5bG9hZDtcbiAgICB9XG59XG5cbmludGVyZmFjZSBNZXNzYWdlUmVzcG9uc2Uge1xuICBzdGF0dXM6IHN0cmluZztcbiAgaGlnaGxpZ2h0PzogYm9vbGVhbjtcbn0iLCJlbnVtIFNlbmRlck1ldGhvZHtcbiAgICBJbml0aWFsaXplU2Vzc2lvbiA9IFwiSW5pdGlhbGl6ZSBTZXNzaW9uXCIsXG4gICAgSW50ZXJhY3Rpb25EZXRlY3Rpb24gPSBcIkludGVyYWN0aW9uIERldGVjdGlvblwiLFxuICAgIE5hdmlnYXRpb25EZXRlY3Rpb24gPSBcIk5hdmlnYXRpb24gRGV0ZWN0aW9uXCIsXG4gICAgQ2xvc2VTZXNzaW9uID0gXCJDbG9zZSBTZXNzaW9uXCIsXG4gICAgQW55ID0gXCJBbnlcIlxufVxuZXhwb3J0IHtTZW5kZXJNZXRob2R9OyIsImltcG9ydCB7IEFjdGl2aXR5VHlwZSB9IGZyb20gXCIuL2NvbW11bmljYXRpb24vYWN0aXZpdHlcIjtcclxuLyoqXHJcbiAqIEEgY2xhc3MgZGVmaW5pbmcgZG9jdW1lbnRzIHRoYXQgYXJlIHNlbnQgdG8gdGhlIGRhdGFiYXNlIGZyb20gdGhlIGNvbnRlbnQgc2NyaXB0XHJcbiAqL1xyXG5jbGFzcyBEQkRvY3VtZW50IHtcclxuICAgIC8vIFVSTCBhdCB3aGljaHQgdGhlIGV2ZW50IHdhcyBjcmVhdGVkXHJcbiAgICBzb3VyY2VVUkw6IHN0cmluZztcclxuICAgIHNvdXJjZURvY3VtZW50VGl0bGU6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgdGl0bGU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc291cmNlVVJMID0gdXJsO1xyXG4gICAgICAgIHRoaXMuc291cmNlRG9jdW1lbnRUaXRsZSA9IHRpdGxlO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQSBjaGlsZCBvZiBEQkRvY3VtZW50IHRoYXQgcmVwcmVzZW50cyBhY3Rpdml0aWVzXHJcbiAqL1xyXG5cclxuY2xhc3MgQWN0aXZpdHlEb2N1bWVudCBleHRlbmRzIERCRG9jdW1lbnR7XHJcbiAgICAvLyBUaGUgdHlwZSBvZiBhY3Rpdml0eSBiZWluZyBsb2dnZWQuIEVpdGhlciBcInN0YXRlX2NoYWdlXCIsIFwic2VsZl9sb29wXCIsIG9yIFwiaW50ZXJhY3Rpb25cIlxyXG4gICAgYWN0aXZpdHlUeXBlOiBBY3Rpdml0eVR5cGUgfCBzdHJpbmc7XHJcbiAgICAvLyBUaW1lc3RhbXAgZm9yIHdoZW4gdGhlIGRvY3VtZW50IHdhcyBjcmVhdGVkXHJcbiAgICBjcmVhdGVkQXQ6IERhdGUgfCBzdHJpbmc7XHJcbiAgICAvLyBFdmVudCB0eXBlIChlZy4gY2xpY2ssIHNjcm9sbCwgZXRjLi4uKVxyXG4gICAgZXZlbnRUeXBlOiBzdHJpbmdcclxuICAgIC8vIE1ldGFkYXRhIGFib3V0IHRoZSBldmVudFxyXG4gICAgbWV0YWRhdGE/OiBvYmplY3Q7XHJcbiAgICBjb25zdHJ1Y3Rvcih0eXBlOiBBY3Rpdml0eVR5cGUsIGV2ZW50OiBFdmVudCwgbWV0YWRhdGE6IG9iamVjdCwgdXJsOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcih1cmwsIHRpdGxlKTtcclxuICAgICAgICB0aGlzLmFjdGl2aXR5VHlwZSA9IHR5cGU7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVkQXQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRUeXBlID0gZXZlbnQudHlwZVxyXG4gICAgICAgIHRoaXMubWV0YWRhdGEgPSBtZXRhZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgY2hpbGQgb2YgREJEb2N1bWVudCB0aGF0IHJlcHJlc2VudHMgdGhlIHN0YXJ0IG9mIGEgc2Vzc2lvblxyXG4gKi9cclxuXHJcbmNsYXNzIFNlc3Npb25Eb2N1bWVudCBleHRlbmRzIERCRG9jdW1lbnR7XHJcbiAgICBzdGFydFRpbWU6IERhdGU7XHJcbiAgICBlbmRUaW1lPzogRGF0ZTtcclxuICAgIGVtYWlsID0gXCJFbWFpbCBub3Qgc2V0XCI7XHJcbiAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgdGl0bGU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKHVybCwgdGl0bGUpO1xyXG4gICAgICAgIHRoaXMuc3RhcnRUaW1lID0gbmV3IERhdGUoKTtcclxuICAgIH1cclxuICAgIHNldEVtYWlsKGVtYWlsOiBzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuZW1haWwgPSBlbWFpbDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtEQkRvY3VtZW50LCBBY3Rpdml0eURvY3VtZW50LCBTZXNzaW9uRG9jdW1lbnR9OyIsImltcG9ydCB7IE1vbml0b3IgfSBmcm9tIFwiLi9jb250ZW50L21vbml0b3JcIjtcbmltcG9ydCB5dENvbmZpZyBmcm9tICcuL2NvbnRlbnQvY29uZmlncy95b3V0dWJlX2NvbmZpZy5qc29uJztcbi8vIGltcG9ydCB0aWt0b2tDb25maWcgZnJvbSAnLi9jb25maWdzL3Rpa3Rva19jb25maWcuanNvbic7XG4vLyBpbXBvcnQgbGlua2VkaW5Db25maWcgZnJvbSAnLi9jb25maWdzL2xpbmtlZGluX2NvbmZpZy5qc29uJztcbmltcG9ydCB7IENvbmZpZ0xvYWRlciwgRXh0cmFjdG9yRGF0YSB9IGZyb20gXCIuL2NvbnRlbnQvY29uZmlnXCI7XG4vLyBpbXBvcnQgeyBBY3Rpdml0eVR5cGUgfSBmcm9tIFwiLi9jb21tdW5pY2F0aW9uL2FjdGl2aXR5XCI7XG5pbXBvcnQgeyBTZW5kZXJNZXRob2QgfSBmcm9tIFwiLi9jb21tb24vY29tbXVuaWNhdGlvbi9zZW5kZXJcIjtcblxuXG5jb25zdCBnZXRIb21lcGFnZVZpZGVvcyA9ICgpOiBvYmplY3QgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKFwiLS0tLSBFWFRSQUNUSU5HIEhPTUVQQUdFIExJTktTIC0tLVwiKTtcbiAgICBjb25zdCBjb250ZW50RGl2cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI2NvbnRlbnQueXRkLXJpY2gtaXRlbS1yZW5kZXJlcicpKVxuICAgICAgICAuZmlsdGVyKGRpdiA9PiB7XG4gICAgICAgICAgICAvLyBDaGVjayBpZiBlbGVtZW50IGlzIGFjdHVhbGx5IHZpc2libGVcbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBkaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICByZXR1cm4gcmVjdC53aWR0aCA+IDAgJiYgcmVjdC5oZWlnaHQgPiAwICYmIFxuICAgICAgICAgICAgICAgIGdldENvbXB1dGVkU3R5bGUoZGl2KS52aXNpYmlsaXR5ICE9PSAnaGlkZGVuJztcbiAgICAgICAgfSk7XG4gICAgXG4gICAgY29uc3QgdmlkZW9zID0gY29udGVudERpdnMubWFwKGNvbnRlbnREaXYgPT4ge1xuICAgICAgICAvLyBHZXQgdGhlIGRpcmVjdCBhbmNob3IgY2hpbGRcbiAgICAgICAgY29uc3QgYW5jaG9yID0gY29udGVudERpdi5xdWVyeVNlbGVjdG9yKCc6c2NvcGUgPiB5dC1sb2NrdXAtdmlldy1tb2RlbCBhJykgYXMgSFRNTEFuY2hvckVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IHNwYW4gPSBjb250ZW50RGl2LnF1ZXJ5U2VsZWN0b3IoJ2gzIGEgc3Bhbi55dC1jb3JlLWF0dHJpYnV0ZWQtc3RyaW5nJyk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGluazogYW5jaG9yPy5ocmVmID8/ICcnLFxuICAgICAgICAgICAgdGl0bGU6IHNwYW4/LnRleHRDb250ZW50Py50cmltKCkgPz8gJydcbiAgICAgICAgfTtcbiAgICB9KS5maWx0ZXIodmlkZW8gPT4gdmlkZW8ubGluayAhPT0gJycpO1xuICAgIFxuICAgIHJldHVybiB7XCJ2aWRlb3NcIjogdmlkZW9zfTtcbn07XG5cbmNvbnN0IGdldFJlY29tbWVuZGVkVmlkZW9zID0gKCk6IG9iamVjdCA9PiB7XG4gICAgY29uc29sZS5sb2coXCItLS0tIEVYVFJBQ1RJTkcgUkVDT01NRU5ERUQgTElOS1MgLS0tXCIpO1xuICAgIGNvbnN0IGNvbnRlbnREaXZzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCd5dC1sb2NrdXAtdmlldy1tb2RlbCcpKS5maWx0ZXIoZGl2ID0+IHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgZWxlbWVudCBpcyBhY3R1YWxseSB2aXNpYmxlXG4gICAgICAgIGNvbnN0IHJlY3QgPSBkaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHJldHVybiByZWN0LndpZHRoID4gMCAmJiByZWN0LmhlaWdodCA+IDAgJiYgXG4gICAgICAgICAgICBnZXRDb21wdXRlZFN0eWxlKGRpdikudmlzaWJpbGl0eSAhPT0gJ2hpZGRlbic7XG4gICAgfSk7XG4gICAgXG4gICAgY29uc3QgdmlkZW9zOiBvYmplY3QgPSBjb250ZW50RGl2cy5tYXAoY29udGVudERpdiA9PiB7XG4gICAgICAgIC8vIEdldCB0aGUgYW5jaG9yIHdpdGggdGhlIHZpZGVvIGxpbmtcbiAgICAgICAgY29uc3QgYW5jaG9yID0gY29udGVudERpdi5xdWVyeVNlbGVjdG9yKCdhW2hyZWZePVwiL3dhdGNoXCJdJykhIGFzIEhUTUxBbmNob3JFbGVtZW50O1xuICAgICAgICBjb25zdCBzcGFuID0gY29udGVudERpdi5xdWVyeVNlbGVjdG9yKCdoMyBhIHNwYW4ueXQtY29yZS1hdHRyaWJ1dGVkLXN0cmluZycpITtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsaW5rOiBhbmNob3I/LmhyZWYgPz8gJycsXG4gICAgICAgICAgICB0aXRsZTogc3Bhbj8udGV4dENvbnRlbnQ/LnRyaW0oKSA/PyAnJ1xuICAgICAgICB9O1xuICAgIH0pLmZpbHRlcih2aWRlbyA9PiB2aWRlby5saW5rICE9PSAnJyk7XG4gICAgXG4gICAgLy8gY29uc29sZS5sb2coXCJQcmludGluZyB0aGUgZmlyc3QgNSB2aWRlb3NcIik7XG4gICAgLy8gY29uc29sZS50YWJsZSh2aWRlb3Muc2xpY2UoMCw1KSk7XG4gICAgcmV0dXJuIHtcInZpZGVvc1wiOiB2aWRlb3N9O1xufTtcblxuY29uc3QgZXh0cmFjdG9ycyA9IFtuZXcgRXh0cmFjdG9yRGF0YShTZW5kZXJNZXRob2QuSW50ZXJhY3Rpb25EZXRlY3Rpb24sIFwiL1wiLCBnZXRIb21lcGFnZVZpZGVvcyksIFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEV4dHJhY3RvckRhdGEoU2VuZGVyTWV0aG9kLkludGVyYWN0aW9uRGV0ZWN0aW9uLCBcIi93YXRjaD92PSpcIiwgZ2V0UmVjb21tZW5kZWRWaWRlb3MpXVxuXG5jb25zdCB5dENvbmZpZ0xvYWRlciA9IG5ldyBDb25maWdMb2FkZXIoeXRDb25maWcsIGV4dHJhY3RvcnMpO1xuXG5uZXcgTW9uaXRvcih5dENvbmZpZ0xvYWRlcik7XG5cbi8vIGNvbnN0IHRpa3Rva0lEU2VsZWN0b3IgPSAoKTogb2JqZWN0ID0+IHtcbi8vICAgICBsZXQgdmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi54Z3BsYXllci1jb250YWluZXIudGlrdG9rLXdlYi1wbGF5ZXJcIik7XG4vLyAgICAgaWYgKCF2aWQpe1xuLy8gICAgICAgICBjb25zb2xlLmxvZyhcIm5vIHVybCBmb3VuZCFcIik7XG4vLyAgICAgICAgIHJldHVybiB7fTtcbi8vICAgICB9XG4vLyAgICAgbGV0IGlkID0gdmlkLmlkLnNwbGl0KFwiLVwiKS5hdCgtMSk7XG4vLyAgICAgbGV0IHVybCA9IGBodHRwczovL3Rpa3Rvay5jb20vc2hhcmUvdmlkZW8vJHtpZH1gO1xuLy8gICAgIHJldHVybiB7XG4vLyAgICAgICAgIFwidW5pcXVlVVJMXCI6IHVybFxuLy8gICAgIH07XG4vLyB9XG5cblxuXG4vLyBjb25zb2xlLmxvZyh0aWt0b2tDb25maWcpO1xuLy8gY29uc3QgdGlrdG9rQ29uZmlnTG9hZGVyID0gbmV3IENvbmZpZ0xvYWRlcih0aWt0b2tDb25maWcpO1xuLy8gdGlrdG9rQ29uZmlnTG9hZGVyLmluamVjdEV4dHJhY3RvcihcIi8qXCIsIHRpa3Rva0lEU2VsZWN0b3IpO1xuLy8gY29uc3QgdGlrdG9rSW50ZXJhY3RvciA9IG5ldyBNb25pdG9yKHRpa3Rva0NvbmZpZ0xvYWRlci5jb25maWcpO1xuXG4vLyAvLyBjb25zb2xlLmxvZyh0aWt0b2tDb25maWcpO1xuLy8gY29uc3QgbGlua2VkaW5Db25maWdMb2FkZXIgPSBuZXcgQ29uZmlnTG9hZGVyKGxpbmtlZGluQ29uZmlnKTtcbi8vIGNvbnN0IGxpbmtlZGluSW50ZXJhY3RvciA9IG5ldyBNb25pdG9yKGxpbmtlZGluQ29uZmlnTG9hZGVyLmNvbmZpZyk7IiwiaW1wb3J0IHsgU2VuZGVyTWV0aG9kIH0gZnJvbSBcIi4uL2NvbW1vbi9jb21tdW5pY2F0aW9uL3NlbmRlclwiO1xuXG5leHBvcnQge1NlbGVjdG9yTmFtZVBhaXIsIENvbmZpZywgQ29uZmlnTG9hZGVyLCBQYXR0ZXJuRGF0YSwgUGF0dGVyblNlbGVjdG9yTWFwLCBFeHRyYWN0b3JEYXRhLCBFeHRyYWN0b3JMaXN0fTtcblxuaW50ZXJmYWNlIFNlbGVjdG9yTmFtZVBhaXJ7XG4gICAgLyoqXG4gICAgICogQW4gaW50ZXJmYWNlIHRvIG1hcCBDU1Mgc2VsZWN0b3JzIHRvIGh1bWFuIHJlYWRhYmxlIG5hbWVzXG4gICAgICovXG4gICAgLy8gVGhlIENTUyBzZWxlY3RvclxuICAgIHNlbGVjdG9yOiBzdHJpbmc7XG4gICAgLy8gVGhlIGh1bWFuIHJlYWRhYmxlIG5hbWUgZm9yIHRoZSBDU1Mgc2VsZWN0b3JcbiAgICBuYW1lOiBzdHJpbmc7XG59XG5cbnR5cGUgUGF0dGVyblNlbGVjdG9yTWFwID0gUmVjb3JkPHN0cmluZywgUGF0dGVybkRhdGE+O1xuXG5pbnRlcmZhY2UgUGF0dGVybkRhdGEge1xuICAgIC8qKlxuICAgICAqIEFuIGludGVyZmFjZSB0byBidW5kbGUgdG9nZXRoZXIgZGF0YSBpbiB0aGUgQ29uZmlnIGZvciBhIGdpdmVuIHBhdGggcGF0dGVybi5cbiAgICAgKiBJdCBjb250YWlucyBhIGxpc3Qgb2YgQ1NTIHNlbGVjdG9ycyBmb3IgdGhlIHBhdGggcGF0dGVybiBhbmQgb3B0aW9uYWxseVxuICAgICAqIGFuIGlkU2VsZWN0b3IgZnVuY3Rpb24gdGhhdCBleHRyYWN0cyBhbiBJRCBmcm9tIHBhZ2VzIHdpdGggdGhlIGNvcnJlc3BvbmRpbmcgVVJMXG4gICAgICovXG4gICAgLy8gQSBsaXN0IG9mIHNlbGVjdG9ycyBhbmQgbmFtZXMgZm9yIHRoZSBwYWdlXG4gICAgc2VsZWN0b3JzPzogU2VsZWN0b3JOYW1lUGFpcltdO1xuICAgIC8vIEEgZnVuY3Rpb24gdGhhdCBleHRyYWN0cyBtZXRhZGF0YSBmcm9tIHRoZSBwYWdlXG4gICAgZGF0YUV4dHJhY3Rvcj86ICgpID0+IG9iamVjdDtcbn1cblxuaW50ZXJmYWNlIENvbmZpZyB7XG4gICAgLyoqXG4gICAgICogQW4gaW50ZXJmYWNlIHRoYXQgY29udGFpbnMgYWxsIHRoZSBkYXRhIHJlcXVpcmVkIHRvIGluc3RhbnRpYXRlIGEgTW9uaXRvci5cbiAgICAgKi9cbiAgICAvLyBUaGUgYmFzZSBVUkwgdGhhdCB0aGUgbW9uaXRvciBzaG91bGQgc3RhcnQgYXRcbiAgICBiYXNlVVJMOiBzdHJpbmc7XG4gICAgLy8gQSBtYXBwaW5nIG9mIFVSTCBwYXR0ZXJucyB0byBwYXRoIGRhdGEuIFRoZSBVUkwgUGF0dGVybiBzaG91bGQgZm9sbG93IHRoZSBcbiAgICAvLyBVUkwgUGF0dGVybiBBUEkgc3ludGF4LiBUaGVzZSBhcmUgYXBwZW5kZWQgdG8gdGhlIGJhc2VVUkwgd2hlbiBjaGVja2luZyBmb3IgbWF0Y2hlc1xuICAgIC8vIEV4OiBiYXNlVVJMOiB3d3cueW91dHViZS5jb20sIHBhdGg6IC9zaG9ydHMvOmlkIC0+IHd3dy55b3V0dWJlLmNvbS9zaG9ydHMvOmlkXG4gICAgcGF0aHM6IFBhdHRlcm5TZWxlY3Rvck1hcDtcbiAgICAvLyBJbmRpY2F0ZXMgd2hldGhlciB0aGUgTW9uaXRvciBzaG91bGQgYmUgaW4gZGVidWcgbW9kZS4gSWYgdHJ1ZSwgYWRkIGNvbG91cmVkIGJveGVzXG4gICAgLy8gYXJvdW5kIHNlbGVjdGVkIEhUTUwgZWxlbWVudHNcbiAgICBkZWJ1Zz86IGJvb2xlYW47XG4gICAgLy8gQSBsaXN0IG9mIGV2ZW50IHR5cGVzIHRvIG1vbml0b3IuIEJ5IGRlZmF1bHQsIHRoaXMgaXMganVzdCBbXCJjbGlja1wiXVxuICAgIGV2ZW50cz86IHN0cmluZ1tdO1xufVxuXG5jbGFzcyBFeHRyYWN0b3JEYXRhIHtcbiAgICBldmVudFR5cGU6IFNlbmRlck1ldGhvZDtcbiAgICB1cmxQYXR0ZXJuOiBzdHJpbmc7XG4gICAgZXh0cmFjdG9yOiAoKSA9PiBvYmplY3Q7XG4gICAgY29uc3RydWN0b3IoYWN0aXZpdHlUeXBlOiBTZW5kZXJNZXRob2QsIHVybFBhdHRlcm46IHN0cmluZywgZXh0cmFjdG9yOiAoKSA9PiBvYmplY3Qpe1xuICAgICAgICB0aGlzLmV2ZW50VHlwZSA9IGFjdGl2aXR5VHlwZTtcbiAgICAgICAgdGhpcy51cmxQYXR0ZXJuID0gdXJsUGF0dGVybjtcbiAgICAgICAgdGhpcy5leHRyYWN0b3IgPSBleHRyYWN0b3I7XG4gICAgfVxufVxuXG5jbGFzcyBFeHRyYWN0b3JMaXN0IHtcbiAgICBwcml2YXRlIGV4dHJhY3RvcnM6IEV4dHJhY3RvckRhdGFbXTtcbiAgICBwcml2YXRlIGJhc2VVUkw6IHN0cmluZztcbiAgICBjb25zdHJ1Y3RvcihleHRyYWN0b3JzOiBFeHRyYWN0b3JEYXRhW10gPSBbXSwgYmFzZVVSTDogc3RyaW5nKXtcbiAgICAgICAgdGhpcy5leHRyYWN0b3JzID0gZXh0cmFjdG9ycztcbiAgICAgICAgdGhpcy5iYXNlVVJMID0gYmFzZVVSTDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZXh0cmFjdChjdXJyZW50VVJMOiBzdHJpbmcsIGV2ZW50VHlwZTogU2VuZGVyTWV0aG9kKXtcbiAgICAgICAgY29uc29sZS5sb2coYEF0dGVtcHRpbmcgZXh0cmFjdGlvbiBmb3IgdXJsOiAke2N1cnJlbnRVUkx9IGFuZCBldmVudCB0eXBlICR7ZXZlbnRUeXBlfWApO1xuICAgICAgICBsZXQgZXh0cmFjdGVkRGF0YTogb2JqZWN0ID0ge307XG4gICAgICAgIHRoaXMuZXh0cmFjdG9ycy5maWx0ZXIoZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNDb3JyZWN0QWN0aXZpdHkgPSAoZS5ldmVudFR5cGUgPT0gZXZlbnRUeXBlIHx8IGUuZXZlbnRUeXBlID09IFNlbmRlck1ldGhvZC5BbnkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBuZXcgVVJMUGF0dGVybihlLnVybFBhdHRlcm4sIHRoaXMuYmFzZVVSTCk7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNVUkxNYXRjaCA9IHAudGVzdChjdXJyZW50VVJMKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXNDb3JyZWN0QWN0aXZpdHkgJiYgaXNVUkxNYXRjaDtcbiAgICAgICAgICAgIH0pLmZvckVhY2goZSA9PlxuICAgICAgICAgICAgICAgIGV4dHJhY3RlZERhdGEgPSB7Li4uIGV4dHJhY3RlZERhdGEsIC4uLiBlLmV4dHJhY3RvcigpfVxuICAgICAgICAgICAgKVxuICAgICAgICByZXR1cm4gZXh0cmFjdGVkRGF0YTtcbiAgICB9XG59XG5cbmNsYXNzIENvbmZpZ0xvYWRlciB7XG4gICAgcHVibGljIGNvbmZpZzogQ29uZmlnO1xuICAgIHB1YmxpYyBleHRyYWN0b3JMaXN0OiBFeHRyYWN0b3JMaXN0O1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlnOiBDb25maWcsIGV4dHJhY3Rvckxpc3Q6IEV4dHJhY3RvckRhdGFbXSA9IFtdKXtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgICAgIHRoaXMuZXh0cmFjdG9yTGlzdCA9IG5ldyBFeHRyYWN0b3JMaXN0KGV4dHJhY3Rvckxpc3QsIGNvbmZpZy5iYXNlVVJMKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBCYWNrZ3JvdW5kTWVzc2FnZSwgTWVzc2FnZVJlc3BvbnNlfSBmcm9tIFwiLi4vY29tbW9uL2NvbW11bmljYXRpb24vYmFja2dyb3VuZG1lc3NhZ2VcIjtcclxuaW1wb3J0IHtEQkRvY3VtZW50LCBBY3Rpdml0eURvY3VtZW50LCBTZXNzaW9uRG9jdW1lbnR9IGZyb20gXCIuLi9jb21tb24vZGJkb2N1bWVudFwiO1xyXG5pbXBvcnQge0NvbmZpZ0xvYWRlciwgRXh0cmFjdG9yTGlzdCwgUGF0dGVyblNlbGVjdG9yTWFwfSBmcm9tIFwiLi9jb25maWdcIjtcclxuaW1wb3J0IHsgUGFnZURhdGEgfSBmcm9tIFwiLi9wYWdlZGF0YVwiO1xyXG5pbXBvcnQgeyBBY3Rpdml0eVR5cGUgfSBmcm9tIFwiLi4vY29tbW9uL2NvbW11bmljYXRpb24vYWN0aXZpdHlcIjtcclxuaW1wb3J0IHtTZW5kZXJNZXRob2R9IGZyb20gXCIuLi9jb21tb24vY29tbXVuaWNhdGlvbi9zZW5kZXJcIlxyXG5cclxuLyoqXHJcbiAqIFRoaXMgY2xhc3MgcmVhZHMgZnJvbSBhIHByb3ZpZGVkIENvbmZpZyBvYmplY3QgYW5kIGF0dGFjaGVzIGxpc3RlbmVycyB0byB0aGUgZWxlbWVudHMgc3BlY2lmaWVkIGluIHRoZSBzZWxlY3RvcnMuXHJcbiAqIFdoZW4gdGhlc2UgZWxlbWVudHMgYXJlIGludGVyYWN0ZWQgd2l0aCwgb3Igd2hlbiBhIG5hdmlnYXRpb24gb2NjdXJzLCBhIGRvY3VtZW50IGlzIHNlbnQgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0XHJcbiAqIHRvIGJlIGFwcGVuZGVkIHRvIHRoZSBkYXRhYmFzZS4gVGhpcyBjbGFzcyBpcyBpbnN0YW50aWF0ZWQgaW4gY29udGVudC50cy5cclxuICogXHJcbiAqIEBwYXJhbSBpbnRlcmFjdGlvbkV2ZW50cyAtIEEgbGlzdCBvZiB0aGUgdHlwZSBvZiBldmVudHMgd2Ugd2FudCB0byBtb25pdG9yIGFzIGludGVyYWN0aW9ucyAoZWcuIGNsaWNrLCBzY3JvbGwsIGV0Yy4pLiBEZWZhdWx0IGlzIGNsaWNrXHJcbiAqIEBwYXJhbSBkZWJ1ZyAtIElmIHRydWUsIGhpZ2hsaWdodCBhbGwgc2VsZWN0ZWQgSFRNTCBlbGVtZW50cyB3aXRoIGNvbG91cmVkIGJveGVzXHJcbiAqIEBwYXJhbSBwYXRocyAtIEFuIG9iamVjdCBtYXBwaW5nIHBhdGggcGF0dGVybnMgdG8gdGhlaXIgY29ycmVzcG9uZGluZyBDU1Mgc2VsZWN0b3JzIFBhdGggcGF0dGVybnMgYXJlIGNvbnNpc3RlbnQgd2l0aCB0aGUgIFVSTCBQYXR0ZXJuIEFQSSBTeW50YXg6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9VUkxfUGF0dGVybl9BUElcclxuICogQHBhcmFtIGJhc2VVUkwgLSBCYXNlIHVybCBmb3IgdGhlIHBhZ2UgKGVnLiB3d3cueW91dHViZS5jb20pLiBBbGwgcGF0aHMgYXJlIGFwcGVuZGVkIHRvIHRoaXMgd2hlbiBtYXRjaGluZyBVUmxzXHJcbiAqIEBwYXJhbSBjdXJyZW50UGFnZURhdGEgLSBDb250YWlucyBkYXRhIHJlbGV2YW50IHRvIHRoZSBjdXJyZW50IHBhZ2UuXHJcbiAqIEBwYXJhbSBpbnRlcmFjdGlvbkF0dHJpYnV0ZSAtIEF0dHJpYnV0ZSBhZGRlZCB0byBhbGwgZWxlbWVudHMgYmVpbmcgbW9uaXRvcmVkXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTW9uaXRvciB7XHJcbiAgICAvLyBBIGxpc3Qgb2YgdGhlIHR5cGUgb2YgZXZlbnRzIHdlIHdhbnQgdG8gbW9uaXRvciBhcyBpbnRlcmFjdGlvbnMgKGVnLiBjbGljaywgc2Nyb2xsLCBldGMuKS4gRGVmYXVsdCBpcyBjbGlja1xyXG4gICAgaW50ZXJhY3Rpb25FdmVudHM6IHN0cmluZ1tdO1xyXG4gICAgLy8gSWYgdHJ1ZSwgaGlnaGxpZ2h0IGFsbCBzZWxlY3RlZCBIVE1MIGVsZW1lbnRzIHdpdGggY29sb3VyZWQgYm94ZXNcclxuICAgIGhpZ2hsaWdodDogYm9vbGVhbjtcclxuICAgIC8vIEFuIG9iamVjdCBtYXBwaW5nIHBhdGggcGF0dGVybnMgdG8gdGhlaXIgY29ycmVzcG9uZGluZyBDU1Mgc2VsZWN0b3JzXHJcbiAgICAvLyBQYXRoIHBhdHRlcm5zIGFyZSBjb25zaXN0ZW50IHdpdGggdGhlIFVSTCBQYXR0ZXJuIEFQSSBTeW50YXg6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9VUkxfUGF0dGVybl9BUElcclxuICAgIHBhdGhzOiBQYXR0ZXJuU2VsZWN0b3JNYXA7XHJcbiAgICAvLyBCYXNlIHVybCBmb3IgdGhlIHBhZ2UgKGVnLiB3d3cueW91dHViZS5jb20pLiBBbGwgcGF0aHMgYXJlIGFwcGVuZGVkIHRvIHRoaXMgd2hlbiBtYXRjaGluZyBVUmxzXHJcbiAgICBiYXNlVVJMOiBzdHJpbmc7XHJcbiAgICAvLyBDb250YWlucyBkYXRhIHJlbGV2YW50IHRvIHRoZSBjdXJyZW50IHBhZ2UuXHJcbiAgICBjdXJyZW50UGFnZURhdGE6IFBhZ2VEYXRhO1xyXG4gICAgLy8gQXR0cmlidXRlIGFkZGVkIHRvIGFsbCBlbGVtZW50cyBiZWluZyBtb25pdG9yZWRcclxuICAgIGludGVyYWN0aW9uQXR0cmlidXRlOiBzdHJpbmc7XHJcblxyXG4gICAgZXh0cmFjdG9yTGlzdDogRXh0cmFjdG9yTGlzdDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWdMb2FkZXI6IENvbmZpZ0xvYWRlcikge1xyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IGNvbmZpZ0xvYWRlci5jb25maWc7XHJcbiAgICAgICAgdGhpcy5pbnRlcmFjdGlvbkV2ZW50cyA9IGNvbmZpZy5ldmVudHMgPz8gWydjbGljayddO1xyXG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnBhdGhzID0gY29uZmlnLnBhdGhzO1xyXG4gICAgICAgIHRoaXMuYmFzZVVSTCA9IGNvbmZpZy5iYXNlVVJMO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhID0gbmV3IFBhZ2VEYXRhKCk7XHJcbiAgICAgICAgdGhpcy5pbnRlcmFjdGlvbkF0dHJpYnV0ZSA9IFwibW9uaXRvcmluZy1pbnRlcmFjdGlvbnNcIlxyXG4gICAgICAgIHRoaXMuZXh0cmFjdG9yTGlzdCA9IGNvbmZpZ0xvYWRlci5leHRyYWN0b3JMaXN0OyBcclxuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gPT09IHRoaXMuYmFzZVVSTCkge1xyXG4gICAgICAgICAgICBjb25zdCBydW5XaGVuVmlzaWJsZSA9ICgpID0+IHsgIC8vIFJlbW92ZSBhc3luYyBoZXJlXHJcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAndmlzaWJsZScpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBXcmFwIHRoZSBhc3luYyBjYWxsIGFuZCBoYW5kbGUgZXJyb3JzXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplTW9uaXRvcigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCBydW5XaGVuVmlzaWJsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBpbml0aWFsaXppbmcgbW9uaXRvcjonLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTdGlsbCByZW1vdmUgbGlzdGVuZXIgZXZlbiBpZiB0aGVyZSdzIGFuIGVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgcnVuV2hlblZpc2libGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XHJcbiAgICAgICAgICAgICAgICBydW5XaGVuVmlzaWJsZSgpOyAvLyBUaGlzIHdpbGwgbm93IGJlIHN5bmNocm9ub3VzXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHsgIC8vIFJlbW92ZSBhc3luYyBoZXJlXHJcbiAgICAgICAgICAgICAgICAgICAgcnVuV2hlblZpc2libGUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgcnVuV2hlblZpc2libGUpO1xyXG4gICAgICAgIH0gIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIG1vbml0b3IgaWYgYmFzZSBVUkwgbWF0Y2hlcyB0aGUgY3VycmVudCBVUkxcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhc3luYyBpbml0aWFsaXplTW9uaXRvcigpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImluaXRpYWxpemluZyBtb25pdG9yXCIpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ3VycmVudFBhZ2VEYXRhKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZXMgYSBuZXcgZW50cnkgaW4gdGhlIERCIGRlc2NyaWJpbmcgdGhlIHN0YXRlIGF0IHRoZSBzdGFydCBvZiB0aGUgc2Vzc2lvblxyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmluaXRpYWxpemVTZXNzaW9uKCk7XHJcbiAgICAgICAgICAgIC8vIEJpbmRzIGxpc3RlbmVycyB0byB0aGUgSFRNTCBlbGVtZW50cyBzcGVjaWZpZWQgaW4gdGhlIGNvbmZpZyBmb3IgYWxsIG1hdGNoaW5nIHBhdGggcGF0dGVybnNcclxuICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gaW5pdGlhbGl6ZSBzZXNzaW9uOlwiLCBlcnIpO1xyXG4gICAgICAgIH1cclxufVxyXG4gICAgLyoqXHJcbiAgICogVXBkYXRlcyB0aGUgcGFnZSBkYXRhIHdoZW5ldmVyIGEgbmV3IHBhZ2UgaXMgZGV0ZWN0ZWRcclxuICAgKiBAcGFyYW0gdXJsIC0gdGhlIHVybCBvZiB0aGUgbmV3IHBhZ2VcclxuICAgKi9cclxuICAgIHByaXZhdGUgdXBkYXRlQ3VycmVudFBhZ2VEYXRhKHVybDogc3RyaW5nKXtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlRGF0YS51cGRhdGUodGhpcy5iYXNlVVJMLCB1cmwsIHRoaXMucGF0aHMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBuZXcgZW50cnkgaW4gdGhlIERCIGRlc2NyaWJpbmcgdGhlIHN0YXRlIGF0IHRoZSBzdGFydCBvZiB0aGUgc2Vzc2lvblxyXG4gICAqL1xyXG4gICAgcHJpdmF0ZSBhc3luYyBpbml0aWFsaXplU2Vzc2lvbigpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBjdXJyZW50U3RhdGUgPSBuZXcgU2Vzc2lvbkRvY3VtZW50KHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCwgZG9jdW1lbnQudGl0bGUpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ2hlY2tpbmcgaGlnaGxpZ2h0XCIpO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5zZW5kTWVzc2FnZVRvQmFja2dyb3VuZChTZW5kZXJNZXRob2QuSW5pdGlhbGl6ZVNlc3Npb24sIGN1cnJlbnRTdGF0ZSk7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlPy5zdGF0dXMgPT09IFwiU2Vzc2lvbiBpbml0aWFsaXplZFwiICYmIHJlc3BvbnNlLmhpZ2hsaWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLmhpZ2hsaWdodCA9IHJlc3BvbnNlLmhpZ2hsaWdodDsgLy8gVHlwZVNjcmlwdCBrbm93cyBoaWdobGlnaHQgZXhpc3RzIGhlcmVcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coYEhpZ2hsaWdodCBpcyBzZXQgdG8gJHt0aGlzLmhpZ2hsaWdodH1gKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIEJpbmRzIGV2ZW50IGxpc3RlbmVycyBmb3IgbXV0YXRpb25zIGFuZCBuYXZpZ2F0aW9uXHJcbiAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBiaW5kRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIC8vIFdoZW5ldmVyIG5ldyBjb250ZW50IGlzIGxvYWRlZCwgYXR0YWNoIG9ic2VydmVycyB0byBlYWNoIEhUTUwgZWxlbWVudCB0aGF0IG1hdGNoZXMgdGhlIHNlbGVjdG9ycyBpbiB0aGUgY29uZmlnc1xyXG4gICAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4gdGhpcy5hZGRMaXN0ZW5lcnNUb05ld01hdGNoZXMoKSk7XHJcbiAgICAgICAgLy8gTWFrZSB0aGUgbXV0YXRpb24gb2JzZXJ2ZXIgb2JzZXJ2ZSB0aGUgZW50aXJlIGRvY3VtZW50IGZvciBjaGFuZ2VzXHJcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7XHJcbiAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcclxuICAgICAgICAgICAgc3VidHJlZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBBZGQgYW4gZXZlbnQgbGlzdGVuZXIgdG8gZGV0ZWN0IG5hdmlnYXRpb25zIG9uIHRoZSBwYWdlXHJcbiAgICAgICAgbmF2aWdhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibmF2aWdhdGVcIiwgKGU6IE5hdmlnYXRpb25FdmVudCkgPT4gdGhpcy5vbk5hdmlnYXRpb25EZXRlY3Rpb24oZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIEFkZHMgbGlzdGVuZXJzIHRvIG11dGF0aW9ucyAoaWUuIG5ld2x5IHJlbmRlcmVkIGVsZW1lbnRzKSBhbmQgbWFya3MgdGhlbSB3aXRoIHRoaXMuaW50ZXJhY3R0aW9uQXR0cmlidXRlLlxyXG4gICAqIElmIGRlYnVnIG1vZGUgaXMgb24sIHRoaXMgd2lsbCBhZGQgYSBjb2xvdXJmdWwgYm9yZGVyIHRvIHRoZXNlIGVsZW1lbnRzLlxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgYWRkTGlzdGVuZXJzVG9OZXdNYXRjaGVzKCk6IHZvaWQge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYWRkaW5nIHNlbGVjdG9yc1wiKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgVmFsdWUgb2YgaGlnaGxpZ2h0OiAke3RoaXMuaGlnaGxpZ2h0fWApO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQ3VycmVudCBwYWdlIGRhdGE6XCIpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuY3VycmVudFBhZ2VEYXRhKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlRGF0YS5zZWxlY3RvcnMuZm9yRWFjaChpbnRlcmFjdGlvbiA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgOmlzKCR7aW50ZXJhY3Rpb24uc2VsZWN0b3J9KTpub3QoWyR7dGhpcy5pbnRlcmFjdGlvbkF0dHJpYnV0ZX1dKWApO1xyXG4gICAgICAgICAgICBjb25zdCBuYW1lID0gaW50ZXJhY3Rpb24ubmFtZTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIGVsZW1lbnRzKXtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhpZ2hsaWdodCkgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLmJvcmRlciA9IGAycHggc29saWQgJHt0aGlzLlN0cmluZ1RvQ29sb3IubmV4dChuYW1lKX1gO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUodGhpcy5pbnRlcmFjdGlvbkF0dHJpYnV0ZSwgJ3RydWUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGllIG9mIHRoaXMuaW50ZXJhY3Rpb25FdmVudHMpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoaWUsIChlOiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uSW50ZXJhY3Rpb25EZXRlY3Rpb24oZWxlbWVudCwgZSwgbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0LlxyXG4gICAqIEBwYXJhbSBldmVudCAtIHRoZSBIVE1MIGV2ZW50IHRoYXQgb2NjdXJlZFxyXG4gICAqIEByZXR1cm5zIEEgZG9jdW1lbnQgZGVzY3JpYmluZyB0aGUgc3RhdGUgY2hhbmdlXHJcbiAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTdGF0ZUNoYW5nZVJlY29yZChldmVudDogRXZlbnQpOiBEQkRvY3VtZW50IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkRldGVjdGVkIHN0YXRlIGNoYW5nZSBldmVudFwiKTtcclxuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IHRoaXMuZXh0cmFjdG9yTGlzdC5leHRyYWN0KHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCwgU2VuZGVyTWV0aG9kLk5hdmlnYXRpb25EZXRlY3Rpb24pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicHJpbnRpbmcgbWV0YWRhdGFcIik7XHJcbiAgICAgICAgY29uc29sZS5sb2cobWV0YWRhdGEpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEFjdGl2aXR5RG9jdW1lbnQoQWN0aXZpdHlUeXBlLlN0YXRlQ2hhbmdlLCBldmVudCwgbWV0YWRhdGEsIHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCwgZG9jdW1lbnQudGl0bGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIFNlbmRzIGEgbWVzc2FnZSB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHQuXHJcbiAgICogQHBhcmFtIGV2ZW50IC0gdGhlIEhUTUwgZXZlbnQgdGhhdCBvY2N1cmVkXHJcbiAgICogQHBhcmFtIHVybENoYW5nZSAtIGluZGljYXRlcyB3aGV0aGVyIHRoZSBzZWxmLWxvb3AgcmVzdWx0ZWQgaW4gYSB1cmwgY2hhbmdlXHJcbiAgICogXHJcbiAgICogQHJldHVybnMgQSBkb2N1bWVudCBkZXNjcmliaW5nIHNlbGYgbG9vcFxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlU2VsZkxvb3BSZWNvcmQoZXZlbnQ6IEV2ZW50KTogREJEb2N1bWVudCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJEZXRlY3RlZCBzZWxmIGxvb3AgY2hhbmdlIGV2ZW50XCIpO1xyXG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gdGhpcy5leHRyYWN0b3JMaXN0LmV4dHJhY3QodGhpcy5jdXJyZW50UGFnZURhdGEudXJsLCBTZW5kZXJNZXRob2QuTmF2aWdhdGlvbkRldGVjdGlvbik7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJwcmludGluZyBtZXRhZGF0YVwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhtZXRhZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBY3Rpdml0eURvY3VtZW50KEFjdGl2aXR5VHlwZS5TZWxmTG9vcCwgZXZlbnQsIG1ldGFkYXRhLCB0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmwsIGRvY3VtZW50LnRpdGxlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0LlxyXG4gICAqIEBwYXJhbSBlbGVtZW50IC0gdGhlIGVsZW1lbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIGV2ZW50XHJcbiAgICogQHBhcmFtIG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJlZCB0aGUgY2FsbGJhY2sgKGFzIGRlZmluZWQgaW4gdGhlIGNvbmZpZylcclxuICAgKiBAcGFyYW0gZXZlbnQgLSB0aGUgSFRNTCBldmVudCB0aGF0IG9jY3VyZWRcclxuICAgKiBAcmV0dXJucyBBIGRvY3VtZW50IGludGVyYWN0aW9uIHNlbGYgbG9vcFxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlSW50ZXJhY3Rpb25SZWNvcmQoZWxlbWVudDogRWxlbWVudCwgbmFtZTogc3RyaW5nLCBldmVudDogRXZlbnQpOiBEQkRvY3VtZW50IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkRldGVjdGVkIGludGVyYWN0aW9uIGV2ZW50XCIpO1xyXG4gICAgICAgIGxldCBtZXRhZGF0YToge2h0bWw6IHN0cmluZywgZWxlbWVudE5hbWU6IHN0cmluZzsgaWQ/OiBzdHJpbmd9ID0ge1xyXG4gICAgICAgICAgICBodG1sOiBlbGVtZW50LmdldEhUTUwoKSxcclxuICAgICAgICAgICAgZWxlbWVudE5hbWU6IG5hbWUsXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCBleHRyYWN0ZWREYXRhID0gdGhpcy5leHRyYWN0b3JMaXN0LmV4dHJhY3QodGhpcy5jdXJyZW50UGFnZURhdGEudXJsLCBTZW5kZXJNZXRob2QuSW50ZXJhY3Rpb25EZXRlY3Rpb24pO1xyXG5cclxuICAgICAgICBtZXRhZGF0YSA9IHsuLi4gbWV0YWRhdGEsIC4uLiBleHRyYWN0ZWREYXRhfTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJwcmludGluZyBtZXRhZGF0YVwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhtZXRhZGF0YSk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEFjdGl2aXR5RG9jdW1lbnQoQWN0aXZpdHlUeXBlLkludGVyYWN0aW9uLCBldmVudCwgbWV0YWRhdGEsIHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCwgZG9jdW1lbnQudGl0bGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIFNlbmRzIGEgbWVzc2FnZSB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHQuXHJcbiAgICogQHBhcmFtIHNlbmRlciAtIHRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvbiB0aGF0J3Mgc2VuZGluZyB0aGUgbWVzc2FnZSB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHRcclxuICAgKiBAcGFyYW0gcGF5bG9hZCAtIHRoZSBkYXRhIGJlaW5nIHNlbnQgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0XHJcbiAgICogXHJcbiAgICogQHJldHVybnMgUmVzcG9uc2UgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBtZXNzYWdlIHN1Y2NlZWRlZFxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoc2VuZGVyTWV0aG9kOiBTZW5kZXJNZXRob2QsIHBheWxvYWQ6IERCRG9jdW1lbnQpOiBQcm9taXNlPE1lc3NhZ2VSZXNwb25zZSB8IG51bGw+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyBDaGVjayBpZiBydW50aW1lIGlzIGF2YWlsYWJsZSAoZXh0ZW5zaW9uIGNvbnRleHQgc3RpbGwgdmFsaWQpXHJcbiAgICAgICAgICAgIGlmICghY2hyb21lLnJ1bnRpbWU/LmlkKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4dGVuc2lvbiBjb250ZXh0IGludmFsaWRhdGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBuZXcgQmFja2dyb3VuZE1lc3NhZ2Uoc2VuZGVyTWV0aG9kLCBwYXlsb2FkKTtcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgOiBNZXNzYWdlUmVzcG9uc2UgPSBhd2FpdCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShtZXNzYWdlKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIENocm9tZSByZXR1cm5zIHVuZGVmaW5lZCBpZiBubyBsaXN0ZW5lcnMsIGNoZWNrIGlmIHRoYXQncyBleHBlY3RlZFxyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignTm8gcmVzcG9uc2UgZnJvbSBiYWNrZ3JvdW5kIHNjcmlwdCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdCYWNrZ3JvdW5kIG1lc3NhZ2UgZmFpbGVkOicsIGVycm9yKTtcclxuICAgICAgICAgICAgLy8gRGVjaWRlIHdoZXRoZXIgdG8gdGhyb3cgb3IgaGFuZGxlIGdyYWNlZnVsbHkgYmFzZWQgb24geW91ciBuZWVkc1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDsgLy8gb3IgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIENhbGxiYWNrIHRoYXQgY3JlYXRlcyBhIHBheWxvYWQgZGVzY3JpYmluZyB0aGUgaW50ZXJhY3Rpb24gdGhhdCBvY2N1cmVkIGFuZCBzZW5kcyBpdCB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHRcclxuICAgKiBAcGFyYW0gZSAtIHRoZSBldmVudCB0aGF0IHRyaWdnZXJlZCB0aGUgY2FsbGJhY2tcclxuICAgKiBAcGFyYW0gbmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBlbGVtZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBjYWxsYmFjayAoYXMgZGVmaW5lZCBpbiB0aGUgY29uZmlnKVxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgb25JbnRlcmFjdGlvbkRldGVjdGlvbihlbGVtZW50OiBFbGVtZW50LCBlOiBFdmVudCwgbmFtZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJpbnRlcmFjdGlvbiBldmVudCBkZXRlY3RlZFwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgRXZlbnQgZGV0ZWN0ZWQgd2l0aCBldmVudCB0eXBlOiAke2UudHlwZX1gKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgRXZlbnQgdHJpZ2dlcmVkIGJ5YCwgZWxlbWVudCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudC5pbm5lckhUTUwpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnQuZ2V0SFRNTCgpKTtcclxuICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmNyZWF0ZUludGVyYWN0aW9uUmVjb3JkKGVsZW1lbnQsIG5hbWUsIGUpO1xyXG4gICAgICAgIHRoaXMuc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoU2VuZGVyTWV0aG9kLkludGVyYWN0aW9uRGV0ZWN0aW9uLCByZWNvcmQpXHJcbiAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHNlbmQgaW50ZXJhY3Rpb24gZGF0YTonLCBlcnJvcik7XHJcbiAgICAgICAgICAgIC8vIE1heWJlIHF1ZXVlIGZvciByZXRyeSwgb3IganVzdCBsb2cgYW5kIGNvbnRpbnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsYmFjayB0aGF0IGNyZWF0ZXMgYSBwYXlsb2FkIGRlc2NyaWJpbmcgdGhlIG5hdmlnYXRpb24gdGhhdCBvY2N1cmVkIGFuZCBzZW5kcyBpdCB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHRcclxuICAgICAqIEBwYXJhbSBlIC0gdGhlIGV2ZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBjYWxsYmFja1xyXG4gICAgICogQHBhcmFtIG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJlZCB0aGUgY2FsbGJhY2sgKGFzIGRlZmluZWQgaW4gdGhlIGNvbmZpZylcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBvbk5hdmlnYXRpb25EZXRlY3Rpb24obmF2RXZlbnQ6IE5hdmlnYXRpb25FdmVudCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGRlc3RVcmwgPSBuYXZFdmVudC5kZXN0aW5hdGlvbi51cmw7XHJcbiAgICAgICAgY29uc3QgYmFzZVVSTENoYW5nZSA9IGRlc3RVcmwgJiYgdGhpcy5jdXJyZW50UGFnZURhdGEudXJsXHJcbiAgICAgICAgICAgID8gZGVzdFVybC5zcGxpdChcIi5cIilbMV0gIT09IHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybC5zcGxpdChcIi5cIilbMV1cclxuICAgICAgICAgICAgOiBmYWxzZTtcclxuICAgICAgICAvLyBjb25zdCB1cmxDaGFuZ2UgPSAhKG5hdkV2ZW50LmRlc3RpbmF0aW9uLnVybCA9PT0gdGhpcy5jdXJyZW50UGFnZURhdGEudXJsKTtcclxuICAgICAgICAvLyBsZXQgc291cmNlU3RhdGUgPSB0aGlzLmdldENsZWFuU3RhdGVOYW1lKCk7XHJcbiAgICAgICAgLy8gbGV0IG1hdGNoID0gdGhpcy5jdXJyZW50UGFnZURhdGEuY2hlY2tGb3JNYXRjaChuYXZFdmVudC5kZXN0aW5hdGlvbi51cmwpO1xyXG4gICAgICAgIGlmIChkZXN0VXJsKXtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZURhdGEudXJsID0gbmF2RXZlbnQuZGVzdGluYXRpb24udXJsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJObyBkZXN0aW5hdGlvbiBVUkwgZm91bmQgaW4gbmF2aWdhdGUgZXZlbnQuIFNldHRpbmcgdG8gZW1wdHkgc3RyaW5nXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmwgPSBcIk5PIFVSTCBGT1VORFwiO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gbGV0IGRlc3RTdGF0ZSA9IHRoaXMuZ2V0Q2xlYW5TdGF0ZU5hbWUoKTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coYE5hdmlnYXRpb24gZGV0ZWN0ZWQgd2l0aCBldmVudCB0eXBlOiAke25hdkV2ZW50LnR5cGV9YClcclxuICAgICAgICBpZiAoYmFzZVVSTENoYW5nZSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVVJMIGJhc2UgY2hhbmdlIGRldGVjdGVkLiBDbG9zaW5nIHByb2dyYW0uXCIpO1xyXG4gICAgICAgICAgICB0aGlzLnNlbmRNZXNzYWdlVG9CYWNrZ3JvdW5kKFNlbmRlck1ldGhvZC5DbG9zZVNlc3Npb24sIG5ldyBEQkRvY3VtZW50KHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCwgZG9jdW1lbnQudGl0bGUpKS5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBzZW5kIGludGVyYWN0aW9uIGRhdGE6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAobmF2RXZlbnQubmF2aWdhdGlvblR5cGUgPT09IFwicHVzaFwiKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHVzaCBldmVudCBkZXRlY3RlZC5cIik7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZCA9IHRoaXMuY3JlYXRlU3RhdGVDaGFuZ2VSZWNvcmQobmF2RXZlbnQpO1xyXG4gICAgICAgICAgICB0aGlzLnNlbmRNZXNzYWdlVG9CYWNrZ3JvdW5kKFNlbmRlck1ldGhvZC5OYXZpZ2F0aW9uRGV0ZWN0aW9uLCByZWNvcmQpLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHNlbmQgaW50ZXJhY3Rpb24gZGF0YTonLCBlcnJvcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUN1cnJlbnRQYWdlRGF0YSh0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmwpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobmF2RXZlbnQubmF2aWdhdGlvblR5cGUgPT09IFwicmVwbGFjZVwiKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVwbGFjZSBldmVudCBkZXRlY3RlZC5cIik7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZCA9IHRoaXMuY3JlYXRlU2VsZkxvb3BSZWNvcmQobmF2RXZlbnQpO1xyXG4gICAgICAgICAgICB0aGlzLnNlbmRNZXNzYWdlVG9CYWNrZ3JvdW5kKFNlbmRlck1ldGhvZC5OYXZpZ2F0aW9uRGV0ZWN0aW9uLCByZWNvcmQpLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHNlbmQgaW50ZXJhY3Rpb24gZGF0YTonLCBlcnJvcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICogR2VuZXJhdGVzIGEgdW5pcXVlIGNvbG9yIGZyb20gYSBnaXZlbiBzdHJpbmdcclxuICAgKiBTb3VyY2U6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zMTAzNzM4MyBcclxuICAgKiBAcmV0dXJucyBDb2xvciBoZXggY29kZVxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgU3RyaW5nVG9Db2xvciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaW50ZXJmYWNlIENvbG9ySW5zdGFuY2Uge1xyXG4gICAgICAgICAgICBzdHJpbmdUb0NvbG9ySGFzaDogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcclxuICAgICAgICAgICAgbmV4dFZlcnlEaWZmZXJudENvbG9ySWR4OiBudW1iZXI7XHJcbiAgICAgICAgICAgIHZlcnlEaWZmZXJlbnRDb2xvcnM6IHN0cmluZ1tdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGluc3RhbmNlOiBDb2xvckluc3RhbmNlIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG5leHQ6IGZ1bmN0aW9uIHN0cmluZ1RvQ29sb3Ioc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2UgPz89IHtcclxuICAgICAgICAgICAgICAgICAgICBzdHJpbmdUb0NvbG9ySGFzaDoge30sXHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dFZlcnlEaWZmZXJudENvbG9ySWR4OiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIHZlcnlEaWZmZXJlbnRDb2xvcnM6IFtcIiMwMEZGMDBcIiwgXCIjMDAwMEZGXCIsIFwiI0ZGMDAwMFwiLCBcIiMwMUZGRkVcIiwgXCIjRkZBNkZFXCIsIFwiI0ZGREI2NlwiLCBcIiMwMDY0MDFcIiwgXCIjMDEwMDY3XCIsIFwiIzk1MDAzQVwiLCBcIiMwMDdEQjVcIiwgXCIjRkYwMEY2XCIsIFwiI0ZGRUVFOFwiLCBcIiM3NzREMDBcIiwgXCIjOTBGQjkyXCIsIFwiIzAwNzZGRlwiLCBcIiNENUZGMDBcIiwgXCIjRkY5MzdFXCIsIFwiIzZBODI2Q1wiLCBcIiNGRjAyOURcIiwgXCIjRkU4OTAwXCIsIFwiIzdBNDc4MlwiLCBcIiM3RTJERDJcIiwgXCIjODVBOTAwXCIsIFwiI0ZGMDA1NlwiLCBcIiNBNDI0MDBcIiwgXCIjMDBBRTdFXCIsIFwiIzY4M0QzQlwiLCBcIiNCREM2RkZcIiwgXCIjMjYzNDAwXCIsIFwiI0JERDM5M1wiLCBcIiMwMEI5MTdcIiwgXCIjOUUwMDhFXCIsIFwiIzAwMTU0NFwiLCBcIiNDMjhDOUZcIiwgXCIjRkY3NEEzXCIsIFwiIzAxRDBGRlwiLCBcIiMwMDQ3NTRcIiwgXCIjRTU2RkZFXCIsIFwiIzc4ODIzMVwiLCBcIiMwRTRDQTFcIiwgXCIjOTFEMENCXCIsIFwiI0JFOTk3MFwiLCBcIiM5NjhBRThcIiwgXCIjQkI4ODAwXCIsIFwiIzQzMDAyQ1wiLCBcIiNERUZGNzRcIiwgXCIjMDBGRkM2XCIsIFwiI0ZGRTUwMlwiLCBcIiM2MjBFMDBcIiwgXCIjMDA4RjlDXCIsIFwiIzk4RkY1MlwiLCBcIiM3NTQ0QjFcIiwgXCIjQjUwMEZGXCIsIFwiIzAwRkY3OFwiLCBcIiNGRjZFNDFcIiwgXCIjMDA1RjM5XCIsIFwiIzZCNjg4MlwiLCBcIiM1RkFENEVcIiwgXCIjQTc1NzQwXCIsIFwiI0E1RkZEMlwiLCBcIiNGRkIxNjdcIiwgXCIjMDA5QkZGXCIsIFwiI0U4NUVCRVwiXVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWluc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoW3N0cl0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZS5zdHJpbmdUb0NvbG9ySGFzaFtzdHJdID0gaW5zdGFuY2UudmVyeURpZmZlcmVudENvbG9yc1tpbnN0YW5jZS5uZXh0VmVyeURpZmZlcm50Q29sb3JJZHgrK107XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCVjIFRoZSBjb2xvdXIgZm9yICR7c3RyfWAsIGBjb2xvcjogJHtpbnN0YW5jZS5zdHJpbmdUb0NvbG9ySGFzaFtzdHJdfWApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoW3N0cl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSkoKTtcclxufVxyXG4iLCJpbXBvcnQge1NlbGVjdG9yTmFtZVBhaXIsIFBhdHRlcm5EYXRhLCBQYXR0ZXJuU2VsZWN0b3JNYXAgfSBmcm9tIFwiLi9jb25maWdcIjtcclxuLyoqXHJcbiAqIEEgY2xhc3MgcmVzcG9uc2libGUgZm9yIHRyYWNraW5nIHRoZSBzdGF0ZSBvZiB0aGUgcGFnZSB0aGF0IHRoZSB1c2VyIGlzIGN1cnJlbnRseSBvbi5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBQYWdlRGF0YSB7XHJcbiAgICAvLyBVUkwgb2YgdGhlIHBhZ2VcclxuICAgIHVybCE6IHN0cmluZztcclxuICAgIC8vIENTUyBzZWxlY3RvcnMgYmVpbmcgYXBwbGllZCB0byB0aGUgcGFnZVxyXG4gICAgc2VsZWN0b3JzITogU2VsZWN0b3JOYW1lUGFpcltdO1xyXG4gICAgLy8gVGhlIFVSTCBwYXR0ZXJuLCBDU1Mgc2VsZWN0b3JzLCBhbmQgb3B0aW9uYWxseSBhIGZ1bmN0aW9uIGZvciBnZXR0aW5nIHBhZ2UgSUQgXHJcbiAgICAvLyBmb3IgdGhlIHBhdHRlcm4gdGhhdCBtb3N0IGNsb3NlbHkgbWF0Y2hlcyB0aGlzLnVybFxyXG4gICAgLy8gRXg6IElmIHRoZSB1cmwgaXMgd3d3LnlvdXR1YmUuY29tL3Nob3J0cy9BQkMgYW5kIHRoZSBwYXR0ZXJucyBhcmUgLyogYW5kIC9zaG9ydHMvOmlkLCB0aGVuIFxyXG4gICAgLy8gbWF0Y2hQYXRoRGF0YSB3b3VsZCBjb250YWluIHRoZSBQYXRoRGF0YSBmb3IgL3Nob3J0cy86aWQsIHNpbmNlIGl0cyBhIGNsb3NlciBtYXRjaCB0byB0aGUgVVJMLlxyXG4gICAgbWF0Y2hQYXRoRGF0YSE6IFBhdHRlcm5EYXRhOyBcclxuICAgIGN1cnJlbnRQYXR0ZXJuITogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKiBVcGRhdGVzIHRoZSBzdGF0ZSBvZiB0aGUgUGFnZURhdGFcclxuICAgICAqIEBwYXJhbSBiYXNlVVJMOiBUaGUgYmFzZSB1cmwgZm9yIHRoZSBwYWdlIChlZy4gd3d3LnlvdXR1YmUuY29tKVxyXG4gICAgICogQHBhcmFtIHVybDogVGhlIGZ1bGwgdXJsIG9mIHRoZSBjdXJyZW50IHBhZ2VcclxuICAgICAqIEBwYXJhbSBwYXRoczogQSBsaXN0IG9mIGFsbCB0aGUgcGF0aHMgZGVmaW5lZCBpbiBhIGNvbmZpZ1xyXG4gICAgICovXHJcbiAgICB1cGRhdGUoYmFzZVVSTDogc3RyaW5nLCB1cmw6IHN0cmluZywgcGF0aHM6IFBhdHRlcm5TZWxlY3Rvck1hcCl7XHJcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XHJcbiAgICAgICAgY29uc3QgbWF0Y2hlcyA9IHRoaXMudXBkYXRlTWF0Y2hEYXRhKGJhc2VVUkwsIHBhdGhzKTtcclxuICAgICAgICB0aGlzLnNlbGVjdG9ycyA9IHRoaXMuZ2V0U2VsZWN0b3JzKG1hdGNoZXMsIHBhdGhzKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyBgbWF0Y2hQYXRoRGF0YWAgdG8gYmUgdGhlIFBhdGhEYXRhIGZvciB0aGUgVVJMIHBhdHRlcm4gd2l0aCB0aGUgY2xvc2V0IG1hdGNoIHRvIGBiYXNlVVJMYFxyXG4gICAgICogYW5kIHJldHVybnMgYSBsaXN0IG9mIGFsbCBtYXRjaGVzLiBBZGRpdGlvbmFsbHksIGl0IHVwZGF0ZXMgd2hldGhlciB0aGUgY3VycmVudCBwYXRoXHJcbiAgICAgKiBpbmNsdWRlcyBhbiBpZC5cclxuICAgICAqIEBwYXJhbSBiYXNlVVJMOiBUaGUgYmFzZSB1cmwgZm9yIHRoZSBwYWdlIChlZy4gd3d3LnlvdXR1YmUuY29tKVxyXG4gICAgICogQHBhcmFtIHBhdHRlcm5zOiBBIGxpc3Qgb2YgYWxsIHRoZSBwYXRocyBkZWZpbmVkIGluIGEgY29uZmlnXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm5zIEEgbGlzdCBvZiBhbGwgcGF0dGVybnMgaW4gdGhlIGNvbmZpZyB0aGF0IG1hdGNoIGBiYXNlVVJMYFxyXG4gICAgICovXHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVNYXRjaERhdGEoYmFzZVVSTDogc3RyaW5nLCBwYXR0ZXJuczogUGF0dGVyblNlbGVjdG9yTWFwKTogc3RyaW5nW117XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ1cGRhdGluZyBwYWdlIGRhdGFcIik7XHJcbiAgICAgICAgbGV0IGNsb3Nlc3RNYXRjaCA9IFwiXCI7IC8vIHRoZSBwYXR0ZXJuIHRoYXQgbW9zdCBjbG9zZWx5IG1hdGNoZXMgdGhlIGN1cnJlbnQgVVJMXHJcblxyXG4gICAgICAgIC8vIEdldCBhIGxpc3Qgb2YgYWxsIHRoZSBwYXRocyB0aGF0IG1hdGNoIHRoZSBjdXJyZW50IFVSTFxyXG4gICAgICAgIGNvbnN0IG1hdGNoZXMgPSBPYmplY3Qua2V5cyhwYXR0ZXJucykuZmlsdGVyKChwYXRoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHBhdGgpO1xyXG4gICAgICAgICAgICBjb25zdCBwID0gbmV3IFVSTFBhdHRlcm4ocGF0aCwgYmFzZVVSTCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gcC50ZXN0KHRoaXMudXJsKTtcclxuICAgICAgICAgICAgLy8gQ2xvc2VzdCBtYXRjaCBpcyB0aGUgbG9uZ2VzdCBwYXR0ZXJuIHRoYXQgbWF0Y2hlcyB0aGUgY3VycmVudCBVUkxcclxuICAgICAgICAgICAgaWYgKG1hdGNoICYmIHBhdGgubGVuZ3RoID4gY2xvc2VzdE1hdGNoLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgY2xvc2VzdE1hdGNoID0gcGF0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbWF0Y2g7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFBhdHRlcm4gPSBjbG9zZXN0TWF0Y2g7XHJcblxyXG4gICAgICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vIG1hdGNoZXMgZm91bmRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB0aGlzLnVybFVzZXNJZCA9IGNsb3Nlc3RNYXRjaC5lbmRzV2l0aChcIjppZFwiKTtcclxuICAgICAgICB0aGlzLm1hdGNoUGF0aERhdGEgPSBwYXR0ZXJuc1tjbG9zZXN0TWF0Y2hdO1xyXG4gICAgICAgIHJldHVybiBtYXRjaGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIG1hdGNoZXM6IEEgbGlzdCBvZiBhbGwgbWF0Y2hpbmcgcGF0aHMgdG8gdGhlIGN1cnJlbnQgdXJsXHJcbiAgICAgKiBAcGFyYW0gcGF0aHM6IEEgbGlzdCBvZiBhbGwgdGhlIHBhdGhzIGRlZmluZWQgaW4gYSBjb25maWdcclxuICAgICAqIFxyXG4gICAgICogQHJldHVybnMgQSBsaXN0IG9mIGFsbCBzZWxlY3RvcnMgZm9yIHRoZSBtYXRjaGluZyBwYXRoc1xyXG4gICAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBnZXRTZWxlY3RvcnMobWF0Y2hlczogc3RyaW5nW10sIHBhdGhzOiBQYXR0ZXJuU2VsZWN0b3JNYXApOiBTZWxlY3Rvck5hbWVQYWlyW10ge1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRTZWxlY3RvcnMgPSBbXTtcclxuICAgICAgICBmb3IgKGNvbnN0IHBhdGggb2YgbWF0Y2hlcykge1xyXG4gICAgICAgICAgICBjb25zdCBwYXRoRGF0YSA9IHBhdGhzW3BhdGhdO1xyXG4gICAgICAgICAgICBpZiAocGF0aERhdGEuc2VsZWN0b3JzKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHBhdGhEYXRhLnNlbGVjdG9ycykge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTZWxlY3RvcnMucHVzaChzZWxlY3Rvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRTZWxlY3RvcnM7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2NvbnRlbnQudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=