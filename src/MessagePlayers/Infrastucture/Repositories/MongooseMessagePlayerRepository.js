const MessagePlayer = require('../../../../models/MessagePlayer');
const Message = require('../../../../models/Message');
const Player = require('../../../../models/Player');
const ObjectID = require('mongodb').ObjectID;

const MongooseMessagePlayerRepository = class MongooseMessagePlayerRepository {
    constructor() { }

    async findMessagePlayerById(messagePlayer) {
        return await MessagePlayer.findById(messagePlayer);
    }

    async createMessagePlayer(senderUser, newMessage, player, chatRoom) {
        return await MessagePlayer.create({
            sender: senderUser,
            message: newMessage,
            player: player,
            chatRoom: chatRoom,
            time: newMessage.time,
            text: newMessage.text,
            isLiked: newMessage.isLiked,
            unread: (player.user == senderUser.id) ? false : true,
            language: 'en'
        }).then(async (docMessagePlayer) => {
            await Message.findByIdAndUpdate(
                newMessage,
                {
                    $push: {
                        messagePlayers: {
                            _id: docMessagePlayer.id
                        }
                    }
                },
                { new: true, useFindAndModify: false }
            );

            await Player.findByIdAndUpdate(
                player,
                {
                    $push: {
                        messages: {
                            _id: docMessagePlayer.id
                        }
                    }
                },
                { new: true, useFindAndModify: false }
            );

            return docMessagePlayer;
        }).catch(e => console.log(`Error ===== ${e}`));
    }

    async attachDeviceMessageToMessagePlayer(messagePlayer, deviceMessageId) {
        const mongoMessagePlayer = await this.findMessagePlayerById(messagePlayer);
        let messagePlayerDeviceMessages = mongoMessagePlayer.deviceMessages.lenght > 0 ? mongoMessagePlayer.deviceMessages : [];
        messagePlayerDeviceMessages.push(deviceMessageId);
        await mongoMessagePlayer.save();
    }

    async getMessagePlayerOfSender(senderPlayer, message) {
        return MessagePlayer.findOne({
            message: message,
            player: senderPlayer
        }).exec();
    }

    async getMessagePlayer(messages, player) {
        return await MessagePlayer.find()
            .where('message')
            .in(messages)
            .where('player')
            .in(player)
            .exec();
    }

    async getMyLastPlayerMessage(newMessage, senderPlayer) {
        const mes = await MessagePlayer.find({
            message: ObjectID(newMessage.id)
        }).exec((err, doc) => {
            if (err) {
                ('err' + err);
                return;
            }

            ('doc ==== ' + doc);
        });
        // return await MessagePlayer.find({
        //     message: newMessage.id,
        //     player: senderPlayer.id
        // }).exec();
    }

}

module.exports = {
    MongooseMessagePlayerRepository,
}