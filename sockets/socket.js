const { comprobarJWT } = require("../helpers/jwt");
const { io } = require("../index");
const ChatRoom = require("../models/ChatRoom");
const {
  usuarioConectado,
  usuarioDesconectado,
  grabarMensaje,
    // connectUserToChatRoom
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
  client.join(uuid);

  client.on('enterChatRoom', async (enterChatRoomData) => {
    console.log(client.rooms)
  });

  client.on('chatRoomMessage', async (payload) => {
    const messageDevice = await grabarMensaje(payload);

    for (const player of payload.chatRoom.players) {
      client.broadcast.to(player.user._id).emit('chatRoomMessage', {
        'text': payload.text,
        'de': payload.sender
      })

      io.to(player.user._id).emit('chatRoomMessage-recentChats', {
        'messageDevice': messageDevice[0]
      })
    }
  });

  client.on('newChatRoom', async (payload) => {
    const newChatRoom = await ChatRoom.findById(payload.chatRoom._id)
        .populate({
          path: 'lastMessage',
          populate: { path: 'sender' },
        })
        .populate({
          path: 'lastMessage',
          populate: { path: 'chatRoom' },
        })
        .populate({
          path: 'messages',
          options: {
            sort: {
              'createdAt': -1
            }
          }
        })
        .populate({
          path: 'players',
          populate: { path: 'user' },
        });

    for (const player of payload.chatRoom.players) {

      client.broadcast.to(player.user).emit('newChatRoom-recentChats', {
        'newChatRoom': newChatRoom,
      })

    }
  });

  console.log(client.rooms)

  client.on("disconnect", () => {
    usuarioDesconectado(uuid);
    client.leaveAll();
    client.disconnect()
    console.log("Cliente desconectado");
  });
});
