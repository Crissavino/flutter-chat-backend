module.exports = class OneUserCanGetAllTheirChatRoomMessagesCommandHandler {
    constructor(
        userRepository,
        chatRoomRepository,
        messagePlayerRepository,
        deviceMessageRepository,
    ) {
        this.userRepository = userRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.messagePlayerRepository = messagePlayerRepository;
        this.deviceMessageRepository = deviceMessageRepository;
    }

    async handler(command) {
        const userId = command.getUserId();
        const chatRoomId = command.getChatRoomId();

        const user = await this.userRepository.searchUserById(userId);
        const player = user.player;
        const chatRoom = await this.chatRoomRepository.findById(chatRoomId);
        const messages = chatRoom.messages;
        const messagesPlayer = await this.messagePlayerRepository.getMessagePlayer(messages, player)
        const deviceWhoCall = user.devices[0];
        const deviceMessages = await this.deviceMessageRepository.getDeviceMessages(messagesPlayer, deviceWhoCall)

        return {
            'success': true,
            'message': 'All chat room device messages',
            'deviceMessages': deviceMessages
        };
    }
}