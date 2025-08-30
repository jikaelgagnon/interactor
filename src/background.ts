import {
  collection,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore"
import { db } from "./background/database/firebase"
import { ActivityDocument, SessionDocument } from "./common/dbdocument"
import {
  MessageToBackground,
  MessageResponse,
} from "./common/communication/messaging"
import { SenderMethod } from "./common/communication/sender"

let USE_DB = false

interface StoredSessionData {
  sessionId: string
  sessionInfo: SessionDocument
  documents?: ActivityDocument[]
  baseUrl?: string
}

class TabSessionData {
  sessionInfo: SessionDocument
  sessionId = ""
  activityList: ActivityDocument[] = []
  baseUrl = ""
  private tabId: number | null = null

  constructor() {
    this.sessionInfo = new SessionDocument("", "")
  }

  /**
   * Sets the tab ID this session belongs to, so it can self-persist.
   */
  setTabId(tabId: number): void {
    this.tabId = tabId
  }

  getHostname(url: string): string {
    return new URL(url).hostname
  }

  setBaseUrl(url: string): void {
    try {
      this.baseUrl = this.getHostname(url)
    } catch {
      console.error("Could not parse base URL:", url)
    }
  }

  hasSameBaseUrl(url: string): boolean {
    try {
      return this.baseUrl === this.getHostname(url)
    } catch {
      return false
    }
  }

  /**
   * Adds a document to memory and persists the session to chrome.storage.local.
   */
  async appendToActivityList(document: ActivityDocument): Promise<void> {
    this.activityList.push(document)
    await this.addToChromeLocalStorage()
  }

  private async addToChromeLocalStorage(): Promise<void> {
    if (this.tabId === null) return

    const data = {
      sessionId: this.sessionId,
      sessionInfo: this.sessionInfo,
      documents: this.activityList,
    }

    await chrome.storage.local.set({ [this.tabId]: data })
  }

  async flushActivitiesListToDB(): Promise<void> {
    if (!USE_DB || !this.sessionId || this.activityList.length === 0) return
    if (!this.tabId) {
      console.error("Trying to flush a session with no tab ID")
      return
    }

    try {
      const sessionDocRef = doc(db, "userData", this.sessionId)
      await updateDoc(sessionDocRef, {
        documents: arrayUnion(...this.activityList),
      })
      console.log(
        `Flushed ${this.activityList.length} activities to session:`,
        this.sessionId,
      )
      this.activityList = []
      await this.addToChromeLocalStorage() // deletes from local storage
    } catch (e) {
      console.error("Error flushing activities:", e)
    }
  }

  async createEntryInDB(): Promise<string | null> {
    if (!USE_DB) return null

    try {
      const sessionData = {
        sessionInfo: this.sessionInfo,
        documents: [],
      }

      const docRef = await addDoc(collection(db, "userData"), sessionData)
      this.sessionId = docRef.id
      return docRef.id
    } catch (e) {
      console.error("Error creating session:", e)
      return null
    }
  }

  async setSessionEndTimeInDB(): Promise<void> {
    if (!USE_DB || !this.sessionId) return

    try {
      const sessionDocRef = doc(db, "userData", this.sessionId)
      await updateDoc(sessionDocRef, {
        "sessionInfo.endTime": new Date().toISOString(),
      })
      console.log(`Session ${this.sessionId} closed`)
    } catch (e) {
      console.error("Error closing session:", e)
    }
  }
}

class SessionManager {
  private static instance: SessionManager
  // Maps tab ID to the tab's session data
  private cachedTabSessions: Map<number, TabSessionData>

  private constructor() {
    this.cachedTabSessions = new Map()
  }

  /**
   * Loads the useDB flag from the chrome storage settings.
   * If true, activities will be logged to the database.
   */
  private static async loadUseDB(): Promise<void> {
    try {
      const { useDB }: { useDB?: boolean } =
        await chrome.storage.sync.get("useDB")
      if (useDB !== undefined) {
        USE_DB = useDB
        console.log("After loading, USE_DB =", USE_DB)
      } else {
        console.error("useDB not found in storage, using default")
        USE_DB = false
      }
    } catch (error) {
      console.error("Error detected when trying to load USE_DB:", error)
    }
  }

  /**
   * Gets the singleton instance of the session manager class
   * @returns The singleton instance
   */
  public static async getInstance(): Promise<SessionManager> {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager()
      await SessionManager.loadUseDB()
      SessionManager.instance.setupListeners()
      await SessionManager.instance.pruneStaleSessions()
    }
    return SessionManager.instance
  }

  /**
   * Flushes all data for the session with the given tabId and send it
   * to the database
   * @param tabId - the unique ID for the related tab
   */
  private async flushCloseAndRemoveSession(tabId: number): Promise<void> {
    const session = await this.loadSession(tabId)
    if (session) {
      await session.flushActivitiesListToDB()
      await session.setSessionEndTimeInDB()
      await this.removeSessionFromCache(tabId)
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
      this.flushCloseAndRemoveSession(tabId).catch((error) => {
        console.error("Error closing session:", error)
      })
    })

    chrome.runtime.onMessage.addListener(this.onMessageReceived.bind(this))

    chrome.tabs.onUpdated.addListener(this.onTabUpdate.bind(this))
  }

  private onTabUpdate(
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
  ): void {
    if (changeInfo.url) {
      this.loadSession(tabId)
        .then((session) => {
          if (session && !session.hasSameBaseUrl(changeInfo.url!)) {
            console.log("URL CHANGED... CLOSING SESSION")
            return this.flushCloseAndRemoveSession(tabId)
          }
        })
        .catch((error) => {
          console.error("Error handling tab update:", error)
        })
    }
  }

  private onMessageReceived(
    message: MessageToBackground,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: object) => void,
  ): boolean {
    const tabId = sender.tab?.id ?? -1
    console.log("message received!")
    this.handleMessage(message, tabId)
      .then((response) => {
        console.log("sending response:", response)
        sendResponse(response)
      })
      .catch((error) => {
        console.error("Error handling message:", error)
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        sendResponse({ status: "Error", message: errorMessage })
      })
    // Tell Chrome that sendResponse will be called asynchronously
    return true
  }

  /**
   * Handles messages from the content script. These are one of the following: session initialization,
   * interaction detection, or navigation detection.
   * @param request
   * @param tabId
   * @returns
   */

  private async handleMessage(
    request: MessageToBackground,
    tabId: number,
  ): Promise<MessageResponse> {
    const session: TabSessionData =
      tabId !== null
        ? await this.getOrCreateSessionForTab(tabId)
        : new TabSessionData()
    let response: MessageResponse
    console.log("handling message")

    switch (request.senderMethod) {
      case SenderMethod.InteractionDetection:
      case SenderMethod.NavigationDetection: {
        const doc = request.payload as ActivityDocument
        await session.appendToActivityList(doc)
        response = { status: "Activity added to local session." }
        break
      }

      case SenderMethod.InitializeSession: {
        console.log("initializing session from background")
        response = await this.initializeSessionInfo(
          session,
          request.payload as SessionDocument,
          tabId,
        )
        break
      }
      default: {
        response = {
          status: `Unrecognized request type: ${request.senderMethod}`,
        }
      }
    }
    return response
  }

  private async initializeSessionInfo(
    session: TabSessionData,
    payload: SessionDocument,
    tabId: number,
  ): Promise<MessageResponse> {
    const email = await this.getUserEmail()
    session.sessionInfo = payload
    session.sessionInfo.email = email
    session.setBaseUrl(session.sessionInfo.sourceURL)
    session.setTabId(tabId)
    await session.createEntryInDB()
    await this.createSessionChromeStorage(tabId, session)
    await chrome.action.setPopup({ popup: "popup.html" })

    try {
      await chrome.action.openPopup()
    } catch (error) {
      if (error instanceof Error) {
        console.warn("Could not open popup:", error.message)
      } else {
        console.warn("Could not open popup:", error)
      }
      // Optionally, you could try to open in a new window or handle differently
    }
    let { highlightElements }: { highlightElements?: boolean } =
      await chrome.storage.sync.get("highlightElements")
    if (highlightElements !== undefined) {
      console.log(`Highlight elements: ${highlightElements}`)
    } else {
      console.error("highlightElements not found in storage, using default")
      highlightElements = true
    }
    console.log("sending response")

    return { status: "Session initialized", highlight: highlightElements }
  }

  /**
   * Checks whether a session already exists for the given tab. If it does, return the
   * session data, else, create and return a new session.
   * @param tabId - unique ID for the tab
   * @returns
   */
  private async getOrCreateSessionForTab(
    tabId: number,
  ): Promise<TabSessionData> {
    let session = await this.loadSession(tabId)
    if (!session) {
      session = new TabSessionData()
      session.setTabId(tabId)
      this.cachedTabSessions.set(tabId, session)
    }
    return session
  }

  /**
   * Adds the session data to the local storage.
   * @param tabId - the unique tab ID
   * @param session - initial data for the session
   */
  private async createSessionChromeStorage(
    tabId: number,
    session: TabSessionData,
  ): Promise<void> {
    const data = {
      sessionId: session.sessionId,
      sessionInfo: session.sessionInfo,
      documents: session.activityList,
    }
    await chrome.storage.local.set({ [tabId]: data })
  }

  /**
   * Removes session data from cache and Chrome local storage
   * @param tabId - unique ID for the tab
   */
  private async removeSessionFromCache(tabId: number): Promise<void> {
    await chrome.storage.local.remove(String(tabId))
    this.cachedTabSessions.delete(tabId)
  }

  /**
   * Tries to get data from cache. Otherwise, gets it from chrome local storage.
   * Note that by the way this program is constructed, sessionCache data != Chrome storage data <==> sessionCache data is empty.
   * Thus, we can be certain that the output of this function can be trusted.
   * @param tabId
   * @returns
   */
  public async loadSession(tabId: number): Promise<TabSessionData | null> {
    if (this.cachedTabSessions.has(tabId))
      return this.cachedTabSessions.get(tabId)!

    const result = await chrome.storage.local.get(String(tabId))
    if (!result[tabId]) {
      console.error(
        "Tried to load a session that doesn't exist in local storage",
      )
      return null
    }
    const typedResult = result as Record<number, StoredSessionData>
    const storedData = typedResult[tabId]

    const session = new TabSessionData()
    session.sessionId = storedData.sessionId
    session.sessionInfo = storedData.sessionInfo
    session.activityList = storedData.documents ?? []
    session.baseUrl = storedData.baseUrl ?? ""
    session.setTabId(tabId)
    this.cachedTabSessions.set(tabId, session)
    return session
  }

  /**
   * Deletes data in Chrome local storage for tabs that no longer exist
   */
  private async pruneStaleSessions(): Promise<void> {
    const tabs = await chrome.tabs.query({})
    const openTabIds = new Set(tabs.map((t) => t.id))

    const allStored = await chrome.storage.local.get(null)
    for (const key of Object.keys(allStored)) {
      const tabId = Number(key)
      if (!openTabIds.has(tabId)) {
        await chrome.storage.local.remove(key)
      }
    }
  }

  private async getUserEmail(): Promise<string> {
    return new Promise((resolve) => {
      chrome.identity.getProfileUserInfo((userInfo) => {
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError.message)
          resolve("")
        } else {
          resolve(userInfo.email || "")
        }
      })
    })
  }
}

SessionManager.getInstance().catch((e) =>
  console.error("Error when creating instance of SessionManager:", e),
)
