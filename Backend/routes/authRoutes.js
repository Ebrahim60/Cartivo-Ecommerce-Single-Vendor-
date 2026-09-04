import express from 'express';
import {
    login,
    registerUser,
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

router.get("/users", protect, adminOnly, getUsers);


export default router;