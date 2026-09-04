import jwt from 'jsonwebtoken';
import { User } from "../models/userModel.js";


//Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};


export const login = async (req, res, next) => {

};

export const registerUser = async (req, res, next) => {

};