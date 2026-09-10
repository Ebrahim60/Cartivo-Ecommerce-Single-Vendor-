import mongoose from "mongoose";
import { Review } from "../models/reviewModel.js";
import { Product } from "../models/productModel.js";
import { Order } from "../models/orderModel.js";

const updateProductRating = async (productId) => {
    const stats = await Review.aggregate([
        {
            $match: {
                product: new mongoose.Types.ObjectId(productId),
            },
        },
        {
            $group: {
                _id: "$product",
                avgRating: { $avg: "$rating" },
                numReview: { $sum: 1 },
            },
        },
    ]);

    const product = await Product.findById(productId);

    if (!product) return;

    if (stats.length > 0) {
        product.rating = Number(stats[0].avgRating.toFixed(1));
        product.numReview = stats[0].numReview;
    } else {
        product.rating = 0;
        product.numReview = 0;
    }

    await product.save();
};

// Create review
export const createReview = async (req, res, next) => {
    try {
        const { productId, rating, comment } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID",
            });
        }

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5",
            });
        }

        if (!comment || !comment.trim()) {
            return res.status(400).json({
                message: "Review comment is required",
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        const purchased = await Order.findOne({
            user: req.user._id,
            paymentStatus: "paid",
            "items.productId": productId,
        });

        if (!purchased) {
            return res.status(403).json({
                message: "You can only review products you have purchased",
            });
        }

        const existingReview = await Review.findOne({
            user: req.user._id,
            product: productId,
        });

        if (existingReview) {
            return res.status(400).json({
                message: "You have already reviewed this product",
            });
        }

        const review = await Review.create({
            user: req.user._id,
            product: productId,
            rating,
            comment,
        });

        await updateProductRating(productId);

        res.status(201).json({
            message: "Review added successfully",
            review,
        });
    } catch (error) {
        next(error);
    }
};

// Get product reviews
export const getProductReviews = async (req, res, next) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID",
            });
        }

        const reviews = await Review.find({
            product: productId,
        })
            .populate("user", "name")
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
};

// Update own review
export const updateReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid review ID",
            });
        }

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                message: "Review not found",
            });
        }

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You can only update your own review",
            });
        }

        if (rating !== undefined) {
            if (rating < 1 || rating > 5) {
                return res.status(400).json({
                    message: "Rating must be between 1 and 5",
                });
            }

            review.rating = rating;
        }

        if (comment !== undefined) {
            if (!comment.trim()) {
                return res.status(400).json({
                    message: "Review comment cannot be empty",
                });
            }

            review.comment = comment;
        }

        await review.save();

        await updateProductRating(review.product);

        res.status(200).json({
            message: "Review updated successfully",
            review,
        });
    } catch (error) {
        next(error);
    }
};

// Delete review
export const deleteReview = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid review ID",
            });
        }

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                message: "Review not found",
            });
        }

        const isOwner =
            review.user.toString() === req.user._id.toString();

        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message: "You are not allowed to delete this review",
            });
        }

        const productId = review.product;

        await review.deleteOne();

        await updateProductRating(productId);

        res.status(200).json({
            message: "Review deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};