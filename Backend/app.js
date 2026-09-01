import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import swaggerUI from 'swagger-ui-express';
import cookieParser from 'cookie-parser';

// import { swaggerSpec } from "./config/swagger.js";
// import { errorHandeler, notFoundHandeler } from "./middleware/errorHandler.js";
// import { globalLimiter } from "./middleware/rateLimiter.js";

dotenv.config();
const app = express();

//security and common middleware
app.use(cookieParser);
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);
app.use(cors());
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());

//Global rate limiter
// app.use(globalLimiter);

// //Swagger API documentation
// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// //404 error Handler
// app.use(notFoundHandeler);

// //Global error handeler
// app.use(errorHandeler);

export { app };