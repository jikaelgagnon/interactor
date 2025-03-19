# MarkovLogger

A Chrome extension that logs user interactions based on CSS selectors.

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