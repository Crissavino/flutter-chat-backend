module.exports = class ChangeChatRoomNameRequest {
    constructor(request) {
        this.request = request;
    }

    trigger() {

        let success = true;

        const newChatRoomName = this.request.body.newChatRoomName;
        if (newChatRoomName == null) {
            success = false;
        }

        const chatRoom = this.request.body.chatRoomToEdit;
        if (chatRoom == null) {
            success = false;
        }

        return {
            success: success,
            chatRoom: chatRoom,
            newChatRoomName: newChatRoomName,
        }
    }

}

