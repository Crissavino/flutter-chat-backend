const { response } = require("express");
const Mensaje = require("../models/Message");
const obtenerChat = async (req, res = response) => {
  const myUuid = req.uuid;
  const mensajesDe = req.params.de;

  const last30 = await Mensaje.find({
    $or: [
      {
        de: myUuid,
        para: mensajesDe,
      },
      {
        de: mensajesDe,
        para: myUuid,
      },
    ],
  })
    .sort({ createdAt: "desc" })
    .limit(30);

  res.json({
    ok: true,
    mensajes: last30,
  });
};

module.exports = {
  obtenerChat,
};
