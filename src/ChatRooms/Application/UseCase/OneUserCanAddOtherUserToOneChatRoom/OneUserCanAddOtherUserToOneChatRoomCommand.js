module.exports = class OneUserCanAddOtherUserToOneChatRoomCommand {
    constructor(userWhoAdd, usersToAdd, chatRoomId) {
        this.userWhoAdd = userWhoAdd
        this.usersToAdd = usersToAdd
        this.chatRoomId = chatRoomId
    }

    getUserWhoAdd() {
        return this.userWhoAdd;
    }

    getUsersToAdd() {
        return this.usersToAdd;
    }

    getChatRoomId() {
        return this.chatRoomId;
    }
}