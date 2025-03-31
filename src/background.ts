import { collection, addDoc } from "firebase/firestore";
import { db } from "./database/firebase";
import { BackgroundMessage } from "./communication/backgroundmessage";
import { SenderMethod } from "./communication/sender";

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

// chrome.runtime.onMessage.addListener(
//   (
//     request: BackgroundMessage,
//     sender: chrome.runtime.MessageSender,
//     sendResponse: (response?: any) => void
//   ): boolean => {
//     console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
//     console.log("message content:");
//     console.log(request);
    
//     switch (request.senderMethod) {
//       case SenderMethod.InteractionDetection:
//         console.log("Interaction received. Adding to session...");
//         addToSession(request.payload)
//           .then(() => {
//             sendResponse({ status: "Data written to session!" });
//           })
//           .catch((err: Error) => {
//             sendResponse({ status: "Error writing data to session: " + err.message });
//           });
//         console.log("Interaction received");
//         break;
        
//       case SenderMethod.NavigationDetection:
//         console.log("Navigation received. Adding to session...");
//         addToSession(request.payload)
//           .then(() => {
//             sendResponse({ status: "Data written to session!" });
//           })
//           .catch((err: Error) => {
//             sendResponse({ status: "Error writing data to session: " + err.message });
//           });
//         console.log("Interaction received");
//         break;
        
//       case SenderMethod.InitializeSession:
//         console.log("Session started");
//         SESSION_DATA.sessionInfo = request.payload;
//         console.log(request.payload);
//         break;
        
//       default:
//         sendResponse({ status: `Request type ${request.senderMethod} is unrecognized` });
//     }
//     return true;
//   }
// );

// chrome.runtime.onMessage.addListener(
//   async (
//     request: BackgroundMessage,
//     sender: chrome.runtime.MessageSender,
//     sendResponse: (response?: any) => void
//   ): Promise<boolean> => {
//     console.log(sender.tab ? `from a content script: ${sender.tab.url}` : "from the extension");
//     console.log("message content:", request);

//     try {
//       switch (request.senderMethod) {
//         case SenderMethod.InteractionDetection:
//           console.log("Interaction received. Adding to session...");
//           await addToSession(request.payload);
//           sendResponse({ status: "Data written to session!" });
//           break;

//         case SenderMethod.NavigationDetection:
//           console.log("Navigation received. Adding to session...");
//           await addToSession(request.payload);
//           sendResponse({ status: "Data written to session!" });
//           break;

//         case SenderMethod.InitializeSession:
//           console.log("Session started");
//           SESSION_DATA.sessionInfo = request.payload;
//           console.log(request.payload);
//           sendResponse({ status: "Session initialized" });
//           break;

//         default:
//           console.warn(`Unrecognized sender method: ${request.senderMethod}`);
//           sendResponse({ status: `Unrecognized request type: ${request.senderMethod}` });
//       }
//     } catch (error: any) {
//       console.error("Error processing message:", error);
//       sendResponse({ status: "Error", message: error.message });
//     }

//     return true;
//   }
// );

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(sender.tab ? `from content script: ${sender.tab.url}` : "from the extension");
  console.log("message content:", message);

  handleMessage(message)
    .then((response) => {
      sendResponse(response);
    })
    .catch((error) => {
      console.error("Error handling message:", error);
      sendResponse({ status: "Error", message: error.message });
    });

  // Return true to indicate asynchronous response handling
  return true;
});

const handleMessage = async (request: BackgroundMessage): Promise<any> => {
  switch (request.senderMethod) {
    case SenderMethod.InteractionDetection:
      console.log("Interaction received. Adding to session...");
      await addToSession(request.payload);
      return { status: "Data written to session!" };

    case SenderMethod.NavigationDetection:
      console.log("Navigation received. Adding to session...");
      await addToSession(request.payload);
      return { status: "Data written to session!" };

    case SenderMethod.InitializeSession:
      console.log("Session started");
      SESSION_DATA.sessionInfo = request.payload;
      console.log(request.payload);
      return { status: "Session initialized" };

    default:
      console.warn(`Unrecognized sender method: ${request.senderMethod}`);
      return { status: `Unrecognized request type: ${request.senderMethod}` };
  }
};
