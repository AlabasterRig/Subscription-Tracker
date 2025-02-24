import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import mongoose from "mongoose";

export const GetUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        next(error);
    }
}

export const GetUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if(!user)
        {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
}

export const CreateUser = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {name, email, password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser)
        {
            const message = "User already exists";
            const error = new Error(message);
            error.statusCode = 409;
            throw error;
        }

        const passwordSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, passwordSalt);

        const newUser = await User.create([{name, email, password: hashedPassword}], {session});
        const token = jwt.sign({userId: newUser[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: newUser[0]
            }
        })

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}