import { collection, addDoc, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "./database/firebase";
import { ActivityDocument, SessionDocument } from "./database/dbdocument";
import { BackgroundMessage } from "./communication/backgroundmessage";
import { SenderMethod } from "./communication/sender";


let USE_DB = true;

/**
 * A class representing session data for a specific tab, including session information,
 * associated documents, and optional initial and closing data.
 */
class SessionData {
  sessionInfo: SessionDocument;
  sessionId: string = "NO ID SET";
  documents: ActivityDocument[];

  constructor() {
    this.documents = [];
    this.sessionInfo = new SessionDocument("Cleared session");
  }

  /**
   * Immediately adds an activity document to an existing session document in Firestore.
   * @param document - The activity that just occurred.
   */
  async addActivityDocumentToDb(document: ActivityDocument): Promise<void> {
    if (!USE_DB) {
      console.log("USE_DB is set to false, not saving to database");
      return;
    }

    if (!this.sessionId) {
      console.error("Session ID not available. Cannot append activity.");
      return;
    }

    try {
      // Reference to the specific document using its ID
      const sessionDocRef = doc(db, "userData", this.sessionId);
      
      // Update the documents array by adding the new activity
      await updateDoc(sessionDocRef, {
        documents: arrayUnion(document)
      });
      
      console.log("Activity appended to session document:", this.sessionId);
    } catch (e) {
      console.log("Failed to add activity to session document");
      console.error("Error updating document: ", e);
    }
  }

  async createSessionInDb(): Promise<string | null> {
    if (!USE_DB) {
      console.log("USE_DB is set to false, not creating session in database");
      return null;
    }

    try {
      const sessionData = {
        sessionInfo: this.sessionInfo,
        documents: [] // Start with empty documents array
      };
      
      const docRef = await addDoc(collection(db, "userData"), sessionData);
      console.log("Session document created with ID: ", docRef.id);
      this.sessionId = docRef.id;
      return docRef.id;
    } catch (e) {
      console.log("Failed to create session in DB");
      console.error("Error creating session: ", e);
      return null;
    }
  }

    /**
   * Closes the session in Firestore when the tab is closed.
   */
    async closeSessionInDb(tabId: number): Promise<void> {
      const session = sessionMap.get(tabId);
      if (!USE_DB || !session || !session.sessionId) return;
    
      try {
        const sessionDocRef = doc(db, "userData", session.sessionId);
        
    
        await updateDoc(sessionDocRef, {
          "sessionInfo.endTime": new Date().toISOString(),
          active: false
        });
    
        console.log(`Session ${session.sessionId} closed`);
      } catch (e) {
        console.error("Error closing session: ", e);
      }
    }
}

// Global map to maintain a session for each tab by tab ID.
const sessionMap = new Map<number, SessionData>();

/**
 * Retrieves (or creates) the SessionData instance for the given tab ID.
 * @param tabId The ID of the tab.
 */
function getSessionForTab(tabId: number): SessionData {
  let session = sessionMap.get(tabId);
  if (!session) {
    session = new SessionData();
    sessionMap.set(tabId, session);
  }
  return session;
}

/**
 * Close the session when a tab is closed.
 */
chrome.tabs.onRemoved.addListener((tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => {
  const session = sessionMap.get(tabId);
  if (session) {
    session.closeSessionInDb(tabId);
    sessionMap.delete(tabId);
  }
});

/**
 * Handles messaging between content and background scripts.
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(sender.tab ? `from content script: ${sender.tab.url}` : "from the extension");
  console.log("message content:", message);

  // Retrieve the tabId if available
  const tabId = sender.tab && sender.tab.id !== undefined ? sender.tab.id : null;

  handleMessage(message, tabId)
    .then((response) => {
      sendResponse(response);
    })
    .catch((error) => {
      console.error("Error handling message:", error);
      sendResponse({ status: "Error", message: error.message });
    });

  // Return true to indicate asynchronous response handling.
  return true;
});

/**
 * Saves data immediately when received from a content script.
 * @param request - Message sent to the background from the content script.
 * @param tabId - The tab ID associated with this message.
 * @returns - Promise indicating the status of the handling.
 */
const handleMessage = async (request: BackgroundMessage, tabId: number | null): Promise<any> => {
  // For messages without an associated tab (e.g. from the extension), you can choose how to handle them.
  const session = tabId !== null ? getSessionForTab(tabId) : new SessionData();

  switch (request.senderMethod) {
    case SenderMethod.InteractionDetection:
      console.log("Interaction received. Adding to database immediately...");
      const interactionDoc = request.payload as ActivityDocument;
      await session.addActivityDocumentToDb(interactionDoc);
      return { status: "Data written to database!" };

    case SenderMethod.NavigationDetection:
      console.log("Navigation received. Adding to database immediately...");
      const navigationDoc = request.payload as ActivityDocument;
      await session.addActivityDocumentToDb(navigationDoc);
      return { status: "Data written to database!" };

    case SenderMethod.InitializeSession:
      console.log("Session started");
      const email = await getUserEmail() as string;
      session.sessionInfo = request.payload as SessionDocument;
      session.sessionInfo.email = email;
      
      // Create the initial session document and get its ID.
      try {
        await session.createSessionInDb();
        console.log("Session initialized for tab:", tabId);
      } catch (e) {
        console.error("Error creating session document:", e);
      }
      
      return { status: "Session initialized" };

    default:
      console.warn(`Unrecognized sender method: ${request.senderMethod}`);
      return { status: `Unrecognized request type: ${request.senderMethod}` };
  }
};

/**
 * Gets the user's email.
 * @returns The user's email.
 */
async function getUserEmail(): Promise<string> {
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