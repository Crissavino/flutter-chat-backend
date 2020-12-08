module.exports = class OneUserCanAddOtherUserToOneChatRoomCommandHandler {
    constructor(
        userRepository,
        chatRoomRepository,
    ) {
        this.userRepository = userRepository;
        this.chatRoomRepository = chatRoomRepository;
    }

    async handler(command) {
        const usersToAdd = command.getUsersToAdd();
        const chatRoomId = command.getChatRoomId();

        let chatRoomUpdated;
        for (const userToAdd of usersToAdd) {
            const user = await this.userRepository.searchUserById(userToAdd._id);
            const playerToAdd = user.player;
            const chatRoom = await this.chatRoomRepository.findById(chatRoomId);
            await this.userRepository.addChatRoomToUser(user, chatRoom);
            chatRoomUpdated = await this.chatRoomRepository.addPlayerToChatRoom(chatRoom, playerToAdd);
        }

        return {
            'success': true,
            'message': 'Player added to chat room',
            'chatRoom': chatRoomUpdated
        };

    }
}