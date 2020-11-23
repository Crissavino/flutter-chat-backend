module.exports = class OneUserCanChangeTheDescriptionOfOneChatRoomCommand {
    constructor(chatRoom, newChatRoomDesc) {
        this.chatRoom = chatRoom
        this.newChatRoomDesc = newChatRoomDesc
    }

    getChatRoom() {
        return this.chatRoom;
    }

    getNewChatRoomDesc() {
        return this.newChatRoomDesc;
    }
}