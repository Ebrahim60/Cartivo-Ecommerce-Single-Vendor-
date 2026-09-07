import { Order } from "../models/orderModel.js";
import { sendEmail } from "../services/sendMail.js";

// Create order
export const createOrder = async (req, res, next) => {
    try {
        const { items, totalAmount, address, paymentId } = req.body;

        if (!items || items.length === 0 || !totalAmount || !address) {
            return res.status(400).json({
                message: "Invalid order data",
            });
        }

        const order = new Order({
            user: req.user._id,
            items,
            totalAmount,
            address,
            paymentId,
        });

        await order.save();

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

We will notify you once your order is shipped to your address.

Best regards,
Cartivo Team`;

        await sendEmail(
            req.user.email,
            "Order Created - Cartivo",
            message
        );

        res.status(201).json({
            message: "Order created successfully",
            order,
        });
    } catch (error) {
        next(error);
    }
};


//get all order[admin]
export const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate("user", "id name");
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};


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


//update order status[admin]
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        const allowedStatuses = ["pending", "shipped", "delivered"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status",
            });
        }

        if (!order) {
            return res.status(404).json({
                message: "order not found",
            })

        }
        order.status = status;
        await order.save();

        res.status(200).json({
            message: "Order status updated",
            order
        });

    } catch (error) {
        next(error);
    }
};
