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

    const newMessage = await messageRepository.createMessage(senderUser, messageData, chatRoom);

    for (const user of users) {
      const player = user.player;
      const newMessagePlayer = await messagePlayerRepository.createMessagePlayer(senderUser, newMessage, player, chatRoom);

      for (const device of user.devices) {

        const newDeviceMessage = await deviceMessageRepository.createDeviceMessage(senderUser, newMessagePlayer, device, chatRoom, newMessage, player);

      }
    }
    const mensaje = new Message(payload);
    await mensaje.save();
    return mensaje;
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
