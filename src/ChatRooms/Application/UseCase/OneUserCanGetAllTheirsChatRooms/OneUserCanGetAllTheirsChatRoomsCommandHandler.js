module.exports = class OneUserCanGetAllTheirsChatRoomsCommandHandler {
    constructor(
        userRepository,
        chatRoomRepository,
    ) {
        this.userRepository = userRepository;
        this.chatRoomRepository = chatRoomRepository;
    }

    async handler(command) {
        const userId = command.getUserId()

        const user = await this.userRepository.searchUserById(userId)

        const chatRooms = await this.chatRoomRepository.getUsersChatRooms(user.chatRooms);

        return {
            'success': true,
            'message': 'All users chat rooms',
            'chatRooms': chatRooms
        };

    }
}