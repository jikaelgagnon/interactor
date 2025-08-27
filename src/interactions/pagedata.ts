import {SelectorNamePair, PatternData, PatternSelectorMap } from "./config";
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
    matchPathData!: PatternData; 
    currentPattern!: string;
    /**
     * Updates the state of the PageData
     * @param baseURL: The base url for the page (eg. www.youtube.com)
     * @param url: The full url of the current page
     * @param paths: A list of all the paths defined in a config
     */
    update(baseURL: string, url: string, paths: PatternSelectorMap){
        this.url = url;
        const matches = this.updateMatchData(baseURL, paths);
        this.selectors = this.getSelectors(matches, paths);
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

    private updateMatchData(baseURL: string, patterns: PatternSelectorMap): string[]{
        console.log("updating page data");
        let closestMatch = ""; // the pattern that most closely matches the current URL

        // Get a list of all the paths that match the current URL
        const matches = Object.keys(patterns).filter((path) => {
            // console.log(path);
            // @ts-ignore: Ignoring TypeScript error for URLPattern not found
            const p = new URLPattern(path, baseURL);
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

        // this.urlUsesId = closestMatch.endsWith(":id");
        this.matchPathData = patterns[closestMatch];
        return matches;
    }

    /**
     * @param matches: A list of all matching paths to the current url
     * @param paths: A list of all the paths defined in a config
     * 
     * @returns A list of all selectors for the matching paths
     */

    private getSelectors(matches: string[], paths: PatternSelectorMap): SelectorNamePair[] {
        const currentSelectors = [];
        for (const path of matches) {
            const pathData = paths[path];
            if (pathData.selectors) {
                for (const selector of pathData.selectors) {
                    currentSelectors.push(selector);
                }
            }
        }
        return currentSelectors;
    }
}
