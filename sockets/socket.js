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
  client.join(uuid);

  // escuchar del cliente mensaje-personal
  client.on("mensaje-personal", async (payload) => {
    // TODO grabar mensaje
    await grabarMensaje(payload);

    io.to(payload.para).emit("mensaje-personal", payload);
  });

  client.on("disconnect", () => {
    usuarioDesconectado(uuid);
    console.log("Cliente desconectado");
  });
});
