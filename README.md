# MarkovLogger

A Chrome extension that logs user interactions based on CSS selectors.

## Running

Running Webpack is necessary because Chrome extensions do not support Node.js-style imports (import statements) or environment variables (process.env) natively. Webpack bundles and transforms your code so that it works in a Chrome extension. Webpack resolves imports and bundles everything into background.bundle.js, so you only need to load one file in `manifest.json`.



After adding changes, run the following command and refresh the extension in chrome:

```bash
npx webpack
```

## Example

Given the following JSON file, the extension will track interactions on `https://youtube.com/*` for all elements
that match the corresponding selectors, it will track `#chip-container` interactions on `https://youtube.com` and it will track `#like-button[is-shorts]` and `#dislike-button[is-shorts]` on any URL of the form `https://youtube.com/shorts/:id`.

```json
{
    "baseURL": "https://www.youtube.com",
    "selectors":{
        "/*": [
            "#endpoint",
            "#logo-icon",
            "#content.ytd-rich-item-renderer",
            "ytd-compact-video-renderer",
            "ytm-shorts-lockup-view-model-v2",
            ".yt-spec-button-shape-next[aria-label=\"Next\"]"
        ],
        "": 
        [
            "#chip-container"
        ],
        "/shorts/:id": [
            "#like-button[is-shorts]",
            "#dislike-button[is-shorts]"
        ]
    }
}
```