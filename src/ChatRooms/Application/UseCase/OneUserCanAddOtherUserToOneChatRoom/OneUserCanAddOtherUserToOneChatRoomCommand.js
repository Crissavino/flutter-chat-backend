module.exports = class OneUserCanAddOtherUserToOneChatRoomCommand {
    constructor(userToAdd, chatRoomId) {
        this.userToAdd = userToAdd
        this.chatRoomId = chatRoomId
    }

    getUserToAdd() {
        return this.userToAdd;
    }

    getChatRoomId() {
        return this.chatRoomId;
    }
}