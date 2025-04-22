// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: "*",
//     },
// });
// app.use(
//     cors({
//         origin: "http://localhost:5173",
//     })
// );

// // Handle socket connections
// io.on("connection", (socket) => {
//     console.log(`User connected: ${socket.id}`);

//     // Handle room joining
//     socket.on("join-room", (roomId) => {
//         socket.join(roomId);
//         console.log(`Socket ${socket.id} joined room ${roomId}`);
//     });

//     // Relay signaling messages between peers
//     socket.on("signal", (data) => {
//         data.from = socket.id; // Sender's ID is added
//         console.log("Signal received:", data);
//         socket.to(data.to).emit("signal", data);
//     });

//     // Handle disconnection
//     socket.on("disconnect", () => {
//         console.log(`User disconnected: ${socket.id}`);
//     });
// });

// // Start the server
// const PORT = 5500;
// server.listen(PORT, () => console.log(`Signaling server running on port ${PORT}`));

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

app.use(cors({ origin: "http://localhost:5173" }));

let users = {}; // Store active users

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    users[socket.id] = socket.id;

    // Notify existing users about the new peer
    socket.broadcast.emit("new-peer", socket.id);

    // Handle signaling messages
    socket.on("signal", (data) => {
        data.from = socket.id;
        console.log("Signal received:", data);

        if (users[data.to]) {
            io.to(data.to).emit("signal", data);
        }
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        delete users[socket.id]; // Remove from active users
    });
});

// Start the server
const PORT = 5500;
server.listen(PORT, () => console.log(`Signaling server running on port ${PORT}`));
