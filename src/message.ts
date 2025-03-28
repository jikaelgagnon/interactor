export {Message};

class Message {
    sender: string;
    payload: Object;
    constructor (sender: string, payload: Object) {
        this.sender = sender;
        this.payload = payload;
    }
}