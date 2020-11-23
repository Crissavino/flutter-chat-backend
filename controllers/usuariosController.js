const { response } = require("express");
const User = require("../models/User");

const getUsuarios = async (req, res = response) => {
  const desde = Number(req.query.desde) || 0;
  const usuarios = await User.find({ _id: { $ne: req.uuid } })
    .sort("-online")
    .skip(desde)
    .limit(20);

  res.json({
    ok: true,
    usuarios,
  });
};

const getAllUsers = async (req, res = response) => {
  const users = await User.find().populate('chatRooms').populate('devices').populate('player');
  res.json({ users });
};

module.exports = {
  getUsuarios,
  getAllUsers,
};
