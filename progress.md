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
   "documents":[
//1. Click on a video
      {
         "createdAt":"2025-03-25T15:34:59.917Z",
         "type":"interaction",
         "metadata":{
            "name":"Video"
         },
         "currentPath":"/"
      },
//2. Data artifact (to be cleaned)
      {
         "createdAt":"2025-03-25T15:34:59.936Z",
         "type":"self_loop",
         "metadata":{
            "urlChange":false
         },
         "currentPath":"/"
      },
//3. Change state from / to /watch
      {
         "createdAt":"2025-03-25T15:34:59.938Z",
         "type":"state_change",
         "metadata":{
            "destinationPath":"/watch"
         },
         "currentPath":"/"
      },
//4. Click on a recommended video
      {
         "createdAt":"2025-03-25T15:35:02.832Z",
         "type":"interaction",
         "metadata":{
            "name":"Watch Page Recommended Video"
         },
         "currentPath":"/watch"
      },
//5. Self loop since we're still on the watch page
      {
         "createdAt":"2025-03-25T15:35:02.843Z",
         "type":"self_loop",
         "metadata":{
            "urlChange":true
         },
         "currentPath":"/watch"
      },
//6. Click on the YouTube logo
      {
         "createdAt":"2025-03-25T15:35:06.263Z",
         "type":"interaction",
         "metadata":{
            "name":"YouTube Logo"
         },
         "currentPath":"/watch"
      },
//7. Change state from /watch to /
      {
         "createdAt":"2025-03-25T15:35:06.271Z",
         "type":"state_change",
         "metadata":{
            "destinationPath":"/"
         },
         "currentPath":"/watch"
      },
//8. Click on a side nav button
      {
         "createdAt":"2025-03-25T15:35:11.040Z",
         "type":"interaction",
         "metadata":{
            "name":"Side Navigation Button"
         },
         "currentPath":"/"
      },
//9. Change to /shorts
      {
         "createdAt":"2025-03-25T15:35:11.581Z",
         "type":"state_change",
         "metadata":{
            "destinationPath":"/shorts/e4lKw8rsZBk"
         },
         "currentPath":"/"
      },
//10. Scroll to next short
      {
         "createdAt":"2025-03-25T15:35:14.300Z",
         "type":"self_loop",
         "metadata":{
            "urlChange":false
         },
         "currentPath":"/shorts/e4lKw8rsZBk"
      },
//11. Scroll to next short (artifact)
      {
         "createdAt":"2025-03-25T15:35:14.502Z",
         "type":"self_loop",
         "metadata":{
            "urlChange":true
         },
         "currentPath":"/shorts/TNz8IcDNfVw"
      },
//12. Scroll to next short
      {
         "createdAt":"2025-03-25T15:35:15.817Z",
         "type":"self_loop",
         "metadata":{
            "urlChange":false
         },
         "currentPath":"/shorts/TNz8IcDNfVw"
      },
//13. Scroll to next short (artifact)
      {
         "createdAt":"2025-03-25T15:35:16.007Z",
         "type":"self_loop",
         "metadata":{
            "urlChange":true
         },
         "currentPath":"/shorts/Dy5p_zjthM0"
      },
//14. Scroll to next short
      {
         "createdAt":"2025-03-25T15:35:18.246Z",
         "type":"self_loop",
         "metadata":{
            "urlChange":false
         },
         "currentPath":"/shorts/Dy5p_zjthM0"
      },
//15. Scroll to next short (artifact)
      {
         "createdAt":"2025-03-25T15:35:18.408Z",
         "type":"self_loop",
         "metadata":{
            "urlChange":true
         },
         "currentPath":"/shorts/SU2Cyb2wiGI"
      },
//16. Like a short
      {
         "createdAt":"2025-03-25T15:35:19.418Z",
         "type":"interaction",
         "metadata":{
            "name":"Shorts Like Button"
         },
         "currentPath":"/shorts/SU2Cyb2wiGI"
      },
//17. Click on YouTube logo
      {
         "createdAt":"2025-03-25T15:35:21.898Z",
         "type":"interaction",
         "metadata":{
            "name":"YouTube Logo"
         },
         "currentPath":"/shorts/SU2Cyb2wiGI"
      },
//18. State change from /shorts to /
      {
         "createdAt":"2025-03-25T15:35:21.904Z",
         "type":"state_change",
         "metadata":{
            "destinationPath":"/"
         },
         "currentPath":"/shorts/SU2Cyb2wiGI"
      }
   ],
   "sessionInfo":{
      "page":{
         "title":"YouTube",
         "origin":"https://www.youtube.com",
         "location":"/",
         "href":"https://www.youtube.com/"
      },
      "url":"https://www.youtube.com/"
   }
}
```

All of this information goes to a FireBase database:

![image](https://github.com/user-attachments/assets/6ca7d1af-9bd7-4585-8afd-2d751d34d2db)


I'm now working on a Python script that can convert this data into a Markov model visually using NetworkX, which should be pretty straightforward:

![image](https://github.com/user-attachments/assets/b952b5f6-72da-49fe-aa89-69981e3b2f33)



