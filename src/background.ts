// // import { collection, addDoc, updateDoc, doc, arrayUnion } from "firebase/firestore";
// // import { db } from "./database/firebase";
// // import { ActivityDocument, SessionDocument } from "./database/dbdocument";
// // import { BackgroundMessage } from "./communication/backgroundmessage";
// // import { SenderMethod } from "./communication/sender";

// // let USE_DB: boolean = false;
// // async function loadUseDB() {
// //   try {
// //     const result = await chrome.storage.sync.get("useDB");
// //     USE_DB = result.useDB;
// //     console.log("After loading, USE_DB =", USE_DB); // this logs correct value
// //   } catch (error) {
// //     console.error("Using DB:", error);
// //   }
// // }

// // /**
// //  * Singleton class that manages session tracking for each browser tab.
// //  * It handles initialization, activity tracking, and cleanup when tabs are closed.
// //  */
// // class SessionManager {
// //   private static instance: SessionManager;

// //   /** A map storing active sessions keyed by their tab ID. */
// //   private sessionMap: Map<number, SessionData>;

// //   /** Private constructor to prevent direct instantiation. */
// //   private constructor() {
// //     this.sessionMap = new Map();
// //     loadUseDB().then(() => this.setupListeners());
// //   }

// //   /**
// //    * Retrieves the singleton instance of the SessionManager.
// //    * @returns The singleton SessionManager instance.
// //    */
// //   public static getInstance(): SessionManager {
// //     if (!SessionManager.instance) {
// //       SessionManager.instance = new SessionManager();
// //     }
// //     return SessionManager.instance;
// //   }

// //   /**
// //    * Sets up listeners for tab close events and incoming messages from content scripts.
// //    */
// //   private setupListeners(): void {
// //     chrome.tabs.onRemoved.addListener((tabId: number) => {
// //       const session = this.sessionMap.get(tabId);
// //       if (session) {
// //         session.closeSessionInDb();
// //         this.sessionMap.delete(tabId);
// //       }
// //     });

// //     chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
// //       const tabId = sender.tab?.id ?? null;
// //       this.handleMessage(message, tabId)
// //         .then((response) => sendResponse(response))
// //         .catch((error) => {
// //           console.error("Error handling message:", error);
// //           sendResponse({ status: "Error", message: error.message });
// //         });
// //       return true; // asynchronous response
// //     });
// //   }

// //   /**
// //    * Handles all incoming messages and routes them based on the sender method.
// //    * @param request - The message payload from the content script.
// //    * @param tabId - The ID of the tab sending the message.
// //    * @returns A response object indicating status or result.
// //    */
// //   private async handleMessage(request: BackgroundMessage, tabId: number | null): Promise<any> {
// //     const session = tabId !== null ? this.getSessionForTab(tabId) : new SessionData();

// //     switch (request.senderMethod) {
// //       case SenderMethod.InteractionDetection:
// //       case SenderMethod.NavigationDetection:
// //         const doc = request.payload as ActivityDocument;
// //         console.log("received a new activity...");
// //         console.log(doc);
// //         await session.addActivityDocumentToDb(doc);
// //         return { status: "Data written to database!" };

// //       case SenderMethod.InitializeSession:
// //         console.log("Session started");
// //         const email = await this.getUserEmail();
// //         session.sessionInfo = request.payload as SessionDocument;
// //         session.sessionInfo.email = email;
// //         await session.createSessionInDb().then(() => {
// //           chrome.action.setPopup({ popup: "ui/popup.html"});
// //           chrome.action.openPopup();
// //         });

// //         console.log("Session initialized for tab:", tabId);
// //         return { status: "Session initialized" };

// //       default:
// //         console.warn(`Unrecognized sender method: ${request.senderMethod}`);
// //         return { status: `Unrecognized request type: ${request.senderMethod}` };
// //     }
// //   }

// //   /**
// //    * Retrieves or creates a SessionData instance for the specified tab.
// //    * @param tabId - The tab ID to fetch session data for.
// //    * @returns The SessionData associated with the tab.
// //    */
// //   private getSessionForTab(tabId: number): SessionData {
// //     if (!this.sessionMap.has(tabId)) {
// //       this.sessionMap.set(tabId, new SessionData());
// //     }
// //     return this.sessionMap.get(tabId)!;
// //   }

// //   /**
// //    * Retrieves the current user's email using the Chrome Identity API.
// //    * @returns A promise resolving to the user's email, or an empty string if unavailable.
// //    */
// //   private async getUserEmail(): Promise<string> {
// //     return new Promise((resolve) => {
// //       chrome.identity.getProfileUserInfo((userInfo) => {
// //         if (chrome.runtime.lastError) {
// //           console.log(chrome.runtime.lastError.message);
// //           resolve("");
// //         } else {
// //           resolve(userInfo.email || "");
// //         }
// //       });
// //     });
// //   }
// // }

