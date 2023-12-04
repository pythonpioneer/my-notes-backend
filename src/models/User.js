// importing requirements
const mongoose = require('mongoose');


// creating schema for users
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    fullName: {
        type: String,
        required: true,
        max: [30, 'Password can not be longer than 30 characters.']
    },
    password: {
        type: String,
        required: true,
        min: [6, 'Password must be atleast 6 characters long.'],
        max: [15, 'Password can not be longer than 15 characters.']
    }
});

// now export the user model
const User = mongoose.model('user', userSchema)
module.exports = User;