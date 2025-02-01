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

// TODO:
// Implement DB functionality
// Change interactor.endpoint to be a DB

class Interactor {
    constructor(config) {
            // Argument Assignment          // Type Checks                                                                          // Default Values
            this.interactions = typeof (config.interactions) == "boolean" ? config.interactions : true,
            this.interactionElement = typeof (config.interactionElement) == "string" ? config.interactionElement : 'interaction',
            this.interactionEvents = Array.isArray(config.interactionEvents) === true ? config.interactionEvents : ['click'],
            this.conversions = typeof (config.conversions) == "boolean" ? config.conversions : true,
            this.conversionElement = typeof (config.conversionElement) == "string" ? config.conversionElement : 'conversion',
            this.conversionEvents = Array.isArray(config.conversionEvents) === true ? config.conversionEvents : ['mouseup', 'touchend'],
            this.endpoint = typeof (config.endpoint) == "string" ? config.endpoint : 'https://webhook.site/f7128e87-57cc-42b7-80db-ca4a56e25451',
            this.async = typeof (config.async) == "boolean" ? config.async : true,
            this.debug = typeof (config.debug) == "boolean" ? config.debug : true,
            this.records = [],
            this.session = {},
            this.loadTime = new Date();
            this.cssSelectors = Array.isArray(config.cssSelectors) === true ? config.cssSelectors : [],

            // Initialize Session
            this.__initializeSession__();
            // Call Event Binding Method
            this.__bindEvents__();
    }
    // Create Events to Track
    __bindEvents__() {
        const selectorString = this.cssSelectors.join(", ");
        console.log(selectorString);

        // Set Interaction Capture
        /*
Iterates over each type of event (eg. ["click", "mousedown", "mouseup", "touchstart", "touchend"])
and adds an event listener to the body of the document for each. Once these events are triggered,
the code checks whether the element has class "interaction". If it does, the event is stored
*/
        if (this.cssSelectors) {
            console.log("css selectors detected. starting binding");
            for (let i = 0; i < this.interactionEvents.length; i++) {
                document.querySelector('body').addEventListener(this.interactionEvents[i], function (e) {
                    e.stopPropagation();
                    if (e.target.matches(selectorString)) {
                        this.__addInteraction__(e, "interaction");
                    }
                }.bind(this));
            }
        }


        // Send interactions on unload
        window.addEventListener("beforeunload", e => this.__sendInteractions__());
    }
    // Add Interaction Object Triggered By Events to Records Array
    __addInteraction__(e, type) {
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

        // Insert into Records Array
        this.records.push(interaction);

        // Log Interaction if Debugging
        if (this.debug) {
            // Close Session & Log to Console
            this.__closeSession__();
            console.log("Session:\n", this.session);
        }

    }
    // Generate Session Object & Assign to Session Property
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
    // Insert End of Session Values into Session Property
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
    // Gather Additional Data and Send Interaction(s) to Server
    __sendInteractions__() {
        // Close Session
        this.__closeSession__();

        const blob = new Blob([JSON.stringify(this.session)], {
            type: 'text/plain; charset=UTF-8'
        });
        navigator.sendBeacon(this.endpoint, blob);
    }
}


