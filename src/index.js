// importing requirements
const connectToMongo = require('./connectionDB/db');
const express = require('express');
const cors = require("cors");
const { PORT, APIPATH } = require('./constants');


// connecting with mongodb atlas server
connectToMongo();

// development environment specifications
const app = express();

// to use req.body, we have to use this middleware
app.use(express.json());
app.use(cors());

// available routes for API
app.use(APIPATH + 'user', require('./routes/user'));
app.use(APIPATH + 'notes', require('./routes/task'));

// running the app
app.listen(PORT, () => {
    console.log(`TODO app listening on port http://localhost:${PORT}`);
});