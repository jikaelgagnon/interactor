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
// 1. Prevent duplicate navigations on yt shorts
// 2. Prevent cases when a navigation and an interaction are logged for the same event



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
            this.cssSelectors = Array.isArray(config.cssSelectors) === true ? config.cssSelectors : [],

            // Initialize Session
            this.__initializeSession__();
            // Call Event Binding Method
            console.log("binding events");
            this.__bindEvents__();
            console.log("done binding events");
            // this.__showInteractions__();
    }

    // __showInteractions__(){
    //     console.log(document.querySelectorAll('#endpoint'));
    //     console.log("showing interactions")
    //     const selectorString = this.cssSelectors.join(", ");
    //     const interactionElements = document.querySelectorAll(selectorString);
    //     // console.log(interactionElements);
    //     // for (const e of interactionElements){
    //     //     e.style.border = "thick solid #00FF00";
    //     // }
    // }

    
    // Instead of doing this in increments, do it all at once...
    addAllInteractions() {
        let numFound = 0;

        for (const s of this.cssSelectors){
            let elements = document.querySelectorAll(s);
            if (elements.length > 0){
                numFound++;
            }
        }

        let allDetected = numFound === this.cssSelectors.length;

        if (allDetected){
            const selectorString = this.cssSelectors.join(", ");
            const elements = document.querySelectorAll(selectorString);
            elements.forEach(e => e.style.border = '2px solid red');
            elements.forEach(element => {
                for (let i = 0; i < this.interactionEvents.length; i++) {
                    element.addEventListener(this.interactionEvents[i], function (e) {
                        // e.stopPropagation();
                        console.log("You clicked an element of interest");
                        this.__addRecord__(this.__createInteractionRecord__(e, "interaction"));
                    }.bind(this));
                }
            });
            
        }

        return allDetected;
    }
      
    
    // Create Events to Track
    __bindEvents__() {

             // Initial check
        if (!this.addAllInteractions()) {
            const observer = new MutationObserver(function(mutations, obs){
            if (this.addAllInteractions()) {
                console.log("disconnecting mutation observer");
                obs.disconnect(); // Stop observing once all elements found
            }
            }.bind(this));
        
            // Start observing the entire document body for added nodes
            observer.observe(document.body, {
            childList: true,
            subtree: true
            });
        }
          
          

        const selectorString = this.cssSelectors.join(", ");
        console.log(selectorString);

        // Detects navigation events...
        // navigation.addEventListener("navigate", navEvent => {
        //     console.log("You navigated");
        //     this.__addRecord__(this.__createNavigationRecord__(navEvent));
        // });

        // Set Interaction Capture
        /*
        Iterates over each type of event (eg. ["click", "mousedown", "mouseup", "touchstart", "touchend"])
        and adds an event listener to the body of the document for each. Once these events are triggered,
        the code checks whether the element has class "interaction". If it does, the event is stored
        */
        // if (this.cssSelectors) {
        //     console.log("css selectors detected. starting binding");
        //     for (let i = 0; i < this.interactionEvents.length; i++) {
        //         document.querySelector('body').addEventListener(this.interactionEvents[i], function (e) {
        //             e.stopPropagation();
        //             if (e.target.matches(selectorString)) {
        //                 console.log("You clicked an element of interest");
        //                 this.__addRecord__(this.__createInteractionRecord__(e, "interaction"));
        //             }
        //         }.bind(this));
        //     }
        // }


        // Send interactions on unload
        window.addEventListener("beforeunload", e => this.__sendInteractions__());
    }

    __debuggingLog__(record){
         // Log Interaction if Debugging
         if (this.debug) {
            console.log(record);
        }
    }

    __createNavigationRecord__(navEvent) {
            // Navigation Object
            const navigation = {
                type: navEvent.type,
                destinationURL: navEvent.destination.url,
                createdAt: new Date()
            };

            return navigation;
    }

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

    __addRecord__(record)
    {
        this.records.push(record);
        this.__debuggingLog__(record);
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

        console.log("Sending events to endpoint...");

        const blob = new Blob([JSON.stringify(this.session)], {
            type: 'application/json'
        });
        navigator.sendBeacon(this.endpoint, blob);
    }
}


