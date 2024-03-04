// importing requirements
const mongoose = require('mongoose');


// creating task model
const notesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        max: [200, 'The title can not exceed 100 characters.'],
    },
    desc: {
        type: String,
        max: [5000, 'The description can not exceed 1000 characters.'],
    },
    category: {
        type: String,
        max: [100, 'The category can not exceed 20 characters.'],
        default: "General"
    },
    isCompleted: {  // feature not enabled yet
        type: Boolean,
        default: false,
        required: true,
    }
}, { timestamps: true });  // it will store the createdAt and updatedAt fields.

// exporting the task model
const Notes = mongoose.model('notes', notesSchema);
module.exports = Notes;