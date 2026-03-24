// models/Restaurant.js
import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},

		description: String,

		cuisine: {
			type: [String], // e.g. ["Italian", "Fast Food"]
		},

		image: String,

		address: {
			street: String,
			city: String,
			lat: Number,
			lng: Number,
		},

		rating: {
			type: Number,
			default: 0,
		},

		numReviews: {
			type: Number,
			default: 0,
		},

		priceRange: {
			type: String, // $, $$, $$$
		},

		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true },
);

export default mongoose.model("Restaurant", restaurantSchema);
