import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getReceiverSocketId, io } from '../socketio/socketio.js';
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.userId;
        const receiverId = req.params.id;
        // extract { textMessage: "Hello there!" } -> saved to message varable
        const { textMessage: message } = req.body;
        // finding if ther's any convertion between sender and reciever happened before
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });
        // if not then create a new one
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }
        // creating a new message document
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        // If message is created successfully, add it to the conversation's message array
        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }
        // Save both conversation and new message
        await Promise.all([conversation.save(), newMessage.save()]);
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }
        return res.status(201).json({
            success: true,
            newMessage,
        });
    }
    catch (error) {
        console.error('Error sending message:', error.message);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};
export const getMessage = async (req, res) => {
    try {
        const senderId = req.userId;
        const receiverId = req.params.id;
        // const page = parseInt(req.query.page as string) || 1;
        // const limit = parseInt(req.query.limit as string) || 20;
        // const skip = (page - 1) * limit;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        })
            // .populate({
            // path: 'messages',
            // options: {
            //     sort: { createdAt: -1 }, // Sort by latest messages
            //     skip: skip,
            //     limit: limit,
            // }
            // });
            .populate('messages');
        if (!conversation) {
            return res.status(200).json({ success: true, messages: [] });
        }
        return res.status(200).json({ success: true, messages: conversation.messages });
    }
    catch (error) {
        console.error('Error getting messages:', error.message);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};
