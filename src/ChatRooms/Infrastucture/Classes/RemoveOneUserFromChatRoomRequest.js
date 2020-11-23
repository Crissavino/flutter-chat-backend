const { API_KEY } = require('../../../utils/constants');

module.exports = class RemoveOneUserFromChatRoomRequest {
    constructor(request) {
        this.request = request;
    }

    trigger() {

        let success = true;

        const apiKey = this.request.query.apiKey
        if (apiKey !== API_KEY) {
            success = false;
        }

        const userToRemove = this.request.body.userToRemove;
        if (userToRemove == null) {
            success = false;
        }

        const chatRoomId = this.request.body.chatRoomId;
        if (chatRoomId == null) {
            success = false;
        }

        return {
            success: success,
            userToRemove: userToRemove,
            chatRoomId: chatRoomId,
        }
    }

}

