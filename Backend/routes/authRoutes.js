import express from 'express';
import {
    login,
    registerUser,
} from "../controllers/authControllers.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import {
    adminOnly,
    protect
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", authLimiter, login);

router.post("/register", authLimiter, registerUser);


export default router;