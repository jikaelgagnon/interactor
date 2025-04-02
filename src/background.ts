import { collection, addDoc } from "firebase/firestore";
import { db } from "./database/firebase";
import {ActivityDocument, SessionDocument} from "./database/dbdocument";
import { BackgroundMessage } from "./communication/backgroundmessage";
import { SenderMethod } from "./communication/sender";

let USE_DB = true;

/**
 * A singleton class representing session data, including session information, associated documents,
 * and optional initial and closing data. Provides methods to manage and manipulate
 * session-related information.
 */
class SessionData {
  sessionInfo?: SessionDocument;
  documents: ActivityDocument[];
  static instance: SessionData = new SessionData();

  private constructor() {
    this.documents = [];
  }

  /**
   * Clears the session when the tab is closed
   */
  static clearSession(): void {
    SessionData.instance.documents = [];
    SessionData.instance.sessionInfo = undefined;
  }

  /**
   * Adds an activity document to the list of activities
   * @param document - the activity that just occured
   */
  static addActivityDocument(document: ActivityDocument): void {
    SessionData.instance.documents.push(document);
  }
  /**
   * For debugging. Prints contents of the session
   */
  static _printContents(): void {
    console.log(SessionData.instance.sessionInfo);
    console.table(SessionData.instance.documents);
  }

  /**
   * Appends data to the database, if USE_DB is set to true
   */
  static async addSessionToDb(): Promise<void> {
    console.log("Trying to add to DB");
    SessionData._printContents();
    const { sessionInfo, documents} = SessionData.instance;
    const data = { sessionInfo, documents};
    SessionData.clearSession();
    if (USE_DB) {
      try {
        const docRef = await addDoc(collection(db, "userData"), data);
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.log("Failed to add to DB");
        console.error("Error adding document: ", e);
      }
    } else {
      console.log("USE_DB is set to false");
    }
  }
}

/**
 * Append data to database when tab is closed
 */
chrome.tabs.onRemoved.addListener((tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => {
  if (SessionData.instance.documents.length > 0) {
    SessionData.addSessionToDb();
    SessionData.clearSession();
  }
});

/**
 * Handles messaging between content and background scripts
 */
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

/**
 * Saves data depending on the messenger in the content script.
 * @param request -  Message sent to the background from the content script
 * @returns - Promise indicating the status of the handling
 */

const handleMessage = async (request: BackgroundMessage): Promise<any> => {
  switch (request.senderMethod) {
    case SenderMethod.InteractionDetection:
      console.log("Interaction received. Adding to session...");
      SessionData.addActivityDocument(request.payload as ActivityDocument);
      return { status: "Data written to session!" };

    case SenderMethod.NavigationDetection:
      console.log("Navigation received. Adding to session...");
      SessionData.addActivityDocument(request.payload as ActivityDocument);
      return { status: "Data written to session!" };

    case SenderMethod.InitializeSession:
      console.log("Session started");
      let email = await getUserEmail() as string;
      SessionData.instance.sessionInfo = request.payload as SessionDocument;
      SessionData.instance.sessionInfo.setEmail(email);
      return { status: "Session initialized" };

    default:
      console.warn(`Unrecognized sender method: ${request.senderMethod}`);
      return { status: `Unrecognized request type: ${request.senderMethod}` };
  }
};

/**
 * Gets the user's email
 * @returns The user's email
 */
async function getUserEmail() {
  return new Promise((resolve) => {
    chrome.identity.getProfileUserInfo((userInfo) => {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
        resolve("");
      } else if (!userInfo.email) {
        console.log("Email not available. User may not be signed in.");
        resolve("");
      } else {
        console.log(`Email retrieved: ${userInfo.email}`);
        resolve(userInfo.email);
      }
    });
  });
}