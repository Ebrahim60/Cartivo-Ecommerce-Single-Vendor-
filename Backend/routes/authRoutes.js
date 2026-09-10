import express from 'express';
import {
    login,
    registerUser,
    verifyOTP,
    resendOTP,
    getUsers,
} from "../controllers/authControllers.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import {
    adminOnly,
    protect
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", authLimiter, login);

router.post("/register", authLimiter, registerUser);

router.post("/verify-otp", authLimiter, verifyOTP);

router.post("/resend-otp", authLimiter, resendOTP);

router.get("/users", protect, adminOnly, getUsers);


export default router;