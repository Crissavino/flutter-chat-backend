module.exports = class OneUserCanAddOtherUserToOneChatRoomCommand {
    constructor(usersToAdd, chatRoomId) {
        this.usersToAdd = usersToAdd
        this.chatRoomId = chatRoomId
    }

    getUsersToAdd() {
        return this.usersToAdd;
    }

    getChatRoomId() {
        return this.chatRoomId;
    }
}