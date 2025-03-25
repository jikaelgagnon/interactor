export {Document};

class Document {
    constructor(type, currentURL, metadata) {
        this.type = type;
        this.createdAt = Date();
        this.currentPath = new URL(currentURL).pathname;
        this.metadata = metadata;
    }
}    
