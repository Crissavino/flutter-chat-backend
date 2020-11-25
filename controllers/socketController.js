const User = require("../models/User");
const Message = require("../models/Message");
const {MongooseDeviceMessageRepository} = require("../src/DeviceMessages/Infrastucture/Repositories/MongooseDeviceMessageRepository");
const {MongooseMessagePlayerRepository} = require("../src/MessagePlayers/Infrastucture/Repositories/MongooseMessagePlayerRepository");
const {MongooseMessageRepository} = require("../src/Messages/Infrastucture/Repositories/MongooseMessageRepository");

const usuarioConectado = async (uuid = "") => {
  const usuario = await User.findById(uuid);
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

    const newMessage = await messageRepository.createMessage(payload.sender, messageData, payload.chatRoom);

    for (const player of payload.chatRoom.players) {

      // messageData.unread = payload.sender._id !== player.user._id;

      const newMessagePlayer = await messagePlayerRepository.createMessagePlayer(payload.sender, newMessage, player, payload.chatRoom);

      for (const device of player.user.devices) {

        const newDeviceMessage = await deviceMessageRepository.createDeviceMessage(payload.sender, newMessagePlayer, device, payload.chatRoom, newMessage, player);

      }
    }

    console.log(newMessage.messagePlayer)

    return newMessage;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  usuarioConectado,
  usuarioDesconectado,
  grabarMensaje,
};
