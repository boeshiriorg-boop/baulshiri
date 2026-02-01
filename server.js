const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let connectedUsers = {};

io.on('connection', (socket) => {
    socket.on('set-username', (username) => {
        socket.username = username;
        connectedUsers[socket.id] = username;
        io.emit('update-users', Object.values(connectedUsers));
    });

    socket.on('draw', (data) => {
        socket.broadcast.emit('draw', data);
    });

    socket.on('disconnect', () => {
        delete connectedUsers[socket.id];
        io.emit('update-users', Object.values(connectedUsers));
    });

    socket.on('clear', () => io.emit('clear'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));