const { Schema, model } = require("mongoose");

const MensajeSchema = Schema(
  {
    de: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "Usuario",
    },
    para: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "Usuario",
    },
    mensaje: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

MensajeSchema.method("toJSON", function () {
  const { __v, _id, ...obj } = this.toObject();
  return obj;
});

module.exports = model("Mensaje", MensajeSchema);
