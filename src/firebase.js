import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {firebaseConfig} from "./configs/firebaseConfig.js";

// TODO: Uncomment...
console.log(firebaseConfig);

// // Initialize Firebase
const app = initializeApp(firebaseConfig);


// // Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);