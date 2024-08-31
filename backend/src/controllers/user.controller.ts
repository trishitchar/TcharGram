import express, {Request, Response}from 'express'
import {User} from '../models/user.model.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import getDataUri from '../utils/datauri.js';
import Cloudinary from '../utils/cloudinary.js';

export const register = async (req: Request, res: Response): Promise<Response> => {
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
            console.error("User already exists:", user);
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

        console.log("User created successfully:", { username, email });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error: any) {
        console.error("Registration error:", error.message);
        return res.status(500).json({ message: "Server Error", success: false });
    }
}

export const login = async (req:Request, res:Response) : Promise<Response> =>{
    try{
        const { email, password } = req.body;

        if (!email || !password) {
            console.error("Missing fields:", { email, password });
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
        if(!isPasswordMatching){
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY as string, { expiresIn: '15d' });

        // Format user object
        const userInfo = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            // posts: populatedPosts
        };

        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user: userInfo
        });
    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", success: false });
    }
}

export const logout = async(_:Request, res:Response) : Promise<Response> =>{
    try {
        return res.cookie("token", "", {maxAge:0}).json({
            message: 'logout done',
            success: 'true'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", success: false });
    }
}

export const getProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.params.id;
        console.log(userId)
        const user = await User.findById(userId);
        // .populate({path:'posts', options:{sort:{createdAt: -1}}}).populate('bookmarks');
        if(!user){
            return res.status(404).json({
                message: "user not found",
                success: false
            })
        }
        return res.status(200).json({
            user,
            success: true
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", success: false });
    }
}

export const editProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.params.id;
      const { bio, gender } = req.body;
      const profilePicture = req.file;
      let cloudResponse;
  
      if (profilePicture) {
        const fileUri = getDataUri(profilePicture);
        const fileUriString = String(fileUri);
  
        if (fileUriString) {
          cloudResponse = await Cloudinary.uploader.upload(fileUriString, { resource_type: 'auto' });
        } else {
          return res.status(400).json({ message: 'Failed to process image file.', success: false });
        }
      }
  
      const user = await User.findById(userId).select('-password');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.', success: false });
      }
  
      if (bio) user.bio = bio;
      if (gender) user.gender = gender;
      if (profilePicture && cloudResponse) user.profilePicture = cloudResponse.secure_url;
  
      await user.save();
  
      return res.status(200).json({
        message: 'Profile updated.',
        success: true,
        user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server Error', success: false });
    }
  };
