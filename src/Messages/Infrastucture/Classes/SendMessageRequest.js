module.exports = class SendMessageRequest {

    constructor(request) {
        this.request = request;
    }

    trigger() {

        let success = true;

        const firebaseId = this.request.query.firebaseId
        if (firebaseId == null || firebaseId == '') {
            success = false;
        }

        const message = this.request.body;
        if (message == null) {
            success = false;
        }

        return {
            success: success,
            firebaseId: firebaseId,
            message: message,
        }
    }
}