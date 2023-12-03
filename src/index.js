// importing requirements
const connectToMongo = require('./connectionDB/db');
const dotenv = require('dotenv').config();
const express = require('express');
const cors = require("cors");


// connecting with mongodb atlas server
connectToMongo();

// development environment specifications
const app = express();
const PORT = process.env.PORT  || 2100;
const APIPATH = process.env.API_PATH;  // this can be any string, a starting path for the API

// to use req.body, we have to use this middleware
app.use(express.json());
app.use(cors());

// available routes for API
app.use(APIPATH + 'user', require('./routes/user'));
app.use(APIPATH + 'task', require('./routes/task'));

// running the app
app.listen(PORT, () => {
    console.log(`TODO app listening on port http://localhost:${PORT}`);
});