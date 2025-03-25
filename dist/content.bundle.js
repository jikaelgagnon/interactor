!function(){"use strict";class e{constructor(e,t){this.type=e,this.payload=t}}class t{constructor(e,t,n){this.type=e,this.createdAt=Date(),this.currentPath=new URL(t).pathname,this.metadata=n}}console.log("creating interactor"),new class{constructor(e){this.interactionEvents=!0===Array.isArray(e.interactionEvents)?e.interactionEvents:["click"],this.debug="boolean"!=typeof e.debug||e.debug,this.cssSelectors="object"==typeof e.cssSelectors&&void 0!==e.cssSelectors.interactions?e.cssSelectors.interactions:{},this.baseURL="object"==typeof e.cssSelectors&&void 0!==e.cssSelectors.baseURL?e.cssSelectors.baseURL:"",this.currentURL=document.location.href,this.selectorString,this.updateSelectorString(),this.currentSelectors,this.currentInteractions,this.currentURLUsesId,console.log(`Current url is: ${this.currentURL}`),this.initializeSession(),this.bindEvents()}updateSelectorString(){this.currentURLUsesId=!1;const e=Object.keys(this.cssSelectors).filter((e=>{const t=new URLPattern(e,this.baseURL).test(this.currentURL);return t&&e.endsWith(":id")&&(this.currentURLUsesId=!0),t}));this.currentInteractions=[];for(const t of e){let e=this.cssSelectors[t];for(const t of e){let e=t.selector;this.currentInteractions.push({selector:`${e}:not([data-listener-attached])`,name:t.name})}}}async sendMessageToBackground(t,n){let o=new e(t,n);return await chrome.runtime.sendMessage(o)}onInteractionDetection(e,t){const n=this.createInteractionRecord(t,"interaction");this.sendMessageToBackground("onInteractionDetection",n)}checkForMatch(e){let t=new URL(this.currentURL).pathname,n=new URL(e).pathname,o=t.split("/"),s=n.split("/");if(console.log(`cur path uses ID: ${this.currentURLUsesId}`),console.log(`cur path ${t}, length: ${o.length}`),console.table(o),console.log(`other path ${n}, length: ${s.length}`),console.table(s),t.length!==n.length)return!1;console.log("lengths are the same");let r=o.length-1*this.currentURLUsesId;for(let e=0;e<r;e++)if(o[e]!=o[e])return!1;return!0}onNavigationDetection(e){let t=!(e.destination.url===this.currentURL),n=this.checkForMatch(e.destination.url);if(console.log(`URLs match: ${n}`),this.currentURL=e.destination.url,"push"!==e.navigationType||n){if("replace"===e.navigationType||n){t?console.log("You're on the same page but URL changed"):console.log("You're on the same page and URL didn't change");const n=this.createSelfLoopRecord(e,t);this.sendMessageToBackground("onNavigationDetection",n)}}else{console.log("You changed pages"),this.updateSelectorString();const t=this.createStateChangeRecord(e);this.sendMessageToBackground("onNavigationDetection",t)}}StringToColor=function(){var e=null;return{next:function(t){return null===e&&((e={}).stringToColorHash={},e.nextVeryDifferntColorIdx=0,e.veryDifferentColors=["#00FF00","#0000FF","#FF0000","#01FFFE","#FFA6FE","#FFDB66","#006401","#010067","#95003A","#007DB5","#FF00F6","#FFEEE8","#774D00","#90FB92","#0076FF","#D5FF00","#FF937E","#6A826C","#FF029D","#FE8900","#7A4782","#7E2DD2","#85A900","#FF0056","#A42400","#00AE7E","#683D3B","#BDC6FF","#263400","#BDD393","#00B917","#9E008E","#001544","#C28C9F","#FF74A3","#01D0FF","#004754","#E56FFE","#788231","#0E4CA1","#91D0CB","#BE9970","#968AE8","#BB8800","#43002C","#DEFF74","#00FFC6","#FFE502","#620E00","#008F9C","#98FF52","#7544B1","#B500FF","#00FF78","#FF6E41","#005F39","#6B6882","#5FAD4E","#A75740","#A5FFD2","#FFB167","#009BFF","#E85EBE"]),e.stringToColorHash[t]||(e.stringToColorHash[t]=e.veryDifferentColors[e.nextVeryDifferntColorIdx++],console.log(`%c The colour for ${t}`,`color: ${e.stringToColorHash[t]}`)),e.stringToColorHash[t]}}}();addListenersToMutations(){this.currentInteractions.forEach((e=>{let t=document.querySelectorAll(e.selector),n=e.name;t.forEach((e=>{this.debug&&(e.style.border=`2px solid ${this.StringToColor.next(n)}`),e.setAttribute("data-listener-attached","true");for(let t=0;t<this.interactionEvents.length;t++)e.addEventListener(this.interactionEvents[t],(e=>{this.onInteractionDetection(e,n)}),!0)}))}))}bindEvents(){console.log("binding events to the page"),window.addEventListener("load",(()=>{new MutationObserver(function(e,t){this.addListenersToMutations()}.bind(this)).observe(document.body,{childList:!0,subtree:!0}),this.addListenersToMutations()})),navigation.addEventListener("navigate",(e=>this.onNavigationDetection(e)))}debuggingLog(e){this.debug&&console.log(e)}createStateChangeRecord(e){const n={destinationPath:new URL(e.destination.url).pathname};return new t("state_change",this.currentURL,n)}createSelfLoopRecord(e,n){const o={urlChange:n};return new t("self_loop",this.currentURL,o)}createInteractionRecord(e,n){const o={name:e};return new t("interaction",this.currentURL,o)}addRecord(e){this.debuggingLog(e)}getCurrentState(){return{page:{location:window.location.pathname,href:window.location.href,origin:window.location.origin,title:document.title},url:this.currentURL}}initializeSession(){this.sendMessageToBackground("initializeSession",this.getCurrentState())}}({cssSelectors:{baseURL:"https://www.youtube.com",interactions:{"/*":[{selector:"#endpoint",name:"Side Navigation Button"},{selector:"#logo-icon",name:"YouTube Logo"},{selector:"ytd-rich-grid-media.style-scope.ytd-rich-item-renderer",name:"Video"},{selector:"ytm-shorts-lockup-view-model-v2",name:"Shorts on Miniplayer"},{selector:'.yt-spec-button-shape-next[aria-label="Next"]',name:"Next Button"},{selector:"#chip-container.style-scope.yt-chip-cloud-chip-renderer",name:"Category Button"}],"":[],"/shorts/:id":[{selector:"#like-button[is-shorts]",name:"Shorts Like Button"},{selector:"#dislike-button[is-shorts]",name:"Shorts Dislike Button"}],"/watch?v=:id":[{selector:"ytd-compact-video-renderer.style-scope.ytd-item-section-renderer",name:"Watch Page Recommended Video"},{selector:"ytd-toggle-button-renderer#dislike-button",name:"Comment Dislike Button"},{selector:"ytd-toggle-button-renderer#like-button",name:"Comment Like Button"}]}}})}();