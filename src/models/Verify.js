// importing requirements
const mongoose = require('mongoose');


// creating schema for users
const verificationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    otp: {
        type: String,
        required: true,
        min: [4, 'Password must be atleast 4 characters long.'],
        max: [4, 'Password must be atleast 4 characters long.'],
    },
    active: {  // this must be deactivated after changing the password
        type: Boolean,
        required: true,
        default: true,  // make it false after changing password
    },
    timeStamp: {  // delete this record after 2 mins
        type: Date,
        expires: 120,
        default: Date.now,
    }
});

// now export the user model
const Verify = mongoose.model('verify', verificationSchema)
module.exports = Verify;