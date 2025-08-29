import { BackgroundMessage, MessageResponse} from "../common/communication/backgroundmessage";
import {DBDocument, ActivityDocument, SessionDocument} from "../common/dbdocument";
import {ConfigLoader, ExtractorList, URLPatternToSelectors} from "./config";
import { PageData } from "./pagedata";
import { ActivityType } from "../common/communication/activity";
import {SenderMethod} from "../common/communication/sender"

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
export class Monitor {
    // A list of the type of events we want to monitor as interactions (eg. click, scroll, etc.). Default is click
    interactionEvents: string[];
    // If true, highlight all selected HTML elements with coloured boxes
    highlight: boolean;
    // An object mapping path patterns to their corresponding CSS selectors
    // Path patterns are consistent with the URL Pattern API Syntax: https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API
    paths: URLPatternToSelectors;
    // Base url for the page (eg. www.youtube.com). All paths are appended to this when matching URls
    baseURL: string;
    // Contains data relevant to the current page.
    currentPageData: PageData;
    // Attribute added to all elements being monitored
    interactionAttribute: string;

    extractorList: ExtractorList;

    constructor(configLoader: ConfigLoader) {
        const config = configLoader.config;
        this.interactionEvents = config.events ?? ['click'];
        this.highlight = true;
        this.paths = config.paths;
        this.baseURL = config.baseURL;
        this.currentPageData = new PageData(config);
        this.interactionAttribute = "monitoring-interactions"
        this.extractorList = configLoader.extractorList; 

        if (window.location.origin === this.baseURL) {
            const runWhenVisible = () => {  // Remove async here
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
            } else {
                window.addEventListener('load', () => {  // Remove async here
                    runWhenVisible();
                });
            }

            document.addEventListener('visibilitychange', runWhenVisible);
        }  
    }

    /**
     * Initializes the monitor if base URL matches the current URL
     */
    private async initializeMonitor() {
        console.log("initializing monitor");
        this.updateCurrentPageData(document.location.href);
        try {
            // Creates a new entry in the DB describing the state at the start of the session
            await this.initializeSession();
            // Binds listeners to the HTML elements specified in the config for all matching path patterns
            this.bindEvents();
        } catch (err) {
            console.error("Failed to initialize session:", err);
        }
}
    /**
   * Updates the page data whenever a new page is detected
   * @param url - the url of the new page
   */
    private updateCurrentPageData(newURL: string){
        this.currentPageData.update(newURL);
    }

    /**
   * Creates a new entry in the DB describing the state at the start of the session
   */
    private async initializeSession(): Promise<void> {
        const currentState = new SessionDocument(this.currentPageData.url, document.title);
        console.log("Checking highlight");
        const response = await this.sendMessageToBackground(SenderMethod.InitializeSession, currentState);
        if (response?.status === "Session initialized" && response.highlight) {
            this.highlight = response.highlight; // TypeScript knows highlight exists here
        }
        console.log(`Highlight is set to ${this.highlight}`)
    }

    /**
   * Binds event listeners for mutations and navigation
   */

    private bindEvents(): void {
        // Whenever new content is loaded, attach observers to each HTML element that matches the selectors in the configs
        const observer = new MutationObserver(() => this.addListenersToNewMatches());
        // Make the mutation observer observe the entire document for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Add an event listener to detect navigations on the page
        navigation.addEventListener("navigate", (e: NavigationEvent) => this.onNavigationDetection(e));
    }

    /**
   * Adds listeners to mutations (ie. newly rendered elements) and marks them with this.interacttionAttribute.
   * If debug mode is on, this will add a colourful border to these elements.
   */

