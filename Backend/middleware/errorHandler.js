export const notFoundHandler = (req, res) => {
    res.status(404).json({
        message: "Route not found",
    });
};

// Handle errors passed through the application
export const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message: err.message || "Internal server error",
    });
};
