
classDiagram


class SessionManager{
            -instance: SessionManager$
-sessionCache: Map~number, SessionData~
            -loadUseDB() Promise~void~$
+getInstance() Promise~SessionManager~$
-closeSession() Promise~void~
-setupListeners() void
-handleMessage() Promise~MessageResponse~
-getOrCreateSessionForTab() Promise~SessionData~
-createSessionChromeStorage() Promise~void~
-removeSession() Promise~void~
-loadSession() Promise~SessionData~
-pruneStaleSessions() Promise~void~
-getUserEmail() Promise~string~
        }
class SessionData{
            +sessionInfo: SessionDocument
+sessionId: string
+documents: ActivityDocument[]
+baseUrl: string
-tabId: number
            +setTabId() void
+getHostname() string
+setBaseUrl() void
+hasSameBaseUrl() boolean
+addActivityDocument() Promise~void~
-addToChromeLocalStorage() Promise~void~
+flushAllActivitiesToDb() Promise~void~
+createSessionInDb() Promise~string~
+closeSessionInDb() Promise~void~
        }
class StoredSessionData {
            <<interface>>
            +sessionId: string
+sessionInfo: SessionDocument
+documents?: ActivityDocument[]
+baseUrl?: string
            
        }
SessionManager  --  SessionManager
SessionData  --  SessionDocument
SessionData  -- "0..*" ActivityDocument
StoredSessionData  --  SessionDocument
StoredSessionData  -- "0..*" ActivityDocument
class DataManager{
            -sessions: SessionData[]
-selectedItems: Set~string~
-userEmail: string
-expandedSessions: Set~string~
            +init() Promise~void~$
+getUserEmail() Promise~string~
+loadData() Promise~void~
+getUserDataFromFirebase() Promise~FirebaseSessionData[]~
+transformFirebaseData() SessionData[]
+setupEventListeners() void
+exportSessionsToXlsx() void
+exportSessionsToJson() void
+render() void
+baseName() string
+createSessionElement() HTMLElement
+createActivityElement() HTMLElement
+addSessionEventListeners() void
+toggleSessionSelection() void
+toggleItemSelection() void
+toggleSelectAll() void
+toggleSessionExpansion() void
+isSessionExpanded() boolean
+updateUI() void
+deleteSelected() Promise~void~
+deleteUserDataFromFirebase() Promise~#123; success: boolean; error?: string; #125;~
+showStatus() void
        }
class SessionData {
            <<interface>>
            +id: string
+sessionInfo: #123; email: string; startTime: string; endTime?: string; sourceURL: string; sourceDocumentTitle: string; #125;
+activities: ActivityDocument[]
            
        }
class FirebaseSessionData {
            <<interface>>
            +id: string
+sessionInfo?: #123; email: string; startTime: string; endTime?: string; sourceURL: string; sourceDocumentTitle: string; #125;
+documents?: ActivityDocument[]
            
        }
DataManager  -- "0..*" SessionData
SessionData  -- "0..*" ActivityDocument
FirebaseSessionData  -- "0..*" ActivityDocument
class ActivityType {
        <<enumeration>>
        SelfLoop
StateChange
Interaction
Both
      }
class BackgroundMessage{
            +senderMethod: SenderMethod
+payload: DBDocument
            
        }
class MessageResponse {
            <<interface>>
            +status: string
+highlight?: boolean
            
        }
BackgroundMessage  --  SenderMethod
BackgroundMessage  --  DBDocument
class SenderMethod {
        <<enumeration>>
        InitializeSession
InteractionDetection
NavigationDetection
CloseSession
Any
      }
class DBDocument{
            +sourceURL: string
+sourceDocumentTitle: string
            
        }
class ActivityDocument{
            +activityType: string
+createdAt: string | Date
+eventType: string
+metadata?: object
            
        }
class SessionDocument{
            +startTime: Date
+endTime?: Date
+email: string
            +setEmail() void
        }
DBDocument<|--ActivityDocument
DBDocument<|--SessionDocument
class ExtractorData{
            +eventType: SenderMethod
+urlPattern: string
+extractor: () =~ object
            
        }
class ExtractorList{
            -extractors: ExtractorData[]
-baseURL: string
            +extract() object
        }
class ConfigLoader{
            +config: Config
+extractorList: ExtractorList
            
        }
class SelectorNamePair {
            <<interface>>
            +selector: string
+name: string
            
        }
class PatternData {
            <<interface>>
            +selectors?: SelectorNamePair[]
+dataExtractor?: () =~ object
            
        }
class Config {
            <<interface>>
            +baseURL: string
+paths: PatternSelectorMap
+debug?: boolean
+events?: string[]
            
        }
ExtractorData  --  SenderMethod
ExtractorList  -- "0..*" ExtractorData
ConfigLoader  --  Config
ConfigLoader  --  ExtractorList
PatternData  -- "0..*" SelectorNamePair
class Monitor{
            +interactionEvents: string[]
+highlight: boolean
+paths: PatternSelectorMap
+baseURL: string
+currentPageData: PageData
+interactionAttribute: string
+extractorList: ExtractorList
-StringToColor: #123; next: (str: string) =~ string; #125;
            -initializeMonitor() Promise~void~
-updateCurrentPageData() void
-initializeSession() Promise~void~
-bindEvents() void
-addListenersToNewMatches() void
-createStateChangeRecord() DBDocument
-createSelfLoopRecord() DBDocument
-createInteractionRecord() DBDocument
-sendMessageToBackground() Promise~MessageResponse~
-onInteractionDetection() void
-onNavigationDetection() void
        }
Monitor  --  PageData
Monitor  --  ExtractorList
class PageData{
            +url: string
+selectors: SelectorNamePair[]
+matchPathData: PatternData
+currentPattern: string
            +update() void
-updateMatchData() string[]
-getSelectors() SelectorNamePair[]
        }
PageData  -- "0..*" SelectorNamePair
PageData  --  PatternData