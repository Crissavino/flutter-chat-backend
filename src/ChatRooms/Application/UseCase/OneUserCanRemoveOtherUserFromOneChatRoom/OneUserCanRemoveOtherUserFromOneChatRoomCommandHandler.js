module.exports = class OneUserCanRemoveOtherUserFromOneChatRoomCommandCommandHandler {
    constructor(
        userRepository,
        chatRoomRepository,
    ) {
        this.userRepository = userRepository;
        this.chatRoomRepository = chatRoomRepository;
    }

    async handler(command) {
        const userToRemove = command.getUserToRemove();
        const chatRoomId = command.getChatRoomId();

        const user = await this.userRepository.searchUserById(userToRemove.id);
        const playerToRemove = user.player;
        const chatRoom = await this.chatRoomRepository.findById(chatRoomId);
        await this.userRepository.removeChatRoomFromUser(user, chatRoom);
        const chatRoomUpdated = await this.chatRoomRepository.removePlayerFromChatRoom(chatRoom, playerToRemove);

        return {
            'success': true,
            'message': 'Player removed from chat room',
            'chatRoom': chatRoomUpdated
        };

    }
}