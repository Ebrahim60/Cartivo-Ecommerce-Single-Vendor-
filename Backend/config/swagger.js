import swaggerJSDoc from "swagger-jsdoc";

// Swagger API documentation configuration
const swaggerDefinition = {
    openapi: "3.0.0",

    info: {
        title: "Cartivo E-commerce  Web API",
        version: "1.0.0",
        description: "API documentation for Cartivo single vendor E-commerce web application",

        contact: {
            name: "Developer Portfolio",
            url: "https://ebrahimdev-mu.vercel.app/",
        },
    },

    servers: [
        {
            url: process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`,
            description: "Cartivo API Server",
        },
    ],

    tags: [
        {
            name: "Auth",
            description: "Authentication related APIs",
        },
        {
            name: "Products",
            description: "Product management APIs",
        },
        {
            name: "Orders",
            description: "Order management APIs",
        },
        {
            name: "Payments",
            description: "SSLCOMMERZ payment APIs",
        },
        {
            name: "Reviews",
            description: "Product review and rating APIs"
        },
        {
            name: "Analytics",
            description: "Admin analytics APIs",
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

    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },

        schemas: {
            Error: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        example: "Something went wrong",
                    },
                },
            },

            User: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        example: "67c123456789abcdef123456",
                    },
                    name: {
                        type: "string",
                        example: "John Doe",
                    },
                    email: {
                        type: "string",
                        example: "john@gmail.com",
                    },
                    role: {
                        type: "string",
                        enum: ["user", "admin"],
                        example: "user",
                    },
                },
            },

            Product: {
                type: "object",
                properties: {
                    _id: {
                        type: "string",
                        example: "67c123456789abcdef123456",
                    },
                    name: {
                        type: "string",
                        example: "Wireless Headphones",
                    },
                    description: {
                        type: "string",
                        example: "High quality wireless headphones",
                    },
                    price: {
                        type: "number",
                        example: 2500,
                    },
                    category: {
                        type: "string",
                        example: "Electronics",
                    },
                    stock: {
                        type: "integer",
                        example: 20,
                    },
                    imageUrls: {
                        type: "string",
                        example: "https://res.cloudinary.com/example/image/upload/headphone.jpg",
                    },
                    rating: {
                        type: "number",
                        example: 4.5,
                    },
                    numReview: {
                        type: "integer",
                        example: 10,
                    },
                    createdAt: {
                        type: "string",
                        format: "date-time",
                    },
                    updatedAt: {
                        type: "string",
                        format: "date-time",
                    },
                },
            },

            Address: {
                type: "object",
                required: [
                    "fullName",
                    "street",
                    "city",
                    "postalCode",
                    "country",
                ],
                properties: {
                    fullName: {
                        type: "string",
                        example: "John Doe",
                    },
                    street: {
                        type: "string",
                        example: "123 Main Street",
                    },
                    city: {
                        type: "string",
                        example: "Dhaka",
                    },
                    postalCode: {
                        type: "string",
                        example: "1207",
                    },
                    country: {
                        type: "string",
                        example: "Bangladesh",
                    },
                },
            },

            OrderItem: {
                type: "object",
                properties: {
                    productId: {
                        type: "string",
                        example: "67c123456789abcdef123456",
                    },
                    quantity: {
                        type: "integer",
                        minimum: 1,
                        example: 2,
                    },
                    price: {
                        type: "number",
                        example: 2500,
                    },
                },
            },

            Order: {
                type: "object",
                properties: {
                    _id: {
                        type: "string",
                        example: "67c123456789abcdef123456",
                    },
                    user: {
                        type: "string",
                        example: "67c123456789abcdef123456",
                    },
                    items: {
                        type: "array",
                        items: {
                            $ref: "#/components/schemas/OrderItem",
                        },
                    },
                    totalAmount: {
                        type: "number",
                        example: 5000,
                    },
                    address: {
                        $ref: "#/components/schemas/Address",
                    },
                    paymentId: {
                        type: "string",
                        example: "CARTIVO_67c123456789_123456789",
                    },
                    paymentStatus: {
                        type: "string",
                        enum: ["pending", "paid", "failed"],
                        example: "pending",
                    },
                    status: {
                        type: "string",
                        enum: [
                            "pending",
                            "shipped",
                            "delivered",
                            "cancelled",
                        ],
                        example: "pending",
                    },
                    createdAt: {
                        type: "string",
                        format: "date-time",
                    },
                    updatedAt: {
                        type: "string",
                        format: "date-time",
                    },
                },
            },

            Review: {
                type: "object",
                properties: {
                    _id: {
                        type: "string",
                        example: "67c123456789abcdef123456",
                    },
                    user: {
                        type: "string",
                        example: "67c123456789abcdef123456",
                    },
                    product: {
                        type: "string",
                        example: "67c123456789abcdef123456",
                    },
                    rating: {
                        type: "integer",
                        minimum: 1,
                        maximum: 5,
                        example: 5,
                    },
                    comment: {
                        type: "string",
                        example: "Excellent product!",
                    },
                    createdAt: {
                        type: "string",
                        format: "date-time",
                    },
                    updatedAt: {
                        type: "string",
                        format: "date-time",
                    },
                },
            },
        },
    },
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