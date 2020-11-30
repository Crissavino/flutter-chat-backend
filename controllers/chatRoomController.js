const CreateChatRoomRequest = require('../src/ChatRooms/Infrastucture/Classes/CreateChatRoomRequest');
const OneUserCanCreateAChatRoomCommand = require('../src/ChatRooms/Application/UseCase/OneUserCanCreateAChatRoom/OneUserCanCreateAChatRoomCommand');
const OneUserCanCreateAChatRoomCommandHandler = require('../src/ChatRooms/Application/UseCase/OneUserCanCreateAChatRoom/OneUserCanCreateAChatRoomCommandHandler');
const GetAllTheirChatRoomsRequest = require('../src/ChatRooms/Infrastucture/Classes/GetAllTheirChatRoomsRequest');
const OneUserCanGetAllTheirsChatRoomsCommand = require('../src/ChatRooms/Application/UseCase/OneUserCanGetAllTheirsChatRooms/OneUserCanGetAllTheirsChatRoomsCommand');
const OneUserCanGetAllTheirsChatRoomsCommandHandler = require('../src/ChatRooms/Application/UseCase/OneUserCanGetAllTheirsChatRooms/OneUserCanGetAllTheirsChatRoomsCommandHandler');
const GetOneChatRoomRequest = require('../src/ChatRooms/Infrastucture/Classes/GetOneChatRoomRequest');
const OneUserCanGetOneChatRoomCommand = require('../src/ChatRooms/Application/UseCase/OneUserCanGetOneChatRoom/OneUserCanGetOneChatRoomCommand');
const OneUserCanGetOneChatRoomCommandHandler = require('../src/ChatRooms/Application/UseCase/OneUserCanGetOneChatRoom/OneUserCanGetOneChatRoomCommandHandler');
const GetAllTheirChatRoomMessagesRequest = require('../src/ChatRooms/Infrastucture/Classes/GetAllTheirChatRoomMessagesRequest');
const OneUserCanGetAllTheirChatRoomMessagesCommand = require('../src/ChatRooms/Application/UseCase/OneUserCanGetAllTheirChatRoomMessages/OneUserCanGetAllTheirChatRoomMessagesCommand');
const OneUserCanGetAllTheirChatRoomMessagesCommandHandler = require('../src/ChatRooms/Application/UseCase/OneUserCanGetAllTheirChatRoomMessages/OneUserCanGetAllTheirChatRoomMessagesCommandHandler');
const AddOneUserToChatRoomRequest = require('../src/ChatRooms/Infrastucture/Classes/AddOneOserToChatRoomRequest');
const OneUserCanAddOtherUserToOneChatRoomCommand = require('../src/ChatRooms/Application/UseCase/OneUserCanAddOtherUserToOneChatRoom/OneUserCanAddOtherUserToOneChatRoomCommand');
const OneUserCanAddOtherUserToOneChatRoomCommandHandler = require('../src/ChatRooms/Application/UseCase/OneUserCanAddOtherUserToOneChatRoom/OneUserCanAddOtherUserToOneChatRoomCommandHandler');
const OneUserCanRemoveOtherUserFromOneChatRoomCommand = require('../src/ChatRooms/Application/UseCase/OneUserCanRemoveOtherUserFromOneChatRoom/OneUserCanRemoveOtherUserFromOneChatRoomCommand');
const OneUserCanRemoveOtherUserFromOneChatRoomCommandCommandHandler = require('../src/ChatRooms/Application/UseCase/OneUserCanRemoveOtherUserFromOneChatRoom/OneUserCanRemoveOtherUserFromOneChatRoomCommandHandler');
const RemoveOneUserFromChatRoomRequest = require('../src/ChatRooms/Infrastucture/Classes/RemoveOneUserFromChatRoomRequest');
const ChangeChatRoomNameRequest = require('../src/ChatRooms/Infrastucture/Classes/ChangeChatRoomNameRequest');
const OneUserCanChangeTheNameOfOneChatRoomCommand = require('../src/ChatRooms/Application/UseCase/OneUserCanChangeTheNameOfOneChatRoom/OneUserCanChangeTheNameOfOneChatRoomCommand');
const OneUserCanChangeTheNameOfOneChatRoomCommandHandler = require('../src/ChatRooms/Application/UseCase/OneUserCanChangeTheNameOfOneChatRoom/OneUserCanChangeTheNameOfOneChatRoomCommandHandler');
const OneUserCanChangeTheDescriptionOfOneChatRoomCommand = require('../src/ChatRooms/Application/UseCase/OneUserCanChangeTheDescriptionOfOneChatRoom/OneUserCanChangeTheDescriptionOfOneChatRoomCommand');
const OneUserCanChangeTheDescriptionOfOneChatRoomCommandHandler = require('../src/ChatRooms/Application/UseCase/OneUserCanChangeTheDescriptionOfOneChatRoom/OneUserCanChangeTheDescriptionOfOneChatRoomCommandHandler');
const ChangeChatRoomDescriptionRequest = require('../src/ChatRooms/Infrastucture/Classes/ChangeChatRoomDescriptionRequest');
const {MongooseDeviceRepository} = require("../src/Devices/Infrastucture/Repositories/MongooseDeviceRepository");
const {MongooseDeviceMessageRepository} = require("../src/DeviceMessages/Infrastucture/Repositories/MongooseDeviceMessageRepository");
const {MongooseMessagePlayerRepository} = require("../src/MessagePlayers/Infrastucture/Repositories/MongooseMessagePlayerRepository");
const {MongooseMessageRepository} = require("../src/Messages/Infrastucture/Repositories/MongooseMessageRepository");
const {MongoosePlayerRepository} = require("../src/Players/Infrastucture/Repositories/MongoosePlayerRepository");
const {MongooseUserRepository} = require("../src/Users/Infrastucture/Repositories/MongooseUserRepository");
const {MongooseChatRoomRepository} = require("../src/ChatRooms/Infrastucture/Repositories/MongooseChatRoomRepository");

