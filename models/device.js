const { Schema, model } = require("mongoose");

const DeviceSchema = Schema(
  {
    deviceId: {
      type: String,
      require: true,
      default: "",
    },
    user: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "Usuario",
    },
    JWToken: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

DeviceSchema.method("toJSON", function () {
  const { __v, _id, ...obj } = this.toObject();
  return obj;
});

module.exports = model("Devie", DeviceSchema);
