import express from "express";
import { uploadRestaurant } from "../config/middleware/upload.js"; // Adjust path if needed
import { verifyToken } from "../config/middleware/verifyToken.js";
import {
	createRestaurant,
	updateRestaurant,
	deleteRestaurant,
	getAllRestaurants,
	getRestaurantById,
} from "../controllers/restaurantController.js";

const router = express.Router();

router.get("/get/restaurant", getAllRestaurants);
router.get("/get/restaurant/:id", getRestaurantById);
router.post(
	"/create/restaurant",
	verifyToken,
	uploadRestaurant.single("image"),
	createRestaurant,
);

router.put(
	"/edit/restaurant/:id",
	verifyToken,
	uploadRestaurant.single("image"),
	updateRestaurant,
);

router.delete("/delete/restaurant/:id", verifyToken, deleteRestaurant);

export default router;
