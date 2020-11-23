module.exports = class GetOneChatRoomRequest {
    constructor(request) {
        this.request = request;
    }

    trigger() {

        let success = true;

        const chatRoomId = this.request.query.chatRoomId
        if (chatRoomId == null || chatRoomId == '') {
            success = false;
        }

        return {
            success: success,
            chatRoomId: chatRoomId,
        }
    }
}