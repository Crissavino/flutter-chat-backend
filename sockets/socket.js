const { comprobarJWT } = require("../helpers/jwt");
const { io } = require("../index");
const ChatRoom = require("../models/ChatRoom");
const {
  usuarioConectado,
  usuarioDesconectado,
  grabarMensaje,
  readAllMessage,
  leaveChatRoomData,
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

  client.on('enterChatRoom', async (payload) => {
    await readAllMessage(payload);
  });

  client.on('leaveChatRoom', async (payload) => {
    const chatRoom = await leaveChatRoomData(payload);
    console.log(chatRoom)
    io.to(payload.user._id).emit('leaveChatRoom-recentChats', {
      'chatRoom': chatRoom,
    })
  });

  client.on('chatRoomMessage', async (payload) => {
    const deviceMessages = await grabarMensaje(payload);

    for (const player of payload.chatRoom.players) {

      client.broadcast.to(player.user._id).emit('chatRoomMessage', {
        'text': payload.text,
        'de': payload.sender
      });

      const messageDeviceFromPlayer = deviceMessages.find( (deviceMessage) => {
        return player.user.devices.filter((device) => device == deviceMessage.device).length > 0;
      })

      io.to(player.user._id).emit('chatRoomMessage-recentChats', {
        'messageDevice': messageDeviceFromPlayer
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
