import { DBDocument } from "../dbdocument"
import { SenderMethod } from "./sender"
export { MessageToBackground, MessageResponse }
/**
 * A class used to send messages from the content to the background script in a consistent format.
 */
class MessageToBackground {
  senderMethod: SenderMethod
  payload: DBDocument
  /**
   * @param senderMethod - enum type of the method sending the message
   * @param payload - the data being sent to the database
   */
  constructor(senderMethod: SenderMethod, payload: DBDocument) {
    this.senderMethod = senderMethod
    this.payload = payload
  }
}

interface MessageResponse {
  status: string
  highlight?: boolean
}
