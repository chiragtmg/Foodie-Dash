import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RestaurantList = () => {
	const navigate = useNavigate();
	const [filter, setFilter] = useState("All");

	const restaurants = [
		{
			id: 1,
			name: "Spice Garden",
			cuisine: "Indian • Nepali",
			rating: 4.8,
			time: "25 min",
		},
		{
			id: 2,
			name: "Pizza Palace",
			cuisine: "Italian",
			rating: 4.6,
			time: "35 min",
		},
		{
			id: 3,
			name: "Sushi Haven",
			cuisine: "Japanese",
			rating: 4.9,
			time: "20 min",
		},
		{
			id: 4,
			name: "Mom's Kitchen",
			cuisine: "Nepali",
			rating: 4.7,
			time: "15 min",
		},
	];

	const filtered =
		filter === "All"
			? restaurants
			: restaurants.filter((r) => r.cuisine.includes(filter));

	return (
		<div className="min-h-screen bg-gray-50 py-10">
			<div className="max-w-6xl mx-auto px-4">
				<h1 className="text-4xl font-bold mb-8">All Restaurants</h1>

				{/* Filters */}
				<div className="flex gap-3 mb-8 flex-wrap">
					{["All", "Indian", "Italian", "Japanese", "Nepali"].map((c) => (
						<button
							key={c}
							onClick={() => setFilter(c)}
							className={`px-6 py-2 rounded-full font-medium transition ${filter === c ? "bg-orange-600 text-white" : "bg-white border"}`}
						>
							{c}
						</button>
					))}
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{filtered.map((res) => (
						<div
							key={res.id}
							onClick={() => navigate(`/restaurant/${res.id}`)}
							className="bg-white p-6 rounded-3xl shadow hover:shadow-xl transition cursor-pointer"
						>
							<h3 className="text-2xl font-semibold">{res.name}</h3>
							<p className="text-gray-600">{res.cuisine}</p>
							<div className="mt-4 flex justify-between text-sm">
								<span>⭐ {res.rating}</span>
								<span>{res.time}</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default RestaurantList;
