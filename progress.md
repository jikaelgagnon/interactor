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
// 1. Click on a category on the home page
  {
    "createdAt": "2025-03-24T23:43:33.062Z",
    "type": "interaction",
    "name": "Category Button"
  },
// 2. Click on another category on the home page
  {
    "createdAt": "2025-03-24T23:43:36.647Z",
    "type": "interaction",
    "name": "Category Button"
  },
// 2. Click on a side navigation button
  {
    "createdAt": "2025-03-24T23:43:42.119Z",
    "type": "interaction",
    "name": "Side Navigation Button"
  },
// 3. This switches you to the shorts page
  {
    "createdAt": "2025-03-24T23:43:42.593Z",
    "type": "state_change",
    "destinationURL": "https://www.youtube.com/shorts/vywFu2pZVko"
  },
// 4. Scroll to next short
  {
    "createdAt": "2025-03-24T23:43:46.255Z",
    "type": "self_loop"
  },
// 4. Scroll to next short
  {
    "createdAt": "2025-03-24T23:43:47.795Z",
    "type": "self_loop"
  }
]
```

All of this information goes to a FireBase database:

![image](https://github.com/user-attachments/assets/1ea6aa69-c829-4a10-94f9-64b4d59dc851)

I'm now working on a Python script that can convert this data into a Markov model visually using NetworkX, which should be pretty straightforward:

![image](https://github.com/user-attachments/assets/b952b5f6-72da-49fe-aa89-69981e3b2f33)



