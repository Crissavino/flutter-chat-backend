module.exports = class OneUserCanAddOtherUserToOneChatRoomCommandHandler {
    constructor(
        userRepository,
        chatRoomRepository,
        messageRepository,
        messagePlayerRepository,
        deviceMessageRepository,
    ) {
        this.userRepository = userRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.messageRepository = messageRepository;
        this.messagePlayerRepository = messagePlayerRepository;
        this.deviceMessageRepository = deviceMessageRepository;
    }

    async handler(command) {
        const userWhoAdd = command.getUserWhoAdd();
        const usersToAdd = command.getUsersToAdd();
        const chatRoomId = command.getChatRoomId();

        let chatRoomUpdated;
        for (const userToAdd of usersToAdd) {
            const user = await this.userRepository.searchUserById(userToAdd._id);
            const playerToAdd = user.player;
            const chatRoom = await this.chatRoomRepository.findById(chatRoomId);
            await this.userRepository.addChatRoomToUser(user, chatRoom);
            chatRoomUpdated = await this.chatRoomRepository.addPlayerToChatRoom(chatRoom, playerToAdd);

            const messageDataForAddedPlayer = {
                time: Date.now(),
                text: userWhoAdd.fullName + ' te ha agregado al grupo: ' + chatRoom.name,
                isLiked: false,
                chatRoom: chatRoom,
                language: 'es'
            }
            await this.createMessageForAddedPlayer(userWhoAdd, messageDataForAddedPlayer, chatRoom, user)

            const messageDataForOtherPlayer = {
                time: Date.now(),
                text: user.fullName + ' ha sido agregado al grupo: ' + chatRoom.name,
                isLiked: false,
                chatRoom: chatRoom,
                language: 'es'
            }
            let otherPlayers = chatRoom.players;
            await this.createMessageForOtherPlayers(userWhoAdd, messageDataForOtherPlayer, chatRoom, otherPlayers)
        }

        return {
            'success': true,
            'message': 'Player added to chat room',
            'chatRoom': chatRoomUpdated
        };

    }

    async createMessageForAddedPlayer(userWhoAdd, messageData, chatRoom, addedUser) {
        const newMessage = await this.messageRepository.createMessage(userWhoAdd, messageData, chatRoom);

        const player = addedUser.player;
        const {newMessageUpdated, newMessagePlayer} = await this.messagePlayerRepository.createMessagePlayer(
            userWhoAdd, newMessage, player, chatRoom, true
        );

        for (const device of addedUser.devices) {

            const {newMessagePlayerUpdated, newDeviceMessage} = await this.deviceMessageRepository.createDeviceMessage(
                userWhoAdd, newMessagePlayer, device, chatRoom, newMessage, player, true
            );

        }

    }

    async createMessageForOtherPlayers(senderUser, messageData, chatRoom, otherPlayers) {
        const newMessage = await this.messageRepository.createMessage(senderUser, messageData, chatRoom);

        for (const player of otherPlayers) {
            const {newMessageUpdated, newMessagePlayer} = await this.messagePlayerRepository.createMessagePlayer(
                senderUser, newMessage, player, chatRoom, (String(player.user._id) !== String(senderUser._id))
            );

            for (const device of player.user.devices) {

                const {newMessagePlayerUpdated, newDeviceMessage} = await this.deviceMessageRepository.createDeviceMessage(
                    senderUser, newMessagePlayer, device, chatRoom, newMessage, player, (String(player.user._id) !== String(senderUser._id))
                );

            }
        }

    }
}