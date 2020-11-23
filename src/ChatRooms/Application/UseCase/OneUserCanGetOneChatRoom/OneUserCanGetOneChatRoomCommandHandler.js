module.exports = class OneUserCanGetOneChatRoomCommandHandler {
    constructor(
        userRepository,
        chatRoomRepository,
    ) {
        this.userRepository = userRepository;
        this.chatRoomRepository = chatRoomRepository;
    }

    async handler(command) {
        const chatRoomId = command.getChatRoomId()

        const chatRoom = await this.chatRoomRepository.findById(chatRoomId)

        return {
            'success': true,
            'message': 'All users chat rooms',
            'chatRoom': chatRoom
        };

    }
}