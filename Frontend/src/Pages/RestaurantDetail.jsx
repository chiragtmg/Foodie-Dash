import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest, imgBaseURL } from "../Services/API";

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Static Menu Data (as requested)
  const menuCategories = [
    {
      id: 1,
      name: "Popular Items",
      items: [
        { id: 101, name: "Chicken Burger", price: 320, desc: "Grilled chicken with fresh veggies", img: "https://picsum.photos/id/1080/300/200" },
        { id: 102, name: "Margherita Pizza", price: 450, desc: "Classic cheese pizza", img: "https://picsum.photos/id/106/300/200" },
        { id: 103, name: "French Fries", price: 180, desc: "Crispy golden fries", img: "https://picsum.photos/id/292/300/200" },
      ]
    },
    {
      id: 2,
      name: "Main Course",
      items: [
        { id: 201, name: "Butter Chicken", price: 520, desc: "Tender chicken in creamy tomato gravy", img: "https://picsum.photos/id/431/300/200" },
        { id: 202, name: "Veg Thali", price: 380, desc: "Complete Nepali meal", img: "https://picsum.photos/id/431/300/200" },
        { id: 203, name: "Mutton Curry", price: 680, desc: "Spicy mutton curry", img: "https://picsum.photos/id/870/300/200" },
      ]
    },
    {
      id: 3,
      name: "Beverages",
      items: [
        { id: 301, name: "Mango Lassi", price: 150, desc: "Refreshing yogurt drink", img: "https://picsum.photos/id/1060/300/200" },
        { id: 302, name: "Cold Coffee", price: 180, desc: "With ice cream", img: "https://picsum.photos/id/870/300/200" },
      ]
    }
  ];

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const res = await apiRequest.get(`/restaurant/get/restaurant/${id}`);
        setRestaurant(res.data.data || res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load restaurant details");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl">Loading restaurant...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!restaurant) return <div>Restaurant not found</div>;

  const getImageUrl = () => {
    if (!restaurant.image) return "https://picsum.photos/id/870/800/400";
    return restaurant.image.startsWith("http") ? restaurant.image : `${imgBaseURL}${restaurant.image}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="relative h-80">
        <img
          src={getImageUrl()}
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
              <h1 className="text-4xl font-bold text-gray-900">{restaurant.name}</h1>
              <p className="text-gray-600 mt-2 text-lg">{restaurant.cuisine || restaurant.description}</p>
              <p className="text-emerald-600 mt-1">⭐ {restaurant.rating} • {restaurant.deliveryTime || "30-40 min"}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Location</div>
              <div className="font-medium">{restaurant.location || "Pokhara, Nepal"}</div>
            </div>
          </div>

          {/* Menu Section */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-8">Menu</h2>

            {menuCategories.map((category) => (
              <div key={category.id} className="mb-12">
                <h3 className="text-2xl font-semibold mb-6 border-b pb-3">{category.name}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.items.map((item) => (
                    <div key={item.id} className="flex gap-5 bg-gray-50 p-5 rounded-2xl hover:bg-white transition-colors">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-28 h-28 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-xl">{item.name}</h4>
                          <span className="font-bold text-orange-600">Rs. {item.price}</span>
                        </div>
                        <p className="text-gray-600 mt-1 text-sm">{item.desc}</p>
                        
                        <button className="mt-4 px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-medium transition">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;