import { Interactor } from "./interactor.js";
import configData from './configs/youtube_config.json';  // Assuming config.json is in the same directory
import { ConfigLoader } from "./config.js";
// Example usage:
const configLoader = new ConfigLoader(configData);
console.log("PRINTING CONFIG");
console.log(configLoader.config);  // This will print the contents of the config.json file

// let config = new ConfigLoader("configs/youtube_config.json");
// console.log(config);
// console.log("creating interactor");
const interactor = new Interactor(configLoader.config);