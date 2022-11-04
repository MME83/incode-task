const { Schema, model } = require('mongoose');

const userRoles = require('../common/roles');

const userSchema = new Schema({
    email: {
        required: true,
        type: String,
        trim: true,
        match: /.+\@.+\..+/,
        unique: true
    },
    name: {
        required: true,
        type: String,
        minlength: 3,
        maxlength: 30,
        trim: true
    },
    password: {
        require: true,
        type: String,
        minlength: 8,
        maxlength: 30
    },
    roles: {
        type: String,
        default: userRoles.USER,
        enum: Object.values(userRoles)
    },
    boss: {
        type: Schema.Types.ObjectId,
        default: null,
        ref: 'Users',
        trim: true
    }
}, { timestamps: true });

module.exports = model('Users', userSchema);
