const { Schema, model } = require("mongoose");

const UserSchema = Schema({
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
  imageUrl: String,
  chatRooms: [{ type: Schema.Types.ObjectId, ref: 'ChatRoom' }],
  devices: [{ type: Schema.Types.ObjectId, ref: 'Device' }],
  player: { type: Schema.Types.ObjectId, ref: 'Player' },
});

UserSchema.method("toJSON", function () {
  const { __v, password, ...obj } = this.toObject();
  return obj;
});

module.exports = model("User", UserSchema);
