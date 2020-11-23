module.exports = class OneUserCanGetAllTheirsChatRoomsCommand {
    constructor(userId) {
        this.userId = userId
    }

    getUserId() {
        return this.userId;
    }
}