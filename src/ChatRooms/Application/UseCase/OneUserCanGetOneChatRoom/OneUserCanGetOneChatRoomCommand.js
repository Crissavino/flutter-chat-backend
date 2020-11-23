module.exports = class OneUserCanGetOneChatRoomCommand {
    constructor(chatRoomId) {
        this.chatRoomId = chatRoomId
    }

    getChatRoomId() {
        return this.chatRoomId;
    }
}