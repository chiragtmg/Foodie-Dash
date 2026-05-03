import MenuItem from "../models/menuModel.js";   // Your model
import Restaurant from "../models/restaurantModel.js";
import fs from "fs";
import path from "path";

// Create Menu Item
export const createMenuItem = async (req, res) => {
  const { restaurant, name, description, price, category } = req.body;

  try {
    // Validation
    if (!restaurant || !name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Restaurant, Name, Price and Category are required",
      });
    }

    // Check if restaurant exists
    const existingRestaurant = await Restaurant.findById(restaurant);
    if (!existingRestaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    let imagePath = "";
    if (req.file) {
      imagePath = `/images/menu/${req.file.filename}`;
    }

    const newMenuItem = await MenuItem.create({
      restaurant,
      name: name.trim(),
      description: description?.trim() || "",
      price: Number(price),
      category: category.trim(),
      image: imagePath,
      isAvailable: true,
    });

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: newMenuItem,
    });
  } catch (error) {
    console.error("Error creating menu item:", error);

    // Delete uploaded image if creation fails
    if (req.file) {
      const fullPath = path.join(
        process.cwd(),
        "public",
        "images",
        "menu",
        req.file.filename
      );
      fs.unlink(fullPath, (err) => {
        if (err) console.error("Error deleting uploaded file:", err);
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating menu item",
      error: error.message,
    });
  }
};

// Get All Menu Items (with restaurant population)
export const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find()
      .populate("restaurant", "name cuisine location image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Menu items retrieved successfully",
      data: menuItems,
    });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching menu items",
      error: error.message,
    });
  }
};

// Get Menu Items by Restaurant
export const getMenuByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const menuItems = await MenuItem.find({ restaurant: restaurantId })
      .sort({ category: 1, name: 1 });

    res.status(200).json({
      success: true,
      message: "Menu items retrieved successfully",
      data: menuItems,
    });
  } catch (error) {
    console.error("Error fetching restaurant menu:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching menu",
      error: error.message,
    });
  }
};

// Get Single Menu Item
export const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id)
      .populate("restaurant", "name");

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    console.error("Error fetching menu item:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching menu item",
      error: error.message,
    });
  }
};

// Update Menu Item
export const updateMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, isAvailable } = req.body;
    const menuItemId = req.params.id;

    const existingItem = await MenuItem.findById(menuItemId);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    const updateData = {
      name: name?.trim(),
      description: description?.trim(),
      price: price ? Number(price) : existingItem.price,
      category: category?.trim(),
      isAvailable: isAvailable !== undefined ? isAvailable : existingItem.isAvailable,
    };

    let oldImagePath = null;
    if (req.file) {
      oldImagePath = existingItem.image;
      updateData.image = `/images/menu/${req.file.filename}`;
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(
      menuItemId,
      updateData,
      { new: true, runValidators: true }
    );

    // Delete old image if new one uploaded
    if (oldImagePath && req.file) {
      const filename = oldImagePath.replace("/images/menu/", "");
      const fullPath = path.join(process.cwd(), "public", "images", "menu", filename);
      fs.unlink(fullPath, (err) => {
        if (err) console.error("Error deleting old image:", err);
      });
    }

    res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    console.error("Error updating menu item:", error);

    if (req.file) {
      const fullPath = path.join(
        process.cwd(),
        "public",
        "images",
        "menu",
        req.file.filename
      );
      fs.unlink(fullPath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating menu item",
      error: error.message,
    });
  }
};

// Delete Menu Item
export const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    // Delete image file
    if (menuItem.image) {
      const filename = menuItem.image.replace("/images/menu/", "");
      const fullPath = path.join(process.cwd(), "public", "images", "menu", filename);
      fs.unlink(fullPath, (err) => {
        if (err) console.error("Error deleting image:", err);
      });
    }

    await MenuItem.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting menu item",
      error: error.message,
    });
  }
};