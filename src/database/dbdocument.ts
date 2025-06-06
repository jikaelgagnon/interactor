import { ActivityType } from "../communication/activity";
/**
 * A class defining documents that are sent to the database from the content script
 */
class DBDocument {
    // URL at whicht the event was created
    url: string;

    constructor(url: string) {
        this.url = url;
    }
}

/**
 * A child of DBDocument that represents activities
 */

class ActivityDocument extends DBDocument{
    // The type of activity being logged. Either "state_chage", "self_loop", or "interaction"
    activityType: ActivityType;
    // Timestamp for when the document was created
    createdAt: Date;
    // Event type (eg. click, scroll, etc...)
    eventType: string
    // Metadata about the event
    metadata: Object;
    constructor(type: ActivityType, event: Event, metadata: Object, url: string) {
        super(url);
        this.activityType = type;
        this.createdAt = new Date();
        this.eventType = event.type
        this.metadata = metadata;
    }
}

/**
 * A child of DBDocument that represents the start of a session
 */

class SessionDocument extends DBDocument{
    startTime: Date;
    endTime?: Date;
    email: string = "Email not set";
    constructor(url: string) {
        super(url);
        this.startTime = new Date();
    }
    setEmail(email: string){
        this.email = email;
    }
}

export {DBDocument, ActivityDocument, SessionDocument};