// Server-side code
 import express from 'express';
 import path from 'path';
 import { createServer } from 'http';
  import { Server } from 'socket.io';

const app = express();

// Define the __dirname variable
const __dirname = path.resolve();

const httpServer = createServer(app);
const io = new Server(httpServer);

// Serve the client HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/chat.html');
});

// Variable to hold the number of connected clients
let connectedClients = 0;

// Handle client connection
io.on('connection', (socket) => {
    connectedClients++;
    io.emit('client-count', connectedClients); // Notify all clients about the updated client count
    console.log(`Client connected. Total clients: ${connectedClients}`);


    socket.emit('welcome', 'Welcome to Chat Server!!!!');

    // Handle incoming chat messages
    socket.on('message', (chatInfo) => {
        console.log(chatInfo);
        io.emit('new-message', chatInfo); // Broadcast the message to all clients
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
        connectedClients--;
        io.emit('client-count', connectedClients); // Notify all clients about the updated client count
        console.log(`Client disconnected. Total clients: ${connectedClients}`);
    });
});

// Broadcast server time periodically
setInterval(() => {
    io.emit('server-time', new Date().toTimeString());
}, 1000);

httpServer.listen(3000, () => {
    console.log('Listening on port 3000');
});
