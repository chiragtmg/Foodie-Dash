import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
	const navigate = useNavigate();

	const featuredRestaurants = [
		{
			id: 1,
			name: "Spice Garden",
			cuisine: "Indian • Nepali",
			rating: 4.8,
			time: "25-35 min",
			image: "https://picsum.photos/id/1015/400/250",
		},
		{
			id: 2,
			name: "Pizza Palace",
			cuisine: "Italian",
			rating: 4.6,
			time: "30-40 min",
			image: "https://picsum.photos/id/106/400/250",
		},
		{
			id: 3,
			name: "Sushi Haven",
			cuisine: "Japanese",
			rating: 4.9,
			time: "20-30 min",
			image: "https://picsum.photos/id/201/400/250",
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 pb-20">
			{/* Search Bar */}
			<div className="bg-white py-8 shadow-sm">
				<div className="max-w-2xl mx-auto px-4">
					<div className="relative">
						<input
							type="text"
							placeholder="Search restaurants or dishes..."
							className="w-full px-6 py-4 rounded-2xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-lg outline-none"
						/>
						<button className="absolute right-4 top-1/2 -translate-y-1/2 bg-orange-600 text-white px-8 py-3 rounded-xl font-medium">
							Search
						</button>
					</div>
				</div>
			</div>

			{/* Featured Restaurants */}
			<div className="max-w-6xl mx-auto px-4 py-10">
				<h2 className="text-3xl font-bold text-gray-900 mb-8">
					Featured Restaurants
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{featuredRestaurants.map((res) => (
						<div
							key={res.id}
							onClick={() => navigate(`/restaurant/${res.id}`)}
							className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer"
						>
							<img
								src={res.image}
								alt={res.name}
								className="w-full h-56 object-cover"
							/>
							<div className="p-6">
								<h3 className="text-2xl font-semibold">{res.name}</h3>
								<p className="text-gray-600 mt-1">{res.cuisine}</p>
								<div className="flex items-center gap-4 mt-4 text-sm">
									<div className="flex items-center gap-1">
										⭐ <span className="font-medium">{res.rating}</span>
									</div>
									<div>{res.time}</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Home;
