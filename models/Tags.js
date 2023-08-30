// importing requirements
const mongoose = require('mongoose');
const { Schema } = mongoose;

// creating a tag schema
const tagSchema = new Schema({
    tag: {
        type: String,
    }
});

module.exports = mongoose.model('tags', tagSchema);