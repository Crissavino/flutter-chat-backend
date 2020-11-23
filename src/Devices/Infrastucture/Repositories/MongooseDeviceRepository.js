const Device = require('../../../../models/Device');
const User = require('../../../../models/User');
const Player = require('../../../../models/Player');
const faker = require('faker');

const MongooseDeviceRepository = class MongooseDeviceRepository {
    constructor() { }

    async create(userWithPlayer, player, deviceId, type, lang, token) {
        return await Device.create({
            user: userWithPlayer,
            deviceId: deviceId,
            type: type,
            language: lang,
            deviceMessages: [],
            JWToken: token,
        }).then(async (docDevice) => {

            const userUpdated = await User.findByIdAndUpdate(
                userWithPlayer,
                {
                    $push: {
                        devices: docDevice
                    }
                },
                { new: true, useFindAndModify: false },
            );

            const playerUpdated = await Player.findByIdAndUpdate(
                player,
                {
                    $set: {
                        user: userUpdated
                    }
                },
                { new: true, useFindAndModify: false },
            );


            return {
                device: docDevice,
                userUpdated: userUpdated,
                playerUpdated: playerUpdated
            };
        }).catch(e => console.log(`Error ===== ${e}`));
    }

    async findDeviceById(device) {
        return await Device.findById(device);
    }

    async attachDeviceMessages(device, deviceMessages, deviceMessageId) {
        const mongoDevice = await this.findDeviceById(device);
        let messages = deviceMessages ? deviceMessages : [];
        messages.push(deviceMessageId);
        await mongoDevice.save();
    }
}

module.exports = {
    MongooseDeviceRepository
}