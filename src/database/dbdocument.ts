import { ActivityType } from "../communication/activity";

export { DBDocument as DBDocument };
/**
 * A class defining documents that are sent to the database from the content script
 */
class DBDocument {
    // The type of activity being logged. Either "state_chage", "self_loop", or "interaction"
    type: ActivityType;
    // Timestamp for when the document was created
    createdAt: Date;
    // State from which the document was cerated
    sourceState: string;
    // Metadata about the event
    metadata: Object;
    // URL at whicht the event was created
    url: string;

    constructor(type: ActivityType, sourceState: string, metadata: Object, url: string) {
        this.type = type;
        this.createdAt = new Date();
        this.sourceState = sourceState;
        this.metadata = metadata;
        this.url = url;
    }
}
