module.exports = class OneUserCanChangeTheNameOfOneChatRoomCommand {
    constructor(chatRoom, newChatRoomName) {
        this.chatRoom = chatRoom
        this.newChatRoomName = newChatRoomName
    }

    getChatRoom() {
        return this.chatRoom;
    }

    getNewChatRoomName() {
        return this.newChatRoomName;
    }
}