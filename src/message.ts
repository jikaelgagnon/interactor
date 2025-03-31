import {DBDocument } from "./dbdocument";
export {Message};
/**
 * A class used to send messages from the content to the background script in a consistent format.
 */
class Message {
    sender: string;
    payload: DBDocument;
    /**
     * @param sender - the name of the method sending the message
     * @param payload - the data being sent to the database
     */
    constructor (sender: string, payload: DBDocument) {
        this.sender = sender;
        this.payload = payload;
    }
}