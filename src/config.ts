interface SelectorData{
    selector: string;
    name: string;
}

interface PathData {
    selectors: SelectorData[];
    idSelector?: () => string;
}

interface Config {
    baseURL: string;
    paths: { [path: string]: PathData };
    debug?: boolean;
    interactionEvents?: string[];
}

export {SelectorData, Config, ConfigLoader, PathData};

class ConfigLoader {
    public config: Config;

    constructor(config: Config) {
        // this.validateConfig(config);
        this.config = config;
    }

    addIDSelector(urlPattern: string, idSelectorFunction: () => string): void {
        const paths = this.config.paths;

        if (!(urlPattern in paths)) {
            throw new Error("Trying to add ID selector to path that doesn't exist");
        }

        paths[urlPattern].idSelector = idSelectorFunction;
    }
}
