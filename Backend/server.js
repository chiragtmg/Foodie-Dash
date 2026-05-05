import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
// import connectCloudinary from "./config/cloudinary.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

import cookieParser from "cookie-parser";
import path from "path";

// App conifg
const app = express();
const port = process.env.PORT || 4000;
connectDB();
// connectCloudinary();

// middlewares
app.use(express.json()); //request passed to json
app.use(cookieParser()); //used as pocket for token to store
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true, // to connect to frontend
	}),
); // to access backend from any ip
const publicPath = path.join(process.cwd(), "public");

// Serve Restaurant Images
app.use(
	"/images/restaurants",
	express.static(path.join(publicPath, "images", "restaurants")),
);
app.use(
	"/images/menu",
	express.static(path.join(publicPath, "images", "menu")),
);

//api end points
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);        
app.use("/api/khalti", khaltiRoutes);

app.get("/", (req, res) => {
	res.send("API WOrking");
});

app.listen(port, () => console.log("Server startrd on PORT: " + port));
