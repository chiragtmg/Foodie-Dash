import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../Services/API";


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
      await apiRequest.post(`restaurant/create/restaurant`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Restaurant added successfully!");
      navigate("/restaurants");   // Go back to list page
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add restaurant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-lg mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Add New Restaurant</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Restaurant Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 border rounded-2xl focus:border-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cuisine *</label>
              <input
                type="text"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                placeholder="e.g. Indian • Nepali"
                required
                className="w-full px-5 py-3 border rounded-2xl focus:border-orange-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  step="0.1"
                  max="5"
                  className="w-full px-5 py-3 border rounded-2xl focus:border-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Delivery Time *</label>
                <input
                  type="text"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleChange}
                  placeholder="25-35 min"
                  required
                  className="w-full px-5 py-3 border rounded-2xl focus:border-orange-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 border rounded-2xl focus:border-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Popular Items</label>
              <input
                type="text"
                name="popular"
                value={formData.popular}
                onChange={handleChange}
                placeholder="Butter Chicken, Momo"
                className="w-full px-5 py-3 border rounded-2xl focus:border-orange-500 outline-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Restaurant Image *</label>
              {preview && (
                <img src={preview} alt="preview" className="w-full h-48 object-cover rounded-2xl mb-3" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="w-full px-5 py-3 border rounded-2xl"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl text-lg font-semibold text-white transition-all ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {loading ? "Adding Restaurant..." : "Add Restaurant"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRestaurant;