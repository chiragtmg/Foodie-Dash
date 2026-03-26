import React from "react";
import { imgBaseURL } from "../Services/API";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ restaurant }) => {
	const navigate = useNavigate();

	const getImageUrl = () => {
	if (restaurant.image) {
		return `${imgBaseURL}${restaurant.image}`;
	}
	return "https://picsum.photos/id/870/600/400";
};
	console.log(getImageUrl());
	console.log(restaurant);

	return (
		<div
			key={restaurant._id}
			className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
			onClick={() => navigate(`/restaurant/${restaurant._id}`)}
		>
			<div className="relative h-80 overflow-hidden bg-gray-100">
				<img
					src={getImageUrl()}
					alt={restaurant.name}
					className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
					onError={(e) => {
						e.target.onerror = null;
						e.target.src = "https://picsum.photos/id/870/600/400";
					}}
				/>

				<div className="absolute top-4 right-4 bg-white px-4 py-1 rounded-full font-semibold shadow text-sm">
					⭐ {restaurant.rating || "N/A"}
				</div>
			</div>

			<div className="p-5">
				<h3 className="text-lg font-semibold text-gray-800 mb-2">
					{restaurant.name}
				</h3>
				<p className="text-gray-600 mb-1">{restaurant.cuisine}</p>
				<p className="text-sm text-gray-500 mb-4">{restaurant.location}</p>

				<div className="flex justify-between items-center text-sm">
					<span>🚀 {restaurant.deliveryTime}</span>
					{restaurant.popular && (
						<span className="text-gray-500 text-xs">
							Popular: {restaurant.popular}
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
