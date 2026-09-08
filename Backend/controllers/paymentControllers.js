import Razorpay from "razorpay";
import crypto from "crypto";

import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";

export const createOrder = async (req, res, next) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                message: "Order ID is required",
            });
        }

        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id,
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        if (order.paymentStatus === "paid") {
            return res.status(400).json({
                message: "Order is already paid",
            });
        }

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: Math.round(order.totalAmount * 100),
            currency: "INR",
            receipt: order._id.toString(),
        };

        const razorpayOrder = await instance.orders.create(options);

        res.status(200).json({
            razorpayOrder,
            order: {
                id: order._id,
                totalAmount: order.totalAmount,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const verifyPayment = async (req, res, next) => {
    try {
        const {
            orderId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        if (
            !orderId ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                message: "Payment verification data is incomplete",
            });
        }

        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id,
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        if (order.paymentStatus === "paid") {
            return res.status(400).json({
                message: "Payment is already verified",
            });
        }

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            order.paymentStatus = "failed";
            await order.save();

            return res.status(400).json({
                message: "Payment verification failed",
            });
        }

        // Reduce stock only after successful payment
        for (const item of order.items) {
            const product = await Product.findOneAndUpdate(
                {
                    _id: item.productId,
                    stock: { $gte: item.quantity },
                },
                {
                    $inc: {
                        stock: -item.quantity,
                    },
                },
                {
                    new: true,
                }
            );

            if (!product) {
                return res.status(400).json({
                    message: `Insufficient stock for product ${item.productId}`,
                });
            }
        }

        order.paymentId = razorpay_payment_id;
        order.paymentStatus = "paid";

        await order.save();

        res.status(200).json({
            message: "Payment verified successfully",
            order,
        });
    } catch (error) {
        next(error);
    }
};