const create = async (req, res) => {

    const userRepository = new MongooseUserRepository();
    const playerRepository = new MongoosePlayerRepository();
    const chatRoomRepository = new MongooseChatRoomRepository();
    const messageRepository = new MongooseMessageRepository();
    const messagePlayerRepository = new MongooseMessagePlayerRepository();
    const deviceMessageRepository = new MongooseDeviceMessageRepository();
    const deviceRepository = new MongooseDeviceRepository();

    const requestResponse = new CreateChatRoomRequest(req).trigger();
    if (!requestResponse.success) {
        res.json({ "success": false });
    }

    const command = new OneUserCanCreateAChatRoomCommand(
        requestResponse.currentUser,
        requestResponse.currentDevice,
        requestResponse.usersToAddToGroup,
        requestResponse.groupName
    );

    const response = await new OneUserCanCreateAChatRoomCommandHandler(
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

    res.json({ 'success': response.success, 'message': response.message, 'chatRoom': response.chatRoom });

};

exports.getOneChatRoom = async (req, res) => {
    const userRepository = new MongooseUserRepository();
    const chatRoomRepository = new MongooseChatRoomRepository();

    const requestResponse = new GetOneChatRoomRequest(req).trigger();
    if (!requestResponse.success) {
        res.json({ "success": false });
    }

    const command = new OneUserCanGetOneChatRoomCommand(
        requestResponse.chatRoomId,
    );

    const response = await new OneUserCanGetOneChatRoomCommandHandler(
        userRepository,
        chatRoomRepository,
    ).handler(command);

    if (!response.success) {
        res.json({ "success": false });
    }

    res.json({ 'success': response.success, 'message': response.message, 'chatRoom': response.chatRoom });

}

const getAllMyChatRooms = async (req, res) => {
    const userRepository = new MongooseUserRepository();
    const chatRoomRepository = new MongooseChatRoomRepository();
    const deviceMessageRepository = new MongooseDeviceMessageRepository();

    const requestResponse = new GetAllTheirChatRoomsRequest(req).trigger();
    if (!requestResponse.success) {
        res.json({ "success": false });
    }

    const command = new OneUserCanGetAllTheirsChatRoomsCommand(
        requestResponse.userId,
        requestResponse.deviceId,
    );

    const response = await new OneUserCanGetAllTheirsChatRoomsCommandHandler(
        userRepository,
        chatRoomRepository,
        deviceMessageRepository
    ).handler(command);

    if (!response.success) {
        res.json({ "success": false });
    }

    res.json({ 'success': response.success, 'message': response.message, 'chatRooms': response.chatRooms });

}

const getAllMyChatRoomMessage = async (req, res) => {

    const userRepository = new MongooseUserRepository();
    const chatRoomRepository = new MongooseChatRoomRepository();
    const messagePlayerRepository = new MongooseMessagePlayerRepository();
    const deviceMessageRepository = new MongooseDeviceMessageRepository();

    const requestResponse = new GetAllTheirChatRoomMessagesRequest(req).trigger();
    if (!requestResponse.success) {
        res.json({ "success": false });
    }

    const command = new OneUserCanGetAllTheirChatRoomMessagesCommand(
        requestResponse.userId,
        requestResponse.chatRoomId,
    );

    const response = await new OneUserCanGetAllTheirChatRoomMessagesCommandHandler(
        userRepository,
        chatRoomRepository,
        messagePlayerRepository,
        deviceMessageRepository,
    ).handler(command);

    if (!response.success) {
        res.json({ "success": false });
    }

    res.json({ 'success': response.success, 'message': response.message, 'deviceMessages': response.deviceMessages });
}

exports.addToChatRoom = async (req, res) => {
    const userRepository = new MongooseUserRepository();
    const chatRoomRepository = new MongooseChatRoomRepository();

    const requestResponse = new AddOneUserToChatRoomRequest(req).trigger();
    if (!requestResponse.success) {
        res.json({ "success": false });
    }

    const command = new OneUserCanAddOtherUserToOneChatRoomCommand(
        requestResponse.userToAdd,
        requestResponse.chatRoomId,
    );

    const response = await new OneUserCanAddOtherUserToOneChatRoomCommandHandler(
        userRepository,
        chatRoomRepository
    ).handler(command);

    res.json({ response });
}

exports.removeFromChatRoom = async (req, res) => {
    const userRepository = new MongooseUserRepository();
    const chatRoomRepository = new MongooseChatRoomRepository();

    const requestResponse = new RemoveOneUserFromChatRoomRequest(req).trigger();
    if (!requestResponse.success) {
        res.json({ "success": false });
    }

    const command = new OneUserCanRemoveOtherUserFromOneChatRoomCommand(
        requestResponse.userToRemove,
        requestResponse.chatRoomId,
    );

    const response = await new OneUserCanRemoveOtherUserFromOneChatRoomCommandCommandHandler(
        userRepository,
        chatRoomRepository
    ).handler(command);

    res.json({ response });
}

exports.changeChatRoomName = async (req, res) => {
    const chatRoomRepository = new MongooseChatRoomRepository();

    const requestResponse = new ChangeChatRoomNameRequest(req).trigger();
    if (!requestResponse.success) {
        res.json({ "success": false });
    }

    const command = new OneUserCanChangeTheNameOfOneChatRoomCommand(
        requestResponse.chatRoom,
        requestResponse.newChatRoomName
    );

    const response = await new OneUserCanChangeTheNameOfOneChatRoomCommandHandler(
        chatRoomRepository
    ).handler(command);

    res.json({ response });

}

exports.changeChatRoomDescription = async (req, res) => {
    const chatRoomRepository = new MongooseChatRoomRepository();

    const requestResponse = new ChangeChatRoomDescriptionRequest(req).trigger();
    if (!requestResponse.success) {
        res.json({ "success": false });
    }

    const command = new OneUserCanChangeTheDescriptionOfOneChatRoomCommand(
        requestResponse.chatRoom,
        requestResponse.newChatRoomDesc
    );

    const response = await new OneUserCanChangeTheDescriptionOfOneChatRoomCommandHandler(
        chatRoomRepository
    ).handler(command);

    res.json({ response });

}

module.exports = {
    create,
    getAllMyChatRooms,
    getAllMyChatRoomMessage
}