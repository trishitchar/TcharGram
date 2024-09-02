import express, { Request, Response } from 'express';
import sharp from "sharp";
import { Types } from 'mongoose'; 
import Cloudinary from "../utils/cloudinary.js";
import { Post, IPost } from "../models/post.model.js";  
import { User, IUser } from "../models/user.model.js";  
import { Comment } from '../models/comment.model.js';

// Define AuthenticatedRequest interface
interface AuthenticatedRequest extends Request {
    userId?: string; 
}

// Function to add a new post
export const addNewPost = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
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
        const post: IPost = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: new Types.ObjectId(currentUserId), // Ensure the ID is treated as an ObjectId
        });

        // Find the user and add the post reference
        const user: IUser | null = await User.findById(currentUserId);
        if (user) {
            user.posts.push(post._id as Types.ObjectId); // Assert the type as ObjectId
            await user.save();
        }
        
        // Populate the author details
        await post.populate({ path: 'author', select: '-password' });
        
        return res.status(201).json({
            message: 'New post added',
            post,
            success: true,
        });
    } catch (error: any) {
        console.error("Error adding new post:", error.message);
        return res.status(500).json({ message: 'Server Error', success: false });
    }
};

export const deletePost = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
        const currentUserId = req.userId;
        // this postId is only the key
        const postId = req.params.id;

        // this post is an entire object id
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                message: 'Post not found',
                success: false
            })
        }

        if(post.author.toString() !== currentUserId){
            return res.status(403).json(
                { message: 'Unauthorized person cannott delete', success: false }
            )
        }

        // so we should not pass the whole post obj, rather give the postId
        await Post.findByIdAndDelete(postId);

        await User.findByIdAndUpdate(currentUserId, {$pull: {posts: postId}});
        await Comment.deleteMany({ post: postId });

        return res.status(200).json({ message: 'Post deleted', success: true });
    } catch (error:any) {
        console.error("Error deleting post:", error.message);
        return res.status(500).json({ message: 'Server error', success: false });
    }
}

// Corrected getAllPost function with sorting handled separately
export const getAllPost = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Fetch posts, populating 'author' and 'comments' without the nested sort
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            // .populate({
            //     path: 'comments',
            //     populate: { path: 'author', select: 'username profilePicture' },
            // });

        // Optional: Manually sort comments within each post if needed
        posts.forEach(post => {
            // Assuming `post.comments` is an array, sort it by `createdAt` descending
            post.comments.sort((a: any, b: any) => b.createdAt - a.createdAt);
        });

        return res.status(200).json({ posts, success: true });
    } catch (error: any) {
        console.error("Error fetching posts:", error.message);
        return res.status(500).json({ message: 'Server Error', success: false });
    }
};

export const currentUserPost = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
        const currentUserId = req.userId;

        // Fetch posts by the current user
        const posts = await Post.find({ author: currentUserId })
            .sort({ createdAt: -1 }) // Sort posts by creation date in descending order
            .populate({ path: 'author', select: 'username profilePicture' }) // Populate author details
            // .populate({
            //     path: 'comments', // Populate comments and their authors
            //     populate: {
            //         path: 'author',
            //         select: 'username profilePicture',
            //     },
            // });

        // Sort comments within each post if necessary
        posts.forEach(post => {
            if (post.comments && Array.isArray(post.comments)) {
                post.comments.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            }
        });

        // Return the posts with a success message
        return res.status(200).json({ posts, success: true });
    } catch (error: any) {
        console.error("Error getting user's posts:", error.message);
        return res.status(500).json({ message: 'Failed to retrieve user posts. Please try again.', success: false });
    }
};

export const likePost = async (req:AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
        const currentUserId = req.userId;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({ message: 'Post not found', success: false });
        }

        // Add like to the post - only one by any user
        await post.updateOne({ $addToSet: { likes: currentUserId } });
        
        // Get the user who liked the post
        const user = await User.findById(currentUserId).select('username profilePicture');

        
        // Notify the post owner
        const postOwnerId = post.author.toString();
        // if (postOwnerId !== userId) {
        //     const notification = {
        //         type: 'like',
        //         userId,
        //         userDetails: user,
        //         postId,
        //         message: 'Your post was liked',
        //     };
        //     const postOwnerSocketId = getReceiverSocketId(postOwnerId);
        //     io.to(postOwnerSocketId).emit('notification', notification);
        // }
        return res.status(200).json({ message: 'Post liked', success: true });
    } catch (error: any) {
        console.error("Error liking the post:", error.message);
        return res.status(500).json({ message: 'Server error', success: false });
    }
}

export const dislikePost = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
        const currentUserId = req.userId;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        // Remove like from the post
        await post.updateOne({ $pull: { likes: currentUserId } });

        // Get the user who disliked the post
        const user = await User.findById(currentUserId).select('username profilePicture');

        // Notify the post owner
        const postOwnerId = post.author.toString();
        // if (postOwnerId !== currentUserId) {
        //     const notification = {
        //         type: 'dislike',
        //         currentUserId,
        //         userDetails: user,
        //         postId,
        //         message: 'Your post was disliked',
        //     };
        //     const postOwnerSocketId = getReceiverSocketId(postOwnerId);
        //     io.to(postOwnerSocketId).emit('notification', notification);
        // }

        return res.status(200).json({ message: 'Post disliked', success: true });
    } catch (error: any) {
        console.error("Error disliking the post:", error.message);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};

export const addComment = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
        const currentUserId = req.userId;
        const postId = req.params.id;
        const {text} = req.body;

        if (!text) return res.status(400).json({ message: 'Commnets Text is required', success: false });

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        const comment = await Comment.create({ text, author: currentUserId, post: postId });
        await comment.populate({ path: 'author', select: 'username profilePicture' });

        post.comments.push(comment._id as Types.ObjectId);
        await post.save();

        return res.status(201).json({ message: 'Comment added', comment, success: true });
    } catch (error: any) {
        console.error("Error adding comment:", error.message);
        return res.status(500).json({ message: 'Server error', success: false });
    }
}

export const getCommentsOfPost = async (req:Request, res:Response): Promise<Response> =>{
    try {
        const postId = req.params.id;
        const comments = await Comment.find({post: postId})
        .populate('author', 'username profilePicture');

        if(!comments || comments.length === 0 ){
            return res.status(404).json({
                message: 'No comment found for this post',
                success: false
            })
        }
        return res.status(200).json({
            comments,
            success: true
        })
    } catch (error: any) {
        console.error("Error fetching comments:", error.message);
        return res.status(500).json({ message: 'Server error', success: false });
    }
}

export const deleteComment = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
        const commentId = req.params.id; // Get the comment ID from the request parameters
        const currentUserId = req.userId; // Get the user ID from the authenticated request

        // Find the comment by ID
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found', success: false });

        // Check if the user is the author of the comment
        if (comment.author.toString() !== currentUserId) {
            return res.status(403).json({ message: 'Unauthorized to delete this comment', success: false });
        }

        // Find the post associated with the comment
        const post = await Post.findById(comment.post);
        if (!post) return res.status(404).json({ message: 'Associated post not found', success: false });

        // Remove the comment ID from the post's comments array
        post.comments = post.comments.filter((id) => id.toString() !== commentId);
        await post.save();

        // Delete the comment from the database
        await Comment.findByIdAndDelete(commentId);

        return res.status(200).json({ message: 'Comment deleted successfully', success: true });
    } catch (error: any) {
        console.error('Error deleting comment:', error.message);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};

