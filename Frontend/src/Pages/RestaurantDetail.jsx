import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const restaurant = {
    id: 1,
    name: "Spice Garden",
    cuisine: "Indian • Nepali",
    rating: 4.8,
    time: "25-35 min",
    image: "https://picsum.photos/id/1015/800/400",
    address: "Thamel, Kathmandu",
  };

  const menu = [
    { id: 1, name: "Butter Chicken", price: 450, desc: "Tender chicken in creamy tomato gravy" },
    { id: 2, name: "Momo (Chicken)", price: 280, desc: "Steamed dumplings with spicy chutney" },
    { id: 3, name: "Dal Bhat Set", price: 520, desc: "Traditional Nepali thali" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <img src={restaurant.image} alt={restaurant.name} className="w-full h-80 object-cover" />

      <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-4xl font-bold">{restaurant.name}</h1>
          <p className="text-gray-600 text-xl mt-2">{restaurant.cuisine}</p>

          <div className="flex gap-6 mt-6 text-lg">
            <div>⭐ {restaurant.rating}</div>
            <div>{restaurant.time}</div>
            <div>{restaurant.address}</div>
          </div>

          <button
            onClick={() => navigate("/cart")}
            className="mt-8 w-full bg-orange-600 text-white py-4 rounded-2xl font-semibold text-xl hover:bg-orange-700"
          >
            View Menu & Add to Cart
          </button>
        </div>

        {/* Menu Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-8">Menu</h2>
          <div className="space-y-6">
            {menu.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="text-gray-600 mt-1">{item.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">Rs {item.price}</p>
                  <button className="mt-2 bg-green-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-green-700">
                    Add +
                  </button>
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