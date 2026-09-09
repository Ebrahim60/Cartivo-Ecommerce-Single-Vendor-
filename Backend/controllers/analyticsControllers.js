import { User } from "../models/userModel.js";
import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";

export const getaAdminStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments({ role: "user" });
        const totalOrders = await Order.countDocuments({});
        const totalProducts = await Product.countDocuments({});

        const orders = await Order.find({
            paymentStatus: "paid",
        });

        const totalRevenueData = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        res.json({
            totalUsers,
            totalOrders,
            totalProducts,
            totalRevenue: totalRevenueData
        });
    } catch (error) {
        next(error);
    }
}