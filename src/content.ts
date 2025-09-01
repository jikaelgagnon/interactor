import { Monitor } from "./content/monitor"
import ytConfig from "./content/configs/youtube_config.json"
import personalConfig from "./content/configs/personal_site.json"
// import tiktokConfig from './configs/tiktok_config.json';
// import linkedinConfig from './configs/linkedin_config.json';
import { ConfigLoader, ExtractorData } from "./content/config"
// import { ActivityType } from "./communication/activity";
import { SenderMethod } from "./common/communication/sender"
import { ExtractedMetadata } from "./common/dbdocument"

const getHomepageVideos = (): ExtractedMetadata => {
  // console.log("---- EXTRACTING HOMEPAGE LINKS ---");
  const contentDivs = Array.from(
    document.querySelectorAll("#content.ytd-rich-item-renderer"),
  ).filter((div) => {
    // Check if element is actually visible
    const rect = div.getBoundingClientRect()
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      getComputedStyle(div).visibility !== "hidden"
    )
  })

  const videos = contentDivs
    .map((contentDiv) => {
      // Get the direct anchor child
      const anchor = contentDiv.querySelector(
        ":scope > yt-lockup-view-model a",
      ) as HTMLAnchorElement
      const span = contentDiv.querySelector(
        "h3 a span.yt-core-attributed-string",
      )

      return {
        link: anchor?.href ?? "",
        title: span?.textContent?.trim() ?? "",
      }
    })
    .filter((video) => video.link !== "")
  const metadata: ExtractedMetadata = { videos: videos }
  return metadata
}

const getRecommendedVideos = (): ExtractedMetadata => {
  console.log("---- EXTRACTING RECOMMENDED LINKS ----")
  const contentDivs = Array.from(
    document.querySelectorAll("yt-lockup-view-model"),
  ).filter((div) => {
    // Check if element is actually visible
    const rect = div.getBoundingClientRect()
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      getComputedStyle(div).visibility !== "hidden"
    )
  })

  const videos: ExtractedMetadata = contentDivs
    .map((contentDiv) => {
      // Get the anchor with the video link
      const anchor = contentDiv.querySelector(
        'a[href^="/watch"]',
      )! as HTMLAnchorElement
      const span = contentDiv.querySelector(
        "h3 a span.yt-core-attributed-string",
      )!

      return {
        link: anchor?.href ?? "",
        title: span?.textContent?.trim() ?? "",
      }
    })
    .filter((video) => video.link !== "")

  // console.log("Printing the first 5 videos");
  // console.table(videos.slice(0,5));
  const metadata: ExtractedMetadata = { videos: videos }
  return metadata
}

const extractors = [
  new ExtractorData(SenderMethod.InteractionDetection, "/", getHomepageVideos),
  new ExtractorData(
    SenderMethod.InteractionDetection,
    "/watch?v=*",
    getRecommendedVideos,
  ),
]

const ytConfigLoader = new ConfigLoader(ytConfig, extractors)

new Monitor(ytConfigLoader)

const personalConfigLoader = new ConfigLoader(personalConfig, [])
new Monitor(personalConfigLoader)
window.dispatchEvent(new CustomEvent('contentScriptReady'));
// const tiktokIDSelector = (): object => {
//     let vid = document.querySelector("div.xgplayer-container.tiktok-web-player");
//     if (!vid){
//         console.log("no url found!");
//         return {};
//     }
//     let id = vid.id.split("-").at(-1);
//     let url = `https://tiktok.com/share/video/${id}`;
//     return {
//         "uniqueURL": url
//     };
// }

// console.log(tiktokConfig);
// const tiktokConfigLoader = new ConfigLoader(tiktokConfig);
// tiktokConfigLoader.injectExtractor("/*", tiktokIDSelector);
// const tiktokInteractor = new Monitor(tiktokConfigLoader.config);

// // console.log(tiktokConfig);
// const linkedinConfigLoader = new ConfigLoader(linkedinConfig);
// const linkedinInteractor = new Monitor(linkedinConfigLoader.config);
