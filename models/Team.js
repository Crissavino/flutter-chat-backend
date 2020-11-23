const { Schema, model } = require("mongoose");

const teamSchema = new Schema({
    name: String,
    chatRoom: { type: Schema.Types.ObjectId, ref: 'ChatRoom' },
    players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true
});

module.exports = model('Team', teamSchema);
