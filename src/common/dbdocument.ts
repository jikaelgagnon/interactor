import { ActivityType } from "./communication/activity";
/**
 * A class defining documents that are sent to the database from the content script
 */
class DBDocument {
    // URL at whicht the event was created
    sourceURL: string;
    sourceDocumentTitle: string;

    constructor(url: string, title: string) {
        this.sourceURL = url;
        this.sourceDocumentTitle = title;
    }
}

/**
 * A child of DBDocument that represents activities
 */

class ActivityDocument extends DBDocument{
    // The type of activity being logged. Either "state_chage", "self_loop", or "interaction"
    activityType: ActivityType | string;
    // Timestamp for when the document was created
    createdAt: Date | string;
    // Event type (eg. click, scroll, etc...)
    eventType: string
    // Metadata about the event
    metadata?: object;
    constructor(type: ActivityType, event: Event, metadata: object, url: string, title: string) {
        super(url, title);
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
    email = "Email not set";
    constructor(url: string, title: string) {
        super(url, title);
        this.startTime = new Date();
    }
    setEmail(email: string){
        this.email = email;
    }
}

export {DBDocument, ActivityDocument, SessionDocument};