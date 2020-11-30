module.exports = class OneUserCanGetAllTheirsChatRoomsCommand {
    constructor(userId, deviceId) {
        this.userId = userId
        this.deviceId = deviceId
    }

    getUserId() {
        return this.userId;
    }

    getDeviceId() {
        return this.deviceId;
    }
}