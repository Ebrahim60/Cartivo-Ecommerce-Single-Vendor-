import express from "express";

import {
    protect
} from "../middleware/authMiddleware.js";

import {
    initiatePayment,
    paymentSuccess,
    paymentFail,
    paymentCancel,
    paymentIPN,
} from "../controllers/paymentControllers.js";

const router = express.Router();

router.post("/initiate", protect, initiatePayment);

router.post("/success", paymentSuccess);

router.post("/fail", paymentFail);

router.post("/cancel", paymentCancel);

router.post("/ipn", paymentIPN);

export default router;