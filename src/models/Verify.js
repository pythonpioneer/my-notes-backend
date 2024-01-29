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
        min: [4, 'Password must be atleast 6 characters long.'],
        max: [4, 'Password must be atleast 6 characters long.'],
    },
    timeStamp: {  // delete this record after 15 mins
        type: Date,
        expires: 900,  
        default: Date.now,
    }
});

// now export the user model
const Verify = mongoose.model('verify', verificationSchema)
module.exports = Verify;