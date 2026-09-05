import express from 'express';
import multer from 'multer';
import {
    adminOnly,
    protect
} from "../middleware/authMiddleware.js";

import {
    createProduct,
    getProducts,
    getProductById,
    updateProductById,
    deleteProductById
} from "../controllers/productControllers.js";

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post("/", protect, adminOnly, upload.single('image'), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", protect, adminOnly, upload.single('image'), updateProductById);
router.delete("/:id", protect, adminOnly, deleteProductById);


export default router;