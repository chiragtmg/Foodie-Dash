import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
// import connectCloudinary from "./config/cloudinary.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

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
// app.use(
// 	"/images",
// 	express.static(path.join(process.cwd(), "public", "images")),
// );

//api end points
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);


app.get("/", (req, res) => {
	res.send("API WOrking");
});

app.listen(port, () => console.log("Server startrd on PORT: " + port));
