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
    },
    password: {
        type: String,
        required: true,
        min: [6, 'Password must be atleast 6 characters long, we got {value}.'],
        max: [15, 'Password can not be longer than 15 characters.']
    }
});

// now export the user model
const User = mongoose.model('User', userSchema)
module.exports = User;