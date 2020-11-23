const { Schema, model } = require("mongoose");

const messagPlayerSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    message: { type: Schema.Types.ObjectId, ref: 'Message' },
    deviceMessages: [{ type: Schema.Types.ObjectId, ref: 'DeviceMessage' }],
    player: { type: Schema.Types.ObjectId, ref: 'Player' },
    chatRoom: { type: Schema.Types.ObjectId, ref: 'ChatRoom' },
    time: Date,
    text: String,
    isLiked: Boolean,
    unread: Boolean,
    language: String
}, {
    timestamps: true
});

module.exports = model('MessagePlayer', messagPlayerSchema, 'messageplayers');
