import { Message } from "./message.js";
import { Document } from "./document.js";

export {Interactor};

class Interactor {
    constructor(config) {
            // Argument Assignment          // Type Checks                                                                          // Default Values
            this.interactionEvents = Array.isArray(config.interactionEvents) === true ? config.interactionEvents : ['click'],
            this.debug = typeof (config.debug) == "boolean" ? config.debug : true,
            this.cssSelectors = typeof config.cssSelectors === 'object' && !(config.cssSelectors['interactions'] === undefined) ? config.cssSelectors['interactions'] : {},
            this.baseURL = typeof config.cssSelectors === 'object' && !(config.cssSelectors['baseURL'] === undefined) ? config.cssSelectors['baseURL'] : "";
            this.currentURL = document.location.href;
            this.selectorString;
            this.updateSelectorString();
            this.currentSelectors;
            this.currentInteractions;
            this.currentURLUsesId;

            console.log(`Current url is: ${this.currentURL}`);

            this.initializeSession();
            // Call Event Binding Method
            this.bindEvents();
    }

    /**
     * Updates the `selectorString` property by filtering and concatenating CSS selectors.
     * 
     * This method performs the following steps:
     * 1. Filters the keys of `this.cssSelectors` to find matches based on the current URL.
     * 2. For each matching key, it maps the selectors to exclude those with the `data-listener-attached` attribute.
     * 3. Concatenates all filtered selectors into a single string, separated by commas.
     * 4. Assigns the resulting string to the `selectorString` property.
     * 
     * Note: This method assumes that the keys in this.cssSelectors['selectors'] follows 
     * the syntax for the URL Pattern API: https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API
     * @returns {void}
     */
    updateSelectorString()
    {
        this.currentURLUsesId = false;
        // console.log(`CSS selectors are: ${this.cssSelectors}`)
        const matches = Object.keys(this.cssSelectors).filter((path) => {
            // console.log(path);
            const p = new URLPattern(path, this.baseURL);
            const match = p.test(this.currentURL);
            if (match && path.endsWith(":id")){
                this.currentURLUsesId = true;
            }
            return match;
        })

        this.currentInteractions = []

        for (const key of matches){
            let interactions = this.cssSelectors[key];
            for (const interaction of interactions){
                // console.log(interaction);
                let selector = interaction["selector"];
                // interaction["selector"] = `${selector}:not([data-listener-attached])`;
                this.currentInteractions.push({
                    "selector": `${selector}:not([data-listener-attached])`,
                    "name": interaction["name"]
                });
            }
        }
    }

    async sendMessageToBackground(type, payload){
        let message = new Message(type, payload);
        const response = await chrome.runtime.sendMessage(message);
        return response;
    }

    onInteractionDetection(e, name){
        const record = this.createInteractionRecord(name, "interaction");
        this.sendMessageToBackground("onInteractionDetection", record);
    }

    checkForMatch(url){
        let curPathname = new URL(this.currentURL).pathname;
        let otherPathname = new URL(url).pathname;
        let l1 = curPathname.split("/");
        let l2 = otherPathname.split("/");
        console.log(`cur path uses ID: ${this.currentURLUsesId}`);
        console.log(`cur path ${curPathname}, length: ${l1.length}`);
        console.table(l1);
        console.log(`other path ${otherPathname}, length: ${l2.length}`);
        console.table(l2);

        if (curPathname.length !== otherPathname.length){
            return false;
        }

        console.log("lengths are the same");

        let max_idx = l1.length - 1*(this.currentURLUsesId);
        for (let i = 0; i < max_idx; i++){
            if (l1[i] !== l1[i]){
                return false;
            }
        }
        return true;
    }

