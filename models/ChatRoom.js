const { Schema, model } = require("mongoose");

const chatRoomSchema = new Schema({
    name: String,
    description: String,
    isPinned: Boolean,
    unreadMessages: Boolean,
    image: String,
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
    admins: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
    owner: { type: Schema.Types.ObjectId, ref: 'Player' },
}, {
    timestamps: true
});

module.exports = model('ChatRoom', chatRoomSchema);
