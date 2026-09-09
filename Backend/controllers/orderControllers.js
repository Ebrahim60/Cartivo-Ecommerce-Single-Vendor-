import mongoose from "mongoose";

import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import { sendEmail } from "../services/sendMail.js";

// Create order
export const createOrder = async (req, res, next) => {
    try {
        const { items, address } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0 || !address) {
            return res.status(400).json({
                message: "Invalid order data",
            });
        }

        const requiredAddressFields = [
            "fullName",
            "street",
            "city",
            "postalCode",
            "country",
        ];

        const invalidAddress = requiredAddressFields.some(
            (field) => !address[field]
        );

        if (invalidAddress) {
            return res.status(400).json({
                message: "Complete shipping address is required",
            });
        }

        // Merge duplicate products
        const productQuantities = new Map();

        for (const item of items) {
            if (
                !item.productId ||
                !mongoose.Types.ObjectId.isValid(item.productId) ||
                !Number.isInteger(item.quantity) ||
                item.quantity < 1
            ) {
                return res.status(400).json({
                    message: "Invalid product or quantity",
                });
            }

            const currentQuantity =
                productQuantities.get(item.productId.toString()) || 0;

            productQuantities.set(
                item.productId.toString(),
                currentQuantity + item.quantity
            );
        }

        const productIds = [...productQuantities.keys()];

        const products = await Product.find({
            _id: { $in: productIds },
        });

        if (products.length !== productIds.length) {
            return res.status(404).json({
                message: "One or more products not found",
            });
        }

        let totalAmount = 0;

        const orderItems = [];

        for (const product of products) {
            const quantity = productQuantities.get(product._id.toString());

            if (product.stock < quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}`,
                });
            }

            totalAmount += product.price * quantity;

            orderItems.push({
                productId: product._id,
                quantity,
                price: product.price,
            });
        }

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalAmount,
            address,
            paymentStatus: "pending",
        });

        const message = `Dear ${req.user.name},

Thank you for your order!

Your order has been successfully created with the following details:

Order ID: ${order._id}

Total Amount: ${totalAmount}

Shipping Address:

${address.fullName}

${address.street}

${address.city}, ${address.postalCode}

${address.country}

Please complete your payment to confirm the order.

Best regards,

Cartivo Team`;

        try {
            await sendEmail(
                req.user.email,
                "Order Created - Cartivo",
                message
            );
        } catch (emailError) {
            console.error("Order email error:", emailError.message);
        }

        res.status(201).json({
            message: "Order created successfully",
            order,
        });
    } catch (error) {
        next(error);
    }
};

// Get all orders [Admin]
export const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({})
            .populate("user", "_id name email")
            .populate("items.productId", "name price");

        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

// Get logged-in user's orders
export const myOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({
            user: req.user._id,
        }).populate("items.productId", "name price");

        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

// Update order status [Admin]
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "shipped",
            "delivered",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid order ID",
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        order.status = status;

        await order.save();

        res.status(200).json({
            message: "Order status updated successfully",
            order,
        });
    } catch (error) {
        next(error);
    }
};