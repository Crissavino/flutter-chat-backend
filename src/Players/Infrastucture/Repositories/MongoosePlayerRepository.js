const Player = require('../../../../models/Player');
const User = require('../../../../models/User');
const Device = require('../../../../models/Device');

const MongoosePlayerRepository = class MongoosePlayerRepository {

    constructor() { }

    async create(user) {
        return await Player.create({
            user: user,
        }).then(async (docPlayer) => {

            const userWithPlayer = await User.findByIdAndUpdate(
                user,
                {
                    $set: {
                        player: docPlayer
                    }
                },
                { new: true, useFindAndModify: false },
            );

            return {
                docPlayer: docPlayer,
                userWithPlayer: userWithPlayer
            };
        }).catch(e => console.log(`Error ===== ${e}`));
    }

    async searchById(player) {
        return await Player.findById(player);
    }

    async getTeamPlayers(players) {
        return await Player.find().populate('devices').where('_id').in(players).exec();
    }

    async getChatRoomPlayers(players) {
        return await Player.find().populate('devices').where('_id').in(players).exec();
    }

    async getPlayersToAddToGroup(playersIds) {
        return await Player.find()
            .where('_id')
            .in(playersIds)
            .exec();
    }

    async attachMessagePlayer(player, messagePlayerId) {
        let messages = player.messages;
        messages.push(messagePlayerId);
        await player.save();
    }
}

module.exports = {
    MongoosePlayerRepository
}