    private addListenersToNewMatches(): void {
        // console.log("adding selectors");
        // console.log(`Value of highlight: ${this.highlight}`);
        // console.log("Current page data:");
        // console.log(this.currentPageData);
        this.currentPageData.selectors.forEach(interaction => {
            const elements = document.querySelectorAll(`:is(${interaction.selector}):not([${this.interactionAttribute}])`);
            const name = interaction.name;
            for (const element of elements){
                if (this.highlight) (element as HTMLElement).style.border = `2px solid ${this.StringToColor.next(name)}`;
                element.setAttribute(this.interactionAttribute, 'true');

                for (const ie of this.interactionEvents) {
                    element.addEventListener(ie, (e: Event) => {
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

    private createStateChangeRecord(event: Event): DBDocument {
        console.log("Detected state change event");
        const metadata = this.extractorList.extract(this.currentPageData.url, SenderMethod.NavigationDetection);
        console.log("printing metadata");
        console.log(metadata);

        return new ActivityDocument(ActivityType.StateChange, event, metadata, this.currentPageData.url, document.title);
    }

    /**
   * Sends a message to the background script.
   * @param event - the HTML event that occured
   * @param urlChange - indicates whether the self-loop resulted in a url change
   * 
   * @returns A document describing self loop
   */

    private createSelfLoopRecord(event: Event): DBDocument {
        console.log("Detected self loop change event");
        const metadata = this.extractorList.extract(this.currentPageData.url, SenderMethod.NavigationDetection);
        console.log("printing metadata");
        console.log(metadata);
        return new ActivityDocument(ActivityType.SelfLoop, event, metadata, this.currentPageData.url, document.title);
    }

    /**
   * Sends a message to the background script.
   * @param element - the element that triggered the event
   * @param name - the name of the element that triggered the callback (as defined in the config)
   * @param event - the HTML event that occured
   * @returns A document interaction self loop
   */

    private createInteractionRecord(element: Element, name: string, event: Event): DBDocument {
        console.log("Detected interaction event");
        let metadata: {html: string, elementName: string; id?: string} = {
            html: element.getHTML(),
            elementName: name,
        };
        const extractedData = this.extractorList.extract(this.currentPageData.url, SenderMethod.InteractionDetection);

        metadata = {... metadata, ... extractedData};

        console.log("printing metadata");
        console.log(metadata);


        return new ActivityDocument(ActivityType.Interaction, event, metadata, this.currentPageData.url, document.title);
    }

    /**
   * Sends a message to the background script.
   * @param sender - the name of the function that's sending the message to the background script
   * @param payload - the data being sent to the background script
   * 
   * @returns Response indicating whether the message succeeded
   */

    private async sendMessageToBackground(senderMethod: SenderMethod, payload: DBDocument): Promise<MessageResponse | null> {
        try {
            // Check if runtime is available (extension context still valid)
            if (!chrome.runtime?.id) {
                throw new Error('Extension context invalidated');
            }

            const message = new BackgroundMessage(senderMethod, payload);
            const response : MessageResponse = await chrome.runtime.sendMessage(message);
            
            // Chrome returns undefined if no listeners, check if that's expected
            if (response === undefined) {
                console.error('No response from background script');
            }
            return response;
        } catch (error) {
            console.error('Background message failed:', error);
            // Decide whether to throw or handle gracefully based on your needs
            return null; // or throw error;
        }
    }

    /**
   * Callback that creates a payload describing the interaction that occured and sends it to the background script
   * @param e - the event that triggered the callback
   * @param name - the name of the element that triggered the callback (as defined in the config)
   */

    private onInteractionDetection(element: Element, e: Event, name: string): void {
        console.log("interaction event detected");
        console.log(`Event detected with event type: ${e.type}`);
        console.log(`Event triggered by`, element);
        // console.log(element.innerHTML);
        // console.log(element.getHTML());
        const record = this.createInteractionRecord(element, name, e);
        this.sendMessageToBackground(SenderMethod.InteractionDetection, record)
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
    private onNavigationDetection(navEvent: NavigationEvent): void {
        const destUrl = navEvent.destination.url;
        const baseURLChange = destUrl && this.currentPageData.url
            ? destUrl.split(".")[1] !== this.currentPageData.url.split(".")[1]
            : false;
        // const urlChange = !(navEvent.destination.url === this.currentPageData.url);
        // let sourceState = this.getCleanStateName();
        // let match = this.currentPageData.checkForMatch(navEvent.destination.url);
        if (destUrl){
            this.currentPageData.url = navEvent.destination.url;
        }
        else {
            console.log("No destination URL found in navigate event. Setting to empty string");
            this.currentPageData.url = "NO URL FOUND";

        }
        // let destState = this.getCleanStateName();

        console.log(`Navigation detected with event type: ${navEvent.type}`)
        if (baseURLChange){
            console.log("URL base change detected. Closing program.");
            this.sendMessageToBackground(SenderMethod.CloseSession, new DBDocument(this.currentPageData.url, document.title)).catch(error => {
            console.error('Failed to send interaction data:', error);
            });
        }
        else if (navEvent.navigationType === "push") {
            console.log("Push event detected.");
            const record = this.createStateChangeRecord(navEvent);
            this.sendMessageToBackground(SenderMethod.NavigationDetection, record).catch(error => {
            console.error('Failed to send interaction data:', error);
            });
            this.updateCurrentPageData(this.currentPageData.url);
        } else if (navEvent.navigationType === "replace") {
            console.log("Replace event detected.");
            const record = this.createSelfLoopRecord(navEvent);
            this.sendMessageToBackground(SenderMethod.NavigationDetection, record).catch(error => {
            console.error('Failed to send interaction data:', error);
            });
        }
    }
    
    /**
   * Generates a unique color from a given string
   * Source: https://stackoverflow.com/a/31037383 
   * @returns Color hex code
   */

    private StringToColor = (function () {
        interface ColorInstance {
            stringToColorHash: Record<string, string>;
            nextVeryDifferntColorIdx: number;
            veryDifferentColors: string[];
        }

        let instance: ColorInstance | null = null;

        return {
            next: function stringToColor(str: string): string {
                instance ??= {
                    stringToColorHash: {},
                    nextVeryDifferntColorIdx: 0,
                    veryDifferentColors: ["#00FF00", "#0000FF", "#FF0000", "#01FFFE", "#FFA6FE", "#FFDB66", "#006401", "#010067", "#95003A", "#007DB5", "#FF00F6", "#FFEEE8", "#774D00", "#90FB92", "#0076FF", "#D5FF00", "#FF937E", "#6A826C", "#FF029D", "#FE8900", "#7A4782", "#7E2DD2", "#85A900", "#FF0056", "#A42400", "#00AE7E", "#683D3B", "#BDC6FF", "#263400", "#BDD393", "#00B917", "#9E008E", "#001544", "#C28C9F", "#FF74A3", "#01D0FF", "#004754", "#E56FFE", "#788231", "#0E4CA1", "#91D0CB", "#BE9970", "#968AE8", "#BB8800", "#43002C", "#DEFF74", "#00FFC6", "#FFE502", "#620E00", "#008F9C", "#98FF52", "#7544B1", "#B500FF", "#00FF78", "#FF6E41", "#005F39", "#6B6882", "#5FAD4E", "#A75740", "#A5FFD2", "#FFB167", "#009BFF", "#E85EBE"]
                };

                if (!instance.stringToColorHash[str]) {
                    instance.stringToColorHash[str] = instance.veryDifferentColors[instance.nextVeryDifferntColorIdx++];
                    console.log(`%c The colour for ${str}`, `color: ${instance.stringToColorHash[str]}`);
                }
                return instance.stringToColorHash[str];
            }
        };
    })();
}
