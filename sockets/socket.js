const { comprobarJWT } = require("../helpers/jwt");
const { io } = require("../index");
const {
  usuarioConectado,
  usuarioDesconectado,
  grabarMensaje,
} = require("../controllers/socketController");

// Mensajes de Sockets
io.on("connection", (client) => {
  console.log("Cliente conectado");

  const token = client.handshake.headers["x-token"];

  // verificando autenticacion
  const [valido, uuid] = comprobarJWT(token);

  if (!valido) {
    return client.disconnect();
  }

  // cliente conectado
  usuarioConectado(uuid);

  // ingresar al usuario a una sala especifica
  // sala global
  // sala uno a uno con el id del usuario
  // client.join(uuid);

  client.on('enterChatRoom', async (enterChatRoomData) => {
    console.log(client.rooms)
  });

  client.on('connectToChatRooms', async (user) => {
    for (const chatRoom of user.chatRooms) {
      client.join(chatRoom._id);
    }
  });

  client.on('chatRoomMessage', async (payload) => {
    client.broadcast.to(payload.chatRoom._id).emit('chatRoomMessage', {
      'text': payload.text,
      'de': payload.sender
    })
  });


  // escuchar del cliente mensaje-personal
  // client.on("mensaje-personal", async (payload) => {
  //   console.log(payload.de._id)
  //   for (const player of payload.para) {
  //     console.log(player._id)
  //     if (player._id !== payload.de._id) {
  //       io.to(player._id).emit("mensaje-personal", payload);
  //     }
  //   }
  //   // TODO grabar mensaje
  //   // await grabarMensaje(payload);
  //
  //   // io.to(payload.de["_id"]).emit("mensaje-personal", payload);
  //   //
  //   // io.to(payload.para).emit("mensaje-personal", payload);
  // });

  client.on("disconnect", () => {
    usuarioDesconectado(uuid);
    console.log("Cliente desconectado");
  });
});
