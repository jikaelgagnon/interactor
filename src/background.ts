import { collection, addDoc, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "./database/firebase";
import { ActivityDocument, SessionDocument } from "./database/dbdocument";
import { BackgroundMessage, MessageResponse } from "./communication/backgroundmessage";
import { SenderMethod } from "./communication/sender";

let USE_DB = false;

interface StoredSessionData {
  sessionId: string;
  sessionInfo: SessionDocument;
  documents?: ActivityDocument[];
  baseUrl?: string;
}

class SessionManager {
  private static instance: SessionManager;
  private sessionCache: Map<number, SessionData>;

  private constructor() {
    this.sessionCache = new Map();
  }

  /**
   * Loads the useDB flag from the chrome storage settings.
   * If true, activities will be logged to the database.
   */
  private static async loadUseDB(): Promise<void> {
    try {
      const { useDB }: {useDB?: boolean} = await chrome.storage.sync.get("useDB");
      if (useDB !== undefined) {
        USE_DB = useDB;
        console.log("After loading, USE_DB =", USE_DB);
      } else {
        console.error("useDB not found in storage, using default");
        USE_DB = false;
      }
    } catch (error) {
      console.error("Error detected when trying to load USE_DB:", error);
    }
  }

  /**
   * Gets the singleton instance of the session manager class
   * @returns The singleton instance
   */
  public static async getInstance(): Promise<SessionManager> {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
      await SessionManager.loadUseDB();
      SessionManager.instance.setupListeners();
      await SessionManager.instance.pruneStaleSessions();
    }
    return SessionManager.instance;
  }

  /**
   * Flushes all data for the session with the given tabId and send it
   * to the database
   * @param tabId - the unique ID for the related tab
   */
  private async closeSession(tabId: number): Promise<void> {
    const session = await this.loadSession(tabId);
    if (session) {
      await session.flushAllActivitiesToDb();
      await session.closeSessionInDb();
      await this.removeSession(tabId);
    }
  }

  /**
   * Listens for removed tabs, updated tabs, and messages.
   * 
   * `onRemoved`: When the tab is removed, close the session
   * 
   * `onUpdated`: When the tab is updated, check whether the hostname
   * still matches the initial hostname of the session. If not, close the session.
   * 
   * `onMessage`: Handles messages received from the content script (ie. data about user activities)..
   */

  private setupListeners(): void {
    chrome.tabs.onRemoved.addListener((tabId: number) => {
      this.closeSession(tabId).catch(error => {
        console.error("Error closing session:", error);
      });
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      const tabId = sender.tab?.id ?? null;
      console.log("message received!");
      this.handleMessage(message as BackgroundMessage, tabId)
        .then((response) => {
          console.log("sending response:", response);
          sendResponse(response)})
        .catch((error) => {
          console.error("Error handling message:", error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          sendResponse({ status: "Error", message: errorMessage });
        });
      // Tell Chrome that sendResponse will be called asynchronously
      return true;
    });

    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
      if (changeInfo.url) {
        this.loadSession(tabId)
          .then(session => {
            if (session && !session.hasSameBaseUrl(changeInfo.url!)) {
              console.log("URL CHANGED... CLOSING SESSION");
              return this.closeSession(tabId);
            }
          })
          .catch(error => {
            console.error("Error handling tab update:", error);
          });
      }
    });
  }

  /**
   * Handles messages from the content script. These are one of the following: session initialization, 
   * interaction detection, or navigation detection.
   * @param request 
   * @param tabId 
   * @returns 
   */

  private async handleMessage(request: BackgroundMessage, tabId: number | null): Promise<MessageResponse> {
    const session = tabId !== null ? await this.getOrCreateSessionForTab(tabId) : new SessionData();

    console.log("handling message");

    switch (request.senderMethod) {
      case SenderMethod.InteractionDetection:
      case SenderMethod.NavigationDetection: {
        const doc = request.payload as ActivityDocument;
        await session.addActivityDocument(doc);
        console.log("sending response");
        return { status: "Activity added to local session." };
      }

      case SenderMethod.InitializeSession:{
        const email = await this.getUserEmail();
        session.sessionInfo = request.payload as SessionDocument;
        session.sessionInfo.email = email;
        session.setBaseUrl(session.sessionInfo.sourceURL);
        session.setTabId(tabId!);
        await session.createSessionInDb();
        await this.createSessionChromeStorage(tabId!, session);
        await chrome.action.setPopup({ popup: "popup.html" });
  
        try {
          await chrome.action.openPopup();
        } catch (error) {
          if (error instanceof Error) {
            console.warn("Could not open popup:", error.message);
          } else {
            console.warn("Could not open popup:", error);
          }
          // Optionally, you could try to open in a new window or handle differently
        }
        let {highlightElements} : {highlightElements?: boolean} = await chrome.storage.sync.get("highlightElements");
        if (highlightElements !== undefined) {
          console.log(`Highlight elements: ${highlightElements}`)
        } else {
          console.error("highlightElements not found in storage, using default");
          highlightElements = true;
        }
        console.log("sending response");

        return { status: "Session initialized", highlight: highlightElements};
      }
      default:{
        console.log("sending response");
        return { status: `Unrecognized request type: ${request.senderMethod}` };
      }
    }
  }

  /**
   * Checks whether a session already exists for the given tab. If it does, return the
   * session data, else, create and return a new session.
   * @param tabId - unique ID for the tab
   * @returns 
   */
  private async getOrCreateSessionForTab(tabId: number): Promise<SessionData> {
    let session = await this.loadSession(tabId);
    if (!session) {
      session = new SessionData();
      session.setTabId(tabId);
      this.sessionCache.set(tabId, session);
    }
    return session;
  }

  /**
   * Adds the session data to the local storage.
   * @param tabId - the unique tab ID 
   * @param session - initial data for the session
   */
  private async createSessionChromeStorage(tabId: number, session: SessionData): Promise<void> {
    const data = {
      sessionId: session.sessionId,
      sessionInfo: session.sessionInfo,
      documents: session.documents,
    };
    await chrome.storage.local.set({ [tabId]: data });
  }

  /**
   * Removes session data from cache and Chrome local storage
   * @param tabId - unique ID for the tab
   */
  private async removeSession(tabId: number): Promise<void> {
    await chrome.storage.local.remove(String(tabId));
    this.sessionCache.delete(tabId);
  }

  /**
   * Tries to get data from cache. Otherwise, gets it from chrome local storage.
   * Note that by the way this program is constructed, sessionCache data != Chrome storage data <==> sessionCache data is empty.
   * Thus, we can be certain that the output of this function can be trusted.
   * @param tabId 
   * @returns 
   */
  private async loadSession(tabId: number): Promise<SessionData | null> {
    if (this.sessionCache.has(tabId)) return this.sessionCache.get(tabId)!;

    const result = await chrome.storage.local.get(String(tabId));
    if (!result[tabId]) return null;
    const typedResult = result as Record<number, StoredSessionData>;
    const storedData = typedResult[tabId];

    const session = new SessionData();
    session.sessionId = storedData.sessionId;
    session.sessionInfo = storedData.sessionInfo;
    session.documents = storedData.documents ?? [];
    session.baseUrl = storedData.baseUrl ?? "";
    session.setTabId(tabId);
    this.sessionCache.set(tabId, session);
    return session;
  }

  /**
   * Deletes data in Chrome local storage for tabs that no longer exist
   */
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
  sessionId = "NO ID SET";
  documents: ActivityDocument[] = [];
  baseUrl = "";
  private tabId: number | null = null;

  constructor() {
    this.sessionInfo = new SessionDocument("", "");
  }

  /**
   * Sets the tab ID this session belongs to, so it can self-persist.
   */
  setTabId(tabId: number): void {
    this.tabId = tabId;
  }

  getHostname(url: string): string {
    return new URL(url).hostname;
  }

  setBaseUrl(url: string): void {
    try {
      this.baseUrl = this.getHostname(url);
    } catch {
      console.error("Could not parse base URL:", url);
    }
  }

  hasSameBaseUrl(url: string): boolean {
    try {
      return this.baseUrl === this.getHostname(url);
    } catch {
      return false;
    }
  }

  /**
   * Adds a document to memory and persists the session to chrome.storage.local.
   */
  async addActivityDocument(document: ActivityDocument): Promise<void> {
    this.documents.push(document);
    await this.addToChromeLocalStorage();
  }

  private async addToChromeLocalStorage(): Promise<void> {
    if (this.tabId === null) return;

    const data = {
      sessionId: this.sessionId,
      sessionInfo: this.sessionInfo,
      documents: this.documents,
    };

    await chrome.storage.local.set({ [this.tabId]: data });
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
      await this.addToChromeLocalStorage(); // persist cleared docs
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

SessionManager.getInstance().catch((e) => console.error("Error when creating instance of SessionManager:", e));
