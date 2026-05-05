import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import MenuItem from "../models/menuModel.js";
import { sendEmail } from "../utils/sendEmail.js";

export const createOrder = async (req, res) => {
	try {
		const { items, shippingDetails, paymentMethod, totalAmount } = req.body;
		const userId = req.userId;

		if (!items || items.length === 0) {
			return res
				.status(400)
				.json({ success: false, message: "No items in order" });
		}

		// Validate shipping email
		if (!shippingDetails?.email) {
			// Try to get email from user if not provided
			const user = await User.findById(userId);
			shippingDetails.email = user?.email || "no-reply@restaurant.com";
		}

		if (!shippingDetails.fullName) shippingDetails.fullName = "Customer";

		// Create Order
		const newOrder = await Order.create({
			user: userId,
			items: items.map((item) => ({
				menuItemId: item.menuItemId,
				name: item.name,
				price: item.price,
				quantity: item.quantity,
				image: item.image,
			})),
			shippingDetails,
			paymentMethod,
			totalAmount,
			orderStatus: "Pending",
			paymentStatus: paymentMethod === "cod" ? "Pending" : "Paid",
		});

		// Clear Cart
		await User.findByIdAndUpdate(userId, { cartData: {} });

		// Send Emails (with safety check)
		try {
			if (
				shippingDetails.email &&
				shippingDetails.email !== "no-reply@restaurant.com"
			) {
				await sendEmail({
					to: shippingDetails.email,
					subject: "Order Confirmation 🎉",
					html: `
            <h2>Thank you for your order!</h2>
            <p>Hello ${shippingDetails.fullName},</p>
            <p>Your order has been placed successfully.</p>
            <h3>Order Summary:</h3>
            <ul>
              ${items.map((item) => `<li>${item.name} × ${item.quantity} - Rs. ${item.price * item.quantity}</li>`).join("")}
            </ul>
            <p><strong>Total: Rs. ${totalAmount}</strong></p>
            <p>Payment Method: ${paymentMethod.toUpperCase()}</p>
          `,
				});
			}

			// Admin Notification
			if (process.env.ADMIN_EMAIL) {
				await sendEmail({
					to: process.env.ADMIN_EMAIL,
					subject: "🛒 New Order Received",
					html: `
            <h2>New Order Alert</h2>
            <p><strong>Customer:</strong> ${shippingDetails.fullName}</p>
            <p><strong>Email:</strong> ${shippingDetails.email}</p>
            <p><strong>Phone:</strong> ${shippingDetails.phone}</p>
            <p><strong>Total:</strong> Rs. ${totalAmount}</p>
          `,
				});
			}
		} catch (emailErr) {
			console.log(
				"⚠️ Email sending failed (but order was created successfully)",
			);
			console.error(emailErr);
		}

		res.status(201).json({
			success: true,
			message: "Order placed successfully!",
			orderId: newOrder._id,
		});
	} catch (error) {
		console.error("Create Order Error:", error);
		res.status(500).json({ success: false, message: "Failed to place order" });
	}
};

// Get My Orders
export const getMyOrders = async (req, res) => {
	try {
		const userId = req.userId;

		const orders = await Order.find({ user: userId })
			.sort({ createdAt: -1 })
			.populate({
				path: "items.menuItemId",
				select: "name image",
			});

		res.status(200).json({
			success: true,
			orders,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Failed to fetch orders" });
	}
};

// Admin - Get All Orders
export const getAllOrders = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const totalOrders = await Order.countDocuments();

		const orders = await Order.find()
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.populate("user", "name email phone") 
			.populate({
				path: "items.menuItemId",
				select: "name image category",
				model: "MenuItem", 
			});

		const totalPages = Math.ceil(totalOrders / limit);

		res.status(200).json({
			success: true,
			orders,
			currentPage: page,
			totalPages,
			totalOrders,
		});
	} catch (error) {
		console.error("Get All Orders Error:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch orders",
			error: error.message,
		});
	}
};

// Update Order Status (Admin)
export const updateOrderStatus = async (req, res) => {
	try {
		const { orderId } = req.params;
		const { status } = req.body;

		const validStatuses = [
			"Pending",
			"Processing",
			"Out for Delivery",
			"Delivered",
			"Cancelled",
		];
		if (!validStatuses.includes(status)) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid status" });
		}

		const order = await Order.findByIdAndUpdate(
			orderId,
			{ orderStatus: status },
			{ new: true },
		);

		if (!order)
			return res
				.status(404)
				.json({ success: false, message: "Order not found" });

		res.status(200).json({
			success: true,
			message: "Order status updated",
			order,
		});
	} catch (error) {
		res
			.status(500)
			.json({ success: false, message: "Failed to update status" });
	}
};
