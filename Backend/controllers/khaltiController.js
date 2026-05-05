import axios from "axios";
import { createOrder } from "./orderController.js";

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;

export const initiateKhaltiPayment = async (req, res) => {
  try {
    const { amount, shippingDetails } = req.body;

    const amountInPaisa = Math.round(amount * 100);

    const payload = {
      return_url: "http://localhost:5173/khalti-success",
      website_url: "http://localhost:5173",
      amount: amountInPaisa,
      purchase_order_id: `FOOD_${Date.now()}`,
      purchase_order_name: "Food Order",
      customer_info: {
        name: shippingDetails.fullName,
        email: shippingDetails.email || "customer@example.com",
        phone: shippingDetails.phone?.replace(/\D/g, "").slice(-10) || "9800000000",
      },
    };

    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      payload,
      {
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      paymentUrl: response.data.payment_url,
      pidx: response.data.pidx,
    });
  } catch (error) {
    console.error("Khalti Initiate Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Failed to initiate payment" });
  }
};

export const verifyKhaltiPayment = async (req, res) => {
  try {
    const { pidx, pendingOrder } = req.body;

    if (!pidx || !pendingOrder) {
      return res.status(400).json({ success: false, message: "Missing payment data" });
    }

    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: { Authorization: `Key ${KHALTI_SECRET_KEY}` },
      }
    );

    if (response.data.status !== "Completed") {
      return res.status(400).json({ success: false, message: "Payment not completed" });
    }

    // Prepare data for createOrder
    req.body = {
      items: pendingOrder.cartItems.map(item => ({
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      shippingDetails: pendingOrder.shippingDetails,
      paymentMethod: "khalti",
      totalAmount: pendingOrder.totalAmount,
    };

    req.userId = pendingOrder.userId;

    return await createOrder(req, res);
  } catch (error) {
    console.error("Khalti Verify Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};