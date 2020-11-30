const Message = require('../../../../models/Message');
const ChatRoom = require('../../../../models/ChatRoom');

const MongooseMessageRepository = class MongooseMessageRepository {
    constructor() { }

    async findMessageById(message) {
        return await Message.findById(message);
    }

    async createMessage(senderUser, messageData, chatRoom) {
        return await Message.create({
            sender: senderUser,
            time: messageData.time,
            text: messageData.text,
            isLiked: messageData.isLiked,
            chatRoom: chatRoom,
            language: messageData.language
        }).then(async (docNewMessage) => {
            await ChatRoom.findByIdAndUpdate(
                chatRoom,
                {
                    $push: {
                        messages: {
                            _id: docNewMessage.id
                        }
                    },
                    $set: {
                        lastMessage: {
                            _id: docNewMessage.id
                        }
                    }
                },
                { new: true, useFindAndModify: false },
            );
            return docNewMessage;
        }).catch(e => console.log(`Error ===== ${e}`));
    }

    async attachMessagePlayerToMessage(message, messagePlayersIds) {
        const mongoMessage = await this.findMessageById(message);
        let messageMessagePlayers = await mongoMessage.messagePlayers.lenght > 0 ? mongoMessage.messagePlayers : [];
        messageMessagePlayers.push(messagePlayersIds);
        await mongoMessage.save();
    }

}
module.exports = {
    MongooseMessageRepository,
}