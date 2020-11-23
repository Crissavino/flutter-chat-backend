module.exports = class OneUserCanSendOneMessageCommandHandler {
    constructor(
        userRepository,
        playerRepository,
        chatRoomRepository,
        messageRepository,
        messagePlayerRepository,
        deviceMessageRepository,
        deviceRepository
    ) {
        this.userRepository = userRepository;
        this.playerRepository = playerRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.messageRepository = messageRepository;
        this.messagePlayerRepository = messagePlayerRepository;
        this.deviceMessageRepository = deviceMessageRepository;
        this.deviceRepository = deviceRepository;
    }

    async handler(command) {
        const firebaseId = command.getFirebaseId()
        const message = command.getMessage()
        const chatRoomId = message.chatRoom;
        const senderUser = await this.userRepository.searchUserByFirebaseId(firebaseId);
        const senderPlayer = await this.playerRepository.searchById(senderUser.player);
        const senderUserDevice = await this.deviceRepository.findDeviceById(senderUser.devices[0]);
        const chatRoom = await this.chatRoomRepository.findById(chatRoomId);
        const players = await this.chatRoomRepository.getChatRoomPlayers(chatRoom.players);

        await this.createMessage(senderUser, message, chatRoom, players, senderUserDevice.id);

        const allMyDeviceMessages = await this.deviceMessageRepository.getMyChatRoomDeviceMessages(chatRoom, senderUserDevice);

        return {
            'success': true,
            'message': 'Message Created',
            'allMyDeviceMessages': allMyDeviceMessages
        };
    }

    async createMessage(senderUser, messageData, chatRoom, players, senderUserDeviceId) {
        let allMyDeviceMessages;
        const newMessage = await this.messageRepository.createMessage(senderUser, messageData, chatRoom);

        for (const player of players) {
            const newMessagePlayer = await this.messagePlayerRepository.createMessagePlayer(senderUser, newMessage, player, chatRoom);

            for (const device of player.devices) {

                const alldeviceMessages = await this.deviceMessageRepository.createDeviceMessage(senderUser, newMessagePlayer, device, chatRoom, newMessage, player);

                // if (senderUserDeviceId == device.id) {
                //     allMyDeviceMessages = alldeviceMessages;
                // }
            }

        }

        return allMyDeviceMessages;

    }
}