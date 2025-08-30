import { URLPatternToSelectors, SelectorNamePair, Config } from "./config"
/**
 * A class responsible for tracking the state of the page that the user is currently on.
 */
export class PageData {
  // Current URL of the page
  currentURL!: string
  // CSS selectors being applied to the page
  selectorNamePairs!: SelectorNamePair[]
  baseURL: string
  urlPatternToSelectorData: URLPatternToSelectors

  constructor(config: Config) {
    this.urlPatternToSelectorData = config.paths
    this.baseURL = config.baseURL
  }
  /**
   * Updates the URL and the list of CSS selectors for the URL
   * @param newURL: The full url of the current page
   */
  update(newURL: string) {
    this.currentURL = newURL
    const matchingURLPatterns: string[] = this.getMatchingPatterns()
    this.selectorNamePairs = this.getSelectorNamePairs(matchingURLPatterns)
  }
  /**
   * Sets `matchPathData` to be the PathData for the URL pattern with the closet match to `this.baseURL`
   * and returns a list of all matches. Additionally, it updates whether the current path
   * includes an id.
   *
   * @returns A list of all patterns in the config that match `baseURL`
   */

  private getMatchingPatterns(): string[] {
    console.log("updating page data")

    // Get a list of all the paths that match the current URL
    const matchingURLPatterns: string[] = Object.keys(
      this.urlPatternToSelectorData,
    ).filter((path) => {
      // console.log(path);
      const pattern: URLPattern = new URLPattern(path, this.baseURL)
      const match: boolean = pattern.test(this.currentURL)
      return match
    })

    if (matchingURLPatterns.length === 0) {
      console.log("no matches found")
    }

    return matchingURLPatterns
  }

  /**
   * @param matchingURLPatterns: A list of all matching paths to the current url
   *
   * @returns A list of all selectors for the matching paths
   */

  private getSelectorNamePairs(
    matchingURLPatterns: string[],
  ): SelectorNamePair[] {
    let currentSelectorNamePairs: SelectorNamePair[] = []
    for (const urlPattern of matchingURLPatterns) {
      const selectorNamePairs: SelectorNamePair[] =
        this.urlPatternToSelectorData[urlPattern]
      currentSelectorNamePairs =
        currentSelectorNamePairs.concat(selectorNamePairs)
    }
    return currentSelectorNamePairs
  }
}
