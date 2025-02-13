/*
BSD 2-Clause License

Copyright (c) 2016, Benjamin Cordier
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


class Interactor {
    constructor(config) {
            // Argument Assignment          // Type Checks                                                                          // Default Values
            this.interactions = typeof (config.interactions) == "boolean" ? config.interactions : true,
            this.interactionElement = typeof (config.interactionElement) == "string" ? config.interactionElement : 'interaction',
            this.interactionEvents = Array.isArray(config.interactionEvents) === true ? config.interactionEvents : ['click'],
            this.conversions = typeof (config.conversions) == "boolean" ? config.conversions : true,
            this.conversionElement = typeof (config.conversionElement) == "string" ? config.conversionElement : 'conversion',
            this.conversionEvents = Array.isArray(config.conversionEvents) === true ? config.conversionEvents : ['mouseup', 'touchend'],
            this.endpoint = typeof (config.endpoint) == "string" ? config.endpoint : 'http://localhost:5001/beacon',
            this.async = typeof (config.async) == "boolean" ? config.async : true,
            this.debug = typeof (config.debug) == "boolean" ? config.debug : true,
            this.records = [],
            this.session = {},
            this.loadTime = new Date();
            this.cssSelectors = typeof config.cssSelectors === 'object' && !(config.cssSelectors['selectors'] === undefined) ? config.cssSelectors['selectors'] : {},
            this.baseURL = typeof config.cssSelectors === 'object' && !(config.cssSelectors['baseURL'] === undefined) ? config.cssSelectors['baseURL'] : "";
            this.currentURL = document.location.href;
            this.selectorString;
            this.updateSelectorString();

            console.log(`Current url is: ${this.currentURL}`);

            // Initialize Session
            this.__initializeSession__();
            // Call Event Binding Method
            this.__bindEvents__();
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
    addListenersToMutations() {
        let elements = document.querySelectorAll(this.selectorString);

        elements.forEach(element => {
            if (this.debug) element.style.border = '2px solid red';
            element.setAttribute('data-listener-attached', 'true');
            for (let i = 0; i < this.interactionEvents.length; i++) {
                element.addEventListener(this.interactionEvents[i], function (e) {
                    console.log("You clicked an element of interest");
                    this.__addRecord__(this.__createInteractionRecord__(e, "interaction"));

                }.bind(this), true);
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
    __bindEvents__() {
        const observer = new MutationObserver(function(mutations, obs){
            this.addListenersToMutations();
        }.bind(this));
        
        // Start observing the entire document body for added nodes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Detects navigation events...
        navigation.addEventListener("navigate", function(navEvent){
            if (!(navEvent.destination.url === this.currentURL)){
                console.log("New url detected!");
                console.log(navEvent);
                // this.__addRecord__(this.__createNavigationRecord__(navEvent));
                this.currentURL = navEvent.destination.url;
                console.log("logging selectors");
                this.updateSelectorString();
            }
        }.bind(this));
        
        // Send interactions on unload
        window.addEventListener("beforeunload", e => this.__sendInteractions__());
    }

    /**
     * Logs the interaction record if debugging is enabled.
     *
     * @param {Object} record - The interaction record to log.
     */
    __debuggingLog__(record){
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
    __createNavigationRecord__(navEvent) {
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
    __createInteractionRecord__(e, type) {
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
    __addRecord__(record) {
        this.records.push(record);
        this.__debuggingLog__(record);
    }

    /**
     * Generates a session object and assigns it to the session property.
     */
    __initializeSession__() {
        // Assign Session Property
        this.session = {
            loadTime: this.loadTime,
            unloadTime: new Date(),
            language: window.navigator.language,
            platform: window.navigator.platform,
            port: window.location.port,
            clientStart: {
                name: window.navigator.appVersion,
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
                outerWidth: window.outerWidth,
                outerHeight: window.outerHeight
            },
            page: {
                location: window.location.pathname,
                href: window.location.href,
                origin: window.location.origin,
                title: document.title
            },
            endpoint: this.endpoint
        };
    }

    /**
     * Inserts end-of-session values into the session property.
     */
    __closeSession__() {
        // Assign Session Properties
        this.session.unloadTime = new Date();
        this.session.interactions = this.records;
        this.session.clientEnd = {
            name: window.navigator.appVersion,
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            outerWidth: window.outerWidth,
            outerHeight: window.outerHeight
        };
    }

    /**
     * Gathers additional data and sends interactions to the server.
     */
    __sendInteractions__() {
        // Close Session
        this.__closeSession__();

        console.log("Sending events to endpoint...");

        const blob = new Blob([JSON.stringify(this.session)], {
            type: 'application/json'
        });
        navigator.sendBeacon(this.endpoint, blob);
    }
}    
