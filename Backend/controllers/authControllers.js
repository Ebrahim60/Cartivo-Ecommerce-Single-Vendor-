import jwt from 'jsonwebtoken';
import { User } from "../models/userModel.js";
/*
import { sendEmail } from "../services/sendMail.js";
import {
    registrationOTPTemplate,
    resendOTPTemplate,
} from "../services/emailTemplates.js"
*/
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

        if (!user.verified) {
            return res.status(403).json({
                message: "Please verify your email before logging in",
            });
        }

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
            /*
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.otp = otp;
            user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
            await user.save();

            const { html, text } = registrationOTPTemplate(name, otp);
            await sendEmail(
                email,
                "Cartivo - Email Verification",
                text,
                html
            );
            */

            res.status(201).json({
                message: "Registration successful.Please login", /*Please check your email for the OTP.*/
            });
        } else {
            res.status(400).json({
                message: "Invalid user data",
            });
        };
    } catch (error) {
        next(error);
    }
};

/*
// Controller for verifying user OTP
export const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.verified) {
            return res.status(400).json({
                message: "User is already verified",
            });
        }

        if (!user.otp || !user.otpExpire) {
            return res.status(400).json({
                message: "OTP not found. Please request a new OTP",
            });
        }

        if (user.otpExpire < new Date()) {
            return res.status(400).json({
                message: "OTP has expired",
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP",
            });
        }

        user.verified = true;
        user.otp = undefined;
        user.otpExpire = undefined;

        await user.save();

        res.status(200).json({
            message: "Email verified successfully",
        });
    } catch (error) {
        next(error);
    }
};

// Controller for resending user OTP
export const resendOTP = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.verified) {
            return res.status(400).json({
                message: "User is already verified",
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.otp = otp;
        user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);

        await user.save();

        const { html, text } = resendOTPTemplate(user.name, otp);
        await sendEmail(
            user.email,
            "Cartivo - New OTP for Registration",
            text,
            html
        );

        res.status(200).json({
            message: "New OTP sent successfully. Please check your email.",
        });
    } catch (error) {
        next(error);
    }
};

*/

//get all user [admin]
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select("-password");

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};