const {Schema, model} = require("mongoose");

const DeviceSchema = Schema(
    {
        type: String,
        language: String,
        deviceMessages: [{type: Schema.Types.ObjectId, ref: 'DeviceMessage'}],
        deviceId: {
            type: String,
            require: true,
            default: "",
        },
        user: {
            type: Schema.Types.ObjectId,
            require: true,
            ref: "User",
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
    const {__v, _id, ...obj} = this.toObject();
    return obj;
});

module.exports = model("Device", DeviceSchema);
