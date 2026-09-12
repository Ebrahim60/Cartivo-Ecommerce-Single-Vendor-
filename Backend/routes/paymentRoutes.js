import express from "express";

import {
    protect
} from "../middleware/authMiddleware.js";

import {
    initiatePayment,
    paymentSuccess,
    paymentFail,
    paymentCancel,
    paymentIPN,
} from "../controllers/paymentControllers.js";

const router = express.Router();


/**
 * @swagger
 * /api/payment/initiate:
 *   post:
 *     summary: Initiate SSLCOMMERZ payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: 67c123456789abcdef123456
 *     responses:
 *       200:
 *         description: Payment initiated successfully
 *       400:
 *         description: Payment session creation failed or order already paid
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Order not found
 */
router.post("/initiate", protect, initiatePayment);

/**
 * @swagger
 * /api/payment/success:
 *   post:
 *     summary: SSLCOMMERZ success callback
 *     tags: [Payments]
 *     requestBody:
 *       required: false
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               tran_id:
 *                 type: string
 *                 example: CARTIVO_67c123456789_123456789
 *               val_id:
 *                 type: string
 *                 example: 250908123456789
 *               status:
 *                 type: string
 *                 example: VALID
 *     responses:
 *       200:
 *         description: Payment success callback received
 */
router.post("/success", paymentSuccess);

/**
 * @swagger
 * /api/payment/fail:
 *   post:
 *     summary: SSLCOMMERZ failed payment callback
 *     tags: [Payments]
 *     requestBody:
 *       required: false
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               tran_id:
 *                 type: string
 *                 example: CARTIVO_67c123456789_123456789
 *     responses:
 *       200:
 *         description: Payment failed
 */
router.post("/fail", paymentFail);

/**
 * @swagger
 * /api/payment/cancel:
 *   post:
 *     summary: SSLCOMMERZ cancelled payment callback
 *     tags: [Payments]
 *     requestBody:
 *       required: false
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               tran_id:
 *                 type: string
 *                 example: CARTIVO_67c123456789_123456789
 *     responses:
 *       200:
 *         description: Payment cancelled
 */
router.post("/cancel", paymentCancel);

/**
 * @swagger
 * /api/payment/ipn:
 *   post:
 *     summary: SSLCOMMERZ IPN callback
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - tran_id
 *               - val_id
 *               - status
 *             properties:
 *               tran_id:
 *                 type: string
 *                 example: CARTIVO_67c123456789_123456789
 *               val_id:
 *                 type: string
 *                 example: 250908123456789
 *               status:
 *                 type: string
 *                 enum:
 *                   - VALID
 *                   - VALIDATED
 *                 example: VALID
 *               amount:
 *                 type: string
 *                 example: "5000.00"
 *     responses:
 *       200:
 *         description: Payment verified and order updated successfully
 *       400:
 *         description: Invalid or failed payment
 *       404:
 *         description: Order not found
 */
router.post("/ipn", paymentIPN);

export default router;