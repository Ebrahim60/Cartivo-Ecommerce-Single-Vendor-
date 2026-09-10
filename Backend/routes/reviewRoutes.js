import express from "express";
import {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
} from "../controllers/reviewControllers.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/product/:productId", getProductReviews);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

export default router;