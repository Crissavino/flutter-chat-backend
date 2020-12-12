module.exports = class OneUserCanGetAllTheirsChatRoomsCommandHandler {
    constructor(
        userRepository,
        chatRoomRepository,
        deviceMessageRepository
    ) {
        this.userRepository = userRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.deviceMessageRepository = deviceMessageRepository;
    }

    async handler(command) {
        const userId = command.getUserId()
        const deviceId = command.getDeviceId()
        const user = await this.userRepository.searchUserById(userId)

        const chatRooms = await this.chatRoomRepository.getUsersChatRoomsWithDevice(user.chatRooms);

        const chatRoomsModify = [];
        let i = 0
        chatRooms.filter( chatRoom => {
            chatRoom.lastMessage.messagePlayers.filter( (messagePlayer) => {
                console.log(messagePlayer.player._id)
                console.log(user.player._id)
                console.log(String(messagePlayer.player._id) === String(user.player._id))
                if (String(messagePlayer.player._id) === String(user.player._id)) {
                    messagePlayer.deviceMessages.map((deviceMessage) => {
                        if (deviceMessage && deviceMessage.device && deviceMessage.device.deviceId === deviceId) {
                            chatRoom.lastMessage = deviceMessage;
                            chatRoomsModify.push(chatRoom);
                        }
                    })
                }
            })
        })

        return {
            'success': true,
            'message': 'All users chat rooms',
            'chatRooms': chatRoomsModify
        };

    }
}