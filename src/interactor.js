import { Message } from "./message.js";

export {Interactor};

class Interactor {
    constructor(config) {
            // Argument Assignment          // Type Checks                                                                          // Default Values
            this.interactionEvents = Array.isArray(config.interactionEvents) === true ? config.interactionEvents : ['click'],
            this.debug = typeof (config.debug) == "boolean" ? config.debug : true,
            this.cssSelectors = typeof config.cssSelectors === 'object' && !(config.cssSelectors['selectors'] === undefined) ? config.cssSelectors['selectors'] : {},
            this.baseURL = typeof config.cssSelectors === 'object' && !(config.cssSelectors['baseURL'] === undefined) ? config.cssSelectors['baseURL'] : "";
            this.currentURL = document.location.href;
            this.selectorString;
            this.updateSelectorString();

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
        console.log(`CSS selectors are: ${this.cssSelectors}`)
        const matches = Object.keys(this.cssSelectors).filter((path) => {
            console.log(path);
            const p = new URLPattern(path, this.baseURL);
            return p.test(this.currentURL);
        })

        let selectorsArray = [];

        for (const key of matches){
            const filteredSelectors = this.cssSelectors[key].map(selector => `${selector}:not([data-listener-attached])`);
            selectorsArray = selectorsArray.concat(filteredSelectors);
        }

        const selectorString = selectorsArray.join(", ");

        this.selectorString = selectorString;
    }

    async sendMessageToBackground(type, payload){
        let message = new Message(type, payload);
        const response = await chrome.runtime.sendMessage(message);
        return response;
    }

    onInteractionDetection(e){
        console.log("You clicked an element of interest");
        const record = this.createInteractionRecord(e, "interaction");
        this.sendMessageToBackground("onInteractionDetection", record);
    }

    onNavigationDetection(navEvent){
        console.log(" ---- Navigation event detected");
        if (!(navEvent.destination.url === this.currentURL))
        {
            console.log("New url detected!");
            this.currentURL = navEvent.destination.url;
            this.updateSelectorString();
        }
        else {
            console.log("URL was unchanged");
        }
        const record = this.createNavigationRecord(navEvent);
        this.sendMessageToBackground("onNavigationDetection", record);
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
    addListenersToMutations() {
        // console.log("finding all matching elements");
        console.log(`selectors: ${this.selectorString}`);
        let elements = document.querySelectorAll(this.selectorString);
        // console.log("printing elements list");
        // console.table(elements);

        elements.forEach(element => {
            if (this.debug) element.style.border = '2px solid red';
            element.setAttribute('data-listener-attached', 'true');
            for (let i = 0; i < this.interactionEvents.length; i++) {
                element.addEventListener(this.interactionEvents[i], (e) => this.onInteractionDetection(e), true);
            }
        });
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
    
        // Navigation events and unload events remain the same
        navigation.addEventListener("navigate", (e) => this.onNavigationDetection(e));

        // Send all data to database when tab is closed
        window.addEventListener("beforeunload", e => this.closeSession());
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
    createNavigationRecord(navEvent) {
        // Navigation Object
        const navigation = {
            type: navEvent.type,
            destinationURL: navEvent.destination.url,
            createdAt: new Date()
        };

        return navigation;
    }

    /**
     * Creates an interaction record object from an event.
     *
     * @param {Event} e - The event object.
     * @param {string} type - The type of interaction.
     * @returns {Object} The interaction record object.
     */
    createInteractionRecord(e, type) {
        // Interaction Object
        const interaction = {
            type: type,
            event: e.type,
            targetTag: e.target.nodeName,
            targetClasses: e.target.className,
            content: e.target.innerText,
            clientPosition: {
                x: e.clientX,
                y: e.clientY
            },
            screenPosition: {
                x: e.screenX,
                y: e.screenY
            },
            createdAt: new Date()
        };

        return interaction;
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
        this.session = {
            start: null,
            end: null
        };
        this.session.start = this.getCurrentState();
    }

    /**
     * Inserts end-of-session values into the session property.
     */
    closeSession() {
        this.session.end = this.getCurrentState();
        console.log("closing seesion");
        console.log(this.session);
        this.sendMessageToBackground("closeSession", this.session);
    }
}    
