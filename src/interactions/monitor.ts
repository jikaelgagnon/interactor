import { BackgroundMessage } from "../communication/backgroundmessage";
import {DBDocument, ActivityDocument, SessionDocument} from "../database/dbdocument";
import { Config, PathData, PathMap} from "./config";
import { PageData } from "./pagedata";
import { ActivityType } from "../communication/activity";
import {SenderMethod} from "../communication/sender"

/**
 * This class reads from a provided Config object and attaches listeners to the elements specified in the selectors.
 * When these elements are interacted with, or when a navigation occurs, a document is sent to the background script
 * to be appended to the database. This class is instantiated in content.ts.
 */
export class Monitor {
    // A list of the type of events we want to monitor as interactions (eg. click, scroll, etc.). Default is click
    interactionEvents: string[];
    // If true, highlight all selected HTML elements with coloured boxes
    debug: boolean;
    // An object mapping path patterns to their corresponding CSS selectors
    // Path patterns are consistent with the URL Pattern API Syntax: https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API
    paths: PathMap;
    // Base url for the page (eg. www.youtube.com). All paths are appended to this when matching URls
    baseURL: string;
    // Contains data relevant to the current page.
    currentPageData: PageData;
    // Attribute added to all elements being monitored
    interactionAttribute: string;

    constructor(config: Config) {
        this.interactionEvents = config.interactionEvents ? config.interactionEvents : ['click'];
        this.debug = config.debug ? config.debug : true;
        this.paths = config.paths;
        this.baseURL = config.baseURL;
        this.currentPageData = new PageData();
        this.interactionAttribute = "monitoring-interactions"

        // Check if this page should be monitored
        if (window.location.origin === this.baseURL) {
            this.initializeMonitor();
        } else {
            console.log(`Skipping monitoring. Current origin (${window.location.origin}) does not match base URL (${this.baseURL}).`);
        }
    }

        /**
     * Initializes the monitor if base URL matches the current URL
     */
    private initializeMonitor(){
        this.updateCurrentPageData(document.location.href);
        // Creates a new entry in the DB describing the state at the start of the session
        this.initializeSession();
        // Binds listeners to the HTML elements specified in the config for all matching path patterns
        this.bindEvents();
    }
    /**
   * Updates the page data whenever a new page is detected
   * @param url - the url of the new page
   */
    private updateCurrentPageData(url: string){
        this.currentPageData.update(this.baseURL, url, this.paths);
    }

    /**
   * Creates a new entry in the DB describing the state at the start of the session
   */
    private initializeSession(): void {
        this.sendMessageToBackground(SenderMethod.InitializeSession, this.getCurrentState());
    }

    /**
   * Binds event listeners for mutations and navigation
   */

    private bindEvents(): void {
        // Whenever new content is loaded, attach observers to each HTML element that matches the selectors in the configs
        const observer = new MutationObserver((mutations: MutationRecord[], obs: MutationObserver) => this.addListenersToNewMatches());
        // Make the mutation observer observe the entire document for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Add an event listener to detect navigations on the page
        // @ts-ignore: Ignoring TypeScript error for navigation not found
        navigation.addEventListener("navigate", (e: Event) => this.onNavigationDetection(e));
    }

    /**
   * Adds listeners to mutations (ie. newly rendered elements) and marks them with this.interacttionAttribute.
   * If debug mode is on, this will add a colourful border to these elements.
   */

    private addListenersToNewMatches(): void {
        // console.log("adding selectors");
        // console.log("Current page data:");
        // console.log(this.currentPageData);
        this.currentPageData.selectors.forEach(interaction => {
            let elements = document.querySelectorAll(`:is(${interaction["selector"]}):not([${this.interactionAttribute}])`);
            let name = interaction["name"];
            elements.forEach(element => {
                if (this.debug) (element as HTMLElement).style.border = `2px solid ${this.StringToColor.next(name)}`;
                element.setAttribute(this.interactionAttribute, 'true');
                for (let i = 0; i < this.interactionEvents.length; i++) {
                    element.addEventListener(this.interactionEvents[i], (e: Event) => {
                        this.onInteractionDetection(e, name);
                    }, true);
                }
            });
        });
    }

    /**
   * Sends a message to the background script.
   * @param sourceState - the state prior to the navigation (obtained using `getCleanState()`)
   * @param destState - the state after to the navigation (obtained using `getCleanState()`)
   * 
   * @returns A document describing the state change
   */

