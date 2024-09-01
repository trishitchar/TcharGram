import sharp from "sharp";
import { Types } from 'mongoose';
import Cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
// Function to add a new post
export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const currentUserId = req.userId;
        if (!image) {
            return res.status(400).json({
                message: 'Provide an image',
                success: false,
            });
        }
        // Optimize the image using sharp
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await Cloudinary.uploader.upload(fileUri);
        // Create the post
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: new Types.ObjectId(currentUserId), // Ensure the ID is treated as an ObjectId
        });
        // Find the user and add the post reference
        const user = await User.findById(currentUserId);
        if (user) {
            user.posts.push(post._id); // Assert the type as ObjectId
            await user.save();
        }
        // Populate the author details
        await post.populate({ path: 'author', select: '-password' });
        return res.status(201).json({
            message: 'New post added',
            post,
            success: true,
        });
    }
    catch (error) {
        console.error("Error adding new post:", error.message);
        return res.status(500).json({ message: 'Server Error', success: false });
    }
};
// Corrected getAllPost function with sorting handled separately
export const getAllPost = async (req, res) => {
    try {
        // Fetch posts, populating 'author' and 'comments' without the nested sort
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' });
        // .populate({
        //     path: 'comments',
        //     populate: { path: 'author', select: 'username profilePicture' },
        // });
        // Optional: Manually sort comments within each post if needed
        posts.forEach(post => {
            // Assuming `post.comments` is an array, sort it by `createdAt` descending
            post.comments.sort((a, b) => b.createdAt - a.createdAt);
        });
        return res.status(200).json({ posts, success: true });
    }
    catch (error) {
        console.error("Error fetching posts:", error.message);
        return res.status(500).json({ message: 'Server Error', success: false });
    }
};
