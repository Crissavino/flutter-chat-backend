const ChatRoom = require('../../../../models/ChatRoom');
const Player = require('../../../../models/Player');
const User = require('../../../../models/User');
const Message = require('../../../../models/Message');
const MessagePlayer = require('../../../../models/MessagePlayer');
const DeviceMessage = require('../../../../models/DeviceMessage');

const MongooseChatRoomRepository = class MongooseChatRoomRepository {
    async createChatRoom(groupName, playersToAdd, playerOwner, userRepository, newMessage) {
        return await ChatRoom.create({
            name: groupName,
            description: '',
            isPinned: false,
            unreadMessages: false,
            image: '',
            players: playersToAdd,
            owner: playerOwner,
            messages: newMessage,
            lastMessage: newMessage
        }).then(async (docChatRoom) => {

            for (const player of playersToAdd) {

                const playerUser = await userRepository.searchUserById(player.user);

                await User.findByIdAndUpdate(
                    playerUser,
                    {
                        $push: {
                            chatRooms: {
                                _id: docChatRoom.id
                            }
                        }
                    },
                    { new: true, useFindAndModify: false },
                );

            }

            return docChatRoom;

        }).catch(e => console.log(`Error ===== ${e}`));
    }

    async getUsersChatRooms(userChatRooms) {

        if (userChatRooms.length === 0) {
            return [];
        }

        return await ChatRoom.find()
            .populate({
                path: 'lastMessage',
                populate: { path: 'sender' },
            })
            .populate({
                path: 'lastMessage',
                populate: { path: 'chatRoom' },
            })
            .populate({
                path: 'messages',
                options: {
                    sort: {
                        'createdAt': -1
                    }
                }
            })
            .populate({
                path: 'players',
                populate: { path: 'user' },
            })
            .sort(
                {
                    'lastMessage': -1
                }
            )
            .where('_id')
            .in(userChatRooms)
            .exec();
    }

    async getUsersChatRoomsWithDevice(userChatRooms) {

        if (userChatRooms.length === 0) {
            return [];
        }

        return await ChatRoom.find()
            .populate({
                path: 'lastMessage',
                populate: { path: 'sender' },
            })
            .populate({
                path: 'lastMessage',
                populate: { path: 'chatRoom' },
            })
            .populate({
                path: 'lastMessage',
                populate: {
                    path: 'messagePlayers',
                    populate: {
                        path: 'deviceMessages',
                        populate: {
                            path: 'device',
                        }
                    },
                },
            })
            .populate({
                path: 'messages',
                options: {
                    sort: {
                        'createdAt': -1
                    }
                }
            })
            .populate({
                path: 'players',
                populate: { path: 'user' },
            })
            .sort(
                {
                    'lastMessage': -1
                }
            )
            .where('_id')
            .in(userChatRooms)
            .exec();
    }

    async attachMessage(chatRoom, newMessage) {
        let messages = chatRoom.messages;
        chatRoom.lastMessage = newMessage.id;
        messages.push(newMessage.id);
        await chatRoom.save();
    }

    async findById(chatRoomId) {
        return await ChatRoom.findById(chatRoomId).populate({
            path: 'lastMessage',
            populate: { path: 'sender' },
        })
            .populate({
                path: 'lastMessage',
                populate: { path: 'chatRoom' },
            })
            .populate({
                path: 'messages',
                options: {
                    sort: {
                        'createdAt': -1
                    }
                }
            })
            .populate({
                path: 'players',
                populate: { path: 'user' },
            })
            .sort(
                {
                    'lastMessage': -1
                }
            );
    }

    async getChatRoomPlayers(chatRoomPlayers) {
        return await Player.find().populate('devices').where('_id').in(chatRoomPlayers).exec();
    }

    async getChatRoomUsers(chatRoomUsers) {
        return await User.find()
            .populate('devices')
            .populate({
                path: 'player',
                populate: 'user'
            })
            .where('_id')
            .in(chatRoomUsers)
            .exec();
    }

    async addPlayerToChatRoom(chatRoom, playerToAdd) {
        return await ChatRoom.findByIdAndUpdate(
            chatRoom,
            {
                $push: {
                    players: {
                        _id: playerToAdd.id
                    }
                }
            },
            { new: true, useFindAndModify: false },
        ).populate({
            path: 'lastMessage',
            populate: { path: 'sender' },
        })
            .populate({
                path: 'lastMessage',
                populate: { path: 'chatRoom' },
            })
            .populate({
                path: 'lastMessage',
                populate: {
                    path: 'messagePlayers',
                    populate: {
                        path: 'deviceMessages',
                        populate: {
                            path: 'device',
                        }
                    },
                },
            })
            .populate({
                path: 'messages',
                options: {
                    sort: {
                        'createdAt': -1
                    }
                }
            })
            .populate({
                path: 'players',
                populate: { path: 'user' },
            })
            .sort(
                {
                    'lastMessage': -1
                }
            )
            .exec();
    }

    async removePlayerFromChatRoom(chatRoom, playerToRemove) {

        return await ChatRoom.findByIdAndUpdate(
            chatRoom,
            {
                $pull: {
                    'players': playerToRemove
                }
            },
            { new: true, useFindAndModify: false },
        );

    }

    async updateName(chatRoom, newName) {
        return await ChatRoom.findByIdAndUpdate(
            chatRoom,
            {
                $set: {
                    name: newName
                },
            },
            { new: true, useFindAndModify: false },
        )
            .populate({
                path: 'lastMessage',
                populate: { path: 'sender' },
            })
            .populate({
                path: 'lastMessage',
                populate: { path: 'chatRoom' },
            })
            .populate({
                path: 'messages',
                options: {
                    sort: {
                        'createdAt': -1
                    }
                }
            })
            .populate({
                path: 'players',
                populate: { path: 'user' },
            });
    }

    async updateDesc(chatRoom, newDesc) {
        return await ChatRoom.findByIdAndUpdate(
            chatRoom,
            {
                $set: {
                    description: newDesc
                },
            },
            { new: true, useFindAndModify: false },
        )
            .populate({
                path: 'lastMessage',
                populate: { path: 'sender' },
            })
            .populate({
                path: 'lastMessage',
                populate: { path: 'chatRoom' },
            })
            .populate({
                path: 'messages',
                options: {
                    sort: {
                        'createdAt': -1
                    }
                }
            })
            .populate({
                path: 'players',
                populate: { path: 'user' },
            });
    }
}

module.exports = {
    MongooseChatRoomRepository,
}