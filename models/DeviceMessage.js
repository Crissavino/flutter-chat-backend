const { Schema, model } = require("mongoose");

const deviceMessagSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    messagePlayer: { type: Schema.Types.ObjectId, ref: 'MessagePlayer' },
    device: { type: Schema.Types.ObjectId, ref: 'Device' },
    chatRoom: { type: Schema.Types.ObjectId, ref: 'ChatRoom' },
    time: Date,
    text: String,
    isLiked: Boolean,
    unread: Boolean,
    language: String
}, {
    timestamps: true
});

module.exports = model('DeviceMessage', deviceMessagSchema, 'devicemessages');
