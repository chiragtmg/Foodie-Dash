import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import MenuItem from "../models/menuModel.js";   // ← Changed to MenuItem
import { sendEmail } from "../utils/sendEmail.js";

export const createOrder = async (req, res) => {
  try {
    const { items, shippingDetails, paymentMethod, totalAmount } = req.body;
    const userId = req.userId;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }

    // Check availability and reduce stock (optional)
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: `Menu item not found: ${item.name}`,
        });
      }

      if (!menuItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `${item.name} is currently unavailable`,
        });
      }
    }

    const newOrder = await Order.create({
      user: userId,
      items: items.map(item => ({
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
    });

    // Clear user cart
    await User.findByIdAndUpdate(userId, { cartData: {} });

    // Send Emails
    try {
      await sendEmail({
        to: shippingDetails.email,
        subject: "Order Confirmation 🎉",
        html: `
          <h2>Thank you for your order!</h2>
          <p>Hello ${shippingDetails.fullName},</p>
          <p>Your order has been placed successfully.</p>
          <h3>Order Items:</h3>
          <ul>
            ${items.map(item => `<li>${item.name} × ${item.quantity} - Rs. ${item.price * item.quantity}</li>`).join("")}
          </ul>
          <p><b>Total Amount:</b> Rs. ${totalAmount}</p>
          <p>Payment Method: ${paymentMethod}</p>
        `,
      });
    } catch (emailErr) {
      console.log("Email sending failed, but order created.");
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: newOrder,
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
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate({
        path: "items.menuItemId",
        select: "name",
      });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// Update Order Status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Processing", "Out for Delivery", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(orderId, { orderStatus: status }, { new: true });

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};