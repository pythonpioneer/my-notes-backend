// importing requirements
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

// mongodb setup
const mongoURI = process.env.MONGODB_URI;

// connecting to mongodb atlas server
const connectToMongo = async () => {
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
            console.log("Successfully Connected to MongoDB atlas");
        })
        .catch((err) => {
            console.log("Coneection Interrupted");
            console.log("error: ", err);
        });
};

module.exports = connectToMongo;