import User from "../models/userModel.js";
import MenuItem from "../models/menuModel.js";   

// Add to Cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { menuItemId, quantity = 1 } = req.body;

    if (!menuItemId) {
      return res.status(400).json({ success: false, message: "Menu Item ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if menu item exists
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }

    if (!user.cartData) user.cartData = {};

    const currentQty = user.cartData[menuItemId] || 0;
    user.cartData[menuItemId] = currentQty + Number(quantity);

    user.markModified("cartData");
    await user.save();

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart: user.cartData,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Cart
export const getCart = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user || !user.cartData || Object.keys(user.cartData).length === 0) {
      return res.status(200).json({
        success: true,
        cart: [],
      });
    }

    const menuItemIds = Object.keys(user.cartData);

    const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } })
      .populate("restaurant", "name");

    const cartItems = menuItems.map((item) => ({
      menuItemId: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: user.cartData[item._id.toString()],
      restaurantName: item.restaurant?.name || "Unknown",
      category: item.category,
    }));

    res.status(200).json({
      success: true,
      cart: cartItems,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update Cart Item Quantity
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { menuItemId, quantity } = req.body;

    if (!menuItemId || quantity === undefined) {
      return res.status(400).json({ success: false, message: "Menu Item ID and quantity required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.cartData?.[menuItemId]) {
      return res.status(404).json({ success: false, message: "Item not in cart" });
    }

    const newQty = Number(quantity);
    if (newQty <= 0) {
      delete user.cartData[menuItemId];
    } else {
      user.cartData[menuItemId] = newQty;
    }

    user.markModified("cartData");
    await user.save();

    res.status(200).json({
      success: true,
      message: newQty > 0 ? "Quantity updated" : "Item removed",
      cart: user.cartData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove from Cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { menuItemId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.cartData?.[menuItemId]) {
      return res.status(404).json({ success: false, message: "Item not in cart" });
    }

    delete user.cartData[menuItemId];
    user.markModified("cartData");
    await user.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Clear Cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.cartData = {};
    await user.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};