import Restaurant from "../models/restaurantModel.js";
import fs from "fs";
import path from "path";

// Create Restaurant
export const createRestaurant = async (req, res) => {
	const { name, cuisine, rating, deliveryTime, location, popular } = req.body;

	try {
		if (!req.file) {
			return res.status(400).json({
				success: false,
				message: "Restaurant image is required",
			});
		}

		const imagePath = `/images/restaurants/${req.file.filename}`;

		const newRestaurant = await Restaurant.create({
			name: name.trim(),
			cuisine: cuisine.trim(),
			rating: rating ? Number(rating) : 4.5,
			deliveryTime: deliveryTime.trim(),
			image: imagePath,
			location: location.trim(),
			popular: popular ? popular.trim() : "",
			reviews: [], // Start with empty reviews
			numReviews: 0,
			averageRating: 0,
		});

		res.status(201).json({
			success: true,
			message: "Restaurant created successfully",
			data: newRestaurant,
		});
	} catch (error) {
		console.error("Error creating restaurant:", error);

		if (req.file) {
			const fullPath = path.join(
				process.cwd(),
				"public",
				"images",
				"restaurants",
				req.file.filename,
			);
			fs.unlink(fullPath, (err) => {
				if (err) console.error("Error deleting uploaded file:", err);
			});
		}

		res.status(500).json({
			success: false,
			message: "Server error while creating restaurant",
			error: error.message,
		});
	}
};

// Add Review to Restaurant
export const addReview = async (req, res) => {
	try {
		const { rating, comment } = req.body;
		const restaurantId = req.params.id;

		const restaurant = await Restaurant.findById(restaurantId);

		if (!restaurant) {
			return res.status(404).json({
				success: false,
				message: "Restaurant not found",
			});
		}

		// Check if user already reviewed
		const alreadyReviewed = restaurant.reviews.find(
			(r) => r.user.toString() === req.user._id.toString(),
		);

		if (alreadyReviewed) {
			return res.status(400).json({
				success: false,
				message: "You have already reviewed this restaurant",
			});
		}

		const review = {
			user: req.user._id,
			name: req.user.name || "Anonymous",
			rating: Number(rating),
			comment,
		};

		restaurant.reviews.push(review);

		// Update average rating
		restaurant.numReviews = restaurant.reviews.length;
		restaurant.averageRating =
			restaurant.reviews.reduce((acc, item) => acc + item.rating, 0) /
			restaurant.numReviews;

		await restaurant.save();

		res.status(201).json({
			success: true,
			message: "Review added successfully",
			data: restaurant,
		});
	} catch (error) {
		console.error("Error adding review:", error);
		res.status(500).json({
			success: false,
			message: "Server error while adding review",
			error: error.message,
		});
	}
};

// Get All Restaurants
export const getAllRestaurants = async (req, res) => {
	try {
		const restaurants = await Restaurant.find()
			.sort({ averageRating: -1, createdAt: -1 })

		res.status(200).json({
			success: true,
			message: "All restaurants retrieved successfully",
			data: restaurants,
		});
	} catch (error) {
		console.error("Error fetching restaurants:", error);
		res.status(500).json({
			success: false,
			message: "Server error while fetching restaurants",
			error: error.message,
		});
	}
};

// Update Restaurant
export const updateRestaurant = async (req, res) => {
	try {
		const restaurantId = req.params.id;
		const updateData = { ...req.body };

		const existingRestaurant = await Restaurant.findById(restaurantId);
		if (!existingRestaurant) {
			return res.status(404).json({
				success: false,
				message: "Restaurant not found",
			});
		}

		// Handle rating
		if (updateData.rating) {
			updateData.rating = Number(updateData.rating);
		}

		// Handle new image (single file)
		let oldImagePath = null;
		if (req.file) {
			oldImagePath = existingRestaurant.image;
			updateData.image = `/images/restaurants/${req.file.filename}`;
		}

		// Update the restaurant
		const updatedRestaurant = await Restaurant.findByIdAndUpdate(
			restaurantId,
			updateData,
			{ new: true, runValidators: true },
		);

		// Delete old image if a new one was uploaded
		if (oldImagePath && req.file) {
			const filename = oldImagePath.replace("/images/restaurants/", "");
			const fullPath = path.join(
				process.cwd(),
				"public",
				"images",
				"restaurants",
				filename,
			);

			fs.unlink(fullPath, (err) => {
				if (err) console.error("Error deleting old image:", err);
			});
		}

		res.status(200).json({
			success: true,
			message: "Restaurant updated successfully",
			data: updatedRestaurant,
		});
	} catch (error) {
		console.error("Error updating restaurant:", error);

		// Clean up new uploaded file if update fails
		if (req.file) {
			const fullPath = path.join(
				process.cwd(),
				"public",
				"images",
				"restaurants",
				req.file.filename,
			);
			fs.unlink(fullPath, (err) => {
				if (err) console.error("Error deleting uploaded file:", err);
			});
		}

		res.status(500).json({
			success: false,
			message: "Server error while updating restaurant",
			error: error.message,
		});
	}
};

// Get Restaurant by ID
export const getRestaurantById = async (req, res) => {
	try {
		const restaurant = await Restaurant.findById(req.params.id);

		if (!restaurant) {
			return res.status(404).json({
				success: false,
				message: "Restaurant not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "Restaurant retrieved successfully",
			data: restaurant,
		});
	} catch (error) {
		console.error("Error fetching restaurant:", error);
		res.status(500).json({
			success: false,
			message: "Server error while fetching restaurant",
			error: error.message,
		});
	}
};

// Delete Restaurant
export const deleteRestaurant = async (req, res) => {
	try {
		const restaurant = await Restaurant.findById(req.params.id);

		if (!restaurant) {
			return res.status(404).json({
				success: false,
				message: "Restaurant not found",
			});
		}

		// Delete image file
		if (restaurant.image) {
			const filename = restaurant.image.replace("/images/restaurants/", "");
			const fullPath = path.join(
				process.cwd(),
				"public",
				"images",
				"restaurants",
				filename,
			);

			fs.unlink(fullPath, (err) => {
				if (err) console.error("Error deleting restaurant image:", err);
			});
		}

		await Restaurant.findByIdAndDelete(req.params.id);

		res.status(200).json({
			success: true,
			message: "Restaurant deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting restaurant:", error);
		res.status(500).json({
			success: false,
			message: "Server error while deleting restaurant",
			error: error.message,
		});
	}
};
