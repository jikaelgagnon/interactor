import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import firebaseConfig from "./configs/firebaseConfig.json";

/**
 * Responsible for initializing and exporting an instance of the database
 */
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db: Firestore = getFirestore(app);
