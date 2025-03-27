export {Message};

class Message {
    type: string;
    payload: Object;
    constructor (type: string, payload: Object) {
        this.type = type;
        this.payload = payload;
    }
}