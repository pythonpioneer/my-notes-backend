// importing requirements
const mongoose = require('mongoose');
const { Schema } = mongoose;

// creating schema for users
const userSchema = new Schema({
    name: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    timestmp: {
        type: Date,
        default: Date.now,
    }
});

const User = mongoose.model('user', userSchema);
module.exports = User;