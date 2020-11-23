module.exports = class OneUserCanChangeTheNameOfOneChatRoomCommandHandler {
    constructor(
        chatRoomRepository,
    ) {
        this.chatRoomRepository = chatRoomRepository;
    }

    async handler(command) {
        const chatRoom = command.getChatRoom();
        const newChatRoomName = command.getNewChatRoomName();

        const chatRoomUpdated = await this.chatRoomRepository.updateName(chatRoom, newChatRoomName);
        return {
            'success': true,
            'message': 'Chat Room updated',
            'npx': chatRoomUpdated
        };

    }
}