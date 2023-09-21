const mongoose = require('mongoose');
const mongoURI = `${process.env.MONGO_URI}/my-notes`;

const connectToMongo = async () => {
    mongoose.connect(mongoURI);
    console.log("Conneted to DB. OK!");
};

module.exports = connectToMongo;