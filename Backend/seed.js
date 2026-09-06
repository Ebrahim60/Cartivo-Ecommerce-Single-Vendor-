import "dotenv/config";
import mongoose from "mongoose";

import { User } from "./models/userModel.js";
import { Product } from "./models/productModel.js";
import { Order } from "./models/orderModel.js";

const dummyUsers = [
    {
        name: "Admin User",
        email: "admin@gmail.com",
        password: "admin123",
        role: "admin",
    },
    {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "User@123",
        role: "user",
    },
    {
        name: "John Smith",
        email: "johnsmith@example.com",
        password: "User@123",
        role: "user",
    },
];

const dummyProducts = [
    {
        name: "Wireless Bluetooth Headphones",
        description:
            "High-quality wireless headphones with clear sound, deep bass, and long battery life.",
        price: 2499,
        category: "Electronics",
        stock: 25,
        imageUrls: "https://example.com/headphones.jpg",
        rating: 4.5,
        numReview: 18,
    },
    {
        name: "USB-C Fast Charger",
        description:
            "Compact 33W USB-C fast charger suitable for smartphones, tablets, and other devices.",
        price: 899,
        category: "Accessories",
        stock: 40,
        imageUrls: "https://example.com/charger.jpg",
        rating: 4.6,
        numReview: 31,
    },
    {
        name: "Men's Casual T-Shirt",
        description:
            "Comfortable premium cotton casual t-shirt suitable for everyday wear.",
        price: 699,
        category: "Fashion",
        stock: 50,
        imageUrls: "https://example.com/tshirt.jpg",
        rating: 4.2,
        numReview: 27,
    },
];

//Dummy order
const dummyOrders = [
    {
        user: "68c123456789abcdef123456",
        items: [
            {
                productId: "68c987654321abcdef123456",
                quantity: 2,
                price: 2499,
            },
            {
                productId: "68c987654321abcdef654321",
                quantity: 1,
                price: 899,
            },
        ],
        totalAmount: 5897,
        address: {
            fullName: "John Doe",
            street: "Kazla Road",
            city: "Rajshahi",
            postalCode: "6204",
            country: "Bangladesh",
        },
        paymentId: "PAY-100001",
        status: "pending",
    },

    {
        user: "68c123456789abcdef654321",
        items: [
            {
                productId: "68c987654321abcdef123456",
                quantity: 1,
                price: 2499,
            },
        ],
        totalAmount: 2499,
        address: {
            fullName: "John Smith",
            street: "Shaheb Bazar",
            city: "Rajshahi",
            postalCode: "6100",
            country: "Bangladesh",
        },
        paymentId: "PAY-100002",
        status: "shipped",
    },

    {
        user: "68c123456789abcdef123456",
        items: [
            {
                productId: "68c987654321abcdef654321",
                quantity: 2,
                price: 899,
            },
            {
                productId: "68c987654321abcdef987654",
                quantity: 1,
                price: 699,
            },
        ],
        totalAmount: 2497,
        address: {
            fullName: "John Doe",
            street: "New Market Road",
            city: "Rajshahi",
            postalCode: "6201",
            country: "Bangladesh",
        },
        paymentId: "PAY-100003",
        status: "delivered",
    },
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "Cartivo",
        });
        console.log("MongoDB connected for seeding");

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});

        console.log("Existing data cleared");

        await User.create(dummyUsers);
        await Product.create(dummyProducts);
        await Order.create(dummyOrders);

        console.log("Users seeded successfully");
        console.log("Products seeded successfully");
        console.log("Database seeding completed");

        await mongoose.connection.close();

        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error.message);

        await mongoose.connection.close();

        process.exit(1);
    }
};

seedDatabase();