// // /**
// //  * A class representing a single session's data, including metadata and tracked activities.
// //  */
// // class SessionData {
// //   /** Information about the session, including user and timing metadata. */
// //   sessionInfo: SessionDocument;

// //   /** Firestore document ID for this session (assigned after creation). */
// //   sessionId: string = "NO ID SET";

// //   /** List of user activity documents for this session. */
// //   documents: ActivityDocument[];

// //   constructor() {
// //     this.documents = [];
// //     this.sessionInfo = new SessionDocument("", "");
// //   }

// //   /**
// //    * Appends an activity document to the current session in Firestore.
// //    * @param document - The activity data to append.
// //    */
// //   async addActivityDocumentToDb(document: ActivityDocument): Promise<void> {
// //     if (!USE_DB || !this.sessionId) {
// //       console.log("Skipping DB write");
// //       return;
// //     }

// //     try {
// //       const sessionDocRef = doc(db, "userData", this.sessionId);
// //       await updateDoc(sessionDocRef, {
// //         documents: arrayUnion(document),
// //       });
// //       console.log("Activity appended to session:", this.sessionId);
// //     } catch (e) {
// //       console.error("Error updating document:", e);
// //     }
// //   }

// //   /**
// //    * Creates a new session document in Firestore and sets the start time.
// //    * @returns The Firestore document ID, or null if creation failed.
// //    */
// //   async createSessionInDb(): Promise<string | null> {
// //     if (!USE_DB) return null;

// //     try {
// //       const sessionData = {
// //         sessionInfo: this.sessionInfo,
// //         documents: [],
// //       };

// //       const docRef = await addDoc(collection(db, "userData"), sessionData);
// //       this.sessionId = docRef.id;
// //       return docRef.id;
// //     } catch (e) {
// //       console.error("Error creating session:", e);
// //       return null;
// //     }
// //   }

// //   /**
// //    * Closes the session by updating the end time in Firestore.
// //    */
// //   async closeSessionInDb(): Promise<void> {
// //     if (!USE_DB || !this.sessionId) return;

// //     try {
// //       const sessionDocRef = doc(db, "userData", this.sessionId);
// //       await updateDoc(sessionDocRef, {
// //         "sessionInfo.endTime": new Date().toISOString(), // ensure consistent ISO format
// //       });
// //       console.log(`Session ${this.sessionId} closed`);
// //     } catch (e) {
// //       console.error("Error closing session:", e);
// //     }
// //   }
// // }

// // // Instantiate the singleton to ensure listeners are active
// // SessionManager.getInstance();

// import { collection, addDoc, updateDoc, doc, arrayUnion } from "firebase/firestore";
// import { db } from "./database/firebase";
// import { ActivityDocument, SessionDocument } from "./database/dbdocument";
// import { BackgroundMessage } from "./communication/backgroundmessage";
// import { SenderMethod } from "./communication/sender";

// let USE_DB: boolean = false;
// async function loadUseDB() {
//   try {
//     const result = await chrome.storage.sync.get("useDB");
//     USE_DB = result.useDB;
//     console.log("After loading, USE_DB =", USE_DB);
//   } catch (error) {
//     console.error("Using DB:", error);
//   }
// }

// class SessionManager {
//   private static instance: SessionManager;
//   private sessionCache: Map<number, SessionData>;

//   private constructor() {
//     this.sessionCache = new Map();
//     loadUseDB().then(() => {
//       this.setupListeners();
//       this.pruneStaleSessions();
//     });
//   }

//   public static getInstance(): SessionManager {
//     if (!SessionManager.instance) {
//       SessionManager.instance = new SessionManager();
//     }
//     return SessionManager.instance;
//   }

//   private setupListeners(): void {
//     chrome.tabs.onRemoved.addListener(async (tabId: number) => {
//       const session = await this.loadSession(tabId);
//       if (session) {
//         await session.closeSessionInDb();
//         await this.removeSession(tabId);
//       }
//     });

//     chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//       const tabId = sender.tab?.id ?? null;
//       this.handleMessage(message, tabId)
//         .then((response) => sendResponse(response))
//         .catch((error) => {
//           console.error("Error handling message:", error);
//           sendResponse({ status: "Error", message: error.message });
//         });
//       return true;
//     });
//   }

//   private async handleMessage(request: BackgroundMessage, tabId: number | null): Promise<any> {
//     const session = tabId !== null ? await this.getOrCreateSessionForTab(tabId) : new SessionData();

//     switch (request.senderMethod) {
//       case SenderMethod.InteractionDetection:
//       case SenderMethod.NavigationDetection:
//         const doc = request.payload as ActivityDocument;
//         console.log("received a new activity...");
//         console.log(doc);
//         await session.addActivityDocumentToDb(doc);
//         return { status: "Data written to database!" };

