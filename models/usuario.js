const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  fullName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  online: {
    type: Boolean,
    default: false,
  },
});

UsuarioSchema.method("toJSON", function () {
  const { __v, _id, password, ...obj } = this.toObject();
  obj.uuid = _id;
  return obj;
});

module.exports = model("Usuario", UsuarioSchema);
