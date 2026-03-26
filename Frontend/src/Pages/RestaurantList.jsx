import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, imgBaseURL } from "../Services/API";
import ProductCard from "../Components/ProductCard";

const RestaurantList = () => {
	const navigate = useNavigate();
	const [restaurants, setRestaurants] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const fetchRestaurants = async () => {
		try {
			setLoading(true);
			const res = await apiRequest.get("/restaurant/get/restaurant");
			setRestaurants(res.data.data || []);
		} catch (err) {
			console.error(err);
			setError(
				"Failed to load restaurants. Make sure backend is running on port 4000.",
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRestaurants();
	}, []);

	// Improved getImageUrl - Same style as your ProductCard
	const getImageUrl = (restaurant) => {
		if (!restaurant?.image) {
			return "https://picsum.photos/id/870/600/400"; // Reliable public fallback
		}

		if (restaurant.image.startsWith("http")) {
			return restaurant.image;
		}

		return `${imgBaseURL}${restaurant.image}`;
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center text-xl">
				Loading restaurants...
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center text-red-600 text-center px-6">
				{error}
				<button
					onClick={fetchRestaurants}
					className="mt-4 ml-4 px-6 py-2 bg-orange-600 text-white rounded-xl"
				>
					Retry
				</button>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-10">
			<div className="max-w-6xl mx-auto px-6">
				<div className="flex justify-between items-center mb-10">
					<h1 className="text-4xl font-bold text-gray-900">Restaurants</h1>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{restaurants.map((restaurant) => (
						<ProductCard
							key={restaurant.id || restaurant._id}
							restaurant={restaurant}
						/>
					))}
				</div>

				{restaurants.length === 0 && (
					<div className="text-center py-20 text-gray-500 text-xl">
						No restaurants available yet.
					</div>
				)}
			</div>
		</div>
	);
};

export default RestaurantList;
