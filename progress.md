# MarkovLogger

A Chrome extension that logs user interactions based on CSS selectors.

## Example

Given the following JSON file, the extension will track interactions on `https://youtube.com/*` for all elements
that match the corresponding selectors, it will track `#chip-container` interactions on `https://youtube.com` and it will track `#like-button[is-shorts]` and `#dislike-button[is-shorts]` on any URL of the form `https://youtube.com/shorts/:id` (for example `https://www.youtube.com/shorts/HummvDzYq6Y`).

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
Once YouTube is opened, the elements of interest will be highlighted:

![image](https://github.com/user-attachments/assets/69cd1191-5482-48fd-a223-8051bb4471a8)

Upon clicking on an element of interest, two things can happen:

1. A new entry is appended to the database indicating an _interaction_
2. A new entry is appended to the database indicating a _navigation_ (this occurs when clicking the element changes to a new page)

All of this info is combined into a single `Session` object that is added to the database once the tab is closed:

```json
{
  "documents": [
// 1. interaction: click on Subscriptions button
    {
      "clientPosition": {
        "x": 146,
        "y": 183
      },
      "content": "Subscriptions",
      "createdAt": "2025-03-19T21:49:38.552Z",
      "event": "click",
      "screenPosition": {
        "x": 146,
        "y": 304
      },
      "targetClasses": "title style-scope ytd-guide-entry-renderer",
      "targetTag": "YT-FORMATTED-STRING",
      "type": "interaction"
    },
// 2. navigation: change to Subscriptions page
    {
      "createdAt": "2025-03-19T21:49:38.558Z",
      "destinationURL": "https://www.youtube.com/feed/subscriptions",
      "type": "navigate"
    },
// 3. interaction: click on Home page
    {
      "clientPosition": {
        "x": 130,
        "y": 98
      },
      "content": "Home",
      "createdAt": "2025-03-19T21:49:47.937Z",
      "event": "click",
      "screenPosition": {
        "x": 130,
        "y": 219
      },
      "targetClasses": "title style-scope ytd-guide-entry-renderer",
      "targetTag": "YT-FORMATTED-STRING",
      "type": "interaction"
    },
// 4. navigation: change to Home page
    {
      "createdAt": "2025-03-19T21:49:47.947Z",
      "destinationURL": "https://www.youtube.com/",
      "type": "navigate"
    },
// 6. interaction: click on the Algorithms section of the homepage
    {
      "clientPosition": {
        "x": 1064,
        "y": 85
      },
      "content": "Algorithms",
      "createdAt": "2025-03-19T21:49:55.521Z",
      "event": "click",
      "screenPosition": {
        "x": 1064,
        "y": 206
      },
      "targetClasses": "style-scope yt-chip-cloud-chip-renderer",
      "targetTag": "YT-FORMATTED-STRING",
      "type": "interaction"
    },
// 7. click on a video thumbnail
    {
      "clientPosition": {
        "x": 134,
        "y": 25
      },
      "content": "",
      "createdAt": "2025-03-19T21:52:39.622Z",
      "event": "click",
      "screenPosition": {
        "x": 135,
        "y": 146
      },
      "targetClasses": "",
      "targetTag": "DIV",
      "type": "interaction"
    },
// 8. navigation: switch to the video
    {
      "createdAt": "2025-03-19T21:52:45.259Z",
      "destinationURL": "https://www.youtube.com/watch?v=ZuKIUjw_tNU",
      "type": "navigate"
    },
// 9. interaction: click on a new video
    {
      "clientPosition": {
        "x": 422,
        "y": 564
      },
      "content": "1.4M views 1 year ago",
      "createdAt": "2025-03-19T21:52:53.653Z",
      "event": "click",
      "screenPosition": {
        "x": 423,
        "y": 685
      },
      "targetClasses": "style-scope ytd-video-meta-block",
      "targetTag": "DIV",
      "type": "interaction"
    },
// 10. navigation: change the page
    {
      "createdAt": "2025-03-19T21:52:53.660Z",
      "destinationURL": "https://www.youtube.com/watch?v=gkvyYTSKTQY",
      "type": "navigate"
    }
  ]
}

```

All of this information goes to a FireBase database:

![image](https://github.com/user-attachments/assets/ce92381b-ce36-47c8-9ae5-75dee985949a)

