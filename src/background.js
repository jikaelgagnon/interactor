import { collection, addDoc } from "firebase/firestore"; 
import { db } from "./firebase.js";
import { doc } from "firebase/firestore/lite";

// TODO: Change this later... this is for debugging...
let USE_DB = true;

// On startup, create an object to hold session data
class SessionData {
  constructor() {
    this.sessionInfo = null;
    this.documents = [];
  }
  clearSession(){
    this.documents = [];
    this.sessionInfo = null;
  }
  addDocument(document){
    this.documents.push(document);
  }
  _printContents(){
    console.log("---- PRINTING SESSION INFO ----");
    console.log(this.sessionInfo);
    console.log("---- PRINTING SESSION DOCUMENTS ----");
    console.table(this.documents);
  }
  setInitialData(data){
    this.initialData = data;
  }
  setClosingData(data){
    this.closingData = data;
  }
}

let SESSION_DATA = new SessionData();


async function addToSession(document){
  SESSION_DATA.addDocument(document);
  SESSION_DATA._printContents();
}

async function clearSession(){
  SESSION_DATA.clearSession();
}

async function addToDB(document) {
  console.log("Trying to add to DB");
  if (USE_DB) {
    try {
      const docRef = await addDoc(collection(db, "userData"), document);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.log("Failed to add to DB");
      console.error("Error adding document: ", e);
    }
  }
  else {
    console.log("USE_DB is set to false");
  }
}

chrome.tabs.onRemoved.addListener(function(tabid, removed) {
  if (SESSION_DATA.documents.length > 0){
    const {...data} = SESSION_DATA;
    addToDB(data);
    SESSION_DATA.clearSession();
 }
}
)

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    console.log("message content:");
    console.log(request);
    switch(request.type){
      case "onInteractionDetection":
        console.log("Interaction received. Adding to session...");
        addToSession(request.payload).then(() => {
          sendResponse({ status: "Data written to session!" });
        }).catch((err) => {
          sendResponse({ status: "Error writing data to session: " + err.message });
        });
        console.log("Interaction received");
        break;
      case "onNavigationDetection":
          console.log("Navigation received. Adding to session...");
          addToSession(request.payload).then(() => {
            sendResponse({ status: "Data written to session!" });
          }).catch((err) => {
            sendResponse({ status: "Error writing data to session: " + err.message });
          });
          console.log("Interaction received");
          break;
      case "initializeSession":
          console.log("Session started");
          SESSION_DATA.sessionInfo = request.payload;
          console.log(request.payload);
          break;
      default:  
        sendResponse({ status: `Request type ${request.type} is unrecognized`});
    }

    return true;
  }
);