    private createStateChangeRecord(sourceState: string, destState: string): DBDocument {
        
        const metadata: { destinationState: string; id?: string } = {
            destinationState: destState,
        };
        let id = this.currentPageData.getIDFromPage();
        if (id != ""){
            metadata.id = id;
        }


        return new ActivityDocument(ActivityType.StateChange, sourceState, metadata, this.currentPageData.url);
    }

    /**
   * Sends a message to the background script.
   * @param sourceState - the state prior to the navigation (obtained using `getCleanState()`)
   * @param urlChange - indicates whether the self-loop resulted in a url change
   * 
   * @returns A document describing self loop
   */

    private createSelfLoopRecord(sourceState: string, urlChange: boolean): DBDocument {
        const metadata: { urlChange: boolean; id?: string } = {
            urlChange: urlChange,
        };
        let id = this.currentPageData.getIDFromPage();
        if (id != ""){
            metadata.id = id;
        }

        return new ActivityDocument(ActivityType.SelfLoop, sourceState, metadata, this.currentPageData.url);
    }

    /**
   * Sends a message to the background script.
   * @param name - the name of the element that triggered the callback (as defined in the config)
   * @param sourceState - the state prior to the navigation (obtained using `getCleanState()`
   * @returns A document interaction self loop
   */

    private createInteractionRecord(name: string, sourceState: string): DBDocument {

        const metadata: { name: string; id?: string } = {
            name: name,
        };
        let id = this.currentPageData.getIDFromPage();
        if (id != ""){
            metadata.id = id;
        }

        return new ActivityDocument(ActivityType.Interaction, sourceState, metadata, this.currentPageData.url);
    }

    /**
   * Sends a message to the background script.
   * @param sender - the name of the function that's sending the message to the background script
   * @param payload - the data being sent to the background script
   * 
   * @returns Response indicating whether the message succeeded
   */

    private async sendMessageToBackground(senderMethod: SenderMethod, payload: DBDocument): Promise<any> {
        let message = new BackgroundMessage(senderMethod, payload);
        const response = await chrome.runtime.sendMessage(message);
        return response;
    }

    /**
   * Callback that creates a payload describing the interaction that occured and sends it to the background script
   * @param e - the event that triggered the callback
   * @param name - the name of the element that triggered the callback (as defined in the config)
   */

    private onInteractionDetection(e: Event, name: string): void {
        const record = this.createInteractionRecord(name, this.getCleanStateName());
        this.sendMessageToBackground(SenderMethod.InteractionDetection, record);
    }

    /**
     * Callback that creates a payload describing the navigation that occured and sends it to the background script
     * @param e - the event that triggered the callback
     * @param name - the name of the element that triggered the callback (as defined in the config)
     */

    private onNavigationDetection(navEvent: any): void {
        let urlChange = !(navEvent.destination.url === this.currentPageData.url);
        let sourceState = this.getCleanStateName();
        let match = this.currentPageData.checkForMatch(navEvent.destination.url);

        this.currentPageData.url = navEvent.destination.url;
        let destState = this.getCleanStateName();
        
        if (navEvent.navigationType === "push" && !match) {
            this.updateCurrentPageData(this.currentPageData.url);
            const record = this.createStateChangeRecord(sourceState, destState);
            this.sendMessageToBackground(SenderMethod.NavigationDetection, record);
        } else if (navEvent.navigationType === "replace" || match) {
            const record = this.createSelfLoopRecord(sourceState, urlChange);
            this.sendMessageToBackground(SenderMethod.NavigationDetection, record);
        }
    }

    /**
   * Converts a URL into a "state", which is a condensed version of the URL, which
   * excludes the params. 
   * If the pattern matching the page includes an ID (eg. /shorts:id), then 
   * if will be removed.
   * @returns The clean state name
   * 
   * @example
   * `https://www.youtube.com/shorts/ic-xaIpMB1E` is converted to `shorts`
   */

    private getCleanStateName(): string {
        let path = new URL(this.currentPageData.url).pathname;
        let groups = path.split("/");
        
        if (this.currentPageData.urlUsesId) {
            groups = groups.slice(0, groups.length - 1);
        }
        return groups.join("/");
    }

    /**
   * Gets the current state of the page.
   * @returns Current state 
   */

    private getCurrentState(): SessionDocument {
        return new SessionDocument(this.currentPageData.url);
    }

    /**
   * Generates a unique color from a given string
   * Source: https://stackoverflow.com/a/31037383 
   * @returns Color hex code
   */

    private StringToColor = (function () {
        let instance: any = null;

        return {
            next: function stringToColor(str: string): string {
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
}