    onNavigationDetection(navEvent){
        // console.log(" ---- Navigation event detected");
        // console.log("Logging keys");
        // // for (let prop in navEvent) {
        // //     console.log(prop);  // This will show inherited properties as well.
        // // }
        // // for (let prop in navEvent) {
        // //     console.log(`${prop}:`, navEvent[prop]);
        // // }

        // console.log(navEvent.navigationType);
        // console.log(navEvent.destination.sameDocument);
        
        // console.log("Done logging keys");
        let urlChange = !(navEvent.destination.url === this.currentURL)
        // console.log(`Current url: ${this.currentURL}`);
        // console.log(`Destination url: ${navEvent.destination.url}`);
        // console.log(`URL change: ${urlChange}`);
        let match = this.checkForMatch(navEvent.destination.url);
        console.log(`URLs match: ${match}`);
        // console.log(`URLs match: ${match}`);

        // if (urlChange)
        // {
        //     console.log("New url detected!");
        //     this.currentURL = navEvent.destination.url;
        //     this.updateSelectorString();
        // }
        // else {
        //     console.log("URL was unchanged");
        //     const record = this.createNavigationRecord(navEvent);
        //     this.sendMessageToBackground("onNavigationDetection", record);
        // }

        this.currentURL = navEvent.destination.url;


        // These are "state changes"
        if (navEvent.navigationType === "push" && !match){
            console.log("You changed pages");
            this.updateSelectorString();
            const record = this.createStateChangeRecord(navEvent);
            this.sendMessageToBackground("onNavigationDetection", record);
        }

        // These are self loops. We don't care about the URl
        else if (navEvent.navigationType === "replace" || match){
            if (urlChange){
                console.log("You're on the same page but URL changed");
            }
            else{
                console.log("You're on the same page and URL didn't change");
            }
            const record = this.createSelfLoopRecord(navEvent, urlChange);
            this.sendMessageToBackground("onNavigationDetection", record);
        }
    }

    /**
     * Adds event listeners to elements matching the selector string.
     * 
     * This function selects all elements in the document that match the 
     * `this.selectorString` and adds a red border to them (if in debug mode). It also attaches 
     * event listeners for each event in `this.interactionEvents` to these elements.
     * When an event is triggered, a message is logged to the console and an 
     * interaction record is created and added.
     * 
     * @returns {void}
     */

    // TODO: SPEED THIS UP
    // addListenersToMutations() {
    //     // console.log("finding all matching elements");
    //     console.log(`selectors: ${this.selectorString}`);
    //     let elements = document.querySelectorAll(this.selectorString);
    //     // console.log("printing elements list");
    //     // console.table(elements);

    //     elements.forEach(element => {
    //         if (this.debug) element.style.border = '2px solid red';
    //         element.setAttribute('data-listener-attached', 'true');
    //         // element.setAttribute('interactor-name', 'JIKAEL_BUTTON');
    //         for (let i = 0; i < this.interactionEvents.length; i++) {
    //             element.addEventListener(this.interactionEvents[i], (e) => this.onInteractionDetection(e), true);
    //         }
    //     });
    // }

    // stringToColor(string, saturation = 100, lightness = 75){
    //     let hash = 0;
    //     for (let i = 0; i < string.length; i++) {
    //         hash = string.charCodeAt(i) + ((hash << 5) - hash);
    //         hash = hash & hash;
    //     }
    //     return `hsl(${(hash % 360)}, ${saturation}%, ${lightness}%)`;
    //   }

    /*
    Generates a colour based on a string: https://stackoverflow.com/a/31037383
    Used for debugging
    */
    StringToColor = (function(){
        var instance = null;
    
        return {
        next: function stringToColor(str) {
            if(instance === null) {
                instance = {};
                instance.stringToColorHash = {};
                instance.nextVeryDifferntColorIdx = 0;
                instance.veryDifferentColors = ["#00FF00","#0000FF","#FF0000","#01FFFE","#FFA6FE","#FFDB66","#006401","#010067","#95003A","#007DB5","#FF00F6","#FFEEE8","#774D00","#90FB92","#0076FF","#D5FF00","#FF937E","#6A826C","#FF029D","#FE8900","#7A4782","#7E2DD2","#85A900","#FF0056","#A42400","#00AE7E","#683D3B","#BDC6FF","#263400","#BDD393","#00B917","#9E008E","#001544","#C28C9F","#FF74A3","#01D0FF","#004754","#E56FFE","#788231","#0E4CA1","#91D0CB","#BE9970","#968AE8","#BB8800","#43002C","#DEFF74","#00FFC6","#FFE502","#620E00","#008F9C","#98FF52","#7544B1","#B500FF","#00FF78","#FF6E41","#005F39","#6B6882","#5FAD4E","#A75740","#A5FFD2","#FFB167","#009BFF","#E85EBE"];
            }
    
            if(!instance.stringToColorHash[str]){
                instance.stringToColorHash[str] = instance.veryDifferentColors[instance.nextVeryDifferntColorIdx++];
                // console.log(`the colour for ${str} is ${instance.stringToColorHash[str]}`);
                console.log(`%c The colour for ${str}`, `color: ${instance.stringToColorHash[str]}`);
            }
                return instance.stringToColorHash[str];
            }
        }
    })();
       
