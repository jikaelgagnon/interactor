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
{
  "documents": [
    // 1. Click on a video from the home page
    {
      "createdAt": "Tue Mar 25 2025 10:43:32 GMT-0400 (Eastern Daylight Time)",
      "type": "interaction",
      "metadata": {"name": "Video"},
      "currentPath": "/"
    },
    // 2. Extra data to be removed (no URL change)
    {
      "createdAt": "Tue Mar 25 2025 10:43:32 GMT-0400 (Eastern Daylight Time)",
      "type": "self_loop",
      "metadata": {"urlChange": false},
      "currentPath": "/"
    },
    // 3. State change to the /watch page
    {
      "createdAt": "Tue Mar 25 2025 10:43:32 GMT-0400 (Eastern Daylight Time)",
      "type": "state_change",
      "metadata": {"destinationPath": "/watch"},
      "currentPath": "/watch"
    },
    // 4. Click on a recommended video
    {
      "createdAt": "Tue Mar 25 2025 10:43:37 GMT-0400 (Eastern Daylight Time)",
      "type": "interaction",
      "metadata": {"name": "Watch Page Recommended Video"},
      "currentPath": "/watch"
    },
    // 5. Self loop due to URL change
    {
      "createdAt": "Tue Mar 25 2025 10:43:37 GMT-0400 (Eastern Daylight Time)",
      "type": "self_loop",
      "metadata": {"urlChange": true},
      "currentPath": "/watch"
    },
    // 6. Click on another recommended video
    {
      "createdAt": "Tue Mar 25 2025 10:43:41 GMT-0400 (Eastern Daylight Time)",
      "type": "interaction",
      "metadata": {"name": "Watch Page Recommended Video"},
      "currentPath": "/watch"
    },
    // 7. Self loop due to URL change
    {
      "createdAt": "Tue Mar 25 2025 10:43:41 GMT-0400 (Eastern Daylight Time)",
      "type": "self_loop",
      "metadata": {"urlChange": true},
      "currentPath": "/watch"
    },
    // 8. Click on another recommended video
    {
      "createdAt": "Tue Mar 25 2025 10:43:44 GMT-0400 (Eastern Daylight Time)",
      "type": "interaction",
      "metadata": {"name": "Watch Page Recommended Video"},
      "currentPath": "/watch"
    },
    // 9. Self loop due to URL change
    {
      "createdAt": "Tue Mar 25 2025 10:43:44 GMT-0400 (Eastern Daylight Time)",
      "type": "self_loop",
      "metadata": {"urlChange": true},
      "currentPath": "/watch"
    },
    // 10. Click on YouTube logo
    {
      "createdAt": "Tue Mar 25 2025 10:43:49 GMT-0400 (Eastern Daylight Time)",
      "type": "interaction",
      "metadata": {"name": "YouTube Logo"},
      "currentPath": "/watch"
    },
    // 11. State change to the home page
    {
      "createdAt": "Tue Mar 25 2025 10:43:49 GMT-0400 (Eastern Daylight Time)",
      "type": "state_change",
      "metadata": {"destinationPath": "/"},
      "currentPath": "/"
    },
    // 12. Click on side navigation button
    {
      "createdAt": "Tue Mar 25 2025 10:43:55 GMT-0400 (Eastern Daylight Time)",
      "type": "interaction",
      "metadata": {"name": "Side Navigation Button"},
      "currentPath": "/"
    },
    // 13. State change to the shorts page
    {
      "createdAt": "Tue Mar 25 2025 10:43:56 GMT-0400 (Eastern Daylight Time)",
      "type": "state_change",
      "metadata": {"destinationPath": "/shorts/G7oVnN19Vss"},
      "currentPath": "/shorts/G7oVnN19Vss"
    },
    // 14. Like a YT short
    {
      "createdAt": "Tue Mar 25 2025 10:44:00 GMT-0400 (Eastern Daylight Time)",
      "type": "interaction",
      "metadata": {"name": "Shorts Like Button"},
      "currentPath": "/shorts/G7oVnN19Vss"
    },
    // 15. Scroll to the next short (no URL change)
    {
      "createdAt": "Tue Mar 25 2025 10:44:02 GMT-0400 (Eastern Daylight Time)",
      "type": "self_loop",
      "metadata": {"urlChange": false},
      "currentPath": "/shorts/G7oVnN19Vss"
    },
    // 16. Scroll to the next short (URL change)
    {
      "createdAt": "Tue Mar 25 2025 10:44:02 GMT-0400 (Eastern Daylight Time)",
      "type": "self_loop",
      "metadata": {"urlChange": true},
      "currentPath": "/shorts/qyooRIwV-M0"
    },
    // 17. Scroll again (no URL change)
    {
      "createdAt": "Tue Mar 25 2025 10:44:09 GMT-0400 (Eastern Daylight Time)",
      "type": "self_loop",
      "metadata": {"urlChange": false},
      "currentPath": "/shorts/qyooRIwV-M0"
    },
    // 18. Scroll again (URL change)
    {
      "createdAt": "Tue Mar 25 2025 10:44:09 GMT-0400 (Eastern Daylight Time)",
      "type": "self_loop",
      "metadata": {"urlChange": true},
      "currentPath": "/shorts/xknfogEvLsI"
    },
    // 19. Click on YouTube logo
    {
      "createdAt": "Tue Mar 25 2025 10:44:10 GMT-0400 (Eastern Daylight Time)",
      "type": "interaction",
      "metadata": {"name": "YouTube Logo"},
      "currentPath": "/shorts/xknfogEvLsI"
    },
    // 20. State change to the home page
    {
      "createdAt": "Tue Mar 25 2025 10:44:10 GMT-0400 (Eastern Daylight Time)",
      "type": "state_change",
      "metadata": {"destinationPath": "/"},
      "currentPath": "/"
    }
  ],
  // Info about the session
  "sessionInfo": {
    "page": {
      "title": "YouTube",
      "origin": "https://www.youtube.com",
      "location": "/",
      "href": "https://www.youtube.com/"
    },
    "url": "https://www.youtube.com/"
  }
}
```

All of this information goes to a FireBase database:

![image](https://github.com/user-attachments/assets/6ca7d1af-9bd7-4585-8afd-2d751d34d2db)


I'm now working on a Python script that can convert this data into a Markov model visually using NetworkX, which should be pretty straightforward:

![image](https://github.com/user-attachments/assets/b952b5f6-72da-49fe-aa89-69981e3b2f33)



