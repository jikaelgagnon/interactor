import {
  MessageToBackground,
  MessageResponse,
} from "../common/communication/messaging"
import {
  DBDocument,
  ActivityDocument,
  SessionDocument,
  ExtractedMetadata,
} from "../common/dbdocument"
import { ConfigLoader, ExtractorList } from "./config"
import { PageData } from "./pagedata"
import { ActivityType } from "../common/communication/activity"
import { SenderMethod } from "../common/communication/sender"

/**
 * This class reads from a provided Config object and attaches listeners to the elements specified in the selectors.
 * When these elements are interacted with, or when a navigation occurs, a document is sent to the background script
 * to be appended to the database. This class is instantiated in content.ts.
 *
 * @param interactionEvents - A list of the type of events we want to monitor as interactions (eg. click, scroll, etc.). Default is click
 * @param debug - If true, highlight all selected HTML elements with coloured boxes
 * @param paths - An object mapping path patterns to their corresponding CSS selectors Path patterns are consistent with the  URL Pattern API Syntax: https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API
 * @param baseURL - Base url for the page (eg. www.youtube.com). All paths are appended to this when matching URls
 * @param currentPageData - Contains data relevant to the current page.
 * @param interactionAttribute - Attribute added to all elements being monitored
 */
export class Monitor {
  // A list of the type of events we want to monitor as interactions (eg. click, scroll, etc.). Default is click
  htmlEventsToMonitor: string[]
  // If true, highlight all selected HTML elements with coloured boxes
  enableHighlighting: boolean
  // Contains data relevant to the current page.
  currentPageData: PageData
  // Attribute added to all elements being monitored
  htmlMonitoringAttribute: string

  extractorList: ExtractorList

  constructor(configLoader: ConfigLoader) {
    const config = configLoader.config
    this.htmlEventsToMonitor = config.events ?? ["click"]
    this.enableHighlighting = true
    this.currentPageData = new PageData(config)
    this.htmlMonitoringAttribute = "monitoring-interactions"
    this.extractorList = configLoader.extractorList
    // Only initialize monitor if the URL matches and
    // the content of the page is visible
    if (window.location.origin === config.baseURL) {
      this.intitializeWhenVisible()
    }
  }

  private intitializeWhenVisible(): void {
    const runWhenVisible = () => {
      if (document.visibilityState === "visible") {
        this.initializeMonitor()
          .then(() => {
            document.removeEventListener("visibilitychange", runWhenVisible)
          })
          .catch((error) => {
            console.error("Error initializing monitor:", error)
            // Still remove listener even if there's an error
            document.removeEventListener("visibilitychange", runWhenVisible)
          })
      }
    }

    if (document.readyState === "complete") {
      runWhenVisible() // This will now be synchronous
    } else {
      window.addEventListener("load", () => {
        runWhenVisible()
      })
    }

    document.addEventListener("visibilitychange", runWhenVisible)
  }

  /**
   * Initializes the monitor
   */
  private async initializeMonitor() {
    console.log("initializing monitor")
    const currentURL: string = document.location.href
    this.currentPageData.update(currentURL)
    try {
      // Creates a new entry in the DB describing the state at the start of the session
      await this.initializeSession()
      // Binds listeners to the HTML elements specified in the config for all matching path patterns
      this.bindEvents()
    } catch (err) {
      console.error("Failed to initialize session:", err)
    }
  }

  /**
   * Creates a new entry in the DB describing the state at the start of the session
   */
  private async initializeSession(): Promise<void> {
    const currentState: DBDocument = new SessionDocument(
      this.currentPageData.currentURL,
      document.title,
    )
    console.log("Checking highlight")
    const response: MessageResponse | null = await this.sendMessageToBackground(
      SenderMethod.InitializeSession,
      currentState,
    )
    if (
      response &&
      response?.status === "Session initialized" &&
      response.highlight
    ) {
      this.enableHighlighting = response.highlight
    }
    console.log(`Highlight is set to ${this.enableHighlighting}`)
  }

  /**
   * Binds event listeners for mutations and navigation
   */

  private bindEvents(): void {
    // Whenever new content is loaded, attach observers to each HTML element that matches the selectors in the configs
    const observer: MutationObserver = new MutationObserver(() =>
      this.addListenersToNewMatches(),
    )
    // Make the mutation observer observe the entire document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    // Add an event listener to detect navigations on the page
    navigation.addEventListener("navigate", (e: NavigationEvent) =>
      this.onNavigationDetection(e),
    )
  }

