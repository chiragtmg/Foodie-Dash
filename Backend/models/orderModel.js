// models/Order.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
	menuItem: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "MenuItem",
	},
	name: String,
	price: Number,
	quantity: Number,
});

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},

		items: [orderItemSchema],

		totalPrice: {
			type: Number,
			required: true,
		},

		deliveryAddress: {
			fullName: String,
			phone: String,
			street: String,
			city: String,
		},

		paymentMethod: {
			type: String,
			enum: ["card", "cash"],
		},

		paymentStatus: {
			type: String,
			enum: ["pending", "paid"],
			default: "pending",
		},

		orderStatus: {
			type: String,
			enum: [
				"confirmed",
				"preparing",
				"out_for_delivery",
				"delivered",
				"cancelled",
			],
			default: "confirmed",
		},

		isPaid: {
			type: Boolean,
			default: false,
		},

		paidAt: Date,
	},
	{ timestamps: true },
);

export default mongoose.model("Order", orderSchema);
