module.exports = class OneUserCanChangeTheDescriptionOfOneChatRoomCommandHandler {
    constructor(
        chatRoomRepository,
    ) {
        this.chatRoomRepository = chatRoomRepository;
    }

    async handler(command) {
        const chatRoom = command.getChatRoom();
        const newChatRoomDesc = command.getNewChatRoomDesc();

        const chatRoomUpdated = await this.chatRoomRepository.updateDesc(chatRoom, newChatRoomDesc);

        return {
            'success': true,
            'message': 'Chat Room updated',
            'chatRoom': chatRoomUpdated
        };

    }
}