  /**
   * Adds listeners to mutations (ie. newly rendered elements) and marks them with this.interacttionAttribute.
   * If debug mode is on, this will add a colourful border to these elements.
   */

  private addListenersToNewMatches(): void {
    // console.log("adding selectors");
    // console.log(`Value of highlight: ${this.highlight}`);
    // console.log("Current page data:");
    // console.log(this.currentPageData);
    this.currentPageData.selectorNamePairs.forEach((selectorNamePair) => {
      const elements: NodeListOf<HTMLElement> = document.querySelectorAll(
        `:is(${selectorNamePair.selector}):not([${this.htmlMonitoringAttribute}])`,
      )
      const name: string = selectorNamePair.name
      for (const element of elements) {
        if (this.enableHighlighting) {
          element.style.border = `2px solid ${this.StringToColor.next(name)}`
        }
        element.setAttribute(this.htmlMonitoringAttribute, "true")

        for (const ie of this.htmlEventsToMonitor) {
          element.addEventListener(
            ie,
            (e: Event) => {
              this.onInteractionDetection(element, e, name)
            },
            true,
          )
        }
      }
    })
  }

  /**
   * Sends a message to the background script.
   * @param activityType -  the type of activity (self loop or state change)
   * @param event - the HTML event that occured
   *
   * @returns A document describing self loop
   */

  private createNavigationRecord(
    activityType: ActivityType,
    event: Event,
  ): DBDocument {
    console.log("Detected self loop change event")
    const metadata = this.extractorList.extract(
      this.currentPageData.currentURL,
      SenderMethod.NavigationDetection,
    )
    console.log("printing metadata")
    console.log(metadata)
    return new ActivityDocument(
      activityType,
      event,
      metadata,
      this.currentPageData.currentURL,
      document.title,
    )
  }

  /**
   * Sends a message to the background script.
   * @param element - the element that triggered the event
   * @param name - the name of the element that triggered the callback (as defined in the config)
   * @param event - the HTML event that occured
   * @returns A document interaction self loop
   */

  private createInteractionRecord(name: string, event: Event): DBDocument {
    console.log("Detected interaction event")
    const pageSpecificData: object = {
      elementName: name,
    }
    const extractedData = this.extractorList.extract(
      this.currentPageData.currentURL,
      SenderMethod.InteractionDetection,
    )

    const metadata: ExtractedMetadata = {
      ...pageSpecificData,
      ...(extractedData as object),
    } as ExtractedMetadata

    console.log("printing metadata")
    console.log(metadata)

    return new ActivityDocument(
      ActivityType.Interaction,
      event,
      metadata,
      this.currentPageData.currentURL,
      document.title,
    )
  }

  /**
   * Sends a message to the background script.
   * @param senderMethod - the name of the function that's sending the message to the background script
   * @param payload - the data being sent to the background script
   *
   * @returns Response indicating whether the message succeeded
   */

  private async sendMessageToBackground(
    senderMethod: SenderMethod,
    payload: DBDocument,
  ): Promise<MessageResponse | null> {
    try {
      // Check if runtime is available (extension context still valid)
      if (!chrome.runtime?.id) {
        throw new Error("Extension context invalidated")
      }

      const message: MessageToBackground = new MessageToBackground(
        senderMethod,
        payload,
      )
      const response: MessageResponse =
        await chrome.runtime.sendMessage(message)

      // Chrome returns undefined if no listeners, check if that's expected
      if (response === undefined) {
        console.error("No response from background script")
      }
      return response
    } catch (error) {
      console.error("Background message failed:", error)
      // Decide whether to throw or handle gracefully based on your needs
      return null // or throw error;
    }
  }

  /**
   * Callback that creates a payload describing the interaction that occured and sends it to the background script
   * @param element - the event that triggered the callback
   * @param name - the name of the element that triggered the callback (as defined in the config)
   */

  private onInteractionDetection(
    element: Element,
    event: Event,
    name: string,
  ): void {
    console.log("interaction event detected")
    console.log(`Event detected with event type: ${event.type}`)
    console.log(`Event triggered by`, element)
    // console.log(element.innerHTML);
    // console.log(element.getHTML());
    const record: DBDocument = this.createInteractionRecord(name, event)
    this.sendMessageToBackground(
      SenderMethod.InteractionDetection,
      record,
    ).catch((error) => {
      console.error("Failed to send interaction data:", error)
    })
  }

