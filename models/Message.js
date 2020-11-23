const { Schema, model } = require("mongoose");

const MessageSchema = Schema(
  {
      sender: { type: Schema.Types.ObjectId, ref: 'User' },
      time: Date,
      text: String,
      isLiked: Boolean,
      chatRoom: { type: Schema.Types.ObjectId, ref: 'ChatRoom' },
      unread: Boolean,
      language: String,
      messagePlayers: [{ type: Schema.Types.ObjectId, ref: 'MessagePlayer' }],
  },
  {
    timestamps: true,
  }
);

MessageSchema.method("toJSON", function () {
  const { __v, _id, ...obj } = this.toObject();
  return obj;
});

module.exports = model("Message", MessageSchema);
