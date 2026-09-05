import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
import swaggerUI from "swagger-ui-express";
import cookieParser from "cookie-parser";

import { swaggerSpec } from "./config/swagger.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { globalLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
//import paymentRoutes from "./routes/paymentRoutes.js";
//import analyticsRoutes from "./routes/analyticsRoutes.js";


const app = express();

// Security and common middleware
app.use(cookieParser());

app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);

app.use(cors());
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());


// Global rate limiter
app.use(globalLimiter);

// Swagger API documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

//API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
//app.use("/api/payment", paymentRoutes);
//app.use("/api/analytics", analyticsRoutes);

// 404 error handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export { app };