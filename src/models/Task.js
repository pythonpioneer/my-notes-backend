// importing requirements
const mongoose = require('mongoose');


// creating task model
const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    taskTitle: {
        type: String,
        max: [40, 'The title can not exceed 40 characters.'],
    },
    taskDesc: {
        type: String,
        max: [200, 'The description can not exceed 200 characters.'],
    },
    taskCategory: {
        type: String,
        max: [20, 'The category can not exceed 20 characters.'],
        default: "General"
    },
    isCompleted: {
        type: Boolean,
        default: false,
        required: true,
    }
}, { timestamps: true });  // it will store the createdAt and updatedAt fields.

// exporting the task model
const Task = mongoose.model('Task', taskSchema);
module.exports = Task;