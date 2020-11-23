const SendMessageRequest = require("../core/Messages/Infrastucture/Classes/SendMessageRequest");
const OneUserCanSendOneMessageCommand = require("../core/Messages/Application/UseCase/OneUserCanSendOneMessage/OneUserCanSendOneMessageCommand");
const MongooseUserRepository = require('../core/Users/Infrastucture/Repositories/MongooseUserRepository');
const MongoosePlayerRepository = require('../core/Players/Infrastucture/Repositories/MongoosePlayerRepository');
const MongooseChatRoomRepository = require('../core/ChatRooms/Infrastucture/Repositories/MongooseChatRoomRepository');
const MongooseMessageRepository = require('../core/Messages/Infrastucture/Repositories/MongooseMessageRepository');
const MongooseMessagePlayerRepository = require('../core/MessagePlayers/Infrastucture/Repositories/MongooseMessagePlayerRepository');
const MongooseDeviceMessageRepository = require('../core/DeviceMessages/Infrastucture/Repositories/MongooseDeviceMessageRepository');
const MongooseDeviceRepository = require('../core/Devices/Infrastucture/Repositories/MongooseDeviceRepository');
const OneUserCanSendOneMessageCommandHandler = require("../core/Messages/Application/UseCase/OneUserCanSendOneMessage/OneUserCanSendOneMessageCommandHandler");

exports.sendMessage = async (req, res) => {

    const userRepository = new MongooseUserRepository();
    const playerRepository = new MongoosePlayerRepository();
    const chatRoomRepository = new MongooseChatRoomRepository();
    const messageRepository = new MongooseMessageRepository();
    const messagePlayerRepository = new MongooseMessagePlayerRepository();
    const deviceMessageRepository = new MongooseDeviceMessageRepository();
    const deviceRepository = new MongooseDeviceRepository();

    console.log(req.body);

    const requestResponse = new SendMessageRequest(req).trigger();
    if (!requestResponse.success) {
        res.json({ "success": false });
    }
    const command = new OneUserCanSendOneMessageCommand(
        requestResponse.firebaseId,
        requestResponse.message
    );

    const response = await new OneUserCanSendOneMessageCommandHandler(
        userRepository,
        playerRepository,
        chatRoomRepository,
        messageRepository,
        messagePlayerRepository,
        deviceMessageRepository,
        deviceRepository
    ).handler(command);

    if (!response.success) {
        res.json({ "success": false });
    }

    res.json({ response });

}