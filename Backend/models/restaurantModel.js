import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5,
		},
		comment: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
);

const restaurantSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		cuisine: {
			type: String,
			required: true,
			trim: true,
		},
		rating: {
			type: Number,
			default: 0,
			min: 0,
			max: 5,
		},
		deliveryTime: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		location: {
			type: String,
			required: true,
		},
		popular: {
			type: String,
			default: "",
		},

		// Reviews Array (Embedded)
		reviews: [reviewSchema],

		// Calculated fields
		numReviews: {
			type: Number,
			default: 0,
		},
		averageRating: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	},
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
