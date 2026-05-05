import express from "express";
import { verifyToken } from "../config/middleware/verifyToken.js";
import { verifyTokenAndAdmin } from "../config/middleware/adminOnly.js";

import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

// Protected Routes (User must be logged in)
router.use(verifyToken);

router.post("/create", createOrder);
router.get("/myorders", getMyOrders);

// Admin Only Routes
router.get("/admin/all", verifyTokenAndAdmin, getAllOrders);
router.put("/admin/status/:orderId", verifyTokenAndAdmin, updateOrderStatus);

export default router;