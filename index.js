// importing requirements
const connectToMongo = require('./db');
const express = require('express');

// mongo connection
connectToMongo();

const app = express();
const port = 3100;

// to use req.body, we have to use this middleware
app.use(express.json());

// all availble routing for the api
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/notes', require('./routes/notes.js'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});