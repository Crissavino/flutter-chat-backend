module.exports = class AddOneUserToChatRoomRequest {
    constructor(request) {
        this.request = request;
    }

    trigger() {

        let success = true;

        const userWhoAdd = this.request.body.userWhoAdd;
        if (userWhoAdd == null) {
            success = false;
        }

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
            userWhoAdd: userWhoAdd,
            usersToAdd: usersToAdd,
            chatRoomId: chatRoomId,
        }
    }

}

