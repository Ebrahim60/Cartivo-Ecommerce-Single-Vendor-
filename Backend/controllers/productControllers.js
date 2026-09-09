import { Product } from "../models/productModel.js";
import { cloudinary } from "../config/cloudinary.js";
import {
    productSchema,
} from "../validation/validation.js";


//Create New Product[admin]
export const createProduct = async (req, res, next) => {
    try {
        const { error, value } = productSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            })
        };

        const { name, description, price, category, stock } = value;

        let imgUrl = "";

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imgUrl = result.secure_url;
        };

        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            imageUrls: imgUrl,
        });

        res.status(201).json({
            message: "Product created successfully",
            product: product
        });

    } catch (error) {
        next(error);
    }
};

//Get all product
export const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

//Get single product by  id
export const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "product not found"
            });
        };

        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

//Update product by  id
export const updateProductById = async (req, res, next) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        } else {
            if (name !== undefined) product.name = name;
            if (description !== undefined) product.description = description;
            if (price !== undefined) product.price = price;
            if (category !== undefined) product.category = category;
            if (stock !== undefined) product.stock = stock;

            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                product.imageUrls = result.secure_url;

            };
        };

        const updatedProduct = await product.save();
        res.status(200).json({
            message: "Product updated successfully",
            updatedProduct
        });

    } catch (error) {
        next(error);
    }
};

//Delete product product by  id
export const deleteProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        };

        await product.deleteOne();
        res.status(200).json({
            message: "Product remove successfully",
        });

    } catch (error) {
        next(error);
    }
};