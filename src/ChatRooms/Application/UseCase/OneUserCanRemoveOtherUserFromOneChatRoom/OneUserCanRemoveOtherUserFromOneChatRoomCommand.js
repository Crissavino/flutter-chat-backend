module.exports = class OneUserCanRemoveOtherUserFromOneChatRoomCommand {
    constructor(userToRemove, chatRoomId) {
        this.userToRemove = userToRemove
        this.chatRoomId = chatRoomId
    }

    getUserToRemove() {
        return this.userToRemove;
    }

    getChatRoomId() {
        return this.chatRoomId;
    }
}