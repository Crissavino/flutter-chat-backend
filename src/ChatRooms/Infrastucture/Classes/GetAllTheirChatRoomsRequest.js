module.exports = class GetAllTheirChatRoomsRequest {
    constructor(request) {
        this.request = request;
    }

    trigger() {

        let success = true;

        const userId = this.request.query.userId
        if (userId === null || userId === '') {
            success = false;
        }

        const deviceId = this.request.query.deviceId
        if (deviceId == null || deviceId === '') {
            success = false;
        }

        return {
            success: success,
            userId: userId,
            deviceId: deviceId,
        }
    }
}