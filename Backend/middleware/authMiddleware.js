import jwt from 'jsonwebtoken';
import { User } from "../models/userModel.js";


//Verify JWT token & authenticate the user
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({
            message: "Not authorized, no token",
        });
    };

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decode.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                message: "Not authorized, user not found",
            });
        };
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Not authorized, token failed",
        })
    }
};

//allow access only admin 
export const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied.Admin only",
        });
    };
    next();
};