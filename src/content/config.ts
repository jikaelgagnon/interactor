import { SenderMethod } from "../common/communication/sender"
import { ExtractedMetadata } from "../common/dbdocument"

export {
  Config,
  ConfigLoader,
  URLPatternToSelectors,
  SelectorNamePair,
  ExtractorData,
  ExtractorList,
}

interface SelectorNamePair {
  selector: string
  name: string
}
type URLPatternToSelectors = Record<string, SelectorNamePair[]>

interface Config {
  /**
   * An interface that contains all the data required to instantiate a Monitor.
   */
  // The base URL that the monitor should start at
  baseURL: string
  // A mapping of URL patterns to path data. The URL Pattern should follow the
  // URL Pattern API syntax. These are appended to the baseURL when checking for matches
  // Ex: baseURL: www.youtube.com, path: /shorts/:id -> www.youtube.com/shorts/:id
  paths: URLPatternToSelectors
  // Indicates whether the Monitor should be in debug mode. If true, add coloured boxes
  // around selected HTML elements
  debug?: boolean
  // A list of event types to monitor. By default, this is just ["click"]
  events?: string[]
}

class ExtractorData {
  eventType: SenderMethod
  urlPattern: string
  extractor: () => ExtractedMetadata
  constructor(
    activityType: SenderMethod,
    urlPattern: string,
    extractor: () => ExtractedMetadata,
  ) {
    this.eventType = activityType
    this.urlPattern = urlPattern
    this.extractor = extractor
  }
}

class ExtractorList {
  private extractors: ExtractorData[]
  private baseURL: string
  constructor(extractors: ExtractorData[] = [], baseURL: string) {
    this.extractors = extractors
    this.baseURL = baseURL
  }

  public extract(
    currentURL: string,
    eventType: SenderMethod,
  ): ExtractedMetadata {
    console.log(
      `Attempting extraction for url: ${currentURL} and event type ${eventType}`,
    )
    let extractedData: ExtractedMetadata = {}
    this.extractors
      .filter((e) => {
        const isCorrectActivity: boolean =
          e.eventType == eventType || e.eventType == SenderMethod.Any
        const p: URLPattern = new URLPattern(e.urlPattern, this.baseURL)
        const isURLMatch: boolean = p.test(currentURL)
        return isCorrectActivity && isURLMatch
      })
      .forEach(
        (e) =>
          (extractedData = {
            ...(extractedData as object),
            ...(e.extractor() as object),
          }),
      )
    return extractedData
  }
}

class ConfigLoader {
  public config: Config
  public extractorList: ExtractorList

  constructor(config: Config, extractorList: ExtractorData[] = []) {
    this.config = config
    this.extractorList = new ExtractorList(extractorList, config.baseURL)
  }
}
