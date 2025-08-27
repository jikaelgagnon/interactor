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
const config_1 = __webpack_require__(/*! ./interactions/config */ "./src/interactions/config.ts");
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
const ytInteractor = new monitor_1.Monitor(ytConfigLoader);
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
                        instance = {};
                        instance.stringToColorHash = {};
                        instance.nextVeryDifferntColorIdx = 0;
                        instance.veryDifferentColors = ["#00FF00", "#0000FF", "#FF0000", "#01FFFE", "#FFA6FE", "#FFDB66", "#006401", "#010067", "#95003A", "#007DB5", "#FF00F6", "#FFEEE8", "#774D00", "#90FB92", "#0076FF", "#D5FF00", "#FF937E", "#6A826C", "#FF029D", "#FE8900", "#7A4782", "#7E2DD2", "#85A900", "#FF0056", "#A42400", "#00AE7E", "#683D3B", "#BDC6FF", "#263400", "#BDD393", "#00B917", "#9E008E", "#001544", "#C28C9F", "#FF74A3", "#01D0FF", "#004754", "#E56FFE", "#788231", "#0E4CA1", "#91D0CB", "#BE9970", "#968AE8", "#BB8800", "#43002C", "#DEFF74", "#00FFC6", "#FFE502", "#620E00", "#008F9C", "#98FF52", "#7544B1", "#B500FF", "#00FF78", "#FF6E41", "#005F39", "#6B6882", "#5FAD4E", "#A75740", "#A5FFD2", "#FFB167", "#009BFF", "#E85EBE"];
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
        this.interactionEvents = config.events ? config.events : ['click'];
        this.highlight = true;
        this.paths = config.paths;
        this.baseURL = config.baseURL;
        this.currentPageData = new pagedata_1.PageData();
        this.interactionAttribute = "monitoring-interactions";
        this.extractorList = configLoader.extractorList;
        if (window.location.origin === this.baseURL) {
            const runWhenVisible = () => {
                if (document.visibilityState === 'visible') {
                    this.initializeMonitor();
                    document.removeEventListener('visibilitychange', runWhenVisible);
                }
            };
            if (document.readyState === 'complete') {
                runWhenVisible();
            }
            else {
                window.addEventListener('load', runWhenVisible);
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
            this.highlight = response.highlight;
            console.log(`Highlight is set to ${this.highlight}`);
        });
    }
    /**
   * Binds event listeners for mutations and navigation
   */
    bindEvents() {
        // Whenever new content is loaded, attach observers to each HTML element that matches the selectors in the configs
        const observer = new MutationObserver((mutations, obs) => this.addListenersToNewMatches());
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
            let elements = document.querySelectorAll(`:is(${interaction["selector"]}):not([${this.interactionAttribute}])`);
            let name = interaction["name"];
            elements.forEach(element => {
                if (this.highlight)
                    element.style.border = `2px solid ${this.StringToColor.next(name)}`;
                element.setAttribute(this.interactionAttribute, 'true');
                for (let i = 0; i < this.interactionEvents.length; i++) {
                    element.addEventListener(this.interactionEvents[i], (e) => {
                        this.onInteractionDetection(element, e, name);
                    }, true);
                }
            });
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
    createSelfLoopRecord(event, urlChange) {
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
        let extractedData = this.extractorList.extract(this.currentPageData.url, sender_1.SenderMethod.InteractionDetection);
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
                    console.warn('No response from background script');
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
    onNavigationDetection(navEvent) {
        let baseURLChange = navEvent.destination.url.split(".")[1] != this.currentPageData.url.split(".")[1];
        let urlChange = !(navEvent.destination.url === this.currentPageData.url);
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
            const record = this.createSelfLoopRecord(navEvent, urlChange);
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
        let matches = this.updateMatchData(baseURL, paths);
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
        let currentSelectors = [];
        for (const path of matches) {
            let pathData = paths[path];
            if (pathData["selectors"]) {
                for (const selector of pathData["selectors"]) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QztZQUN6QixJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0IsSUFBSSxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztnQkFDeEIsS0FBSyxNQUFNLFFBQVEsSUFBSSxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztvQkFDM0MsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNwQyxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7UUFDRCxPQUFPLGdCQUFnQixDQUFDO0lBQzVCLENBQUM7Q0FDSjtBQS9FRCw0QkErRUM7Ozs7Ozs7VUNuRkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvY29tbXVuaWNhdGlvbi9hY3Rpdml0eS50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbW11bmljYXRpb24vYmFja2dyb3VuZG1lc3NhZ2UudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb21tdW5pY2F0aW9uL3NlbmRlci50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbnRlbnQudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9kYXRhYmFzZS9kYmRvY3VtZW50LnRzIiwid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvaW50ZXJhY3Rpb25zL2NvbmZpZy50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2ludGVyYWN0aW9ucy9tb25pdG9yLnRzIiwid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvaW50ZXJhY3Rpb25zL3BhZ2VkYXRhLnRzIiwid2VicGFjazovL2ludGVyYWN0b3Ivd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2ludGVyYWN0b3Ivd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2ludGVyYWN0b3Ivd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRGVmaW5lcyBhIGxpc3Qgb2YgdGhlIHBvc3NpYmxlIGFjdGl2aXR5IHR5cGVzIHRoYXQgY2FuIGJlIHJlY29yZGVkIGJ5IHRoZSBNb25pdG9yIGNsYXNzXG4gKi9cbmVudW0gQWN0aXZpdHlUeXBlIHtcbiAgICBTZWxmTG9vcCA9IFwiU2VsZi1Mb29wXCIsXG4gICAgU3RhdGVDaGFuZ2UgPSBcIlN0YXRlIENoYW5nZVwiLFxuICAgIEludGVyYWN0aW9uID0gXCJJbnRlcmFjdGlvblwiLFxuICAgIEJvdGggPSBcIkJvdGhcIlxufVxuXG5leHBvcnQge0FjdGl2aXR5VHlwZX0iLCJpbXBvcnQge0RCRG9jdW1lbnQgfSBmcm9tIFwiLi4vZGF0YWJhc2UvZGJkb2N1bWVudFwiO1xuaW1wb3J0IHsgU2VuZGVyTWV0aG9kIH0gZnJvbSBcIi4vc2VuZGVyXCI7XG5leHBvcnQge0JhY2tncm91bmRNZXNzYWdlfTtcbi8qKlxuICogQSBjbGFzcyB1c2VkIHRvIHNlbmQgbWVzc2FnZXMgZnJvbSB0aGUgY29udGVudCB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHQgaW4gYSBjb25zaXN0ZW50IGZvcm1hdC5cbiAqL1xuY2xhc3MgQmFja2dyb3VuZE1lc3NhZ2Uge1xuICAgIHNlbmRlck1ldGhvZDogU2VuZGVyTWV0aG9kO1xuICAgIHBheWxvYWQ6IERCRG9jdW1lbnQ7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHNlbmRlck1ldGhvZCAtIGVudW0gdHlwZSBvZiB0aGUgbWV0aG9kIHNlbmRpbmcgdGhlIG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0gcGF5bG9hZCAtIHRoZSBkYXRhIGJlaW5nIHNlbnQgdG8gdGhlIGRhdGFiYXNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKHNlbmRlck1ldGhvZDogU2VuZGVyTWV0aG9kLCBwYXlsb2FkOiBEQkRvY3VtZW50KSB7XG4gICAgICAgIHRoaXMuc2VuZGVyTWV0aG9kID0gc2VuZGVyTWV0aG9kO1xuICAgICAgICB0aGlzLnBheWxvYWQgPSBwYXlsb2FkO1xuICAgIH1cbn0iLCJlbnVtIFNlbmRlck1ldGhvZHtcbiAgICBJbml0aWFsaXplU2Vzc2lvbiA9IFwiSW5pdGlhbGl6ZSBTZXNzaW9uXCIsXG4gICAgSW50ZXJhY3Rpb25EZXRlY3Rpb24gPSBcIkludGVyYWN0aW9uIERldGVjdGlvblwiLFxuICAgIE5hdmlnYXRpb25EZXRlY3Rpb24gPSBcIk5hdmlnYXRpb24gRGV0ZWN0aW9uXCIsXG4gICAgQ2xvc2VTZXNzaW9uID0gXCJDbG9zZSBTZXNzaW9uXCIsXG4gICAgQW55ID0gXCJBbnlcIlxufVxuZXhwb3J0IHtTZW5kZXJNZXRob2R9OyIsImltcG9ydCB7IE1vbml0b3IgfSBmcm9tIFwiLi9pbnRlcmFjdGlvbnMvbW9uaXRvclwiO1xuaW1wb3J0IHl0Q29uZmlnIGZyb20gJy4vY29uZmlncy95b3V0dWJlX2NvbmZpZy5qc29uJztcbmltcG9ydCB0aWt0b2tDb25maWcgZnJvbSAnLi9jb25maWdzL3Rpa3Rva19jb25maWcuanNvbic7XG5pbXBvcnQgbGlua2VkaW5Db25maWcgZnJvbSAnLi9jb25maWdzL2xpbmtlZGluX2NvbmZpZy5qc29uJztcbmltcG9ydCB7IENvbmZpZ0xvYWRlciwgRXh0cmFjdG9yRGF0YSB9IGZyb20gXCIuL2ludGVyYWN0aW9ucy9jb25maWdcIjtcbmltcG9ydCB7IEFjdGl2aXR5VHlwZSB9IGZyb20gXCIuL2NvbW11bmljYXRpb24vYWN0aXZpdHlcIjtcbmltcG9ydCB7IFNlbmRlck1ldGhvZCB9IGZyb20gXCIuL2NvbW11bmljYXRpb24vc2VuZGVyXCI7XG5cblxuY29uc3QgZ2V0SG9tZXBhZ2VWaWRlb3MgPSAoKTogb2JqZWN0ID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZyhcIi0tLS0gRVhUUkFDVElORyBIT01FUEFHRSBMSU5LUyAtLS1cIik7XG4gICAgY29uc3QgY29udGVudERpdnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNjb250ZW50Lnl0ZC1yaWNoLWl0ZW0tcmVuZGVyZXInKSlcbiAgICAgICAgLmZpbHRlcihkaXYgPT4ge1xuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgZWxlbWVudCBpcyBhY3R1YWxseSB2aXNpYmxlXG4gICAgICAgICAgICBjb25zdCByZWN0ID0gZGl2LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgcmV0dXJuIHJlY3Qud2lkdGggPiAwICYmIHJlY3QuaGVpZ2h0ID4gMCAmJiBcbiAgICAgICAgICAgICAgICBnZXRDb21wdXRlZFN0eWxlKGRpdikudmlzaWJpbGl0eSAhPT0gJ2hpZGRlbic7XG4gICAgICAgIH0pO1xuICAgIFxuICAgIGNvbnN0IHZpZGVvcyA9IGNvbnRlbnREaXZzLm1hcChjb250ZW50RGl2ID0+IHtcbiAgICAgICAgLy8gR2V0IHRoZSBkaXJlY3QgYW5jaG9yIGNoaWxkXG4gICAgICAgIGNvbnN0IGFuY2hvciA9IGNvbnRlbnREaXYucXVlcnlTZWxlY3RvcignOnNjb3BlID4geXQtbG9ja3VwLXZpZXctbW9kZWwgYScpIGFzIEhUTUxBbmNob3JFbGVtZW50IHwgbnVsbDtcbiAgICAgICAgY29uc3Qgc3BhbiA9IGNvbnRlbnREaXYucXVlcnlTZWxlY3RvcignaDMgYSBzcGFuLnl0LWNvcmUtYXR0cmlidXRlZC1zdHJpbmcnKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsaW5rOiBhbmNob3I/LmhyZWYgPz8gJycsXG4gICAgICAgICAgICB0aXRsZTogc3Bhbj8udGV4dENvbnRlbnQ/LnRyaW0oKSA/PyAnJ1xuICAgICAgICB9O1xuICAgIH0pLmZpbHRlcih2aWRlbyA9PiB2aWRlby5saW5rICE9PSAnJyk7XG4gICAgXG4gICAgcmV0dXJuIHtcInZpZGVvc1wiOiB2aWRlb3N9O1xufTtcblxuY29uc3QgZ2V0UmVjb21tZW5kZWRWaWRlb3MgPSAoKTogb2JqZWN0ID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIi0tLS0gRVhUUkFDVElORyBSRUNPTU1FTkRFRCBMSU5LUyAtLS1cIik7XG4gICAgY29uc3QgY29udGVudERpdnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3l0LWxvY2t1cC12aWV3LW1vZGVsJykpLmZpbHRlcihkaXYgPT4ge1xuICAgICAgICAvLyBDaGVjayBpZiBlbGVtZW50IGlzIGFjdHVhbGx5IHZpc2libGVcbiAgICAgICAgY29uc3QgcmVjdCA9IGRpdi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgcmV0dXJuIHJlY3Qud2lkdGggPiAwICYmIHJlY3QuaGVpZ2h0ID4gMCAmJiBcbiAgICAgICAgICAgIGdldENvbXB1dGVkU3R5bGUoZGl2KS52aXNpYmlsaXR5ICE9PSAnaGlkZGVuJztcbiAgICB9KTtcbiAgICBcbiAgICBjb25zdCB2aWRlb3M6IG9iamVjdCA9IGNvbnRlbnREaXZzLm1hcChjb250ZW50RGl2ID0+IHtcbiAgICAgICAgLy8gR2V0IHRoZSBhbmNob3Igd2l0aCB0aGUgdmlkZW8gbGlua1xuICAgICAgICBjb25zdCBhbmNob3IgPSBjb250ZW50RGl2LnF1ZXJ5U2VsZWN0b3IoJ2FbaHJlZl49XCIvd2F0Y2hcIl0nKSBhcyBIVE1MQW5jaG9yRWxlbWVudCB8IG51bGw7XG4gICAgICAgIGNvbnN0IHNwYW4gPSBjb250ZW50RGl2LnF1ZXJ5U2VsZWN0b3IoJ2gzIGEgc3Bhbi55dC1jb3JlLWF0dHJpYnV0ZWQtc3RyaW5nJyk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGluazogYW5jaG9yPy5ocmVmID8/ICcnLFxuICAgICAgICAgICAgdGl0bGU6IHNwYW4/LnRleHRDb250ZW50Py50cmltKCkgPz8gJydcbiAgICAgICAgfTtcbiAgICB9KS5maWx0ZXIodmlkZW8gPT4gdmlkZW8ubGluayAhPT0gJycpO1xuICAgIFxuICAgIC8vIGNvbnNvbGUubG9nKFwiUHJpbnRpbmcgdGhlIGZpcnN0IDUgdmlkZW9zXCIpO1xuICAgIC8vIGNvbnNvbGUudGFibGUodmlkZW9zLnNsaWNlKDAsNSkpO1xuICAgIHJldHVybiB7XCJ2aWRlb3NcIjogdmlkZW9zfTtcbn07XG5cbmNvbnN0IGV4dHJhY3RvcnMgPSBbbmV3IEV4dHJhY3RvckRhdGEoU2VuZGVyTWV0aG9kLkludGVyYWN0aW9uRGV0ZWN0aW9uLCBcIi9cIiwgZ2V0SG9tZXBhZ2VWaWRlb3MpLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBFeHRyYWN0b3JEYXRhKFNlbmRlck1ldGhvZC5JbnRlcmFjdGlvbkRldGVjdGlvbiwgXCIvd2F0Y2g/dj0qXCIsIGdldFJlY29tbWVuZGVkVmlkZW9zKV1cblxuY29uc3QgeXRDb25maWdMb2FkZXIgPSBuZXcgQ29uZmlnTG9hZGVyKHl0Q29uZmlnLCBleHRyYWN0b3JzKTtcblxuY29uc3QgeXRJbnRlcmFjdG9yID0gbmV3IE1vbml0b3IoeXRDb25maWdMb2FkZXIpO1xuXG4vLyBjb25zdCB0aWt0b2tJRFNlbGVjdG9yID0gKCk6IG9iamVjdCA9PiB7XG4vLyAgICAgbGV0IHZpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYueGdwbGF5ZXItY29udGFpbmVyLnRpa3Rvay13ZWItcGxheWVyXCIpO1xuLy8gICAgIGlmICghdmlkKXtcbi8vICAgICAgICAgY29uc29sZS5sb2coXCJubyB1cmwgZm91bmQhXCIpO1xuLy8gICAgICAgICByZXR1cm4ge307XG4vLyAgICAgfVxuLy8gICAgIGxldCBpZCA9IHZpZC5pZC5zcGxpdChcIi1cIikuYXQoLTEpO1xuLy8gICAgIGxldCB1cmwgPSBgaHR0cHM6Ly90aWt0b2suY29tL3NoYXJlL3ZpZGVvLyR7aWR9YDtcbi8vICAgICByZXR1cm4ge1xuLy8gICAgICAgICBcInVuaXF1ZVVSTFwiOiB1cmxcbi8vICAgICB9O1xuLy8gfVxuXG5cblxuLy8gY29uc29sZS5sb2codGlrdG9rQ29uZmlnKTtcbi8vIGNvbnN0IHRpa3Rva0NvbmZpZ0xvYWRlciA9IG5ldyBDb25maWdMb2FkZXIodGlrdG9rQ29uZmlnKTtcbi8vIHRpa3Rva0NvbmZpZ0xvYWRlci5pbmplY3RFeHRyYWN0b3IoXCIvKlwiLCB0aWt0b2tJRFNlbGVjdG9yKTtcbi8vIGNvbnN0IHRpa3Rva0ludGVyYWN0b3IgPSBuZXcgTW9uaXRvcih0aWt0b2tDb25maWdMb2FkZXIuY29uZmlnKTtcblxuLy8gLy8gY29uc29sZS5sb2codGlrdG9rQ29uZmlnKTtcbi8vIGNvbnN0IGxpbmtlZGluQ29uZmlnTG9hZGVyID0gbmV3IENvbmZpZ0xvYWRlcihsaW5rZWRpbkNvbmZpZyk7XG4vLyBjb25zdCBsaW5rZWRpbkludGVyYWN0b3IgPSBuZXcgTW9uaXRvcihsaW5rZWRpbkNvbmZpZ0xvYWRlci5jb25maWcpOyIsImltcG9ydCB7IEFjdGl2aXR5VHlwZSB9IGZyb20gXCIuLi9jb21tdW5pY2F0aW9uL2FjdGl2aXR5XCI7XHJcbi8qKlxyXG4gKiBBIGNsYXNzIGRlZmluaW5nIGRvY3VtZW50cyB0aGF0IGFyZSBzZW50IHRvIHRoZSBkYXRhYmFzZSBmcm9tIHRoZSBjb250ZW50IHNjcmlwdFxyXG4gKi9cclxuY2xhc3MgREJEb2N1bWVudCB7XHJcbiAgICAvLyBVUkwgYXQgd2hpY2h0IHRoZSBldmVudCB3YXMgY3JlYXRlZFxyXG4gICAgc291cmNlVVJMOiBzdHJpbmc7XHJcbiAgICBzb3VyY2VEb2N1bWVudFRpdGxlOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnNvdXJjZVVSTCA9IHVybDtcclxuICAgICAgICB0aGlzLnNvdXJjZURvY3VtZW50VGl0bGUgPSB0aXRsZTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgY2hpbGQgb2YgREJEb2N1bWVudCB0aGF0IHJlcHJlc2VudHMgYWN0aXZpdGllc1xyXG4gKi9cclxuXHJcbmNsYXNzIEFjdGl2aXR5RG9jdW1lbnQgZXh0ZW5kcyBEQkRvY3VtZW50e1xyXG4gICAgLy8gVGhlIHR5cGUgb2YgYWN0aXZpdHkgYmVpbmcgbG9nZ2VkLiBFaXRoZXIgXCJzdGF0ZV9jaGFnZVwiLCBcInNlbGZfbG9vcFwiLCBvciBcImludGVyYWN0aW9uXCJcclxuICAgIGFjdGl2aXR5VHlwZTogQWN0aXZpdHlUeXBlO1xyXG4gICAgLy8gVGltZXN0YW1wIGZvciB3aGVuIHRoZSBkb2N1bWVudCB3YXMgY3JlYXRlZFxyXG4gICAgY3JlYXRlZEF0OiBEYXRlO1xyXG4gICAgLy8gRXZlbnQgdHlwZSAoZWcuIGNsaWNrLCBzY3JvbGwsIGV0Yy4uLilcclxuICAgIGV2ZW50VHlwZTogc3RyaW5nXHJcbiAgICAvLyBNZXRhZGF0YSBhYm91dCB0aGUgZXZlbnRcclxuICAgIG1ldGFkYXRhOiBPYmplY3Q7XHJcbiAgICBjb25zdHJ1Y3Rvcih0eXBlOiBBY3Rpdml0eVR5cGUsIGV2ZW50OiBFdmVudCwgbWV0YWRhdGE6IE9iamVjdCwgdXJsOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcih1cmwsIHRpdGxlKTtcclxuICAgICAgICB0aGlzLmFjdGl2aXR5VHlwZSA9IHR5cGU7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVkQXQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRUeXBlID0gZXZlbnQudHlwZVxyXG4gICAgICAgIHRoaXMubWV0YWRhdGEgPSBtZXRhZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgY2hpbGQgb2YgREJEb2N1bWVudCB0aGF0IHJlcHJlc2VudHMgdGhlIHN0YXJ0IG9mIGEgc2Vzc2lvblxyXG4gKi9cclxuXHJcbmNsYXNzIFNlc3Npb25Eb2N1bWVudCBleHRlbmRzIERCRG9jdW1lbnR7XHJcbiAgICBzdGFydFRpbWU6IERhdGU7XHJcbiAgICBlbmRUaW1lPzogRGF0ZTtcclxuICAgIGVtYWlsOiBzdHJpbmcgPSBcIkVtYWlsIG5vdCBzZXRcIjtcclxuICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCB0aXRsZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIodXJsLCB0aXRsZSk7XHJcbiAgICAgICAgdGhpcy5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgc2V0RW1haWwoZW1haWw6IHN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5lbWFpbCA9IGVtYWlsO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge0RCRG9jdW1lbnQsIEFjdGl2aXR5RG9jdW1lbnQsIFNlc3Npb25Eb2N1bWVudH07IiwiaW1wb3J0IHsgU2VuZGVyTWV0aG9kIH0gZnJvbSBcIi4uL2NvbW11bmljYXRpb24vc2VuZGVyXCI7XG5cbmV4cG9ydCB7U2VsZWN0b3JOYW1lUGFpciwgQ29uZmlnLCBDb25maWdMb2FkZXIsIFBhdHRlcm5EYXRhLCBQYXR0ZXJuU2VsZWN0b3JNYXAsIEV4dHJhY3RvckRhdGEsIEV4dHJhY3Rvckxpc3R9O1xuXG5pbnRlcmZhY2UgU2VsZWN0b3JOYW1lUGFpcntcbiAgICAvKipcbiAgICAgKiBBbiBpbnRlcmZhY2UgdG8gbWFwIENTUyBzZWxlY3RvcnMgdG8gaHVtYW4gcmVhZGFibGUgbmFtZXNcbiAgICAgKi9cbiAgICAvLyBUaGUgQ1NTIHNlbGVjdG9yXG4gICAgc2VsZWN0b3I6IHN0cmluZztcbiAgICAvLyBUaGUgaHVtYW4gcmVhZGFibGUgbmFtZSBmb3IgdGhlIENTUyBzZWxlY3RvclxuICAgIG5hbWU6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFBhdHRlcm5TZWxlY3Rvck1hcCB7XG4gICAgLyoqXG4gICAgICogQSBtYXBwaW5nIG9mIFVSTCBwYXR0ZXJucyB0byBwYXRoIGRhdGEuXG4gICAgICogVGhlIFVSTCBQYXR0ZXJuIHNob3VsZCBmb2xsb3cgdGhlIFVSTCBQYXR0ZXJuIEFQSSBzeW50YXguXG4gICAgICogVGhlc2UgYXJlIGFwcGVuZGVkIHRvIHRoZSBiYXNlVVJMIHdoZW4gY2hlY2tpbmcgZm9yIG1hdGNoZXMuXG4gICAgICogRXg6IGJhc2VVUkw6IHd3dy55b3V0dWJlLmNvbSwgcGF0aDogL3Nob3J0cy86aWQgLT4gd3d3LnlvdXR1YmUuY29tL3Nob3J0cy86aWRcbiAgICAgKi9cbiAgICBbcGF0aDogc3RyaW5nXTogUGF0dGVybkRhdGE7XG59XG5cbmludGVyZmFjZSBQYXR0ZXJuRGF0YSB7XG4gICAgLyoqXG4gICAgICogQW4gaW50ZXJmYWNlIHRvIGJ1bmRsZSB0b2dldGhlciBkYXRhIGluIHRoZSBDb25maWcgZm9yIGEgZ2l2ZW4gcGF0aCBwYXR0ZXJuLlxuICAgICAqIEl0IGNvbnRhaW5zIGEgbGlzdCBvZiBDU1Mgc2VsZWN0b3JzIGZvciB0aGUgcGF0aCBwYXR0ZXJuIGFuZCBvcHRpb25hbGx5XG4gICAgICogYW4gaWRTZWxlY3RvciBmdW5jdGlvbiB0aGF0IGV4dHJhY3RzIGFuIElEIGZyb20gcGFnZXMgd2l0aCB0aGUgY29ycmVzcG9uZGluZyBVUkxcbiAgICAgKi9cbiAgICAvLyBBIGxpc3Qgb2Ygc2VsZWN0b3JzIGFuZCBuYW1lcyBmb3IgdGhlIHBhZ2VcbiAgICBzZWxlY3RvcnM/OiBTZWxlY3Rvck5hbWVQYWlyW107XG4gICAgLy8gQSBmdW5jdGlvbiB0aGF0IGV4dHJhY3RzIG1ldGFkYXRhIGZyb20gdGhlIHBhZ2VcbiAgICBkYXRhRXh0cmFjdG9yPzogKCkgPT4gb2JqZWN0O1xufVxuXG5pbnRlcmZhY2UgQ29uZmlnIHtcbiAgICAvKipcbiAgICAgKiBBbiBpbnRlcmZhY2UgdGhhdCBjb250YWlucyBhbGwgdGhlIGRhdGEgcmVxdWlyZWQgdG8gaW5zdGFudGlhdGUgYSBNb25pdG9yLlxuICAgICAqL1xuICAgIC8vIFRoZSBiYXNlIFVSTCB0aGF0IHRoZSBtb25pdG9yIHNob3VsZCBzdGFydCBhdFxuICAgIGJhc2VVUkw6IHN0cmluZztcbiAgICAvLyBBIG1hcHBpbmcgb2YgVVJMIHBhdHRlcm5zIHRvIHBhdGggZGF0YS4gVGhlIFVSTCBQYXR0ZXJuIHNob3VsZCBmb2xsb3cgdGhlIFxuICAgIC8vIFVSTCBQYXR0ZXJuIEFQSSBzeW50YXguIFRoZXNlIGFyZSBhcHBlbmRlZCB0byB0aGUgYmFzZVVSTCB3aGVuIGNoZWNraW5nIGZvciBtYXRjaGVzXG4gICAgLy8gRXg6IGJhc2VVUkw6IHd3dy55b3V0dWJlLmNvbSwgcGF0aDogL3Nob3J0cy86aWQgLT4gd3d3LnlvdXR1YmUuY29tL3Nob3J0cy86aWRcbiAgICBwYXRoczogUGF0dGVyblNlbGVjdG9yTWFwO1xuICAgIC8vIEluZGljYXRlcyB3aGV0aGVyIHRoZSBNb25pdG9yIHNob3VsZCBiZSBpbiBkZWJ1ZyBtb2RlLiBJZiB0cnVlLCBhZGQgY29sb3VyZWQgYm94ZXNcbiAgICAvLyBhcm91bmQgc2VsZWN0ZWQgSFRNTCBlbGVtZW50c1xuICAgIGRlYnVnPzogYm9vbGVhbjtcbiAgICAvLyBBIGxpc3Qgb2YgZXZlbnQgdHlwZXMgdG8gbW9uaXRvci4gQnkgZGVmYXVsdCwgdGhpcyBpcyBqdXN0IFtcImNsaWNrXCJdXG4gICAgZXZlbnRzPzogc3RyaW5nW107XG59XG5cbmNsYXNzIEV4dHJhY3RvckRhdGEge1xuICAgIGV2ZW50VHlwZTogU2VuZGVyTWV0aG9kO1xuICAgIHVybFBhdHRlcm46IHN0cmluZztcbiAgICBleHRyYWN0b3I6ICgpID0+IG9iamVjdDtcbiAgICBjb25zdHJ1Y3RvcihhY3Rpdml0eVR5cGU6IFNlbmRlck1ldGhvZCwgdXJsUGF0dGVybjogc3RyaW5nLCBleHRyYWN0b3I6ICgpID0+IG9iamVjdCl7XG4gICAgICAgIHRoaXMuZXZlbnRUeXBlID0gYWN0aXZpdHlUeXBlO1xuICAgICAgICB0aGlzLnVybFBhdHRlcm4gPSB1cmxQYXR0ZXJuO1xuICAgICAgICB0aGlzLmV4dHJhY3RvciA9IGV4dHJhY3RvcjtcbiAgICB9XG59XG5cbmNsYXNzIEV4dHJhY3Rvckxpc3Qge1xuICAgIHByaXZhdGUgZXh0cmFjdG9yczogRXh0cmFjdG9yRGF0YVtdO1xuICAgIHByaXZhdGUgYmFzZVVSTDogc3RyaW5nO1xuICAgIGNvbnN0cnVjdG9yKGV4dHJhY3RvcnM6IEV4dHJhY3RvckRhdGFbXSA9IFtdLCBiYXNlVVJMOiBzdHJpbmcpe1xuICAgICAgICB0aGlzLmV4dHJhY3RvcnMgPSBleHRyYWN0b3JzO1xuICAgICAgICB0aGlzLmJhc2VVUkwgPSBiYXNlVVJMO1xuICAgIH1cblxuICAgIHB1YmxpYyBleHRyYWN0KGN1cnJlbnRVUkw6IHN0cmluZywgZXZlbnRUeXBlOiBTZW5kZXJNZXRob2Qpe1xuICAgICAgICBjb25zb2xlLmxvZyhgQXR0ZW1wdGluZyBleHRyYWN0aW9uIGZvciB1cmw6ICR7Y3VycmVudFVSTH0gYW5kIGV2ZW50IHR5cGUgJHtldmVudFR5cGV9YCk7XG4gICAgICAgIGxldCBleHRyYWN0ZWREYXRhOiBvYmplY3QgPSB7fTtcbiAgICAgICAgdGhpcy5leHRyYWN0b3JzLmZpbHRlcihlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0NvcnJlY3RBY3Rpdml0eSA9IChlLmV2ZW50VHlwZSA9PSBldmVudFR5cGUgfHwgZS5ldmVudFR5cGUgPT0gU2VuZGVyTWV0aG9kLkFueSk7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZTogSWdub3JpbmcgVHlwZVNjcmlwdCBlcnJvciBmb3IgVVJMUGF0dGVybiBub3QgZm91bmRcbiAgICAgICAgICAgICAgICBjb25zdCBwID0gbmV3IFVSTFBhdHRlcm4oZS51cmxQYXR0ZXJuLCB0aGlzLmJhc2VVUkwpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzVVJMTWF0Y2ggPSBwLnRlc3QoY3VycmVudFVSTCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzQ29ycmVjdEFjdGl2aXR5ICYmIGlzVVJMTWF0Y2g7XG4gICAgICAgICAgICB9KS5mb3JFYWNoKGUgPT5cbiAgICAgICAgICAgICAgICBleHRyYWN0ZWREYXRhID0gey4uLiBleHRyYWN0ZWREYXRhLCAuLi4gZS5leHRyYWN0b3IoKX1cbiAgICAgICAgICAgIClcbiAgICAgICAgcmV0dXJuIGV4dHJhY3RlZERhdGE7XG4gICAgfVxufVxuXG5jbGFzcyBDb25maWdMb2FkZXIge1xuICAgIHB1YmxpYyBjb25maWc6IENvbmZpZztcbiAgICBwdWJsaWMgZXh0cmFjdG9yTGlzdDogRXh0cmFjdG9yTGlzdDtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29uZmlnLCBleHRyYWN0b3JMaXN0OiBFeHRyYWN0b3JEYXRhW10gPSBbXSl7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICB0aGlzLmV4dHJhY3Rvckxpc3QgPSBuZXcgRXh0cmFjdG9yTGlzdChleHRyYWN0b3JMaXN0LCBjb25maWcuYmFzZVVSTCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQmFja2dyb3VuZE1lc3NhZ2UgfSBmcm9tIFwiLi4vY29tbXVuaWNhdGlvbi9iYWNrZ3JvdW5kbWVzc2FnZVwiO1xyXG5pbXBvcnQge0RCRG9jdW1lbnQsIEFjdGl2aXR5RG9jdW1lbnQsIFNlc3Npb25Eb2N1bWVudH0gZnJvbSBcIi4uL2RhdGFiYXNlL2RiZG9jdW1lbnRcIjtcclxuaW1wb3J0IHsgQ29uZmlnLCBDb25maWdMb2FkZXIsIEV4dHJhY3Rvckxpc3QsIFBhdHRlcm5TZWxlY3Rvck1hcH0gZnJvbSBcIi4vY29uZmlnXCI7XHJcbmltcG9ydCB7IFBhZ2VEYXRhIH0gZnJvbSBcIi4vcGFnZWRhdGFcIjtcclxuaW1wb3J0IHsgQWN0aXZpdHlUeXBlIH0gZnJvbSBcIi4uL2NvbW11bmljYXRpb24vYWN0aXZpdHlcIjtcclxuaW1wb3J0IHtTZW5kZXJNZXRob2R9IGZyb20gXCIuLi9jb21tdW5pY2F0aW9uL3NlbmRlclwiXHJcblxyXG4vKipcclxuICogVGhpcyBjbGFzcyByZWFkcyBmcm9tIGEgcHJvdmlkZWQgQ29uZmlnIG9iamVjdCBhbmQgYXR0YWNoZXMgbGlzdGVuZXJzIHRvIHRoZSBlbGVtZW50cyBzcGVjaWZpZWQgaW4gdGhlIHNlbGVjdG9ycy5cclxuICogV2hlbiB0aGVzZSBlbGVtZW50cyBhcmUgaW50ZXJhY3RlZCB3aXRoLCBvciB3aGVuIGEgbmF2aWdhdGlvbiBvY2N1cnMsIGEgZG9jdW1lbnQgaXMgc2VudCB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHRcclxuICogdG8gYmUgYXBwZW5kZWQgdG8gdGhlIGRhdGFiYXNlLiBUaGlzIGNsYXNzIGlzIGluc3RhbnRpYXRlZCBpbiBjb250ZW50LnRzLlxyXG4gKiBcclxuICogQHBhcmFtIGludGVyYWN0aW9uRXZlbnRzIC0gQSBsaXN0IG9mIHRoZSB0eXBlIG9mIGV2ZW50cyB3ZSB3YW50IHRvIG1vbml0b3IgYXMgaW50ZXJhY3Rpb25zIChlZy4gY2xpY2ssIHNjcm9sbCwgZXRjLikuIERlZmF1bHQgaXMgY2xpY2tcclxuICogQHBhcmFtIGRlYnVnIC0gSWYgdHJ1ZSwgaGlnaGxpZ2h0IGFsbCBzZWxlY3RlZCBIVE1MIGVsZW1lbnRzIHdpdGggY29sb3VyZWQgYm94ZXNcclxuICogQHBhcmFtIHBhdGhzIC0gQW4gb2JqZWN0IG1hcHBpbmcgcGF0aCBwYXR0ZXJucyB0byB0aGVpciBjb3JyZXNwb25kaW5nIENTUyBzZWxlY3RvcnMgUGF0aCBwYXR0ZXJucyBhcmUgY29uc2lzdGVudCB3aXRoIHRoZSAgVVJMIFBhdHRlcm4gQVBJIFN5bnRheDogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1VSTF9QYXR0ZXJuX0FQSVxyXG4gKiBAcGFyYW0gYmFzZVVSTCAtIEJhc2UgdXJsIGZvciB0aGUgcGFnZSAoZWcuIHd3dy55b3V0dWJlLmNvbSkuIEFsbCBwYXRocyBhcmUgYXBwZW5kZWQgdG8gdGhpcyB3aGVuIG1hdGNoaW5nIFVSbHNcclxuICogQHBhcmFtIGN1cnJlbnRQYWdlRGF0YSAtIENvbnRhaW5zIGRhdGEgcmVsZXZhbnQgdG8gdGhlIGN1cnJlbnQgcGFnZS5cclxuICogQHBhcmFtIGludGVyYWN0aW9uQXR0cmlidXRlIC0gQXR0cmlidXRlIGFkZGVkIHRvIGFsbCBlbGVtZW50cyBiZWluZyBtb25pdG9yZWRcclxuICovXHJcbmV4cG9ydCBjbGFzcyBNb25pdG9yIHtcclxuICAgIC8vIEEgbGlzdCBvZiB0aGUgdHlwZSBvZiBldmVudHMgd2Ugd2FudCB0byBtb25pdG9yIGFzIGludGVyYWN0aW9ucyAoZWcuIGNsaWNrLCBzY3JvbGwsIGV0Yy4pLiBEZWZhdWx0IGlzIGNsaWNrXHJcbiAgICBpbnRlcmFjdGlvbkV2ZW50czogc3RyaW5nW107XHJcbiAgICAvLyBJZiB0cnVlLCBoaWdobGlnaHQgYWxsIHNlbGVjdGVkIEhUTUwgZWxlbWVudHMgd2l0aCBjb2xvdXJlZCBib3hlc1xyXG4gICAgaGlnaGxpZ2h0OiBib29sZWFuO1xyXG4gICAgLy8gQW4gb2JqZWN0IG1hcHBpbmcgcGF0aCBwYXR0ZXJucyB0byB0aGVpciBjb3JyZXNwb25kaW5nIENTUyBzZWxlY3RvcnNcclxuICAgIC8vIFBhdGggcGF0dGVybnMgYXJlIGNvbnNpc3RlbnQgd2l0aCB0aGUgVVJMIFBhdHRlcm4gQVBJIFN5bnRheDogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1VSTF9QYXR0ZXJuX0FQSVxyXG4gICAgcGF0aHM6IFBhdHRlcm5TZWxlY3Rvck1hcDtcclxuICAgIC8vIEJhc2UgdXJsIGZvciB0aGUgcGFnZSAoZWcuIHd3dy55b3V0dWJlLmNvbSkuIEFsbCBwYXRocyBhcmUgYXBwZW5kZWQgdG8gdGhpcyB3aGVuIG1hdGNoaW5nIFVSbHNcclxuICAgIGJhc2VVUkw6IHN0cmluZztcclxuICAgIC8vIENvbnRhaW5zIGRhdGEgcmVsZXZhbnQgdG8gdGhlIGN1cnJlbnQgcGFnZS5cclxuICAgIGN1cnJlbnRQYWdlRGF0YTogUGFnZURhdGE7XHJcbiAgICAvLyBBdHRyaWJ1dGUgYWRkZWQgdG8gYWxsIGVsZW1lbnRzIGJlaW5nIG1vbml0b3JlZFxyXG4gICAgaW50ZXJhY3Rpb25BdHRyaWJ1dGU6IHN0cmluZztcclxuXHJcbiAgICBleHRyYWN0b3JMaXN0OiBFeHRyYWN0b3JMaXN0O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZ0xvYWRlcjogQ29uZmlnTG9hZGVyKSB7XHJcbiAgICAgICAgY29uc3QgY29uZmlnID0gY29uZmlnTG9hZGVyLmNvbmZpZztcclxuICAgICAgICB0aGlzLmludGVyYWN0aW9uRXZlbnRzID0gY29uZmlnLmV2ZW50cyA/IGNvbmZpZy5ldmVudHMgOiBbJ2NsaWNrJ107XHJcbiAgICAgICAgdGhpcy5oaWdobGlnaHQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucGF0aHMgPSBjb25maWcucGF0aHM7XHJcbiAgICAgICAgdGhpcy5iYXNlVVJMID0gY29uZmlnLmJhc2VVUkw7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGFnZURhdGEgPSBuZXcgUGFnZURhdGEoKTtcclxuICAgICAgICB0aGlzLmludGVyYWN0aW9uQXR0cmlidXRlID0gXCJtb25pdG9yaW5nLWludGVyYWN0aW9uc1wiXHJcbiAgICAgICAgdGhpcy5leHRyYWN0b3JMaXN0ID0gY29uZmlnTG9hZGVyLmV4dHJhY3Rvckxpc3Q7XHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24ub3JpZ2luID09PSB0aGlzLmJhc2VVUkwpIHtcclxuICAgICAgICAgICAgY29uc3QgcnVuV2hlblZpc2libGUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAndmlzaWJsZScpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxpemVNb25pdG9yKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIHJ1bldoZW5WaXNpYmxlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcclxuICAgICAgICAgICAgcnVuV2hlblZpc2libGUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHJ1bldoZW5WaXNpYmxlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCBydW5XaGVuVmlzaWJsZSk7XHJcbiAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgbW9uaXRvciBpZiBiYXNlIFVSTCBtYXRjaGVzIHRoZSBjdXJyZW50IFVSTFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFzeW5jIGluaXRpYWxpemVNb25pdG9yKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW5pdGlhbGl6aW5nIG1vbml0b3JcIik7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDdXJyZW50UGFnZURhdGEoZG9jdW1lbnQubG9jYXRpb24uaHJlZik7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gQ3JlYXRlcyBhIG5ldyBlbnRyeSBpbiB0aGUgREIgZGVzY3JpYmluZyB0aGUgc3RhdGUgYXQgdGhlIHN0YXJ0IG9mIHRoZSBzZXNzaW9uXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuaW5pdGlhbGl6ZVNlc3Npb24oKTtcclxuICAgICAgICAgICAgLy8gQmluZHMgbGlzdGVuZXJzIHRvIHRoZSBIVE1MIGVsZW1lbnRzIHNwZWNpZmllZCBpbiB0aGUgY29uZmlnIGZvciBhbGwgbWF0Y2hpbmcgcGF0aCBwYXR0ZXJuc1xyXG4gICAgICAgICAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBpbml0aWFsaXplIHNlc3Npb246XCIsIGVycik7XHJcbiAgICAgICAgfVxyXG59XHJcbiAgICAvKipcclxuICAgKiBVcGRhdGVzIHRoZSBwYWdlIGRhdGEgd2hlbmV2ZXIgYSBuZXcgcGFnZSBpcyBkZXRlY3RlZFxyXG4gICAqIEBwYXJhbSB1cmwgLSB0aGUgdXJsIG9mIHRoZSBuZXcgcGFnZVxyXG4gICAqL1xyXG4gICAgcHJpdmF0ZSB1cGRhdGVDdXJyZW50UGFnZURhdGEodXJsOiBzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLnVwZGF0ZSh0aGlzLmJhc2VVUkwsIHVybCwgdGhpcy5wYXRocyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIG5ldyBlbnRyeSBpbiB0aGUgREIgZGVzY3JpYmluZyB0aGUgc3RhdGUgYXQgdGhlIHN0YXJ0IG9mIHRoZSBzZXNzaW9uXHJcbiAgICovXHJcbiAgICBwcml2YXRlIGFzeW5jIGluaXRpYWxpemVTZXNzaW9uKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRTdGF0ZSA9IG5ldyBTZXNzaW9uRG9jdW1lbnQodGhpcy5jdXJyZW50UGFnZURhdGEudXJsLCBkb2N1bWVudC50aXRsZSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJDaGVja2luZyBoaWdobGlnaHRcIik7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnNlbmRNZXNzYWdlVG9CYWNrZ3JvdW5kKFNlbmRlck1ldGhvZC5Jbml0aWFsaXplU2Vzc2lvbiwgY3VycmVudFN0YXRlKTtcclxuICAgICAgICB0aGlzLmhpZ2hsaWdodCA9IHJlc3BvbnNlLmhpZ2hsaWdodDtcclxuICAgICAgICBjb25zb2xlLmxvZyhgSGlnaGxpZ2h0IGlzIHNldCB0byAke3RoaXMuaGlnaGxpZ2h0fWApXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogQmluZHMgZXZlbnQgbGlzdGVuZXJzIGZvciBtdXRhdGlvbnMgYW5kIG5hdmlnYXRpb25cclxuICAgKi9cclxuXHJcbiAgICBwcml2YXRlIGJpbmRFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgLy8gV2hlbmV2ZXIgbmV3IGNvbnRlbnQgaXMgbG9hZGVkLCBhdHRhY2ggb2JzZXJ2ZXJzIHRvIGVhY2ggSFRNTCBlbGVtZW50IHRoYXQgbWF0Y2hlcyB0aGUgc2VsZWN0b3JzIGluIHRoZSBjb25maWdzXHJcbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zOiBNdXRhdGlvblJlY29yZFtdLCBvYnM6IE11dGF0aW9uT2JzZXJ2ZXIpID0+IHRoaXMuYWRkTGlzdGVuZXJzVG9OZXdNYXRjaGVzKCkpO1xyXG4gICAgICAgIC8vIE1ha2UgdGhlIG11dGF0aW9uIG9ic2VydmVyIG9ic2VydmUgdGhlIGVudGlyZSBkb2N1bWVudCBmb3IgY2hhbmdlc1xyXG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwge1xyXG4gICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXHJcbiAgICAgICAgICAgIHN1YnRyZWU6IHRydWVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gQWRkIGFuIGV2ZW50IGxpc3RlbmVyIHRvIGRldGVjdCBuYXZpZ2F0aW9ucyBvbiB0aGUgcGFnZVxyXG4gICAgICAgIC8vIEB0cy1pZ25vcmU6IElnbm9yaW5nIFR5cGVTY3JpcHQgZXJyb3IgZm9yIG5hdmlnYXRpb24gbm90IGZvdW5kXHJcbiAgICAgICAgbmF2aWdhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibmF2aWdhdGVcIiwgKGU6IEV2ZW50KSA9PiB0aGlzLm9uTmF2aWdhdGlvbkRldGVjdGlvbihlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogQWRkcyBsaXN0ZW5lcnMgdG8gbXV0YXRpb25zIChpZS4gbmV3bHkgcmVuZGVyZWQgZWxlbWVudHMpIGFuZCBtYXJrcyB0aGVtIHdpdGggdGhpcy5pbnRlcmFjdHRpb25BdHRyaWJ1dGUuXHJcbiAgICogSWYgZGVidWcgbW9kZSBpcyBvbiwgdGhpcyB3aWxsIGFkZCBhIGNvbG91cmZ1bCBib3JkZXIgdG8gdGhlc2UgZWxlbWVudHMuXHJcbiAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBhZGRMaXN0ZW5lcnNUb05ld01hdGNoZXMoKTogdm9pZCB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJhZGRpbmcgc2VsZWN0b3JzXCIpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBWYWx1ZSBvZiBoaWdobGlnaHQ6ICR7dGhpcy5oaWdobGlnaHR9YCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJDdXJyZW50IHBhZ2UgZGF0YTpcIik7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5jdXJyZW50UGFnZURhdGEpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLnNlbGVjdG9ycy5mb3JFYWNoKGludGVyYWN0aW9uID0+IHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgOmlzKCR7aW50ZXJhY3Rpb25bXCJzZWxlY3RvclwiXX0pOm5vdChbJHt0aGlzLmludGVyYWN0aW9uQXR0cmlidXRlfV0pYCk7XHJcbiAgICAgICAgICAgIGxldCBuYW1lID0gaW50ZXJhY3Rpb25bXCJuYW1lXCJdO1xyXG4gICAgICAgICAgICBlbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGlnaGxpZ2h0KSAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkuc3R5bGUuYm9yZGVyID0gYDJweCBzb2xpZCAke3RoaXMuU3RyaW5nVG9Db2xvci5uZXh0KG5hbWUpfWA7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSh0aGlzLmludGVyYWN0aW9uQXR0cmlidXRlLCAndHJ1ZScpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pbnRlcmFjdGlvbkV2ZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmludGVyYWN0aW9uRXZlbnRzW2ldLCAoZTogRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkludGVyYWN0aW9uRGV0ZWN0aW9uKGVsZW1lbnQsIGUsIG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0LlxyXG4gICAqIEBwYXJhbSBldmVudCAtIHRoZSBIVE1MIGV2ZW50IHRoYXQgb2NjdXJlZFxyXG4gICAqIEByZXR1cm5zIEEgZG9jdW1lbnQgZGVzY3JpYmluZyB0aGUgc3RhdGUgY2hhbmdlXHJcbiAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTdGF0ZUNoYW5nZVJlY29yZChldmVudDogRXZlbnQpOiBEQkRvY3VtZW50IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkRldGVjdGVkIHN0YXRlIGNoYW5nZSBldmVudFwiKTtcclxuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IHRoaXMuZXh0cmFjdG9yTGlzdC5leHRyYWN0KHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCwgU2VuZGVyTWV0aG9kLk5hdmlnYXRpb25EZXRlY3Rpb24pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicHJpbnRpbmcgbWV0YWRhdGFcIik7XHJcbiAgICAgICAgY29uc29sZS5sb2cobWV0YWRhdGEpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEFjdGl2aXR5RG9jdW1lbnQoQWN0aXZpdHlUeXBlLlN0YXRlQ2hhbmdlLCBldmVudCwgbWV0YWRhdGEsIHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCwgZG9jdW1lbnQudGl0bGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIFNlbmRzIGEgbWVzc2FnZSB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHQuXHJcbiAgICogQHBhcmFtIGV2ZW50IC0gdGhlIEhUTUwgZXZlbnQgdGhhdCBvY2N1cmVkXHJcbiAgICogQHBhcmFtIHVybENoYW5nZSAtIGluZGljYXRlcyB3aGV0aGVyIHRoZSBzZWxmLWxvb3AgcmVzdWx0ZWQgaW4gYSB1cmwgY2hhbmdlXHJcbiAgICogXHJcbiAgICogQHJldHVybnMgQSBkb2N1bWVudCBkZXNjcmliaW5nIHNlbGYgbG9vcFxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlU2VsZkxvb3BSZWNvcmQoZXZlbnQ6IEV2ZW50LCB1cmxDaGFuZ2U6IGJvb2xlYW4pOiBEQkRvY3VtZW50IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkRldGVjdGVkIHNlbGYgbG9vcCBjaGFuZ2UgZXZlbnRcIik7XHJcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSB0aGlzLmV4dHJhY3Rvckxpc3QuZXh0cmFjdCh0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmwsIFNlbmRlck1ldGhvZC5OYXZpZ2F0aW9uRGV0ZWN0aW9uKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInByaW50aW5nIG1ldGFkYXRhXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG1ldGFkYXRhKTtcclxuICAgICAgICByZXR1cm4gbmV3IEFjdGl2aXR5RG9jdW1lbnQoQWN0aXZpdHlUeXBlLlNlbGZMb29wLCBldmVudCwgbWV0YWRhdGEsIHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCwgZG9jdW1lbnQudGl0bGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIFNlbmRzIGEgbWVzc2FnZSB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHQuXHJcbiAgICogQHBhcmFtIGVsZW1lbnQgLSB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJlZCB0aGUgZXZlbnRcclxuICAgKiBAcGFyYW0gbmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBlbGVtZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBjYWxsYmFjayAoYXMgZGVmaW5lZCBpbiB0aGUgY29uZmlnKVxyXG4gICAqIEBwYXJhbSBldmVudCAtIHRoZSBIVE1MIGV2ZW50IHRoYXQgb2NjdXJlZFxyXG4gICAqIEByZXR1cm5zIEEgZG9jdW1lbnQgaW50ZXJhY3Rpb24gc2VsZiBsb29wXHJcbiAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVJbnRlcmFjdGlvblJlY29yZChlbGVtZW50OiBFbGVtZW50LCBuYW1lOiBzdHJpbmcsIGV2ZW50OiBFdmVudCk6IERCRG9jdW1lbnQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGV0ZWN0ZWQgaW50ZXJhY3Rpb24gZXZlbnRcIik7XHJcbiAgICAgICAgbGV0IG1ldGFkYXRhOiB7aHRtbDogc3RyaW5nLCBlbGVtZW50TmFtZTogc3RyaW5nOyBpZD86IHN0cmluZ30gPSB7XHJcbiAgICAgICAgICAgIGh0bWw6IGVsZW1lbnQuZ2V0SFRNTCgpLFxyXG4gICAgICAgICAgICBlbGVtZW50TmFtZTogbmFtZSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCBleHRyYWN0ZWREYXRhID0gdGhpcy5leHRyYWN0b3JMaXN0LmV4dHJhY3QodGhpcy5jdXJyZW50UGFnZURhdGEudXJsLCBTZW5kZXJNZXRob2QuSW50ZXJhY3Rpb25EZXRlY3Rpb24pO1xyXG5cclxuICAgICAgICBtZXRhZGF0YSA9IHsuLi4gbWV0YWRhdGEsIC4uLiBleHRyYWN0ZWREYXRhfTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJwcmludGluZyBtZXRhZGF0YVwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhtZXRhZGF0YSk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEFjdGl2aXR5RG9jdW1lbnQoQWN0aXZpdHlUeXBlLkludGVyYWN0aW9uLCBldmVudCwgbWV0YWRhdGEsIHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCwgZG9jdW1lbnQudGl0bGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIFNlbmRzIGEgbWVzc2FnZSB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHQuXHJcbiAgICogQHBhcmFtIHNlbmRlciAtIHRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvbiB0aGF0J3Mgc2VuZGluZyB0aGUgbWVzc2FnZSB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHRcclxuICAgKiBAcGFyYW0gcGF5bG9hZCAtIHRoZSBkYXRhIGJlaW5nIHNlbnQgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0XHJcbiAgICogXHJcbiAgICogQHJldHVybnMgUmVzcG9uc2UgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBtZXNzYWdlIHN1Y2NlZWRlZFxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoc2VuZGVyTWV0aG9kOiBTZW5kZXJNZXRob2QsIHBheWxvYWQ6IERCRG9jdW1lbnQpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHJ1bnRpbWUgaXMgYXZhaWxhYmxlIChleHRlbnNpb24gY29udGV4dCBzdGlsbCB2YWxpZClcclxuICAgICAgICAgICAgaWYgKCFjaHJvbWUucnVudGltZT8uaWQpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRXh0ZW5zaW9uIGNvbnRleHQgaW52YWxpZGF0ZWQnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IG5ldyBCYWNrZ3JvdW5kTWVzc2FnZShzZW5kZXJNZXRob2QsIHBheWxvYWQpO1xyXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hyb21lIHJldHVybnMgdW5kZWZpbmVkIGlmIG5vIGxpc3RlbmVycywgY2hlY2sgaWYgdGhhdCdzIGV4cGVjdGVkXHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ05vIHJlc3BvbnNlIGZyb20gYmFja2dyb3VuZCBzY3JpcHQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0JhY2tncm91bmQgbWVzc2FnZSBmYWlsZWQ6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICAvLyBEZWNpZGUgd2hldGhlciB0byB0aHJvdyBvciBoYW5kbGUgZ3JhY2VmdWxseSBiYXNlZCBvbiB5b3VyIG5lZWRzXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsOyAvLyBvciB0aHJvdyBlcnJvcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogQ2FsbGJhY2sgdGhhdCBjcmVhdGVzIGEgcGF5bG9hZCBkZXNjcmliaW5nIHRoZSBpbnRlcmFjdGlvbiB0aGF0IG9jY3VyZWQgYW5kIHNlbmRzIGl0IHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdFxyXG4gICAqIEBwYXJhbSBlIC0gdGhlIGV2ZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBjYWxsYmFja1xyXG4gICAqIEBwYXJhbSBuYW1lIC0gdGhlIG5hbWUgb2YgdGhlIGVsZW1lbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIGNhbGxiYWNrIChhcyBkZWZpbmVkIGluIHRoZSBjb25maWcpXHJcbiAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBvbkludGVyYWN0aW9uRGV0ZWN0aW9uKGVsZW1lbnQ6IEVsZW1lbnQsIGU6IEV2ZW50LCBuYW1lOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImludGVyYWN0aW9uIGV2ZW50IGRldGVjdGVkXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBFdmVudCBkZXRlY3RlZCB3aXRoIGV2ZW50IHR5cGU6ICR7ZS50eXBlfWApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBFdmVudCB0cmlnZ2VyZWQgYnkgJHtlbGVtZW50fWApO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnQuaW5uZXJIVE1MKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhlbGVtZW50LmdldEhUTUwoKSk7XHJcbiAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5jcmVhdGVJbnRlcmFjdGlvblJlY29yZChlbGVtZW50LCBuYW1lLCBlKTtcclxuICAgICAgICB0aGlzLnNlbmRNZXNzYWdlVG9CYWNrZ3JvdW5kKFNlbmRlck1ldGhvZC5JbnRlcmFjdGlvbkRldGVjdGlvbiwgcmVjb3JkKVxyXG4gICAgICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBzZW5kIGludGVyYWN0aW9uIGRhdGE6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICAvLyBNYXliZSBxdWV1ZSBmb3IgcmV0cnksIG9yIGp1c3QgbG9nIGFuZCBjb250aW51ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsbGJhY2sgdGhhdCBjcmVhdGVzIGEgcGF5bG9hZCBkZXNjcmliaW5nIHRoZSBuYXZpZ2F0aW9uIHRoYXQgb2NjdXJlZCBhbmQgc2VuZHMgaXQgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0XHJcbiAgICAgKiBAcGFyYW0gZSAtIHRoZSBldmVudCB0aGF0IHRyaWdnZXJlZCB0aGUgY2FsbGJhY2tcclxuICAgICAqIEBwYXJhbSBuYW1lIC0gdGhlIG5hbWUgb2YgdGhlIGVsZW1lbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIGNhbGxiYWNrIChhcyBkZWZpbmVkIGluIHRoZSBjb25maWcpXHJcbiAgICAgKi9cclxuXHJcbiAgICBwcml2YXRlIG9uTmF2aWdhdGlvbkRldGVjdGlvbihuYXZFdmVudDogYW55KTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGJhc2VVUkxDaGFuZ2UgPSBuYXZFdmVudC5kZXN0aW5hdGlvbi51cmwuc3BsaXQoXCIuXCIpWzFdICE9IHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybC5zcGxpdChcIi5cIilbMV1cclxuICAgICAgICBsZXQgdXJsQ2hhbmdlID0gIShuYXZFdmVudC5kZXN0aW5hdGlvbi51cmwgPT09IHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCk7XHJcbiAgICAgICAgLy8gbGV0IHNvdXJjZVN0YXRlID0gdGhpcy5nZXRDbGVhblN0YXRlTmFtZSgpO1xyXG4gICAgICAgIC8vIGxldCBtYXRjaCA9IHRoaXMuY3VycmVudFBhZ2VEYXRhLmNoZWNrRm9yTWF0Y2gobmF2RXZlbnQuZGVzdGluYXRpb24udXJsKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGFnZURhdGEudXJsID0gbmF2RXZlbnQuZGVzdGluYXRpb24udXJsO1xyXG4gICAgICAgIC8vIGxldCBkZXN0U3RhdGUgPSB0aGlzLmdldENsZWFuU3RhdGVOYW1lKCk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGBOYXZpZ2F0aW9uIGRldGVjdGVkIHdpdGggZXZlbnQgdHlwZTogJHtuYXZFdmVudC50eXBlfWApXHJcbiAgICAgICAgaWYgKGJhc2VVUkxDaGFuZ2Upe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVSTCBiYXNlIGNoYW5nZSBkZXRlY3RlZC4gQ2xvc2luZyBwcm9ncmFtLlwiKTtcclxuICAgICAgICAgICAgdGhpcy5zZW5kTWVzc2FnZVRvQmFja2dyb3VuZChTZW5kZXJNZXRob2QuQ2xvc2VTZXNzaW9uLCBuZXcgREJEb2N1bWVudCh0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmwsIGRvY3VtZW50LnRpdGxlKSkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gc2VuZCBpbnRlcmFjdGlvbiBkYXRhOicsIGVycm9yKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG5hdkV2ZW50Lm5hdmlnYXRpb25UeXBlID09PSBcInB1c2hcIikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlB1c2ggZXZlbnQgZGV0ZWN0ZWQuXCIpO1xyXG4gICAgICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmNyZWF0ZVN0YXRlQ2hhbmdlUmVjb3JkKG5hdkV2ZW50KTtcclxuICAgICAgICAgICAgdGhpcy5zZW5kTWVzc2FnZVRvQmFja2dyb3VuZChTZW5kZXJNZXRob2QuTmF2aWdhdGlvbkRldGVjdGlvbiwgcmVjb3JkKS5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBzZW5kIGludGVyYWN0aW9uIGRhdGE6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVDdXJyZW50UGFnZURhdGEodGhpcy5jdXJyZW50UGFnZURhdGEudXJsKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG5hdkV2ZW50Lm5hdmlnYXRpb25UeXBlID09PSBcInJlcGxhY2VcIikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlcGxhY2UgZXZlbnQgZGV0ZWN0ZWQuXCIpO1xyXG4gICAgICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmNyZWF0ZVNlbGZMb29wUmVjb3JkKG5hdkV2ZW50LCB1cmxDaGFuZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLnNlbmRNZXNzYWdlVG9CYWNrZ3JvdW5kKFNlbmRlck1ldGhvZC5OYXZpZ2F0aW9uRGV0ZWN0aW9uLCByZWNvcmQpLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHNlbmQgaW50ZXJhY3Rpb24gZGF0YTonLCBlcnJvcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICogR2VuZXJhdGVzIGEgdW5pcXVlIGNvbG9yIGZyb20gYSBnaXZlbiBzdHJpbmdcclxuICAgKiBTb3VyY2U6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zMTAzNzM4MyBcclxuICAgKiBAcmV0dXJucyBDb2xvciBoZXggY29kZVxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgU3RyaW5nVG9Db2xvciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGV0IGluc3RhbmNlOiBhbnkgPSBudWxsO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBuZXh0OiBmdW5jdGlvbiBzdHJpbmdUb0NvbG9yKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgICAgIGlmIChpbnN0YW5jZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2Uuc3RyaW5nVG9Db2xvckhhc2ggPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZS5uZXh0VmVyeURpZmZlcm50Q29sb3JJZHggPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLnZlcnlEaWZmZXJlbnRDb2xvcnMgPSBbXCIjMDBGRjAwXCIsIFwiIzAwMDBGRlwiLCBcIiNGRjAwMDBcIiwgXCIjMDFGRkZFXCIsIFwiI0ZGQTZGRVwiLCBcIiNGRkRCNjZcIiwgXCIjMDA2NDAxXCIsIFwiIzAxMDA2N1wiLCBcIiM5NTAwM0FcIiwgXCIjMDA3REI1XCIsIFwiI0ZGMDBGNlwiLCBcIiNGRkVFRThcIiwgXCIjNzc0RDAwXCIsIFwiIzkwRkI5MlwiLCBcIiMwMDc2RkZcIiwgXCIjRDVGRjAwXCIsIFwiI0ZGOTM3RVwiLCBcIiM2QTgyNkNcIiwgXCIjRkYwMjlEXCIsIFwiI0ZFODkwMFwiLCBcIiM3QTQ3ODJcIiwgXCIjN0UyREQyXCIsIFwiIzg1QTkwMFwiLCBcIiNGRjAwNTZcIiwgXCIjQTQyNDAwXCIsIFwiIzAwQUU3RVwiLCBcIiM2ODNEM0JcIiwgXCIjQkRDNkZGXCIsIFwiIzI2MzQwMFwiLCBcIiNCREQzOTNcIiwgXCIjMDBCOTE3XCIsIFwiIzlFMDA4RVwiLCBcIiMwMDE1NDRcIiwgXCIjQzI4QzlGXCIsIFwiI0ZGNzRBM1wiLCBcIiMwMUQwRkZcIiwgXCIjMDA0NzU0XCIsIFwiI0U1NkZGRVwiLCBcIiM3ODgyMzFcIiwgXCIjMEU0Q0ExXCIsIFwiIzkxRDBDQlwiLCBcIiNCRTk5NzBcIiwgXCIjOTY4QUU4XCIsIFwiI0JCODgwMFwiLCBcIiM0MzAwMkNcIiwgXCIjREVGRjc0XCIsIFwiIzAwRkZDNlwiLCBcIiNGRkU1MDJcIiwgXCIjNjIwRTAwXCIsIFwiIzAwOEY5Q1wiLCBcIiM5OEZGNTJcIiwgXCIjNzU0NEIxXCIsIFwiI0I1MDBGRlwiLCBcIiMwMEZGNzhcIiwgXCIjRkY2RTQxXCIsIFwiIzAwNUYzOVwiLCBcIiM2QjY4ODJcIiwgXCIjNUZBRDRFXCIsIFwiI0E3NTc0MFwiLCBcIiNBNUZGRDJcIiwgXCIjRkZCMTY3XCIsIFwiIzAwOUJGRlwiLCBcIiNFODVFQkVcIl07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFpbnN0YW5jZS5zdHJpbmdUb0NvbG9ySGFzaFtzdHJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2Uuc3RyaW5nVG9Db2xvckhhc2hbc3RyXSA9IGluc3RhbmNlLnZlcnlEaWZmZXJlbnRDb2xvcnNbaW5zdGFuY2UubmV4dFZlcnlEaWZmZXJudENvbG9ySWR4KytdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAlYyBUaGUgY29sb3VyIGZvciAke3N0cn1gLCBgY29sb3I6ICR7aW5zdGFuY2Uuc3RyaW5nVG9Db2xvckhhc2hbc3RyXX1gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZS5zdHJpbmdUb0NvbG9ySGFzaFtzdHJdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pKCk7XHJcbn1cclxuIiwiaW1wb3J0IHtTZWxlY3Rvck5hbWVQYWlyLCBQYXR0ZXJuRGF0YSwgUGF0dGVyblNlbGVjdG9yTWFwIH0gZnJvbSBcIi4vY29uZmlnXCI7XHJcbi8qKlxyXG4gKiBBIGNsYXNzIHJlc3BvbnNpYmxlIGZvciB0cmFja2luZyB0aGUgc3RhdGUgb2YgdGhlIHBhZ2UgdGhhdCB0aGUgdXNlciBpcyBjdXJyZW50bHkgb24uXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUGFnZURhdGEge1xyXG4gICAgLy8gVVJMIG9mIHRoZSBwYWdlXHJcbiAgICB1cmwhOiBzdHJpbmc7XHJcbiAgICAvLyBDU1Mgc2VsZWN0b3JzIGJlaW5nIGFwcGxpZWQgdG8gdGhlIHBhZ2VcclxuICAgIHNlbGVjdG9ycyE6IFNlbGVjdG9yTmFtZVBhaXJbXTtcclxuICAgIC8vIFRoZSBVUkwgcGF0dGVybiwgQ1NTIHNlbGVjdG9ycywgYW5kIG9wdGlvbmFsbHkgYSBmdW5jdGlvbiBmb3IgZ2V0dGluZyBwYWdlIElEIFxyXG4gICAgLy8gZm9yIHRoZSBwYXR0ZXJuIHRoYXQgbW9zdCBjbG9zZWx5IG1hdGNoZXMgdGhpcy51cmxcclxuICAgIC8vIEV4OiBJZiB0aGUgdXJsIGlzIHd3dy55b3V0dWJlLmNvbS9zaG9ydHMvQUJDIGFuZCB0aGUgcGF0dGVybnMgYXJlIC8qIGFuZCAvc2hvcnRzLzppZCwgdGhlbiBcclxuICAgIC8vIG1hdGNoUGF0aERhdGEgd291bGQgY29udGFpbiB0aGUgUGF0aERhdGEgZm9yIC9zaG9ydHMvOmlkLCBzaW5jZSBpdHMgYSBjbG9zZXIgbWF0Y2ggdG8gdGhlIFVSTC5cclxuICAgIG1hdGNoUGF0aERhdGEhOiBQYXR0ZXJuRGF0YTsgXHJcbiAgICBjdXJyZW50UGF0dGVybiE6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlcyB0aGUgc3RhdGUgb2YgdGhlIFBhZ2VEYXRhXHJcbiAgICAgKiBAcGFyYW0gYmFzZVVSTDogVGhlIGJhc2UgdXJsIGZvciB0aGUgcGFnZSAoZWcuIHd3dy55b3V0dWJlLmNvbSlcclxuICAgICAqIEBwYXJhbSB1cmw6IFRoZSBmdWxsIHVybCBvZiB0aGUgY3VycmVudCBwYWdlXHJcbiAgICAgKiBAcGFyYW0gcGF0aHM6IEEgbGlzdCBvZiBhbGwgdGhlIHBhdGhzIGRlZmluZWQgaW4gYSBjb25maWdcclxuICAgICAqL1xyXG4gICAgdXBkYXRlKGJhc2VVUkw6IHN0cmluZywgdXJsOiBzdHJpbmcsIHBhdGhzOiBQYXR0ZXJuU2VsZWN0b3JNYXApe1xyXG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xyXG4gICAgICAgIGxldCBtYXRjaGVzID0gdGhpcy51cGRhdGVNYXRjaERhdGEoYmFzZVVSTCwgcGF0aHMpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0b3JzID0gdGhpcy5nZXRTZWxlY3RvcnMobWF0Y2hlcywgcGF0aHMpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIGBtYXRjaFBhdGhEYXRhYCB0byBiZSB0aGUgUGF0aERhdGEgZm9yIHRoZSBVUkwgcGF0dGVybiB3aXRoIHRoZSBjbG9zZXQgbWF0Y2ggdG8gYGJhc2VVUkxgXHJcbiAgICAgKiBhbmQgcmV0dXJucyBhIGxpc3Qgb2YgYWxsIG1hdGNoZXMuIEFkZGl0aW9uYWxseSwgaXQgdXBkYXRlcyB3aGV0aGVyIHRoZSBjdXJyZW50IHBhdGhcclxuICAgICAqIGluY2x1ZGVzIGFuIGlkLlxyXG4gICAgICogQHBhcmFtIGJhc2VVUkw6IFRoZSBiYXNlIHVybCBmb3IgdGhlIHBhZ2UgKGVnLiB3d3cueW91dHViZS5jb20pXHJcbiAgICAgKiBAcGFyYW0gcGF0dGVybnM6IEEgbGlzdCBvZiBhbGwgdGhlIHBhdGhzIGRlZmluZWQgaW4gYSBjb25maWdcclxuICAgICAqIFxyXG4gICAgICogQHJldHVybnMgQSBsaXN0IG9mIGFsbCBwYXR0ZXJucyBpbiB0aGUgY29uZmlnIHRoYXQgbWF0Y2ggYGJhc2VVUkxgXHJcbiAgICAgKi9cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZU1hdGNoRGF0YShiYXNlVVJMOiBzdHJpbmcsIHBhdHRlcm5zOiBQYXR0ZXJuU2VsZWN0b3JNYXApOiBzdHJpbmdbXXtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInVwZGF0aW5nIHBhZ2UgZGF0YVwiKTtcclxuICAgICAgICBsZXQgY2xvc2VzdE1hdGNoID0gXCJcIjsgLy8gdGhlIHBhdHRlcm4gdGhhdCBtb3N0IGNsb3NlbHkgbWF0Y2hlcyB0aGUgY3VycmVudCBVUkxcclxuXHJcbiAgICAgICAgLy8gR2V0IGEgbGlzdCBvZiBhbGwgdGhlIHBhdGhzIHRoYXQgbWF0Y2ggdGhlIGN1cnJlbnQgVVJMXHJcbiAgICAgICAgY29uc3QgbWF0Y2hlcyA9IE9iamVjdC5rZXlzKHBhdHRlcm5zKS5maWx0ZXIoKHBhdGgpID0+IHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocGF0aCk7XHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmU6IElnbm9yaW5nIFR5cGVTY3JpcHQgZXJyb3IgZm9yIFVSTFBhdHRlcm4gbm90IGZvdW5kXHJcbiAgICAgICAgICAgIGNvbnN0IHAgPSBuZXcgVVJMUGF0dGVybihwYXRoLCBiYXNlVVJMKTtcclxuICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBwLnRlc3QodGhpcy51cmwpO1xyXG4gICAgICAgICAgICAvLyBDbG9zZXN0IG1hdGNoIGlzIHRoZSBsb25nZXN0IHBhdHRlcm4gdGhhdCBtYXRjaGVzIHRoZSBjdXJyZW50IFVSTFxyXG4gICAgICAgICAgICBpZiAobWF0Y2ggJiYgcGF0aC5sZW5ndGggPiBjbG9zZXN0TWF0Y2gubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBjbG9zZXN0TWF0Y2ggPSBwYXRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBtYXRjaDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGF0dGVybiA9IGNsb3Nlc3RNYXRjaDtcclxuXHJcbiAgICAgICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm8gbWF0Y2hlcyBmb3VuZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHRoaXMudXJsVXNlc0lkID0gY2xvc2VzdE1hdGNoLmVuZHNXaXRoKFwiOmlkXCIpO1xyXG4gICAgICAgIHRoaXMubWF0Y2hQYXRoRGF0YSA9IHBhdHRlcm5zW2Nsb3Nlc3RNYXRjaF07XHJcbiAgICAgICAgcmV0dXJuIG1hdGNoZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gbWF0Y2hlczogQSBsaXN0IG9mIGFsbCBtYXRjaGluZyBwYXRocyB0byB0aGUgY3VycmVudCB1cmxcclxuICAgICAqIEBwYXJhbSBwYXRoczogQSBsaXN0IG9mIGFsbCB0aGUgcGF0aHMgZGVmaW5lZCBpbiBhIGNvbmZpZ1xyXG4gICAgICogXHJcbiAgICAgKiBAcmV0dXJucyBBIGxpc3Qgb2YgYWxsIHNlbGVjdG9ycyBmb3IgdGhlIG1hdGNoaW5nIHBhdGhzXHJcbiAgICAgKi9cclxuXHJcbiAgICBwcml2YXRlIGdldFNlbGVjdG9ycyhtYXRjaGVzOiBzdHJpbmdbXSwgcGF0aHM6IFBhdHRlcm5TZWxlY3Rvck1hcCk6IFNlbGVjdG9yTmFtZVBhaXJbXSB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRTZWxlY3RvcnMgPSBbXTtcclxuICAgICAgICBmb3IgKGNvbnN0IHBhdGggb2YgbWF0Y2hlcykge1xyXG4gICAgICAgICAgICBsZXQgcGF0aERhdGEgPSBwYXRoc1twYXRoXTtcclxuICAgICAgICAgICAgaWYgKHBhdGhEYXRhW1wic2VsZWN0b3JzXCJdKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHBhdGhEYXRhW1wic2VsZWN0b3JzXCJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNlbGVjdG9ycy5wdXNoKHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY3VycmVudFNlbGVjdG9ycztcclxuICAgIH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvY29udGVudC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==