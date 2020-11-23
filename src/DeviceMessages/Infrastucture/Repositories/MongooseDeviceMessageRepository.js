const Device = require('../../../../models/Device');
const DeviceMessage = require('../../../../models/DeviceMessage');
const MessagePlayer = require('../../../../models/MessagePlayer');

const MongooseDeviceMessageRepository = class MongooseDeviceMessageRepository {
    constructor() { }

    async createDeviceMessage(senderUser, newMessagePlayer, device, chatRoom, newMessage, player) {
        return await DeviceMessage.create({
            sender: senderUser,
            messagePlayer: newMessagePlayer,
            device: device,
            chatRoom: chatRoom,
            time: newMessage.time,
            text: newMessage.text,
            isLiked: newMessage.isLiked,
            unread: (player.user == senderUser.id) ? false : true,
            language: 'en'
        }).then(async (docDeviceMessage) => {
            await MessagePlayer.findByIdAndUpdate(
                newMessagePlayer,
                {
                    $push: {
                        deviceMessages: {
                            _id: docDeviceMessage.id
                        }
                    }
                },
                { new: true, useFindAndModify: false },
            );

            await Device.findByIdAndUpdate(
                device,
                {
                    $push: {
                        deviceMessages: {
                            _id: docDeviceMessage.id
                        }
                    }
                },
                { new: true, useFindAndModify: false },
            );

            // return await getMyChatRoomDeviceMessages(chatRoom, device)

            return docDeviceMessage;
        }).catch(e => console.log(`Error ===== ${e}`));

    }

    async getMyDeviceMessages(device) {
        const myDevice = await Device.findById(device)
            .populate(
                {
                    path: 'deviceMessages',
                    options: {
                        sort: {
                            'createdAt': -1
                        }
                    }
                }
            );

        return myDevice.deviceMessages;
    }

    async getDeviceMessages(messagesPlayer, deviceWhoCall) {
        return await DeviceMessage.find()
            .populate('sender')
            .where('messagePlayer')
            .in(messagesPlayer)
            .where('device')
            .in(deviceWhoCall)
            .sort({ createdAt: 'desc' })
            .exec();
    }

    async getMyChatRoomDeviceMessages(chatRoom, deviceWhoCall) {
        return await DeviceMessage.find()
            .where('chatRoom')
            .in(chatRoom)
            .where('device')
            .in(deviceWhoCall)
            .sort({ createdAt: 'desc' })
            .exec();
    }
}

module.exports = {
    MongooseDeviceMessageRepository,
}