import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDataUri from '../utils/datauri.js';
import Cloudinary from '../utils/cloudinary.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            console.error("Missing fields:", { username, email, password });
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            // console.error("User already exists:", user);
            return res.status(401).json({
                message: "User already exists",
                success: false,
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword,
        });
        // console.log("User created successfully:", { username, email });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    }
    catch (error) {
        console.error("Registration error:", error.message);
        return res.status(500).json({ message: "Server Error", success: false });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            // console.error("Missing fields:", { email, password });
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }
        const isPasswordMatching = await bcrypt.compare(password, user.password);
        if (!isPasswordMatching) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '15d',
        });
        // Format user object again
        const userInfo = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: user?.posts,
            bookmarks: user?.bookmarks,
        };
        // console.log("User logged in:", userInfo);
        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: true, // Ensures the cookie is sent over HTTPS only
            sameSite: 'none', // Cookie is sent only for same-site requests
            maxAge: 15 * 24 * 60 * 60 * 1000, // 15 day expiration time
            path: '/', // Ensure cookie is available on all pages
        });
        return res.status(200).json({
            message: `Welcome back ${user.username}`,
            success: true,
            token,
            user: userInfo,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", success: false });
    }
};
export const logout = async (_, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: false,
            secure: true,
            sameSite: 'none',
            maxAge: 0,
            path: '/',
        });
        // return res.cookie("token", "", {maxAge:0}).json({
        //     message: 'logout done',
        //     success: 'true'
        // });
        return res.status(200).json({
            message: 'logout done',
            success: 'true'
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", success: false });
    }
};
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        // console.log( "getProfile", userId);
        const user = await User.findById(userId);
        // .populate({path:'posts', options:{sort:{createdAt: -1}}}).populate('bookmarks');
        if (!user) {
            return res.status(404).json({
                message: "user not found",
                success: false
            });
        }
        return res.status(200).json({
            message: "get profile successfully",
            user,
            success: true
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", success: false });
    }
};
// there's a flaw if I logged in with another so I've the token but still i can change other's profile description too, will impore later, have to check current id with the jwt decoced id, if same then proceed otherwise not
export const editProfile = async (req, res) => {
    try {
        const currentUserId = req.userId;
        // const userId = req.params.id; 
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        // Check if the current user is trying to edit their own profile
        // if (currentUserId !== userId) {
        //   return res.status(403).json({
        //     message: 'You are not authorized to edit this profile.',
        //     success: false,
        //   });
        // }
        let cloudResponse;
        // If a profile picture is uploaded, process and upload it to Cloudinary
        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            if (fileUri) {
                cloudResponse = await Cloudinary.uploader.upload(fileUri, { resource_type: 'auto' });
            }
            else {
                return res.status(400).json({ message: 'Failed to process image file.', success: false });
            }
        }
        // Fetch the user by their ID and exclude the password field
        const user = await User.findById(currentUserId).select('-password');
        // If the user does not exist, return a 404 error
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false,
            });
        }
        // Update the user's profile fields if they are provided
        if (bio)
            user.bio = bio;
        if (gender)
            user.gender = gender;
        if (profilePicture && cloudResponse)
            user.profilePicture = cloudResponse.secure_url;
        await user.save();
        return res.status(200).json({
            message: 'Profile updated successfully.',
            success: true,
            user,
        });
    }
    catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({
            message: 'Server error. Please try again later.',
            success: false,
        });
    }
};
export const followOrUnfollow = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const targetUserId = req.params.id;
        if (!currentUserId) {
            return res.status(401).json({ message: 'User not authenticated', success: false });
        }
        if (currentUserId === targetUserId) {
            return res.status(400).json({
                message: 'You cannot follow or unfollow yourself.',
                success: false,
            });
        }
        const targetUserObjectId = new mongoose.Types.ObjectId(targetUserId);
        const [currentUser, targetUser] = await Promise.all([
            User.findById(currentUserId),
            User.findById(targetUserObjectId),
        ]);
        if (!currentUser || !targetUser) {
            return res.status(404).json({
                message: 'User not found.',
                success: false,
            });
        }
        const isFollowing = currentUser.following.includes(targetUserObjectId);
        if (isFollowing) {
            // If already following, unfollow
            await Promise.all([
                User.updateOne({ _id: currentUserId }, { $pull: { following: targetUserObjectId } }),
                User.updateOne({ _id: targetUserObjectId }, { $pull: { followers: currentUserId } }),
            ]);
            return res.status(200).json({
                message: 'Unfollowed successfully.',
                success: true,
            });
        }
        else {
            // If not following, follow
            await Promise.all([
                User.updateOne({ _id: currentUserId }, { $push: { following: targetUserObjectId } }),
                User.updateOne({ _id: targetUserObjectId }, { $push: { followers: currentUserId } }),
            ]);
            return res.status(200).json({
                message: 'Followed successfully.',
                success: true,
            });
        }
    }
    catch (error) {
        console.error('Error in follow/unfollow operation:', error);
        return res.status(500).json({
            message: 'An error occurred while processing the follow/unfollow request.',
            success: false,
        });
    }
};
export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.userId } }).select('-password');
        if (!suggestedUsers || suggestedUsers.length === 0) {
            return res.status(404).json({
                message: 'No suggested users found.',
                success: false,
            });
        }
        return res.status(200).json({
            success: true,
            users: suggestedUsers,
        });
    }
    catch (error) {
        console.error('Error fetching suggested users:', error);
        return res.status(500).json({
            message: 'An error occurred while fetching suggested users.',
            success: false,
        });
    }
};
