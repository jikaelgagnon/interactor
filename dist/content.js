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
        this.interactionEvents = (_a = config.events) !== null && _a !== void 0 ? _a : ['click'];
        this.highlight = true;
        this.paths = config.paths;
        this.baseURL = config.baseURL;
        this.currentPageData = new pagedata_1.PageData(config);
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
    updateCurrentPageData(newURL) {
        this.currentPageData.update(newURL);
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
    constructor(config) {
        this.urlPatternToSelectorData = config.paths;
        this.baseURL = config.baseURL;
    }
    /**
     * Updates the state of the PageData
     * @param newURL: The full url of the current page
     */
    update(newURL) {
        this.url = newURL;
        const matches = this.updateMatchData();
        this.selectors = this.getSelectorNamePairs(matches);
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
    updateMatchData() {
        console.log("updating page data");
        let closestMatch = ""; // the pattern that most closely matches the current URL
        // Get a list of all the paths that match the current URL
        const matches = Object.keys(this.urlPatternToSelectorData).filter((path) => {
            // console.log(path);
            const p = new URLPattern(path, this.baseURL);
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
        return matches;
    }
    /**
     * @param matchingPaths: A list of all matching paths to the current url
     *
     * @returns A list of all selectors for the matching paths
     */
    getSelectorNamePairs(matchingPaths) {
        const currentSelectorNamePairs = [];
        for (const path of matchingPaths) {
            const selectorNamePairs = this.urlPatternToSelectorData[path];
            for (const pair of selectorNamePairs) {
                currentSelectorNamePairs.push(pair);
            }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUM7UUFFSCxJQUFJLENBQUMsY0FBYyxHQUFHLFlBQVksQ0FBQztRQUVuQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFFRCxPQUFPLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUVLLG9CQUFvQixDQUFDLGFBQXVCO1FBQ2hELE1BQU0sd0JBQXdCLEdBQUcsRUFBRSxDQUFDO1FBQ3BDLEtBQUssTUFBTSxJQUFJLElBQUksYUFBYSxFQUFFLENBQUM7WUFDL0IsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUQsS0FBSyxNQUFNLElBQUksSUFBSSxpQkFBaUIsRUFBRSxDQUFDO2dCQUNuQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEMsQ0FBQztRQUNMLENBQUM7UUFDRCxPQUFPLHdCQUF3QixDQUFDO0lBQ3BDLENBQUM7Q0FDSjtBQTdFRCw0QkE2RUM7Ozs7Ozs7VUNqRkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvY29tbW9uL2NvbW11bmljYXRpb24vYWN0aXZpdHkudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb21tb24vY29tbXVuaWNhdGlvbi9iYWNrZ3JvdW5kbWVzc2FnZS50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbW1vbi9jb21tdW5pY2F0aW9uL3NlbmRlci50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbW1vbi9kYmRvY3VtZW50LnRzIiwid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvY29udGVudC50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbnRlbnQvY29uZmlnLnRzIiwid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvY29udGVudC9tb25pdG9yLnRzIiwid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvY29udGVudC9wYWdlZGF0YS50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2ludGVyYWN0b3Ivd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIERlZmluZXMgYSBsaXN0IG9mIHRoZSBwb3NzaWJsZSBhY3Rpdml0eSB0eXBlcyB0aGF0IGNhbiBiZSByZWNvcmRlZCBieSB0aGUgTW9uaXRvciBjbGFzc1xuICovXG5lbnVtIEFjdGl2aXR5VHlwZSB7XG4gICAgU2VsZkxvb3AgPSBcIlNlbGYtTG9vcFwiLFxuICAgIFN0YXRlQ2hhbmdlID0gXCJTdGF0ZSBDaGFuZ2VcIixcbiAgICBJbnRlcmFjdGlvbiA9IFwiSW50ZXJhY3Rpb25cIixcbiAgICBCb3RoID0gXCJCb3RoXCJcbn1cblxuZXhwb3J0IHtBY3Rpdml0eVR5cGV9IiwiaW1wb3J0IHtEQkRvY3VtZW50IH0gZnJvbSBcIi4uL2RiZG9jdW1lbnRcIjtcbmltcG9ydCB7IFNlbmRlck1ldGhvZCB9IGZyb20gXCIuL3NlbmRlclwiO1xuZXhwb3J0IHtCYWNrZ3JvdW5kTWVzc2FnZSwgTWVzc2FnZVJlc3BvbnNlfTtcbi8qKlxuICogQSBjbGFzcyB1c2VkIHRvIHNlbmQgbWVzc2FnZXMgZnJvbSB0aGUgY29udGVudCB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHQgaW4gYSBjb25zaXN0ZW50IGZvcm1hdC5cbiAqL1xuY2xhc3MgQmFja2dyb3VuZE1lc3NhZ2Uge1xuICAgIHNlbmRlck1ldGhvZDogU2VuZGVyTWV0aG9kO1xuICAgIHBheWxvYWQ6IERCRG9jdW1lbnQ7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHNlbmRlck1ldGhvZCAtIGVudW0gdHlwZSBvZiB0aGUgbWV0aG9kIHNlbmRpbmcgdGhlIG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0gcGF5bG9hZCAtIHRoZSBkYXRhIGJlaW5nIHNlbnQgdG8gdGhlIGRhdGFiYXNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKHNlbmRlck1ldGhvZDogU2VuZGVyTWV0aG9kLCBwYXlsb2FkOiBEQkRvY3VtZW50KSB7XG4gICAgICAgIHRoaXMuc2VuZGVyTWV0aG9kID0gc2VuZGVyTWV0aG9kO1xuICAgICAgICB0aGlzLnBheWxvYWQgPSBwYXlsb2FkO1xuICAgIH1cbn1cblxuaW50ZXJmYWNlIE1lc3NhZ2VSZXNwb25zZSB7XG4gIHN0YXR1czogc3RyaW5nO1xuICBoaWdobGlnaHQ/OiBib29sZWFuO1xufSIsImVudW0gU2VuZGVyTWV0aG9ke1xuICAgIEluaXRpYWxpemVTZXNzaW9uID0gXCJJbml0aWFsaXplIFNlc3Npb25cIixcbiAgICBJbnRlcmFjdGlvbkRldGVjdGlvbiA9IFwiSW50ZXJhY3Rpb24gRGV0ZWN0aW9uXCIsXG4gICAgTmF2aWdhdGlvbkRldGVjdGlvbiA9IFwiTmF2aWdhdGlvbiBEZXRlY3Rpb25cIixcbiAgICBDbG9zZVNlc3Npb24gPSBcIkNsb3NlIFNlc3Npb25cIixcbiAgICBBbnkgPSBcIkFueVwiXG59XG5leHBvcnQge1NlbmRlck1ldGhvZH07IiwiaW1wb3J0IHsgQWN0aXZpdHlUeXBlIH0gZnJvbSBcIi4vY29tbXVuaWNhdGlvbi9hY3Rpdml0eVwiO1xyXG4vKipcclxuICogQSBjbGFzcyBkZWZpbmluZyBkb2N1bWVudHMgdGhhdCBhcmUgc2VudCB0byB0aGUgZGF0YWJhc2UgZnJvbSB0aGUgY29udGVudCBzY3JpcHRcclxuICovXHJcbmNsYXNzIERCRG9jdW1lbnQge1xyXG4gICAgLy8gVVJMIGF0IHdoaWNodCB0aGUgZXZlbnQgd2FzIGNyZWF0ZWRcclxuICAgIHNvdXJjZVVSTDogc3RyaW5nO1xyXG4gICAgc291cmNlRG9jdW1lbnRUaXRsZTogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCB0aXRsZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zb3VyY2VVUkwgPSB1cmw7XHJcbiAgICAgICAgdGhpcy5zb3VyY2VEb2N1bWVudFRpdGxlID0gdGl0bGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIGNoaWxkIG9mIERCRG9jdW1lbnQgdGhhdCByZXByZXNlbnRzIGFjdGl2aXRpZXNcclxuICovXHJcblxyXG5jbGFzcyBBY3Rpdml0eURvY3VtZW50IGV4dGVuZHMgREJEb2N1bWVudHtcclxuICAgIC8vIFRoZSB0eXBlIG9mIGFjdGl2aXR5IGJlaW5nIGxvZ2dlZC4gRWl0aGVyIFwic3RhdGVfY2hhZ2VcIiwgXCJzZWxmX2xvb3BcIiwgb3IgXCJpbnRlcmFjdGlvblwiXHJcbiAgICBhY3Rpdml0eVR5cGU6IEFjdGl2aXR5VHlwZSB8IHN0cmluZztcclxuICAgIC8vIFRpbWVzdGFtcCBmb3Igd2hlbiB0aGUgZG9jdW1lbnQgd2FzIGNyZWF0ZWRcclxuICAgIGNyZWF0ZWRBdDogRGF0ZSB8IHN0cmluZztcclxuICAgIC8vIEV2ZW50IHR5cGUgKGVnLiBjbGljaywgc2Nyb2xsLCBldGMuLi4pXHJcbiAgICBldmVudFR5cGU6IHN0cmluZ1xyXG4gICAgLy8gTWV0YWRhdGEgYWJvdXQgdGhlIGV2ZW50XHJcbiAgICBtZXRhZGF0YT86IG9iamVjdDtcclxuICAgIGNvbnN0cnVjdG9yKHR5cGU6IEFjdGl2aXR5VHlwZSwgZXZlbnQ6IEV2ZW50LCBtZXRhZGF0YTogb2JqZWN0LCB1cmw6IHN0cmluZywgdGl0bGU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKHVybCwgdGl0bGUpO1xyXG4gICAgICAgIHRoaXMuYWN0aXZpdHlUeXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLmNyZWF0ZWRBdCA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgdGhpcy5ldmVudFR5cGUgPSBldmVudC50eXBlXHJcbiAgICAgICAgdGhpcy5tZXRhZGF0YSA9IG1ldGFkYXRhO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQSBjaGlsZCBvZiBEQkRvY3VtZW50IHRoYXQgcmVwcmVzZW50cyB0aGUgc3RhcnQgb2YgYSBzZXNzaW9uXHJcbiAqL1xyXG5cclxuY2xhc3MgU2Vzc2lvbkRvY3VtZW50IGV4dGVuZHMgREJEb2N1bWVudHtcclxuICAgIHN0YXJ0VGltZTogRGF0ZTtcclxuICAgIGVuZFRpbWU/OiBEYXRlO1xyXG4gICAgZW1haWwgPSBcIkVtYWlsIG5vdCBzZXRcIjtcclxuICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCB0aXRsZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIodXJsLCB0aXRsZSk7XHJcbiAgICAgICAgdGhpcy5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgc2V0RW1haWwoZW1haWw6IHN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5lbWFpbCA9IGVtYWlsO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge0RCRG9jdW1lbnQsIEFjdGl2aXR5RG9jdW1lbnQsIFNlc3Npb25Eb2N1bWVudH07IiwiaW1wb3J0IHsgTW9uaXRvciB9IGZyb20gXCIuL2NvbnRlbnQvbW9uaXRvclwiO1xuaW1wb3J0IHl0Q29uZmlnIGZyb20gJy4vY29udGVudC9jb25maWdzL3lvdXR1YmVfY29uZmlnLmpzb24nO1xuLy8gaW1wb3J0IHRpa3Rva0NvbmZpZyBmcm9tICcuL2NvbmZpZ3MvdGlrdG9rX2NvbmZpZy5qc29uJztcbi8vIGltcG9ydCBsaW5rZWRpbkNvbmZpZyBmcm9tICcuL2NvbmZpZ3MvbGlua2VkaW5fY29uZmlnLmpzb24nO1xuaW1wb3J0IHsgQ29uZmlnTG9hZGVyLCBFeHRyYWN0b3JEYXRhIH0gZnJvbSBcIi4vY29udGVudC9jb25maWdcIjtcbi8vIGltcG9ydCB7IEFjdGl2aXR5VHlwZSB9IGZyb20gXCIuL2NvbW11bmljYXRpb24vYWN0aXZpdHlcIjtcbmltcG9ydCB7IFNlbmRlck1ldGhvZCB9IGZyb20gXCIuL2NvbW1vbi9jb21tdW5pY2F0aW9uL3NlbmRlclwiO1xuXG5cbmNvbnN0IGdldEhvbWVwYWdlVmlkZW9zID0gKCk6IG9iamVjdCA9PiB7XG4gICAgLy8gY29uc29sZS5sb2coXCItLS0tIEVYVFJBQ1RJTkcgSE9NRVBBR0UgTElOS1MgLS0tXCIpO1xuICAgIGNvbnN0IGNvbnRlbnREaXZzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjY29udGVudC55dGQtcmljaC1pdGVtLXJlbmRlcmVyJykpXG4gICAgICAgIC5maWx0ZXIoZGl2ID0+IHtcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGVsZW1lbnQgaXMgYWN0dWFsbHkgdmlzaWJsZVxuICAgICAgICAgICAgY29uc3QgcmVjdCA9IGRpdi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIHJldHVybiByZWN0LndpZHRoID4gMCAmJiByZWN0LmhlaWdodCA+IDAgJiYgXG4gICAgICAgICAgICAgICAgZ2V0Q29tcHV0ZWRTdHlsZShkaXYpLnZpc2liaWxpdHkgIT09ICdoaWRkZW4nO1xuICAgICAgICB9KTtcbiAgICBcbiAgICBjb25zdCB2aWRlb3MgPSBjb250ZW50RGl2cy5tYXAoY29udGVudERpdiA9PiB7XG4gICAgICAgIC8vIEdldCB0aGUgZGlyZWN0IGFuY2hvciBjaGlsZFxuICAgICAgICBjb25zdCBhbmNob3IgPSBjb250ZW50RGl2LnF1ZXJ5U2VsZWN0b3IoJzpzY29wZSA+IHl0LWxvY2t1cC12aWV3LW1vZGVsIGEnKSBhcyBIVE1MQW5jaG9yRWxlbWVudDtcbiAgICAgICAgY29uc3Qgc3BhbiA9IGNvbnRlbnREaXYucXVlcnlTZWxlY3RvcignaDMgYSBzcGFuLnl0LWNvcmUtYXR0cmlidXRlZC1zdHJpbmcnKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsaW5rOiBhbmNob3I/LmhyZWYgPz8gJycsXG4gICAgICAgICAgICB0aXRsZTogc3Bhbj8udGV4dENvbnRlbnQ/LnRyaW0oKSA/PyAnJ1xuICAgICAgICB9O1xuICAgIH0pLmZpbHRlcih2aWRlbyA9PiB2aWRlby5saW5rICE9PSAnJyk7XG4gICAgXG4gICAgcmV0dXJuIHtcInZpZGVvc1wiOiB2aWRlb3N9O1xufTtcblxuY29uc3QgZ2V0UmVjb21tZW5kZWRWaWRlb3MgPSAoKTogb2JqZWN0ID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIi0tLS0gRVhUUkFDVElORyBSRUNPTU1FTkRFRCBMSU5LUyAtLS1cIik7XG4gICAgY29uc3QgY29udGVudERpdnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3l0LWxvY2t1cC12aWV3LW1vZGVsJykpLmZpbHRlcihkaXYgPT4ge1xuICAgICAgICAvLyBDaGVjayBpZiBlbGVtZW50IGlzIGFjdHVhbGx5IHZpc2libGVcbiAgICAgICAgY29uc3QgcmVjdCA9IGRpdi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgcmV0dXJuIHJlY3Qud2lkdGggPiAwICYmIHJlY3QuaGVpZ2h0ID4gMCAmJiBcbiAgICAgICAgICAgIGdldENvbXB1dGVkU3R5bGUoZGl2KS52aXNpYmlsaXR5ICE9PSAnaGlkZGVuJztcbiAgICB9KTtcbiAgICBcbiAgICBjb25zdCB2aWRlb3M6IG9iamVjdCA9IGNvbnRlbnREaXZzLm1hcChjb250ZW50RGl2ID0+IHtcbiAgICAgICAgLy8gR2V0IHRoZSBhbmNob3Igd2l0aCB0aGUgdmlkZW8gbGlua1xuICAgICAgICBjb25zdCBhbmNob3IgPSBjb250ZW50RGl2LnF1ZXJ5U2VsZWN0b3IoJ2FbaHJlZl49XCIvd2F0Y2hcIl0nKSEgYXMgSFRNTEFuY2hvckVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IHNwYW4gPSBjb250ZW50RGl2LnF1ZXJ5U2VsZWN0b3IoJ2gzIGEgc3Bhbi55dC1jb3JlLWF0dHJpYnV0ZWQtc3RyaW5nJykhO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxpbms6IGFuY2hvcj8uaHJlZiA/PyAnJyxcbiAgICAgICAgICAgIHRpdGxlOiBzcGFuPy50ZXh0Q29udGVudD8udHJpbSgpID8/ICcnXG4gICAgICAgIH07XG4gICAgfSkuZmlsdGVyKHZpZGVvID0+IHZpZGVvLmxpbmsgIT09ICcnKTtcbiAgICBcbiAgICAvLyBjb25zb2xlLmxvZyhcIlByaW50aW5nIHRoZSBmaXJzdCA1IHZpZGVvc1wiKTtcbiAgICAvLyBjb25zb2xlLnRhYmxlKHZpZGVvcy5zbGljZSgwLDUpKTtcbiAgICByZXR1cm4ge1widmlkZW9zXCI6IHZpZGVvc307XG59O1xuXG5jb25zdCBleHRyYWN0b3JzID0gW25ldyBFeHRyYWN0b3JEYXRhKFNlbmRlck1ldGhvZC5JbnRlcmFjdGlvbkRldGVjdGlvbiwgXCIvXCIsIGdldEhvbWVwYWdlVmlkZW9zKSwgXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgRXh0cmFjdG9yRGF0YShTZW5kZXJNZXRob2QuSW50ZXJhY3Rpb25EZXRlY3Rpb24sIFwiL3dhdGNoP3Y9KlwiLCBnZXRSZWNvbW1lbmRlZFZpZGVvcyldXG5cbmNvbnN0IHl0Q29uZmlnTG9hZGVyID0gbmV3IENvbmZpZ0xvYWRlcih5dENvbmZpZywgZXh0cmFjdG9ycyk7XG5cbm5ldyBNb25pdG9yKHl0Q29uZmlnTG9hZGVyKTtcblxuLy8gY29uc3QgdGlrdG9rSURTZWxlY3RvciA9ICgpOiBvYmplY3QgPT4ge1xuLy8gICAgIGxldCB2aWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LnhncGxheWVyLWNvbnRhaW5lci50aWt0b2std2ViLXBsYXllclwiKTtcbi8vICAgICBpZiAoIXZpZCl7XG4vLyAgICAgICAgIGNvbnNvbGUubG9nKFwibm8gdXJsIGZvdW5kIVwiKTtcbi8vICAgICAgICAgcmV0dXJuIHt9O1xuLy8gICAgIH1cbi8vICAgICBsZXQgaWQgPSB2aWQuaWQuc3BsaXQoXCItXCIpLmF0KC0xKTtcbi8vICAgICBsZXQgdXJsID0gYGh0dHBzOi8vdGlrdG9rLmNvbS9zaGFyZS92aWRlby8ke2lkfWA7XG4vLyAgICAgcmV0dXJuIHtcbi8vICAgICAgICAgXCJ1bmlxdWVVUkxcIjogdXJsXG4vLyAgICAgfTtcbi8vIH1cblxuXG5cbi8vIGNvbnNvbGUubG9nKHRpa3Rva0NvbmZpZyk7XG4vLyBjb25zdCB0aWt0b2tDb25maWdMb2FkZXIgPSBuZXcgQ29uZmlnTG9hZGVyKHRpa3Rva0NvbmZpZyk7XG4vLyB0aWt0b2tDb25maWdMb2FkZXIuaW5qZWN0RXh0cmFjdG9yKFwiLypcIiwgdGlrdG9rSURTZWxlY3Rvcik7XG4vLyBjb25zdCB0aWt0b2tJbnRlcmFjdG9yID0gbmV3IE1vbml0b3IodGlrdG9rQ29uZmlnTG9hZGVyLmNvbmZpZyk7XG5cbi8vIC8vIGNvbnNvbGUubG9nKHRpa3Rva0NvbmZpZyk7XG4vLyBjb25zdCBsaW5rZWRpbkNvbmZpZ0xvYWRlciA9IG5ldyBDb25maWdMb2FkZXIobGlua2VkaW5Db25maWcpO1xuLy8gY29uc3QgbGlua2VkaW5JbnRlcmFjdG9yID0gbmV3IE1vbml0b3IobGlua2VkaW5Db25maWdMb2FkZXIuY29uZmlnKTsiLCJpbXBvcnQgeyBTZW5kZXJNZXRob2QgfSBmcm9tIFwiLi4vY29tbW9uL2NvbW11bmljYXRpb24vc2VuZGVyXCI7XG5cbmV4cG9ydCB7Q29uZmlnLCBDb25maWdMb2FkZXIsIFVSTFBhdHRlcm5Ub1NlbGVjdG9ycywgU2VsZWN0b3JOYW1lUGFpciwgRXh0cmFjdG9yRGF0YSwgRXh0cmFjdG9yTGlzdH07XG5cblxudHlwZSBTZWxlY3Rvck5hbWVQYWlyID0geyBzZWxlY3Rvcjogc3RyaW5nOyBuYW1lOiBzdHJpbmcgfTtcbnR5cGUgVVJMUGF0dGVyblRvU2VsZWN0b3JzID0gUmVjb3JkPHN0cmluZywgU2VsZWN0b3JOYW1lUGFpcltdPjtcblxuXG5pbnRlcmZhY2UgQ29uZmlnIHtcbiAgICAvKipcbiAgICAgKiBBbiBpbnRlcmZhY2UgdGhhdCBjb250YWlucyBhbGwgdGhlIGRhdGEgcmVxdWlyZWQgdG8gaW5zdGFudGlhdGUgYSBNb25pdG9yLlxuICAgICAqL1xuICAgIC8vIFRoZSBiYXNlIFVSTCB0aGF0IHRoZSBtb25pdG9yIHNob3VsZCBzdGFydCBhdFxuICAgIGJhc2VVUkw6IHN0cmluZztcbiAgICAvLyBBIG1hcHBpbmcgb2YgVVJMIHBhdHRlcm5zIHRvIHBhdGggZGF0YS4gVGhlIFVSTCBQYXR0ZXJuIHNob3VsZCBmb2xsb3cgdGhlIFxuICAgIC8vIFVSTCBQYXR0ZXJuIEFQSSBzeW50YXguIFRoZXNlIGFyZSBhcHBlbmRlZCB0byB0aGUgYmFzZVVSTCB3aGVuIGNoZWNraW5nIGZvciBtYXRjaGVzXG4gICAgLy8gRXg6IGJhc2VVUkw6IHd3dy55b3V0dWJlLmNvbSwgcGF0aDogL3Nob3J0cy86aWQgLT4gd3d3LnlvdXR1YmUuY29tL3Nob3J0cy86aWRcbiAgICBwYXRoczogVVJMUGF0dGVyblRvU2VsZWN0b3JzO1xuICAgIC8vIEluZGljYXRlcyB3aGV0aGVyIHRoZSBNb25pdG9yIHNob3VsZCBiZSBpbiBkZWJ1ZyBtb2RlLiBJZiB0cnVlLCBhZGQgY29sb3VyZWQgYm94ZXNcbiAgICAvLyBhcm91bmQgc2VsZWN0ZWQgSFRNTCBlbGVtZW50c1xuICAgIGRlYnVnPzogYm9vbGVhbjtcbiAgICAvLyBBIGxpc3Qgb2YgZXZlbnQgdHlwZXMgdG8gbW9uaXRvci4gQnkgZGVmYXVsdCwgdGhpcyBpcyBqdXN0IFtcImNsaWNrXCJdXG4gICAgZXZlbnRzPzogc3RyaW5nW107XG59XG5cbmNsYXNzIEV4dHJhY3RvckRhdGEge1xuICAgIGV2ZW50VHlwZTogU2VuZGVyTWV0aG9kO1xuICAgIHVybFBhdHRlcm46IHN0cmluZztcbiAgICBleHRyYWN0b3I6ICgpID0+IG9iamVjdDtcbiAgICBjb25zdHJ1Y3RvcihhY3Rpdml0eVR5cGU6IFNlbmRlck1ldGhvZCwgdXJsUGF0dGVybjogc3RyaW5nLCBleHRyYWN0b3I6ICgpID0+IG9iamVjdCl7XG4gICAgICAgIHRoaXMuZXZlbnRUeXBlID0gYWN0aXZpdHlUeXBlO1xuICAgICAgICB0aGlzLnVybFBhdHRlcm4gPSB1cmxQYXR0ZXJuO1xuICAgICAgICB0aGlzLmV4dHJhY3RvciA9IGV4dHJhY3RvcjtcbiAgICB9XG59XG5cbmNsYXNzIEV4dHJhY3Rvckxpc3Qge1xuICAgIHByaXZhdGUgZXh0cmFjdG9yczogRXh0cmFjdG9yRGF0YVtdO1xuICAgIHByaXZhdGUgYmFzZVVSTDogc3RyaW5nO1xuICAgIGNvbnN0cnVjdG9yKGV4dHJhY3RvcnM6IEV4dHJhY3RvckRhdGFbXSA9IFtdLCBiYXNlVVJMOiBzdHJpbmcpe1xuICAgICAgICB0aGlzLmV4dHJhY3RvcnMgPSBleHRyYWN0b3JzO1xuICAgICAgICB0aGlzLmJhc2VVUkwgPSBiYXNlVVJMO1xuICAgIH1cblxuICAgIHB1YmxpYyBleHRyYWN0KGN1cnJlbnRVUkw6IHN0cmluZywgZXZlbnRUeXBlOiBTZW5kZXJNZXRob2Qpe1xuICAgICAgICBjb25zb2xlLmxvZyhgQXR0ZW1wdGluZyBleHRyYWN0aW9uIGZvciB1cmw6ICR7Y3VycmVudFVSTH0gYW5kIGV2ZW50IHR5cGUgJHtldmVudFR5cGV9YCk7XG4gICAgICAgIGxldCBleHRyYWN0ZWREYXRhOiBvYmplY3QgPSB7fTtcbiAgICAgICAgdGhpcy5leHRyYWN0b3JzLmZpbHRlcihlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0NvcnJlY3RBY3Rpdml0eSA9IChlLmV2ZW50VHlwZSA9PSBldmVudFR5cGUgfHwgZS5ldmVudFR5cGUgPT0gU2VuZGVyTWV0aG9kLkFueSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcCA9IG5ldyBVUkxQYXR0ZXJuKGUudXJsUGF0dGVybiwgdGhpcy5iYXNlVVJMKTtcbiAgICAgICAgICAgICAgICBjb25zdCBpc1VSTE1hdGNoID0gcC50ZXN0KGN1cnJlbnRVUkwpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpc0NvcnJlY3RBY3Rpdml0eSAmJiBpc1VSTE1hdGNoO1xuICAgICAgICAgICAgfSkuZm9yRWFjaChlID0+XG4gICAgICAgICAgICAgICAgZXh0cmFjdGVkRGF0YSA9IHsuLi4gZXh0cmFjdGVkRGF0YSwgLi4uIGUuZXh0cmFjdG9yKCl9XG4gICAgICAgICAgICApXG4gICAgICAgIHJldHVybiBleHRyYWN0ZWREYXRhO1xuICAgIH1cbn1cblxuY2xhc3MgQ29uZmlnTG9hZGVyIHtcbiAgICBwdWJsaWMgY29uZmlnOiBDb25maWc7XG4gICAgcHVibGljIGV4dHJhY3Rvckxpc3Q6IEV4dHJhY3Rvckxpc3Q7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb25maWc6IENvbmZpZywgZXh0cmFjdG9yTGlzdDogRXh0cmFjdG9yRGF0YVtdID0gW10pe1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy5leHRyYWN0b3JMaXN0ID0gbmV3IEV4dHJhY3Rvckxpc3QoZXh0cmFjdG9yTGlzdCwgY29uZmlnLmJhc2VVUkwpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEJhY2tncm91bmRNZXNzYWdlLCBNZXNzYWdlUmVzcG9uc2V9IGZyb20gXCIuLi9jb21tb24vY29tbXVuaWNhdGlvbi9iYWNrZ3JvdW5kbWVzc2FnZVwiO1xyXG5pbXBvcnQge0RCRG9jdW1lbnQsIEFjdGl2aXR5RG9jdW1lbnQsIFNlc3Npb25Eb2N1bWVudH0gZnJvbSBcIi4uL2NvbW1vbi9kYmRvY3VtZW50XCI7XHJcbmltcG9ydCB7Q29uZmlnTG9hZGVyLCBFeHRyYWN0b3JMaXN0LCBVUkxQYXR0ZXJuVG9TZWxlY3RvcnN9IGZyb20gXCIuL2NvbmZpZ1wiO1xyXG5pbXBvcnQgeyBQYWdlRGF0YSB9IGZyb20gXCIuL3BhZ2VkYXRhXCI7XHJcbmltcG9ydCB7IEFjdGl2aXR5VHlwZSB9IGZyb20gXCIuLi9jb21tb24vY29tbXVuaWNhdGlvbi9hY3Rpdml0eVwiO1xyXG5pbXBvcnQge1NlbmRlck1ldGhvZH0gZnJvbSBcIi4uL2NvbW1vbi9jb21tdW5pY2F0aW9uL3NlbmRlclwiXHJcblxyXG4vKipcclxuICogVGhpcyBjbGFzcyByZWFkcyBmcm9tIGEgcHJvdmlkZWQgQ29uZmlnIG9iamVjdCBhbmQgYXR0YWNoZXMgbGlzdGVuZXJzIHRvIHRoZSBlbGVtZW50cyBzcGVjaWZpZWQgaW4gdGhlIHNlbGVjdG9ycy5cclxuICogV2hlbiB0aGVzZSBlbGVtZW50cyBhcmUgaW50ZXJhY3RlZCB3aXRoLCBvciB3aGVuIGEgbmF2aWdhdGlvbiBvY2N1cnMsIGEgZG9jdW1lbnQgaXMgc2VudCB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHRcclxuICogdG8gYmUgYXBwZW5kZWQgdG8gdGhlIGRhdGFiYXNlLiBUaGlzIGNsYXNzIGlzIGluc3RhbnRpYXRlZCBpbiBjb250ZW50LnRzLlxyXG4gKiBcclxuICogQHBhcmFtIGludGVyYWN0aW9uRXZlbnRzIC0gQSBsaXN0IG9mIHRoZSB0eXBlIG9mIGV2ZW50cyB3ZSB3YW50IHRvIG1vbml0b3IgYXMgaW50ZXJhY3Rpb25zIChlZy4gY2xpY2ssIHNjcm9sbCwgZXRjLikuIERlZmF1bHQgaXMgY2xpY2tcclxuICogQHBhcmFtIGRlYnVnIC0gSWYgdHJ1ZSwgaGlnaGxpZ2h0IGFsbCBzZWxlY3RlZCBIVE1MIGVsZW1lbnRzIHdpdGggY29sb3VyZWQgYm94ZXNcclxuICogQHBhcmFtIHBhdGhzIC0gQW4gb2JqZWN0IG1hcHBpbmcgcGF0aCBwYXR0ZXJucyB0byB0aGVpciBjb3JyZXNwb25kaW5nIENTUyBzZWxlY3RvcnMgUGF0aCBwYXR0ZXJucyBhcmUgY29uc2lzdGVudCB3aXRoIHRoZSAgVVJMIFBhdHRlcm4gQVBJIFN5bnRheDogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1VSTF9QYXR0ZXJuX0FQSVxyXG4gKiBAcGFyYW0gYmFzZVVSTCAtIEJhc2UgdXJsIGZvciB0aGUgcGFnZSAoZWcuIHd3dy55b3V0dWJlLmNvbSkuIEFsbCBwYXRocyBhcmUgYXBwZW5kZWQgdG8gdGhpcyB3aGVuIG1hdGNoaW5nIFVSbHNcclxuICogQHBhcmFtIGN1cnJlbnRQYWdlRGF0YSAtIENvbnRhaW5zIGRhdGEgcmVsZXZhbnQgdG8gdGhlIGN1cnJlbnQgcGFnZS5cclxuICogQHBhcmFtIGludGVyYWN0aW9uQXR0cmlidXRlIC0gQXR0cmlidXRlIGFkZGVkIHRvIGFsbCBlbGVtZW50cyBiZWluZyBtb25pdG9yZWRcclxuICovXHJcbmV4cG9ydCBjbGFzcyBNb25pdG9yIHtcclxuICAgIC8vIEEgbGlzdCBvZiB0aGUgdHlwZSBvZiBldmVudHMgd2Ugd2FudCB0byBtb25pdG9yIGFzIGludGVyYWN0aW9ucyAoZWcuIGNsaWNrLCBzY3JvbGwsIGV0Yy4pLiBEZWZhdWx0IGlzIGNsaWNrXHJcbiAgICBpbnRlcmFjdGlvbkV2ZW50czogc3RyaW5nW107XHJcbiAgICAvLyBJZiB0cnVlLCBoaWdobGlnaHQgYWxsIHNlbGVjdGVkIEhUTUwgZWxlbWVudHMgd2l0aCBjb2xvdXJlZCBib3hlc1xyXG4gICAgaGlnaGxpZ2h0OiBib29sZWFuO1xyXG4gICAgLy8gQW4gb2JqZWN0IG1hcHBpbmcgcGF0aCBwYXR0ZXJucyB0byB0aGVpciBjb3JyZXNwb25kaW5nIENTUyBzZWxlY3RvcnNcclxuICAgIC8vIFBhdGggcGF0dGVybnMgYXJlIGNvbnNpc3RlbnQgd2l0aCB0aGUgVVJMIFBhdHRlcm4gQVBJIFN5bnRheDogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1VSTF9QYXR0ZXJuX0FQSVxyXG4gICAgcGF0aHM6IFVSTFBhdHRlcm5Ub1NlbGVjdG9ycztcclxuICAgIC8vIEJhc2UgdXJsIGZvciB0aGUgcGFnZSAoZWcuIHd3dy55b3V0dWJlLmNvbSkuIEFsbCBwYXRocyBhcmUgYXBwZW5kZWQgdG8gdGhpcyB3aGVuIG1hdGNoaW5nIFVSbHNcclxuICAgIGJhc2VVUkw6IHN0cmluZztcclxuICAgIC8vIENvbnRhaW5zIGRhdGEgcmVsZXZhbnQgdG8gdGhlIGN1cnJlbnQgcGFnZS5cclxuICAgIGN1cnJlbnRQYWdlRGF0YTogUGFnZURhdGE7XHJcbiAgICAvLyBBdHRyaWJ1dGUgYWRkZWQgdG8gYWxsIGVsZW1lbnRzIGJlaW5nIG1vbml0b3JlZFxyXG4gICAgaW50ZXJhY3Rpb25BdHRyaWJ1dGU6IHN0cmluZztcclxuXHJcbiAgICBleHRyYWN0b3JMaXN0OiBFeHRyYWN0b3JMaXN0O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZ0xvYWRlcjogQ29uZmlnTG9hZGVyKSB7XHJcbiAgICAgICAgY29uc3QgY29uZmlnID0gY29uZmlnTG9hZGVyLmNvbmZpZztcclxuICAgICAgICB0aGlzLmludGVyYWN0aW9uRXZlbnRzID0gY29uZmlnLmV2ZW50cyA/PyBbJ2NsaWNrJ107XHJcbiAgICAgICAgdGhpcy5oaWdobGlnaHQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucGF0aHMgPSBjb25maWcucGF0aHM7XHJcbiAgICAgICAgdGhpcy5iYXNlVVJMID0gY29uZmlnLmJhc2VVUkw7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGFnZURhdGEgPSBuZXcgUGFnZURhdGEoY29uZmlnKTtcclxuICAgICAgICB0aGlzLmludGVyYWN0aW9uQXR0cmlidXRlID0gXCJtb25pdG9yaW5nLWludGVyYWN0aW9uc1wiXHJcbiAgICAgICAgdGhpcy5leHRyYWN0b3JMaXN0ID0gY29uZmlnTG9hZGVyLmV4dHJhY3Rvckxpc3Q7IFxyXG5cclxuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLm9yaWdpbiA9PT0gdGhpcy5iYXNlVVJMKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJ1bldoZW5WaXNpYmxlID0gKCkgPT4geyAgLy8gUmVtb3ZlIGFzeW5jIGhlcmVcclxuICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09ICd2aXNpYmxlJykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFdyYXAgdGhlIGFzeW5jIGNhbGwgYW5kIGhhbmRsZSBlcnJvcnNcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxpemVNb25pdG9yKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIHJ1bldoZW5WaXNpYmxlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGluaXRpYWxpemluZyBtb25pdG9yOicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN0aWxsIHJlbW92ZSBsaXN0ZW5lciBldmVuIGlmIHRoZXJlJ3MgYW4gZXJyb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCBydW5XaGVuVmlzaWJsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcclxuICAgICAgICAgICAgICAgIHJ1bldoZW5WaXNpYmxlKCk7IC8vIFRoaXMgd2lsbCBub3cgYmUgc3luY2hyb25vdXNcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4geyAgLy8gUmVtb3ZlIGFzeW5jIGhlcmVcclxuICAgICAgICAgICAgICAgICAgICBydW5XaGVuVmlzaWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCBydW5XaGVuVmlzaWJsZSk7XHJcbiAgICAgICAgfSAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgbW9uaXRvciBpZiBiYXNlIFVSTCBtYXRjaGVzIHRoZSBjdXJyZW50IFVSTFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFzeW5jIGluaXRpYWxpemVNb25pdG9yKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW5pdGlhbGl6aW5nIG1vbml0b3JcIik7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDdXJyZW50UGFnZURhdGEoZG9jdW1lbnQubG9jYXRpb24uaHJlZik7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gQ3JlYXRlcyBhIG5ldyBlbnRyeSBpbiB0aGUgREIgZGVzY3JpYmluZyB0aGUgc3RhdGUgYXQgdGhlIHN0YXJ0IG9mIHRoZSBzZXNzaW9uXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuaW5pdGlhbGl6ZVNlc3Npb24oKTtcclxuICAgICAgICAgICAgLy8gQmluZHMgbGlzdGVuZXJzIHRvIHRoZSBIVE1MIGVsZW1lbnRzIHNwZWNpZmllZCBpbiB0aGUgY29uZmlnIGZvciBhbGwgbWF0Y2hpbmcgcGF0aCBwYXR0ZXJuc1xyXG4gICAgICAgICAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBpbml0aWFsaXplIHNlc3Npb246XCIsIGVycik7XHJcbiAgICAgICAgfVxyXG59XHJcbiAgICAvKipcclxuICAgKiBVcGRhdGVzIHRoZSBwYWdlIGRhdGEgd2hlbmV2ZXIgYSBuZXcgcGFnZSBpcyBkZXRlY3RlZFxyXG4gICAqIEBwYXJhbSB1cmwgLSB0aGUgdXJsIG9mIHRoZSBuZXcgcGFnZVxyXG4gICAqL1xyXG4gICAgcHJpdmF0ZSB1cGRhdGVDdXJyZW50UGFnZURhdGEobmV3VVJMOiBzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLnVwZGF0ZShuZXdVUkwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBuZXcgZW50cnkgaW4gdGhlIERCIGRlc2NyaWJpbmcgdGhlIHN0YXRlIGF0IHRoZSBzdGFydCBvZiB0aGUgc2Vzc2lvblxyXG4gICAqL1xyXG4gICAgcHJpdmF0ZSBhc3luYyBpbml0aWFsaXplU2Vzc2lvbigpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBjdXJyZW50U3RhdGUgPSBuZXcgU2Vzc2lvbkRvY3VtZW50KHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCwgZG9jdW1lbnQudGl0bGUpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ2hlY2tpbmcgaGlnaGxpZ2h0XCIpO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5zZW5kTWVzc2FnZVRvQmFja2dyb3VuZChTZW5kZXJNZXRob2QuSW5pdGlhbGl6ZVNlc3Npb24sIGN1cnJlbnRTdGF0ZSk7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlPy5zdGF0dXMgPT09IFwiU2Vzc2lvbiBpbml0aWFsaXplZFwiICYmIHJlc3BvbnNlLmhpZ2hsaWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLmhpZ2hsaWdodCA9IHJlc3BvbnNlLmhpZ2hsaWdodDsgLy8gVHlwZVNjcmlwdCBrbm93cyBoaWdobGlnaHQgZXhpc3RzIGhlcmVcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coYEhpZ2hsaWdodCBpcyBzZXQgdG8gJHt0aGlzLmhpZ2hsaWdodH1gKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIEJpbmRzIGV2ZW50IGxpc3RlbmVycyBmb3IgbXV0YXRpb25zIGFuZCBuYXZpZ2F0aW9uXHJcbiAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBiaW5kRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIC8vIFdoZW5ldmVyIG5ldyBjb250ZW50IGlzIGxvYWRlZCwgYXR0YWNoIG9ic2VydmVycyB0byBlYWNoIEhUTUwgZWxlbWVudCB0aGF0IG1hdGNoZXMgdGhlIHNlbGVjdG9ycyBpbiB0aGUgY29uZmlnc1xyXG4gICAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4gdGhpcy5hZGRMaXN0ZW5lcnNUb05ld01hdGNoZXMoKSk7XHJcbiAgICAgICAgLy8gTWFrZSB0aGUgbXV0YXRpb24gb2JzZXJ2ZXIgb2JzZXJ2ZSB0aGUgZW50aXJlIGRvY3VtZW50IGZvciBjaGFuZ2VzXHJcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7XHJcbiAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcclxuICAgICAgICAgICAgc3VidHJlZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBBZGQgYW4gZXZlbnQgbGlzdGVuZXIgdG8gZGV0ZWN0IG5hdmlnYXRpb25zIG9uIHRoZSBwYWdlXHJcbiAgICAgICAgbmF2aWdhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibmF2aWdhdGVcIiwgKGU6IE5hdmlnYXRpb25FdmVudCkgPT4gdGhpcy5vbk5hdmlnYXRpb25EZXRlY3Rpb24oZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIEFkZHMgbGlzdGVuZXJzIHRvIG11dGF0aW9ucyAoaWUuIG5ld2x5IHJlbmRlcmVkIGVsZW1lbnRzKSBhbmQgbWFya3MgdGhlbSB3aXRoIHRoaXMuaW50ZXJhY3R0aW9uQXR0cmlidXRlLlxyXG4gICAqIElmIGRlYnVnIG1vZGUgaXMgb24sIHRoaXMgd2lsbCBhZGQgYSBjb2xvdXJmdWwgYm9yZGVyIHRvIHRoZXNlIGVsZW1lbnRzLlxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgYWRkTGlzdGVuZXJzVG9OZXdNYXRjaGVzKCk6IHZvaWQge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYWRkaW5nIHNlbGVjdG9yc1wiKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgVmFsdWUgb2YgaGlnaGxpZ2h0OiAke3RoaXMuaGlnaGxpZ2h0fWApO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQ3VycmVudCBwYWdlIGRhdGE6XCIpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuY3VycmVudFBhZ2VEYXRhKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlRGF0YS5zZWxlY3RvcnMuZm9yRWFjaChpbnRlcmFjdGlvbiA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgOmlzKCR7aW50ZXJhY3Rpb24uc2VsZWN0b3J9KTpub3QoWyR7dGhpcy5pbnRlcmFjdGlvbkF0dHJpYnV0ZX1dKWApO1xyXG4gICAgICAgICAgICBjb25zdCBuYW1lID0gaW50ZXJhY3Rpb24ubmFtZTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIGVsZW1lbnRzKXtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhpZ2hsaWdodCkgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLmJvcmRlciA9IGAycHggc29saWQgJHt0aGlzLlN0cmluZ1RvQ29sb3IubmV4dChuYW1lKX1gO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUodGhpcy5pbnRlcmFjdGlvbkF0dHJpYnV0ZSwgJ3RydWUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGllIG9mIHRoaXMuaW50ZXJhY3Rpb25FdmVudHMpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoaWUsIChlOiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uSW50ZXJhY3Rpb25EZXRlY3Rpb24oZWxlbWVudCwgZSwgbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0LlxyXG4gICAqIEBwYXJhbSBldmVudCAtIHRoZSBIVE1MIGV2ZW50IHRoYXQgb2NjdXJlZFxyXG4gICAqIEByZXR1cm5zIEEgZG9jdW1lbnQgZGVzY3JpYmluZyB0aGUgc3RhdGUgY2hhbmdlXHJcbiAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTdGF0ZUNoYW5nZVJlY29yZChldmVudDogRXZlbnQpOiBEQkRvY3VtZW50IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkRldGVjdGVkIHN0YXRlIGNoYW5nZSBldmVudFwiKTtcclxuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IHRoaXMuZXh0cmFjdG9yTGlzdC5leHRyYWN0KHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCwgU2VuZGVyTWV0aG9kLk5hdmlnYXRpb25EZXRlY3Rpb24pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicHJpbnRpbmcgbWV0YWRhdGFcIik7XHJcbiAgICAgICAgY29uc29sZS5sb2cobWV0YWRhdGEpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEFjdGl2aXR5RG9jdW1lbnQoQWN0aXZpdHlUeXBlLlN0YXRlQ2hhbmdlLCBldmVudCwgbWV0YWRhdGEsIHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCwgZG9jdW1lbnQudGl0bGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIFNlbmRzIGEgbWVzc2FnZSB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHQuXHJcbiAgICogQHBhcmFtIGV2ZW50IC0gdGhlIEhUTUwgZXZlbnQgdGhhdCBvY2N1cmVkXHJcbiAgICogQHBhcmFtIHVybENoYW5nZSAtIGluZGljYXRlcyB3aGV0aGVyIHRoZSBzZWxmLWxvb3AgcmVzdWx0ZWQgaW4gYSB1cmwgY2hhbmdlXHJcbiAgICogXHJcbiAgICogQHJldHVybnMgQSBkb2N1bWVudCBkZXNjcmliaW5nIHNlbGYgbG9vcFxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlU2VsZkxvb3BSZWNvcmQoZXZlbnQ6IEV2ZW50KTogREJEb2N1bWVudCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJEZXRlY3RlZCBzZWxmIGxvb3AgY2hhbmdlIGV2ZW50XCIpO1xyXG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gdGhpcy5leHRyYWN0b3JMaXN0LmV4dHJhY3QodGhpcy5jdXJyZW50UGFnZURhdGEudXJsLCBTZW5kZXJNZXRob2QuTmF2aWdhdGlvbkRldGVjdGlvbik7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJwcmludGluZyBtZXRhZGF0YVwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhtZXRhZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBY3Rpdml0eURvY3VtZW50KEFjdGl2aXR5VHlwZS5TZWxmTG9vcCwgZXZlbnQsIG1ldGFkYXRhLCB0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmwsIGRvY3VtZW50LnRpdGxlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0LlxyXG4gICAqIEBwYXJhbSBlbGVtZW50IC0gdGhlIGVsZW1lbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIGV2ZW50XHJcbiAgICogQHBhcmFtIG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJlZCB0aGUgY2FsbGJhY2sgKGFzIGRlZmluZWQgaW4gdGhlIGNvbmZpZylcclxuICAgKiBAcGFyYW0gZXZlbnQgLSB0aGUgSFRNTCBldmVudCB0aGF0IG9jY3VyZWRcclxuICAgKiBAcmV0dXJucyBBIGRvY3VtZW50IGludGVyYWN0aW9uIHNlbGYgbG9vcFxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlSW50ZXJhY3Rpb25SZWNvcmQoZWxlbWVudDogRWxlbWVudCwgbmFtZTogc3RyaW5nLCBldmVudDogRXZlbnQpOiBEQkRvY3VtZW50IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkRldGVjdGVkIGludGVyYWN0aW9uIGV2ZW50XCIpO1xyXG4gICAgICAgIGxldCBtZXRhZGF0YToge2h0bWw6IHN0cmluZywgZWxlbWVudE5hbWU6IHN0cmluZzsgaWQ/OiBzdHJpbmd9ID0ge1xyXG4gICAgICAgICAgICBodG1sOiBlbGVtZW50LmdldEhUTUwoKSxcclxuICAgICAgICAgICAgZWxlbWVudE5hbWU6IG5hbWUsXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCBleHRyYWN0ZWREYXRhID0gdGhpcy5leHRyYWN0b3JMaXN0LmV4dHJhY3QodGhpcy5jdXJyZW50UGFnZURhdGEudXJsLCBTZW5kZXJNZXRob2QuSW50ZXJhY3Rpb25EZXRlY3Rpb24pO1xyXG5cclxuICAgICAgICBtZXRhZGF0YSA9IHsuLi4gbWV0YWRhdGEsIC4uLiBleHRyYWN0ZWREYXRhfTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJwcmludGluZyBtZXRhZGF0YVwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhtZXRhZGF0YSk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEFjdGl2aXR5RG9jdW1lbnQoQWN0aXZpdHlUeXBlLkludGVyYWN0aW9uLCBldmVudCwgbWV0YWRhdGEsIHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCwgZG9jdW1lbnQudGl0bGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIFNlbmRzIGEgbWVzc2FnZSB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHQuXHJcbiAgICogQHBhcmFtIHNlbmRlciAtIHRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvbiB0aGF0J3Mgc2VuZGluZyB0aGUgbWVzc2FnZSB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHRcclxuICAgKiBAcGFyYW0gcGF5bG9hZCAtIHRoZSBkYXRhIGJlaW5nIHNlbnQgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0XHJcbiAgICogXHJcbiAgICogQHJldHVybnMgUmVzcG9uc2UgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBtZXNzYWdlIHN1Y2NlZWRlZFxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoc2VuZGVyTWV0aG9kOiBTZW5kZXJNZXRob2QsIHBheWxvYWQ6IERCRG9jdW1lbnQpOiBQcm9taXNlPE1lc3NhZ2VSZXNwb25zZSB8IG51bGw+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyBDaGVjayBpZiBydW50aW1lIGlzIGF2YWlsYWJsZSAoZXh0ZW5zaW9uIGNvbnRleHQgc3RpbGwgdmFsaWQpXHJcbiAgICAgICAgICAgIGlmICghY2hyb21lLnJ1bnRpbWU/LmlkKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4dGVuc2lvbiBjb250ZXh0IGludmFsaWRhdGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBuZXcgQmFja2dyb3VuZE1lc3NhZ2Uoc2VuZGVyTWV0aG9kLCBwYXlsb2FkKTtcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgOiBNZXNzYWdlUmVzcG9uc2UgPSBhd2FpdCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShtZXNzYWdlKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIENocm9tZSByZXR1cm5zIHVuZGVmaW5lZCBpZiBubyBsaXN0ZW5lcnMsIGNoZWNrIGlmIHRoYXQncyBleHBlY3RlZFxyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignTm8gcmVzcG9uc2UgZnJvbSBiYWNrZ3JvdW5kIHNjcmlwdCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdCYWNrZ3JvdW5kIG1lc3NhZ2UgZmFpbGVkOicsIGVycm9yKTtcclxuICAgICAgICAgICAgLy8gRGVjaWRlIHdoZXRoZXIgdG8gdGhyb3cgb3IgaGFuZGxlIGdyYWNlZnVsbHkgYmFzZWQgb24geW91ciBuZWVkc1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDsgLy8gb3IgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIENhbGxiYWNrIHRoYXQgY3JlYXRlcyBhIHBheWxvYWQgZGVzY3JpYmluZyB0aGUgaW50ZXJhY3Rpb24gdGhhdCBvY2N1cmVkIGFuZCBzZW5kcyBpdCB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHRcclxuICAgKiBAcGFyYW0gZSAtIHRoZSBldmVudCB0aGF0IHRyaWdnZXJlZCB0aGUgY2FsbGJhY2tcclxuICAgKiBAcGFyYW0gbmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBlbGVtZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBjYWxsYmFjayAoYXMgZGVmaW5lZCBpbiB0aGUgY29uZmlnKVxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgb25JbnRlcmFjdGlvbkRldGVjdGlvbihlbGVtZW50OiBFbGVtZW50LCBlOiBFdmVudCwgbmFtZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJpbnRlcmFjdGlvbiBldmVudCBkZXRlY3RlZFwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgRXZlbnQgZGV0ZWN0ZWQgd2l0aCBldmVudCB0eXBlOiAke2UudHlwZX1gKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgRXZlbnQgdHJpZ2dlcmVkIGJ5YCwgZWxlbWVudCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudC5pbm5lckhUTUwpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnQuZ2V0SFRNTCgpKTtcclxuICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmNyZWF0ZUludGVyYWN0aW9uUmVjb3JkKGVsZW1lbnQsIG5hbWUsIGUpO1xyXG4gICAgICAgIHRoaXMuc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoU2VuZGVyTWV0aG9kLkludGVyYWN0aW9uRGV0ZWN0aW9uLCByZWNvcmQpXHJcbiAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHNlbmQgaW50ZXJhY3Rpb24gZGF0YTonLCBlcnJvcik7XHJcbiAgICAgICAgICAgIC8vIE1heWJlIHF1ZXVlIGZvciByZXRyeSwgb3IganVzdCBsb2cgYW5kIGNvbnRpbnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsYmFjayB0aGF0IGNyZWF0ZXMgYSBwYXlsb2FkIGRlc2NyaWJpbmcgdGhlIG5hdmlnYXRpb24gdGhhdCBvY2N1cmVkIGFuZCBzZW5kcyBpdCB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHRcclxuICAgICAqIEBwYXJhbSBlIC0gdGhlIGV2ZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBjYWxsYmFja1xyXG4gICAgICogQHBhcmFtIG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJlZCB0aGUgY2FsbGJhY2sgKGFzIGRlZmluZWQgaW4gdGhlIGNvbmZpZylcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBvbk5hdmlnYXRpb25EZXRlY3Rpb24obmF2RXZlbnQ6IE5hdmlnYXRpb25FdmVudCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGRlc3RVcmwgPSBuYXZFdmVudC5kZXN0aW5hdGlvbi51cmw7XHJcbiAgICAgICAgY29uc3QgYmFzZVVSTENoYW5nZSA9IGRlc3RVcmwgJiYgdGhpcy5jdXJyZW50UGFnZURhdGEudXJsXHJcbiAgICAgICAgICAgID8gZGVzdFVybC5zcGxpdChcIi5cIilbMV0gIT09IHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybC5zcGxpdChcIi5cIilbMV1cclxuICAgICAgICAgICAgOiBmYWxzZTtcclxuICAgICAgICAvLyBjb25zdCB1cmxDaGFuZ2UgPSAhKG5hdkV2ZW50LmRlc3RpbmF0aW9uLnVybCA9PT0gdGhpcy5jdXJyZW50UGFnZURhdGEudXJsKTtcclxuICAgICAgICAvLyBsZXQgc291cmNlU3RhdGUgPSB0aGlzLmdldENsZWFuU3RhdGVOYW1lKCk7XHJcbiAgICAgICAgLy8gbGV0IG1hdGNoID0gdGhpcy5jdXJyZW50UGFnZURhdGEuY2hlY2tGb3JNYXRjaChuYXZFdmVudC5kZXN0aW5hdGlvbi51cmwpO1xyXG4gICAgICAgIGlmIChkZXN0VXJsKXtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZURhdGEudXJsID0gbmF2RXZlbnQuZGVzdGluYXRpb24udXJsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJObyBkZXN0aW5hdGlvbiBVUkwgZm91bmQgaW4gbmF2aWdhdGUgZXZlbnQuIFNldHRpbmcgdG8gZW1wdHkgc3RyaW5nXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmwgPSBcIk5PIFVSTCBGT1VORFwiO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gbGV0IGRlc3RTdGF0ZSA9IHRoaXMuZ2V0Q2xlYW5TdGF0ZU5hbWUoKTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coYE5hdmlnYXRpb24gZGV0ZWN0ZWQgd2l0aCBldmVudCB0eXBlOiAke25hdkV2ZW50LnR5cGV9YClcclxuICAgICAgICBpZiAoYmFzZVVSTENoYW5nZSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVVJMIGJhc2UgY2hhbmdlIGRldGVjdGVkLiBDbG9zaW5nIHByb2dyYW0uXCIpO1xyXG4gICAgICAgICAgICB0aGlzLnNlbmRNZXNzYWdlVG9CYWNrZ3JvdW5kKFNlbmRlck1ldGhvZC5DbG9zZVNlc3Npb24sIG5ldyBEQkRvY3VtZW50KHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCwgZG9jdW1lbnQudGl0bGUpKS5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBzZW5kIGludGVyYWN0aW9uIGRhdGE6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAobmF2RXZlbnQubmF2aWdhdGlvblR5cGUgPT09IFwicHVzaFwiKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHVzaCBldmVudCBkZXRlY3RlZC5cIik7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZCA9IHRoaXMuY3JlYXRlU3RhdGVDaGFuZ2VSZWNvcmQobmF2RXZlbnQpO1xyXG4gICAgICAgICAgICB0aGlzLnNlbmRNZXNzYWdlVG9CYWNrZ3JvdW5kKFNlbmRlck1ldGhvZC5OYXZpZ2F0aW9uRGV0ZWN0aW9uLCByZWNvcmQpLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHNlbmQgaW50ZXJhY3Rpb24gZGF0YTonLCBlcnJvcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUN1cnJlbnRQYWdlRGF0YSh0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmwpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobmF2RXZlbnQubmF2aWdhdGlvblR5cGUgPT09IFwicmVwbGFjZVwiKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVwbGFjZSBldmVudCBkZXRlY3RlZC5cIik7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZCA9IHRoaXMuY3JlYXRlU2VsZkxvb3BSZWNvcmQobmF2RXZlbnQpO1xyXG4gICAgICAgICAgICB0aGlzLnNlbmRNZXNzYWdlVG9CYWNrZ3JvdW5kKFNlbmRlck1ldGhvZC5OYXZpZ2F0aW9uRGV0ZWN0aW9uLCByZWNvcmQpLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHNlbmQgaW50ZXJhY3Rpb24gZGF0YTonLCBlcnJvcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICogR2VuZXJhdGVzIGEgdW5pcXVlIGNvbG9yIGZyb20gYSBnaXZlbiBzdHJpbmdcclxuICAgKiBTb3VyY2U6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zMTAzNzM4MyBcclxuICAgKiBAcmV0dXJucyBDb2xvciBoZXggY29kZVxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgU3RyaW5nVG9Db2xvciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaW50ZXJmYWNlIENvbG9ySW5zdGFuY2Uge1xyXG4gICAgICAgICAgICBzdHJpbmdUb0NvbG9ySGFzaDogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcclxuICAgICAgICAgICAgbmV4dFZlcnlEaWZmZXJudENvbG9ySWR4OiBudW1iZXI7XHJcbiAgICAgICAgICAgIHZlcnlEaWZmZXJlbnRDb2xvcnM6IHN0cmluZ1tdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGluc3RhbmNlOiBDb2xvckluc3RhbmNlIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG5leHQ6IGZ1bmN0aW9uIHN0cmluZ1RvQ29sb3Ioc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2UgPz89IHtcclxuICAgICAgICAgICAgICAgICAgICBzdHJpbmdUb0NvbG9ySGFzaDoge30sXHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dFZlcnlEaWZmZXJudENvbG9ySWR4OiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIHZlcnlEaWZmZXJlbnRDb2xvcnM6IFtcIiMwMEZGMDBcIiwgXCIjMDAwMEZGXCIsIFwiI0ZGMDAwMFwiLCBcIiMwMUZGRkVcIiwgXCIjRkZBNkZFXCIsIFwiI0ZGREI2NlwiLCBcIiMwMDY0MDFcIiwgXCIjMDEwMDY3XCIsIFwiIzk1MDAzQVwiLCBcIiMwMDdEQjVcIiwgXCIjRkYwMEY2XCIsIFwiI0ZGRUVFOFwiLCBcIiM3NzREMDBcIiwgXCIjOTBGQjkyXCIsIFwiIzAwNzZGRlwiLCBcIiNENUZGMDBcIiwgXCIjRkY5MzdFXCIsIFwiIzZBODI2Q1wiLCBcIiNGRjAyOURcIiwgXCIjRkU4OTAwXCIsIFwiIzdBNDc4MlwiLCBcIiM3RTJERDJcIiwgXCIjODVBOTAwXCIsIFwiI0ZGMDA1NlwiLCBcIiNBNDI0MDBcIiwgXCIjMDBBRTdFXCIsIFwiIzY4M0QzQlwiLCBcIiNCREM2RkZcIiwgXCIjMjYzNDAwXCIsIFwiI0JERDM5M1wiLCBcIiMwMEI5MTdcIiwgXCIjOUUwMDhFXCIsIFwiIzAwMTU0NFwiLCBcIiNDMjhDOUZcIiwgXCIjRkY3NEEzXCIsIFwiIzAxRDBGRlwiLCBcIiMwMDQ3NTRcIiwgXCIjRTU2RkZFXCIsIFwiIzc4ODIzMVwiLCBcIiMwRTRDQTFcIiwgXCIjOTFEMENCXCIsIFwiI0JFOTk3MFwiLCBcIiM5NjhBRThcIiwgXCIjQkI4ODAwXCIsIFwiIzQzMDAyQ1wiLCBcIiNERUZGNzRcIiwgXCIjMDBGRkM2XCIsIFwiI0ZGRTUwMlwiLCBcIiM2MjBFMDBcIiwgXCIjMDA4RjlDXCIsIFwiIzk4RkY1MlwiLCBcIiM3NTQ0QjFcIiwgXCIjQjUwMEZGXCIsIFwiIzAwRkY3OFwiLCBcIiNGRjZFNDFcIiwgXCIjMDA1RjM5XCIsIFwiIzZCNjg4MlwiLCBcIiM1RkFENEVcIiwgXCIjQTc1NzQwXCIsIFwiI0E1RkZEMlwiLCBcIiNGRkIxNjdcIiwgXCIjMDA5QkZGXCIsIFwiI0U4NUVCRVwiXVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWluc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoW3N0cl0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZS5zdHJpbmdUb0NvbG9ySGFzaFtzdHJdID0gaW5zdGFuY2UudmVyeURpZmZlcmVudENvbG9yc1tpbnN0YW5jZS5uZXh0VmVyeURpZmZlcm50Q29sb3JJZHgrK107XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCVjIFRoZSBjb2xvdXIgZm9yICR7c3RyfWAsIGBjb2xvcjogJHtpbnN0YW5jZS5zdHJpbmdUb0NvbG9ySGFzaFtzdHJdfWApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoW3N0cl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSkoKTtcclxufVxyXG4iLCJpbXBvcnQge1VSTFBhdHRlcm5Ub1NlbGVjdG9ycywgU2VsZWN0b3JOYW1lUGFpciwgQ29uZmlnfSBmcm9tIFwiLi9jb25maWdcIjtcclxuLyoqXHJcbiAqIEEgY2xhc3MgcmVzcG9uc2libGUgZm9yIHRyYWNraW5nIHRoZSBzdGF0ZSBvZiB0aGUgcGFnZSB0aGF0IHRoZSB1c2VyIGlzIGN1cnJlbnRseSBvbi5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBQYWdlRGF0YSB7XHJcbiAgICAvLyBVUkwgb2YgdGhlIHBhZ2VcclxuICAgIHVybCE6IHN0cmluZztcclxuICAgIC8vIENTUyBzZWxlY3RvcnMgYmVpbmcgYXBwbGllZCB0byB0aGUgcGFnZVxyXG4gICAgc2VsZWN0b3JzITogU2VsZWN0b3JOYW1lUGFpcltdO1xyXG4gICAgLy8gVGhlIFVSTCBwYXR0ZXJuLCBDU1Mgc2VsZWN0b3JzLCBhbmQgb3B0aW9uYWxseSBhIGZ1bmN0aW9uIGZvciBnZXR0aW5nIHBhZ2UgSUQgXHJcbiAgICAvLyBmb3IgdGhlIHBhdHRlcm4gdGhhdCBtb3N0IGNsb3NlbHkgbWF0Y2hlcyB0aGlzLnVybFxyXG4gICAgLy8gRXg6IElmIHRoZSB1cmwgaXMgd3d3LnlvdXR1YmUuY29tL3Nob3J0cy9BQkMgYW5kIHRoZSBwYXR0ZXJucyBhcmUgLyogYW5kIC9zaG9ydHMvOmlkLCB0aGVuIFxyXG4gICAgLy8gbWF0Y2hQYXRoRGF0YSB3b3VsZCBjb250YWluIHRoZSBQYXRoRGF0YSBmb3IgL3Nob3J0cy86aWQsIHNpbmNlIGl0cyBhIGNsb3NlciBtYXRjaCB0byB0aGUgVVJMLlxyXG4gICAgY3VycmVudFBhdHRlcm4hOiBzdHJpbmc7XHJcbiAgICBiYXNlVVJMOiBzdHJpbmc7XHJcbiAgICB1cmxQYXR0ZXJuVG9TZWxlY3RvckRhdGE6IFVSTFBhdHRlcm5Ub1NlbGVjdG9ycztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWc6IENvbmZpZyl7XHJcbiAgICAgICAgdGhpcy51cmxQYXR0ZXJuVG9TZWxlY3RvckRhdGEgPSBjb25maWcucGF0aHM7XHJcbiAgICAgICAgdGhpcy5iYXNlVVJMID0gY29uZmlnLmJhc2VVUkw7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZXMgdGhlIHN0YXRlIG9mIHRoZSBQYWdlRGF0YVxyXG4gICAgICogQHBhcmFtIG5ld1VSTDogVGhlIGZ1bGwgdXJsIG9mIHRoZSBjdXJyZW50IHBhZ2VcclxuICAgICAqL1xyXG4gICAgdXBkYXRlKG5ld1VSTDogc3RyaW5nKXtcclxuICAgICAgICB0aGlzLnVybCA9IG5ld1VSTDtcclxuICAgICAgICBjb25zdCBtYXRjaGVzID0gdGhpcy51cGRhdGVNYXRjaERhdGEoKTtcclxuICAgICAgICB0aGlzLnNlbGVjdG9ycyA9IHRoaXMuZ2V0U2VsZWN0b3JOYW1lUGFpcnMobWF0Y2hlcyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNldHMgYG1hdGNoUGF0aERhdGFgIHRvIGJlIHRoZSBQYXRoRGF0YSBmb3IgdGhlIFVSTCBwYXR0ZXJuIHdpdGggdGhlIGNsb3NldCBtYXRjaCB0byBgYmFzZVVSTGBcclxuICAgICAqIGFuZCByZXR1cm5zIGEgbGlzdCBvZiBhbGwgbWF0Y2hlcy4gQWRkaXRpb25hbGx5LCBpdCB1cGRhdGVzIHdoZXRoZXIgdGhlIGN1cnJlbnQgcGF0aFxyXG4gICAgICogaW5jbHVkZXMgYW4gaWQuXHJcbiAgICAgKiBAcGFyYW0gYmFzZVVSTDogVGhlIGJhc2UgdXJsIGZvciB0aGUgcGFnZSAoZWcuIHd3dy55b3V0dWJlLmNvbSlcclxuICAgICAqIEBwYXJhbSBwYXR0ZXJuczogQSBsaXN0IG9mIGFsbCB0aGUgcGF0aHMgZGVmaW5lZCBpbiBhIGNvbmZpZ1xyXG4gICAgICogXHJcbiAgICAgKiBAcmV0dXJucyBBIGxpc3Qgb2YgYWxsIHBhdHRlcm5zIGluIHRoZSBjb25maWcgdGhhdCBtYXRjaCBgYmFzZVVSTGBcclxuICAgICAqL1xyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlTWF0Y2hEYXRhKCk6IHN0cmluZ1tde1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwidXBkYXRpbmcgcGFnZSBkYXRhXCIpO1xyXG4gICAgICAgIGxldCBjbG9zZXN0TWF0Y2ggPSBcIlwiOyAvLyB0aGUgcGF0dGVybiB0aGF0IG1vc3QgY2xvc2VseSBtYXRjaGVzIHRoZSBjdXJyZW50IFVSTFxyXG5cclxuICAgICAgICAvLyBHZXQgYSBsaXN0IG9mIGFsbCB0aGUgcGF0aHMgdGhhdCBtYXRjaCB0aGUgY3VycmVudCBVUkxcclxuICAgICAgICBjb25zdCBtYXRjaGVzID0gT2JqZWN0LmtleXModGhpcy51cmxQYXR0ZXJuVG9TZWxlY3RvckRhdGEpLmZpbHRlcigocGF0aCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhwYXRoKTtcclxuICAgICAgICAgICAgY29uc3QgcCA9IG5ldyBVUkxQYXR0ZXJuKHBhdGgsIHRoaXMuYmFzZVVSTCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gcC50ZXN0KHRoaXMudXJsKTtcclxuICAgICAgICAgICAgLy8gQ2xvc2VzdCBtYXRjaCBpcyB0aGUgbG9uZ2VzdCBwYXR0ZXJuIHRoYXQgbWF0Y2hlcyB0aGUgY3VycmVudCBVUkxcclxuICAgICAgICAgICAgaWYgKG1hdGNoICYmIHBhdGgubGVuZ3RoID4gY2xvc2VzdE1hdGNoLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgY2xvc2VzdE1hdGNoID0gcGF0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbWF0Y2g7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFBhdHRlcm4gPSBjbG9zZXN0TWF0Y2g7XHJcblxyXG4gICAgICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vIG1hdGNoZXMgZm91bmRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbWF0Y2hlcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBtYXRjaGluZ1BhdGhzOiBBIGxpc3Qgb2YgYWxsIG1hdGNoaW5nIHBhdGhzIHRvIHRoZSBjdXJyZW50IHVybFxyXG4gICAgICogXHJcbiAgICAgKiBAcmV0dXJucyBBIGxpc3Qgb2YgYWxsIHNlbGVjdG9ycyBmb3IgdGhlIG1hdGNoaW5nIHBhdGhzXHJcbiAgICAgKi9cclxuXHJcbiAgICBwcml2YXRlIGdldFNlbGVjdG9yTmFtZVBhaXJzKG1hdGNoaW5nUGF0aHM6IHN0cmluZ1tdKTogU2VsZWN0b3JOYW1lUGFpcltdIHtcclxuICAgICAgICBjb25zdCBjdXJyZW50U2VsZWN0b3JOYW1lUGFpcnMgPSBbXTtcclxuICAgICAgICBmb3IgKGNvbnN0IHBhdGggb2YgbWF0Y2hpbmdQYXRocykge1xyXG4gICAgICAgICAgICBjb25zdCBzZWxlY3Rvck5hbWVQYWlycyA9IHRoaXMudXJsUGF0dGVyblRvU2VsZWN0b3JEYXRhW3BhdGhdO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBhaXIgb2Ygc2VsZWN0b3JOYW1lUGFpcnMpIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTZWxlY3Rvck5hbWVQYWlycy5wdXNoKHBhaXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjdXJyZW50U2VsZWN0b3JOYW1lUGFpcnM7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2NvbnRlbnQudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=