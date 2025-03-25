# MarkovLogger

A Chrome extension that logs user interactions based on CSS selectors.

## Example

Given the following JSON file, the extension will track interactions on `https://youtube.com/*` for all elements
that match the corresponding selectors, it will track interactions with the "Side Navigation Button", which is represented by elements matching the selector "#endpoint" on `https://youtube.com` and it will track `#like-button[is-shorts]` and `#dislike-button[is-shorts]` on any URL of the form `https://youtube.com/shorts/:id` (for example `https://www.youtube.com/shorts/HummvDzYq6Y`).

```json
export const selectors = {
    "baseURL": "https://www.youtube.com",
    "interactions": {
        "/*": [
            {"selector": "#endpoint", "name": "Side Navigation Button"},
            {"selector": "#logo-icon", "name": "YouTube Logo"},
            {"selector": "ytd-rich-grid-media.style-scope.ytd-rich-item-renderer", "name": "Video"},
            {"selector": "ytm-shorts-lockup-view-model-v2", "name": "Shorts on Miniplayer"},
            {"selector": ".yt-spec-button-shape-next[aria-label=\"Next\"]", "name": "Next Button"},
            {"selector": "#chip-container.style-scope.yt-chip-cloud-chip-renderer", "name": "Category Button"}
        ],
        "": [
            // {"selector": "#chip-container", "name": "chip-container"}
        ],
        "/shorts/:id": [
            {"selector": "#like-button[is-shorts]", "name": "Shorts Like Button"},
            {"selector": "#dislike-button[is-shorts]", "name": "Shorts Dislike Button"}
        ],
        "/watch?v=:id": [
            {"selector": "ytd-compact-video-renderer.style-scope.ytd-item-section-renderer", "name": "Watch Page Recommended Video"},
            {"selector": "ytd-toggle-button-renderer#dislike-button", "name": "Comment Dislike Button"},
            {"selector": "ytd-toggle-button-renderer#like-button", "name": "Comment Like Button"},
        ]
    }
}
```
Once YouTube is opened, the elements of interest will be highlighted:

![image](https://github.com/user-attachments/assets/2d78ab01-192e-4488-ba06-756535598827)


Upon clicking on an element of interest, three things can happen:

1. A new entry is appended to the database indicating an _interaction_
2. A new entry is appended to the database indicating a _state change_
3. A new entry is appended to the database indicating a _self loop_

All of this info is combined into a single `Session` object that is added to the database once the tab is closed:

```json
[
    {
        "createdAt": "2025-03-25T16:11:27.645Z",
        "type": "interaction",
        "metadata": {
            "name": "Video"
        },
        "sourceState": "/"
    },
    {
        "createdAt": "2025-03-25T16:11:27.662Z",
        "type": "self_loop",
        "metadata": {
            "urlChange": false
        },
        "sourceState": "/"
    },
    {
        "createdAt": "2025-03-25T16:11:27.664Z",
        "type": "state_change",
        "metadata": {
            "destinationState": "/watch"
        },
        "sourceState": "/"
    },
    {
        "createdAt": "2025-03-25T16:11:39.764Z",
        "type": "interaction",
        "metadata": {
            "name": "Watch Page Recommended Video"
        },
        "sourceState": "/watch"
    },
    {
        "createdAt": "2025-03-25T16:11:39.779Z",
        "type": "self_loop",
        "metadata": {
            "urlChange": true
        },
        "sourceState": "/watch"
    },
    {
        "createdAt": "2025-03-25T16:11:46.822Z",
        "type": "interaction",
        "metadata": {
            "name": "YouTube Logo"
        },
        "sourceState": "/watch"
    },
    {
        "createdAt": "2025-03-25T16:11:46.834Z",
        "type": "state_change",
        "metadata": {
            "destinationState": "/"
        },
        "sourceState": "/watch"
    },
    {
        "createdAt": "2025-03-25T16:11:49.468Z",
        "type": "interaction",
        "metadata": {
            "name": "Side Navigation Button"
        },
        "sourceState": "/"
    },
    {
        "createdAt": "2025-03-25T16:11:50.073Z",
        "type": "state_change",
        "metadata": {
            "destinationState": "/shorts/_Z1dMmGBBCo"
        },
        "sourceState": "/"
    },
    {
        "createdAt": "2025-03-25T16:11:53.686Z",
        "type": "self_loop",
        "metadata": {
            "urlChange": false
        },
        "sourceState": "/shorts"
    },
    {
        "createdAt": "2025-03-25T16:11:53.872Z",
        "type": "self_loop",
        "metadata": {
            "urlChange": true
        },
        "sourceState": "/shorts"
    },
    {
        "createdAt": "2025-03-25T16:11:59.403Z",
        "type": "self_loop",
        "metadata": {
            "urlChange": false
        },
        "sourceState": "/shorts"
    },
    {
        "createdAt": "2025-03-25T16:11:59.564Z",
        "type": "self_loop",
        "metadata": {
            "urlChange": true
        },
        "sourceState": "/shorts"
    },
    {
        "createdAt": "2025-03-25T16:13:01.218Z",
        "type": "self_loop",
        "metadata": {
            "urlChange": false
        },
        "sourceState": "/shorts"
    },
    {
        "createdAt": "2025-03-25T16:13:01.354Z",
        "type": "self_loop",
        "metadata": {
            "urlChange": true
        },
        "sourceState": "/shorts"
    },
    {
        "createdAt": "2025-03-25T16:13:02.585Z",
        "type": "self_loop",
        "metadata": {
            "urlChange": false
        },
        "sourceState": "/shorts"
    },
    {
        "createdAt": "2025-03-25T16:13:02.710Z",
        "type": "self_loop",
        "metadata": {
            "urlChange": true
        },
        "sourceState": "/shorts"
    },
    {
        "createdAt": "2025-03-25T16:13:04.037Z",
        "type": "self_loop",
        "metadata": {
            "urlChange": false
        },
        "sourceState": "/shorts"
    },
    {
        "createdAt": "2025-03-25T16:13:04.209Z",
        "type": "self_loop",
        "metadata": {
            "urlChange": true
        },
        "sourceState": "/shorts"
    },
    {
        "createdAt": "2025-03-25T16:13:05.358Z",
        "type": "interaction",
        "metadata": {
            "name": "YouTube Logo"
        },
        "sourceState": "/shorts"
    },
    {
        "createdAt": "2025-03-25T16:13:05.364Z",
        "type": "state_change",
        "metadata": {
            "destinationState": ""
        },
        "sourceState": "/shorts"
    },
    {
        "createdAt": "2025-03-25T16:13:19.620Z",
        "type": "interaction",
        "metadata": {
            "name": "Video"
        },
        "sourceState": "/"
    },
    {
        "createdAt": "2025-03-25T16:13:19.628Z",
        "type": "state_change",
        "metadata": {
            "destinationState": "/watch"
        },
        "sourceState": "/"
    }
]
```

All of this information goes to a FireBase database:

![image](https://github.com/user-attachments/assets/ab61d6f9-4634-4ae6-836b-dc6b4b17150b)



I'm now working on a Python script that can convert this data into a Markov model visually using NetworkX, which should be pretty straightforward:

![image](https://github.com/user-attachments/assets/b952b5f6-72da-49fe-aa89-69981e3b2f33)



