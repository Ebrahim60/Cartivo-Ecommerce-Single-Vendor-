import express from 'express';
import {
    adminOnly,
    protect
} from "../middleware/authMiddleware.js";

import {
    getaAdminStats,
} from "../controllers/analyticsControllers.js";

const router = express.Router();

router.get("/", protect, adminOnly, getaAdminStats);

export default router;