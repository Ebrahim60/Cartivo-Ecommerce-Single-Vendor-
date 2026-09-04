import jwt from 'jsonwebtoken';
import { User } from "../models/userModel.js";
import { sendEmail } from "../services/sendMail.js";
import {
    loginSchema,
    registerUserSchema
} from "../validation/validation.js";

//Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

//Contoller for login user
export const login = async (req, res, next) => {
    try {
        const { error, value } = loginSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            })
        };

        const { email, password } = value;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "User does not exists with this email",
            });
        };

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            })
        };

        const token = generateToken(user._id);

        res.status(200).cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000)
        }).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        next(error);
    }
};

//contoller for register a new user
export const registerUser = async (req, res, next) => {
    try {
        const { error, value } = registerUserSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            })
        };

        const { name, email, password } = value;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exist with this email"
            })
        };

        const user = await User.create({
            name, email, password
        });

        if (user) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            const message = `Welcome to Cartivo, ${name}! Thank you for connect with us.We are excited to have you as part of our community.Your OTP for Cartivo registration is: ${otp}`;

            await sendEmail(email, 'Welcome to Cartivo - Your OTP for Registration', message);

            const token = generateToken(user._id);

            res.status(201).cookie("token", token, {
                httpOnly: true,
                expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 1000)
            }).json({
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token
                },
                message: "User registration successfull.Please check you email...",
            });
        } else {
            res.status(400).json({
                mesage: "Invalid user data",
            });
        };
    } catch (error) {
        next(error);
    }
};

//get all user [admin]
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select("-password");

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};