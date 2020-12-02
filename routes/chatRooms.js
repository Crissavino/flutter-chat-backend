/* 

    path: /api/chatRooms

*/
const { Router } = require('express');
const router = Router();
const faker = require('faker');
const User = require('../models/User');
const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');
const Device = require('../models/Device');
const Player = require('../models/Player');
const MessagePlayer = require('../models/MessagePlayer');
const DeviceMessage = require('../models/DeviceMessage');
const ObjectID = require('mongodb').ObjectID;
const fs = require("fs");
const { create, getAllMyChatRooms, getAllMyChatRoomMessage, changeChatRoomName, changeChatRoomDescription } = require("../controllers/chatRoomController");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { check } = require("express-validator");

// create a chat room
router.post(
    "/create",
    [
        check("currentUser", "El usuario es obligatorio").not().isEmpty(),
        check("groupName", "El nombre del grupo es obligatorio").not().isEmpty(),
        check("usersToAddToGroup", "Los usuarios del grupo son obligatorios").not().isEmpty(),
        validarCampos,
        validarJWT
    ],
    create
);

router.get(
    "/getAllMyChatRooms",
    [
            validarJWT
    ],
    getAllMyChatRooms
);

router.get(
    "/getAllMyChatRoomMessage",
    [
        validarJWT
    ],
    getAllMyChatRoomMessage
);

router.post(
    "/editGroupName",
    [
        check("chatRoomToEdit", "El chat es obligatorio").not().isEmpty(),
        check("newChatRoomName", "El nuevo nombre del chat es obligatorio").not().isEmpty(),
        validarCampos,
        validarJWT
    ],
    changeChatRoomName
);

router.post(
    "/editGroupDescription",
    [
        check("chatRoomToEdit", "El chat es obligatorio").not().isEmpty(),
        check("newChatRoomDesc", "La nueva descripcion del chat es obligatorio").not().isEmpty(),
        validarCampos,
        validarJWT
    ],
    changeChatRoomDescription
);

