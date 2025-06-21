export {SelectorData, Config, ConfigLoader, PathData, PathMap};

interface SelectorData{
    /**
     * An interface to map CSS selectors to human readable names
     */
    // The CSS selector
    selector: string;
    // The human readable name for the CSS selector
    name: string;
}

interface PathMap {
    /**
     * A mapping of URL patterns to path data.
     * The URL Pattern should follow the URL Pattern API syntax.
     * These are appended to the baseURL when checking for matches.
     * Ex: baseURL: www.youtube.com, path: /shorts/:id -> www.youtube.com/shorts/:id
     */
    [path: string]: PathData;
}

interface PathData {
    /**
     * An interface to bundle together data in the Config for a given path pattern.
     * It contains a list of CSS selectors for the path pattern and optionally
     * an idSelector function that extracts an ID from pages with the corresponding URL
     */
    // A list of selectors and names for the page
    selectors?: SelectorData[];
    // A function that extracts an ID from the current page and returns it as a string
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
    paths: PathMap;
    // Indicates whether the Monitor should be in debug mode. If true, add coloured boxes
    // around selected HTML elements
    debug?: boolean;
    // A list of event types to monitor. By default, this is just ["click"]
    events?: string[];
}

class ConfigLoader {
    public config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    /**
     * A function that adds a data extractor for a given URL pattern. If the current URL
     * most closely matches this pattern out of all patterns in the config, then this
     * function will be called and the received ID will be included in the metadata of
     * each log that occurs on the page.
     * @param urlPattern - the pattern being matched
     * @param dataExtractor - the function to extract data
     */
    addIDSelector(urlPattern: string, dataExtractor: () => object): void {
        const paths = this.config.paths;

        if (!(urlPattern in paths)) {
            throw new Error("Trying to add ID selector to path that doesn't exist");
        }

        paths[urlPattern].dataExtractor = dataExtractor;
    }
}
