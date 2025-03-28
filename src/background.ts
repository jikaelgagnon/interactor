import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

let USE_DB = false;

/**
 * Represents session data, including session information, associated documents,
 * and optional initial and closing data. Provides methods to manage and manipulate
 * session-related information.
 */
class SessionData {
  sessionInfo: any;
  documents: any[];
  initialData?: any;
  closingData?: any;

  constructor() {
    this.sessionInfo = null;
    this.documents = [];
  }

  clearSession(): void {
    this.documents = [];
    this.sessionInfo = null;
  }

  addDocument(document: any): void {
    this.documents.push(document);
  }

  _printContents(): void {
    console.log("---- PRINTING SESSION INFO ----");
    console.log(this.sessionInfo);
    console.log("---- PRINTING SESSION DOCUMENTS ----");
    console.table(this.documents);
  }

  setInitialData(data: any): void {
    this.initialData = data;
  }

  setClosingData(data: any): void {
    this.closingData = data;
  }
}

const SESSION_DATA = new SessionData();

async function addToSession(document: any): Promise<void> {
  SESSION_DATA.addDocument(document);
  SESSION_DATA._printContents();
}

async function clearSession(): Promise<void> {
  SESSION_DATA.clearSession();
}

async function addToDB(document: any): Promise<void> {
  console.log("Trying to add to DB");
  if (USE_DB) {
    try {
      const docRef = await addDoc(collection(db, "userData"), document);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.log("Failed to add to DB");
      console.error("Error adding document: ", e);
    }
  } else {
    console.log("USE_DB is set to false");
  }
}

chrome.tabs.onRemoved.addListener((tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => {
  if (SESSION_DATA.documents.length > 0) {
    // Spread session data into a new object before sending it to the DB.
    const { sessionInfo, documents, initialData, closingData } = SESSION_DATA;
    const data = { sessionInfo, documents, initialData, closingData };
    addToDB(data);
    SESSION_DATA.clearSession();
  }
});

chrome.runtime.onMessage.addListener(
  (
    request: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ): boolean => {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    console.log("message content:");
    console.log(request);
    
    switch (request.sender) {
      case "onInteractionDetection":
        console.log("Interaction received. Adding to session...");
        addToSession(request.payload)
          .then(() => {
            sendResponse({ status: "Data written to session!" });
          })
          .catch((err: Error) => {
            sendResponse({ status: "Error writing data to session: " + err.message });
          });
        console.log("Interaction received");
        break;
        
      case "onNavigationDetection":
        console.log("Navigation received. Adding to session...");
        addToSession(request.payload)
          .then(() => {
            sendResponse({ status: "Data written to session!" });
          })
          .catch((err: Error) => {
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
        sendResponse({ status: `Request type ${request.type} is unrecognized` });
    }
    return true;
  }
);
