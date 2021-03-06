const User = require("../models/User");
const Message = require("../models/Message");
const {MongooseDeviceMessageRepository} = require("../src/DeviceMessages/Infrastucture/Repositories/MongooseDeviceMessageRepository");
const {MongooseMessagePlayerRepository} = require("../src/MessagePlayers/Infrastucture/Repositories/MongooseMessagePlayerRepository");
const {MongooseMessageRepository} = require("../src/Messages/Infrastucture/Repositories/MongooseMessageRepository");
const {MongooseChatRoomRepository} = require("../src/ChatRooms/Infrastucture/Repositories/MongooseChatRoomRepository");

const usuarioConectado = async (uuid = "") => {
  const usuario = await User.findById(uuid);
  if (!usuario) {
    return;
  }
  usuario.online = true;

  await usuario.save();

  return usuario;
};

const usuarioDesconectado = async (uuid = "") => {
  const usuario = await User.findById(uuid);
  usuario.online = false;

  await usuario.save();

  return usuario;
};

const grabarMensaje = async (payload) => {
  /*
    payload = {
      de: '',
      para: '',
      mensaje: ''
    }
  */
  try {

    const messageRepository = new MongooseMessageRepository();
    const messagePlayerRepository = new MongooseMessagePlayerRepository();
    const deviceMessageRepository = new MongooseDeviceMessageRepository();

    const messageData = {
      time: Date.now(),
      text: payload.text,
      isLiked: false,
      chatRoom: payload.chatRoom,
      unread: true,
    }

    let newMessage = await messageRepository.createMessage(payload.sender, messageData, payload.chatRoom);

    let deviceMessages = [];

    for (const player of payload.chatRoom.players) {

      const {newMessageUpdated, newMessagePlayer} = await messagePlayerRepository.createMessagePlayer(
          payload.sender, newMessage, player, payload.chatRoom, (player.user._id !== payload.sender._id)
      );

      for (const device of player.user.devices) {

        const {newMessagePlayerUpdated, newDeviceMessage} = await deviceMessageRepository.createDeviceMessage(
            payload.sender, newMessagePlayer, device, payload.chatRoom, newMessage, player, (player.user._id !== payload.sender._id)
        );
        deviceMessages.push(newDeviceMessage);
      }

    }

    return deviceMessages;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const readAllMessage = async (payload) => {
  const messagePlayerRepository = new MongooseMessagePlayerRepository();
  const deviceMessageRepository = new MongooseDeviceMessageRepository();

  await messagePlayerRepository.readMessages(payload.chatRoom._id, payload.user.player);
  await deviceMessageRepository.readMessages(payload.chatRoom._id, payload.device._id);
  return await deviceMessageRepository.getLastChatRoomMessage(payload.chatRoom._id, payload.device._id);
}

const leaveChatRoomData = async (payload) => {
  const chatRoomRepository = new MongooseChatRoomRepository();
  const deviceMessageRepository = new MongooseDeviceMessageRepository();

  const chatRoom = await chatRoomRepository.findById(payload.chatRoom._id);

  chatRoom.lastMessage = await deviceMessageRepository.getLastChatRoomMessage(payload.chatRoom._id, payload.device._id)

  console.log('chatRoom.lastMessage')
  console.log(chatRoom.lastMessage)
  return chatRoom;

}

module.exports = {
  usuarioConectado,
  usuarioDesconectado,
  grabarMensaje,
  readAllMessage,
  leaveChatRoomData
};
