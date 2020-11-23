module.exports = class OneUserCanAddOtherUserToOneChatRoomCommandHandler {
    constructor(
        userRepository,
        chatRoomRepository,
    ) {
        this.userRepository = userRepository;
        this.chatRoomRepository = chatRoomRepository;
    }

    async handler(command) {
        const userToAdd = command.getUserToAdd();
        const chatRoomId = command.getChatRoomId();

        const user = await this.userRepository.searchUserById(userToAdd.id);
        const playerToAdd = user.player;
        const chatRoom = await this.chatRoomRepository.findById(chatRoomId);
        await this.userRepository.addChatRoomToUser(user, chatRoom);
        const chatRoomUpdate = await this.chatRoomRepository.addPlayerToChatRoom(chatRoom, playerToAdd);

        return {
            'success': true,
            'message': 'Player added to chat room',
            'chatRoom': chatRoomUpdate
        };

    }
}