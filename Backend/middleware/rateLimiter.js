import rateLimit from "express-rate-limit";

// Global API rate limiter
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests, please try again after 15 minutes",
    },
});

// Authentication rate limiter
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many authentication requests, please try again after 15 minutes",
    },
});