interface PathData {
    selectors: { selector: string, name: string }[];
    idSelector?: (url: string) => string;
}

interface Config {
    baseURL: string;
    paths: { [path: string]: PathData };
}

export { ConfigLoader };

class ConfigLoader {
    public config: Config;

    constructor(config: Config) {
        // this.validateConfig(config);
        this.config = config;
    }

    addIDSelector(urlPattern: string, idSelectorFunction: (url: string) => string): void {
        const paths = this.config.paths;

        if (!(urlPattern in paths)) {
            throw new Error("Trying to add ID selector to path that doesn't exist");
        }

        paths[urlPattern].idSelector = idSelectorFunction;
    }
}
