module.exports = class ChangeChatRoomDescriptionRequest {
    constructor(request) {
        this.request = request;
    }

    trigger() {

        let success = true;

        const newChatRoomDesc = this.request.body.newChatRoomDesc;
        if (newChatRoomDesc == null) {
            success = false;
        }

        const chatRoom = this.request.body.chatRoomToEdit;
        if (chatRoom == null) {
            success = false;
        }

        return {
            success: success,
            chatRoom: chatRoom,
            newChatRoomDesc: newChatRoomDesc,
        }
    }

}

