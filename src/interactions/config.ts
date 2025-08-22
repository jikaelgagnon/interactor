import { SenderMethod } from "../communication/sender";

export {SelectorNamePair, Config, ConfigLoader, PatternData, PatternSelectorMap, ExtractorData, ExtractorList};

interface SelectorNamePair{
    /**
     * An interface to map CSS selectors to human readable names
     */
    // The CSS selector
    selector: string;
    // The human readable name for the CSS selector
    name: string;
}

interface PatternSelectorMap {
    /**
     * A mapping of URL patterns to path data.
     * The URL Pattern should follow the URL Pattern API syntax.
     * These are appended to the baseURL when checking for matches.
     * Ex: baseURL: www.youtube.com, path: /shorts/:id -> www.youtube.com/shorts/:id
     */
    [path: string]: PatternData;
}

interface PatternData {
    /**
     * An interface to bundle together data in the Config for a given path pattern.
     * It contains a list of CSS selectors for the path pattern and optionally
     * an idSelector function that extracts an ID from pages with the corresponding URL
     */
    // A list of selectors and names for the page
    selectors?: SelectorNamePair[];
    // A function that extracts metadata from the page
    dataExtractor?: () => object;
}

interface Config {
    /**
     * An interface that contains all the data required to instantiate a Monitor.
     */
    // The base URL that the monitor should start at
    baseURL: string;
    // A mapping of URL patterns to path data. The URL Pattern should follow the 
    // URL Pattern API syntax. These are appended to the baseURL when checking for matches
    // Ex: baseURL: www.youtube.com, path: /shorts/:id -> www.youtube.com/shorts/:id
    paths: PatternSelectorMap;
    // Indicates whether the Monitor should be in debug mode. If true, add coloured boxes
    // around selected HTML elements
    debug?: boolean;
    // A list of event types to monitor. By default, this is just ["click"]
    events?: string[];
}

class ExtractorData {
    eventType: SenderMethod;
    urlPattern: string;
    extractor: () => object;
    constructor(activityType: SenderMethod, urlPattern: string, extractor: () => object){
        this.eventType = activityType;
        this.urlPattern = urlPattern;
        this.extractor = extractor;
    }
}

class ExtractorList {
    private extractors: ExtractorData[];
    private baseURL: string;
    constructor(extractors: ExtractorData[] = [], baseURL: string){
        this.extractors = extractors;
        this.baseURL = baseURL;
    }

    public extract(currentURL: string, eventType: SenderMethod){
        console.log(`Attempting extraction for url: ${currentURL} and event type ${eventType}`);
        let extractedData: object = {};
        this.extractors.filter(e => {
                const isCorrectActivity = (e.eventType == eventType || e.eventType == SenderMethod.Any);
                // @ts-ignore: Ignoring TypeScript error for URLPattern not found
                const p = new URLPattern(e.urlPattern, this.baseURL);
                const isURLMatch = p.test(currentURL);
                return isCorrectActivity && isURLMatch;
            }).forEach(e =>
                extractedData = {... extractedData, ... e.extractor()}
            )
        return extractedData;
    }
}

class ConfigLoader {
    public config: Config;
    public extractorList: ExtractorList;

    constructor(config: Config, extractorList: ExtractorData[] = []){
        this.config = config;
        this.extractorList = new ExtractorList(extractorList, config.baseURL);
    }
}
