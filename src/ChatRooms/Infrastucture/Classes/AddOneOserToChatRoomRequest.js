const { API_KEY } = require('../../../utils/constants');

module.exports = class AddOneUserToChatRoomRequest {
    constructor(request) {
        this.request = request;
    }

    trigger() {

        let success = true;

        const apiKey = this.request.query.apiKey
        if (apiKey !== API_KEY) {
            success = false;
        }

        const userToAdd = this.request.body.userToAdd;
        if (userToAdd == null) {
            success = false;
        }

        const chatRoomId = this.request.body.chatRoomId;
        if (chatRoomId == null) {
            success = false;
        }

        return {
            success: success,
            userToAdd: userToAdd,
            chatRoomId: chatRoomId,
        }
    }

}

