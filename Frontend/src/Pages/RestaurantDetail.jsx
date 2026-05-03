import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest, imgBaseURL } from "../Services/API";
import { toast } from "react-toastify";

const RestaurantDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [restaurant, setRestaurant] = useState(null);
	const [menuItems, setMenuItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [addingToCart, setAddingToCart] = useState(null); // Track which item is being added

	// Fetch Restaurant + Menu
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const res = await apiRequest.get(`/restaurant/get/restaurant/${id}`);
				setRestaurant(res.data.data || res.data);

				const menuRes = await apiRequest.get(`/menu/restaurant/${id}`);
				setMenuItems(menuRes.data.data || []);
			} catch (err) {
				console.error(err);
				setError("Failed to load restaurant details");
			} finally {
				setLoading(false);
			}
		};

		if (id) fetchData();
	}, [id]);

	const getImageUrl = (imgPath) => {
		if (!imgPath) return "https://picsum.photos/id/870/800/400";
		return imgPath.startsWith("http") ? imgPath : `${imgBaseURL}${imgPath}`;
	};

	// Add to Cart Function
	const addToCart = async (item) => {
		setAddingToCart(item._id);

		try {
			const res = await apiRequest.post("/cart/add", {
				menuItemId: item._id,
				quantity: 1,
			});

			if (res.data.success) {
				toast.success(`✅ ${item.name} added to cart!`, {
					position: "top-right",
					autoClose: 2000,
				});
			}
		} catch (err) {
			console.error(err);
			toast.error(err.response?.data?.message || "Failed to add item to cart");
		} finally {
			setAddingToCart(null);
		}
	};

	// Group menu items by category
	const groupedMenu = menuItems.reduce((acc, item) => {
		const category = item.category || "Other";
		if (!acc[category]) acc[category] = [];
		acc[category].push(item);
		return acc;
	}, {});

	if (loading)
		return (
			<div className="min-h-screen flex items-center justify-center text-2xl">
				Loading restaurant...
			</div>
		);
	if (error)
		return (
			<div className="min-h-screen flex items-center justify-center text-red-600">
				{error}
			</div>
		);
	if (!restaurant)
		return (
			<div className="min-h-screen flex items-center justify-center">
				Restaurant not found
			</div>
		);

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header Image */}
			<div className="relative h-80">
				<img
					src={getImageUrl(restaurant.image)}
					alt={restaurant.name}
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-black/40" />
				<button
					onClick={() => navigate(-1)}
					className="absolute top-6 left-6 px-5 py-2 bg-white/90 hover:bg-white rounded-full flex items-center gap-2 font-medium"
				>
					← Back
				</button>
			</div>

			<div className="max-w-6xl mx-auto px-6 -mt-10 relative">
				<div className="bg-white rounded-3xl shadow-lg p-8">
					<div className="flex flex-col md:flex-row justify-between items-start gap-6">
						<div>
							<h1 className="text-4xl font-bold text-gray-900">
								{restaurant.name}
							</h1>
							<p className="text-gray-600 mt-2 text-lg">{restaurant.cuisine}</p>
							<p className="text-emerald-600 mt-1">
								⭐ {restaurant.rating} •{" "}
								{restaurant.deliveryTime || "30-40 min"}
							</p>
						</div>
						<div className="text-right">
							<div className="text-sm text-gray-500">Location</div>
							<div className="font-medium">{restaurant.location}</div>
						</div>
					</div>

					{/* Dynamic Menu Section */}
					<div className="mt-12">
						<h2 className="text-3xl font-bold mb-8">Menu</h2>

						{Object.keys(groupedMenu).length === 0 ? (
							<div className="text-center py-20 text-gray-500 text-xl">
								No menu items available yet.
							</div>
						) : (
							Object.entries(groupedMenu).map(([category, items]) => (
								<div key={category} className="mb-12">
									<h3 className="text-2xl font-semibold mb-6 border-b pb-3">
										{category}
									</h3>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{items.map((item) => (
											<div
												key={item._id}
												className="flex gap-5 bg-gray-50 p-5 rounded-2xl hover:bg-white transition-all border border-transparent hover:border-orange-100"
											>
												<img
													src={getImageUrl(item.image)}
													alt={item.name}
													className="w-28 h-28 object-cover rounded-xl"
													onError={(e) => {
														e.target.src =
															"https://picsum.photos/id/1080/300/200";
													}}
												/>
												<div className="flex-1">
													<div className="flex justify-between items-start">
														<h4 className="font-semibold text-xl">
															{item.name}
														</h4>
														<span className="font-bold text-orange-600">
															Rs. {item.price}
														</span>
													</div>

													{item.description && (
														<p className="text-gray-600 mt-1 text-sm line-clamp-2">
															{item.description}
														</p>
													)}

													<button
														onClick={() => addToCart(item)}
														disabled={addingToCart === item._id}
														className="mt-4 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-xl text-sm font-medium transition flex items-center gap-2"
													>
														{addingToCart === item._id
															? "Adding..."
															: "Add to Cart"}
													</button>
												</div>
											</div>
										))}
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RestaurantDetail;
