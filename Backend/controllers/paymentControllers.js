import axios from "axios";

import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";

const SSL_BASE_URL =
    process.env.SSLCOMMERZ_IS_LIVE === "true"
        ? "https://securepay.sslcommerz.com"
        : "https://sandbox.sslcommerz.com";

// Initiate SSLCOMMERZ payment
export const initiatePayment = async (req, res, next) => {
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

        const transactionId = `CARTIVO_${order._id}_${Date.now()}`;

        const paymentData = {
            store_id: process.env.SSLCOMMERZ_STORE_ID,
            store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,

            total_amount: order.totalAmount,
            currency: "BDT",
            tran_id: transactionId,

            success_url: `${process.env.API_URL}/api/payment/success`,
            fail_url: `${process.env.API_URL}/api/payment/fail`,
            cancel_url: `${process.env.API_URL}/api/payment/cancel`,
            ipn_url: `${process.env.API_URL}/api/payment/ipn`,

            shipping_method: "YES",
            product_name: "Cartivo Order",
            product_category: "Ecommerce",
            product_profile: "general",

            cus_name: req.user.name,
            cus_email: req.user.email,
            cus_add1: order.address.street,
            cus_city: order.address.city,
            cus_postcode: order.address.postalCode,
            cus_country: order.address.country,

            ship_name: order.address.fullName,
            ship_add1: order.address.street,
            ship_city: order.address.city,
            ship_postcode: order.address.postalCode,
            ship_country: order.address.country,

            value_a: order._id.toString(),
        };

        const response = await axios.post(
            `${SSL_BASE_URL}/gwprocess/v4/api.php`,
            new URLSearchParams(paymentData).toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        if (response.data.status !== "SUCCESS") {
            return res.status(400).json({
                message: "Payment session creation failed",
                details: response.data.failedreason || response.data,
            });
        }

        order.paymentId = transactionId;
        await order.save();

        res.status(200).json({
            message: "Payment initiated successfully",
            paymentUrl: response.data.GatewayPageURL,
            transactionId,
            orderId: order._id,
        });
    } catch (error) {
        next(error);
    }
};


// Payment success
export const paymentSuccess = async (req, res, next) => {
    try {
        console.log("SSLCOMMERZ SUCCESS:", req.body);

        res.status(200).json({
            message: "Payment success callback received",
            data: req.body,
        });
    } catch (error) {
        next(error);
    }
};


// Payment failed
export const paymentFail = async (req, res, next) => {
    try {
        console.log("SSLCOMMERZ FAIL:", req.body);

        const { tran_id } = req.body;

        if (tran_id) {
            const order = await Order.findOne({
                paymentId: tran_id,
            });

            if (order && order.paymentStatus !== "paid") {
                order.paymentStatus = "failed";
                await order.save();
            }
        }

        res.status(200).json({
            message: "Payment failed",
        });
    } catch (error) {
        next(error);
    }
};


// Payment cancelled
export const paymentCancel = async (req, res, next) => {
    try {
        console.log("SSLCOMMERZ CANCEL:", req.body);

        res.status(200).json({
            message: "Payment cancelled",
        });
    } catch (error) {
        next(error);
    }
};


// IPN
export const paymentIPN = async (req, res, next) => {
    try {
        console.log("SSLCOMMERZ IPN:", req.body);

        const {
            tran_id,
            val_id,
            status,
        } = req.body;

        if (!tran_id || !val_id) {
            return res.status(400).json({
                message: "Invalid IPN data",
            });
        }

        const order = await Order.findOne({
            paymentId: tran_id,
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        if (order.paymentStatus === "paid") {
            return res.status(200).json({
                message: "Payment already processed",
            });
        }

        if (status !== "VALID" && status !== "VALIDATED") {
            order.paymentStatus = "failed";
            await order.save();

            return res.status(400).json({
                message: "Payment is not valid",
            });
        }

        // Validate transaction with SSLCOMMERZ
        const validationResponse = await axios.get(
            `${SSL_BASE_URL}/validator/api/validationserverAPI.php`,
            {
                params: {
                    val_id: val_id,
                    store_id: process.env.SSLCOMMERZ_STORE_ID,
                    store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
                    v: 1,
                    format: "json",
                },
            }
        );

        const validationData = validationResponse.data;

        if (
            validationData.status !== "VALID" &&
            validationData.status !== "VALIDATED"
        ) {
            order.paymentStatus = "failed";
            await order.save();

            return res.status(400).json({
                message: "Payment validation failed",
            });
        }

        // Verify transaction ID
        if (validationData.tran_id !== order.paymentId) {
            return res.status(400).json({
                message: "Transaction ID mismatch",
            });
        }

        // Verify amount
        const paidAmount = Number(validationData.amount);
        const orderAmount = Number(order.totalAmount);

        if (paidAmount !== orderAmount) {
            return res.status(400).json({
                message: "Payment amount mismatch",
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

        order.paymentStatus = "paid";
        order.paymentId = tran_id;

        await order.save();

        return res.status(200).json({
            message: "Payment verified and order updated successfully",
        });
    } catch (error) {
        next(error);
    }
};