import mongoose from "mongoose";
import User from "../models/users.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { name, email, password } = req.body;

        if (!password || password.length < 6 || password.length > 50) {
            const error = new Error("Password must be between 6 and 50 characters long");
            error.statusCode = 400;
            throw error;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUsers = await User.create([{ name, email, password: hashedPassword }], { session });
        const token = jwt.sign({ id: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        await session.commitTransaction()
        session.endSession()
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                user: newUsers[0],
                token
            }
        })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error("Incorrect password");
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                user: userWithoutPassword,
                token
            }
        })
    } catch (error) {
        next(error);
    }
}

export const signOut = async (req, res, next) => {
    try {
        const { email, password } = req.body;
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
    } catch (error) {
        next(error);
    }
}