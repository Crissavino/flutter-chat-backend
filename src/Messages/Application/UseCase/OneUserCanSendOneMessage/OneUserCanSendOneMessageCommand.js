module.exports = class OneUserCanSendOneMessageCommand {
    constructor(firebaseId, message) {
        this.firebaseId = firebaseId
        this.message = message
    }

    getFirebaseId() {
        return this.firebaseId;
    }

    getMessage() {
        return this.message;
    }

}