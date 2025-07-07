import { SelectorData, PathData, PathMap } from "./config";
/**
 * A class responsible for tracking the state of the page that the user is currently on.
 */
export class PageData {
    // URL of the page
    url!: string;
    // CSS selectors being applied to the page
    selectors!: SelectorData[];
    // The URL pattern, CSS selectors, and optionally a function for getting page ID 
    // for the pattern that most closely matches this.url
    // Ex: If the url is www.youtube.com/shorts/ABC and the patterns are /* and /shorts/:id, then 
    // matchPathData would contain the PathData for /shorts/:id, since its a closer match to the URL.
    matchPathData!: PathData; 
    /**
     * Updates the state of the PageData
     * @param baseURL: The base url for the page (eg. www.youtube.com)
     * @param url: The full url of the current page
     * @param paths: A list of all the paths defined in a config
     */
    update(baseURL: string, url: string, paths: PathMap){
        this.url = url;
        let matches = this.updateMatchData(baseURL, paths);
        this.selectors = this.getSelectors(matches, paths);
    }
    /**
     * Sets `matchPathData` to be the PathData for the URL pattern with the closet match to `baseURL`
     * and returns a list of all matches. Additionally, it updates whether the current path
     * includes an id.
     * @param baseURL: The base url for the page (eg. www.youtube.com)
     * @param paths: A list of all the paths defined in a config
     * 
     * @returns A list of all paths in the config that match `baseURL`
     */

    private updateMatchData(baseURL: string, paths: PathMap): string[]{
        let closestMatch = ""; // the pattern that most closely matches the current URL

        // Get a list of all the paths that match the current URL
        const matches = Object.keys(paths).filter((path) => {
            console.log(path);
            // @ts-ignore: Ignoring TypeScript error for URLPattern not found
            const p = new URLPattern(path, baseURL);
            const match = p.test(this.url);
            // Closest match is the longest pattern that matches the current URL
            if (match && path.length > closestMatch.length) {
                closestMatch = path;
            }
            return match;
        });

        if (matches.length === 0) {
            console.log("no matches found");
        }

        // this.urlUsesId = closestMatch.endsWith(":id");
        this.matchPathData = paths[closestMatch];
        return matches;
    }

    /**
     * @returns Result of if it exsits`matchPathData.idSelector`, else it returns an empty string
     */

    extractData(): object{
        return this.matchPathData.dataExtractor?.() || {};
    }

    /**
     * @param matches: A list of all matching paths to the current url
     * @param paths: A list of all the paths defined in a config
     * 
     * @returns A list of all selectors for the matching paths
     */

    private getSelectors(matches: string[], paths: PathMap): SelectorData[] {
        let currentSelectors = [];
        for (const path of matches) {
            let pathData = paths[path];
            if (pathData["selectors"]) {
                for (const selector of pathData["selectors"]) {
                    currentSelectors.push(selector);
                }
            }
        }
        return currentSelectors;
    }
}
