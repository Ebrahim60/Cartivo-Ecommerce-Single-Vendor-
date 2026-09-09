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

const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 5 * 1024 * 1024, //5 mb max
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    },
});

const router = express.Router();

router.post("/", protect, adminOnly, upload.single('image'), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", protect, adminOnly, upload.single('image'), updateProductById);
router.delete("/:id", protect, adminOnly, deleteProductById);


export default router;