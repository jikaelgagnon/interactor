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
// import tiktokConfig from './configs/tiktok_config.json';
// import linkedinConfig from './configs/linkedin_config.json';
const config_1 = __webpack_require__(/*! ./interactions/config */ "./src/interactions/config.ts");
// import { ActivityType } from "./communication/activity";
const sender_1 = __webpack_require__(/*! ./communication/sender */ "./src/communication/sender.ts");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RW5DLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUVELGlEQUFpRDtRQUNqRCxJQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM1QyxPQUFPLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFFSyxZQUFZLENBQUMsT0FBaUIsRUFBRSxLQUF5QjtRQUM3RCxNQUFNLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztRQUM1QixLQUFLLE1BQU0sSUFBSSxJQUFJLE9BQU8sRUFBRSxDQUFDO1lBQ3pCLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QixJQUFJLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDckIsS0FBSyxNQUFNLFFBQVEsSUFBSSxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQ3hDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDcEMsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQ0QsT0FBTyxnQkFBZ0IsQ0FBQztJQUM1QixDQUFDO0NBQ0o7QUE5RUQsNEJBOEVDOzs7Ozs7O1VDbEZEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbW11bmljYXRpb24vYWN0aXZpdHkudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb21tdW5pY2F0aW9uL2JhY2tncm91bmRtZXNzYWdlLnRzIiwid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvY29tbXVuaWNhdGlvbi9zZW5kZXIudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb250ZW50LnRzIiwid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvZGF0YWJhc2UvZGJkb2N1bWVudC50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2ludGVyYWN0aW9ucy9jb25maWcudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9pbnRlcmFjdGlvbnMvbW9uaXRvci50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2ludGVyYWN0aW9ucy9wYWdlZGF0YS50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2ludGVyYWN0b3Ivd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIERlZmluZXMgYSBsaXN0IG9mIHRoZSBwb3NzaWJsZSBhY3Rpdml0eSB0eXBlcyB0aGF0IGNhbiBiZSByZWNvcmRlZCBieSB0aGUgTW9uaXRvciBjbGFzc1xuICovXG5lbnVtIEFjdGl2aXR5VHlwZSB7XG4gICAgU2VsZkxvb3AgPSBcIlNlbGYtTG9vcFwiLFxuICAgIFN0YXRlQ2hhbmdlID0gXCJTdGF0ZSBDaGFuZ2VcIixcbiAgICBJbnRlcmFjdGlvbiA9IFwiSW50ZXJhY3Rpb25cIixcbiAgICBCb3RoID0gXCJCb3RoXCJcbn1cblxuZXhwb3J0IHtBY3Rpdml0eVR5cGV9IiwiaW1wb3J0IHtEQkRvY3VtZW50IH0gZnJvbSBcIi4uL2RhdGFiYXNlL2RiZG9jdW1lbnRcIjtcbmltcG9ydCB7IFNlbmRlck1ldGhvZCB9IGZyb20gXCIuL3NlbmRlclwiO1xuZXhwb3J0IHtCYWNrZ3JvdW5kTWVzc2FnZSwgTWVzc2FnZVJlc3BvbnNlfTtcbi8qKlxuICogQSBjbGFzcyB1c2VkIHRvIHNlbmQgbWVzc2FnZXMgZnJvbSB0aGUgY29udGVudCB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHQgaW4gYSBjb25zaXN0ZW50IGZvcm1hdC5cbiAqL1xuY2xhc3MgQmFja2dyb3VuZE1lc3NhZ2Uge1xuICAgIHNlbmRlck1ldGhvZDogU2VuZGVyTWV0aG9kO1xuICAgIHBheWxvYWQ6IERCRG9jdW1lbnQ7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHNlbmRlck1ldGhvZCAtIGVudW0gdHlwZSBvZiB0aGUgbWV0aG9kIHNlbmRpbmcgdGhlIG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0gcGF5bG9hZCAtIHRoZSBkYXRhIGJlaW5nIHNlbnQgdG8gdGhlIGRhdGFiYXNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKHNlbmRlck1ldGhvZDogU2VuZGVyTWV0aG9kLCBwYXlsb2FkOiBEQkRvY3VtZW50KSB7XG4gICAgICAgIHRoaXMuc2VuZGVyTWV0aG9kID0gc2VuZGVyTWV0aG9kO1xuICAgICAgICB0aGlzLnBheWxvYWQgPSBwYXlsb2FkO1xuICAgIH1cbn1cblxuaW50ZXJmYWNlIE1lc3NhZ2VSZXNwb25zZSB7XG4gIHN0YXR1czogc3RyaW5nO1xuICBoaWdobGlnaHQ/OiBib29sZWFuO1xufSIsImVudW0gU2VuZGVyTWV0aG9ke1xuICAgIEluaXRpYWxpemVTZXNzaW9uID0gXCJJbml0aWFsaXplIFNlc3Npb25cIixcbiAgICBJbnRlcmFjdGlvbkRldGVjdGlvbiA9IFwiSW50ZXJhY3Rpb24gRGV0ZWN0aW9uXCIsXG4gICAgTmF2aWdhdGlvbkRldGVjdGlvbiA9IFwiTmF2aWdhdGlvbiBEZXRlY3Rpb25cIixcbiAgICBDbG9zZVNlc3Npb24gPSBcIkNsb3NlIFNlc3Npb25cIixcbiAgICBBbnkgPSBcIkFueVwiXG59XG5leHBvcnQge1NlbmRlck1ldGhvZH07IiwiaW1wb3J0IHsgTW9uaXRvciB9IGZyb20gXCIuL2ludGVyYWN0aW9ucy9tb25pdG9yXCI7XG5pbXBvcnQgeXRDb25maWcgZnJvbSAnLi9jb25maWdzL3lvdXR1YmVfY29uZmlnLmpzb24nO1xuLy8gaW1wb3J0IHRpa3Rva0NvbmZpZyBmcm9tICcuL2NvbmZpZ3MvdGlrdG9rX2NvbmZpZy5qc29uJztcbi8vIGltcG9ydCBsaW5rZWRpbkNvbmZpZyBmcm9tICcuL2NvbmZpZ3MvbGlua2VkaW5fY29uZmlnLmpzb24nO1xuaW1wb3J0IHsgQ29uZmlnTG9hZGVyLCBFeHRyYWN0b3JEYXRhIH0gZnJvbSBcIi4vaW50ZXJhY3Rpb25zL2NvbmZpZ1wiO1xuLy8gaW1wb3J0IHsgQWN0aXZpdHlUeXBlIH0gZnJvbSBcIi4vY29tbXVuaWNhdGlvbi9hY3Rpdml0eVwiO1xuaW1wb3J0IHsgU2VuZGVyTWV0aG9kIH0gZnJvbSBcIi4vY29tbXVuaWNhdGlvbi9zZW5kZXJcIjtcblxuXG5jb25zdCBnZXRIb21lcGFnZVZpZGVvcyA9ICgpOiBvYmplY3QgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKFwiLS0tLSBFWFRSQUNUSU5HIEhPTUVQQUdFIExJTktTIC0tLVwiKTtcbiAgICBjb25zdCBjb250ZW50RGl2cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI2NvbnRlbnQueXRkLXJpY2gtaXRlbS1yZW5kZXJlcicpKVxuICAgICAgICAuZmlsdGVyKGRpdiA9PiB7XG4gICAgICAgICAgICAvLyBDaGVjayBpZiBlbGVtZW50IGlzIGFjdHVhbGx5IHZpc2libGVcbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBkaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICByZXR1cm4gcmVjdC53aWR0aCA+IDAgJiYgcmVjdC5oZWlnaHQgPiAwICYmIFxuICAgICAgICAgICAgICAgIGdldENvbXB1dGVkU3R5bGUoZGl2KS52aXNpYmlsaXR5ICE9PSAnaGlkZGVuJztcbiAgICAgICAgfSk7XG4gICAgXG4gICAgY29uc3QgdmlkZW9zID0gY29udGVudERpdnMubWFwKGNvbnRlbnREaXYgPT4ge1xuICAgICAgICAvLyBHZXQgdGhlIGRpcmVjdCBhbmNob3IgY2hpbGRcbiAgICAgICAgY29uc3QgYW5jaG9yID0gY29udGVudERpdi5xdWVyeVNlbGVjdG9yKCc6c2NvcGUgPiB5dC1sb2NrdXAtdmlldy1tb2RlbCBhJykgYXMgSFRNTEFuY2hvckVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IHNwYW4gPSBjb250ZW50RGl2LnF1ZXJ5U2VsZWN0b3IoJ2gzIGEgc3Bhbi55dC1jb3JlLWF0dHJpYnV0ZWQtc3RyaW5nJyk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGluazogYW5jaG9yPy5ocmVmID8/ICcnLFxuICAgICAgICAgICAgdGl0bGU6IHNwYW4/LnRleHRDb250ZW50Py50cmltKCkgPz8gJydcbiAgICAgICAgfTtcbiAgICB9KS5maWx0ZXIodmlkZW8gPT4gdmlkZW8ubGluayAhPT0gJycpO1xuICAgIFxuICAgIHJldHVybiB7XCJ2aWRlb3NcIjogdmlkZW9zfTtcbn07XG5cbmNvbnN0IGdldFJlY29tbWVuZGVkVmlkZW9zID0gKCk6IG9iamVjdCA9PiB7XG4gICAgY29uc29sZS5sb2coXCItLS0tIEVYVFJBQ1RJTkcgUkVDT01NRU5ERUQgTElOS1MgLS0tXCIpO1xuICAgIGNvbnN0IGNvbnRlbnREaXZzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCd5dC1sb2NrdXAtdmlldy1tb2RlbCcpKS5maWx0ZXIoZGl2ID0+IHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgZWxlbWVudCBpcyBhY3R1YWxseSB2aXNpYmxlXG4gICAgICAgIGNvbnN0IHJlY3QgPSBkaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHJldHVybiByZWN0LndpZHRoID4gMCAmJiByZWN0LmhlaWdodCA+IDAgJiYgXG4gICAgICAgICAgICBnZXRDb21wdXRlZFN0eWxlKGRpdikudmlzaWJpbGl0eSAhPT0gJ2hpZGRlbic7XG4gICAgfSk7XG4gICAgXG4gICAgY29uc3QgdmlkZW9zOiBvYmplY3QgPSBjb250ZW50RGl2cy5tYXAoY29udGVudERpdiA9PiB7XG4gICAgICAgIC8vIEdldCB0aGUgYW5jaG9yIHdpdGggdGhlIHZpZGVvIGxpbmtcbiAgICAgICAgY29uc3QgYW5jaG9yID0gY29udGVudERpdi5xdWVyeVNlbGVjdG9yKCdhW2hyZWZePVwiL3dhdGNoXCJdJykhIGFzIEhUTUxBbmNob3JFbGVtZW50O1xuICAgICAgICBjb25zdCBzcGFuID0gY29udGVudERpdi5xdWVyeVNlbGVjdG9yKCdoMyBhIHNwYW4ueXQtY29yZS1hdHRyaWJ1dGVkLXN0cmluZycpITtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsaW5rOiBhbmNob3I/LmhyZWYgPz8gJycsXG4gICAgICAgICAgICB0aXRsZTogc3Bhbj8udGV4dENvbnRlbnQ/LnRyaW0oKSA/PyAnJ1xuICAgICAgICB9O1xuICAgIH0pLmZpbHRlcih2aWRlbyA9PiB2aWRlby5saW5rICE9PSAnJyk7XG4gICAgXG4gICAgLy8gY29uc29sZS5sb2coXCJQcmludGluZyB0aGUgZmlyc3QgNSB2aWRlb3NcIik7XG4gICAgLy8gY29uc29sZS50YWJsZSh2aWRlb3Muc2xpY2UoMCw1KSk7XG4gICAgcmV0dXJuIHtcInZpZGVvc1wiOiB2aWRlb3N9O1xufTtcblxuY29uc3QgZXh0cmFjdG9ycyA9IFtuZXcgRXh0cmFjdG9yRGF0YShTZW5kZXJNZXRob2QuSW50ZXJhY3Rpb25EZXRlY3Rpb24sIFwiL1wiLCBnZXRIb21lcGFnZVZpZGVvcyksIFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEV4dHJhY3RvckRhdGEoU2VuZGVyTWV0aG9kLkludGVyYWN0aW9uRGV0ZWN0aW9uLCBcIi93YXRjaD92PSpcIiwgZ2V0UmVjb21tZW5kZWRWaWRlb3MpXVxuXG5jb25zdCB5dENvbmZpZ0xvYWRlciA9IG5ldyBDb25maWdMb2FkZXIoeXRDb25maWcsIGV4dHJhY3RvcnMpO1xuXG5uZXcgTW9uaXRvcih5dENvbmZpZ0xvYWRlcik7XG5cbi8vIGNvbnN0IHRpa3Rva0lEU2VsZWN0b3IgPSAoKTogb2JqZWN0ID0+IHtcbi8vICAgICBsZXQgdmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi54Z3BsYXllci1jb250YWluZXIudGlrdG9rLXdlYi1wbGF5ZXJcIik7XG4vLyAgICAgaWYgKCF2aWQpe1xuLy8gICAgICAgICBjb25zb2xlLmxvZyhcIm5vIHVybCBmb3VuZCFcIik7XG4vLyAgICAgICAgIHJldHVybiB7fTtcbi8vICAgICB9XG4vLyAgICAgbGV0IGlkID0gdmlkLmlkLnNwbGl0KFwiLVwiKS5hdCgtMSk7XG4vLyAgICAgbGV0IHVybCA9IGBodHRwczovL3Rpa3Rvay5jb20vc2hhcmUvdmlkZW8vJHtpZH1gO1xuLy8gICAgIHJldHVybiB7XG4vLyAgICAgICAgIFwidW5pcXVlVVJMXCI6IHVybFxuLy8gICAgIH07XG4vLyB9XG5cblxuXG4vLyBjb25zb2xlLmxvZyh0aWt0b2tDb25maWcpO1xuLy8gY29uc3QgdGlrdG9rQ29uZmlnTG9hZGVyID0gbmV3IENvbmZpZ0xvYWRlcih0aWt0b2tDb25maWcpO1xuLy8gdGlrdG9rQ29uZmlnTG9hZGVyLmluamVjdEV4dHJhY3RvcihcIi8qXCIsIHRpa3Rva0lEU2VsZWN0b3IpO1xuLy8gY29uc3QgdGlrdG9rSW50ZXJhY3RvciA9IG5ldyBNb25pdG9yKHRpa3Rva0NvbmZpZ0xvYWRlci5jb25maWcpO1xuXG4vLyAvLyBjb25zb2xlLmxvZyh0aWt0b2tDb25maWcpO1xuLy8gY29uc3QgbGlua2VkaW5Db25maWdMb2FkZXIgPSBuZXcgQ29uZmlnTG9hZGVyKGxpbmtlZGluQ29uZmlnKTtcbi8vIGNvbnN0IGxpbmtlZGluSW50ZXJhY3RvciA9IG5ldyBNb25pdG9yKGxpbmtlZGluQ29uZmlnTG9hZGVyLmNvbmZpZyk7IiwiaW1wb3J0IHsgQWN0aXZpdHlUeXBlIH0gZnJvbSBcIi4uL2NvbW11bmljYXRpb24vYWN0aXZpdHlcIjtcclxuLyoqXHJcbiAqIEEgY2xhc3MgZGVmaW5pbmcgZG9jdW1lbnRzIHRoYXQgYXJlIHNlbnQgdG8gdGhlIGRhdGFiYXNlIGZyb20gdGhlIGNvbnRlbnQgc2NyaXB0XHJcbiAqL1xyXG5jbGFzcyBEQkRvY3VtZW50IHtcclxuICAgIC8vIFVSTCBhdCB3aGljaHQgdGhlIGV2ZW50IHdhcyBjcmVhdGVkXHJcbiAgICBzb3VyY2VVUkw6IHN0cmluZztcclxuICAgIHNvdXJjZURvY3VtZW50VGl0bGU6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgdGl0bGU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc291cmNlVVJMID0gdXJsO1xyXG4gICAgICAgIHRoaXMuc291cmNlRG9jdW1lbnRUaXRsZSA9IHRpdGxlO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQSBjaGlsZCBvZiBEQkRvY3VtZW50IHRoYXQgcmVwcmVzZW50cyBhY3Rpdml0aWVzXHJcbiAqL1xyXG5cclxuY2xhc3MgQWN0aXZpdHlEb2N1bWVudCBleHRlbmRzIERCRG9jdW1lbnR7XHJcbiAgICAvLyBUaGUgdHlwZSBvZiBhY3Rpdml0eSBiZWluZyBsb2dnZWQuIEVpdGhlciBcInN0YXRlX2NoYWdlXCIsIFwic2VsZl9sb29wXCIsIG9yIFwiaW50ZXJhY3Rpb25cIlxyXG4gICAgYWN0aXZpdHlUeXBlOiBBY3Rpdml0eVR5cGUgfCBzdHJpbmc7XHJcbiAgICAvLyBUaW1lc3RhbXAgZm9yIHdoZW4gdGhlIGRvY3VtZW50IHdhcyBjcmVhdGVkXHJcbiAgICBjcmVhdGVkQXQ6IERhdGUgfCBzdHJpbmc7XHJcbiAgICAvLyBFdmVudCB0eXBlIChlZy4gY2xpY2ssIHNjcm9sbCwgZXRjLi4uKVxyXG4gICAgZXZlbnRUeXBlOiBzdHJpbmdcclxuICAgIC8vIE1ldGFkYXRhIGFib3V0IHRoZSBldmVudFxyXG4gICAgbWV0YWRhdGE/OiBvYmplY3Q7XHJcbiAgICBjb25zdHJ1Y3Rvcih0eXBlOiBBY3Rpdml0eVR5cGUsIGV2ZW50OiBFdmVudCwgbWV0YWRhdGE6IG9iamVjdCwgdXJsOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcih1cmwsIHRpdGxlKTtcclxuICAgICAgICB0aGlzLmFjdGl2aXR5VHlwZSA9IHR5cGU7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVkQXQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRUeXBlID0gZXZlbnQudHlwZVxyXG4gICAgICAgIHRoaXMubWV0YWRhdGEgPSBtZXRhZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgY2hpbGQgb2YgREJEb2N1bWVudCB0aGF0IHJlcHJlc2VudHMgdGhlIHN0YXJ0IG9mIGEgc2Vzc2lvblxyXG4gKi9cclxuXHJcbmNsYXNzIFNlc3Npb25Eb2N1bWVudCBleHRlbmRzIERCRG9jdW1lbnR7XHJcbiAgICBzdGFydFRpbWU6IERhdGU7XHJcbiAgICBlbmRUaW1lPzogRGF0ZTtcclxuICAgIGVtYWlsID0gXCJFbWFpbCBub3Qgc2V0XCI7XHJcbiAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgdGl0bGU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKHVybCwgdGl0bGUpO1xyXG4gICAgICAgIHRoaXMuc3RhcnRUaW1lID0gbmV3IERhdGUoKTtcclxuICAgIH1cclxuICAgIHNldEVtYWlsKGVtYWlsOiBzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuZW1haWwgPSBlbWFpbDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtEQkRvY3VtZW50LCBBY3Rpdml0eURvY3VtZW50LCBTZXNzaW9uRG9jdW1lbnR9OyIsImltcG9ydCB7IFNlbmRlck1ldGhvZCB9IGZyb20gXCIuLi9jb21tdW5pY2F0aW9uL3NlbmRlclwiO1xuXG5leHBvcnQge1NlbGVjdG9yTmFtZVBhaXIsIENvbmZpZywgQ29uZmlnTG9hZGVyLCBQYXR0ZXJuRGF0YSwgUGF0dGVyblNlbGVjdG9yTWFwLCBFeHRyYWN0b3JEYXRhLCBFeHRyYWN0b3JMaXN0fTtcblxuaW50ZXJmYWNlIFNlbGVjdG9yTmFtZVBhaXJ7XG4gICAgLyoqXG4gICAgICogQW4gaW50ZXJmYWNlIHRvIG1hcCBDU1Mgc2VsZWN0b3JzIHRvIGh1bWFuIHJlYWRhYmxlIG5hbWVzXG4gICAgICovXG4gICAgLy8gVGhlIENTUyBzZWxlY3RvclxuICAgIHNlbGVjdG9yOiBzdHJpbmc7XG4gICAgLy8gVGhlIGh1bWFuIHJlYWRhYmxlIG5hbWUgZm9yIHRoZSBDU1Mgc2VsZWN0b3JcbiAgICBuYW1lOiBzdHJpbmc7XG59XG5cbnR5cGUgUGF0dGVyblNlbGVjdG9yTWFwID0gUmVjb3JkPHN0cmluZywgUGF0dGVybkRhdGE+O1xuXG5pbnRlcmZhY2UgUGF0dGVybkRhdGEge1xuICAgIC8qKlxuICAgICAqIEFuIGludGVyZmFjZSB0byBidW5kbGUgdG9nZXRoZXIgZGF0YSBpbiB0aGUgQ29uZmlnIGZvciBhIGdpdmVuIHBhdGggcGF0dGVybi5cbiAgICAgKiBJdCBjb250YWlucyBhIGxpc3Qgb2YgQ1NTIHNlbGVjdG9ycyBmb3IgdGhlIHBhdGggcGF0dGVybiBhbmQgb3B0aW9uYWxseVxuICAgICAqIGFuIGlkU2VsZWN0b3IgZnVuY3Rpb24gdGhhdCBleHRyYWN0cyBhbiBJRCBmcm9tIHBhZ2VzIHdpdGggdGhlIGNvcnJlc3BvbmRpbmcgVVJMXG4gICAgICovXG4gICAgLy8gQSBsaXN0IG9mIHNlbGVjdG9ycyBhbmQgbmFtZXMgZm9yIHRoZSBwYWdlXG4gICAgc2VsZWN0b3JzPzogU2VsZWN0b3JOYW1lUGFpcltdO1xuICAgIC8vIEEgZnVuY3Rpb24gdGhhdCBleHRyYWN0cyBtZXRhZGF0YSBmcm9tIHRoZSBwYWdlXG4gICAgZGF0YUV4dHJhY3Rvcj86ICgpID0+IG9iamVjdDtcbn1cblxuaW50ZXJmYWNlIENvbmZpZyB7XG4gICAgLyoqXG4gICAgICogQW4gaW50ZXJmYWNlIHRoYXQgY29udGFpbnMgYWxsIHRoZSBkYXRhIHJlcXVpcmVkIHRvIGluc3RhbnRpYXRlIGEgTW9uaXRvci5cbiAgICAgKi9cbiAgICAvLyBUaGUgYmFzZSBVUkwgdGhhdCB0aGUgbW9uaXRvciBzaG91bGQgc3RhcnQgYXRcbiAgICBiYXNlVVJMOiBzdHJpbmc7XG4gICAgLy8gQSBtYXBwaW5nIG9mIFVSTCBwYXR0ZXJucyB0byBwYXRoIGRhdGEuIFRoZSBVUkwgUGF0dGVybiBzaG91bGQgZm9sbG93IHRoZSBcbiAgICAvLyBVUkwgUGF0dGVybiBBUEkgc3ludGF4LiBUaGVzZSBhcmUgYXBwZW5kZWQgdG8gdGhlIGJhc2VVUkwgd2hlbiBjaGVja2luZyBmb3IgbWF0Y2hlc1xuICAgIC8vIEV4OiBiYXNlVVJMOiB3d3cueW91dHViZS5jb20sIHBhdGg6IC9zaG9ydHMvOmlkIC0+IHd3dy55b3V0dWJlLmNvbS9zaG9ydHMvOmlkXG4gICAgcGF0aHM6IFBhdHRlcm5TZWxlY3Rvck1hcDtcbiAgICAvLyBJbmRpY2F0ZXMgd2hldGhlciB0aGUgTW9uaXRvciBzaG91bGQgYmUgaW4gZGVidWcgbW9kZS4gSWYgdHJ1ZSwgYWRkIGNvbG91cmVkIGJveGVzXG4gICAgLy8gYXJvdW5kIHNlbGVjdGVkIEhUTUwgZWxlbWVudHNcbiAgICBkZWJ1Zz86IGJvb2xlYW47XG4gICAgLy8gQSBsaXN0IG9mIGV2ZW50IHR5cGVzIHRvIG1vbml0b3IuIEJ5IGRlZmF1bHQsIHRoaXMgaXMganVzdCBbXCJjbGlja1wiXVxuICAgIGV2ZW50cz86IHN0cmluZ1tdO1xufVxuXG5jbGFzcyBFeHRyYWN0b3JEYXRhIHtcbiAgICBldmVudFR5cGU6IFNlbmRlck1ldGhvZDtcbiAgICB1cmxQYXR0ZXJuOiBzdHJpbmc7XG4gICAgZXh0cmFjdG9yOiAoKSA9PiBvYmplY3Q7XG4gICAgY29uc3RydWN0b3IoYWN0aXZpdHlUeXBlOiBTZW5kZXJNZXRob2QsIHVybFBhdHRlcm46IHN0cmluZywgZXh0cmFjdG9yOiAoKSA9PiBvYmplY3Qpe1xuICAgICAgICB0aGlzLmV2ZW50VHlwZSA9IGFjdGl2aXR5VHlwZTtcbiAgICAgICAgdGhpcy51cmxQYXR0ZXJuID0gdXJsUGF0dGVybjtcbiAgICAgICAgdGhpcy5leHRyYWN0b3IgPSBleHRyYWN0b3I7XG4gICAgfVxufVxuXG5jbGFzcyBFeHRyYWN0b3JMaXN0IHtcbiAgICBwcml2YXRlIGV4dHJhY3RvcnM6IEV4dHJhY3RvckRhdGFbXTtcbiAgICBwcml2YXRlIGJhc2VVUkw6IHN0cmluZztcbiAgICBjb25zdHJ1Y3RvcihleHRyYWN0b3JzOiBFeHRyYWN0b3JEYXRhW10gPSBbXSwgYmFzZVVSTDogc3RyaW5nKXtcbiAgICAgICAgdGhpcy5leHRyYWN0b3JzID0gZXh0cmFjdG9ycztcbiAgICAgICAgdGhpcy5iYXNlVVJMID0gYmFzZVVSTDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZXh0cmFjdChjdXJyZW50VVJMOiBzdHJpbmcsIGV2ZW50VHlwZTogU2VuZGVyTWV0aG9kKXtcbiAgICAgICAgY29uc29sZS5sb2coYEF0dGVtcHRpbmcgZXh0cmFjdGlvbiBmb3IgdXJsOiAke2N1cnJlbnRVUkx9IGFuZCBldmVudCB0eXBlICR7ZXZlbnRUeXBlfWApO1xuICAgICAgICBsZXQgZXh0cmFjdGVkRGF0YTogb2JqZWN0ID0ge307XG4gICAgICAgIHRoaXMuZXh0cmFjdG9ycy5maWx0ZXIoZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNDb3JyZWN0QWN0aXZpdHkgPSAoZS5ldmVudFR5cGUgPT0gZXZlbnRUeXBlIHx8IGUuZXZlbnRUeXBlID09IFNlbmRlck1ldGhvZC5BbnkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBuZXcgVVJMUGF0dGVybihlLnVybFBhdHRlcm4sIHRoaXMuYmFzZVVSTCk7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNVUkxNYXRjaCA9IHAudGVzdChjdXJyZW50VVJMKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXNDb3JyZWN0QWN0aXZpdHkgJiYgaXNVUkxNYXRjaDtcbiAgICAgICAgICAgIH0pLmZvckVhY2goZSA9PlxuICAgICAgICAgICAgICAgIGV4dHJhY3RlZERhdGEgPSB7Li4uIGV4dHJhY3RlZERhdGEsIC4uLiBlLmV4dHJhY3RvcigpfVxuICAgICAgICAgICAgKVxuICAgICAgICByZXR1cm4gZXh0cmFjdGVkRGF0YTtcbiAgICB9XG59XG5cbmNsYXNzIENvbmZpZ0xvYWRlciB7XG4gICAgcHVibGljIGNvbmZpZzogQ29uZmlnO1xuICAgIHB1YmxpYyBleHRyYWN0b3JMaXN0OiBFeHRyYWN0b3JMaXN0O1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlnOiBDb25maWcsIGV4dHJhY3Rvckxpc3Q6IEV4dHJhY3RvckRhdGFbXSA9IFtdKXtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgICAgIHRoaXMuZXh0cmFjdG9yTGlzdCA9IG5ldyBFeHRyYWN0b3JMaXN0KGV4dHJhY3Rvckxpc3QsIGNvbmZpZy5iYXNlVVJMKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBCYWNrZ3JvdW5kTWVzc2FnZSwgTWVzc2FnZVJlc3BvbnNlfSBmcm9tIFwiLi4vY29tbXVuaWNhdGlvbi9iYWNrZ3JvdW5kbWVzc2FnZVwiO1xyXG5pbXBvcnQge0RCRG9jdW1lbnQsIEFjdGl2aXR5RG9jdW1lbnQsIFNlc3Npb25Eb2N1bWVudH0gZnJvbSBcIi4uL2RhdGFiYXNlL2RiZG9jdW1lbnRcIjtcclxuaW1wb3J0IHtDb25maWdMb2FkZXIsIEV4dHJhY3Rvckxpc3QsIFBhdHRlcm5TZWxlY3Rvck1hcH0gZnJvbSBcIi4vY29uZmlnXCI7XHJcbmltcG9ydCB7IFBhZ2VEYXRhIH0gZnJvbSBcIi4vcGFnZWRhdGFcIjtcclxuaW1wb3J0IHsgQWN0aXZpdHlUeXBlIH0gZnJvbSBcIi4uL2NvbW11bmljYXRpb24vYWN0aXZpdHlcIjtcclxuaW1wb3J0IHtTZW5kZXJNZXRob2R9IGZyb20gXCIuLi9jb21tdW5pY2F0aW9uL3NlbmRlclwiXHJcblxyXG4vKipcclxuICogVGhpcyBjbGFzcyByZWFkcyBmcm9tIGEgcHJvdmlkZWQgQ29uZmlnIG9iamVjdCBhbmQgYXR0YWNoZXMgbGlzdGVuZXJzIHRvIHRoZSBlbGVtZW50cyBzcGVjaWZpZWQgaW4gdGhlIHNlbGVjdG9ycy5cclxuICogV2hlbiB0aGVzZSBlbGVtZW50cyBhcmUgaW50ZXJhY3RlZCB3aXRoLCBvciB3aGVuIGEgbmF2aWdhdGlvbiBvY2N1cnMsIGEgZG9jdW1lbnQgaXMgc2VudCB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHRcclxuICogdG8gYmUgYXBwZW5kZWQgdG8gdGhlIGRhdGFiYXNlLiBUaGlzIGNsYXNzIGlzIGluc3RhbnRpYXRlZCBpbiBjb250ZW50LnRzLlxyXG4gKiBcclxuICogQHBhcmFtIGludGVyYWN0aW9uRXZlbnRzIC0gQSBsaXN0IG9mIHRoZSB0eXBlIG9mIGV2ZW50cyB3ZSB3YW50IHRvIG1vbml0b3IgYXMgaW50ZXJhY3Rpb25zIChlZy4gY2xpY2ssIHNjcm9sbCwgZXRjLikuIERlZmF1bHQgaXMgY2xpY2tcclxuICogQHBhcmFtIGRlYnVnIC0gSWYgdHJ1ZSwgaGlnaGxpZ2h0IGFsbCBzZWxlY3RlZCBIVE1MIGVsZW1lbnRzIHdpdGggY29sb3VyZWQgYm94ZXNcclxuICogQHBhcmFtIHBhdGhzIC0gQW4gb2JqZWN0IG1hcHBpbmcgcGF0aCBwYXR0ZXJucyB0byB0aGVpciBjb3JyZXNwb25kaW5nIENTUyBzZWxlY3RvcnMgUGF0aCBwYXR0ZXJucyBhcmUgY29uc2lzdGVudCB3aXRoIHRoZSAgVVJMIFBhdHRlcm4gQVBJIFN5bnRheDogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1VSTF9QYXR0ZXJuX0FQSVxyXG4gKiBAcGFyYW0gYmFzZVVSTCAtIEJhc2UgdXJsIGZvciB0aGUgcGFnZSAoZWcuIHd3dy55b3V0dWJlLmNvbSkuIEFsbCBwYXRocyBhcmUgYXBwZW5kZWQgdG8gdGhpcyB3aGVuIG1hdGNoaW5nIFVSbHNcclxuICogQHBhcmFtIGN1cnJlbnRQYWdlRGF0YSAtIENvbnRhaW5zIGRhdGEgcmVsZXZhbnQgdG8gdGhlIGN1cnJlbnQgcGFnZS5cclxuICogQHBhcmFtIGludGVyYWN0aW9uQXR0cmlidXRlIC0gQXR0cmlidXRlIGFkZGVkIHRvIGFsbCBlbGVtZW50cyBiZWluZyBtb25pdG9yZWRcclxuICovXHJcbmV4cG9ydCBjbGFzcyBNb25pdG9yIHtcclxuICAgIC8vIEEgbGlzdCBvZiB0aGUgdHlwZSBvZiBldmVudHMgd2Ugd2FudCB0byBtb25pdG9yIGFzIGludGVyYWN0aW9ucyAoZWcuIGNsaWNrLCBzY3JvbGwsIGV0Yy4pLiBEZWZhdWx0IGlzIGNsaWNrXHJcbiAgICBpbnRlcmFjdGlvbkV2ZW50czogc3RyaW5nW107XHJcbiAgICAvLyBJZiB0cnVlLCBoaWdobGlnaHQgYWxsIHNlbGVjdGVkIEhUTUwgZWxlbWVudHMgd2l0aCBjb2xvdXJlZCBib3hlc1xyXG4gICAgaGlnaGxpZ2h0OiBib29sZWFuO1xyXG4gICAgLy8gQW4gb2JqZWN0IG1hcHBpbmcgcGF0aCBwYXR0ZXJucyB0byB0aGVpciBjb3JyZXNwb25kaW5nIENTUyBzZWxlY3RvcnNcclxuICAgIC8vIFBhdGggcGF0dGVybnMgYXJlIGNvbnNpc3RlbnQgd2l0aCB0aGUgVVJMIFBhdHRlcm4gQVBJIFN5bnRheDogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1VSTF9QYXR0ZXJuX0FQSVxyXG4gICAgcGF0aHM6IFBhdHRlcm5TZWxlY3Rvck1hcDtcclxuICAgIC8vIEJhc2UgdXJsIGZvciB0aGUgcGFnZSAoZWcuIHd3dy55b3V0dWJlLmNvbSkuIEFsbCBwYXRocyBhcmUgYXBwZW5kZWQgdG8gdGhpcyB3aGVuIG1hdGNoaW5nIFVSbHNcclxuICAgIGJhc2VVUkw6IHN0cmluZztcclxuICAgIC8vIENvbnRhaW5zIGRhdGEgcmVsZXZhbnQgdG8gdGhlIGN1cnJlbnQgcGFnZS5cclxuICAgIGN1cnJlbnRQYWdlRGF0YTogUGFnZURhdGE7XHJcbiAgICAvLyBBdHRyaWJ1dGUgYWRkZWQgdG8gYWxsIGVsZW1lbnRzIGJlaW5nIG1vbml0b3JlZFxyXG4gICAgaW50ZXJhY3Rpb25BdHRyaWJ1dGU6IHN0cmluZztcclxuXHJcbiAgICBleHRyYWN0b3JMaXN0OiBFeHRyYWN0b3JMaXN0O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZ0xvYWRlcjogQ29uZmlnTG9hZGVyKSB7XHJcbiAgICAgICAgY29uc3QgY29uZmlnID0gY29uZmlnTG9hZGVyLmNvbmZpZztcclxuICAgICAgICB0aGlzLmludGVyYWN0aW9uRXZlbnRzID0gY29uZmlnLmV2ZW50cyA/PyBbJ2NsaWNrJ107XHJcbiAgICAgICAgdGhpcy5oaWdobGlnaHQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucGF0aHMgPSBjb25maWcucGF0aHM7XHJcbiAgICAgICAgdGhpcy5iYXNlVVJMID0gY29uZmlnLmJhc2VVUkw7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGFnZURhdGEgPSBuZXcgUGFnZURhdGEoKTtcclxuICAgICAgICB0aGlzLmludGVyYWN0aW9uQXR0cmlidXRlID0gXCJtb25pdG9yaW5nLWludGVyYWN0aW9uc1wiXHJcbiAgICAgICAgdGhpcy5leHRyYWN0b3JMaXN0ID0gY29uZmlnTG9hZGVyLmV4dHJhY3Rvckxpc3Q7IFxyXG5cclxuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLm9yaWdpbiA9PT0gdGhpcy5iYXNlVVJMKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJ1bldoZW5WaXNpYmxlID0gKCkgPT4geyAgLy8gUmVtb3ZlIGFzeW5jIGhlcmVcclxuICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09ICd2aXNpYmxlJykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFdyYXAgdGhlIGFzeW5jIGNhbGwgYW5kIGhhbmRsZSBlcnJvcnNcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxpemVNb25pdG9yKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIHJ1bldoZW5WaXNpYmxlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGluaXRpYWxpemluZyBtb25pdG9yOicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN0aWxsIHJlbW92ZSBsaXN0ZW5lciBldmVuIGlmIHRoZXJlJ3MgYW4gZXJyb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCBydW5XaGVuVmlzaWJsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcclxuICAgICAgICAgICAgICAgIHJ1bldoZW5WaXNpYmxlKCk7IC8vIFRoaXMgd2lsbCBub3cgYmUgc3luY2hyb25vdXNcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4geyAgLy8gUmVtb3ZlIGFzeW5jIGhlcmVcclxuICAgICAgICAgICAgICAgICAgICBydW5XaGVuVmlzaWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCBydW5XaGVuVmlzaWJsZSk7XHJcbiAgICAgICAgfSAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgbW9uaXRvciBpZiBiYXNlIFVSTCBtYXRjaGVzIHRoZSBjdXJyZW50IFVSTFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFzeW5jIGluaXRpYWxpemVNb25pdG9yKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW5pdGlhbGl6aW5nIG1vbml0b3JcIik7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDdXJyZW50UGFnZURhdGEoZG9jdW1lbnQubG9jYXRpb24uaHJlZik7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gQ3JlYXRlcyBhIG5ldyBlbnRyeSBpbiB0aGUgREIgZGVzY3JpYmluZyB0aGUgc3RhdGUgYXQgdGhlIHN0YXJ0IG9mIHRoZSBzZXNzaW9uXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuaW5pdGlhbGl6ZVNlc3Npb24oKTtcclxuICAgICAgICAgICAgLy8gQmluZHMgbGlzdGVuZXJzIHRvIHRoZSBIVE1MIGVsZW1lbnRzIHNwZWNpZmllZCBpbiB0aGUgY29uZmlnIGZvciBhbGwgbWF0Y2hpbmcgcGF0aCBwYXR0ZXJuc1xyXG4gICAgICAgICAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBpbml0aWFsaXplIHNlc3Npb246XCIsIGVycik7XHJcbiAgICAgICAgfVxyXG59XHJcbiAgICAvKipcclxuICAgKiBVcGRhdGVzIHRoZSBwYWdlIGRhdGEgd2hlbmV2ZXIgYSBuZXcgcGFnZSBpcyBkZXRlY3RlZFxyXG4gICAqIEBwYXJhbSB1cmwgLSB0aGUgdXJsIG9mIHRoZSBuZXcgcGFnZVxyXG4gICAqL1xyXG4gICAgcHJpdmF0ZSB1cGRhdGVDdXJyZW50UGFnZURhdGEodXJsOiBzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLnVwZGF0ZSh0aGlzLmJhc2VVUkwsIHVybCwgdGhpcy5wYXRocyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIG5ldyBlbnRyeSBpbiB0aGUgREIgZGVzY3JpYmluZyB0aGUgc3RhdGUgYXQgdGhlIHN0YXJ0IG9mIHRoZSBzZXNzaW9uXHJcbiAgICovXHJcbiAgICBwcml2YXRlIGFzeW5jIGluaXRpYWxpemVTZXNzaW9uKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRTdGF0ZSA9IG5ldyBTZXNzaW9uRG9jdW1lbnQodGhpcy5jdXJyZW50UGFnZURhdGEudXJsLCBkb2N1bWVudC50aXRsZSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJDaGVja2luZyBoaWdobGlnaHRcIik7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnNlbmRNZXNzYWdlVG9CYWNrZ3JvdW5kKFNlbmRlck1ldGhvZC5Jbml0aWFsaXplU2Vzc2lvbiwgY3VycmVudFN0YXRlKTtcclxuICAgICAgICBpZiAocmVzcG9uc2U/LnN0YXR1cyA9PT0gXCJTZXNzaW9uIGluaXRpYWxpemVkXCIgJiYgcmVzcG9uc2UuaGlnaGxpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0ID0gcmVzcG9uc2UuaGlnaGxpZ2h0OyAvLyBUeXBlU2NyaXB0IGtub3dzIGhpZ2hsaWdodCBleGlzdHMgaGVyZVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyhgSGlnaGxpZ2h0IGlzIHNldCB0byAke3RoaXMuaGlnaGxpZ2h0fWApXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogQmluZHMgZXZlbnQgbGlzdGVuZXJzIGZvciBtdXRhdGlvbnMgYW5kIG5hdmlnYXRpb25cclxuICAgKi9cclxuXHJcbiAgICBwcml2YXRlIGJpbmRFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgLy8gV2hlbmV2ZXIgbmV3IGNvbnRlbnQgaXMgbG9hZGVkLCBhdHRhY2ggb2JzZXJ2ZXJzIHRvIGVhY2ggSFRNTCBlbGVtZW50IHRoYXQgbWF0Y2hlcyB0aGUgc2VsZWN0b3JzIGluIHRoZSBjb25maWdzXHJcbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB0aGlzLmFkZExpc3RlbmVyc1RvTmV3TWF0Y2hlcygpKTtcclxuICAgICAgICAvLyBNYWtlIHRoZSBtdXRhdGlvbiBvYnNlcnZlciBvYnNlcnZlIHRoZSBlbnRpcmUgZG9jdW1lbnQgZm9yIGNoYW5nZXNcclxuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHtcclxuICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxyXG4gICAgICAgICAgICBzdWJ0cmVlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBhbiBldmVudCBsaXN0ZW5lciB0byBkZXRlY3QgbmF2aWdhdGlvbnMgb24gdGhlIHBhZ2VcclxuICAgICAgICBuYXZpZ2F0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJuYXZpZ2F0ZVwiLCAoZTogTmF2aWdhdGlvbkV2ZW50KSA9PiB0aGlzLm9uTmF2aWdhdGlvbkRldGVjdGlvbihlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogQWRkcyBsaXN0ZW5lcnMgdG8gbXV0YXRpb25zIChpZS4gbmV3bHkgcmVuZGVyZWQgZWxlbWVudHMpIGFuZCBtYXJrcyB0aGVtIHdpdGggdGhpcy5pbnRlcmFjdHRpb25BdHRyaWJ1dGUuXHJcbiAgICogSWYgZGVidWcgbW9kZSBpcyBvbiwgdGhpcyB3aWxsIGFkZCBhIGNvbG91cmZ1bCBib3JkZXIgdG8gdGhlc2UgZWxlbWVudHMuXHJcbiAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBhZGRMaXN0ZW5lcnNUb05ld01hdGNoZXMoKTogdm9pZCB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJhZGRpbmcgc2VsZWN0b3JzXCIpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBWYWx1ZSBvZiBoaWdobGlnaHQ6ICR7dGhpcy5oaWdobGlnaHR9YCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJDdXJyZW50IHBhZ2UgZGF0YTpcIik7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5jdXJyZW50UGFnZURhdGEpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLnNlbGVjdG9ycy5mb3JFYWNoKGludGVyYWN0aW9uID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGA6aXMoJHtpbnRlcmFjdGlvbi5zZWxlY3Rvcn0pOm5vdChbJHt0aGlzLmludGVyYWN0aW9uQXR0cmlidXRlfV0pYCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBpbnRlcmFjdGlvbi5uYW1lO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgZWxlbWVudHMpe1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGlnaGxpZ2h0KSAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkuc3R5bGUuYm9yZGVyID0gYDJweCBzb2xpZCAke3RoaXMuU3RyaW5nVG9Db2xvci5uZXh0KG5hbWUpfWA7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSh0aGlzLmludGVyYWN0aW9uQXR0cmlidXRlLCAndHJ1ZScpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaWUgb2YgdGhpcy5pbnRlcmFjdGlvbkV2ZW50cykge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihpZSwgKGU6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25JbnRlcmFjdGlvbkRldGVjdGlvbihlbGVtZW50LCBlLCBuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIFNlbmRzIGEgbWVzc2FnZSB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHQuXHJcbiAgICogQHBhcmFtIGV2ZW50IC0gdGhlIEhUTUwgZXZlbnQgdGhhdCBvY2N1cmVkXHJcbiAgICogQHJldHVybnMgQSBkb2N1bWVudCBkZXNjcmliaW5nIHRoZSBzdGF0ZSBjaGFuZ2VcclxuICAgKi9cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVN0YXRlQ2hhbmdlUmVjb3JkKGV2ZW50OiBFdmVudCk6IERCRG9jdW1lbnQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGV0ZWN0ZWQgc3RhdGUgY2hhbmdlIGV2ZW50XCIpO1xyXG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gdGhpcy5leHRyYWN0b3JMaXN0LmV4dHJhY3QodGhpcy5jdXJyZW50UGFnZURhdGEudXJsLCBTZW5kZXJNZXRob2QuTmF2aWdhdGlvbkRldGVjdGlvbik7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJwcmludGluZyBtZXRhZGF0YVwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhtZXRhZGF0YSk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgQWN0aXZpdHlEb2N1bWVudChBY3Rpdml0eVR5cGUuU3RhdGVDaGFuZ2UsIGV2ZW50LCBtZXRhZGF0YSwgdGhpcy5jdXJyZW50UGFnZURhdGEudXJsLCBkb2N1bWVudC50aXRsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogU2VuZHMgYSBtZXNzYWdlIHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdC5cclxuICAgKiBAcGFyYW0gZXZlbnQgLSB0aGUgSFRNTCBldmVudCB0aGF0IG9jY3VyZWRcclxuICAgKiBAcGFyYW0gdXJsQ2hhbmdlIC0gaW5kaWNhdGVzIHdoZXRoZXIgdGhlIHNlbGYtbG9vcCByZXN1bHRlZCBpbiBhIHVybCBjaGFuZ2VcclxuICAgKiBcclxuICAgKiBAcmV0dXJucyBBIGRvY3VtZW50IGRlc2NyaWJpbmcgc2VsZiBsb29wXHJcbiAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTZWxmTG9vcFJlY29yZChldmVudDogRXZlbnQpOiBEQkRvY3VtZW50IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkRldGVjdGVkIHNlbGYgbG9vcCBjaGFuZ2UgZXZlbnRcIik7XHJcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSB0aGlzLmV4dHJhY3Rvckxpc3QuZXh0cmFjdCh0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmwsIFNlbmRlck1ldGhvZC5OYXZpZ2F0aW9uRGV0ZWN0aW9uKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInByaW50aW5nIG1ldGFkYXRhXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG1ldGFkYXRhKTtcclxuICAgICAgICByZXR1cm4gbmV3IEFjdGl2aXR5RG9jdW1lbnQoQWN0aXZpdHlUeXBlLlNlbGZMb29wLCBldmVudCwgbWV0YWRhdGEsIHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCwgZG9jdW1lbnQudGl0bGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIFNlbmRzIGEgbWVzc2FnZSB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHQuXHJcbiAgICogQHBhcmFtIGVsZW1lbnQgLSB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJlZCB0aGUgZXZlbnRcclxuICAgKiBAcGFyYW0gbmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBlbGVtZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBjYWxsYmFjayAoYXMgZGVmaW5lZCBpbiB0aGUgY29uZmlnKVxyXG4gICAqIEBwYXJhbSBldmVudCAtIHRoZSBIVE1MIGV2ZW50IHRoYXQgb2NjdXJlZFxyXG4gICAqIEByZXR1cm5zIEEgZG9jdW1lbnQgaW50ZXJhY3Rpb24gc2VsZiBsb29wXHJcbiAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVJbnRlcmFjdGlvblJlY29yZChlbGVtZW50OiBFbGVtZW50LCBuYW1lOiBzdHJpbmcsIGV2ZW50OiBFdmVudCk6IERCRG9jdW1lbnQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGV0ZWN0ZWQgaW50ZXJhY3Rpb24gZXZlbnRcIik7XHJcbiAgICAgICAgbGV0IG1ldGFkYXRhOiB7aHRtbDogc3RyaW5nLCBlbGVtZW50TmFtZTogc3RyaW5nOyBpZD86IHN0cmluZ30gPSB7XHJcbiAgICAgICAgICAgIGh0bWw6IGVsZW1lbnQuZ2V0SFRNTCgpLFxyXG4gICAgICAgICAgICBlbGVtZW50TmFtZTogbmFtZSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IGV4dHJhY3RlZERhdGEgPSB0aGlzLmV4dHJhY3Rvckxpc3QuZXh0cmFjdCh0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmwsIFNlbmRlck1ldGhvZC5JbnRlcmFjdGlvbkRldGVjdGlvbik7XHJcblxyXG4gICAgICAgIG1ldGFkYXRhID0gey4uLiBtZXRhZGF0YSwgLi4uIGV4dHJhY3RlZERhdGF9O1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcInByaW50aW5nIG1ldGFkYXRhXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG1ldGFkYXRhKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgQWN0aXZpdHlEb2N1bWVudChBY3Rpdml0eVR5cGUuSW50ZXJhY3Rpb24sIGV2ZW50LCBtZXRhZGF0YSwgdGhpcy5jdXJyZW50UGFnZURhdGEudXJsLCBkb2N1bWVudC50aXRsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogU2VuZHMgYSBtZXNzYWdlIHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdC5cclxuICAgKiBAcGFyYW0gc2VuZGVyIC0gdGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uIHRoYXQncyBzZW5kaW5nIHRoZSBtZXNzYWdlIHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdFxyXG4gICAqIEBwYXJhbSBwYXlsb2FkIC0gdGhlIGRhdGEgYmVpbmcgc2VudCB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHRcclxuICAgKiBcclxuICAgKiBAcmV0dXJucyBSZXNwb25zZSBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIG1lc3NhZ2Ugc3VjY2VlZGVkXHJcbiAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBhc3luYyBzZW5kTWVzc2FnZVRvQmFja2dyb3VuZChzZW5kZXJNZXRob2Q6IFNlbmRlck1ldGhvZCwgcGF5bG9hZDogREJEb2N1bWVudCk6IFByb21pc2U8TWVzc2FnZVJlc3BvbnNlIHwgbnVsbD4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHJ1bnRpbWUgaXMgYXZhaWxhYmxlIChleHRlbnNpb24gY29udGV4dCBzdGlsbCB2YWxpZClcclxuICAgICAgICAgICAgaWYgKCFjaHJvbWUucnVudGltZT8uaWQpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRXh0ZW5zaW9uIGNvbnRleHQgaW52YWxpZGF0ZWQnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IG5ldyBCYWNrZ3JvdW5kTWVzc2FnZShzZW5kZXJNZXRob2QsIHBheWxvYWQpO1xyXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA6IE1lc3NhZ2VSZXNwb25zZSA9IGF3YWl0IGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hyb21lIHJldHVybnMgdW5kZWZpbmVkIGlmIG5vIGxpc3RlbmVycywgY2hlY2sgaWYgdGhhdCdzIGV4cGVjdGVkXHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdObyByZXNwb25zZSBmcm9tIGJhY2tncm91bmQgc2NyaXB0Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0JhY2tncm91bmQgbWVzc2FnZSBmYWlsZWQ6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICAvLyBEZWNpZGUgd2hldGhlciB0byB0aHJvdyBvciBoYW5kbGUgZ3JhY2VmdWxseSBiYXNlZCBvbiB5b3VyIG5lZWRzXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsOyAvLyBvciB0aHJvdyBlcnJvcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogQ2FsbGJhY2sgdGhhdCBjcmVhdGVzIGEgcGF5bG9hZCBkZXNjcmliaW5nIHRoZSBpbnRlcmFjdGlvbiB0aGF0IG9jY3VyZWQgYW5kIHNlbmRzIGl0IHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdFxyXG4gICAqIEBwYXJhbSBlIC0gdGhlIGV2ZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBjYWxsYmFja1xyXG4gICAqIEBwYXJhbSBuYW1lIC0gdGhlIG5hbWUgb2YgdGhlIGVsZW1lbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIGNhbGxiYWNrIChhcyBkZWZpbmVkIGluIHRoZSBjb25maWcpXHJcbiAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBvbkludGVyYWN0aW9uRGV0ZWN0aW9uKGVsZW1lbnQ6IEVsZW1lbnQsIGU6IEV2ZW50LCBuYW1lOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImludGVyYWN0aW9uIGV2ZW50IGRldGVjdGVkXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBFdmVudCBkZXRlY3RlZCB3aXRoIGV2ZW50IHR5cGU6ICR7ZS50eXBlfWApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBFdmVudCB0cmlnZ2VyZWQgYnlgLCBlbGVtZW50KTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhlbGVtZW50LmlubmVySFRNTCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudC5nZXRIVE1MKCkpO1xyXG4gICAgICAgIGNvbnN0IHJlY29yZCA9IHRoaXMuY3JlYXRlSW50ZXJhY3Rpb25SZWNvcmQoZWxlbWVudCwgbmFtZSwgZSk7XHJcbiAgICAgICAgdGhpcy5zZW5kTWVzc2FnZVRvQmFja2dyb3VuZChTZW5kZXJNZXRob2QuSW50ZXJhY3Rpb25EZXRlY3Rpb24sIHJlY29yZClcclxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gc2VuZCBpbnRlcmFjdGlvbiBkYXRhOicsIGVycm9yKTtcclxuICAgICAgICAgICAgLy8gTWF5YmUgcXVldWUgZm9yIHJldHJ5LCBvciBqdXN0IGxvZyBhbmQgY29udGludWVcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGxiYWNrIHRoYXQgY3JlYXRlcyBhIHBheWxvYWQgZGVzY3JpYmluZyB0aGUgbmF2aWdhdGlvbiB0aGF0IG9jY3VyZWQgYW5kIHNlbmRzIGl0IHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdFxyXG4gICAgICogQHBhcmFtIGUgLSB0aGUgZXZlbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIGNhbGxiYWNrXHJcbiAgICAgKiBAcGFyYW0gbmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBlbGVtZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBjYWxsYmFjayAoYXMgZGVmaW5lZCBpbiB0aGUgY29uZmlnKVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIG9uTmF2aWdhdGlvbkRldGVjdGlvbihuYXZFdmVudDogTmF2aWdhdGlvbkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZGVzdFVybCA9IG5hdkV2ZW50LmRlc3RpbmF0aW9uLnVybDtcclxuICAgICAgICBjb25zdCBiYXNlVVJMQ2hhbmdlID0gZGVzdFVybCAmJiB0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmxcclxuICAgICAgICAgICAgPyBkZXN0VXJsLnNwbGl0KFwiLlwiKVsxXSAhPT0gdGhpcy5jdXJyZW50UGFnZURhdGEudXJsLnNwbGl0KFwiLlwiKVsxXVxyXG4gICAgICAgICAgICA6IGZhbHNlO1xyXG4gICAgICAgIC8vIGNvbnN0IHVybENoYW5nZSA9ICEobmF2RXZlbnQuZGVzdGluYXRpb24udXJsID09PSB0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmwpO1xyXG4gICAgICAgIC8vIGxldCBzb3VyY2VTdGF0ZSA9IHRoaXMuZ2V0Q2xlYW5TdGF0ZU5hbWUoKTtcclxuICAgICAgICAvLyBsZXQgbWF0Y2ggPSB0aGlzLmN1cnJlbnRQYWdlRGF0YS5jaGVja0Zvck1hdGNoKG5hdkV2ZW50LmRlc3RpbmF0aW9uLnVybCk7XHJcbiAgICAgICAgaWYgKGRlc3RVcmwpe1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmwgPSBuYXZFdmVudC5kZXN0aW5hdGlvbi51cmw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vIGRlc3RpbmF0aW9uIFVSTCBmb3VuZCBpbiBuYXZpZ2F0ZSBldmVudC4gU2V0dGluZyB0byBlbXB0eSBzdHJpbmdcIik7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCA9IFwiTk8gVVJMIEZPVU5EXCI7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBsZXQgZGVzdFN0YXRlID0gdGhpcy5nZXRDbGVhblN0YXRlTmFtZSgpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhgTmF2aWdhdGlvbiBkZXRlY3RlZCB3aXRoIGV2ZW50IHR5cGU6ICR7bmF2RXZlbnQudHlwZX1gKVxyXG4gICAgICAgIGlmIChiYXNlVVJMQ2hhbmdlKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJVUkwgYmFzZSBjaGFuZ2UgZGV0ZWN0ZWQuIENsb3NpbmcgcHJvZ3JhbS5cIik7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoU2VuZGVyTWV0aG9kLkNsb3NlU2Vzc2lvbiwgbmV3IERCRG9jdW1lbnQodGhpcy5jdXJyZW50UGFnZURhdGEudXJsLCBkb2N1bWVudC50aXRsZSkpLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHNlbmQgaW50ZXJhY3Rpb24gZGF0YTonLCBlcnJvcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChuYXZFdmVudC5uYXZpZ2F0aW9uVHlwZSA9PT0gXCJwdXNoXCIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQdXNoIGV2ZW50IGRldGVjdGVkLlwiKTtcclxuICAgICAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5jcmVhdGVTdGF0ZUNoYW5nZVJlY29yZChuYXZFdmVudCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoU2VuZGVyTWV0aG9kLk5hdmlnYXRpb25EZXRlY3Rpb24sIHJlY29yZCkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gc2VuZCBpbnRlcmFjdGlvbiBkYXRhOicsIGVycm9yKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ3VycmVudFBhZ2VEYXRhKHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChuYXZFdmVudC5uYXZpZ2F0aW9uVHlwZSA9PT0gXCJyZXBsYWNlXCIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXBsYWNlIGV2ZW50IGRldGVjdGVkLlwiKTtcclxuICAgICAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5jcmVhdGVTZWxmTG9vcFJlY29yZChuYXZFdmVudCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoU2VuZGVyTWV0aG9kLk5hdmlnYXRpb25EZXRlY3Rpb24sIHJlY29yZCkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gc2VuZCBpbnRlcmFjdGlvbiBkYXRhOicsIGVycm9yKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgKiBHZW5lcmF0ZXMgYSB1bmlxdWUgY29sb3IgZnJvbSBhIGdpdmVuIHN0cmluZ1xyXG4gICAqIFNvdXJjZTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzMxMDM3MzgzIFxyXG4gICAqIEByZXR1cm5zIENvbG9yIGhleCBjb2RlXHJcbiAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBTdHJpbmdUb0NvbG9yID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpbnRlcmZhY2UgQ29sb3JJbnN0YW5jZSB7XHJcbiAgICAgICAgICAgIHN0cmluZ1RvQ29sb3JIYXNoOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xyXG4gICAgICAgICAgICBuZXh0VmVyeURpZmZlcm50Q29sb3JJZHg6IG51bWJlcjtcclxuICAgICAgICAgICAgdmVyeURpZmZlcmVudENvbG9yczogc3RyaW5nW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaW5zdGFuY2U6IENvbG9ySW5zdGFuY2UgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbmV4dDogZnVuY3Rpb24gc3RyaW5nVG9Db2xvcihzdHI6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZSA/Pz0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0cmluZ1RvQ29sb3JIYXNoOiB7fSxcclxuICAgICAgICAgICAgICAgICAgICBuZXh0VmVyeURpZmZlcm50Q29sb3JJZHg6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgdmVyeURpZmZlcmVudENvbG9yczogW1wiIzAwRkYwMFwiLCBcIiMwMDAwRkZcIiwgXCIjRkYwMDAwXCIsIFwiIzAxRkZGRVwiLCBcIiNGRkE2RkVcIiwgXCIjRkZEQjY2XCIsIFwiIzAwNjQwMVwiLCBcIiMwMTAwNjdcIiwgXCIjOTUwMDNBXCIsIFwiIzAwN0RCNVwiLCBcIiNGRjAwRjZcIiwgXCIjRkZFRUU4XCIsIFwiIzc3NEQwMFwiLCBcIiM5MEZCOTJcIiwgXCIjMDA3NkZGXCIsIFwiI0Q1RkYwMFwiLCBcIiNGRjkzN0VcIiwgXCIjNkE4MjZDXCIsIFwiI0ZGMDI5RFwiLCBcIiNGRTg5MDBcIiwgXCIjN0E0NzgyXCIsIFwiIzdFMkREMlwiLCBcIiM4NUE5MDBcIiwgXCIjRkYwMDU2XCIsIFwiI0E0MjQwMFwiLCBcIiMwMEFFN0VcIiwgXCIjNjgzRDNCXCIsIFwiI0JEQzZGRlwiLCBcIiMyNjM0MDBcIiwgXCIjQkREMzkzXCIsIFwiIzAwQjkxN1wiLCBcIiM5RTAwOEVcIiwgXCIjMDAxNTQ0XCIsIFwiI0MyOEM5RlwiLCBcIiNGRjc0QTNcIiwgXCIjMDFEMEZGXCIsIFwiIzAwNDc1NFwiLCBcIiNFNTZGRkVcIiwgXCIjNzg4MjMxXCIsIFwiIzBFNENBMVwiLCBcIiM5MUQwQ0JcIiwgXCIjQkU5OTcwXCIsIFwiIzk2OEFFOFwiLCBcIiNCQjg4MDBcIiwgXCIjNDMwMDJDXCIsIFwiI0RFRkY3NFwiLCBcIiMwMEZGQzZcIiwgXCIjRkZFNTAyXCIsIFwiIzYyMEUwMFwiLCBcIiMwMDhGOUNcIiwgXCIjOThGRjUyXCIsIFwiIzc1NDRCMVwiLCBcIiNCNTAwRkZcIiwgXCIjMDBGRjc4XCIsIFwiI0ZGNkU0MVwiLCBcIiMwMDVGMzlcIiwgXCIjNkI2ODgyXCIsIFwiIzVGQUQ0RVwiLCBcIiNBNzU3NDBcIiwgXCIjQTVGRkQyXCIsIFwiI0ZGQjE2N1wiLCBcIiMwMDlCRkZcIiwgXCIjRTg1RUJFXCJdXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghaW5zdGFuY2Uuc3RyaW5nVG9Db2xvckhhc2hbc3RyXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoW3N0cl0gPSBpbnN0YW5jZS52ZXJ5RGlmZmVyZW50Q29sb3JzW2luc3RhbmNlLm5leHRWZXJ5RGlmZmVybnRDb2xvcklkeCsrXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgJWMgVGhlIGNvbG91ciBmb3IgJHtzdHJ9YCwgYGNvbG9yOiAke2luc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoW3N0cl19YCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5zdGFuY2Uuc3RyaW5nVG9Db2xvckhhc2hbc3RyXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KSgpO1xyXG59XHJcbiIsImltcG9ydCB7U2VsZWN0b3JOYW1lUGFpciwgUGF0dGVybkRhdGEsIFBhdHRlcm5TZWxlY3Rvck1hcCB9IGZyb20gXCIuL2NvbmZpZ1wiO1xyXG4vKipcclxuICogQSBjbGFzcyByZXNwb25zaWJsZSBmb3IgdHJhY2tpbmcgdGhlIHN0YXRlIG9mIHRoZSBwYWdlIHRoYXQgdGhlIHVzZXIgaXMgY3VycmVudGx5IG9uLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFBhZ2VEYXRhIHtcclxuICAgIC8vIFVSTCBvZiB0aGUgcGFnZVxyXG4gICAgdXJsITogc3RyaW5nO1xyXG4gICAgLy8gQ1NTIHNlbGVjdG9ycyBiZWluZyBhcHBsaWVkIHRvIHRoZSBwYWdlXHJcbiAgICBzZWxlY3RvcnMhOiBTZWxlY3Rvck5hbWVQYWlyW107XHJcbiAgICAvLyBUaGUgVVJMIHBhdHRlcm4sIENTUyBzZWxlY3RvcnMsIGFuZCBvcHRpb25hbGx5IGEgZnVuY3Rpb24gZm9yIGdldHRpbmcgcGFnZSBJRCBcclxuICAgIC8vIGZvciB0aGUgcGF0dGVybiB0aGF0IG1vc3QgY2xvc2VseSBtYXRjaGVzIHRoaXMudXJsXHJcbiAgICAvLyBFeDogSWYgdGhlIHVybCBpcyB3d3cueW91dHViZS5jb20vc2hvcnRzL0FCQyBhbmQgdGhlIHBhdHRlcm5zIGFyZSAvKiBhbmQgL3Nob3J0cy86aWQsIHRoZW4gXHJcbiAgICAvLyBtYXRjaFBhdGhEYXRhIHdvdWxkIGNvbnRhaW4gdGhlIFBhdGhEYXRhIGZvciAvc2hvcnRzLzppZCwgc2luY2UgaXRzIGEgY2xvc2VyIG1hdGNoIHRvIHRoZSBVUkwuXHJcbiAgICBtYXRjaFBhdGhEYXRhITogUGF0dGVybkRhdGE7IFxyXG4gICAgY3VycmVudFBhdHRlcm4hOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZXMgdGhlIHN0YXRlIG9mIHRoZSBQYWdlRGF0YVxyXG4gICAgICogQHBhcmFtIGJhc2VVUkw6IFRoZSBiYXNlIHVybCBmb3IgdGhlIHBhZ2UgKGVnLiB3d3cueW91dHViZS5jb20pXHJcbiAgICAgKiBAcGFyYW0gdXJsOiBUaGUgZnVsbCB1cmwgb2YgdGhlIGN1cnJlbnQgcGFnZVxyXG4gICAgICogQHBhcmFtIHBhdGhzOiBBIGxpc3Qgb2YgYWxsIHRoZSBwYXRocyBkZWZpbmVkIGluIGEgY29uZmlnXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZShiYXNlVVJMOiBzdHJpbmcsIHVybDogc3RyaW5nLCBwYXRoczogUGF0dGVyblNlbGVjdG9yTWFwKXtcclxuICAgICAgICB0aGlzLnVybCA9IHVybDtcclxuICAgICAgICBjb25zdCBtYXRjaGVzID0gdGhpcy51cGRhdGVNYXRjaERhdGEoYmFzZVVSTCwgcGF0aHMpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0b3JzID0gdGhpcy5nZXRTZWxlY3RvcnMobWF0Y2hlcywgcGF0aHMpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIGBtYXRjaFBhdGhEYXRhYCB0byBiZSB0aGUgUGF0aERhdGEgZm9yIHRoZSBVUkwgcGF0dGVybiB3aXRoIHRoZSBjbG9zZXQgbWF0Y2ggdG8gYGJhc2VVUkxgXHJcbiAgICAgKiBhbmQgcmV0dXJucyBhIGxpc3Qgb2YgYWxsIG1hdGNoZXMuIEFkZGl0aW9uYWxseSwgaXQgdXBkYXRlcyB3aGV0aGVyIHRoZSBjdXJyZW50IHBhdGhcclxuICAgICAqIGluY2x1ZGVzIGFuIGlkLlxyXG4gICAgICogQHBhcmFtIGJhc2VVUkw6IFRoZSBiYXNlIHVybCBmb3IgdGhlIHBhZ2UgKGVnLiB3d3cueW91dHViZS5jb20pXHJcbiAgICAgKiBAcGFyYW0gcGF0dGVybnM6IEEgbGlzdCBvZiBhbGwgdGhlIHBhdGhzIGRlZmluZWQgaW4gYSBjb25maWdcclxuICAgICAqIFxyXG4gICAgICogQHJldHVybnMgQSBsaXN0IG9mIGFsbCBwYXR0ZXJucyBpbiB0aGUgY29uZmlnIHRoYXQgbWF0Y2ggYGJhc2VVUkxgXHJcbiAgICAgKi9cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZU1hdGNoRGF0YShiYXNlVVJMOiBzdHJpbmcsIHBhdHRlcm5zOiBQYXR0ZXJuU2VsZWN0b3JNYXApOiBzdHJpbmdbXXtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInVwZGF0aW5nIHBhZ2UgZGF0YVwiKTtcclxuICAgICAgICBsZXQgY2xvc2VzdE1hdGNoID0gXCJcIjsgLy8gdGhlIHBhdHRlcm4gdGhhdCBtb3N0IGNsb3NlbHkgbWF0Y2hlcyB0aGUgY3VycmVudCBVUkxcclxuXHJcbiAgICAgICAgLy8gR2V0IGEgbGlzdCBvZiBhbGwgdGhlIHBhdGhzIHRoYXQgbWF0Y2ggdGhlIGN1cnJlbnQgVVJMXHJcbiAgICAgICAgY29uc3QgbWF0Y2hlcyA9IE9iamVjdC5rZXlzKHBhdHRlcm5zKS5maWx0ZXIoKHBhdGgpID0+IHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocGF0aCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHAgPSBuZXcgVVJMUGF0dGVybihwYXRoLCBiYXNlVVJMKTtcclxuICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBwLnRlc3QodGhpcy51cmwpO1xyXG4gICAgICAgICAgICAvLyBDbG9zZXN0IG1hdGNoIGlzIHRoZSBsb25nZXN0IHBhdHRlcm4gdGhhdCBtYXRjaGVzIHRoZSBjdXJyZW50IFVSTFxyXG4gICAgICAgICAgICBpZiAobWF0Y2ggJiYgcGF0aC5sZW5ndGggPiBjbG9zZXN0TWF0Y2gubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBjbG9zZXN0TWF0Y2ggPSBwYXRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBtYXRjaDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGF0dGVybiA9IGNsb3Nlc3RNYXRjaDtcclxuXHJcbiAgICAgICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm8gbWF0Y2hlcyBmb3VuZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHRoaXMudXJsVXNlc0lkID0gY2xvc2VzdE1hdGNoLmVuZHNXaXRoKFwiOmlkXCIpO1xyXG4gICAgICAgIHRoaXMubWF0Y2hQYXRoRGF0YSA9IHBhdHRlcm5zW2Nsb3Nlc3RNYXRjaF07XHJcbiAgICAgICAgcmV0dXJuIG1hdGNoZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gbWF0Y2hlczogQSBsaXN0IG9mIGFsbCBtYXRjaGluZyBwYXRocyB0byB0aGUgY3VycmVudCB1cmxcclxuICAgICAqIEBwYXJhbSBwYXRoczogQSBsaXN0IG9mIGFsbCB0aGUgcGF0aHMgZGVmaW5lZCBpbiBhIGNvbmZpZ1xyXG4gICAgICogXHJcbiAgICAgKiBAcmV0dXJucyBBIGxpc3Qgb2YgYWxsIHNlbGVjdG9ycyBmb3IgdGhlIG1hdGNoaW5nIHBhdGhzXHJcbiAgICAgKi9cclxuXHJcbiAgICBwcml2YXRlIGdldFNlbGVjdG9ycyhtYXRjaGVzOiBzdHJpbmdbXSwgcGF0aHM6IFBhdHRlcm5TZWxlY3Rvck1hcCk6IFNlbGVjdG9yTmFtZVBhaXJbXSB7XHJcbiAgICAgICAgY29uc3QgY3VycmVudFNlbGVjdG9ycyA9IFtdO1xyXG4gICAgICAgIGZvciAoY29uc3QgcGF0aCBvZiBtYXRjaGVzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGhEYXRhID0gcGF0aHNbcGF0aF07XHJcbiAgICAgICAgICAgIGlmIChwYXRoRGF0YS5zZWxlY3RvcnMpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2YgcGF0aERhdGEuc2VsZWN0b3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNlbGVjdG9ycy5wdXNoKHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY3VycmVudFNlbGVjdG9ycztcclxuICAgIH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvY29udGVudC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==