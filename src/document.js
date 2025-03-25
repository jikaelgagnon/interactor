export {Document};

class Document {
    constructor(type, sourceState, metadata) {
        this.type = type;
        this.createdAt = new Date();
        this.sourceState = sourceState;
        this.metadata = metadata;
    }
}    
