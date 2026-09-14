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
        // verified: true,
    },
    {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "User@123",
        role: "user",
        //verified: true,
    },
    {
        name: "John Smith",
        email: "johnsmith@example.com",
        password: "User@123",
        role: "user",
        //verified: true,
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