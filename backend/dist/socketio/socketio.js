import { Server } from "socket.io";
import express from "express";
import http from 'http';
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'https://tchargram.vercel.app', 'https://social-media-tchar.onrender.com'],
        methods: ["GET", "POST"],
    },
    pingTimeout: 60000,
});
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
        io.emit("userOnline", userId);
    }
    // Notify all clients of the updated list of online users
    io.emit("onlineUsers", Object.keys(userSocketMap));
    // Handle sending private messages
    socket.on("sendMessage", ({ message }) => {
        console.log("Received message:", message);
        const receiverSocketId = getReceiverSocketId(message.receiverId);
        // Send the message to the receiver if they're online
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("getMessage", message);
        }
    });
    // Handle disconnection events
    // socket.on("disconnect", () => {
    //   if (userId && userSocketMap[userId]) {
    //     delete userSocketMap[userId];
    //     console.log(`User disconnected: ${userId}`);
    //   }
    //   io.emit("onlineUsers", Object.keys(userSocketMap));
    // });
    socket.on("typing", ({ receiverId }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("typing", { senderId: userId });
        }
    });
    socket.on("stopTyping", ({ receiverId }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("stopTyping", { senderId: userId });
        }
    });
    socket.on("disconnect", () => {
        if (userId) {
            delete userSocketMap[userId];
            console.log(`User disconnected: ${userId}`);
            io.emit("userOffline", userId);
            // Emit the updated list of online users to all clients
            // io.emit("onlineUsers", Object.keys(userSocketMap));
        }
    });
    // Handle errors
    socket.on("error", (err) => {
        // console.error(`Socket error: ${err}`);
        console.error(`Socket error for user ${userId}:`, err);
    });
});
export { app, server, io };
