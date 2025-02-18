import { collection, addDoc } from "firebase/firestore"; 
import { db } from "./firebase.js";

async function addToDB(document) {
  try {
    const docRef = await addDoc(collection(db, "userData"), document);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {

    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");

    addToDB(request).then(() => {
      sendResponse({ status: "Data written successfully!" });
    }).catch((err) => {
      sendResponse({ status: "Error writing data: " + err.message });
    });

    return true;
  }
);
