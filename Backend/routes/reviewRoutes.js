import express from "express";
import {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
} from "../controllers/reviewControllers.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a product review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - rating
 *               - comment
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 67c123456789abcdef123456
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Excellent product!
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: Invalid review data or duplicate review
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User has not purchased the product
 *       404:
 *         description: Product not found
 */
router.post("/", protect, createReview);

/**
 * @swagger
 * /api/reviews/product/{productId}:
 *   get:
 *     summary: Get all reviews for a product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         example: 67c123456789abcdef123456
 *     responses:
 *       200:
 *         description: List of product reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Review"
 *       400:
 *         description: Invalid product ID
 */
router.get("/product/:productId", getProductReviews);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update own review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 67c123456789abcdef123456
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: Good product.
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Invalid review data or review ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User can only update own review
 *       404:
 *         description: Review not found
 */
router.put("/:id", protect, updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 67c123456789abcdef123456
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       400:
 *         description: Invalid review ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User is not allowed to delete this review
 *       404:
 *         description: Review not found
 */
router.delete("/:id", protect, deleteReview);

export default router;