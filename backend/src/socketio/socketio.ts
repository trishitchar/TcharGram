import { Server } from "socket.io";
import express from "express";
import http from 'http';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://tchargram.vercel.app', 'https://social-media-tchar.onrender.com'],
    methods: ["GET", "POST"],
  }
});

// Stores socket IDs mapped to user IDs
// This map stores socket IDs corresponding to user IDs: userId -> socketId
const userSocketMap: { [key: string]: string } = {};

// Function to get the socket ID of a receiver by their user ID
export const getReceiverSocketId = (receiverId: string): string | undefined => {
  return userSocketMap[receiverId];
};
// Handle connection events
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string;

  // If a valid user ID is provided, store the mapping
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User connected: ${userId} -> Socket ID: ${socket.id}`);
  }

  // Notify all clients of the updated list of online users
  io.emit("onlineUsers", Object.keys(userSocketMap));

  // Handle sending private messages
  socket.on("sendMessage", ({ receiverId, message }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", {
        senderId: userId,
        message
      });
    }
  });

  // Handle disconnection events
  socket.on("disconnect", () => {
    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
      console.log(`User disconnected: ${userId}`);
    }
    io.emit("onlineUsers", Object.keys(userSocketMap));
  });

  // Handle errors
  socket.on("error", (err) => {
    console.error(`Socket error: ${err}`);
  });
});

export { app, server, io };