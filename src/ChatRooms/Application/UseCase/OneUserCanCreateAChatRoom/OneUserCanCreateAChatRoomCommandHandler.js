module.exports = class OneUserCanCreateAChatRoomCommandHandler {
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
        const currentUser = command.getCurrentUser()
        const usersToAddToGroup = command.getUsersToAddToGroup()
        const groupName = command.getGroupName()

        const user = await this.userRepository.searchUserById(currentUser);
        const playerOwner = await this.playerRepository.searchById(user.player);
        const playersIds = [];
        usersToAddToGroup.forEach((user) => {
            if (user.player) {
                playersIds.push(user.player);
            }
        });
        let playersToAdd = await this.playerRepository.getPlayersToAddToGroup(playersIds);
        playersToAdd.push(playerOwner);

        const chatRoom = await this.chatRoomRepository.createChatRoom(groupName, playersToAdd, playerOwner, this.userRepository);

        const messageData = {
            time: Date.now(),
            text: user.fullName + ' ha creado el grupo: ' + chatRoom.name,
            isLiked: false,
            chatRoom: chatRoom,
            unread: true,
            language: 'es'
        }

        const allGroupUsers = await this.chatRoomRepository.getChatRoomUsers([currentUser, ...usersToAddToGroup]);

        await this.createMessage(user, messageData, chatRoom, playersToAdd, allGroupUsers)

        return {
            'success': true,
            'message': 'Chat room created',
            'chatRoom': chatRoom
        };

    }

    async createMessage(senderUser, messageData, chatRoom, players, users) {
        const newMessage = await this.messageRepository.createMessage(senderUser, messageData, chatRoom);

        for (const user of users) {
            const player = user.player;
            const newMessagePlayer = await this.messagePlayerRepository.createMessagePlayer(senderUser, newMessage, player, chatRoom);

            for (const device of user.devices) {

                // TODO ver como crear los deviceMessages
                const newDeviceMessage = await this.deviceMessageRepository.createDeviceMessage(senderUser, newMessagePlayer, device, chatRoom, newMessage, player);

            }
        }

    }

}