//       case SenderMethod.InitializeSession:
//         console.log("Session started");
//         const email = await this.getUserEmail();
//         session.sessionInfo = request.payload as SessionDocument;
//         session.sessionInfo.email = email;
//         await session.createSessionInDb();
//         await this.persistSession(tabId!, session);

//         chrome.action.setPopup({ popup: "ui/popup.html" });
//         chrome.action.openPopup();

//         console.log("Session initialized for tab:", tabId);
//         return { status: "Session initialized" };

//       default:
//         console.warn(`Unrecognized sender method: ${request.senderMethod}`);
//         return { status: `Unrecognized request type: ${request.senderMethod}` };
//     }
//   }

//   private async getOrCreateSessionForTab(tabId: number): Promise<SessionData> {
//     let session = await this.loadSession(tabId);
//     if (!session) {
//       session = new SessionData();
//       this.sessionCache.set(tabId, session);
//     }
//     return session;
//   }

//   private async persistSession(tabId: number, session: SessionData): Promise<void> {
//     const data = {
//       sessionId: session.sessionId,
//       sessionInfo: session.sessionInfo,
//     };
//     await chrome.storage.local.set({ [tabId]: data });
//   }

//   private async removeSession(tabId: number): Promise<void> {
//     await chrome.storage.local.remove(String(tabId));
//     this.sessionCache.delete(tabId);
//   }

//   private async loadSession(tabId: number): Promise<SessionData | null> {
//     if (this.sessionCache.has(tabId)) return this.sessionCache.get(tabId)!;

//     const result = await chrome.storage.local.get(String(tabId));
//     if (!result[tabId]) return null;

//     const session = new SessionData();
//     session.sessionId = result[tabId].sessionId;
//     session.sessionInfo = result[tabId].sessionInfo;
//     this.sessionCache.set(tabId, session);
//     return session;
//   }

//   private async pruneStaleSessions(): Promise<void> {
//     const tabs = await chrome.tabs.query({});
//     const openTabIds = new Set(tabs.map(t => t.id));

//     const allStored = await chrome.storage.local.get(null);
//     for (const key of Object.keys(allStored)) {
//       const tabId = Number(key);
//       if (!openTabIds.has(tabId)) {
//         await chrome.storage.local.remove(key);
//       }
//     }
//   }

//   private async getUserEmail(): Promise<string> {
//     return new Promise((resolve) => {
//       chrome.identity.getProfileUserInfo((userInfo) => {
//         if (chrome.runtime.lastError) {
//           console.log(chrome.runtime.lastError.message);
//           resolve("");
//         } else {
//           resolve(userInfo.email || "");
//         }
//       });
//     });
//   }
// }

// class SessionData {
//   sessionInfo: SessionDocument;
//   sessionId: string = "NO ID SET";
//   documents: ActivityDocument[];

//   constructor() {
//     this.documents = [];
//     this.sessionInfo = new SessionDocument("", "");
//   }

//   async addActivityDocumentToDb(document: ActivityDocument): Promise<void> {
//     if (!USE_DB || !this.sessionId) {
//       console.log("Skipping DB write");
//       return;
//     }

//     try {
//       const sessionDocRef = doc(db, "userData", this.sessionId);
//       await updateDoc(sessionDocRef, {
//         documents: arrayUnion(document),
//       });
//       console.log("Activity appended to session:", this.sessionId);
//     } catch (e) {
//       console.error("Error updating document:", e);
//     }
//   }

//   async createSessionInDb(): Promise<string | null> {
//     if (!USE_DB) return null;

//     try {
//       const sessionData = {
//         sessionInfo: this.sessionInfo,
//         documents: [],
//       };

//       const docRef = await addDoc(collection(db, "userData"), sessionData);
//       this.sessionId = docRef.id;
//       return docRef.id;
//     } catch (e) {
//       console.error("Error creating session:", e);
//       return null;
//     }
//   }

//   async closeSessionInDb(): Promise<void> {
//     if (!USE_DB || !this.sessionId) return;

//     try {
//       const sessionDocRef = doc(db, "userData", this.sessionId);
//       await updateDoc(sessionDocRef, {
//         "sessionInfo.endTime": new Date().toISOString(),
//       });
//       console.log(`Session ${this.sessionId} closed`);
//     } catch (e) {
//       console.error("Error closing session:", e);
//     }
//   }
// }

// SessionManager.getInstance();

