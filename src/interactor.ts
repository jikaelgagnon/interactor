import { Message } from "./message";
import { Document } from "./document";

export class Interactor {
    interactionEvents: string[];
    debug: boolean;
    paths: Record<string, any>;
    baseURL: string;
    currentURL: string;
    selectorString: string | undefined;
    currentSelectors: any;
    currentInteractions: any[];
    currentURLUsesId: boolean | undefined;
    currentMatch: any;

    constructor(config: any) {
        this.interactionEvents = Array.isArray(config.interactionEvents) ? config.interactionEvents : ['click'];
        this.debug = typeof config.debug === "boolean" ? config.debug : true;
        this.paths = typeof config === 'object' && config['paths'] !== undefined ? config['paths'] : {};
        this.baseURL = typeof config === 'object' && config['baseURL'] !== undefined ? config['baseURL'] : "";
        this.currentURL = document.location.href;
        this.selectorString = undefined;
        this.currentSelectors = undefined;
        this.currentInteractions = [];
        this.currentURLUsesId = undefined;
        this.currentMatch = undefined;

        console.log(`Current url is: ${this.currentURL}`);
        console.log("Received config:");
        console.log(config);

        this.updateSelectorString();
        this.initializeSession();
        this.bindEvents();
    }

    updateSelectorString(): void {
        this.currentURLUsesId = false;
        let closestMatch = "";

        const matches = Object.keys(this.paths).filter((path) => {
            console.log(path);
            const p = new URLPattern(path, this.baseURL);
            const match = p.test(this.currentURL);
            if (match && path.length > closestMatch.length) {
                closestMatch = path;
            }
            return match;
        });

        if (matches.length === 0) {
            console.log("no matches found");
            return;
        }

        if (closestMatch.endsWith(":id")) {
            console.log("current url uses id");
            this.currentURLUsesId = true;
        }

        this.currentMatch = this.paths[closestMatch];
        this.currentInteractions = this.currentMatch;

        console.log(this.currentMatch);

        this.currentInteractions = [];
        for (const key of matches) {
            let interactions = this.paths[key];
            console.log(interactions);
            for (const interactable of interactions["selectors"]) {
                console.log(`Adding ${interactable} to current interactions`);
                let selector = interactable["selector"];
                this.currentInteractions.push({
                    "selector": `${selector}:not([data-listener-attached])`,
                    "name": interactable["name"]
                });
            }
        }
        console.log(this.currentInteractions);
    }

    async sendMessageToBackground(type: string, payload: any): Promise<any> {
        let message = new Message(type, payload);
        const response = await chrome.runtime.sendMessage(message);
        return response;
    }

    onInteractionDetection(e: Event, name: string): void {
        const record = this.createInteractionRecord(name, this.getCleanStateName(), "interaction");
        this.sendMessageToBackground("onInteractionDetection", record);
    }

    checkForMatch(url: string): boolean {
        let curPathname = new URL(this.currentURL).pathname;
        let otherPathname = new URL(url).pathname;
        let l1 = curPathname.split("/");
        let l2 = otherPathname.split("/");

        if (curPathname.length !== otherPathname.length) {
            return false;
        }

        let max_idx = l1.length - (this.currentURLUsesId ? 1 : 0);
        for (let i = 0; i < max_idx; i++) {
            if (l1[i] !== l2[i]) {
                return false;
            }
        }
        return true;
    }

    getCleanStateName(): string {
        let path = new URL(this.currentURL).pathname;
        let groups = path.split("/");

        if (this.currentURLUsesId) {
            groups = groups.slice(0, groups.length - 1);
        }
        return groups.join("/");
    }

    onNavigationDetection(navEvent: any): void {
        let urlChange = !(navEvent.destination.url === this.currentURL);
        let sourceState = this.getCleanStateName();
        let match = this.checkForMatch(navEvent.destination.url);

        let idSelectorExists = "idSelector" in this.currentMatch;
        if (idSelectorExists) {
            let id = this.currentMatch["idSelector"]();
            console.log(id);
        }

        let old_url = this.currentURL;
        this.currentURL = navEvent.destination.url;
        let destState = this.getCleanStateName();

        if (navEvent.navigationType === "push" && !match) {
            this.updateSelectorString();
            const record = this.createStateChangeRecord(navEvent, sourceState, destState);
            this.sendMessageToBackground("onNavigationDetection", record);
        } else if (navEvent.navigationType === "replace" || match) {
            const record = this.createSelfLoopRecord(navEvent, sourceState, urlChange);
            this.sendMessageToBackground("onNavigationDetection", record);
        }
    }

    addListenersToMutations(): void {
        this.currentInteractions.forEach(interaction => {
            let elements = document.querySelectorAll(interaction["selector"]);
            let name = interaction["name"];
            elements.forEach(element => {
                if (this.debug) (element as HTMLElement).style.border = `2px solid ${this.StringToColor.next(name)}`;
                element.setAttribute('data-listener-attached', 'true');
                for (let i = 0; i < this.interactionEvents.length; i++) {
                    element.addEventListener(this.interactionEvents[i], (e: Event) => {
                        this.onInteractionDetection(e, name);
                    }, true);
                }
            });
        });
    }

    bindEvents(): void {
        console.log("binding events to the page");
        window.addEventListener('load', () => {
            const observer = new MutationObserver((mutations: MutationRecord[], obs: MutationObserver) => this.addListenersToMutations());
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            this.addListenersToMutations();
        });

        navigation.addEventListener("navigate", (e: Event) => this.onNavigationDetection(e));
    }

    debuggingLog(record: any): void {
        if (this.debug) {
            console.log(record);
        }
    }

    createStateChangeRecord(navEvent: any, sourceState: string, destState: string): Document {
        const metadata = {
            destinationState: destState,
        };

        return new Document("state_change", sourceState, metadata);
    }

    createSelfLoopRecord(navEvent: any, sourceState: string, urlChange: boolean): Document {
        const metadata = {
            urlChange: urlChange
        };

        return new Document("self_loop", sourceState, metadata);
    }

    createInteractionRecord(name: string, sourceState: string, type: string): Document {
        const metadata = {
            name: name
        };
        return new Document("interaction", sourceState, metadata);
    }

    addRecord(record: any): void {
        this.debuggingLog(record);
    }

    getCurrentState(): any {
        return {
            page: {
                location: window.location.pathname,
                href: window.location.href,
                origin: window.location.origin,
                title: document.title
            },
            url: this.currentURL
        };
    }

    initializeSession(): void {
        this.sendMessageToBackground("initializeSession", this.getCurrentState());
    }

    StringToColor = (function () {
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
