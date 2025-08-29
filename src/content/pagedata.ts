import {URLPatternToSelectors, SelectorNamePair, Config} from "./config";
/**
 * A class responsible for tracking the state of the page that the user is currently on.
 */
export class PageData {
    // URL of the page
    url!: string;
    // CSS selectors being applied to the page
    selectors!: SelectorNamePair[];
    // The URL pattern, CSS selectors, and optionally a function for getting page ID 
    // for the pattern that most closely matches this.url
    // Ex: If the url is www.youtube.com/shorts/ABC and the patterns are /* and /shorts/:id, then 
    // matchPathData would contain the PathData for /shorts/:id, since its a closer match to the URL.
    currentPattern!: string;
    baseURL: string;
    urlPatternToSelectorData: URLPatternToSelectors;

    constructor(config: Config){
        this.urlPatternToSelectorData = config.paths;
        this.baseURL = config.baseURL;
    }
    /**
     * Updates the state of the PageData
     * @param newURL: The full url of the current page
     */
    update(newURL: string){
        this.url = newURL;
        const matches = this.updateMatchData();
        this.selectors = this.getSelectorNamePairs(matches);
    }
    /**
     * Sets `matchPathData` to be the PathData for the URL pattern with the closet match to `baseURL`
     * and returns a list of all matches. Additionally, it updates whether the current path
     * includes an id.
     * @param baseURL: The base url for the page (eg. www.youtube.com)
     * @param patterns: A list of all the paths defined in a config
     * 
     * @returns A list of all patterns in the config that match `baseURL`
     */

    private updateMatchData(): string[]{
        console.log("updating page data");
        let closestMatch = ""; // the pattern that most closely matches the current URL

        // Get a list of all the paths that match the current URL
        const matches = Object.keys(this.urlPatternToSelectorData).filter((path) => {
            // console.log(path);
            const p = new URLPattern(path, this.baseURL);
            const match = p.test(this.url);
            // Closest match is the longest pattern that matches the current URL
            if (match && path.length > closestMatch.length) {
                closestMatch = path;
            }
            return match;
        });

        this.currentPattern = closestMatch;

        if (matches.length === 0) {
            console.log("no matches found");
        }

        return matches;
    }

    /**
     * @param matchingPaths: A list of all matching paths to the current url
     * 
     * @returns A list of all selectors for the matching paths
     */

    private getSelectorNamePairs(matchingPaths: string[]): SelectorNamePair[] {
        const currentSelectorNamePairs = [];
        for (const path of matchingPaths) {
            const selectorNamePairs = this.urlPatternToSelectorData[path];
            for (const pair of selectorNamePairs) {
                currentSelectorNamePairs.push(pair);
            }
        }
        return currentSelectorNamePairs;
    }
}
