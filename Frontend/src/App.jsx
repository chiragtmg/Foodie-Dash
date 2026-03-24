import React from "react";
import { ToastContainer } from "react-toastify";
import Home from "./Pages/Home";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Navbar from "./Components/Navbar";
import EditProfile from "./Pages/Profile";
import RestaurantList from "./Pages/RestaurantList";
import RestaurantDetail from "./Pages/RestaurantDetail";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/CheckOut";
import OrderTrack from "./Pages/OrderTrack";
import Order from "./Pages/Order";

const App = () => {
	const GoogleAuthWrapper = () => {
		return (
			<GoogleOAuthProvider clientId="845839277034-ntjf56hk9g1gskf7ihhps2jlta5gdes9.apps.googleusercontent.com">
				<Login></Login>
			</GoogleOAuthProvider>
		);
	};

	return (
		<div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
			<ToastContainer />
      <Navbar/>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/editprofile" element={<EditProfile />} />
				<Route path="/restaurantList" element={<RestaurantList />} />
				<Route path="/restaurantDetail" element={<RestaurantDetail />} />
				<Route path="/cart" element={<Cart />} />
				<Route path="/checkout" element={<Checkout />} />
				<Route path="/orderTrack" element={<OrderTrack />} />
				<Route path="/order" element={<Order />} />
				<Route path="/login" element={<GoogleAuthWrapper />} />
        
			</Routes>
		</div>
	);
};

export default App;
