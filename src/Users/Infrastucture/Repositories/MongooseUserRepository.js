const User = require('../../../../models/User');
const ChatRoom = require('../../../../models/ChatRoom');

const MongooseUserRepository = class MongooseUserRepository {

    constructor() { }

    async create(
        fullName,
        email,
        password,
        type,
        language,
    ) {
        return await User.create({
            fullName: fullName,
            email: email,
            password: password,
            type: type,
            language: language,
        }).then(async (docUser) => {

            return docUser
        }).catch(e => console.log(`Error ===== ${e}`));
    }

    async searchUserByFirebaseId(firebaseId) {
        return await User.findOne({ firebaseId: firebaseId }).exec();
    }

    async searchUserById(user) {
        return await User.findById(user).populate('chatRooms').populate('devices').populate('player');
    }

    async getUserChatRooms(userChatRooms) {
        return await ChatRoom.find()
            .populate({
                path: 'lastMessage',
                populate: { path: 'sender' },
            })
            .populate({
                path: 'lastMessage',
                populate: { path: 'chatRoom' },
            })
            .where('_id')
            .in(userChatRooms)
            .exec();
    }

    async saveUserChatRoom(user, chatRoom) {
        let userChatRooms = user.chatRooms;
        userChatRooms.push(chatRoom);
        await user.save();
    }

    async addChatRoomToUser(user, chatRoom) {
        return await User.findByIdAndUpdate(
            user,
            {
                $push: {
                    chatRooms: chatRoom
                }
            },
            { new: true, useFindAndModify: false },
        );
    }

    async removeChatRoomFromUser(user, chatRoom) {
        return await User.findByIdAndUpdate(
            user,
            {
                $pull: {
                    'chatRooms': chatRoom.id
                }
            },
            { new: true, useFindAndModify: false },
        );

    }

    async findOneBy(val) {
        return User.findOne({val});
    }
}

module.exports = {
    MongooseUserRepository
}