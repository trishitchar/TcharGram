import express, {Request, Response}from 'express'
import {User} from '../models/user.model.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

export const register = async (req: Request, res: Response): Promise<void | Response> => {
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
