import express from 'express';
import {
    adminOnly,
    protect
} from "../middleware/authMiddleware.js";

import {
    getaAdminStats,
} from "../controllers/analyticsControllers.js";

const router = express.Router();


/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Get admin dashboard statistics [Admin]
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   example: 50
 *                 totalOrders:
 *                   type: integer
 *                   example: 120
 *                 totalProducts:
 *                   type: integer
 *                   example: 35
 *                 totalRevenue:
 *                   type: number
 *                   example: 250000
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */
router.get("/", protect, adminOnly, getaAdminStats);

export default router;