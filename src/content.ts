import { Monitor } from "./interactions/monitor";
import ytConfig from './configs/youtube_config.json';
import tiktokConfig from './configs/tiktok_config.json';
import linkedinConfig from './configs/linkedin_config.json';
import { ConfigLoader } from "./interactions/config";

const ytConfigLoader = new ConfigLoader(ytConfig);


// NOTE: This shit doesn't work! Likely has to do with the weird way things are updated... Need to make 
// that very clear first, then hopefully the bug will arise. Note that issue is that the data is displayed at
// the wrong time somehow...

// Gets a list of links from the home page
// const getHomepageVideos = (): object => {
//     console.log("---- EXTRACTING HOMEPAGE LINKS ---");
//     const contentDivs = Array.from(document.querySelectorAll('#content.ytd-rich-item-renderer'))
//     const links = contentDivs.map(contentDiv => {
//     // Get the direct anchor child
//         const anchor = contentDiv.querySelector(':scope > yt-lockup-view-model a');
//         return anchor;
//     }).filter(x => x != null).map(x => (x as HTMLAnchorElement).href);
//     const titles = contentDivs.map(contentDiv => {
//         const span = contentDiv.querySelector('h3 a span.yt-core-attributed-string');
//         return span?.textContent?.trim() ?? '';
//     }
//     )
//     // console.log("Printing the first 5 links");
//     // console.table(links.slice(0,5));
//     // console.log("Printing the first 5 titles");
//     // console.table(titles.slice(0,5));
//     return {"links": links, "titles": titles};
// }

const getHomepageVideos = (): object => {
    // console.log("---- EXTRACTING HOMEPAGE LINKS ---");
    const contentDivs = Array.from(document.querySelectorAll('#content.ytd-rich-item-renderer'))
        .filter(div => {
            // Check if element is actually visible
            const rect = div.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && 
                   getComputedStyle(div).visibility !== 'hidden';
        });
    
    const links = contentDivs.map(contentDiv => {
        // Get the direct anchor child
        const anchor = contentDiv.querySelector(':scope > yt-lockup-view-model a');
        return anchor;
    }).filter(x => x != null).map(x => (x as HTMLAnchorElement).href);
    
    const titles = contentDivs.map(contentDiv => {
        const span = contentDiv.querySelector('h3 a span.yt-core-attributed-string');
        return span?.textContent?.trim() ?? '';
    });
    
    return {"links": links, "titles": titles};
}


const getRecommendedVideos = (): object => {
    console.log("---- EXTRACTING RECOMMENDED LINKS ---");
    const contentDivs = Array.from(document.querySelectorAll('yt-lockup-view-model')).filter(div => {
            // Check if element is actually visible
            const rect = div.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && 
                   getComputedStyle(div).visibility !== 'hidden';
        });
    const links = contentDivs.map(contentDiv => {
    // Get the direct anchor child
        const anchor = contentDiv.querySelector(':scope > yt-lockup-view-model a');
        return anchor;
    }).filter(x => x != null).map(x => (x as HTMLAnchorElement).href);
    const titles = contentDivs.map(contentDiv => {
        const span = contentDiv.querySelector('h3 a span.yt-core-attributed-string');
        return span?.textContent?.trim() ?? '';
    }
    )
    // console.log("Printing the first 5 links");
    // console.table(links.slice(0,5));
    // console.log("Printing the first 5 titles");
    // console.table(titles.slice(0,5));
    return {"links": links, "titles": titles};
}


ytConfigLoader.injectExtractor("/*", getHomepageVideos);
ytConfigLoader.injectExtractor("/watch?v=*", getRecommendedVideos);
const ytInteractor = new Monitor(ytConfigLoader.config);

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