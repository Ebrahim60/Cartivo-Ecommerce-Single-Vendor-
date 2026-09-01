import http from 'http';
import dotenv from 'dotenv';

import { app } from "./app.js"
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    const server = http.createServer(app);
    server.listen(PORT, () => {
        console.log(`Server running at: http://localhost:${PORT}`);
        console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
    });
};

startServer().catch((err) => {
    console.error(`Error starting server: ${err.message}`);
    process.exit(1);
});