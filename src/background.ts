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

  private async closeSession(tabId: number): Promise<any>{
        const session = await this.loadSession(tabId);
        if (session) {
          await session.flushAllActivitiesToDb();
          await session.closeSessionInDb();
          await this.removeSession(tabId);
    }
  }

  private setupListeners(): void {
    chrome.tabs.onRemoved.addListener(async (tabId: number) => {
      this.closeSession(tabId)
    })

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
      console.log("tab update detected");
      console.log(changeInfo);
      if (changeInfo.url) {
        console.log("url found");
        const session = await this.loadSession(tabId);
        if (session && !session.hasSameBaseUrl(changeInfo.url)) {
          console.log(`Base URL changed — closing session for tab ${tabId}`);
          await this.closeSession(tabId);
        }
      }
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

      // case SenderMethod.InitializeSession:
      //   console.log("Session started");
      //   const email = await this.getUserEmail();
      //   session.sessionInfo = request.payload as SessionDocument;
      //   session.sessionInfo.email = email;
      //   await session.createSessionInDb();
      //   await this.persistSession(tabId!, session);

      //   chrome.action.setPopup({ popup: "ui/popup.html" });
      //   chrome.action.openPopup();

      //   console.log("Session initialized for tab:", tabId);
      //   return { status: "Session initialized" };
      
      case SenderMethod.InitializeSession:
        console.log("Session started");
        const email = await this.getUserEmail();
        session.sessionInfo = request.payload as SessionDocument;
        session.sessionInfo.email = email;
        session.setBaseUrl(session.sessionInfo.sourceURL);
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
  baseUrl: string = ""; // <-- new field

  constructor() {
    this.sessionInfo = new SessionDocument("", "");
  }

  getHostname(url: string): string{
    return new URL(url).hostname;
  }

  setBaseUrl(url: string): void {
    try {
      const parsed = new URL(url);
      this.baseUrl = this.getHostname(url);
    } catch (e) {
      console.warn("Could not parse base URL:", url);
    }
  }

  hasSameBaseUrl(url: string): boolean {
    try {
      console.log(`comparing ${this.baseUrl} to ${url}`);
      const isMatch = this.baseUrl === this.getHostname(url);
      console.log(`is match: ${isMatch}`)
      return isMatch;
    } catch {
      return false;
    }
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