    addListenersToMutations() {
        // let selectors = this.selectorString.split(", ");
        // this.currentSelectors.forEach(selector => {
        //     let elements = document.querySelectorAll(selector);
        //     elements.forEach(element => {
        //         if (this.debug) element.style.border = '2px solid red';
        //         element.setAttribute('data-listener-attached', 'true');
        //         element.setAttribute('matching-selector', selector);
        //         // element.setAttribute('interactor-name', 'JIKAEL_BUTTON');
        //         for (let i = 0; i < this.interactionEvents.length; i++) {
        //             element.addEventListener(this.interactionEvents[i], (e) => {
        //                 console.log(`This element matched selector: ${selector}`);
        //                 this.onInteractionDetection(e);
        //             }
        //             , true);
        //         }
        //     });
        // })
        // console.log("Current interactions:");
        // console.log(this.currentInteractions);
        // console.log(this.currentInteractions[0]);
        this.currentInteractions.forEach(interaction => {
            // console.log(interaction);
            let elements = document.querySelectorAll(interaction["selector"]);
            let name = interaction["name"];
            // console.log(interaction["selector"]);
            // console.log(name);
            elements.forEach(element => {
                if (this.debug) element.style.border = `2px solid ${this.StringToColor.next(name)}`;
                element.setAttribute('data-listener-attached', 'true');
                // element.setAttribute('matching-selector', interaction);
                // element.setAttribute('interactor-name', 'JIKAEL_BUTTON');
                
                for (let i = 0; i < this.interactionEvents.length; i++) {
                    element.addEventListener(this.interactionEvents[i], (e) => {
                        this.onInteractionDetection(e, name)
                    }
                    , true);
                }
            });
        })
    }
    /**
     * Binds various event listeners to the document and window.
     * 
     * - Observes the entire document body for added nodes using MutationObserver.
     * - Detects navigation events and updates the current URL.
     * - Sends interactions before the window unloads.
     * 
     * @returns {void}
     */

    bindEvents() {
        console.log("binding events to the page");
        // Wait for the page to fully load before adding listeners
        window.addEventListener('load', () => {
            const observer = new MutationObserver(function(mutations, obs) {
                this.addListenersToMutations();
            }.bind(this));
            
            // Start observing the entire document body for added nodes
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
    
            // Initially process existing elements
            this.addListenersToMutations();
        });
    
        navigation.addEventListener("navigate", (e) => this.onNavigationDetection(e));
    }
    /**
     * Logs the interaction record if debugging is enabled.
     *
     * @param {Object} record - The interaction record to log.
     */
    debuggingLog(record){
         // Log Interaction if Debugging
         if (this.debug) {
            console.log(record);
        }
    }
    /**
     * Creates a navigation record object from a navigation event.
     *
     * @param {Event} navEvent - The navigation event.
     * @returns {Object} The navigation record object.
     */
    createStateChangeRecord(navEvent) {
        // Navigation Object
        const metadata = {
            destinationPath: new URL(navEvent.destination.url).pathname,
        };

        return new Document("state_change", this.currentURL, metadata);
    }

    createSelfLoopRecord(navEvent, urlChange) {
        // Navigation Object
        const metadata =  {
            urlChange: urlChange
        };

        return new Document("self_loop", this.currentURL, metadata);
    }

    /**
     * Creates an interaction record object from an event.
     *
     * @param {Event} e - The event object.
     * @param {string} type - The type of interaction.
     * @returns {Object} The interaction record object.
     */
    createInteractionRecord(name, type) {
        // Interaction Object
        const metadata = {
            name: name
        };
        return new Document("interaction", this.currentURL, metadata);
    }

    /**
     * Adds a record to the records array and logs it if debugging is enabled.
     *
     * @param {Object} record - The record to add.
     */
    addRecord(record) {
        this.debuggingLog(record);
    }

    getCurrentState(){
        return {
            page: {
                location: window.location.pathname,
                href: window.location.href,
                origin: window.location.origin,
                title: document.title
            },
            url: this.currentURL
        }
    }

    /**
     * Generates a session object and assigns it to the session property.
     */
    initializeSession() {
        // Assign Session Property
        this.sendMessageToBackground("initializeSession", this.getCurrentState());
    }

    /**
     * Inserts end-of-session values into the session property.
     */
    // closeSession() {
    //     this.session.end = this.getCurrentState();
    //     console.log("closing seesion");
    //     console.log(this.session);
    //     this.sendMessageToBackground("closeSession", this.session);
    // }
}    