import { collection, addDoc, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "./database/firebase";
import { ActivityDocument, SessionDocument } from "./database/dbdocument";
import { BackgroundMessage } from "./communication/backgroundmessage";
import { SenderMethod } from "./communication/sender";

let USE_DB: boolean = false;
async function loadUseDB() {
  try {
    const result = await chrome.storage.sync.get("useDB");
    USE_DB = result.useDB;
    console.log("After loading, USE_DB =", USE_DB);
  } catch (error) {
    console.error("Using DB:", error);
  }
}

class SessionManager {
  private static instance: SessionManager;
  private sessionCache: Map<number, SessionData>;

  private constructor() {
    this.sessionCache = new Map();
    loadUseDB().then(() => {
      this.setupListeners();
      this.pruneStaleSessions();
    });
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  private setupListeners(): void {
    chrome.tabs.onRemoved.addListener(async (tabId: number) => {
      const session = await this.loadSession(tabId);
      if (session) {
        await session.flushAllActivitiesToDb();
        await session.closeSessionInDb();
        await this.removeSession(tabId);
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
      return true;
    });
  }

  private async handleMessage(request: BackgroundMessage, tabId: number | null): Promise<any> {
    const session = tabId !== null ? await this.getOrCreateSessionForTab(tabId) : new SessionData();

    switch (request.senderMethod) {
      case SenderMethod.InteractionDetection:
      case SenderMethod.NavigationDetection:
        const doc = request.payload as ActivityDocument;
        console.log("received a new activity...");
        console.log(doc);
        session.addActivityDocument(doc);
        return { status: "Activity added to local session." };

      case SenderMethod.InitializeSession:
        console.log("Session started");
        const email = await this.getUserEmail();
        session.sessionInfo = request.payload as SessionDocument;
        session.sessionInfo.email = email;
        await session.createSessionInDb();
        await this.persistSession(tabId!, session);

        chrome.action.setPopup({ popup: "ui/popup.html" });
        chrome.action.openPopup();

        console.log("Session initialized for tab:", tabId);
        return { status: "Session initialized" };

      default:
        console.warn(`Unrecognized sender method: ${request.senderMethod}`);
        return { status: `Unrecognized request type: ${request.senderMethod}` };
    }
  }

  private async getOrCreateSessionForTab(tabId: number): Promise<SessionData> {
    let session = await this.loadSession(tabId);
    if (!session) {
      session = new SessionData();
      this.sessionCache.set(tabId, session);
    }
    return session;
  }

  private async persistSession(tabId: number, session: SessionData): Promise<void> {
    const data = {
      sessionId: session.sessionId,
      sessionInfo: session.sessionInfo,
    };
    await chrome.storage.local.set({ [tabId]: data });
  }

  private async removeSession(tabId: number): Promise<void> {
    await chrome.storage.local.remove(String(tabId));
    this.sessionCache.delete(tabId);
  }

  private async loadSession(tabId: number): Promise<SessionData | null> {
    if (this.sessionCache.has(tabId)) return this.sessionCache.get(tabId)!;

    const result = await chrome.storage.local.get(String(tabId));
    if (!result[tabId]) return null;

    const session = new SessionData();
    session.sessionId = result[tabId].sessionId;
    session.sessionInfo = result[tabId].sessionInfo;
    this.sessionCache.set(tabId, session);
    return session;
  }

  private async pruneStaleSessions(): Promise<void> {
    const tabs = await chrome.tabs.query({});
    const openTabIds = new Set(tabs.map(t => t.id));

    const allStored = await chrome.storage.local.get(null);
    for (const key of Object.keys(allStored)) {
      const tabId = Number(key);
      if (!openTabIds.has(tabId)) {
        await chrome.storage.local.remove(key);
      }
    }
  }

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

class SessionData {
  sessionInfo: SessionDocument;
  sessionId: string = "NO ID SET";
  documents: ActivityDocument[] = [];

  constructor() {
    this.sessionInfo = new SessionDocument("", "");
  }

  addActivityDocument(document: ActivityDocument): void {
    this.documents.push(document);
  }

  async flushAllActivitiesToDb(): Promise<void> {
    if (!USE_DB || !this.sessionId || this.documents.length === 0) return;

    try {
      const sessionDocRef = doc(db, "userData", this.sessionId);
      await updateDoc(sessionDocRef, {
        documents: arrayUnion(...this.documents),
      });
      console.log(`Flushed ${this.documents.length} activities to session:`, this.sessionId);
      this.documents = [];
    } catch (e) {
      console.error("Error flushing activities:", e);
    }
  }

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

  async closeSessionInDb(): Promise<void> {
    if (!USE_DB || !this.sessionId) return;

    try {
      const sessionDocRef = doc(db, "userData", this.sessionId);
      await updateDoc(sessionDocRef, {
        "sessionInfo.endTime": new Date().toISOString(),
      });
      console.log(`Session ${this.sessionId} closed`);
    } catch (e) {
      console.error("Error closing session:", e);
    }
  }
}

SessionManager.getInstance();

