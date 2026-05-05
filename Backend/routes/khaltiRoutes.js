import express from "express";
import { verifyToken } from "../config/middleware/verifyToken.js";

import {
  initiateKhaltiPayment,
  verifyKhaltiPayment,
} from "../controllers/khaltiController.js";

const router = express.Router();

router.use(verifyToken);   // All Khalti routes require authentication

router.post("/initiate", initiateKhaltiPayment);
router.post("/verify", verifyKhaltiPayment);

export default router;