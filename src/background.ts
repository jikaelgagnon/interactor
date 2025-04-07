import { collection, addDoc, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "./database/firebase";
import { ActivityDocument, SessionDocument } from "./database/dbdocument";
import { BackgroundMessage } from "./communication/backgroundmessage";
import { SenderMethod } from "./communication/sender";

let USE_DB = true;

/**
 * Singleton class that manages session tracking for each browser tab.
 * It handles initialization, activity tracking, and cleanup when tabs are closed.
 */
class SessionManager {
  private static instance: SessionManager;

  /** A map storing active sessions keyed by their tab ID. */
  private sessionMap: Map<number, SessionData>;

  /** Private constructor to prevent direct instantiation. */
  private constructor() {
    this.sessionMap = new Map();
    this.setupListeners();
  }

  /**
   * Retrieves the singleton instance of the SessionManager.
   * @returns The singleton SessionManager instance.
   */
  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * Sets up listeners for tab close events and incoming messages from content scripts.
   */
  private setupListeners(): void {
    chrome.tabs.onRemoved.addListener((tabId: number) => {
      const session = this.sessionMap.get(tabId);
      if (session) {
        session.closeSessionInDb(tabId);
        this.sessionMap.delete(tabId);
      }
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      const tabId = sender.tab?.id ?? null;
      this.handleMessage(message, tabId)
        .then((response) => sendResponse(response))
        .catch((error) => {
          console.error("Error handling message:", error);
          sendResponse({ status: "Error", message: error.message });
        });
      return true; // asynchronous response
    });
  }

  /**
   * Handles all incoming messages and routes them based on the sender method.
   * @param request - The message payload from the content script.
   * @param tabId - The ID of the tab sending the message.
   * @returns A response object indicating status or result.
   */
  private async handleMessage(request: BackgroundMessage, tabId: number | null): Promise<any> {
    const session = tabId !== null ? this.getSessionForTab(tabId) : new SessionData();

    switch (request.senderMethod) {
      case SenderMethod.InteractionDetection:
      case SenderMethod.NavigationDetection:
        const doc = request.payload as ActivityDocument;
        console.log("received a new activity...");
        await session.addActivityDocumentToDb(doc);
        return { status: "Data written to database!" };

      case SenderMethod.InitializeSession:
        console.log("Session started");
        const email = await this.getUserEmail();
        session.sessionInfo = request.payload as SessionDocument;
        session.sessionInfo.email = email;
        await session.createSessionInDb();
        console.log("Session initialized for tab:", tabId);
        return { status: "Session initialized" };

      default:
        console.warn(`Unrecognized sender method: ${request.senderMethod}`);
        return { status: `Unrecognized request type: ${request.senderMethod}` };
    }
  }

  /**
   * Retrieves or creates a SessionData instance for the specified tab.
   * @param tabId - The tab ID to fetch session data for.
   * @returns The SessionData associated with the tab.
   */
  private getSessionForTab(tabId: number): SessionData {
    if (!this.sessionMap.has(tabId)) {
      this.sessionMap.set(tabId, new SessionData());
    }
    return this.sessionMap.get(tabId)!;
  }

  /**
   * Retrieves the current user's email using the Chrome Identity API.
   * @returns A promise resolving to the user's email, or an empty string if unavailable.
   */
  private async getUserEmail(): Promise<string> {
    return new Promise((resolve) => {
      chrome.identity.getProfileUserInfo((userInfo) => {
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError.message);
          resolve("");
        } else {
          resolve(userInfo.email || "");
        }
      });
    });
  }
}

/**
 * A class representing a single session's data, including metadata and tracked activities.
 */
class SessionData {
  /** Information about the session, including user and timing metadata. */
  sessionInfo: SessionDocument;

  /** Firestore document ID for this session (assigned after creation). */
  sessionId: string = "NO ID SET";

  /** List of user activity documents for this session. */
  documents: ActivityDocument[];

  constructor() {
    this.documents = [];
    this.sessionInfo = new SessionDocument("Cleared session");
  }

  /**
   * Appends an activity document to the current session in Firestore.
   * @param document - The activity data to append.
   */
  async addActivityDocumentToDb(document: ActivityDocument): Promise<void> {
    if (!USE_DB || !this.sessionId) {
      console.log("Skipping DB write");
      return;
    }

    try {
      const sessionDocRef = doc(db, "userData", this.sessionId);
      await updateDoc(sessionDocRef, {
        documents: arrayUnion(document),
      });
      console.log("Activity appended to session:", this.sessionId);
    } catch (e) {
      console.error("Error updating document:", e);
    }
  }

  /**
   * Creates a new session document in Firestore and sets the start time.
   * @returns The Firestore document ID, or null if creation failed.
   */
  async createSessionInDb(): Promise<string | null> {
    if (!USE_DB) return null;

    try {
      const sessionData = {
        sessionInfo: this.sessionInfo,
        documents: [],
      };

      const docRef = await addDoc(collection(db, "userData"), sessionData);
      this.sessionId = docRef.id;
      return docRef.id;
    } catch (e) {
      console.error("Error creating session:", e);
      return null;
    }
  }

  /**
   * Closes the session by updating the end time in Firestore.
   * @param tabId - The ID of the tab whose session is being closed.
   */
  async closeSessionInDb(tabId: number): Promise<void> {
    if (!USE_DB || !this.sessionId) return;

    try {
      const sessionDocRef = doc(db, "userData", this.sessionId);
      await updateDoc(sessionDocRef, {
        "sessionInfo.endTime": new Date().toISOString(), // ensure consistent ISO format
      });
      console.log(`Session ${this.sessionId} closed`);
    } catch (e) {
      console.error("Error closing session:", e);
    }
  }
}

// Instantiate the singleton to ensure listeners are active
SessionManager.getInstance();
