import { Server } from "socket.io";
import express from "express";
import http from 'http';
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173/',
        methods: ["GET", "POST"],
    }
});
// This map stores socket IDs corresponding to user IDs: userId -> socketId
const userSocketMap = {};
// Function to get the socket ID of a receiver by their user ID
export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};
// Handle connection events
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    // If a valid user ID is provided, store the mapping
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User connected: ${userId} -> Socket ID: ${socket.id}`);
    }
    // Emit the updated list of online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    // Handle disconnection events
    socket.on("disconnect", () => {
        if (userId && userSocketMap[userId]) {
            delete userSocketMap[userId];
            console.log(`User disconnected: ${userId}`);
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
    // Error handling for unexpected issues
    socket.on("error", (err) => {
        console.error(`Socket error: ${err}`);
    });
});
export { app, server, io };
