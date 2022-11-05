const { Schema, model } = require('mongoose');

const tokenSchema = new Schema({
    access_token: {
        type: String,
        required: true
    },
    refresh_token: {
        type: String,
        required: true
    },
    Users: {
        type: Schema.Types.ObjectId,
        ref: Users,
        required: true
    }
}, { timestamps: true });

module.exports = model(Tokens, tokenSchema);
