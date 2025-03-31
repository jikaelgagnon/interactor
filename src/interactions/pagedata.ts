import { SelectorData, PathData } from "./config";
/**
 * A class responsible for tracking the state of the page that the user is currently on.
 */
export class PageData {
    // URL of the page
    url!: string;
    // CSS selectors being applied to the page
    selectors!: SelectorData[];
    // Indicates whether the URL contains an id. Eg. www.youtube.com/shorts/:id or www.youtube.com/watch?v=:id
    urlUsesId!: boolean;
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
    update(baseURL: string, url: string, paths: { [path: string]: PathData }){
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

    private updateMatchData(baseURL: string, paths: { [path: string]: PathData }): string[]{
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

        this.urlUsesId = closestMatch.endsWith(":id");
        this.matchPathData = paths[closestMatch];
        return matches;
    }

    /**
     * @returns Result of if it exsits`matchPathData.idSelector`, else it returns an empty string
     */

    getIDFromPage(){
        let idSelector = this.matchPathData.idSelector;
        if (idSelector){
            return idSelector();
        }
        return "";
    }

    /**
     * @param matches: A list of all matching paths to the current url
     * @param paths: A list of all the paths defined in a config
     * 
     * @returns A list of all selectors for the matching paths
     */

    private getSelectors(matches: string[], paths: { [path: string]: PathData }): SelectorData[] {
        let currentSelectors = [];
        for (const path of matches) {
            let pathData = paths[path];
            for (const selector of pathData["selectors"]) {
                currentSelectors.push(selector);
            }
        }
        console.log("current selectors:");
        console.log(currentSelectors);
        return currentSelectors;
    }

    /**
     * @param url: A URL to compare to `this.url`
     * 
     * @returns Whether the URLs are for the same state
     * 
     * @example
     * ```ts
     * this.url = "https://www.youtube.com/shorts/ic-xaIpMB1E";
     * this.checkForMatch("https://www.youtube.com/shorts/Jl9cNLJ58uA"); // returns true
     * this.checkForMatch("https://www.youtube.com/watch?v=Bt-7YiNBvLE"); // returns false
     * ```
     */

    checkForMatch(url: string): boolean {
        let curPathname = new URL(this.url).pathname;
        let otherPathname = new URL(url).pathname;
        let l1 = curPathname.split("/");
        let l2 = otherPathname.split("/");

        if (curPathname.length !== otherPathname.length) {
            return false;
        }

        let max_idx = l1.length - (this.urlUsesId ? 1 : 0);
        for (let i = 0; i < max_idx; i++) {
            if (l1[i] !== l2[i]) {
                return false;
            }
        }
        return true;
    }
}
