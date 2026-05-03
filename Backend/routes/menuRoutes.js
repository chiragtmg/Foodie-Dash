import express from "express";
import multer from "multer";
import { createMenuItem, deleteMenuItem, getAllMenuItems, getMenuByRestaurant, getMenuItemById, updateMenuItem, } from "../controllers/menuController.js";

const router = express.Router();

// Multer setup for menu images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/menu");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/create", upload.single("image"), createMenuItem);
router.get("/", getAllMenuItems);
router.get("/restaurant/:restaurantId", getMenuByRestaurant);
router.get("/:id", getMenuItemById);
router.put("/:id", upload.single("image"), updateMenuItem);
router.delete("/:id", deleteMenuItem);

export default router;