import { ActivityType } from "./activity";

export { DBDocument as DBDocument };
/**
 * A class defining documents that are sent to the database from the content script
 */
class DBDocument {
    // The type of activity being logged. Either "state_chage", "self_loop", or "interaction"
    type: ActivityType;
    createdAt: Date;
    sourceState: string;
    metadata: Object;

    constructor(type: ActivityType, sourceState: string, metadata: Object) {
        this.type = type;
        this.createdAt = new Date();
        this.sourceState = sourceState;
        this.metadata = metadata;
    }
}
