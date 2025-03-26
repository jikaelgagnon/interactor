!function(){"use strict";class e{constructor(e,t){this.type=e,this.payload=t}}class t{constructor(e,t,n){this.type=e,this.createdAt=new Date,this.sourceState=t,this.metadata=n}}const n={baseURL:"https://www.tiktok.com",interactions:{"/*":{selectors:[{selector:'a[data-e2e="tiktok-logo"]',name:"TikTok Logo"},{selector:'span[data-e2e="like-icon"]',name:"Like Button"},{selector:'span[data-e2e="comment-icon"]',name:"Comment Button"},{selector:'button[aria-label="For You"]',name:"Home Button"},{selector:'button[aria-label="Explore"]',name:"Explore Button"},{selector:'button[aria-label="Following"]',name:"Following Button"}],idSelector:function(){let e=document.querySelector("div.xgplayer-container.tiktok-web-player");return e?`https://tiktok.com/share/video/${e.id.split("-").at(-1)}`:(console.log("no url found!"),null)}}}};console.log("creating interactor"),new class{constructor(e){this.interactionEvents=!0===Array.isArray(e.interactionEvents)?e.interactionEvents:["click"],this.debug="boolean"!=typeof e.debug||e.debug,this.cssSelectors="object"==typeof e.cssSelectors&&void 0!==e.cssSelectors.interactions?e.cssSelectors.interactions:{},this.baseURL="object"==typeof e.cssSelectors&&void 0!==e.cssSelectors.baseURL?e.cssSelectors.baseURL:"",this.currentURL=document.location.href,this.selectorString,this.updateSelectorString(),this.currentSelectors,this.currentInteractions,this.currentURLUsesId,this.currentMatch,console.log(`Current url is: ${this.currentURL}`),this.initializeSession(),this.bindEvents()}updateSelectorString(){this.currentURLUsesId=!1;let e="";const t=Object.keys(this.cssSelectors).filter((t=>{const n=new URLPattern(t,this.baseURL).test(this.currentURL);return n&&t.length>e.length&&(e=t),n}));if(0!=t.length){e.endsWith(":id")&&(this.currentURLUsesId=!0),this.currentMatch=this.cssSelectors[e],console.log("Printing current match"),console.log(this.currentMatch),console.log(`Current url uses ID: ${this.currentURLUsesId}`),this.currentInteractions=[];for(const e of t){let t=this.cssSelectors[e];for(const e of t.selectors){let t=e.selector;this.currentInteractions.push({selector:`${t}:not([data-listener-attached])`,name:e.name})}}}}async sendMessageToBackground(t,n){let o=new e(t,n);return await chrome.runtime.sendMessage(o)}onInteractionDetection(e,t){const n=this.createInteractionRecord(t,this.getCleanStateName(),"interaction");this.sendMessageToBackground("onInteractionDetection",n)}checkForMatch(e){let t=new URL(this.currentURL).pathname,n=new URL(e).pathname,o=t.split("/"),s=n.split("/");if(console.log(`cur path uses ID: ${this.currentURLUsesId}`),console.log(`cur path ${t}, length: ${o.length}`),console.table(o),console.log(`other path ${n}, length: ${s.length}`),console.table(s),t.length!==n.length)return!1;console.log("lengths are the same");let r=o.length-1*this.currentURLUsesId;for(let e=0;e<r;e++)if(o[e]!=o[e])return!1;return!0}getCleanStateName(){console.log(`Current url: ${this.currentURL}`);let e=new URL(this.currentURL).pathname,t=e.split("/");return console.log(`Current path: ${e}`),console.log(`Uses ID: ${this.currentURLUsesId}`),this.currentURLUsesId&&(t=t.slice(0,t.length-1)),console.log(`Groups: ${t}`),t.join("/")}onNavigationDetection(e){let t=!(e.destination.url===this.currentURL),n=this.getCleanStateName(),o=this.checkForMatch(e.destination.url);console.log(`URLs match: ${o}`),console.log("------ TRYING TO GET ID ------------");let s="idSelector"in this.currentMatch;if(console.log(`ID Selector is not null: ${s}`),s){let e=this.currentMatch.idSelector();console.log(e)}this.currentURL,this.currentURL=e.destination.url;let r=this.getCleanStateName();if("push"!==e.navigationType||o){if("replace"===e.navigationType||o){t?console.log("You're on the same page but URL changed"):console.log("You're on the same page and URL didn't change");const o=this.createSelfLoopRecord(e,n,t);this.sendMessageToBackground("onNavigationDetection",o)}}else{console.log("You changed pages"),this.updateSelectorString();const t=this.createStateChangeRecord(e,n,r);this.sendMessageToBackground("onNavigationDetection",t)}}StringToColor=function(){var e=null;return{next:function(t){return null===e&&((e={}).stringToColorHash={},e.nextVeryDifferntColorIdx=0,e.veryDifferentColors=["#00FF00","#0000FF","#FF0000","#01FFFE","#FFA6FE","#FFDB66","#006401","#010067","#95003A","#007DB5","#FF00F6","#FFEEE8","#774D00","#90FB92","#0076FF","#D5FF00","#FF937E","#6A826C","#FF029D","#FE8900","#7A4782","#7E2DD2","#85A900","#FF0056","#A42400","#00AE7E","#683D3B","#BDC6FF","#263400","#BDD393","#00B917","#9E008E","#001544","#C28C9F","#FF74A3","#01D0FF","#004754","#E56FFE","#788231","#0E4CA1","#91D0CB","#BE9970","#968AE8","#BB8800","#43002C","#DEFF74","#00FFC6","#FFE502","#620E00","#008F9C","#98FF52","#7544B1","#B500FF","#00FF78","#FF6E41","#005F39","#6B6882","#5FAD4E","#A75740","#A5FFD2","#FFB167","#009BFF","#E85EBE"]),e.stringToColorHash[t]||(e.stringToColorHash[t]=e.veryDifferentColors[e.nextVeryDifferntColorIdx++],console.log(`%c The colour for ${t}`,`color: ${e.stringToColorHash[t]}`)),e.stringToColorHash[t]}}}();addListenersToMutations(){this.currentInteractions.forEach((e=>{let t=document.querySelectorAll(e.selector),n=e.name;t.forEach((e=>{this.debug&&(e.style.border=`2px solid ${this.StringToColor.next(n)}`),e.setAttribute("data-listener-attached","true");for(let t=0;t<this.interactionEvents.length;t++)e.addEventListener(this.interactionEvents[t],(e=>{this.onInteractionDetection(e,n)}),!0)}))}))}bindEvents(){console.log("binding events to the page"),window.addEventListener("load",(()=>{new MutationObserver(function(e,t){this.addListenersToMutations()}.bind(this)).observe(document.body,{childList:!0,subtree:!0}),this.addListenersToMutations()})),navigation.addEventListener("navigate",(e=>this.onNavigationDetection(e)))}debuggingLog(e){this.debug&&console.log(e)}createStateChangeRecord(e,n,o){return new t("state_change",n,{destinationState:o})}createSelfLoopRecord(e,n,o){return new t("self_loop",n,{urlChange:o})}createInteractionRecord(e,n,o){return new t("interaction",n,{name:e})}addRecord(e){this.debuggingLog(e)}getCurrentState(){return{page:{location:window.location.pathname,href:window.location.href,origin:window.location.origin,title:document.title},url:this.currentURL}}initializeSession(){this.sendMessageToBackground("initializeSession",this.getCurrentState())}}({cssSelectors:n})}();