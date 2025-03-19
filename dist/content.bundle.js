(()=>{"use strict";class e{constructor(e,t){this.type=e,this.payload=t}}new class{constructor(e){this.interactions="boolean"!=typeof e.interactions||e.interactions,this.interactionElement="string"==typeof e.interactionElement?e.interactionElement:"interaction",this.interactionEvents=!0===Array.isArray(e.interactionEvents)?e.interactionEvents:["click"],this.conversions="boolean"!=typeof e.conversions||e.conversions,this.conversionElement="string"==typeof e.conversionElement?e.conversionElement:"conversion",this.conversionEvents=!0===Array.isArray(e.conversionEvents)?e.conversionEvents:["mouseup","touchend"],this.endpoint="string"==typeof e.endpoint?e.endpoint:"http://localhost:5001/beacon",this.async="boolean"!=typeof e.async||e.async,this.debug="boolean"!=typeof e.debug||e.debug,this.session={},this.loadTime=new Date,this.cssSelectors="object"==typeof e.cssSelectors&&void 0!==e.cssSelectors.selectors?e.cssSelectors.selectors:{},this.baseURL="object"==typeof e.cssSelectors&&void 0!==e.cssSelectors.baseURL?e.cssSelectors.baseURL:"",this.currentURL=document.location.href,this.selectorString,this.updateSelectorString(),console.log(`Current url is: ${this.currentURL}`),this.initializeSession(),this.bindEvents()}updateSelectorString(){const e=Object.keys(this.cssSelectors).filter((e=>(console.log(e),new URLPattern(e,this.baseURL).test(this.currentURL))));let t=[];for(const n of e){const e=this.cssSelectors[n].map((e=>`${e}:not([data-listener-attached])`));t=t.concat(e)}const n=t.join(", ");this.selectorString=n}async sendMessageToBackground(t,n){let o=new e(t,n);return await chrome.runtime.sendMessage(o)}addListenersToMutations(){document.querySelectorAll(this.selectorString).forEach((e=>{this.debug&&(e.style.border="2px solid red"),e.setAttribute("data-listener-attached","true");for(let t=0;t<this.interactionEvents.length;t++)e.addEventListener(this.interactionEvents[t],function(e){console.log("You clicked an element of interest");const t=this.createInteractionRecord(e,"interaction");this.sendMessageToBackground("sendInteraction",t)}.bind(this),!0)}))}bindEvents(){window.addEventListener("load",(()=>{new MutationObserver(function(e,t){this.addListenersToMutations()}.bind(this)).observe(document.body,{childList:!0,subtree:!0}),this.addListenersToMutations()})),navigation.addEventListener("navigate",function(e){e.destination.url!==this.currentURL&&(console.log("New url detected!"),console.log(e),this.currentURL=e.destination.url,console.log("logging selectors"),this.updateSelectorString())}.bind(this)),window.addEventListener("beforeunload",(e=>this.closeSession()))}debuggingLog(e){this.debug&&console.log(e)}createNavigationRecord(e){return{type:e.type,destinationURL:e.destination.url,createdAt:new Date}}createInteractionRecord(e,t){return{type:t,event:e.type,targetTag:e.target.nodeName,targetClasses:e.target.className,content:e.target.innerText,clientPosition:{x:e.clientX,y:e.clientY},screenPosition:{x:e.screenX,y:e.screenY},createdAt:new Date}}addRecord(e){this.debuggingLog(e)}initializeSession(){this.session={loadTime:this.loadTime,unloadTime:new Date,language:window.navigator.language,platform:window.navigator.platform,port:window.location.port,clientStart:{name:window.navigator.appVersion,innerWidth:window.innerWidth,innerHeight:window.innerHeight,outerWidth:window.outerWidth,outerHeight:window.outerHeight},page:{location:window.location.pathname,href:window.location.href,origin:window.location.origin,title:document.title},endpoint:this.endpoint}}closeSession(){this.sendMessageToBackground("closeSession",this.session)}}({cssSelectors:{baseURL:"https://www.youtube.com",selectors:{"/*":["#endpoint","#logo-icon","#content.ytd-rich-item-renderer","ytd-compact-video-renderer","ytm-shorts-lockup-view-model-v2",'.yt-spec-button-shape-next[aria-label="Next"]'],"":["#chip-container"],"/shorts/:id":["#like-button[is-shorts]","#dislike-button[is-shorts]"]}}})})();