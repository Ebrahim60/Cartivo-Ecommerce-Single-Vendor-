import express from 'express';
import {
    adminOnly,
    protect
} from "../middleware/authMiddleware.js";

import {
    createOrder,
    getOrders,
    myOrders,
    updateOrderStatus,
} from "../controllers/orderControllers.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, adminOnly, getOrders);
router.get("/myorders", protect, myOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);


export default router;