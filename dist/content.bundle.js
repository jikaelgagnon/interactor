!function(){"use strict";class e{constructor(e,t){this.type=e,this.payload=t}}console.log("creating interactor"),new class{constructor(e){this.interactionEvents=!0===Array.isArray(e.interactionEvents)?e.interactionEvents:["click"],this.debug="boolean"!=typeof e.debug||e.debug,this.cssSelectors="object"==typeof e.cssSelectors&&void 0!==e.cssSelectors.selectors?e.cssSelectors.selectors:{},this.baseURL="object"==typeof e.cssSelectors&&void 0!==e.cssSelectors.baseURL?e.cssSelectors.baseURL:"",this.currentURL=document.location.href,this.selectorString,this.updateSelectorString(),console.log(`Current url is: ${this.currentURL}`),this.initializeSession(),this.bindEvents()}updateSelectorString(){console.log(`CSS selectors are: ${this.cssSelectors}`);const e=Object.keys(this.cssSelectors).filter((e=>(console.log(e),new URLPattern(e,this.baseURL).test(this.currentURL))));let t=[];for(const s of e){const e=this.cssSelectors[s].map((e=>`${e}:not([data-listener-attached])`));t=t.concat(e)}const s=t.join(", ");this.selectorString=s}async sendMessageToBackground(t,s){let n=new e(t,s);return await chrome.runtime.sendMessage(n)}onInteractionDetection(e){console.log("You clicked an element of interest");const t=this.createInteractionRecord(e,"interaction");this.sendMessageToBackground("onInteractionDetection",t)}onNavigationDetection(e){console.log(" ---- Navigation event detected"),e.destination.url!==this.currentURL?(console.log("New url detected!"),this.currentURL=e.destination.url,this.updateSelectorString()):console.log("URL was unchanged");const t=this.createNavigationRecord(e);this.sendMessageToBackground("onNavigationDetection",t)}addListenersToMutations(){console.log(`selectors: ${this.selectorString}`),document.querySelectorAll(this.selectorString).forEach((e=>{this.debug&&(e.style.border="2px solid red"),e.setAttribute("data-listener-attached","true");for(let t=0;t<this.interactionEvents.length;t++)e.addEventListener(this.interactionEvents[t],(e=>this.onInteractionDetection(e)),!0)}))}bindEvents(){console.log("binding events to the page"),window.addEventListener("load",(()=>{new MutationObserver(function(e,t){this.addListenersToMutations()}.bind(this)).observe(document.body,{childList:!0,subtree:!0}),this.addListenersToMutations()})),navigation.addEventListener("navigate",(e=>this.onNavigationDetection(e))),window.addEventListener("beforeunload",(e=>this.closeSession()))}debuggingLog(e){this.debug&&console.log(e)}createNavigationRecord(e){return{type:e.type,destinationURL:e.destination.url,createdAt:new Date}}createInteractionRecord(e,t){return{type:t,event:e.type,targetTag:e.target.nodeName,targetClasses:e.target.className,content:e.target.innerText,clientPosition:{x:e.clientX,y:e.clientY},screenPosition:{x:e.screenX,y:e.screenY},createdAt:new Date}}addRecord(e){this.debuggingLog(e)}getCurrentState(){return{page:{location:window.location.pathname,href:window.location.href,origin:window.location.origin,title:document.title},url:this.currentURL}}initializeSession(){this.session={start:null,end:null},this.session.start=this.getCurrentState()}closeSession(){this.session.end=this.getCurrentState(),console.log("closing seesion"),console.log(this.session),this.sendMessageToBackground("closeSession",this.session)}}({cssSelectors:{baseURL:"https://x.com",selectors:{"/*":['[data-testid="reply"]',".css-175oi2r.r-1777fci.r-bt1l66.r-bztko3.r-lrvibr.r-1loqt21.r-1ny4l3l",".css-175oi2r.r-sdzlij.r-1phboty.r-rs99b7.r-lrvibr.r-19yznuf.r-64el8z.r-o7ynqc.r-6416eg.r-1ny4l3l.r-1loqt21"]}}})}();