  private isNewBaseURL(url: string | null): boolean {
    return url && this.currentPageData.currentURL
      ? url.split(".")[1] !== this.currentPageData.currentURL.split(".")[1]
      : false
  }

  /**
   * Callback that creates a payload describing the navigation that occured and sends it to the background script
   * @param navEvent - the event that triggered the callback
   */
  private onNavigationDetection(navEvent: NavigationEvent): void {
    const destUrl: string | null = navEvent.destination.url
    const baseURLChange: boolean = this.isNewBaseURL(destUrl)
    let record: DBDocument | undefined = undefined
    let sender: SenderMethod | undefined = undefined
    this.currentPageData.currentURL = navEvent.destination.url ?? "NO URL FOUND"

    console.log(`Navigation detected with event type: ${navEvent.type}`)
    if (baseURLChange) {
      console.log("URL base change detected. Closing program.")
      record = new DBDocument(this.currentPageData.currentURL, document.title)
      sender = SenderMethod.CloseSession
    } else if (navEvent.navigationType === "push") {
      console.log("Push event detected.")
      record = this.createNavigationRecord(ActivityType.StateChange, navEvent)
      sender = SenderMethod.NavigationDetection
      this.currentPageData.update(document.location.href)
    } else if (navEvent.navigationType === "replace") {
      console.log("Replace event detected.")

      record = this.createNavigationRecord(ActivityType.SelfLoop, navEvent)
      sender = SenderMethod.NavigationDetection
    }

    if (typeof record !== "undefined" && typeof sender !== "undefined") {
      this.sendMessageToBackground(sender, record).catch((error) => {
        console.error("Failed to send interaction data:", error)
      })
    }
  }

  /**
   * Generates a unique color from a given string
   * Source: https://stackoverflow.com/a/31037383
   * @returns Color hex code
   */

  private StringToColor = (function () {
    interface ColorInstance {
      stringToColorHash: Record<string, string>
      nextVeryDifferntColorIdx: number
      veryDifferentColors: string[]
    }

    let instance: ColorInstance | null = null

    return {
      next: function stringToColor(str: string): string {
        instance ??= {
          stringToColorHash: {},
          nextVeryDifferntColorIdx: 0,
          veryDifferentColors: [
            "#00FF00",
            "#0000FF",
            "#FF0000",
            "#01FFFE",
            "#FFA6FE",
            "#FFDB66",
            "#006401",
            "#010067",
            "#95003A",
            "#007DB5",
            "#FF00F6",
            "#FFEEE8",
            "#774D00",
            "#90FB92",
            "#0076FF",
            "#D5FF00",
            "#FF937E",
            "#6A826C",
            "#FF029D",
            "#FE8900",
            "#7A4782",
            "#7E2DD2",
            "#85A900",
            "#FF0056",
            "#A42400",
            "#00AE7E",
            "#683D3B",
            "#BDC6FF",
            "#263400",
            "#BDD393",
            "#00B917",
            "#9E008E",
            "#001544",
            "#C28C9F",
            "#FF74A3",
            "#01D0FF",
            "#004754",
            "#E56FFE",
            "#788231",
            "#0E4CA1",
            "#91D0CB",
            "#BE9970",
            "#968AE8",
            "#BB8800",
            "#43002C",
            "#DEFF74",
            "#00FFC6",
            "#FFE502",
            "#620E00",
            "#008F9C",
            "#98FF52",
            "#7544B1",
            "#B500FF",
            "#00FF78",
            "#FF6E41",
            "#005F39",
            "#6B6882",
            "#5FAD4E",
            "#A75740",
            "#A5FFD2",
            "#FFB167",
            "#009BFF",
            "#E85EBE",
          ],
        }

        if (!instance.stringToColorHash[str]) {
          instance.stringToColorHash[str] =
            instance.veryDifferentColors[instance.nextVeryDifferntColorIdx++]
          console.log(
            `%c The colour for ${str}`,
            `color: ${instance.stringToColorHash[str]}`,
          )
        }
        return instance.stringToColorHash[str]
      },
    }
  })()
}
