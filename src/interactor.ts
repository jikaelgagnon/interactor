import { Message } from "./message";
import { Document } from "./document";
import { Config, PathData, SelectorData} from "./config";

class PageData {
    url!: string;
    selectors!: SelectorData[];
    urlUsesId!: boolean;
    idSelector!: () => string;
    matchPathData!: PathData; 

    update(baseURL: string, url: string, paths: { [path: string]: PathData }){
        this.url = url;
        let matches = this.updateMatchData(baseURL, paths);
        this.selectors = this.getSelectors(matches, paths);
    }

    private updateMatchData(baseURL: string, paths: { [path: string]: PathData }): string[]{
        let currentURLUsesId = false;
        let closestMatch = ""; // the pattern that most closely matches the current URL

        // Get a list of all the paths that match the current URL
        const matches = Object.keys(paths).filter((path) => {
            console.log(path);
            // @ts-ignore: Ignoring TypeScript error for URLPattern not found
            const p = new URLPattern(path, baseURL);
            const match = p.test(this.url);
            // Closest match is the longest pattern that matches the current URL
            if (match && path.length > closestMatch.length) {
                closestMatch = path;
            }
            return match;
        });

        if (matches.length === 0) {
            console.log("no matches found");
        }

        if (closestMatch.endsWith(":id")) {
            console.log("current url uses id");
            this.urlUsesId = true;
        }
        this.matchPathData = paths[closestMatch];
        return matches;
    }

    private getSelectors(matches: string[], paths: { [path: string]: PathData }): SelectorData[] {
        let currentSelectors = [];
        for (const path of matches) {
            let pathData = paths[path];
            for (const selector of pathData["selectors"]) {
                currentSelectors.push(selector);
            }
        }
        console.log("current selectors:");
        console.log(currentSelectors);
        return currentSelectors;
    }
}

export class Interactor {
    interactionEvents: string[];
    debug: boolean;
    paths: { [path: string]: PathData };
    baseURL: string;
    currentPageData: PageData;
    currentURL: string;
    currentSelectors!: SelectorData[];
    currentURLUsesId!: boolean;
    currentMatchPathData!: PathData;
    interactionAttribute: string;

    constructor(config: Config) {
        // A list of the type of events we want to monitor as interactions (eg. click, scroll, etc.). Default is click
        this.interactionEvents = config.interactionEvents ? config.interactionEvents : ['click'];
        // If enabled, highlight all selected HTML elements with coloured boxes
        this.debug = config.debug ? config.debug : true;
        // An object consisting of path patterns and their corresponding CSS selectors
        this.paths = config.paths;
        // Base url for the page (eg. www.youtube.com). All paths are appended to this when matching URls
        this.baseURL = config.baseURL;
        this.currentPageData = new PageData();
        // URL the user is currently on 
        this.currentURL = document.location.href;
        // Attribute added to all elements being monitored
        this.interactionAttribute = "monitoring-interactions"
        // Sets the currentSelectors, currentURLUsesId, currentMatchPathData
        this.updateCurrentPageData(document.location.href);
        console.log(`Current url is: ${this.currentURL}`);
        console.log("Received config:");
        console.log(config);
        this.initializeSession();
        this.bindEvents();
    }

    private updateCurrentPageData(url: string){
        this.currentPageData.update(this.baseURL, url, this.paths);
    }

    // private updateCurrentURLMatchData(): string[]{
    //     this.currentURLUsesId = false;
    //     let closestMatch = ""; // the pattern that most closely matches the current URL

    //     // Get a list of all the paths that match the current URL
    //     const matches = Object.keys(this.paths).filter((path) => {
    //         console.log(path);
    //         // @ts-ignore: Ignoring TypeScript error for URLPattern not found
    //         const p = new URLPattern(path, this.baseURL);
    //         const match = p.test(this.currentURL);
    //         // Closest match is the longest pattern that matches the current URL
    //         if (match && path.length > closestMatch.length) {
    //             closestMatch = path;
    //         }
    //         return match;
    //     });

    //     if (matches.length === 0) {
    //         console.log("no matches found");
    //     }

    //     if (closestMatch.endsWith(":id")) {
    //         console.log("current url uses id");
    //         this.currentURLUsesId = true;
    //     }

    //     this.currentMatchPathData = this.paths[closestMatch];
    //     return matches;
    // }

