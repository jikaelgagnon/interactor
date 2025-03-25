export {Document};

class Document {
    constructor(type, currentURL, time, metadata) {
        this.type = type;
        this.createdAt = time;
        this.currentPath = new URL(currentURL).pathname;
        this.metadata = metadata;
    }
}    
