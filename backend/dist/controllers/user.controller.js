import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
        if (!isPasswordMatching) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '15d' });
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", success: false });
    }
};
export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'logout done',
            success: 'true'
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", success: false });
    }
};
