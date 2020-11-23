const { Schema, model } = require("mongoose");

const playerSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
}, {
    timestamps: true
});

module.exports = model('Player', playerSchema);
