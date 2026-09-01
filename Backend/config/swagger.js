import swaggerJSDoc from "swagger-jsdoc";

// Swagger API documentation configuration
const swaggerDefinition = {
    openapi: "3.0.0",

    info: {
        title: "Cartivo E-commerce  Web API",
        version: "1.0.0",
        description: "API documentation for Cartivo single vendor E-commerce web application",

        contact: {
            name: "Md Ebrahim Ali",
            url: "https://ebrahimdev-mu.vercel.app/",
        },
    },

    servers: [
        {
            url: process.env.API_URL || `http://localhost:3000`,
            description: "Cartivo API Server",
        },
    ],

    tags: [
        {
            name: "Auth",
            description: "Authentication related APIs",
        },
    ],

    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },

    security: [
        {
            bearerAuth: [],
        },
    ],

    externalDocs: {
        description: "GitHub Repository",
        url: "https://github.com/Ebrahim60/Cartivo-Ecommerce-Single-Vendor-",
    },
};

const options = {
    definition: swaggerDefinition,
    apis: ["./routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);