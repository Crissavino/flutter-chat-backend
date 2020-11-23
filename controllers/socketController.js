const User = require("../models/User");
const Message = require("../models/Message");

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
