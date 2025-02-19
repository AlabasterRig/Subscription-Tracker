import mongoose from "mongoose"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';

// Sign Up Logic
export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    // Create New User
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser)
        {
            const message = 'User already exists';
            const error = new Error(message);
            error.statusCode = 409;
            throw error;
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{name, email, password: hashedPassword}], {session});
        const token = jwt.sign({userId: newUsers[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
        await session.commitTransaction();
        session.endSession();
        
        res.status(201).json ({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                user: newUsers[0]
            }
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

// Sign In Logic
export const signIn = async (req, res, next) => {

}

// Sign Out Logic
export const signOut = async (req, res, next) => {

}