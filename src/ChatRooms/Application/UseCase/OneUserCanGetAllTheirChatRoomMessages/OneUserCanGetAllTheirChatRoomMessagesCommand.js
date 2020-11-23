module.exports = class OneUserCanGetAllTheirChatRoomMessagesCommand {
    constructor(userId, chatRoomId) {
        this.userId = userId
        this.chatRoomId = chatRoomId
    }

    getUserId() {
        return this.userId;
    }

    getChatRoomId() {
        return this.chatRoomId;
    }
}