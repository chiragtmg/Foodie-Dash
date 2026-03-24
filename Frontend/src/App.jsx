import React from "react";
import { ToastContainer } from "react-toastify";
import Home from "./Pages/Home";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";

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
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<GoogleAuthWrapper />} />
			</Routes>
		</div>
	);
};

export default App;
