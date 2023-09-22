const mongoose = require('mongoose');
let mongoURI = `${process.env.MONGO_URI}`;

const connectToMongo = async () => {
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
            console.log("Conneted to DB. OK!");
        })
        .catch((e) => {
            console.log("connection failed!!");
            console.log(e);
        });
};

module.exports = connectToMongo;