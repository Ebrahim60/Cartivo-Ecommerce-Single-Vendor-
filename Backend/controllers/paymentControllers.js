import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export const createOrder = async (req, res, next) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        };

        const order = await instance.orders.create(options);

        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

export const verifyPayment = async (req, res, next) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        const generate_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generate_signature === razorpay_signature) {
            return res.status(200).json({
                message: "Payment verified successfully",
            });
        }

        res.status(400).json({
            message: "Payment verification failed",
        });
    } catch (error) {
        next(error);
    }
};