// router.post('/addToChatRoom', chatRoomController.addToChatRoom);
//
// router.post('/removeFromChatRoom', chatRoomController.removeFromChatRoom);
//
// router.get('/getOneChatRoom', chatRoomController.getOneChatRoom);
//
// router.get('/getAllMyChatRoomMessage', chatRoomController.getAllMyChatRoomMessage);
//
// router.post('/editGroupName', chatRoomController.changeChatRoomName);
//
// router.post('/editGroupDescription', chatRoomController.changeChatRoomDescription);
//
// router.post('/editGroupImage', (req, res) => {
//     let chatRoom = req.body.chatRoomToEdit;
//     let img = req.body.encodedImage;
//     let realFile = Buffer.from(img, "base64");
//     fs.writeFile(chatRoom.name, realFile, function (err) {
//         if (err)
//             console.log(err);
//     });
//     res.send("OK");
// });
//
// router.post('/createMessages', async (req, res) => {
//     const firebaseId = req.query.firebaseId
//     const message = req.body;
//     const chatRoomId = message.chatRoom;
//     const senderUser = await searchUserByFirebaseId(firebaseId);
//     const senderPlayer = await Player.findById(senderUser.player);
//     const senderUserDevice = senderUser.devices[0];
//     const chatRoom = await ChatRoom.findById(chatRoomId).populate('team');
//     const players = await getChatRoomPlayers(chatRoom);
//
//     const newMessage = await createMessage(senderUser, message, chatRoom, players);
//
//     const newMessagePlayer = await findMessagePlayer(newMessage, senderPlayer);
//     res.json({ message: 'Message Created', newMessagePlayer: newMessagePlayer });
//
//     const newDeviceMessage = await getDeviceMessages(newMessagePlayer, senderUserDevice);
//     // res.json({ message: 'Message Created', newDeviceMessage: newDeviceMessage });
// })
//
// async function findMessagePlayer(newMessage, player) {
//     return await MessagePlayer.find()
//         .where('player')
//         .equals(player.id)
//         .where('message')
//         .equals(newMessage.id)
//         .exec();
// }
//
// async function findDeviceMessage(newMessagePlayer, senderUserDevice) {
//     return await DeviceMessage.find()
//         .where('_id')
//         .in(senderUserDevice.id)
//         .where('messagePlayer')
//         .in(newMessagePlayer)
//         .exec();
// }
//
// async function createMessage(senderUser, message, chatRoom, players) {
//     const newMessage = await Message.create({
//         sender: senderUser,
//         time: message.time,
//         text: message.text,
//         isLiked: message.isLiked,
//         chatRoom: chatRoom,
//         unread: message.unread,
//         language: message.language
//     });
//
//     let messages = chatRoom.messages;
//     chatRoom.lastMessage = newMessage.id;
//     messages.push(newMessage.id);
//     await chatRoom.save();
//
//     let arrayMessagePlayer = [];
//     players.forEach(async (player) => {
//         const messagePlayer = await MessagePlayer.create({
//             sender: senderUser,
//             message: newMessage,
//             player: player,
//             chatRoom: chatRoom,
//             time: newMessage.time,
//             text: newMessage.text,
//             isLiked: newMessage.isLiked,
//             unread: (player.user == senderUser.id) ? false : true,
//             language: 'en',
//         });
//
//         let messages = player.messages;
//         messages.push(messagePlayer.id);
//         await player.save();
//
//         arrayMessagePlayer.push(messagePlayer.id);
//
//         let arrayDeviceMessage = [];
//         player.devices.forEach(async (device) => {
//             const deviceMessage = await DeviceMessage.create({
//                 sender: senderUser,
//                 messagePlayer: messagePlayer,
//                 device: device,
//                 chatRoom: chatRoom,
//                 time: newMessage.time,
//                 text: newMessage.text,
//                 isLiked: newMessage.isLiked,
//                 unread: (player.user == senderUser.id) ? false : true,
//                 language: 'en'
//             });
//
//             let messages = device.deviceMessages ? device.deviceMessages : [];
//             messages.push(deviceMessage.id);
//             await device.save();
//
//             arrayDeviceMessage.push(deviceMessage.id);
//         });
//
//         let messagePlayer_deviceMessages = messagePlayer.deviceMessages > 0 ? messagePlayer.deviceMessages : [];
//         messagePlayer_deviceMessages.push(arrayDeviceMessage);
//         await messagePlayer.save();
//
//     });
//
//     let message_messagePlayers = newMessage.messagePlayers.length > 0 ? newMessage.messagePlayers.length : [];
//     message_messagePlayers.push(arrayMessagePlayer);
//
//     return newMessage;
// }
//
// async function getTeamPlayers(team) {
//     return await Player.find().populate('devices').where('_id').in(team.players).exec();
// }
//
// async function getChatRoomPlayers(chatRoom) {
//     return await Player.find().populate('devices').where('_id').in(chatRoom.players).exec();
// }
//
// async function searchUserByFirebaseId(firebaseId) {
//     return await User.findOne({ firebaseId: firebaseId }).exec();
// }
//
// async function getUserChatRooms(userChatRooms) {
//     return await ChatRoom.find()
//         .populate({
//             path: 'lastMessage',
//             populate: { path: 'sender' },
//         })
//         .populate({
//             path: 'lastMessage',
//             populate: { path: 'chatRoom' },
//         })
//         .where('_id')
//         .in(userChatRooms)
//         .exec();
// }
//
// async function getMessagePlayer(messages, player) {
//     return await MessagePlayer.find()
//         .where('message')
//         .in(messages)
//         .where('player')
//         .in(player)
//         .exec();
// }
//
// async function getDeviceMessages(messagesPlayer, deviceWhoCall) {
//     return await DeviceMessage.find()
//         .populate('sender')
//         .where('messagePlayer')
//         .in(messagesPlayer)
//         .where('device')
//         .in(deviceWhoCall)
//         .sort({ createdAt: 'desc' })
//         .exec();
// }
//
// async function getPlayersToAddToGroup(playersIds) {
//     return await Player.find()
//         .where('_id')
//         .in(playersIds)
//         .exec();
// }

module.exports = router;
