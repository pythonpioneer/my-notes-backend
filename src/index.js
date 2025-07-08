// importing requirements
const connectToMongo = require('./connectionDB/db');
const express = require('express');
const cors = require("cors");
const { PORT, APIPATH } = require('./constants');
const { Server } = require("socket.io");    
const http = require('http');


// connecting with mongodb atlas server
connectToMongo();

// development environment specifications
const app = express();

// creating a http server so we can attach web-socket
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],  // for handshake 
    }
});

// to store connected users and sockets
io.on('connection', (socket) => {
    console.log(`User connected with socket ID: ${socket.id}`);

    // listen for user joining with userId
    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`Socket ${socket.id} joined room ${userId}`);
    });

    // listen for note creation
    socket.on('note:add', ({ userId, note }) => {
        socket.to(userId).emit('note:added', note);
    });

    // listen for note update
    socket.on('note:update', ({ userId, note }) => {
        socket.to(userId).emit('note:updated', note);
    });

    // listen for note delete events
    socket.on('note:delete', ({ userId, noteId }) => {
        socket.to(userId).emit('note:deleted', noteId);
    });

    // listen for note complete events
    socket.on('note:complete', ({ userId, note }) => {
        socket.to(userId).emit('note:completed', note);
        socket.to(userId).emit('note:section-added', note);
    });

    // listen for note undo complete events
    socket.on('note:undo-complete', ({ userId, note }) => {
        socket.to(userId).emit('note:undo-completed', note);
        socket.to(userId).emit('note:section-added', note);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// to use req.body, we have to use this middleware
app.use(express.json());
app.use(cors());

// available routes for API
app.use(APIPATH + 'user', require('./routes/user'));
app.use(APIPATH + 'notes', require('./routes/task'));
app.use(APIPATH + 'verify', (_, res) => {
    res.status(200).json({ status: 200, message: "App is Running", info: "to test only." });
});

// running the app
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Notes app listening on port http://localhost:${PORT}`);
});