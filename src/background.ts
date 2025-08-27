import { collection, addDoc, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "./database/firebase";
import { ActivityDocument, SessionDocument } from "./database/dbdocument";
import { BackgroundMessage } from "./communication/backgroundmessage";
import { SenderMethod } from "./communication/sender";

let USE_DB: boolean = false;

class SessionManager {
  private static instance: SessionManager;
  private sessionCache: Map<number, SessionData>;

  private constructor() {
    this.sessionCache = new Map();
    this.loadUseDB().then(() => {
      this.setupListeners();
      this.pruneStaleSessions();
    });
  }

  /**
   * Loads the useDB flag from the chrome storage settings.
   * If true, activities will be logged to the database.
   */
  private async loadUseDB(): Promise<any> {
    try {
      const result = await chrome.storage.sync.get("useDB");
      USE_DB = result.useDB;
      console.log("After loading, USE_DB =", USE_DB);
    } catch (error) {
      console.error("Using DB:", error);
    }
  }

  /**
   * Gets the singleton instance of the session manager class
   * @returns The singleton instance
   */
  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * Flushes all data for the session with the given tabId and send it
   * to the database
   * @param tabId - the unique ID for the related tab
   */
  private async closeSession(tabId: number): Promise<any> {
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
    chrome.tabs.onRemoved.addListener(async (tabId: number) => {
      this.closeSession(tabId);
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

    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
      if (changeInfo.url) {
        const session = await this.loadSession(tabId);
        if (session && !session.hasSameBaseUrl(changeInfo.url)) {
          console.log("URL CHANGED... CLOSING SESSION");
          await this.closeSession(tabId);
        }
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

  private async handleMessage(request: BackgroundMessage, tabId: number | null): Promise<any> {
    const session = tabId !== null ? await this.getOrCreateSessionForTab(tabId) : new SessionData();

    switch (request.senderMethod) {
      case SenderMethod.InteractionDetection:
      case SenderMethod.NavigationDetection:
        const doc = request.payload as ActivityDocument;
        session.addActivityDocument(doc);
        return { status: "Activity added to local session." };

      case SenderMethod.InitializeSession:
        const email = await this.getUserEmail();
        session.sessionInfo = request.payload as SessionDocument;
        session.sessionInfo.email = email;
        session.setBaseUrl(session.sessionInfo.sourceURL);
        session.setTabId(tabId!);
        await session.createSessionInDb();
        await this.createSessionChromeStorage(tabId!, session);
        chrome.action.setPopup({ popup: "popup.html" });
        chrome.action.openPopup();
        const result = await chrome.storage.sync.get("highlightElements");
        console.log(`Highlight elements: ${result.highlightElements}`)

        return { status: "Session initialized", highlight: result.highlightElements};

      default:
        return { status: `Unrecognized request type: ${request.senderMethod}` };
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

    const session = new SessionData();
    session.sessionId = result[tabId].sessionId;
    session.sessionInfo = result[tabId].sessionInfo;
    session.documents = result[tabId].documents || [];
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
  sessionId: string = "NO ID SET";
  documents: ActivityDocument[] = [];
  baseUrl: string = "";
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
    } catch (e) {
      console.warn("Could not parse base URL:", url);
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
  addActivityDocument(document: ActivityDocument): void {
    this.documents.push(document);
    this.addToChromeLocalStorage();
  }

  private addToChromeLocalStorage(): void {
    if (this.tabId === null) return;

    const data = {
      sessionId: this.sessionId,
      sessionInfo: this.sessionInfo,
      documents: this.documents,
    };

    chrome.storage.local.set({ [this.tabId]: data });
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
      this.addToChromeLocalStorage(); // persist cleared docs
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
