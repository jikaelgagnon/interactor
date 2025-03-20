import { Interactor } from "./interactor.js";
import { selectors } from "./configs/selectors.js";

console.log("creating interactor");
const interactor = new Interactor({cssSelectors: selectors});