// importing requirements
const mongoose = require('mongoose');


// creating task model
const categorySchema = new mongoose.Schema({
    taskCategory: {
        type: String,
        unique: true,
        max: [20, 'The category can not exceed 20 characters.'],
    },
});  // it will store the createdAt and updatedAt fields.

// exporting the task model
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;