    // private getCurrentSelectors(matches: string[]): SelectorData[] {
    //     let currentSelectors = [];
    //     for (const path of matches) {
    //         let pathData = this.paths[path];
    //         for (const selector of pathData["selectors"]) {
    //             currentSelectors.push(selector);
    //         }
    //     }
    //     return currentSelectors;
    // }

    private async sendMessageToBackground(type: string, payload: any): Promise<any> {
        let message = new Message(type, payload);
        const response = await chrome.runtime.sendMessage(message);
        return response;
    }

    private onInteractionDetection(e: Event, name: string): void {
        const record = this.createInteractionRecord(name, this.getCleanStateName(), "interaction");
        this.sendMessageToBackground("onInteractionDetection", record);
    }

    private checkForMatch(url: string): boolean {
        let curPathname = new URL(this.currentPageData.url).pathname;
        let otherPathname = new URL(url).pathname;
        let l1 = curPathname.split("/");
        let l2 = otherPathname.split("/");

        if (curPathname.length !== otherPathname.length) {
            return false;
        }

        let max_idx = l1.length - (this.currentPageData.urlUsesId ? 1 : 0);
        for (let i = 0; i < max_idx; i++) {
            if (l1[i] !== l2[i]) {
                return false;
            }
        }
        return true;
    }

    private getCleanStateName(): string {
        let path = new URL(this.currentPageData.url).pathname;
        let groups = path.split("/");

        if (this.currentPageData.url) {
            groups = groups.slice(0, groups.length - 1);
        }
        return groups.join("/");
    }

    private onNavigationDetection(navEvent: any): void {
        let urlChange = !(navEvent.destination.url === this.currentPageData.url);
        let sourceState = this.getCleanStateName();
        let match = this.checkForMatch(navEvent.destination.url);


        let old_url = this.currentPageData.url;
        this.currentPageData.url = navEvent.destination.url;
        let destState = this.getCleanStateName();

        if (navEvent.navigationType === "push" && !match) {
            this.updateCurrentPageData(this.currentPageData.url);
            const record = this.createStateChangeRecord(navEvent, sourceState, destState);
            this.sendMessageToBackground("onNavigationDetection", record);
        } else if (navEvent.navigationType === "replace" || match) {
            const record = this.createSelfLoopRecord(navEvent, sourceState, urlChange);
            this.sendMessageToBackground("onNavigationDetection", record);
        }
    }

    private addListenersToMutations(): void {
        console.log("adding selectors");
        console.log("Current page data:");
        console.log(this.currentPageData);
        this.currentPageData.selectors.forEach(interaction => {
            let elements = document.querySelectorAll(interaction["selector"]+`:not([${this.interactionAttribute}]`);
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

    private bindEvents(): void {
        console.log("binding events to the page");
        window.addEventListener('load', () => {
            const observer = new MutationObserver((mutations: MutationRecord[], obs: MutationObserver) => this.addListenersToMutations());
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            this.addListenersToMutations();
        });
        // @ts-ignore: Ignoring TypeScript error for navigation not found
        navigation.addEventListener("navigate", (e: Event) => this.onNavigationDetection(e));
    }

    private debuggingLog(record: any): void {
        if (this.debug) {
            console.log(record);
        }
    }

    private getIdOrEmpty(): string{
        let id = "";
        if (this.currentMatchPathData.idSelector) {
            console.log("getting id");
            id = this.currentMatchPathData["idSelector"]();
        }
        else{
            console.log("no id selector exists");
        }
        return id;
    }

    private createStateChangeRecord(navEvent: any, sourceState: string, destState: string): Document {
        
        const metadata = {
            destinationState: destState,
            id: this.getIdOrEmpty() 
        };


        return new Document("state_change", sourceState, metadata);
    }

    private createSelfLoopRecord(navEvent: any, sourceState: string, urlChange: boolean): Document {
        const metadata = {
            urlChange: urlChange,
            id: this.getIdOrEmpty(),
        };

        return new Document("self_loop", sourceState, metadata);
    }

    private createInteractionRecord(name: string, sourceState: string, type: string): Document {
        const metadata = {
            name: name,
            id: this.getIdOrEmpty()
        };
        return new Document("interaction", sourceState, metadata);
    }

    private getCurrentState(): any {
        return {
            page: {
                location: window.location.pathname,
                href: window.location.href,
                origin: window.location.origin,
                title: document.title
            },
            url: this.currentPageData.url
        };
    }

    private initializeSession(): void {
        this.sendMessageToBackground("initializeSession", this.getCurrentState());
    }

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
