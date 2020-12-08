const { response } = require("express");
const User = require("../models/User");
const Device = require("../models/Device");
const bcrypt = require("bcryptjs");
const CreateUserRequest = require("../src/Users/Infrastucture/Classes/CreateUserRequest");
const {MongooseDeviceMessageRepository} = require("../src/DeviceMessages/Infrastucture/Repositories/MongooseDeviceMessageRepository");
const {MongooseDeviceRepository} = require("../src/Devices/Infrastucture/Repositories/MongooseDeviceRepository");
const {MongoosePlayerRepository} = require("../src/Players/Infrastucture/Repositories/MongoosePlayerRepository");
const {MongooseUserRepository} = require("../src/Users/Infrastucture/Repositories/MongooseUserRepository");
const {OneUserCanRegisterCommandHandler} = require("../src/Users/Application/UseCase/OneUserCanRegister/OneUserCanRegisterCommandHandler");
const {OneUserCanRegisterCommand} = require("../src/Users/Application/UseCase/OneUserCanRegister/OneUserCanRegisterCommand");
const { generateJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { nombre, email, password } = req.body;

  try {
    const existeEmail = await User.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "Las credenciales no son validas",
      });
    }
    const usuario = new User(req.body);

    // encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    // generar JWT
    const token = await generateJWT(usuario.id);

    const device = new Device({
      JWToken: token,
    });

    await device.save();

    res.json({
      ok: true,
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password, deviceId, deviceType, language } = req.body;
  try {
    const usuarioDB = await User.findOne({ email })
        .populate({
          path: 'devices',
        })
        .populate({
          path: 'player',
        })
        .populate({
          path: 'chatRooms',
          populate: {
            path: 'messages',
            populate: {
              path: 'messagePlayers',
            },
          },
        });
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Credenciales no validas",
      });
    }

    // validar password
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Credenciales no validas",
      });
    }

    const token = await generateJWT(usuarioDB.id);

    const isDeviceRegister = usuarioDB.devices.filter((device) => device.deviceId === deviceId).length;

    if (!isDeviceRegister) {
      const deviceRepository = new MongooseDeviceRepository();
      const deviceMessageRepository = new MongooseDeviceMessageRepository();
      const { device, userUpdated, _ } = await deviceRepository.create(usuarioDB, usuarioDB.player, deviceId, deviceType, language, token);

      if (usuarioDB.chatRooms.length > 0) {
        for (const chatRoom of usuarioDB.chatRooms) {

          for (const message of chatRoom.messages) {

            for (const messagePlayer of message.messagePlayers) {
              const isMe = String(usuarioDB.player._id) === String(messagePlayer.player._id);
              if (isMe) {
                const {_, __} = await deviceMessageRepository.createDeviceMessage(
                    messagePlayer.sender, messagePlayer, device, chatRoom, message, usuarioDB.player, (String(usuarioDB._id) !== String(messagePlayer.sender._id))
                );
              }
            }
          }
        }
      }

      res.json({
        ok: true,
        usuario: userUpdated,
        token,
      });
    } else {
      res.json({
        ok: true,
        usuario: usuarioDB,
        token,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const renewToken = async (req, res = response) => {
  const uuid = req.uuid;

  const token = await generateJWT(uuid);

  const usuarioDB = await User.findById(uuid)
      .populate({
        path: 'chatRooms',
      })
      .populate({
        path: 'devices',
      })
      .populate({
        path: 'player',
      });

  res.json({
    ok: true,
    user: usuarioDB,
    token,
  });
};

// NUEVAS FUNCIONES DEL OTRO REPO
const create = async (req, res) => {

  const userRepository = new MongooseUserRepository();
  const playerRepository = new MongoosePlayerRepository();
  const deviceRepository = new MongooseDeviceRepository();

  const requestResponse = new CreateUserRequest(req).trigger();

  if (!requestResponse.success) {
    res.json({ "success": false });
  }

  const command = new OneUserCanRegisterCommand(
      requestResponse.fullName,
      requestResponse.email,
      requestResponse.password,
      requestResponse.type,
      requestResponse.language,
      requestResponse.deviceId,
  );

  const response = await new OneUserCanRegisterCommandHandler(
      userRepository,
      playerRepository,
      deviceRepository
  ).handler(command);

  if (!response.success) {
    res.json({ "success": false , 'message': response.message});
  }

  res.json( response );

}

module.exports = {
  crearUsuario,
  loginUsuario,
  renewToken,
  create,
};
