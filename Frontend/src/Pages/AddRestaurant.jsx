import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../Services/API";
import Sidebar from "../Components/Sidebar"; // ← Fixed import name

const AddRestaurant = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		cuisine: "",
		rating: "",
		deliveryTime: "",
		location: "",
		popular: "",
	});

	const [image, setImage] = useState(null);
	const [preview, setPreview] = useState(null);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImage(file);
			setPreview(URL.createObjectURL(file));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!image) {
			alert("Please select an image");
			return;
		}

		const data = new FormData();
		data.append("name", formData.name);
		data.append("cuisine", formData.cuisine);
		data.append("rating", formData.rating);
		data.append("deliveryTime", formData.deliveryTime);
		data.append("location", formData.location);
		data.append("popular", formData.popular);
		data.append("image", image);

		try {
			setLoading(true);
			const res = await apiRequest.post("/restaurant/create/restaurant", data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			alert("Restaurant added successfully!");
			navigate("/restaurants"); // or "/admin/restaurants" if you prefer
		} catch (error) {
			console.error(error);
			alert(error.response?.data?.message || "Failed to add restaurant");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
				{/* Sidebar */}
				<Sidebar />

				{/* Main Content */}
				<main className="p-6 md:p-8">
					<div className="max-w-2xl mx-auto">
						<div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
							<div className="flex items-center justify-between mb-8">
								<h2 className="text-3xl font-bold text-gray-900">
									Add New Restaurant
								</h2>
								<button
									onClick={() => navigate("/restaurants")}
									className="text-gray-500 hover:text-gray-700"
								>
									← Back
								</button>
							</div>

							<form onSubmit={handleSubmit} className="space-y-6">
								<div>
									<label className="block text-sm font-medium mb-2">
										Restaurant Name *
									</label>
									<input
										type="text"
										name="name"
										value={formData.name}
										onChange={handleChange}
										required
										className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:border-orange-500 outline-none transition"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">
										Cuisine *
									</label>
									<input
										type="text"
										name="cuisine"
										value={formData.cuisine}
										onChange={handleChange}
										placeholder="e.g. Nepali, Indian, Chinese"
										required
										className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:border-orange-500 outline-none"
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium mb-2">
											Rating (out of 5)
										</label>
										<input
											type="number"
											name="rating"
											value={formData.rating}
											onChange={handleChange}
											step="0.1"
											max="5"
											className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:border-orange-500 outline-none"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">
											Delivery Time *
										</label>
										<input
											type="text"
											name="deliveryTime"
											value={formData.deliveryTime}
											onChange={handleChange}
											placeholder="25-35 min"
											required
											className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:border-orange-500 outline-none"
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">
										Location *
									</label>
									<input
										type="text"
										name="location"
										value={formData.location}
										onChange={handleChange}
										placeholder="Pokhara, Lakeside"
										required
										className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:border-orange-500 outline-none"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">
										Popular Items (optional)
									</label>
									<input
										type="text"
										name="popular"
										value={formData.popular}
										onChange={handleChange}
										placeholder="Momo, Butter Chicken, Chowmein"
										className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:border-orange-500 outline-none"
									/>
								</div>

								{/* Image Upload */}
								<div>
									<label className="block text-sm font-medium mb-2">
										Restaurant Image *
									</label>
									{preview && (
										<div className="mb-4">
											<img
												src={preview}
												alt="preview"
												className="w-full max-h-64 object-cover rounded-2xl border"
											/>
										</div>
									)}
									<input
										type="file"
										accept="image/*"
										onChange={handleImageChange}
										required
										className="w-full px-5 py-3 border border-gray-300 rounded-2xl file:mr-4 file:py-2 file:px-6 file:rounded-xl file:border-0 file:bg-orange-600 file:text-white cursor-pointer"
									/>
								</div>

								<button
									type="submit"
									disabled={loading}
									className={`w-full py-4 rounded-2xl text-lg font-semibold text-white transition-all ${
										loading
											? "bg-gray-400 cursor-not-allowed"
											: "bg-orange-600 hover:bg-orange-700"
									}`}
								>
									{loading ? "Adding Restaurant..." : "Add Restaurant"}
								</button>
							</form>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default AddRestaurant;
