module.exports = class GetAllTheirChatRoomMessagesRequest {
    constructor(request) {
        this.request = request;
    }

    trigger() {

        let success = true;

        const userId = this.request.query.userId
        if (userId == null || userId === '') {
            success = false;
        }

        const chatRoomId = this.request.query.chatRoomId
        if (chatRoomId == null || chatRoomId === '') {
            success = false;
        }

        return {
            success: success,
            userId: userId,
            chatRoomId: chatRoomId,
        }
    }
}