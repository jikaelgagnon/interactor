import { Monitor } from "./interactions/monitor";
import ytConfig from './configs/youtube_config.json';
import tiktokConfig from './configs/tiktok_config.json';
import { ConfigLoader } from "./interactions/config";

const ytConfigLoader = new ConfigLoader(ytConfig);
const ytInteractor = new Monitor(ytConfigLoader.config);

const tiktokIDSelector = (): string => {
    let vid = document.querySelector("div.xgplayer-container.tiktok-web-player");
    if (!vid){
        console.log("no url found!");
        return "";
    }
    let id = vid.id.split("-").at(-1);
    let url = `https://tiktok.com/share/video/${id}`;
    return url;
}

// console.log(tiktokConfig);
// const tiktokConfigLoader = new ConfigLoader(tiktokConfig);
// tiktokConfigLoader.addIDSelector("/*", tiktokIDSelector);
// const tiktokInteractor = new Monitor(tiktokConfigLoader.config);