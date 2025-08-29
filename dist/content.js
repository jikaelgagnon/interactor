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
                    if (instance === null) {
                        instance = {
                            stringToColorHash: {},
                            nextVeryDifferntColorIdx: 0,
                            veryDifferentColors: ["#00FF00", "#0000FF", "#FF0000", "#01FFFE", "#FFA6FE", "#FFDB66", "#006401", "#010067", "#95003A", "#007DB5", "#FF00F6", "#FFEEE8", "#774D00", "#90FB92", "#0076FF", "#D5FF00", "#FF937E", "#6A826C", "#FF029D", "#FE8900", "#7A4782", "#7E2DD2", "#85A900", "#FF0056", "#A42400", "#00AE7E", "#683D3B", "#BDC6FF", "#263400", "#BDD393", "#00B917", "#9E008E", "#001544", "#C28C9F", "#FF74A3", "#01D0FF", "#004754", "#E56FFE", "#788231", "#0E4CA1", "#91D0CB", "#BE9970", "#968AE8", "#BB8800", "#43002C", "#DEFF74", "#00FFC6", "#FFE502", "#620E00", "#008F9C", "#98FF52", "#7544B1", "#B500FF", "#00FF78", "#FF6E41", "#005F39", "#6B6882", "#5FAD4E", "#A75740", "#A5FFD2", "#FFB167", "#009BFF", "#E85EBE"]
                        };
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
        console.log(`Event triggered by ${element}`);
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
    // @ts-ignore: Ignoring TypeScript error for NavigateEvent not found
    onNavigationDetection(navEvent) {
        const baseURLChange = navEvent.destination.url.split(".")[1] != this.currentPageData.url.split(".")[1];
        // const urlChange = !(navEvent.destination.url === this.currentPageData.url);
        // let sourceState = this.getCleanStateName();
        // let match = this.currentPageData.checkForMatch(navEvent.destination.url);
        this.currentPageData.url = navEvent.destination.url;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNuQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFFSyxZQUFZLENBQUMsT0FBaUIsRUFBRSxLQUF5QjtRQUM3RCxNQUFNLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztRQUM1QixLQUFLLE1BQU0sSUFBSSxJQUFJLE9BQU8sRUFBRSxDQUFDO1lBQ3pCLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QixJQUFJLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDckIsS0FBSyxNQUFNLFFBQVEsSUFBSSxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQ3hDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDcEMsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQ0QsT0FBTyxnQkFBZ0IsQ0FBQztJQUM1QixDQUFDO0NBQ0o7QUEvRUQsNEJBK0VDOzs7Ozs7O1VDbkZEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbW11bmljYXRpb24vYWN0aXZpdHkudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb21tdW5pY2F0aW9uL2JhY2tncm91bmRtZXNzYWdlLnRzIiwid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvY29tbXVuaWNhdGlvbi9zZW5kZXIudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb250ZW50LnRzIiwid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvZGF0YWJhc2UvZGJkb2N1bWVudC50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2ludGVyYWN0aW9ucy9jb25maWcudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9pbnRlcmFjdGlvbnMvbW9uaXRvci50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2ludGVyYWN0aW9ucy9wYWdlZGF0YS50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2ludGVyYWN0b3Ivd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIERlZmluZXMgYSBsaXN0IG9mIHRoZSBwb3NzaWJsZSBhY3Rpdml0eSB0eXBlcyB0aGF0IGNhbiBiZSByZWNvcmRlZCBieSB0aGUgTW9uaXRvciBjbGFzc1xuICovXG5lbnVtIEFjdGl2aXR5VHlwZSB7XG4gICAgU2VsZkxvb3AgPSBcIlNlbGYtTG9vcFwiLFxuICAgIFN0YXRlQ2hhbmdlID0gXCJTdGF0ZSBDaGFuZ2VcIixcbiAgICBJbnRlcmFjdGlvbiA9IFwiSW50ZXJhY3Rpb25cIixcbiAgICBCb3RoID0gXCJCb3RoXCJcbn1cblxuZXhwb3J0IHtBY3Rpdml0eVR5cGV9IiwiaW1wb3J0IHtEQkRvY3VtZW50IH0gZnJvbSBcIi4uL2RhdGFiYXNlL2RiZG9jdW1lbnRcIjtcbmltcG9ydCB7IFNlbmRlck1ldGhvZCB9IGZyb20gXCIuL3NlbmRlclwiO1xuZXhwb3J0IHtCYWNrZ3JvdW5kTWVzc2FnZSwgTWVzc2FnZVJlc3BvbnNlfTtcbi8qKlxuICogQSBjbGFzcyB1c2VkIHRvIHNlbmQgbWVzc2FnZXMgZnJvbSB0aGUgY29udGVudCB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHQgaW4gYSBjb25zaXN0ZW50IGZvcm1hdC5cbiAqL1xuY2xhc3MgQmFja2dyb3VuZE1lc3NhZ2Uge1xuICAgIHNlbmRlck1ldGhvZDogU2VuZGVyTWV0aG9kO1xuICAgIHBheWxvYWQ6IERCRG9jdW1lbnQ7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHNlbmRlck1ldGhvZCAtIGVudW0gdHlwZSBvZiB0aGUgbWV0aG9kIHNlbmRpbmcgdGhlIG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0gcGF5bG9hZCAtIHRoZSBkYXRhIGJlaW5nIHNlbnQgdG8gdGhlIGRhdGFiYXNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKHNlbmRlck1ldGhvZDogU2VuZGVyTWV0aG9kLCBwYXlsb2FkOiBEQkRvY3VtZW50KSB7XG4gICAgICAgIHRoaXMuc2VuZGVyTWV0aG9kID0gc2VuZGVyTWV0aG9kO1xuICAgICAgICB0aGlzLnBheWxvYWQgPSBwYXlsb2FkO1xuICAgIH1cbn1cblxuaW50ZXJmYWNlIE1lc3NhZ2VSZXNwb25zZSB7XG4gIHN0YXR1czogc3RyaW5nO1xuICBoaWdobGlnaHQ/OiBib29sZWFuO1xufSIsImVudW0gU2VuZGVyTWV0aG9ke1xuICAgIEluaXRpYWxpemVTZXNzaW9uID0gXCJJbml0aWFsaXplIFNlc3Npb25cIixcbiAgICBJbnRlcmFjdGlvbkRldGVjdGlvbiA9IFwiSW50ZXJhY3Rpb24gRGV0ZWN0aW9uXCIsXG4gICAgTmF2aWdhdGlvbkRldGVjdGlvbiA9IFwiTmF2aWdhdGlvbiBEZXRlY3Rpb25cIixcbiAgICBDbG9zZVNlc3Npb24gPSBcIkNsb3NlIFNlc3Npb25cIixcbiAgICBBbnkgPSBcIkFueVwiXG59XG5leHBvcnQge1NlbmRlck1ldGhvZH07IiwiaW1wb3J0IHsgTW9uaXRvciB9IGZyb20gXCIuL2ludGVyYWN0aW9ucy9tb25pdG9yXCI7XG5pbXBvcnQgeXRDb25maWcgZnJvbSAnLi9jb25maWdzL3lvdXR1YmVfY29uZmlnLmpzb24nO1xuLy8gaW1wb3J0IHRpa3Rva0NvbmZpZyBmcm9tICcuL2NvbmZpZ3MvdGlrdG9rX2NvbmZpZy5qc29uJztcbi8vIGltcG9ydCBsaW5rZWRpbkNvbmZpZyBmcm9tICcuL2NvbmZpZ3MvbGlua2VkaW5fY29uZmlnLmpzb24nO1xuaW1wb3J0IHsgQ29uZmlnTG9hZGVyLCBFeHRyYWN0b3JEYXRhIH0gZnJvbSBcIi4vaW50ZXJhY3Rpb25zL2NvbmZpZ1wiO1xuLy8gaW1wb3J0IHsgQWN0aXZpdHlUeXBlIH0gZnJvbSBcIi4vY29tbXVuaWNhdGlvbi9hY3Rpdml0eVwiO1xuaW1wb3J0IHsgU2VuZGVyTWV0aG9kIH0gZnJvbSBcIi4vY29tbXVuaWNhdGlvbi9zZW5kZXJcIjtcblxuXG5jb25zdCBnZXRIb21lcGFnZVZpZGVvcyA9ICgpOiBvYmplY3QgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKFwiLS0tLSBFWFRSQUNUSU5HIEhPTUVQQUdFIExJTktTIC0tLVwiKTtcbiAgICBjb25zdCBjb250ZW50RGl2cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI2NvbnRlbnQueXRkLXJpY2gtaXRlbS1yZW5kZXJlcicpKVxuICAgICAgICAuZmlsdGVyKGRpdiA9PiB7XG4gICAgICAgICAgICAvLyBDaGVjayBpZiBlbGVtZW50IGlzIGFjdHVhbGx5IHZpc2libGVcbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBkaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICByZXR1cm4gcmVjdC53aWR0aCA+IDAgJiYgcmVjdC5oZWlnaHQgPiAwICYmIFxuICAgICAgICAgICAgICAgIGdldENvbXB1dGVkU3R5bGUoZGl2KS52aXNpYmlsaXR5ICE9PSAnaGlkZGVuJztcbiAgICAgICAgfSk7XG4gICAgXG4gICAgY29uc3QgdmlkZW9zID0gY29udGVudERpdnMubWFwKGNvbnRlbnREaXYgPT4ge1xuICAgICAgICAvLyBHZXQgdGhlIGRpcmVjdCBhbmNob3IgY2hpbGRcbiAgICAgICAgY29uc3QgYW5jaG9yID0gY29udGVudERpdi5xdWVyeVNlbGVjdG9yKCc6c2NvcGUgPiB5dC1sb2NrdXAtdmlldy1tb2RlbCBhJykgYXMgSFRNTEFuY2hvckVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IHNwYW4gPSBjb250ZW50RGl2LnF1ZXJ5U2VsZWN0b3IoJ2gzIGEgc3Bhbi55dC1jb3JlLWF0dHJpYnV0ZWQtc3RyaW5nJyk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGluazogYW5jaG9yPy5ocmVmID8/ICcnLFxuICAgICAgICAgICAgdGl0bGU6IHNwYW4/LnRleHRDb250ZW50Py50cmltKCkgPz8gJydcbiAgICAgICAgfTtcbiAgICB9KS5maWx0ZXIodmlkZW8gPT4gdmlkZW8ubGluayAhPT0gJycpO1xuICAgIFxuICAgIHJldHVybiB7XCJ2aWRlb3NcIjogdmlkZW9zfTtcbn07XG5cbmNvbnN0IGdldFJlY29tbWVuZGVkVmlkZW9zID0gKCk6IG9iamVjdCA9PiB7XG4gICAgY29uc29sZS5sb2coXCItLS0tIEVYVFJBQ1RJTkcgUkVDT01NRU5ERUQgTElOS1MgLS0tXCIpO1xuICAgIGNvbnN0IGNvbnRlbnREaXZzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCd5dC1sb2NrdXAtdmlldy1tb2RlbCcpKS5maWx0ZXIoZGl2ID0+IHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgZWxlbWVudCBpcyBhY3R1YWxseSB2aXNpYmxlXG4gICAgICAgIGNvbnN0IHJlY3QgPSBkaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHJldHVybiByZWN0LndpZHRoID4gMCAmJiByZWN0LmhlaWdodCA+IDAgJiYgXG4gICAgICAgICAgICBnZXRDb21wdXRlZFN0eWxlKGRpdikudmlzaWJpbGl0eSAhPT0gJ2hpZGRlbic7XG4gICAgfSk7XG4gICAgXG4gICAgY29uc3QgdmlkZW9zOiBvYmplY3QgPSBjb250ZW50RGl2cy5tYXAoY29udGVudERpdiA9PiB7XG4gICAgICAgIC8vIEdldCB0aGUgYW5jaG9yIHdpdGggdGhlIHZpZGVvIGxpbmtcbiAgICAgICAgY29uc3QgYW5jaG9yID0gY29udGVudERpdi5xdWVyeVNlbGVjdG9yKCdhW2hyZWZePVwiL3dhdGNoXCJdJykhIGFzIEhUTUxBbmNob3JFbGVtZW50O1xuICAgICAgICBjb25zdCBzcGFuID0gY29udGVudERpdi5xdWVyeVNlbGVjdG9yKCdoMyBhIHNwYW4ueXQtY29yZS1hdHRyaWJ1dGVkLXN0cmluZycpITtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsaW5rOiBhbmNob3I/LmhyZWYgPz8gJycsXG4gICAgICAgICAgICB0aXRsZTogc3Bhbj8udGV4dENvbnRlbnQ/LnRyaW0oKSA/PyAnJ1xuICAgICAgICB9O1xuICAgIH0pLmZpbHRlcih2aWRlbyA9PiB2aWRlby5saW5rICE9PSAnJyk7XG4gICAgXG4gICAgLy8gY29uc29sZS5sb2coXCJQcmludGluZyB0aGUgZmlyc3QgNSB2aWRlb3NcIik7XG4gICAgLy8gY29uc29sZS50YWJsZSh2aWRlb3Muc2xpY2UoMCw1KSk7XG4gICAgcmV0dXJuIHtcInZpZGVvc1wiOiB2aWRlb3N9O1xufTtcblxuY29uc3QgZXh0cmFjdG9ycyA9IFtuZXcgRXh0cmFjdG9yRGF0YShTZW5kZXJNZXRob2QuSW50ZXJhY3Rpb25EZXRlY3Rpb24sIFwiL1wiLCBnZXRIb21lcGFnZVZpZGVvcyksIFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEV4dHJhY3RvckRhdGEoU2VuZGVyTWV0aG9kLkludGVyYWN0aW9uRGV0ZWN0aW9uLCBcIi93YXRjaD92PSpcIiwgZ2V0UmVjb21tZW5kZWRWaWRlb3MpXVxuXG5jb25zdCB5dENvbmZpZ0xvYWRlciA9IG5ldyBDb25maWdMb2FkZXIoeXRDb25maWcsIGV4dHJhY3RvcnMpO1xuXG5uZXcgTW9uaXRvcih5dENvbmZpZ0xvYWRlcik7XG5cbi8vIGNvbnN0IHRpa3Rva0lEU2VsZWN0b3IgPSAoKTogb2JqZWN0ID0+IHtcbi8vICAgICBsZXQgdmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi54Z3BsYXllci1jb250YWluZXIudGlrdG9rLXdlYi1wbGF5ZXJcIik7XG4vLyAgICAgaWYgKCF2aWQpe1xuLy8gICAgICAgICBjb25zb2xlLmxvZyhcIm5vIHVybCBmb3VuZCFcIik7XG4vLyAgICAgICAgIHJldHVybiB7fTtcbi8vICAgICB9XG4vLyAgICAgbGV0IGlkID0gdmlkLmlkLnNwbGl0KFwiLVwiKS5hdCgtMSk7XG4vLyAgICAgbGV0IHVybCA9IGBodHRwczovL3Rpa3Rvay5jb20vc2hhcmUvdmlkZW8vJHtpZH1gO1xuLy8gICAgIHJldHVybiB7XG4vLyAgICAgICAgIFwidW5pcXVlVVJMXCI6IHVybFxuLy8gICAgIH07XG4vLyB9XG5cblxuXG4vLyBjb25zb2xlLmxvZyh0aWt0b2tDb25maWcpO1xuLy8gY29uc3QgdGlrdG9rQ29uZmlnTG9hZGVyID0gbmV3IENvbmZpZ0xvYWRlcih0aWt0b2tDb25maWcpO1xuLy8gdGlrdG9rQ29uZmlnTG9hZGVyLmluamVjdEV4dHJhY3RvcihcIi8qXCIsIHRpa3Rva0lEU2VsZWN0b3IpO1xuLy8gY29uc3QgdGlrdG9rSW50ZXJhY3RvciA9IG5ldyBNb25pdG9yKHRpa3Rva0NvbmZpZ0xvYWRlci5jb25maWcpO1xuXG4vLyAvLyBjb25zb2xlLmxvZyh0aWt0b2tDb25maWcpO1xuLy8gY29uc3QgbGlua2VkaW5Db25maWdMb2FkZXIgPSBuZXcgQ29uZmlnTG9hZGVyKGxpbmtlZGluQ29uZmlnKTtcbi8vIGNvbnN0IGxpbmtlZGluSW50ZXJhY3RvciA9IG5ldyBNb25pdG9yKGxpbmtlZGluQ29uZmlnTG9hZGVyLmNvbmZpZyk7IiwiaW1wb3J0IHsgQWN0aXZpdHlUeXBlIH0gZnJvbSBcIi4uL2NvbW11bmljYXRpb24vYWN0aXZpdHlcIjtcclxuLyoqXHJcbiAqIEEgY2xhc3MgZGVmaW5pbmcgZG9jdW1lbnRzIHRoYXQgYXJlIHNlbnQgdG8gdGhlIGRhdGFiYXNlIGZyb20gdGhlIGNvbnRlbnQgc2NyaXB0XHJcbiAqL1xyXG5jbGFzcyBEQkRvY3VtZW50IHtcclxuICAgIC8vIFVSTCBhdCB3aGljaHQgdGhlIGV2ZW50IHdhcyBjcmVhdGVkXHJcbiAgICBzb3VyY2VVUkw6IHN0cmluZztcclxuICAgIHNvdXJjZURvY3VtZW50VGl0bGU6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgdGl0bGU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc291cmNlVVJMID0gdXJsO1xyXG4gICAgICAgIHRoaXMuc291cmNlRG9jdW1lbnRUaXRsZSA9IHRpdGxlO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQSBjaGlsZCBvZiBEQkRvY3VtZW50IHRoYXQgcmVwcmVzZW50cyBhY3Rpdml0aWVzXHJcbiAqL1xyXG5cclxuY2xhc3MgQWN0aXZpdHlEb2N1bWVudCBleHRlbmRzIERCRG9jdW1lbnR7XHJcbiAgICAvLyBUaGUgdHlwZSBvZiBhY3Rpdml0eSBiZWluZyBsb2dnZWQuIEVpdGhlciBcInN0YXRlX2NoYWdlXCIsIFwic2VsZl9sb29wXCIsIG9yIFwiaW50ZXJhY3Rpb25cIlxyXG4gICAgYWN0aXZpdHlUeXBlOiBBY3Rpdml0eVR5cGU7XHJcbiAgICAvLyBUaW1lc3RhbXAgZm9yIHdoZW4gdGhlIGRvY3VtZW50IHdhcyBjcmVhdGVkXHJcbiAgICBjcmVhdGVkQXQ6IERhdGU7XHJcbiAgICAvLyBFdmVudCB0eXBlIChlZy4gY2xpY2ssIHNjcm9sbCwgZXRjLi4uKVxyXG4gICAgZXZlbnRUeXBlOiBzdHJpbmdcclxuICAgIC8vIE1ldGFkYXRhIGFib3V0IHRoZSBldmVudFxyXG4gICAgbWV0YWRhdGE6IG9iamVjdDtcclxuICAgIGNvbnN0cnVjdG9yKHR5cGU6IEFjdGl2aXR5VHlwZSwgZXZlbnQ6IEV2ZW50LCBtZXRhZGF0YTogb2JqZWN0LCB1cmw6IHN0cmluZywgdGl0bGU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKHVybCwgdGl0bGUpO1xyXG4gICAgICAgIHRoaXMuYWN0aXZpdHlUeXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLmNyZWF0ZWRBdCA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgdGhpcy5ldmVudFR5cGUgPSBldmVudC50eXBlXHJcbiAgICAgICAgdGhpcy5tZXRhZGF0YSA9IG1ldGFkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQSBjaGlsZCBvZiBEQkRvY3VtZW50IHRoYXQgcmVwcmVzZW50cyB0aGUgc3RhcnQgb2YgYSBzZXNzaW9uXHJcbiAqL1xyXG5cclxuY2xhc3MgU2Vzc2lvbkRvY3VtZW50IGV4dGVuZHMgREJEb2N1bWVudHtcclxuICAgIHN0YXJ0VGltZTogRGF0ZTtcclxuICAgIGVuZFRpbWU/OiBEYXRlO1xyXG4gICAgZW1haWwgPSBcIkVtYWlsIG5vdCBzZXRcIjtcclxuICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCB0aXRsZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIodXJsLCB0aXRsZSk7XHJcbiAgICAgICAgdGhpcy5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgc2V0RW1haWwoZW1haWw6IHN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5lbWFpbCA9IGVtYWlsO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge0RCRG9jdW1lbnQsIEFjdGl2aXR5RG9jdW1lbnQsIFNlc3Npb25Eb2N1bWVudH07IiwiaW1wb3J0IHsgU2VuZGVyTWV0aG9kIH0gZnJvbSBcIi4uL2NvbW11bmljYXRpb24vc2VuZGVyXCI7XG5cbmV4cG9ydCB7U2VsZWN0b3JOYW1lUGFpciwgQ29uZmlnLCBDb25maWdMb2FkZXIsIFBhdHRlcm5EYXRhLCBQYXR0ZXJuU2VsZWN0b3JNYXAsIEV4dHJhY3RvckRhdGEsIEV4dHJhY3Rvckxpc3R9O1xuXG5pbnRlcmZhY2UgU2VsZWN0b3JOYW1lUGFpcntcbiAgICAvKipcbiAgICAgKiBBbiBpbnRlcmZhY2UgdG8gbWFwIENTUyBzZWxlY3RvcnMgdG8gaHVtYW4gcmVhZGFibGUgbmFtZXNcbiAgICAgKi9cbiAgICAvLyBUaGUgQ1NTIHNlbGVjdG9yXG4gICAgc2VsZWN0b3I6IHN0cmluZztcbiAgICAvLyBUaGUgaHVtYW4gcmVhZGFibGUgbmFtZSBmb3IgdGhlIENTUyBzZWxlY3RvclxuICAgIG5hbWU6IHN0cmluZztcbn1cblxudHlwZSBQYXR0ZXJuU2VsZWN0b3JNYXAgPSBSZWNvcmQ8c3RyaW5nLCBQYXR0ZXJuRGF0YT47XG5cbmludGVyZmFjZSBQYXR0ZXJuRGF0YSB7XG4gICAgLyoqXG4gICAgICogQW4gaW50ZXJmYWNlIHRvIGJ1bmRsZSB0b2dldGhlciBkYXRhIGluIHRoZSBDb25maWcgZm9yIGEgZ2l2ZW4gcGF0aCBwYXR0ZXJuLlxuICAgICAqIEl0IGNvbnRhaW5zIGEgbGlzdCBvZiBDU1Mgc2VsZWN0b3JzIGZvciB0aGUgcGF0aCBwYXR0ZXJuIGFuZCBvcHRpb25hbGx5XG4gICAgICogYW4gaWRTZWxlY3RvciBmdW5jdGlvbiB0aGF0IGV4dHJhY3RzIGFuIElEIGZyb20gcGFnZXMgd2l0aCB0aGUgY29ycmVzcG9uZGluZyBVUkxcbiAgICAgKi9cbiAgICAvLyBBIGxpc3Qgb2Ygc2VsZWN0b3JzIGFuZCBuYW1lcyBmb3IgdGhlIHBhZ2VcbiAgICBzZWxlY3RvcnM/OiBTZWxlY3Rvck5hbWVQYWlyW107XG4gICAgLy8gQSBmdW5jdGlvbiB0aGF0IGV4dHJhY3RzIG1ldGFkYXRhIGZyb20gdGhlIHBhZ2VcbiAgICBkYXRhRXh0cmFjdG9yPzogKCkgPT4gb2JqZWN0O1xufVxuXG5pbnRlcmZhY2UgQ29uZmlnIHtcbiAgICAvKipcbiAgICAgKiBBbiBpbnRlcmZhY2UgdGhhdCBjb250YWlucyBhbGwgdGhlIGRhdGEgcmVxdWlyZWQgdG8gaW5zdGFudGlhdGUgYSBNb25pdG9yLlxuICAgICAqL1xuICAgIC8vIFRoZSBiYXNlIFVSTCB0aGF0IHRoZSBtb25pdG9yIHNob3VsZCBzdGFydCBhdFxuICAgIGJhc2VVUkw6IHN0cmluZztcbiAgICAvLyBBIG1hcHBpbmcgb2YgVVJMIHBhdHRlcm5zIHRvIHBhdGggZGF0YS4gVGhlIFVSTCBQYXR0ZXJuIHNob3VsZCBmb2xsb3cgdGhlIFxuICAgIC8vIFVSTCBQYXR0ZXJuIEFQSSBzeW50YXguIFRoZXNlIGFyZSBhcHBlbmRlZCB0byB0aGUgYmFzZVVSTCB3aGVuIGNoZWNraW5nIGZvciBtYXRjaGVzXG4gICAgLy8gRXg6IGJhc2VVUkw6IHd3dy55b3V0dWJlLmNvbSwgcGF0aDogL3Nob3J0cy86aWQgLT4gd3d3LnlvdXR1YmUuY29tL3Nob3J0cy86aWRcbiAgICBwYXRoczogUGF0dGVyblNlbGVjdG9yTWFwO1xuICAgIC8vIEluZGljYXRlcyB3aGV0aGVyIHRoZSBNb25pdG9yIHNob3VsZCBiZSBpbiBkZWJ1ZyBtb2RlLiBJZiB0cnVlLCBhZGQgY29sb3VyZWQgYm94ZXNcbiAgICAvLyBhcm91bmQgc2VsZWN0ZWQgSFRNTCBlbGVtZW50c1xuICAgIGRlYnVnPzogYm9vbGVhbjtcbiAgICAvLyBBIGxpc3Qgb2YgZXZlbnQgdHlwZXMgdG8gbW9uaXRvci4gQnkgZGVmYXVsdCwgdGhpcyBpcyBqdXN0IFtcImNsaWNrXCJdXG4gICAgZXZlbnRzPzogc3RyaW5nW107XG59XG5cbmNsYXNzIEV4dHJhY3RvckRhdGEge1xuICAgIGV2ZW50VHlwZTogU2VuZGVyTWV0aG9kO1xuICAgIHVybFBhdHRlcm46IHN0cmluZztcbiAgICBleHRyYWN0b3I6ICgpID0+IG9iamVjdDtcbiAgICBjb25zdHJ1Y3RvcihhY3Rpdml0eVR5cGU6IFNlbmRlck1ldGhvZCwgdXJsUGF0dGVybjogc3RyaW5nLCBleHRyYWN0b3I6ICgpID0+IG9iamVjdCl7XG4gICAgICAgIHRoaXMuZXZlbnRUeXBlID0gYWN0aXZpdHlUeXBlO1xuICAgICAgICB0aGlzLnVybFBhdHRlcm4gPSB1cmxQYXR0ZXJuO1xuICAgICAgICB0aGlzLmV4dHJhY3RvciA9IGV4dHJhY3RvcjtcbiAgICB9XG59XG5cbmNsYXNzIEV4dHJhY3Rvckxpc3Qge1xuICAgIHByaXZhdGUgZXh0cmFjdG9yczogRXh0cmFjdG9yRGF0YVtdO1xuICAgIHByaXZhdGUgYmFzZVVSTDogc3RyaW5nO1xuICAgIGNvbnN0cnVjdG9yKGV4dHJhY3RvcnM6IEV4dHJhY3RvckRhdGFbXSA9IFtdLCBiYXNlVVJMOiBzdHJpbmcpe1xuICAgICAgICB0aGlzLmV4dHJhY3RvcnMgPSBleHRyYWN0b3JzO1xuICAgICAgICB0aGlzLmJhc2VVUkwgPSBiYXNlVVJMO1xuICAgIH1cblxuICAgIHB1YmxpYyBleHRyYWN0KGN1cnJlbnRVUkw6IHN0cmluZywgZXZlbnRUeXBlOiBTZW5kZXJNZXRob2Qpe1xuICAgICAgICBjb25zb2xlLmxvZyhgQXR0ZW1wdGluZyBleHRyYWN0aW9uIGZvciB1cmw6ICR7Y3VycmVudFVSTH0gYW5kIGV2ZW50IHR5cGUgJHtldmVudFR5cGV9YCk7XG4gICAgICAgIGxldCBleHRyYWN0ZWREYXRhOiBvYmplY3QgPSB7fTtcbiAgICAgICAgdGhpcy5leHRyYWN0b3JzLmZpbHRlcihlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0NvcnJlY3RBY3Rpdml0eSA9IChlLmV2ZW50VHlwZSA9PSBldmVudFR5cGUgfHwgZS5ldmVudFR5cGUgPT0gU2VuZGVyTWV0aG9kLkFueSk7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZTogSWdub3JpbmcgVHlwZVNjcmlwdCBlcnJvciBmb3IgVVJMUGF0dGVybiBub3QgZm91bmRcbiAgICAgICAgICAgICAgICBjb25zdCBwID0gbmV3IFVSTFBhdHRlcm4oZS51cmxQYXR0ZXJuLCB0aGlzLmJhc2VVUkwpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzVVJMTWF0Y2ggPSBwLnRlc3QoY3VycmVudFVSTCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzQ29ycmVjdEFjdGl2aXR5ICYmIGlzVVJMTWF0Y2g7XG4gICAgICAgICAgICB9KS5mb3JFYWNoKGUgPT5cbiAgICAgICAgICAgICAgICBleHRyYWN0ZWREYXRhID0gey4uLiBleHRyYWN0ZWREYXRhLCAuLi4gZS5leHRyYWN0b3IoKX1cbiAgICAgICAgICAgIClcbiAgICAgICAgcmV0dXJuIGV4dHJhY3RlZERhdGE7XG4gICAgfVxufVxuXG5jbGFzcyBDb25maWdMb2FkZXIge1xuICAgIHB1YmxpYyBjb25maWc6IENvbmZpZztcbiAgICBwdWJsaWMgZXh0cmFjdG9yTGlzdDogRXh0cmFjdG9yTGlzdDtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29uZmlnLCBleHRyYWN0b3JMaXN0OiBFeHRyYWN0b3JEYXRhW10gPSBbXSl7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICB0aGlzLmV4dHJhY3Rvckxpc3QgPSBuZXcgRXh0cmFjdG9yTGlzdChleHRyYWN0b3JMaXN0LCBjb25maWcuYmFzZVVSTCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQmFja2dyb3VuZE1lc3NhZ2UsIE1lc3NhZ2VSZXNwb25zZX0gZnJvbSBcIi4uL2NvbW11bmljYXRpb24vYmFja2dyb3VuZG1lc3NhZ2VcIjtcclxuaW1wb3J0IHtEQkRvY3VtZW50LCBBY3Rpdml0eURvY3VtZW50LCBTZXNzaW9uRG9jdW1lbnR9IGZyb20gXCIuLi9kYXRhYmFzZS9kYmRvY3VtZW50XCI7XHJcbmltcG9ydCB7Q29uZmlnTG9hZGVyLCBFeHRyYWN0b3JMaXN0LCBQYXR0ZXJuU2VsZWN0b3JNYXB9IGZyb20gXCIuL2NvbmZpZ1wiO1xyXG5pbXBvcnQgeyBQYWdlRGF0YSB9IGZyb20gXCIuL3BhZ2VkYXRhXCI7XHJcbmltcG9ydCB7IEFjdGl2aXR5VHlwZSB9IGZyb20gXCIuLi9jb21tdW5pY2F0aW9uL2FjdGl2aXR5XCI7XHJcbmltcG9ydCB7U2VuZGVyTWV0aG9kfSBmcm9tIFwiLi4vY29tbXVuaWNhdGlvbi9zZW5kZXJcIlxyXG5cclxuLyoqXHJcbiAqIFRoaXMgY2xhc3MgcmVhZHMgZnJvbSBhIHByb3ZpZGVkIENvbmZpZyBvYmplY3QgYW5kIGF0dGFjaGVzIGxpc3RlbmVycyB0byB0aGUgZWxlbWVudHMgc3BlY2lmaWVkIGluIHRoZSBzZWxlY3RvcnMuXHJcbiAqIFdoZW4gdGhlc2UgZWxlbWVudHMgYXJlIGludGVyYWN0ZWQgd2l0aCwgb3Igd2hlbiBhIG5hdmlnYXRpb24gb2NjdXJzLCBhIGRvY3VtZW50IGlzIHNlbnQgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0XHJcbiAqIHRvIGJlIGFwcGVuZGVkIHRvIHRoZSBkYXRhYmFzZS4gVGhpcyBjbGFzcyBpcyBpbnN0YW50aWF0ZWQgaW4gY29udGVudC50cy5cclxuICogXHJcbiAqIEBwYXJhbSBpbnRlcmFjdGlvbkV2ZW50cyAtIEEgbGlzdCBvZiB0aGUgdHlwZSBvZiBldmVudHMgd2Ugd2FudCB0byBtb25pdG9yIGFzIGludGVyYWN0aW9ucyAoZWcuIGNsaWNrLCBzY3JvbGwsIGV0Yy4pLiBEZWZhdWx0IGlzIGNsaWNrXHJcbiAqIEBwYXJhbSBkZWJ1ZyAtIElmIHRydWUsIGhpZ2hsaWdodCBhbGwgc2VsZWN0ZWQgSFRNTCBlbGVtZW50cyB3aXRoIGNvbG91cmVkIGJveGVzXHJcbiAqIEBwYXJhbSBwYXRocyAtIEFuIG9iamVjdCBtYXBwaW5nIHBhdGggcGF0dGVybnMgdG8gdGhlaXIgY29ycmVzcG9uZGluZyBDU1Mgc2VsZWN0b3JzIFBhdGggcGF0dGVybnMgYXJlIGNvbnNpc3RlbnQgd2l0aCB0aGUgIFVSTCBQYXR0ZXJuIEFQSSBTeW50YXg6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9VUkxfUGF0dGVybl9BUElcclxuICogQHBhcmFtIGJhc2VVUkwgLSBCYXNlIHVybCBmb3IgdGhlIHBhZ2UgKGVnLiB3d3cueW91dHViZS5jb20pLiBBbGwgcGF0aHMgYXJlIGFwcGVuZGVkIHRvIHRoaXMgd2hlbiBtYXRjaGluZyBVUmxzXHJcbiAqIEBwYXJhbSBjdXJyZW50UGFnZURhdGEgLSBDb250YWlucyBkYXRhIHJlbGV2YW50IHRvIHRoZSBjdXJyZW50IHBhZ2UuXHJcbiAqIEBwYXJhbSBpbnRlcmFjdGlvbkF0dHJpYnV0ZSAtIEF0dHJpYnV0ZSBhZGRlZCB0byBhbGwgZWxlbWVudHMgYmVpbmcgbW9uaXRvcmVkXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTW9uaXRvciB7XHJcbiAgICAvLyBBIGxpc3Qgb2YgdGhlIHR5cGUgb2YgZXZlbnRzIHdlIHdhbnQgdG8gbW9uaXRvciBhcyBpbnRlcmFjdGlvbnMgKGVnLiBjbGljaywgc2Nyb2xsLCBldGMuKS4gRGVmYXVsdCBpcyBjbGlja1xyXG4gICAgaW50ZXJhY3Rpb25FdmVudHM6IHN0cmluZ1tdO1xyXG4gICAgLy8gSWYgdHJ1ZSwgaGlnaGxpZ2h0IGFsbCBzZWxlY3RlZCBIVE1MIGVsZW1lbnRzIHdpdGggY29sb3VyZWQgYm94ZXNcclxuICAgIGhpZ2hsaWdodDogYm9vbGVhbjtcclxuICAgIC8vIEFuIG9iamVjdCBtYXBwaW5nIHBhdGggcGF0dGVybnMgdG8gdGhlaXIgY29ycmVzcG9uZGluZyBDU1Mgc2VsZWN0b3JzXHJcbiAgICAvLyBQYXRoIHBhdHRlcm5zIGFyZSBjb25zaXN0ZW50IHdpdGggdGhlIFVSTCBQYXR0ZXJuIEFQSSBTeW50YXg6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9VUkxfUGF0dGVybl9BUElcclxuICAgIHBhdGhzOiBQYXR0ZXJuU2VsZWN0b3JNYXA7XHJcbiAgICAvLyBCYXNlIHVybCBmb3IgdGhlIHBhZ2UgKGVnLiB3d3cueW91dHViZS5jb20pLiBBbGwgcGF0aHMgYXJlIGFwcGVuZGVkIHRvIHRoaXMgd2hlbiBtYXRjaGluZyBVUmxzXHJcbiAgICBiYXNlVVJMOiBzdHJpbmc7XHJcbiAgICAvLyBDb250YWlucyBkYXRhIHJlbGV2YW50IHRvIHRoZSBjdXJyZW50IHBhZ2UuXHJcbiAgICBjdXJyZW50UGFnZURhdGE6IFBhZ2VEYXRhO1xyXG4gICAgLy8gQXR0cmlidXRlIGFkZGVkIHRvIGFsbCBlbGVtZW50cyBiZWluZyBtb25pdG9yZWRcclxuICAgIGludGVyYWN0aW9uQXR0cmlidXRlOiBzdHJpbmc7XHJcblxyXG4gICAgZXh0cmFjdG9yTGlzdDogRXh0cmFjdG9yTGlzdDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWdMb2FkZXI6IENvbmZpZ0xvYWRlcikge1xyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IGNvbmZpZ0xvYWRlci5jb25maWc7XHJcbiAgICAgICAgdGhpcy5pbnRlcmFjdGlvbkV2ZW50cyA9IGNvbmZpZy5ldmVudHMgPz8gWydjbGljayddO1xyXG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnBhdGhzID0gY29uZmlnLnBhdGhzO1xyXG4gICAgICAgIHRoaXMuYmFzZVVSTCA9IGNvbmZpZy5iYXNlVVJMO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhID0gbmV3IFBhZ2VEYXRhKCk7XHJcbiAgICAgICAgdGhpcy5pbnRlcmFjdGlvbkF0dHJpYnV0ZSA9IFwibW9uaXRvcmluZy1pbnRlcmFjdGlvbnNcIlxyXG4gICAgICAgIHRoaXMuZXh0cmFjdG9yTGlzdCA9IGNvbmZpZ0xvYWRlci5leHRyYWN0b3JMaXN0OyBcclxuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gPT09IHRoaXMuYmFzZVVSTCkge1xyXG4gICAgICAgICAgICBjb25zdCBydW5XaGVuVmlzaWJsZSA9ICgpID0+IHsgIC8vIFJlbW92ZSBhc3luYyBoZXJlXHJcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAndmlzaWJsZScpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBXcmFwIHRoZSBhc3luYyBjYWxsIGFuZCBoYW5kbGUgZXJyb3JzXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplTW9uaXRvcigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCBydW5XaGVuVmlzaWJsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBpbml0aWFsaXppbmcgbW9uaXRvcjonLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTdGlsbCByZW1vdmUgbGlzdGVuZXIgZXZlbiBpZiB0aGVyZSdzIGFuIGVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgcnVuV2hlblZpc2libGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XHJcbiAgICAgICAgICAgICAgICBydW5XaGVuVmlzaWJsZSgpOyAvLyBUaGlzIHdpbGwgbm93IGJlIHN5bmNocm9ub3VzXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHsgIC8vIFJlbW92ZSBhc3luYyBoZXJlXHJcbiAgICAgICAgICAgICAgICAgICAgcnVuV2hlblZpc2libGUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgcnVuV2hlblZpc2libGUpO1xyXG4gICAgICAgIH0gIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIG1vbml0b3IgaWYgYmFzZSBVUkwgbWF0Y2hlcyB0aGUgY3VycmVudCBVUkxcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhc3luYyBpbml0aWFsaXplTW9uaXRvcigpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImluaXRpYWxpemluZyBtb25pdG9yXCIpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ3VycmVudFBhZ2VEYXRhKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZXMgYSBuZXcgZW50cnkgaW4gdGhlIERCIGRlc2NyaWJpbmcgdGhlIHN0YXRlIGF0IHRoZSBzdGFydCBvZiB0aGUgc2Vzc2lvblxyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmluaXRpYWxpemVTZXNzaW9uKCk7XHJcbiAgICAgICAgICAgIC8vIEJpbmRzIGxpc3RlbmVycyB0byB0aGUgSFRNTCBlbGVtZW50cyBzcGVjaWZpZWQgaW4gdGhlIGNvbmZpZyBmb3IgYWxsIG1hdGNoaW5nIHBhdGggcGF0dGVybnNcclxuICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gaW5pdGlhbGl6ZSBzZXNzaW9uOlwiLCBlcnIpO1xyXG4gICAgICAgIH1cclxufVxyXG4gICAgLyoqXHJcbiAgICogVXBkYXRlcyB0aGUgcGFnZSBkYXRhIHdoZW5ldmVyIGEgbmV3IHBhZ2UgaXMgZGV0ZWN0ZWRcclxuICAgKiBAcGFyYW0gdXJsIC0gdGhlIHVybCBvZiB0aGUgbmV3IHBhZ2VcclxuICAgKi9cclxuICAgIHByaXZhdGUgdXBkYXRlQ3VycmVudFBhZ2VEYXRhKHVybDogc3RyaW5nKXtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlRGF0YS51cGRhdGUodGhpcy5iYXNlVVJMLCB1cmwsIHRoaXMucGF0aHMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBuZXcgZW50cnkgaW4gdGhlIERCIGRlc2NyaWJpbmcgdGhlIHN0YXRlIGF0IHRoZSBzdGFydCBvZiB0aGUgc2Vzc2lvblxyXG4gICAqL1xyXG4gICAgcHJpdmF0ZSBhc3luYyBpbml0aWFsaXplU2Vzc2lvbigpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBjdXJyZW50U3RhdGUgPSBuZXcgU2Vzc2lvbkRvY3VtZW50KHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCwgZG9jdW1lbnQudGl0bGUpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ2hlY2tpbmcgaGlnaGxpZ2h0XCIpO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5zZW5kTWVzc2FnZVRvQmFja2dyb3VuZChTZW5kZXJNZXRob2QuSW5pdGlhbGl6ZVNlc3Npb24sIGN1cnJlbnRTdGF0ZSk7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlPy5zdGF0dXMgPT09IFwiU2Vzc2lvbiBpbml0aWFsaXplZFwiICYmIHJlc3BvbnNlLmhpZ2hsaWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLmhpZ2hsaWdodCA9IHJlc3BvbnNlLmhpZ2hsaWdodDsgLy8gVHlwZVNjcmlwdCBrbm93cyBoaWdobGlnaHQgZXhpc3RzIGhlcmVcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coYEhpZ2hsaWdodCBpcyBzZXQgdG8gJHt0aGlzLmhpZ2hsaWdodH1gKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIEJpbmRzIGV2ZW50IGxpc3RlbmVycyBmb3IgbXV0YXRpb25zIGFuZCBuYXZpZ2F0aW9uXHJcbiAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBiaW5kRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIC8vIFdoZW5ldmVyIG5ldyBjb250ZW50IGlzIGxvYWRlZCwgYXR0YWNoIG9ic2VydmVycyB0byBlYWNoIEhUTUwgZWxlbWVudCB0aGF0IG1hdGNoZXMgdGhlIHNlbGVjdG9ycyBpbiB0aGUgY29uZmlnc1xyXG4gICAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4gdGhpcy5hZGRMaXN0ZW5lcnNUb05ld01hdGNoZXMoKSk7XHJcbiAgICAgICAgLy8gTWFrZSB0aGUgbXV0YXRpb24gb2JzZXJ2ZXIgb2JzZXJ2ZSB0aGUgZW50aXJlIGRvY3VtZW50IGZvciBjaGFuZ2VzXHJcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7XHJcbiAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcclxuICAgICAgICAgICAgc3VidHJlZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBBZGQgYW4gZXZlbnQgbGlzdGVuZXIgdG8gZGV0ZWN0IG5hdmlnYXRpb25zIG9uIHRoZSBwYWdlXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZTogSWdub3JpbmcgVHlwZVNjcmlwdCBlcnJvciBmb3IgbmF2aWdhdGlvbiBub3QgZm91bmRcclxuICAgICAgICBuYXZpZ2F0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJuYXZpZ2F0ZVwiLCAoZTogRXZlbnQpID0+IHRoaXMub25OYXZpZ2F0aW9uRGV0ZWN0aW9uKGUpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgKiBBZGRzIGxpc3RlbmVycyB0byBtdXRhdGlvbnMgKGllLiBuZXdseSByZW5kZXJlZCBlbGVtZW50cykgYW5kIG1hcmtzIHRoZW0gd2l0aCB0aGlzLmludGVyYWN0dGlvbkF0dHJpYnV0ZS5cclxuICAgKiBJZiBkZWJ1ZyBtb2RlIGlzIG9uLCB0aGlzIHdpbGwgYWRkIGEgY29sb3VyZnVsIGJvcmRlciB0byB0aGVzZSBlbGVtZW50cy5cclxuICAgKi9cclxuXHJcbiAgICBwcml2YXRlIGFkZExpc3RlbmVyc1RvTmV3TWF0Y2hlcygpOiB2b2lkIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImFkZGluZyBzZWxlY3RvcnNcIik7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coYFZhbHVlIG9mIGhpZ2hsaWdodDogJHt0aGlzLmhpZ2hsaWdodH1gKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkN1cnJlbnQgcGFnZSBkYXRhOlwiKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRQYWdlRGF0YSk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGFnZURhdGEuc2VsZWN0b3JzLmZvckVhY2goaW50ZXJhY3Rpb24gPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYDppcygke2ludGVyYWN0aW9uLnNlbGVjdG9yfSk6bm90KFske3RoaXMuaW50ZXJhY3Rpb25BdHRyaWJ1dGV9XSlgKTtcclxuICAgICAgICAgICAgY29uc3QgbmFtZSA9IGludGVyYWN0aW9uLm5hbWU7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBlbGVtZW50cyl7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oaWdobGlnaHQpIChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5zdHlsZS5ib3JkZXIgPSBgMnB4IHNvbGlkICR7dGhpcy5TdHJpbmdUb0NvbG9yLm5leHQobmFtZSl9YDtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKHRoaXMuaW50ZXJhY3Rpb25BdHRyaWJ1dGUsICd0cnVlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpZSBvZiB0aGlzLmludGVyYWN0aW9uRXZlbnRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGllLCAoZTogRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkludGVyYWN0aW9uRGV0ZWN0aW9uKGVsZW1lbnQsIGUsIG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogU2VuZHMgYSBtZXNzYWdlIHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdC5cclxuICAgKiBAcGFyYW0gZXZlbnQgLSB0aGUgSFRNTCBldmVudCB0aGF0IG9jY3VyZWRcclxuICAgKiBAcmV0dXJucyBBIGRvY3VtZW50IGRlc2NyaWJpbmcgdGhlIHN0YXRlIGNoYW5nZVxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlU3RhdGVDaGFuZ2VSZWNvcmQoZXZlbnQ6IEV2ZW50KTogREJEb2N1bWVudCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJEZXRlY3RlZCBzdGF0ZSBjaGFuZ2UgZXZlbnRcIik7XHJcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSB0aGlzLmV4dHJhY3Rvckxpc3QuZXh0cmFjdCh0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmwsIFNlbmRlck1ldGhvZC5OYXZpZ2F0aW9uRGV0ZWN0aW9uKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInByaW50aW5nIG1ldGFkYXRhXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG1ldGFkYXRhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBY3Rpdml0eURvY3VtZW50KEFjdGl2aXR5VHlwZS5TdGF0ZUNoYW5nZSwgZXZlbnQsIG1ldGFkYXRhLCB0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmwsIGRvY3VtZW50LnRpdGxlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0LlxyXG4gICAqIEBwYXJhbSBldmVudCAtIHRoZSBIVE1MIGV2ZW50IHRoYXQgb2NjdXJlZFxyXG4gICAqIEBwYXJhbSB1cmxDaGFuZ2UgLSBpbmRpY2F0ZXMgd2hldGhlciB0aGUgc2VsZi1sb29wIHJlc3VsdGVkIGluIGEgdXJsIGNoYW5nZVxyXG4gICAqIFxyXG4gICAqIEByZXR1cm5zIEEgZG9jdW1lbnQgZGVzY3JpYmluZyBzZWxmIGxvb3BcclxuICAgKi9cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVNlbGZMb29wUmVjb3JkKGV2ZW50OiBFdmVudCk6IERCRG9jdW1lbnQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGV0ZWN0ZWQgc2VsZiBsb29wIGNoYW5nZSBldmVudFwiKTtcclxuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IHRoaXMuZXh0cmFjdG9yTGlzdC5leHRyYWN0KHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCwgU2VuZGVyTWV0aG9kLk5hdmlnYXRpb25EZXRlY3Rpb24pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicHJpbnRpbmcgbWV0YWRhdGFcIik7XHJcbiAgICAgICAgY29uc29sZS5sb2cobWV0YWRhdGEpO1xyXG4gICAgICAgIHJldHVybiBuZXcgQWN0aXZpdHlEb2N1bWVudChBY3Rpdml0eVR5cGUuU2VsZkxvb3AsIGV2ZW50LCBtZXRhZGF0YSwgdGhpcy5jdXJyZW50UGFnZURhdGEudXJsLCBkb2N1bWVudC50aXRsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogU2VuZHMgYSBtZXNzYWdlIHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdC5cclxuICAgKiBAcGFyYW0gZWxlbWVudCAtIHRoZSBlbGVtZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBldmVudFxyXG4gICAqIEBwYXJhbSBuYW1lIC0gdGhlIG5hbWUgb2YgdGhlIGVsZW1lbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIGNhbGxiYWNrIChhcyBkZWZpbmVkIGluIHRoZSBjb25maWcpXHJcbiAgICogQHBhcmFtIGV2ZW50IC0gdGhlIEhUTUwgZXZlbnQgdGhhdCBvY2N1cmVkXHJcbiAgICogQHJldHVybnMgQSBkb2N1bWVudCBpbnRlcmFjdGlvbiBzZWxmIGxvb3BcclxuICAgKi9cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZUludGVyYWN0aW9uUmVjb3JkKGVsZW1lbnQ6IEVsZW1lbnQsIG5hbWU6IHN0cmluZywgZXZlbnQ6IEV2ZW50KTogREJEb2N1bWVudCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJEZXRlY3RlZCBpbnRlcmFjdGlvbiBldmVudFwiKTtcclxuICAgICAgICBsZXQgbWV0YWRhdGE6IHtodG1sOiBzdHJpbmcsIGVsZW1lbnROYW1lOiBzdHJpbmc7IGlkPzogc3RyaW5nfSA9IHtcclxuICAgICAgICAgICAgaHRtbDogZWxlbWVudC5nZXRIVE1MKCksXHJcbiAgICAgICAgICAgIGVsZW1lbnROYW1lOiBuYW1lLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3QgZXh0cmFjdGVkRGF0YSA9IHRoaXMuZXh0cmFjdG9yTGlzdC5leHRyYWN0KHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCwgU2VuZGVyTWV0aG9kLkludGVyYWN0aW9uRGV0ZWN0aW9uKTtcclxuXHJcbiAgICAgICAgbWV0YWRhdGEgPSB7Li4uIG1ldGFkYXRhLCAuLi4gZXh0cmFjdGVkRGF0YX07XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicHJpbnRpbmcgbWV0YWRhdGFcIik7XHJcbiAgICAgICAgY29uc29sZS5sb2cobWV0YWRhdGEpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBY3Rpdml0eURvY3VtZW50KEFjdGl2aXR5VHlwZS5JbnRlcmFjdGlvbiwgZXZlbnQsIG1ldGFkYXRhLCB0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmwsIGRvY3VtZW50LnRpdGxlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0LlxyXG4gICAqIEBwYXJhbSBzZW5kZXIgLSB0aGUgbmFtZSBvZiB0aGUgZnVuY3Rpb24gdGhhdCdzIHNlbmRpbmcgdGhlIG1lc3NhZ2UgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0XHJcbiAgICogQHBhcmFtIHBheWxvYWQgLSB0aGUgZGF0YSBiZWluZyBzZW50IHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdFxyXG4gICAqIFxyXG4gICAqIEByZXR1cm5zIFJlc3BvbnNlIGluZGljYXRpbmcgd2hldGhlciB0aGUgbWVzc2FnZSBzdWNjZWVkZWRcclxuICAgKi9cclxuXHJcbiAgICBwcml2YXRlIGFzeW5jIHNlbmRNZXNzYWdlVG9CYWNrZ3JvdW5kKHNlbmRlck1ldGhvZDogU2VuZGVyTWV0aG9kLCBwYXlsb2FkOiBEQkRvY3VtZW50KTogUHJvbWlzZTxNZXNzYWdlUmVzcG9uc2UgfCBudWxsPiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgcnVudGltZSBpcyBhdmFpbGFibGUgKGV4dGVuc2lvbiBjb250ZXh0IHN0aWxsIHZhbGlkKVxyXG4gICAgICAgICAgICBpZiAoIWNocm9tZS5ydW50aW1lPy5pZCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHRlbnNpb24gY29udGV4dCBpbnZhbGlkYXRlZCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gbmV3IEJhY2tncm91bmRNZXNzYWdlKHNlbmRlck1ldGhvZCwgcGF5bG9hZCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlIDogTWVzc2FnZVJlc3BvbnNlID0gYXdhaXQgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBDaHJvbWUgcmV0dXJucyB1bmRlZmluZWQgaWYgbm8gbGlzdGVuZXJzLCBjaGVjayBpZiB0aGF0J3MgZXhwZWN0ZWRcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ05vIHJlc3BvbnNlIGZyb20gYmFja2dyb3VuZCBzY3JpcHQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignQmFja2dyb3VuZCBtZXNzYWdlIGZhaWxlZDonLCBlcnJvcik7XHJcbiAgICAgICAgICAgIC8vIERlY2lkZSB3aGV0aGVyIHRvIHRocm93IG9yIGhhbmRsZSBncmFjZWZ1bGx5IGJhc2VkIG9uIHlvdXIgbmVlZHNcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7IC8vIG9yIHRocm93IGVycm9yO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgKiBDYWxsYmFjayB0aGF0IGNyZWF0ZXMgYSBwYXlsb2FkIGRlc2NyaWJpbmcgdGhlIGludGVyYWN0aW9uIHRoYXQgb2NjdXJlZCBhbmQgc2VuZHMgaXQgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0XHJcbiAgICogQHBhcmFtIGUgLSB0aGUgZXZlbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIGNhbGxiYWNrXHJcbiAgICogQHBhcmFtIG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJlZCB0aGUgY2FsbGJhY2sgKGFzIGRlZmluZWQgaW4gdGhlIGNvbmZpZylcclxuICAgKi9cclxuXHJcbiAgICBwcml2YXRlIG9uSW50ZXJhY3Rpb25EZXRlY3Rpb24oZWxlbWVudDogRWxlbWVudCwgZTogRXZlbnQsIG5hbWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW50ZXJhY3Rpb24gZXZlbnQgZGV0ZWN0ZWRcIik7XHJcbiAgICAgICAgY29uc29sZS5sb2coYEV2ZW50IGRldGVjdGVkIHdpdGggZXZlbnQgdHlwZTogJHtlLnR5cGV9YCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coYEV2ZW50IHRyaWdnZXJlZCBieSAke2VsZW1lbnR9YCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudC5pbm5lckhUTUwpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnQuZ2V0SFRNTCgpKTtcclxuICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmNyZWF0ZUludGVyYWN0aW9uUmVjb3JkKGVsZW1lbnQsIG5hbWUsIGUpO1xyXG4gICAgICAgIHRoaXMuc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoU2VuZGVyTWV0aG9kLkludGVyYWN0aW9uRGV0ZWN0aW9uLCByZWNvcmQpXHJcbiAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHNlbmQgaW50ZXJhY3Rpb24gZGF0YTonLCBlcnJvcik7XHJcbiAgICAgICAgICAgIC8vIE1heWJlIHF1ZXVlIGZvciByZXRyeSwgb3IganVzdCBsb2cgYW5kIGNvbnRpbnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsYmFjayB0aGF0IGNyZWF0ZXMgYSBwYXlsb2FkIGRlc2NyaWJpbmcgdGhlIG5hdmlnYXRpb24gdGhhdCBvY2N1cmVkIGFuZCBzZW5kcyBpdCB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHRcclxuICAgICAqIEBwYXJhbSBlIC0gdGhlIGV2ZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBjYWxsYmFja1xyXG4gICAgICogQHBhcmFtIG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJlZCB0aGUgY2FsbGJhY2sgKGFzIGRlZmluZWQgaW4gdGhlIGNvbmZpZylcclxuICAgICAqL1xyXG4gICAgLy8gQHRzLWlnbm9yZTogSWdub3JpbmcgVHlwZVNjcmlwdCBlcnJvciBmb3IgTmF2aWdhdGVFdmVudCBub3QgZm91bmRcclxuICAgIHByaXZhdGUgb25OYXZpZ2F0aW9uRGV0ZWN0aW9uKG5hdkV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBiYXNlVVJMQ2hhbmdlID0gbmF2RXZlbnQuZGVzdGluYXRpb24udXJsLnNwbGl0KFwiLlwiKVsxXSAhPSB0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmwuc3BsaXQoXCIuXCIpWzFdXHJcbiAgICAgICAgLy8gY29uc3QgdXJsQ2hhbmdlID0gIShuYXZFdmVudC5kZXN0aW5hdGlvbi51cmwgPT09IHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCk7XHJcbiAgICAgICAgLy8gbGV0IHNvdXJjZVN0YXRlID0gdGhpcy5nZXRDbGVhblN0YXRlTmFtZSgpO1xyXG4gICAgICAgIC8vIGxldCBtYXRjaCA9IHRoaXMuY3VycmVudFBhZ2VEYXRhLmNoZWNrRm9yTWF0Y2gobmF2RXZlbnQuZGVzdGluYXRpb24udXJsKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGFnZURhdGEudXJsID0gbmF2RXZlbnQuZGVzdGluYXRpb24udXJsO1xyXG4gICAgICAgIC8vIGxldCBkZXN0U3RhdGUgPSB0aGlzLmdldENsZWFuU3RhdGVOYW1lKCk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGBOYXZpZ2F0aW9uIGRldGVjdGVkIHdpdGggZXZlbnQgdHlwZTogJHtuYXZFdmVudC50eXBlfWApXHJcbiAgICAgICAgaWYgKGJhc2VVUkxDaGFuZ2Upe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVSTCBiYXNlIGNoYW5nZSBkZXRlY3RlZC4gQ2xvc2luZyBwcm9ncmFtLlwiKTtcclxuICAgICAgICAgICAgdGhpcy5zZW5kTWVzc2FnZVRvQmFja2dyb3VuZChTZW5kZXJNZXRob2QuQ2xvc2VTZXNzaW9uLCBuZXcgREJEb2N1bWVudCh0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmwsIGRvY3VtZW50LnRpdGxlKSkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gc2VuZCBpbnRlcmFjdGlvbiBkYXRhOicsIGVycm9yKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG5hdkV2ZW50Lm5hdmlnYXRpb25UeXBlID09PSBcInB1c2hcIikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlB1c2ggZXZlbnQgZGV0ZWN0ZWQuXCIpO1xyXG4gICAgICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmNyZWF0ZVN0YXRlQ2hhbmdlUmVjb3JkKG5hdkV2ZW50KTtcclxuICAgICAgICAgICAgdGhpcy5zZW5kTWVzc2FnZVRvQmFja2dyb3VuZChTZW5kZXJNZXRob2QuTmF2aWdhdGlvbkRldGVjdGlvbiwgcmVjb3JkKS5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBzZW5kIGludGVyYWN0aW9uIGRhdGE6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVDdXJyZW50UGFnZURhdGEodGhpcy5jdXJyZW50UGFnZURhdGEudXJsKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG5hdkV2ZW50Lm5hdmlnYXRpb25UeXBlID09PSBcInJlcGxhY2VcIikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlcGxhY2UgZXZlbnQgZGV0ZWN0ZWQuXCIpO1xyXG4gICAgICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmNyZWF0ZVNlbGZMb29wUmVjb3JkKG5hdkV2ZW50KTtcclxuICAgICAgICAgICAgdGhpcy5zZW5kTWVzc2FnZVRvQmFja2dyb3VuZChTZW5kZXJNZXRob2QuTmF2aWdhdGlvbkRldGVjdGlvbiwgcmVjb3JkKS5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBzZW5kIGludGVyYWN0aW9uIGRhdGE6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAqIEdlbmVyYXRlcyBhIHVuaXF1ZSBjb2xvciBmcm9tIGEgZ2l2ZW4gc3RyaW5nXHJcbiAgICogU291cmNlOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzEwMzczODMgXHJcbiAgICogQHJldHVybnMgQ29sb3IgaGV4IGNvZGVcclxuICAgKi9cclxuXHJcbiAgICBwcml2YXRlIFN0cmluZ1RvQ29sb3IgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGludGVyZmFjZSBDb2xvckluc3RhbmNlIHtcclxuICAgICAgICAgICAgc3RyaW5nVG9Db2xvckhhc2g6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XHJcbiAgICAgICAgICAgIG5leHRWZXJ5RGlmZmVybnRDb2xvcklkeDogbnVtYmVyO1xyXG4gICAgICAgICAgICB2ZXJ5RGlmZmVyZW50Q29sb3JzOiBzdHJpbmdbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpbnN0YW5jZTogQ29sb3JJbnN0YW5jZSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBuZXh0OiBmdW5jdGlvbiBzdHJpbmdUb0NvbG9yKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgICAgIGlmIChpbnN0YW5jZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmdUb0NvbG9ySGFzaDoge30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRWZXJ5RGlmZmVybnRDb2xvcklkeDogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmVyeURpZmZlcmVudENvbG9yczogW1wiIzAwRkYwMFwiLCBcIiMwMDAwRkZcIiwgXCIjRkYwMDAwXCIsIFwiIzAxRkZGRVwiLCBcIiNGRkE2RkVcIiwgXCIjRkZEQjY2XCIsIFwiIzAwNjQwMVwiLCBcIiMwMTAwNjdcIiwgXCIjOTUwMDNBXCIsIFwiIzAwN0RCNVwiLCBcIiNGRjAwRjZcIiwgXCIjRkZFRUU4XCIsIFwiIzc3NEQwMFwiLCBcIiM5MEZCOTJcIiwgXCIjMDA3NkZGXCIsIFwiI0Q1RkYwMFwiLCBcIiNGRjkzN0VcIiwgXCIjNkE4MjZDXCIsIFwiI0ZGMDI5RFwiLCBcIiNGRTg5MDBcIiwgXCIjN0E0NzgyXCIsIFwiIzdFMkREMlwiLCBcIiM4NUE5MDBcIiwgXCIjRkYwMDU2XCIsIFwiI0E0MjQwMFwiLCBcIiMwMEFFN0VcIiwgXCIjNjgzRDNCXCIsIFwiI0JEQzZGRlwiLCBcIiMyNjM0MDBcIiwgXCIjQkREMzkzXCIsIFwiIzAwQjkxN1wiLCBcIiM5RTAwOEVcIiwgXCIjMDAxNTQ0XCIsIFwiI0MyOEM5RlwiLCBcIiNGRjc0QTNcIiwgXCIjMDFEMEZGXCIsIFwiIzAwNDc1NFwiLCBcIiNFNTZGRkVcIiwgXCIjNzg4MjMxXCIsIFwiIzBFNENBMVwiLCBcIiM5MUQwQ0JcIiwgXCIjQkU5OTcwXCIsIFwiIzk2OEFFOFwiLCBcIiNCQjg4MDBcIiwgXCIjNDMwMDJDXCIsIFwiI0RFRkY3NFwiLCBcIiMwMEZGQzZcIiwgXCIjRkZFNTAyXCIsIFwiIzYyMEUwMFwiLCBcIiMwMDhGOUNcIiwgXCIjOThGRjUyXCIsIFwiIzc1NDRCMVwiLCBcIiNCNTAwRkZcIiwgXCIjMDBGRjc4XCIsIFwiI0ZGNkU0MVwiLCBcIiMwMDVGMzlcIiwgXCIjNkI2ODgyXCIsIFwiIzVGQUQ0RVwiLCBcIiNBNzU3NDBcIiwgXCIjQTVGRkQyXCIsIFwiI0ZGQjE2N1wiLCBcIiMwMDlCRkZcIiwgXCIjRTg1RUJFXCJdXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWluc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoW3N0cl0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZS5zdHJpbmdUb0NvbG9ySGFzaFtzdHJdID0gaW5zdGFuY2UudmVyeURpZmZlcmVudENvbG9yc1tpbnN0YW5jZS5uZXh0VmVyeURpZmZlcm50Q29sb3JJZHgrK107XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCVjIFRoZSBjb2xvdXIgZm9yICR7c3RyfWAsIGBjb2xvcjogJHtpbnN0YW5jZS5zdHJpbmdUb0NvbG9ySGFzaFtzdHJdfWApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoW3N0cl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSkoKTtcclxufVxyXG4iLCJpbXBvcnQge1NlbGVjdG9yTmFtZVBhaXIsIFBhdHRlcm5EYXRhLCBQYXR0ZXJuU2VsZWN0b3JNYXAgfSBmcm9tIFwiLi9jb25maWdcIjtcclxuLyoqXHJcbiAqIEEgY2xhc3MgcmVzcG9uc2libGUgZm9yIHRyYWNraW5nIHRoZSBzdGF0ZSBvZiB0aGUgcGFnZSB0aGF0IHRoZSB1c2VyIGlzIGN1cnJlbnRseSBvbi5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBQYWdlRGF0YSB7XHJcbiAgICAvLyBVUkwgb2YgdGhlIHBhZ2VcclxuICAgIHVybCE6IHN0cmluZztcclxuICAgIC8vIENTUyBzZWxlY3RvcnMgYmVpbmcgYXBwbGllZCB0byB0aGUgcGFnZVxyXG4gICAgc2VsZWN0b3JzITogU2VsZWN0b3JOYW1lUGFpcltdO1xyXG4gICAgLy8gVGhlIFVSTCBwYXR0ZXJuLCBDU1Mgc2VsZWN0b3JzLCBhbmQgb3B0aW9uYWxseSBhIGZ1bmN0aW9uIGZvciBnZXR0aW5nIHBhZ2UgSUQgXHJcbiAgICAvLyBmb3IgdGhlIHBhdHRlcm4gdGhhdCBtb3N0IGNsb3NlbHkgbWF0Y2hlcyB0aGlzLnVybFxyXG4gICAgLy8gRXg6IElmIHRoZSB1cmwgaXMgd3d3LnlvdXR1YmUuY29tL3Nob3J0cy9BQkMgYW5kIHRoZSBwYXR0ZXJucyBhcmUgLyogYW5kIC9zaG9ydHMvOmlkLCB0aGVuIFxyXG4gICAgLy8gbWF0Y2hQYXRoRGF0YSB3b3VsZCBjb250YWluIHRoZSBQYXRoRGF0YSBmb3IgL3Nob3J0cy86aWQsIHNpbmNlIGl0cyBhIGNsb3NlciBtYXRjaCB0byB0aGUgVVJMLlxyXG4gICAgbWF0Y2hQYXRoRGF0YSE6IFBhdHRlcm5EYXRhOyBcclxuICAgIGN1cnJlbnRQYXR0ZXJuITogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKiBVcGRhdGVzIHRoZSBzdGF0ZSBvZiB0aGUgUGFnZURhdGFcclxuICAgICAqIEBwYXJhbSBiYXNlVVJMOiBUaGUgYmFzZSB1cmwgZm9yIHRoZSBwYWdlIChlZy4gd3d3LnlvdXR1YmUuY29tKVxyXG4gICAgICogQHBhcmFtIHVybDogVGhlIGZ1bGwgdXJsIG9mIHRoZSBjdXJyZW50IHBhZ2VcclxuICAgICAqIEBwYXJhbSBwYXRoczogQSBsaXN0IG9mIGFsbCB0aGUgcGF0aHMgZGVmaW5lZCBpbiBhIGNvbmZpZ1xyXG4gICAgICovXHJcbiAgICB1cGRhdGUoYmFzZVVSTDogc3RyaW5nLCB1cmw6IHN0cmluZywgcGF0aHM6IFBhdHRlcm5TZWxlY3Rvck1hcCl7XHJcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XHJcbiAgICAgICAgY29uc3QgbWF0Y2hlcyA9IHRoaXMudXBkYXRlTWF0Y2hEYXRhKGJhc2VVUkwsIHBhdGhzKTtcclxuICAgICAgICB0aGlzLnNlbGVjdG9ycyA9IHRoaXMuZ2V0U2VsZWN0b3JzKG1hdGNoZXMsIHBhdGhzKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyBgbWF0Y2hQYXRoRGF0YWAgdG8gYmUgdGhlIFBhdGhEYXRhIGZvciB0aGUgVVJMIHBhdHRlcm4gd2l0aCB0aGUgY2xvc2V0IG1hdGNoIHRvIGBiYXNlVVJMYFxyXG4gICAgICogYW5kIHJldHVybnMgYSBsaXN0IG9mIGFsbCBtYXRjaGVzLiBBZGRpdGlvbmFsbHksIGl0IHVwZGF0ZXMgd2hldGhlciB0aGUgY3VycmVudCBwYXRoXHJcbiAgICAgKiBpbmNsdWRlcyBhbiBpZC5cclxuICAgICAqIEBwYXJhbSBiYXNlVVJMOiBUaGUgYmFzZSB1cmwgZm9yIHRoZSBwYWdlIChlZy4gd3d3LnlvdXR1YmUuY29tKVxyXG4gICAgICogQHBhcmFtIHBhdHRlcm5zOiBBIGxpc3Qgb2YgYWxsIHRoZSBwYXRocyBkZWZpbmVkIGluIGEgY29uZmlnXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm5zIEEgbGlzdCBvZiBhbGwgcGF0dGVybnMgaW4gdGhlIGNvbmZpZyB0aGF0IG1hdGNoIGBiYXNlVVJMYFxyXG4gICAgICovXHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVNYXRjaERhdGEoYmFzZVVSTDogc3RyaW5nLCBwYXR0ZXJuczogUGF0dGVyblNlbGVjdG9yTWFwKTogc3RyaW5nW117XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ1cGRhdGluZyBwYWdlIGRhdGFcIik7XHJcbiAgICAgICAgbGV0IGNsb3Nlc3RNYXRjaCA9IFwiXCI7IC8vIHRoZSBwYXR0ZXJuIHRoYXQgbW9zdCBjbG9zZWx5IG1hdGNoZXMgdGhlIGN1cnJlbnQgVVJMXHJcblxyXG4gICAgICAgIC8vIEdldCBhIGxpc3Qgb2YgYWxsIHRoZSBwYXRocyB0aGF0IG1hdGNoIHRoZSBjdXJyZW50IFVSTFxyXG4gICAgICAgIGNvbnN0IG1hdGNoZXMgPSBPYmplY3Qua2V5cyhwYXR0ZXJucykuZmlsdGVyKChwYXRoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHBhdGgpO1xyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlOiBJZ25vcmluZyBUeXBlU2NyaXB0IGVycm9yIGZvciBVUkxQYXR0ZXJuIG5vdCBmb3VuZFxyXG4gICAgICAgICAgICBjb25zdCBwID0gbmV3IFVSTFBhdHRlcm4ocGF0aCwgYmFzZVVSTCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gcC50ZXN0KHRoaXMudXJsKTtcclxuICAgICAgICAgICAgLy8gQ2xvc2VzdCBtYXRjaCBpcyB0aGUgbG9uZ2VzdCBwYXR0ZXJuIHRoYXQgbWF0Y2hlcyB0aGUgY3VycmVudCBVUkxcclxuICAgICAgICAgICAgaWYgKG1hdGNoICYmIHBhdGgubGVuZ3RoID4gY2xvc2VzdE1hdGNoLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgY2xvc2VzdE1hdGNoID0gcGF0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbWF0Y2g7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFBhdHRlcm4gPSBjbG9zZXN0TWF0Y2g7XHJcblxyXG4gICAgICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vIG1hdGNoZXMgZm91bmRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB0aGlzLnVybFVzZXNJZCA9IGNsb3Nlc3RNYXRjaC5lbmRzV2l0aChcIjppZFwiKTtcclxuICAgICAgICB0aGlzLm1hdGNoUGF0aERhdGEgPSBwYXR0ZXJuc1tjbG9zZXN0TWF0Y2hdO1xyXG4gICAgICAgIHJldHVybiBtYXRjaGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIG1hdGNoZXM6IEEgbGlzdCBvZiBhbGwgbWF0Y2hpbmcgcGF0aHMgdG8gdGhlIGN1cnJlbnQgdXJsXHJcbiAgICAgKiBAcGFyYW0gcGF0aHM6IEEgbGlzdCBvZiBhbGwgdGhlIHBhdGhzIGRlZmluZWQgaW4gYSBjb25maWdcclxuICAgICAqIFxyXG4gICAgICogQHJldHVybnMgQSBsaXN0IG9mIGFsbCBzZWxlY3RvcnMgZm9yIHRoZSBtYXRjaGluZyBwYXRoc1xyXG4gICAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBnZXRTZWxlY3RvcnMobWF0Y2hlczogc3RyaW5nW10sIHBhdGhzOiBQYXR0ZXJuU2VsZWN0b3JNYXApOiBTZWxlY3Rvck5hbWVQYWlyW10ge1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRTZWxlY3RvcnMgPSBbXTtcclxuICAgICAgICBmb3IgKGNvbnN0IHBhdGggb2YgbWF0Y2hlcykge1xyXG4gICAgICAgICAgICBjb25zdCBwYXRoRGF0YSA9IHBhdGhzW3BhdGhdO1xyXG4gICAgICAgICAgICBpZiAocGF0aERhdGEuc2VsZWN0b3JzKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHBhdGhEYXRhLnNlbGVjdG9ycykge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTZWxlY3RvcnMucHVzaChzZWxlY3Rvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRTZWxlY3RvcnM7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2NvbnRlbnQudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=