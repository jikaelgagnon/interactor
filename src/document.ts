export { Document };

class Document {
    type: string;
    createdAt: Date;
    sourceState: string;
    metadata: Object;

    constructor(type: string, sourceState: string, metadata: Object) {
        this.type = type;
        this.createdAt = new Date();
        this.sourceState = sourceState;
        this.metadata = metadata;
    }
}
