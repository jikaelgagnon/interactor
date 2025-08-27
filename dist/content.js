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
            const elements = document.querySelectorAll(`:is(${interaction.selector}):not([${this.interactionAttribute}])`);
            const name = interaction.name;
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
        const baseURLChange = navEvent.destination.url.split(".")[1] != this.currentPageData.url.split(".")[1];
        const urlChange = !(navEvent.destination.url === this.currentPageData.url);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QixJQUFJLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDckIsS0FBSyxNQUFNLFFBQVEsSUFBSSxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQ3hDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDcEMsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQ0QsT0FBTyxnQkFBZ0IsQ0FBQztJQUM1QixDQUFDO0NBQ0o7QUEvRUQsNEJBK0VDOzs7Ozs7O1VDbkZEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2NvbW11bmljYXRpb24vYWN0aXZpdHkudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb21tdW5pY2F0aW9uL2JhY2tncm91bmRtZXNzYWdlLnRzIiwid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvY29tbXVuaWNhdGlvbi9zZW5kZXIudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9jb250ZW50LnRzIiwid2VicGFjazovL2ludGVyYWN0b3IvLi9zcmMvZGF0YWJhc2UvZGJkb2N1bWVudC50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2ludGVyYWN0aW9ucy9jb25maWcudHMiLCJ3ZWJwYWNrOi8vaW50ZXJhY3Rvci8uL3NyYy9pbnRlcmFjdGlvbnMvbW9uaXRvci50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yLy4vc3JjL2ludGVyYWN0aW9ucy9wYWdlZGF0YS50cyIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2ludGVyYWN0b3Ivd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9pbnRlcmFjdG9yL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIERlZmluZXMgYSBsaXN0IG9mIHRoZSBwb3NzaWJsZSBhY3Rpdml0eSB0eXBlcyB0aGF0IGNhbiBiZSByZWNvcmRlZCBieSB0aGUgTW9uaXRvciBjbGFzc1xuICovXG5lbnVtIEFjdGl2aXR5VHlwZSB7XG4gICAgU2VsZkxvb3AgPSBcIlNlbGYtTG9vcFwiLFxuICAgIFN0YXRlQ2hhbmdlID0gXCJTdGF0ZSBDaGFuZ2VcIixcbiAgICBJbnRlcmFjdGlvbiA9IFwiSW50ZXJhY3Rpb25cIixcbiAgICBCb3RoID0gXCJCb3RoXCJcbn1cblxuZXhwb3J0IHtBY3Rpdml0eVR5cGV9IiwiaW1wb3J0IHtEQkRvY3VtZW50IH0gZnJvbSBcIi4uL2RhdGFiYXNlL2RiZG9jdW1lbnRcIjtcbmltcG9ydCB7IFNlbmRlck1ldGhvZCB9IGZyb20gXCIuL3NlbmRlclwiO1xuZXhwb3J0IHtCYWNrZ3JvdW5kTWVzc2FnZX07XG4vKipcbiAqIEEgY2xhc3MgdXNlZCB0byBzZW5kIG1lc3NhZ2VzIGZyb20gdGhlIGNvbnRlbnQgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0IGluIGEgY29uc2lzdGVudCBmb3JtYXQuXG4gKi9cbmNsYXNzIEJhY2tncm91bmRNZXNzYWdlIHtcbiAgICBzZW5kZXJNZXRob2Q6IFNlbmRlck1ldGhvZDtcbiAgICBwYXlsb2FkOiBEQkRvY3VtZW50O1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBzZW5kZXJNZXRob2QgLSBlbnVtIHR5cGUgb2YgdGhlIG1ldGhvZCBzZW5kaW5nIHRoZSBtZXNzYWdlXG4gICAgICogQHBhcmFtIHBheWxvYWQgLSB0aGUgZGF0YSBiZWluZyBzZW50IHRvIHRoZSBkYXRhYmFzZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yIChzZW5kZXJNZXRob2Q6IFNlbmRlck1ldGhvZCwgcGF5bG9hZDogREJEb2N1bWVudCkge1xuICAgICAgICB0aGlzLnNlbmRlck1ldGhvZCA9IHNlbmRlck1ldGhvZDtcbiAgICAgICAgdGhpcy5wYXlsb2FkID0gcGF5bG9hZDtcbiAgICB9XG59IiwiZW51bSBTZW5kZXJNZXRob2R7XG4gICAgSW5pdGlhbGl6ZVNlc3Npb24gPSBcIkluaXRpYWxpemUgU2Vzc2lvblwiLFxuICAgIEludGVyYWN0aW9uRGV0ZWN0aW9uID0gXCJJbnRlcmFjdGlvbiBEZXRlY3Rpb25cIixcbiAgICBOYXZpZ2F0aW9uRGV0ZWN0aW9uID0gXCJOYXZpZ2F0aW9uIERldGVjdGlvblwiLFxuICAgIENsb3NlU2Vzc2lvbiA9IFwiQ2xvc2UgU2Vzc2lvblwiLFxuICAgIEFueSA9IFwiQW55XCJcbn1cbmV4cG9ydCB7U2VuZGVyTWV0aG9kfTsiLCJpbXBvcnQgeyBNb25pdG9yIH0gZnJvbSBcIi4vaW50ZXJhY3Rpb25zL21vbml0b3JcIjtcbmltcG9ydCB5dENvbmZpZyBmcm9tICcuL2NvbmZpZ3MveW91dHViZV9jb25maWcuanNvbic7XG5pbXBvcnQgdGlrdG9rQ29uZmlnIGZyb20gJy4vY29uZmlncy90aWt0b2tfY29uZmlnLmpzb24nO1xuaW1wb3J0IGxpbmtlZGluQ29uZmlnIGZyb20gJy4vY29uZmlncy9saW5rZWRpbl9jb25maWcuanNvbic7XG5pbXBvcnQgeyBDb25maWdMb2FkZXIsIEV4dHJhY3RvckRhdGEgfSBmcm9tIFwiLi9pbnRlcmFjdGlvbnMvY29uZmlnXCI7XG5pbXBvcnQgeyBBY3Rpdml0eVR5cGUgfSBmcm9tIFwiLi9jb21tdW5pY2F0aW9uL2FjdGl2aXR5XCI7XG5pbXBvcnQgeyBTZW5kZXJNZXRob2QgfSBmcm9tIFwiLi9jb21tdW5pY2F0aW9uL3NlbmRlclwiO1xuXG5cbmNvbnN0IGdldEhvbWVwYWdlVmlkZW9zID0gKCk6IG9iamVjdCA9PiB7XG4gICAgLy8gY29uc29sZS5sb2coXCItLS0tIEVYVFJBQ1RJTkcgSE9NRVBBR0UgTElOS1MgLS0tXCIpO1xuICAgIGNvbnN0IGNvbnRlbnREaXZzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjY29udGVudC55dGQtcmljaC1pdGVtLXJlbmRlcmVyJykpXG4gICAgICAgIC5maWx0ZXIoZGl2ID0+IHtcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGVsZW1lbnQgaXMgYWN0dWFsbHkgdmlzaWJsZVxuICAgICAgICAgICAgY29uc3QgcmVjdCA9IGRpdi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIHJldHVybiByZWN0LndpZHRoID4gMCAmJiByZWN0LmhlaWdodCA+IDAgJiYgXG4gICAgICAgICAgICAgICAgZ2V0Q29tcHV0ZWRTdHlsZShkaXYpLnZpc2liaWxpdHkgIT09ICdoaWRkZW4nO1xuICAgICAgICB9KTtcbiAgICBcbiAgICBjb25zdCB2aWRlb3MgPSBjb250ZW50RGl2cy5tYXAoY29udGVudERpdiA9PiB7XG4gICAgICAgIC8vIEdldCB0aGUgZGlyZWN0IGFuY2hvciBjaGlsZFxuICAgICAgICBjb25zdCBhbmNob3IgPSBjb250ZW50RGl2LnF1ZXJ5U2VsZWN0b3IoJzpzY29wZSA+IHl0LWxvY2t1cC12aWV3LW1vZGVsIGEnKSEgYXMgSFRNTEFuY2hvckVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IHNwYW4gPSBjb250ZW50RGl2LnF1ZXJ5U2VsZWN0b3IoJ2gzIGEgc3Bhbi55dC1jb3JlLWF0dHJpYnV0ZWQtc3RyaW5nJykhO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxpbms6IGFuY2hvcj8uaHJlZiA/PyAnJyxcbiAgICAgICAgICAgIHRpdGxlOiBzcGFuPy50ZXh0Q29udGVudD8udHJpbSgpID8/ICcnXG4gICAgICAgIH07XG4gICAgfSkuZmlsdGVyKHZpZGVvID0+IHZpZGVvLmxpbmsgIT09ICcnKTtcbiAgICBcbiAgICByZXR1cm4ge1widmlkZW9zXCI6IHZpZGVvc307XG59O1xuXG5jb25zdCBnZXRSZWNvbW1lbmRlZFZpZGVvcyA9ICgpOiBvYmplY3QgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiLS0tLSBFWFRSQUNUSU5HIFJFQ09NTUVOREVEIExJTktTIC0tLVwiKTtcbiAgICBjb25zdCBjb250ZW50RGl2cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgneXQtbG9ja3VwLXZpZXctbW9kZWwnKSkuZmlsdGVyKGRpdiA9PiB7XG4gICAgICAgIC8vIENoZWNrIGlmIGVsZW1lbnQgaXMgYWN0dWFsbHkgdmlzaWJsZVxuICAgICAgICBjb25zdCByZWN0ID0gZGl2LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICByZXR1cm4gcmVjdC53aWR0aCA+IDAgJiYgcmVjdC5oZWlnaHQgPiAwICYmIFxuICAgICAgICAgICAgZ2V0Q29tcHV0ZWRTdHlsZShkaXYpLnZpc2liaWxpdHkgIT09ICdoaWRkZW4nO1xuICAgIH0pO1xuICAgIFxuICAgIGNvbnN0IHZpZGVvczogb2JqZWN0ID0gY29udGVudERpdnMubWFwKGNvbnRlbnREaXYgPT4ge1xuICAgICAgICAvLyBHZXQgdGhlIGFuY2hvciB3aXRoIHRoZSB2aWRlbyBsaW5rXG4gICAgICAgIGNvbnN0IGFuY2hvciA9IGNvbnRlbnREaXYucXVlcnlTZWxlY3RvcignYVtocmVmXj1cIi93YXRjaFwiXScpISBhcyBIVE1MQW5jaG9yRWxlbWVudDtcbiAgICAgICAgY29uc3Qgc3BhbiA9IGNvbnRlbnREaXYucXVlcnlTZWxlY3RvcignaDMgYSBzcGFuLnl0LWNvcmUtYXR0cmlidXRlZC1zdHJpbmcnKSE7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGluazogYW5jaG9yPy5ocmVmID8/ICcnLFxuICAgICAgICAgICAgdGl0bGU6IHNwYW4/LnRleHRDb250ZW50Py50cmltKCkgPz8gJydcbiAgICAgICAgfTtcbiAgICB9KS5maWx0ZXIodmlkZW8gPT4gdmlkZW8ubGluayAhPT0gJycpO1xuICAgIFxuICAgIC8vIGNvbnNvbGUubG9nKFwiUHJpbnRpbmcgdGhlIGZpcnN0IDUgdmlkZW9zXCIpO1xuICAgIC8vIGNvbnNvbGUudGFibGUodmlkZW9zLnNsaWNlKDAsNSkpO1xuICAgIHJldHVybiB7XCJ2aWRlb3NcIjogdmlkZW9zfTtcbn07XG5cbmNvbnN0IGV4dHJhY3RvcnMgPSBbbmV3IEV4dHJhY3RvckRhdGEoU2VuZGVyTWV0aG9kLkludGVyYWN0aW9uRGV0ZWN0aW9uLCBcIi9cIiwgZ2V0SG9tZXBhZ2VWaWRlb3MpLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBFeHRyYWN0b3JEYXRhKFNlbmRlck1ldGhvZC5JbnRlcmFjdGlvbkRldGVjdGlvbiwgXCIvd2F0Y2g/dj0qXCIsIGdldFJlY29tbWVuZGVkVmlkZW9zKV1cblxuY29uc3QgeXRDb25maWdMb2FkZXIgPSBuZXcgQ29uZmlnTG9hZGVyKHl0Q29uZmlnLCBleHRyYWN0b3JzKTtcblxuY29uc3QgeXRJbnRlcmFjdG9yID0gbmV3IE1vbml0b3IoeXRDb25maWdMb2FkZXIpO1xuXG4vLyBjb25zdCB0aWt0b2tJRFNlbGVjdG9yID0gKCk6IG9iamVjdCA9PiB7XG4vLyAgICAgbGV0IHZpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYueGdwbGF5ZXItY29udGFpbmVyLnRpa3Rvay13ZWItcGxheWVyXCIpO1xuLy8gICAgIGlmICghdmlkKXtcbi8vICAgICAgICAgY29uc29sZS5sb2coXCJubyB1cmwgZm91bmQhXCIpO1xuLy8gICAgICAgICByZXR1cm4ge307XG4vLyAgICAgfVxuLy8gICAgIGxldCBpZCA9IHZpZC5pZC5zcGxpdChcIi1cIikuYXQoLTEpO1xuLy8gICAgIGxldCB1cmwgPSBgaHR0cHM6Ly90aWt0b2suY29tL3NoYXJlL3ZpZGVvLyR7aWR9YDtcbi8vICAgICByZXR1cm4ge1xuLy8gICAgICAgICBcInVuaXF1ZVVSTFwiOiB1cmxcbi8vICAgICB9O1xuLy8gfVxuXG5cblxuLy8gY29uc29sZS5sb2codGlrdG9rQ29uZmlnKTtcbi8vIGNvbnN0IHRpa3Rva0NvbmZpZ0xvYWRlciA9IG5ldyBDb25maWdMb2FkZXIodGlrdG9rQ29uZmlnKTtcbi8vIHRpa3Rva0NvbmZpZ0xvYWRlci5pbmplY3RFeHRyYWN0b3IoXCIvKlwiLCB0aWt0b2tJRFNlbGVjdG9yKTtcbi8vIGNvbnN0IHRpa3Rva0ludGVyYWN0b3IgPSBuZXcgTW9uaXRvcih0aWt0b2tDb25maWdMb2FkZXIuY29uZmlnKTtcblxuLy8gLy8gY29uc29sZS5sb2codGlrdG9rQ29uZmlnKTtcbi8vIGNvbnN0IGxpbmtlZGluQ29uZmlnTG9hZGVyID0gbmV3IENvbmZpZ0xvYWRlcihsaW5rZWRpbkNvbmZpZyk7XG4vLyBjb25zdCBsaW5rZWRpbkludGVyYWN0b3IgPSBuZXcgTW9uaXRvcihsaW5rZWRpbkNvbmZpZ0xvYWRlci5jb25maWcpOyIsImltcG9ydCB7IEFjdGl2aXR5VHlwZSB9IGZyb20gXCIuLi9jb21tdW5pY2F0aW9uL2FjdGl2aXR5XCI7XHJcbi8qKlxyXG4gKiBBIGNsYXNzIGRlZmluaW5nIGRvY3VtZW50cyB0aGF0IGFyZSBzZW50IHRvIHRoZSBkYXRhYmFzZSBmcm9tIHRoZSBjb250ZW50IHNjcmlwdFxyXG4gKi9cclxuY2xhc3MgREJEb2N1bWVudCB7XHJcbiAgICAvLyBVUkwgYXQgd2hpY2h0IHRoZSBldmVudCB3YXMgY3JlYXRlZFxyXG4gICAgc291cmNlVVJMOiBzdHJpbmc7XHJcbiAgICBzb3VyY2VEb2N1bWVudFRpdGxlOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnNvdXJjZVVSTCA9IHVybDtcclxuICAgICAgICB0aGlzLnNvdXJjZURvY3VtZW50VGl0bGUgPSB0aXRsZTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgY2hpbGQgb2YgREJEb2N1bWVudCB0aGF0IHJlcHJlc2VudHMgYWN0aXZpdGllc1xyXG4gKi9cclxuXHJcbmNsYXNzIEFjdGl2aXR5RG9jdW1lbnQgZXh0ZW5kcyBEQkRvY3VtZW50e1xyXG4gICAgLy8gVGhlIHR5cGUgb2YgYWN0aXZpdHkgYmVpbmcgbG9nZ2VkLiBFaXRoZXIgXCJzdGF0ZV9jaGFnZVwiLCBcInNlbGZfbG9vcFwiLCBvciBcImludGVyYWN0aW9uXCJcclxuICAgIGFjdGl2aXR5VHlwZTogQWN0aXZpdHlUeXBlO1xyXG4gICAgLy8gVGltZXN0YW1wIGZvciB3aGVuIHRoZSBkb2N1bWVudCB3YXMgY3JlYXRlZFxyXG4gICAgY3JlYXRlZEF0OiBEYXRlO1xyXG4gICAgLy8gRXZlbnQgdHlwZSAoZWcuIGNsaWNrLCBzY3JvbGwsIGV0Yy4uLilcclxuICAgIGV2ZW50VHlwZTogc3RyaW5nXHJcbiAgICAvLyBNZXRhZGF0YSBhYm91dCB0aGUgZXZlbnRcclxuICAgIG1ldGFkYXRhOiBvYmplY3Q7XHJcbiAgICBjb25zdHJ1Y3Rvcih0eXBlOiBBY3Rpdml0eVR5cGUsIGV2ZW50OiBFdmVudCwgbWV0YWRhdGE6IG9iamVjdCwgdXJsOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcih1cmwsIHRpdGxlKTtcclxuICAgICAgICB0aGlzLmFjdGl2aXR5VHlwZSA9IHR5cGU7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVkQXQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRUeXBlID0gZXZlbnQudHlwZVxyXG4gICAgICAgIHRoaXMubWV0YWRhdGEgPSBtZXRhZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgY2hpbGQgb2YgREJEb2N1bWVudCB0aGF0IHJlcHJlc2VudHMgdGhlIHN0YXJ0IG9mIGEgc2Vzc2lvblxyXG4gKi9cclxuXHJcbmNsYXNzIFNlc3Npb25Eb2N1bWVudCBleHRlbmRzIERCRG9jdW1lbnR7XHJcbiAgICBzdGFydFRpbWU6IERhdGU7XHJcbiAgICBlbmRUaW1lPzogRGF0ZTtcclxuICAgIGVtYWlsID0gXCJFbWFpbCBub3Qgc2V0XCI7XHJcbiAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgdGl0bGU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKHVybCwgdGl0bGUpO1xyXG4gICAgICAgIHRoaXMuc3RhcnRUaW1lID0gbmV3IERhdGUoKTtcclxuICAgIH1cclxuICAgIHNldEVtYWlsKGVtYWlsOiBzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuZW1haWwgPSBlbWFpbDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtEQkRvY3VtZW50LCBBY3Rpdml0eURvY3VtZW50LCBTZXNzaW9uRG9jdW1lbnR9OyIsImltcG9ydCB7IFNlbmRlck1ldGhvZCB9IGZyb20gXCIuLi9jb21tdW5pY2F0aW9uL3NlbmRlclwiO1xuXG5leHBvcnQge1NlbGVjdG9yTmFtZVBhaXIsIENvbmZpZywgQ29uZmlnTG9hZGVyLCBQYXR0ZXJuRGF0YSwgUGF0dGVyblNlbGVjdG9yTWFwLCBFeHRyYWN0b3JEYXRhLCBFeHRyYWN0b3JMaXN0fTtcblxuaW50ZXJmYWNlIFNlbGVjdG9yTmFtZVBhaXJ7XG4gICAgLyoqXG4gICAgICogQW4gaW50ZXJmYWNlIHRvIG1hcCBDU1Mgc2VsZWN0b3JzIHRvIGh1bWFuIHJlYWRhYmxlIG5hbWVzXG4gICAgICovXG4gICAgLy8gVGhlIENTUyBzZWxlY3RvclxuICAgIHNlbGVjdG9yOiBzdHJpbmc7XG4gICAgLy8gVGhlIGh1bWFuIHJlYWRhYmxlIG5hbWUgZm9yIHRoZSBDU1Mgc2VsZWN0b3JcbiAgICBuYW1lOiBzdHJpbmc7XG59XG5cbnR5cGUgUGF0dGVyblNlbGVjdG9yTWFwID0gUmVjb3JkPHN0cmluZywgUGF0dGVybkRhdGE+O1xuXG5pbnRlcmZhY2UgUGF0dGVybkRhdGEge1xuICAgIC8qKlxuICAgICAqIEFuIGludGVyZmFjZSB0byBidW5kbGUgdG9nZXRoZXIgZGF0YSBpbiB0aGUgQ29uZmlnIGZvciBhIGdpdmVuIHBhdGggcGF0dGVybi5cbiAgICAgKiBJdCBjb250YWlucyBhIGxpc3Qgb2YgQ1NTIHNlbGVjdG9ycyBmb3IgdGhlIHBhdGggcGF0dGVybiBhbmQgb3B0aW9uYWxseVxuICAgICAqIGFuIGlkU2VsZWN0b3IgZnVuY3Rpb24gdGhhdCBleHRyYWN0cyBhbiBJRCBmcm9tIHBhZ2VzIHdpdGggdGhlIGNvcnJlc3BvbmRpbmcgVVJMXG4gICAgICovXG4gICAgLy8gQSBsaXN0IG9mIHNlbGVjdG9ycyBhbmQgbmFtZXMgZm9yIHRoZSBwYWdlXG4gICAgc2VsZWN0b3JzPzogU2VsZWN0b3JOYW1lUGFpcltdO1xuICAgIC8vIEEgZnVuY3Rpb24gdGhhdCBleHRyYWN0cyBtZXRhZGF0YSBmcm9tIHRoZSBwYWdlXG4gICAgZGF0YUV4dHJhY3Rvcj86ICgpID0+IG9iamVjdDtcbn1cblxuaW50ZXJmYWNlIENvbmZpZyB7XG4gICAgLyoqXG4gICAgICogQW4gaW50ZXJmYWNlIHRoYXQgY29udGFpbnMgYWxsIHRoZSBkYXRhIHJlcXVpcmVkIHRvIGluc3RhbnRpYXRlIGEgTW9uaXRvci5cbiAgICAgKi9cbiAgICAvLyBUaGUgYmFzZSBVUkwgdGhhdCB0aGUgbW9uaXRvciBzaG91bGQgc3RhcnQgYXRcbiAgICBiYXNlVVJMOiBzdHJpbmc7XG4gICAgLy8gQSBtYXBwaW5nIG9mIFVSTCBwYXR0ZXJucyB0byBwYXRoIGRhdGEuIFRoZSBVUkwgUGF0dGVybiBzaG91bGQgZm9sbG93IHRoZSBcbiAgICAvLyBVUkwgUGF0dGVybiBBUEkgc3ludGF4LiBUaGVzZSBhcmUgYXBwZW5kZWQgdG8gdGhlIGJhc2VVUkwgd2hlbiBjaGVja2luZyBmb3IgbWF0Y2hlc1xuICAgIC8vIEV4OiBiYXNlVVJMOiB3d3cueW91dHViZS5jb20sIHBhdGg6IC9zaG9ydHMvOmlkIC0+IHd3dy55b3V0dWJlLmNvbS9zaG9ydHMvOmlkXG4gICAgcGF0aHM6IFBhdHRlcm5TZWxlY3Rvck1hcDtcbiAgICAvLyBJbmRpY2F0ZXMgd2hldGhlciB0aGUgTW9uaXRvciBzaG91bGQgYmUgaW4gZGVidWcgbW9kZS4gSWYgdHJ1ZSwgYWRkIGNvbG91cmVkIGJveGVzXG4gICAgLy8gYXJvdW5kIHNlbGVjdGVkIEhUTUwgZWxlbWVudHNcbiAgICBkZWJ1Zz86IGJvb2xlYW47XG4gICAgLy8gQSBsaXN0IG9mIGV2ZW50IHR5cGVzIHRvIG1vbml0b3IuIEJ5IGRlZmF1bHQsIHRoaXMgaXMganVzdCBbXCJjbGlja1wiXVxuICAgIGV2ZW50cz86IHN0cmluZ1tdO1xufVxuXG5jbGFzcyBFeHRyYWN0b3JEYXRhIHtcbiAgICBldmVudFR5cGU6IFNlbmRlck1ldGhvZDtcbiAgICB1cmxQYXR0ZXJuOiBzdHJpbmc7XG4gICAgZXh0cmFjdG9yOiAoKSA9PiBvYmplY3Q7XG4gICAgY29uc3RydWN0b3IoYWN0aXZpdHlUeXBlOiBTZW5kZXJNZXRob2QsIHVybFBhdHRlcm46IHN0cmluZywgZXh0cmFjdG9yOiAoKSA9PiBvYmplY3Qpe1xuICAgICAgICB0aGlzLmV2ZW50VHlwZSA9IGFjdGl2aXR5VHlwZTtcbiAgICAgICAgdGhpcy51cmxQYXR0ZXJuID0gdXJsUGF0dGVybjtcbiAgICAgICAgdGhpcy5leHRyYWN0b3IgPSBleHRyYWN0b3I7XG4gICAgfVxufVxuXG5jbGFzcyBFeHRyYWN0b3JMaXN0IHtcbiAgICBwcml2YXRlIGV4dHJhY3RvcnM6IEV4dHJhY3RvckRhdGFbXTtcbiAgICBwcml2YXRlIGJhc2VVUkw6IHN0cmluZztcbiAgICBjb25zdHJ1Y3RvcihleHRyYWN0b3JzOiBFeHRyYWN0b3JEYXRhW10gPSBbXSwgYmFzZVVSTDogc3RyaW5nKXtcbiAgICAgICAgdGhpcy5leHRyYWN0b3JzID0gZXh0cmFjdG9ycztcbiAgICAgICAgdGhpcy5iYXNlVVJMID0gYmFzZVVSTDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZXh0cmFjdChjdXJyZW50VVJMOiBzdHJpbmcsIGV2ZW50VHlwZTogU2VuZGVyTWV0aG9kKXtcbiAgICAgICAgY29uc29sZS5sb2coYEF0dGVtcHRpbmcgZXh0cmFjdGlvbiBmb3IgdXJsOiAke2N1cnJlbnRVUkx9IGFuZCBldmVudCB0eXBlICR7ZXZlbnRUeXBlfWApO1xuICAgICAgICBsZXQgZXh0cmFjdGVkRGF0YTogb2JqZWN0ID0ge307XG4gICAgICAgIHRoaXMuZXh0cmFjdG9ycy5maWx0ZXIoZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNDb3JyZWN0QWN0aXZpdHkgPSAoZS5ldmVudFR5cGUgPT0gZXZlbnRUeXBlIHx8IGUuZXZlbnRUeXBlID09IFNlbmRlck1ldGhvZC5BbnkpO1xuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmU6IElnbm9yaW5nIFR5cGVTY3JpcHQgZXJyb3IgZm9yIFVSTFBhdHRlcm4gbm90IGZvdW5kXG4gICAgICAgICAgICAgICAgY29uc3QgcCA9IG5ldyBVUkxQYXR0ZXJuKGUudXJsUGF0dGVybiwgdGhpcy5iYXNlVVJMKTtcbiAgICAgICAgICAgICAgICBjb25zdCBpc1VSTE1hdGNoID0gcC50ZXN0KGN1cnJlbnRVUkwpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpc0NvcnJlY3RBY3Rpdml0eSAmJiBpc1VSTE1hdGNoO1xuICAgICAgICAgICAgfSkuZm9yRWFjaChlID0+XG4gICAgICAgICAgICAgICAgZXh0cmFjdGVkRGF0YSA9IHsuLi4gZXh0cmFjdGVkRGF0YSwgLi4uIGUuZXh0cmFjdG9yKCl9XG4gICAgICAgICAgICApXG4gICAgICAgIHJldHVybiBleHRyYWN0ZWREYXRhO1xuICAgIH1cbn1cblxuY2xhc3MgQ29uZmlnTG9hZGVyIHtcbiAgICBwdWJsaWMgY29uZmlnOiBDb25maWc7XG4gICAgcHVibGljIGV4dHJhY3Rvckxpc3Q6IEV4dHJhY3Rvckxpc3Q7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb25maWc6IENvbmZpZywgZXh0cmFjdG9yTGlzdDogRXh0cmFjdG9yRGF0YVtdID0gW10pe1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy5leHRyYWN0b3JMaXN0ID0gbmV3IEV4dHJhY3Rvckxpc3QoZXh0cmFjdG9yTGlzdCwgY29uZmlnLmJhc2VVUkwpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEJhY2tncm91bmRNZXNzYWdlIH0gZnJvbSBcIi4uL2NvbW11bmljYXRpb24vYmFja2dyb3VuZG1lc3NhZ2VcIjtcclxuaW1wb3J0IHtEQkRvY3VtZW50LCBBY3Rpdml0eURvY3VtZW50LCBTZXNzaW9uRG9jdW1lbnR9IGZyb20gXCIuLi9kYXRhYmFzZS9kYmRvY3VtZW50XCI7XHJcbmltcG9ydCB7IENvbmZpZywgQ29uZmlnTG9hZGVyLCBFeHRyYWN0b3JMaXN0LCBQYXR0ZXJuU2VsZWN0b3JNYXB9IGZyb20gXCIuL2NvbmZpZ1wiO1xyXG5pbXBvcnQgeyBQYWdlRGF0YSB9IGZyb20gXCIuL3BhZ2VkYXRhXCI7XHJcbmltcG9ydCB7IEFjdGl2aXR5VHlwZSB9IGZyb20gXCIuLi9jb21tdW5pY2F0aW9uL2FjdGl2aXR5XCI7XHJcbmltcG9ydCB7U2VuZGVyTWV0aG9kfSBmcm9tIFwiLi4vY29tbXVuaWNhdGlvbi9zZW5kZXJcIlxyXG5cclxuLyoqXHJcbiAqIFRoaXMgY2xhc3MgcmVhZHMgZnJvbSBhIHByb3ZpZGVkIENvbmZpZyBvYmplY3QgYW5kIGF0dGFjaGVzIGxpc3RlbmVycyB0byB0aGUgZWxlbWVudHMgc3BlY2lmaWVkIGluIHRoZSBzZWxlY3RvcnMuXHJcbiAqIFdoZW4gdGhlc2UgZWxlbWVudHMgYXJlIGludGVyYWN0ZWQgd2l0aCwgb3Igd2hlbiBhIG5hdmlnYXRpb24gb2NjdXJzLCBhIGRvY3VtZW50IGlzIHNlbnQgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0XHJcbiAqIHRvIGJlIGFwcGVuZGVkIHRvIHRoZSBkYXRhYmFzZS4gVGhpcyBjbGFzcyBpcyBpbnN0YW50aWF0ZWQgaW4gY29udGVudC50cy5cclxuICogXHJcbiAqIEBwYXJhbSBpbnRlcmFjdGlvbkV2ZW50cyAtIEEgbGlzdCBvZiB0aGUgdHlwZSBvZiBldmVudHMgd2Ugd2FudCB0byBtb25pdG9yIGFzIGludGVyYWN0aW9ucyAoZWcuIGNsaWNrLCBzY3JvbGwsIGV0Yy4pLiBEZWZhdWx0IGlzIGNsaWNrXHJcbiAqIEBwYXJhbSBkZWJ1ZyAtIElmIHRydWUsIGhpZ2hsaWdodCBhbGwgc2VsZWN0ZWQgSFRNTCBlbGVtZW50cyB3aXRoIGNvbG91cmVkIGJveGVzXHJcbiAqIEBwYXJhbSBwYXRocyAtIEFuIG9iamVjdCBtYXBwaW5nIHBhdGggcGF0dGVybnMgdG8gdGhlaXIgY29ycmVzcG9uZGluZyBDU1Mgc2VsZWN0b3JzIFBhdGggcGF0dGVybnMgYXJlIGNvbnNpc3RlbnQgd2l0aCB0aGUgIFVSTCBQYXR0ZXJuIEFQSSBTeW50YXg6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9VUkxfUGF0dGVybl9BUElcclxuICogQHBhcmFtIGJhc2VVUkwgLSBCYXNlIHVybCBmb3IgdGhlIHBhZ2UgKGVnLiB3d3cueW91dHViZS5jb20pLiBBbGwgcGF0aHMgYXJlIGFwcGVuZGVkIHRvIHRoaXMgd2hlbiBtYXRjaGluZyBVUmxzXHJcbiAqIEBwYXJhbSBjdXJyZW50UGFnZURhdGEgLSBDb250YWlucyBkYXRhIHJlbGV2YW50IHRvIHRoZSBjdXJyZW50IHBhZ2UuXHJcbiAqIEBwYXJhbSBpbnRlcmFjdGlvbkF0dHJpYnV0ZSAtIEF0dHJpYnV0ZSBhZGRlZCB0byBhbGwgZWxlbWVudHMgYmVpbmcgbW9uaXRvcmVkXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTW9uaXRvciB7XHJcbiAgICAvLyBBIGxpc3Qgb2YgdGhlIHR5cGUgb2YgZXZlbnRzIHdlIHdhbnQgdG8gbW9uaXRvciBhcyBpbnRlcmFjdGlvbnMgKGVnLiBjbGljaywgc2Nyb2xsLCBldGMuKS4gRGVmYXVsdCBpcyBjbGlja1xyXG4gICAgaW50ZXJhY3Rpb25FdmVudHM6IHN0cmluZ1tdO1xyXG4gICAgLy8gSWYgdHJ1ZSwgaGlnaGxpZ2h0IGFsbCBzZWxlY3RlZCBIVE1MIGVsZW1lbnRzIHdpdGggY29sb3VyZWQgYm94ZXNcclxuICAgIGhpZ2hsaWdodDogYm9vbGVhbjtcclxuICAgIC8vIEFuIG9iamVjdCBtYXBwaW5nIHBhdGggcGF0dGVybnMgdG8gdGhlaXIgY29ycmVzcG9uZGluZyBDU1Mgc2VsZWN0b3JzXHJcbiAgICAvLyBQYXRoIHBhdHRlcm5zIGFyZSBjb25zaXN0ZW50IHdpdGggdGhlIFVSTCBQYXR0ZXJuIEFQSSBTeW50YXg6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9VUkxfUGF0dGVybl9BUElcclxuICAgIHBhdGhzOiBQYXR0ZXJuU2VsZWN0b3JNYXA7XHJcbiAgICAvLyBCYXNlIHVybCBmb3IgdGhlIHBhZ2UgKGVnLiB3d3cueW91dHViZS5jb20pLiBBbGwgcGF0aHMgYXJlIGFwcGVuZGVkIHRvIHRoaXMgd2hlbiBtYXRjaGluZyBVUmxzXHJcbiAgICBiYXNlVVJMOiBzdHJpbmc7XHJcbiAgICAvLyBDb250YWlucyBkYXRhIHJlbGV2YW50IHRvIHRoZSBjdXJyZW50IHBhZ2UuXHJcbiAgICBjdXJyZW50UGFnZURhdGE6IFBhZ2VEYXRhO1xyXG4gICAgLy8gQXR0cmlidXRlIGFkZGVkIHRvIGFsbCBlbGVtZW50cyBiZWluZyBtb25pdG9yZWRcclxuICAgIGludGVyYWN0aW9uQXR0cmlidXRlOiBzdHJpbmc7XHJcblxyXG4gICAgZXh0cmFjdG9yTGlzdDogRXh0cmFjdG9yTGlzdDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWdMb2FkZXI6IENvbmZpZ0xvYWRlcikge1xyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IGNvbmZpZ0xvYWRlci5jb25maWc7XHJcbiAgICAgICAgdGhpcy5pbnRlcmFjdGlvbkV2ZW50cyA9IGNvbmZpZy5ldmVudHMgPyBjb25maWcuZXZlbnRzIDogWydjbGljayddO1xyXG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnBhdGhzID0gY29uZmlnLnBhdGhzO1xyXG4gICAgICAgIHRoaXMuYmFzZVVSTCA9IGNvbmZpZy5iYXNlVVJMO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhID0gbmV3IFBhZ2VEYXRhKCk7XHJcbiAgICAgICAgdGhpcy5pbnRlcmFjdGlvbkF0dHJpYnV0ZSA9IFwibW9uaXRvcmluZy1pbnRlcmFjdGlvbnNcIlxyXG4gICAgICAgIHRoaXMuZXh0cmFjdG9yTGlzdCA9IGNvbmZpZ0xvYWRlci5leHRyYWN0b3JMaXN0O1xyXG5cclxuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLm9yaWdpbiA9PT0gdGhpcy5iYXNlVVJMKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJ1bldoZW5WaXNpYmxlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ3Zpc2libGUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplTW9uaXRvcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCBydW5XaGVuVmlzaWJsZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XHJcbiAgICAgICAgICAgIHJ1bldoZW5WaXNpYmxlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBydW5XaGVuVmlzaWJsZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgcnVuV2hlblZpc2libGUpO1xyXG4gICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIG1vbml0b3IgaWYgYmFzZSBVUkwgbWF0Y2hlcyB0aGUgY3VycmVudCBVUkxcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhc3luYyBpbml0aWFsaXplTW9uaXRvcigpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImluaXRpYWxpemluZyBtb25pdG9yXCIpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ3VycmVudFBhZ2VEYXRhKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZXMgYSBuZXcgZW50cnkgaW4gdGhlIERCIGRlc2NyaWJpbmcgdGhlIHN0YXRlIGF0IHRoZSBzdGFydCBvZiB0aGUgc2Vzc2lvblxyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmluaXRpYWxpemVTZXNzaW9uKCk7XHJcbiAgICAgICAgICAgIC8vIEJpbmRzIGxpc3RlbmVycyB0byB0aGUgSFRNTCBlbGVtZW50cyBzcGVjaWZpZWQgaW4gdGhlIGNvbmZpZyBmb3IgYWxsIG1hdGNoaW5nIHBhdGggcGF0dGVybnNcclxuICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gaW5pdGlhbGl6ZSBzZXNzaW9uOlwiLCBlcnIpO1xyXG4gICAgICAgIH1cclxufVxyXG4gICAgLyoqXHJcbiAgICogVXBkYXRlcyB0aGUgcGFnZSBkYXRhIHdoZW5ldmVyIGEgbmV3IHBhZ2UgaXMgZGV0ZWN0ZWRcclxuICAgKiBAcGFyYW0gdXJsIC0gdGhlIHVybCBvZiB0aGUgbmV3IHBhZ2VcclxuICAgKi9cclxuICAgIHByaXZhdGUgdXBkYXRlQ3VycmVudFBhZ2VEYXRhKHVybDogc3RyaW5nKXtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlRGF0YS51cGRhdGUodGhpcy5iYXNlVVJMLCB1cmwsIHRoaXMucGF0aHMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBuZXcgZW50cnkgaW4gdGhlIERCIGRlc2NyaWJpbmcgdGhlIHN0YXRlIGF0IHRoZSBzdGFydCBvZiB0aGUgc2Vzc2lvblxyXG4gICAqL1xyXG4gICAgcHJpdmF0ZSBhc3luYyBpbml0aWFsaXplU2Vzc2lvbigpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBjdXJyZW50U3RhdGUgPSBuZXcgU2Vzc2lvbkRvY3VtZW50KHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCwgZG9jdW1lbnQudGl0bGUpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ2hlY2tpbmcgaGlnaGxpZ2h0XCIpO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5zZW5kTWVzc2FnZVRvQmFja2dyb3VuZChTZW5kZXJNZXRob2QuSW5pdGlhbGl6ZVNlc3Npb24sIGN1cnJlbnRTdGF0ZSk7XHJcbiAgICAgICAgdGhpcy5oaWdobGlnaHQgPSByZXNwb25zZS5oaWdobGlnaHQ7XHJcbiAgICAgICAgY29uc29sZS5sb2coYEhpZ2hsaWdodCBpcyBzZXQgdG8gJHt0aGlzLmhpZ2hsaWdodH1gKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIEJpbmRzIGV2ZW50IGxpc3RlbmVycyBmb3IgbXV0YXRpb25zIGFuZCBuYXZpZ2F0aW9uXHJcbiAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBiaW5kRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIC8vIFdoZW5ldmVyIG5ldyBjb250ZW50IGlzIGxvYWRlZCwgYXR0YWNoIG9ic2VydmVycyB0byBlYWNoIEhUTUwgZWxlbWVudCB0aGF0IG1hdGNoZXMgdGhlIHNlbGVjdG9ycyBpbiB0aGUgY29uZmlnc1xyXG4gICAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9uczogTXV0YXRpb25SZWNvcmRbXSwgb2JzOiBNdXRhdGlvbk9ic2VydmVyKSA9PiB0aGlzLmFkZExpc3RlbmVyc1RvTmV3TWF0Y2hlcygpKTtcclxuICAgICAgICAvLyBNYWtlIHRoZSBtdXRhdGlvbiBvYnNlcnZlciBvYnNlcnZlIHRoZSBlbnRpcmUgZG9jdW1lbnQgZm9yIGNoYW5nZXNcclxuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHtcclxuICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxyXG4gICAgICAgICAgICBzdWJ0cmVlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBhbiBldmVudCBsaXN0ZW5lciB0byBkZXRlY3QgbmF2aWdhdGlvbnMgb24gdGhlIHBhZ2VcclxuICAgICAgICAvLyBAdHMtaWdub3JlOiBJZ25vcmluZyBUeXBlU2NyaXB0IGVycm9yIGZvciBuYXZpZ2F0aW9uIG5vdCBmb3VuZFxyXG4gICAgICAgIG5hdmlnYXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcIm5hdmlnYXRlXCIsIChlOiBFdmVudCkgPT4gdGhpcy5vbk5hdmlnYXRpb25EZXRlY3Rpb24oZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIEFkZHMgbGlzdGVuZXJzIHRvIG11dGF0aW9ucyAoaWUuIG5ld2x5IHJlbmRlcmVkIGVsZW1lbnRzKSBhbmQgbWFya3MgdGhlbSB3aXRoIHRoaXMuaW50ZXJhY3R0aW9uQXR0cmlidXRlLlxyXG4gICAqIElmIGRlYnVnIG1vZGUgaXMgb24sIHRoaXMgd2lsbCBhZGQgYSBjb2xvdXJmdWwgYm9yZGVyIHRvIHRoZXNlIGVsZW1lbnRzLlxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgYWRkTGlzdGVuZXJzVG9OZXdNYXRjaGVzKCk6IHZvaWQge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYWRkaW5nIHNlbGVjdG9yc1wiKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgVmFsdWUgb2YgaGlnaGxpZ2h0OiAke3RoaXMuaGlnaGxpZ2h0fWApO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQ3VycmVudCBwYWdlIGRhdGE6XCIpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuY3VycmVudFBhZ2VEYXRhKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlRGF0YS5zZWxlY3RvcnMuZm9yRWFjaChpbnRlcmFjdGlvbiA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgOmlzKCR7aW50ZXJhY3Rpb24uc2VsZWN0b3J9KTpub3QoWyR7dGhpcy5pbnRlcmFjdGlvbkF0dHJpYnV0ZX1dKWApO1xyXG4gICAgICAgICAgICBjb25zdCBuYW1lID0gaW50ZXJhY3Rpb24ubmFtZTtcclxuICAgICAgICAgICAgZWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhpZ2hsaWdodCkgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLmJvcmRlciA9IGAycHggc29saWQgJHt0aGlzLlN0cmluZ1RvQ29sb3IubmV4dChuYW1lKX1gO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUodGhpcy5pbnRlcmFjdGlvbkF0dHJpYnV0ZSwgJ3RydWUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaW50ZXJhY3Rpb25FdmVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodGhpcy5pbnRlcmFjdGlvbkV2ZW50c1tpXSwgKGU6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25JbnRlcmFjdGlvbkRldGVjdGlvbihlbGVtZW50LCBlLCBuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogU2VuZHMgYSBtZXNzYWdlIHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdC5cclxuICAgKiBAcGFyYW0gZXZlbnQgLSB0aGUgSFRNTCBldmVudCB0aGF0IG9jY3VyZWRcclxuICAgKiBAcmV0dXJucyBBIGRvY3VtZW50IGRlc2NyaWJpbmcgdGhlIHN0YXRlIGNoYW5nZVxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlU3RhdGVDaGFuZ2VSZWNvcmQoZXZlbnQ6IEV2ZW50KTogREJEb2N1bWVudCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJEZXRlY3RlZCBzdGF0ZSBjaGFuZ2UgZXZlbnRcIik7XHJcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSB0aGlzLmV4dHJhY3Rvckxpc3QuZXh0cmFjdCh0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmwsIFNlbmRlck1ldGhvZC5OYXZpZ2F0aW9uRGV0ZWN0aW9uKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInByaW50aW5nIG1ldGFkYXRhXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG1ldGFkYXRhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBY3Rpdml0eURvY3VtZW50KEFjdGl2aXR5VHlwZS5TdGF0ZUNoYW5nZSwgZXZlbnQsIG1ldGFkYXRhLCB0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmwsIGRvY3VtZW50LnRpdGxlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0LlxyXG4gICAqIEBwYXJhbSBldmVudCAtIHRoZSBIVE1MIGV2ZW50IHRoYXQgb2NjdXJlZFxyXG4gICAqIEBwYXJhbSB1cmxDaGFuZ2UgLSBpbmRpY2F0ZXMgd2hldGhlciB0aGUgc2VsZi1sb29wIHJlc3VsdGVkIGluIGEgdXJsIGNoYW5nZVxyXG4gICAqIFxyXG4gICAqIEByZXR1cm5zIEEgZG9jdW1lbnQgZGVzY3JpYmluZyBzZWxmIGxvb3BcclxuICAgKi9cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVNlbGZMb29wUmVjb3JkKGV2ZW50OiBFdmVudCwgdXJsQ2hhbmdlOiBib29sZWFuKTogREJEb2N1bWVudCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJEZXRlY3RlZCBzZWxmIGxvb3AgY2hhbmdlIGV2ZW50XCIpO1xyXG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gdGhpcy5leHRyYWN0b3JMaXN0LmV4dHJhY3QodGhpcy5jdXJyZW50UGFnZURhdGEudXJsLCBTZW5kZXJNZXRob2QuTmF2aWdhdGlvbkRldGVjdGlvbik7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJwcmludGluZyBtZXRhZGF0YVwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhtZXRhZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBY3Rpdml0eURvY3VtZW50KEFjdGl2aXR5VHlwZS5TZWxmTG9vcCwgZXZlbnQsIG1ldGFkYXRhLCB0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmwsIGRvY3VtZW50LnRpdGxlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0LlxyXG4gICAqIEBwYXJhbSBlbGVtZW50IC0gdGhlIGVsZW1lbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIGV2ZW50XHJcbiAgICogQHBhcmFtIG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJlZCB0aGUgY2FsbGJhY2sgKGFzIGRlZmluZWQgaW4gdGhlIGNvbmZpZylcclxuICAgKiBAcGFyYW0gZXZlbnQgLSB0aGUgSFRNTCBldmVudCB0aGF0IG9jY3VyZWRcclxuICAgKiBAcmV0dXJucyBBIGRvY3VtZW50IGludGVyYWN0aW9uIHNlbGYgbG9vcFxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlSW50ZXJhY3Rpb25SZWNvcmQoZWxlbWVudDogRWxlbWVudCwgbmFtZTogc3RyaW5nLCBldmVudDogRXZlbnQpOiBEQkRvY3VtZW50IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkRldGVjdGVkIGludGVyYWN0aW9uIGV2ZW50XCIpO1xyXG4gICAgICAgIGxldCBtZXRhZGF0YToge2h0bWw6IHN0cmluZywgZWxlbWVudE5hbWU6IHN0cmluZzsgaWQ/OiBzdHJpbmd9ID0ge1xyXG4gICAgICAgICAgICBodG1sOiBlbGVtZW50LmdldEhUTUwoKSxcclxuICAgICAgICAgICAgZWxlbWVudE5hbWU6IG5hbWUsXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCBleHRyYWN0ZWREYXRhID0gdGhpcy5leHRyYWN0b3JMaXN0LmV4dHJhY3QodGhpcy5jdXJyZW50UGFnZURhdGEudXJsLCBTZW5kZXJNZXRob2QuSW50ZXJhY3Rpb25EZXRlY3Rpb24pO1xyXG5cclxuICAgICAgICBtZXRhZGF0YSA9IHsuLi4gbWV0YWRhdGEsIC4uLiBleHRyYWN0ZWREYXRhfTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJwcmludGluZyBtZXRhZGF0YVwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhtZXRhZGF0YSk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEFjdGl2aXR5RG9jdW1lbnQoQWN0aXZpdHlUeXBlLkludGVyYWN0aW9uLCBldmVudCwgbWV0YWRhdGEsIHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCwgZG9jdW1lbnQudGl0bGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIFNlbmRzIGEgbWVzc2FnZSB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHQuXHJcbiAgICogQHBhcmFtIHNlbmRlciAtIHRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvbiB0aGF0J3Mgc2VuZGluZyB0aGUgbWVzc2FnZSB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHRcclxuICAgKiBAcGFyYW0gcGF5bG9hZCAtIHRoZSBkYXRhIGJlaW5nIHNlbnQgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0XHJcbiAgICogXHJcbiAgICogQHJldHVybnMgUmVzcG9uc2UgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBtZXNzYWdlIHN1Y2NlZWRlZFxyXG4gICAqL1xyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoc2VuZGVyTWV0aG9kOiBTZW5kZXJNZXRob2QsIHBheWxvYWQ6IERCRG9jdW1lbnQpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHJ1bnRpbWUgaXMgYXZhaWxhYmxlIChleHRlbnNpb24gY29udGV4dCBzdGlsbCB2YWxpZClcclxuICAgICAgICAgICAgaWYgKCFjaHJvbWUucnVudGltZT8uaWQpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRXh0ZW5zaW9uIGNvbnRleHQgaW52YWxpZGF0ZWQnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IG5ldyBCYWNrZ3JvdW5kTWVzc2FnZShzZW5kZXJNZXRob2QsIHBheWxvYWQpO1xyXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2hyb21lIHJldHVybnMgdW5kZWZpbmVkIGlmIG5vIGxpc3RlbmVycywgY2hlY2sgaWYgdGhhdCdzIGV4cGVjdGVkXHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ05vIHJlc3BvbnNlIGZyb20gYmFja2dyb3VuZCBzY3JpcHQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0JhY2tncm91bmQgbWVzc2FnZSBmYWlsZWQ6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICAvLyBEZWNpZGUgd2hldGhlciB0byB0aHJvdyBvciBoYW5kbGUgZ3JhY2VmdWxseSBiYXNlZCBvbiB5b3VyIG5lZWRzXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsOyAvLyBvciB0aHJvdyBlcnJvcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICogQ2FsbGJhY2sgdGhhdCBjcmVhdGVzIGEgcGF5bG9hZCBkZXNjcmliaW5nIHRoZSBpbnRlcmFjdGlvbiB0aGF0IG9jY3VyZWQgYW5kIHNlbmRzIGl0IHRvIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdFxyXG4gICAqIEBwYXJhbSBlIC0gdGhlIGV2ZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBjYWxsYmFja1xyXG4gICAqIEBwYXJhbSBuYW1lIC0gdGhlIG5hbWUgb2YgdGhlIGVsZW1lbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIGNhbGxiYWNrIChhcyBkZWZpbmVkIGluIHRoZSBjb25maWcpXHJcbiAgICovXHJcblxyXG4gICAgcHJpdmF0ZSBvbkludGVyYWN0aW9uRGV0ZWN0aW9uKGVsZW1lbnQ6IEVsZW1lbnQsIGU6IEV2ZW50LCBuYW1lOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImludGVyYWN0aW9uIGV2ZW50IGRldGVjdGVkXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBFdmVudCBkZXRlY3RlZCB3aXRoIGV2ZW50IHR5cGU6ICR7ZS50eXBlfWApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBFdmVudCB0cmlnZ2VyZWQgYnkgJHtlbGVtZW50fWApO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnQuaW5uZXJIVE1MKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhlbGVtZW50LmdldEhUTUwoKSk7XHJcbiAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5jcmVhdGVJbnRlcmFjdGlvblJlY29yZChlbGVtZW50LCBuYW1lLCBlKTtcclxuICAgICAgICB0aGlzLnNlbmRNZXNzYWdlVG9CYWNrZ3JvdW5kKFNlbmRlck1ldGhvZC5JbnRlcmFjdGlvbkRldGVjdGlvbiwgcmVjb3JkKVxyXG4gICAgICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBzZW5kIGludGVyYWN0aW9uIGRhdGE6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICAvLyBNYXliZSBxdWV1ZSBmb3IgcmV0cnksIG9yIGp1c3QgbG9nIGFuZCBjb250aW51ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsbGJhY2sgdGhhdCBjcmVhdGVzIGEgcGF5bG9hZCBkZXNjcmliaW5nIHRoZSBuYXZpZ2F0aW9uIHRoYXQgb2NjdXJlZCBhbmQgc2VuZHMgaXQgdG8gdGhlIGJhY2tncm91bmQgc2NyaXB0XHJcbiAgICAgKiBAcGFyYW0gZSAtIHRoZSBldmVudCB0aGF0IHRyaWdnZXJlZCB0aGUgY2FsbGJhY2tcclxuICAgICAqIEBwYXJhbSBuYW1lIC0gdGhlIG5hbWUgb2YgdGhlIGVsZW1lbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIGNhbGxiYWNrIChhcyBkZWZpbmVkIGluIHRoZSBjb25maWcpXHJcbiAgICAgKi9cclxuXHJcbiAgICBwcml2YXRlIG9uTmF2aWdhdGlvbkRldGVjdGlvbihuYXZFdmVudDogYW55KTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgYmFzZVVSTENoYW5nZSA9IG5hdkV2ZW50LmRlc3RpbmF0aW9uLnVybC5zcGxpdChcIi5cIilbMV0gIT0gdGhpcy5jdXJyZW50UGFnZURhdGEudXJsLnNwbGl0KFwiLlwiKVsxXVxyXG4gICAgICAgIGNvbnN0IHVybENoYW5nZSA9ICEobmF2RXZlbnQuZGVzdGluYXRpb24udXJsID09PSB0aGlzLmN1cnJlbnRQYWdlRGF0YS51cmwpO1xyXG4gICAgICAgIC8vIGxldCBzb3VyY2VTdGF0ZSA9IHRoaXMuZ2V0Q2xlYW5TdGF0ZU5hbWUoKTtcclxuICAgICAgICAvLyBsZXQgbWF0Y2ggPSB0aGlzLmN1cnJlbnRQYWdlRGF0YS5jaGVja0Zvck1hdGNoKG5hdkV2ZW50LmRlc3RpbmF0aW9uLnVybCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCA9IG5hdkV2ZW50LmRlc3RpbmF0aW9uLnVybDtcclxuICAgICAgICAvLyBsZXQgZGVzdFN0YXRlID0gdGhpcy5nZXRDbGVhblN0YXRlTmFtZSgpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhgTmF2aWdhdGlvbiBkZXRlY3RlZCB3aXRoIGV2ZW50IHR5cGU6ICR7bmF2RXZlbnQudHlwZX1gKVxyXG4gICAgICAgIGlmIChiYXNlVVJMQ2hhbmdlKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJVUkwgYmFzZSBjaGFuZ2UgZGV0ZWN0ZWQuIENsb3NpbmcgcHJvZ3JhbS5cIik7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoU2VuZGVyTWV0aG9kLkNsb3NlU2Vzc2lvbiwgbmV3IERCRG9jdW1lbnQodGhpcy5jdXJyZW50UGFnZURhdGEudXJsLCBkb2N1bWVudC50aXRsZSkpLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHNlbmQgaW50ZXJhY3Rpb24gZGF0YTonLCBlcnJvcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChuYXZFdmVudC5uYXZpZ2F0aW9uVHlwZSA9PT0gXCJwdXNoXCIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQdXNoIGV2ZW50IGRldGVjdGVkLlwiKTtcclxuICAgICAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5jcmVhdGVTdGF0ZUNoYW5nZVJlY29yZChuYXZFdmVudCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoU2VuZGVyTWV0aG9kLk5hdmlnYXRpb25EZXRlY3Rpb24sIHJlY29yZCkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gc2VuZCBpbnRlcmFjdGlvbiBkYXRhOicsIGVycm9yKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ3VycmVudFBhZ2VEYXRhKHRoaXMuY3VycmVudFBhZ2VEYXRhLnVybCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChuYXZFdmVudC5uYXZpZ2F0aW9uVHlwZSA9PT0gXCJyZXBsYWNlXCIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXBsYWNlIGV2ZW50IGRldGVjdGVkLlwiKTtcclxuICAgICAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5jcmVhdGVTZWxmTG9vcFJlY29yZChuYXZFdmVudCwgdXJsQ2hhbmdlKTtcclxuICAgICAgICAgICAgdGhpcy5zZW5kTWVzc2FnZVRvQmFja2dyb3VuZChTZW5kZXJNZXRob2QuTmF2aWdhdGlvbkRldGVjdGlvbiwgcmVjb3JkKS5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBzZW5kIGludGVyYWN0aW9uIGRhdGE6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAqIEdlbmVyYXRlcyBhIHVuaXF1ZSBjb2xvciBmcm9tIGEgZ2l2ZW4gc3RyaW5nXHJcbiAgICogU291cmNlOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzEwMzczODMgXHJcbiAgICogQHJldHVybnMgQ29sb3IgaGV4IGNvZGVcclxuICAgKi9cclxuXHJcbiAgICBwcml2YXRlIFN0cmluZ1RvQ29sb3IgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGxldCBpbnN0YW5jZTogYW55ID0gbnVsbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbmV4dDogZnVuY3Rpb24gc3RyaW5nVG9Db2xvcihzdHI6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5zdGFuY2UgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UubmV4dFZlcnlEaWZmZXJudENvbG9ySWR4ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZS52ZXJ5RGlmZmVyZW50Q29sb3JzID0gW1wiIzAwRkYwMFwiLCBcIiMwMDAwRkZcIiwgXCIjRkYwMDAwXCIsIFwiIzAxRkZGRVwiLCBcIiNGRkE2RkVcIiwgXCIjRkZEQjY2XCIsIFwiIzAwNjQwMVwiLCBcIiMwMTAwNjdcIiwgXCIjOTUwMDNBXCIsIFwiIzAwN0RCNVwiLCBcIiNGRjAwRjZcIiwgXCIjRkZFRUU4XCIsIFwiIzc3NEQwMFwiLCBcIiM5MEZCOTJcIiwgXCIjMDA3NkZGXCIsIFwiI0Q1RkYwMFwiLCBcIiNGRjkzN0VcIiwgXCIjNkE4MjZDXCIsIFwiI0ZGMDI5RFwiLCBcIiNGRTg5MDBcIiwgXCIjN0E0NzgyXCIsIFwiIzdFMkREMlwiLCBcIiM4NUE5MDBcIiwgXCIjRkYwMDU2XCIsIFwiI0E0MjQwMFwiLCBcIiMwMEFFN0VcIiwgXCIjNjgzRDNCXCIsIFwiI0JEQzZGRlwiLCBcIiMyNjM0MDBcIiwgXCIjQkREMzkzXCIsIFwiIzAwQjkxN1wiLCBcIiM5RTAwOEVcIiwgXCIjMDAxNTQ0XCIsIFwiI0MyOEM5RlwiLCBcIiNGRjc0QTNcIiwgXCIjMDFEMEZGXCIsIFwiIzAwNDc1NFwiLCBcIiNFNTZGRkVcIiwgXCIjNzg4MjMxXCIsIFwiIzBFNENBMVwiLCBcIiM5MUQwQ0JcIiwgXCIjQkU5OTcwXCIsIFwiIzk2OEFFOFwiLCBcIiNCQjg4MDBcIiwgXCIjNDMwMDJDXCIsIFwiI0RFRkY3NFwiLCBcIiMwMEZGQzZcIiwgXCIjRkZFNTAyXCIsIFwiIzYyMEUwMFwiLCBcIiMwMDhGOUNcIiwgXCIjOThGRjUyXCIsIFwiIzc1NDRCMVwiLCBcIiNCNTAwRkZcIiwgXCIjMDBGRjc4XCIsIFwiI0ZGNkU0MVwiLCBcIiMwMDVGMzlcIiwgXCIjNkI2ODgyXCIsIFwiIzVGQUQ0RVwiLCBcIiNBNzU3NDBcIiwgXCIjQTVGRkQyXCIsIFwiI0ZGQjE2N1wiLCBcIiMwMDlCRkZcIiwgXCIjRTg1RUJFXCJdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghaW5zdGFuY2Uuc3RyaW5nVG9Db2xvckhhc2hbc3RyXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoW3N0cl0gPSBpbnN0YW5jZS52ZXJ5RGlmZmVyZW50Q29sb3JzW2luc3RhbmNlLm5leHRWZXJ5RGlmZmVybnRDb2xvcklkeCsrXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgJWMgVGhlIGNvbG91ciBmb3IgJHtzdHJ9YCwgYGNvbG9yOiAke2luc3RhbmNlLnN0cmluZ1RvQ29sb3JIYXNoW3N0cl19YCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5zdGFuY2Uuc3RyaW5nVG9Db2xvckhhc2hbc3RyXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KSgpO1xyXG59XHJcbiIsImltcG9ydCB7U2VsZWN0b3JOYW1lUGFpciwgUGF0dGVybkRhdGEsIFBhdHRlcm5TZWxlY3Rvck1hcCB9IGZyb20gXCIuL2NvbmZpZ1wiO1xyXG4vKipcclxuICogQSBjbGFzcyByZXNwb25zaWJsZSBmb3IgdHJhY2tpbmcgdGhlIHN0YXRlIG9mIHRoZSBwYWdlIHRoYXQgdGhlIHVzZXIgaXMgY3VycmVudGx5IG9uLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFBhZ2VEYXRhIHtcclxuICAgIC8vIFVSTCBvZiB0aGUgcGFnZVxyXG4gICAgdXJsITogc3RyaW5nO1xyXG4gICAgLy8gQ1NTIHNlbGVjdG9ycyBiZWluZyBhcHBsaWVkIHRvIHRoZSBwYWdlXHJcbiAgICBzZWxlY3RvcnMhOiBTZWxlY3Rvck5hbWVQYWlyW107XHJcbiAgICAvLyBUaGUgVVJMIHBhdHRlcm4sIENTUyBzZWxlY3RvcnMsIGFuZCBvcHRpb25hbGx5IGEgZnVuY3Rpb24gZm9yIGdldHRpbmcgcGFnZSBJRCBcclxuICAgIC8vIGZvciB0aGUgcGF0dGVybiB0aGF0IG1vc3QgY2xvc2VseSBtYXRjaGVzIHRoaXMudXJsXHJcbiAgICAvLyBFeDogSWYgdGhlIHVybCBpcyB3d3cueW91dHViZS5jb20vc2hvcnRzL0FCQyBhbmQgdGhlIHBhdHRlcm5zIGFyZSAvKiBhbmQgL3Nob3J0cy86aWQsIHRoZW4gXHJcbiAgICAvLyBtYXRjaFBhdGhEYXRhIHdvdWxkIGNvbnRhaW4gdGhlIFBhdGhEYXRhIGZvciAvc2hvcnRzLzppZCwgc2luY2UgaXRzIGEgY2xvc2VyIG1hdGNoIHRvIHRoZSBVUkwuXHJcbiAgICBtYXRjaFBhdGhEYXRhITogUGF0dGVybkRhdGE7IFxyXG4gICAgY3VycmVudFBhdHRlcm4hOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZXMgdGhlIHN0YXRlIG9mIHRoZSBQYWdlRGF0YVxyXG4gICAgICogQHBhcmFtIGJhc2VVUkw6IFRoZSBiYXNlIHVybCBmb3IgdGhlIHBhZ2UgKGVnLiB3d3cueW91dHViZS5jb20pXHJcbiAgICAgKiBAcGFyYW0gdXJsOiBUaGUgZnVsbCB1cmwgb2YgdGhlIGN1cnJlbnQgcGFnZVxyXG4gICAgICogQHBhcmFtIHBhdGhzOiBBIGxpc3Qgb2YgYWxsIHRoZSBwYXRocyBkZWZpbmVkIGluIGEgY29uZmlnXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZShiYXNlVVJMOiBzdHJpbmcsIHVybDogc3RyaW5nLCBwYXRoczogUGF0dGVyblNlbGVjdG9yTWFwKXtcclxuICAgICAgICB0aGlzLnVybCA9IHVybDtcclxuICAgICAgICBjb25zdCBtYXRjaGVzID0gdGhpcy51cGRhdGVNYXRjaERhdGEoYmFzZVVSTCwgcGF0aHMpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0b3JzID0gdGhpcy5nZXRTZWxlY3RvcnMobWF0Y2hlcywgcGF0aHMpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIGBtYXRjaFBhdGhEYXRhYCB0byBiZSB0aGUgUGF0aERhdGEgZm9yIHRoZSBVUkwgcGF0dGVybiB3aXRoIHRoZSBjbG9zZXQgbWF0Y2ggdG8gYGJhc2VVUkxgXHJcbiAgICAgKiBhbmQgcmV0dXJucyBhIGxpc3Qgb2YgYWxsIG1hdGNoZXMuIEFkZGl0aW9uYWxseSwgaXQgdXBkYXRlcyB3aGV0aGVyIHRoZSBjdXJyZW50IHBhdGhcclxuICAgICAqIGluY2x1ZGVzIGFuIGlkLlxyXG4gICAgICogQHBhcmFtIGJhc2VVUkw6IFRoZSBiYXNlIHVybCBmb3IgdGhlIHBhZ2UgKGVnLiB3d3cueW91dHViZS5jb20pXHJcbiAgICAgKiBAcGFyYW0gcGF0dGVybnM6IEEgbGlzdCBvZiBhbGwgdGhlIHBhdGhzIGRlZmluZWQgaW4gYSBjb25maWdcclxuICAgICAqIFxyXG4gICAgICogQHJldHVybnMgQSBsaXN0IG9mIGFsbCBwYXR0ZXJucyBpbiB0aGUgY29uZmlnIHRoYXQgbWF0Y2ggYGJhc2VVUkxgXHJcbiAgICAgKi9cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZU1hdGNoRGF0YShiYXNlVVJMOiBzdHJpbmcsIHBhdHRlcm5zOiBQYXR0ZXJuU2VsZWN0b3JNYXApOiBzdHJpbmdbXXtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInVwZGF0aW5nIHBhZ2UgZGF0YVwiKTtcclxuICAgICAgICBsZXQgY2xvc2VzdE1hdGNoID0gXCJcIjsgLy8gdGhlIHBhdHRlcm4gdGhhdCBtb3N0IGNsb3NlbHkgbWF0Y2hlcyB0aGUgY3VycmVudCBVUkxcclxuXHJcbiAgICAgICAgLy8gR2V0IGEgbGlzdCBvZiBhbGwgdGhlIHBhdGhzIHRoYXQgbWF0Y2ggdGhlIGN1cnJlbnQgVVJMXHJcbiAgICAgICAgY29uc3QgbWF0Y2hlcyA9IE9iamVjdC5rZXlzKHBhdHRlcm5zKS5maWx0ZXIoKHBhdGgpID0+IHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocGF0aCk7XHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmU6IElnbm9yaW5nIFR5cGVTY3JpcHQgZXJyb3IgZm9yIFVSTFBhdHRlcm4gbm90IGZvdW5kXHJcbiAgICAgICAgICAgIGNvbnN0IHAgPSBuZXcgVVJMUGF0dGVybihwYXRoLCBiYXNlVVJMKTtcclxuICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBwLnRlc3QodGhpcy51cmwpO1xyXG4gICAgICAgICAgICAvLyBDbG9zZXN0IG1hdGNoIGlzIHRoZSBsb25nZXN0IHBhdHRlcm4gdGhhdCBtYXRjaGVzIHRoZSBjdXJyZW50IFVSTFxyXG4gICAgICAgICAgICBpZiAobWF0Y2ggJiYgcGF0aC5sZW5ndGggPiBjbG9zZXN0TWF0Y2gubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBjbG9zZXN0TWF0Y2ggPSBwYXRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBtYXRjaDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGF0dGVybiA9IGNsb3Nlc3RNYXRjaDtcclxuXHJcbiAgICAgICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm8gbWF0Y2hlcyBmb3VuZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHRoaXMudXJsVXNlc0lkID0gY2xvc2VzdE1hdGNoLmVuZHNXaXRoKFwiOmlkXCIpO1xyXG4gICAgICAgIHRoaXMubWF0Y2hQYXRoRGF0YSA9IHBhdHRlcm5zW2Nsb3Nlc3RNYXRjaF07XHJcbiAgICAgICAgcmV0dXJuIG1hdGNoZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gbWF0Y2hlczogQSBsaXN0IG9mIGFsbCBtYXRjaGluZyBwYXRocyB0byB0aGUgY3VycmVudCB1cmxcclxuICAgICAqIEBwYXJhbSBwYXRoczogQSBsaXN0IG9mIGFsbCB0aGUgcGF0aHMgZGVmaW5lZCBpbiBhIGNvbmZpZ1xyXG4gICAgICogXHJcbiAgICAgKiBAcmV0dXJucyBBIGxpc3Qgb2YgYWxsIHNlbGVjdG9ycyBmb3IgdGhlIG1hdGNoaW5nIHBhdGhzXHJcbiAgICAgKi9cclxuXHJcbiAgICBwcml2YXRlIGdldFNlbGVjdG9ycyhtYXRjaGVzOiBzdHJpbmdbXSwgcGF0aHM6IFBhdHRlcm5TZWxlY3Rvck1hcCk6IFNlbGVjdG9yTmFtZVBhaXJbXSB7XHJcbiAgICAgICAgY29uc3QgY3VycmVudFNlbGVjdG9ycyA9IFtdO1xyXG4gICAgICAgIGZvciAoY29uc3QgcGF0aCBvZiBtYXRjaGVzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGhEYXRhID0gcGF0aHNbcGF0aF07XHJcbiAgICAgICAgICAgIGlmIChwYXRoRGF0YS5zZWxlY3RvcnMpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2YgcGF0aERhdGEuc2VsZWN0b3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNlbGVjdG9ycy5wdXNoKHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY3VycmVudFNlbGVjdG9ycztcclxuICAgIH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvY29udGVudC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==