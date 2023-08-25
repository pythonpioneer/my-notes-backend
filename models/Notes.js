// importing requirements
const mongoose = require('mongoose');
const { Schema } = mongoose;

// creating schema for notes
const notesSchema = new Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,  // linking notes with user
    },
    title: {
        type: String, 
        required: true,
    },
    description: {
        type: String,
    },
    tag: {
        type: String,
        default: "General",
    },
    timestamp: {
        type: String,
        default: Date.now,
    },
});

module.exports = mongoose.model('notes', notesSchema);