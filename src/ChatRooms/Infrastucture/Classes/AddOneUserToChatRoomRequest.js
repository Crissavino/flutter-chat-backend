module.exports = class AddOneUserToChatRoomRequest {
    constructor(request) {
        this.request = request;
    }

    trigger() {

        let success = true;

        const usersToAdd = this.request.body.usersToAdd;
        if (usersToAdd == null) {
            success = false;
        }

        const chatRoomId = this.request.body.chatRoomId;
        if (chatRoomId == null) {
            success = false;
        }

        return {
            success: success,
            usersToAdd: usersToAdd,
            chatRoomId: chatRoomId,
        }
    }

}

