import React from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();

  const cartItems = [
    { name: "Butter Chicken", qty: 1, price: 450 },
    { name: "Chicken Momo", qty: 2, price: 280 },
  ];

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-10">Your Cart</h1>

        <div className="bg-white rounded-3xl p-8 shadow">
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between py-6 border-b last:border-0">
              <div>
                <p className="font-medium text-lg">{item.name}</p>
                <p className="text-gray-500">Qty: {item.qty}</p>
              </div>
              <p className="font-semibold text-xl">Rs {item.price * item.qty}</p>
            </div>
          ))}

          <div className="mt-8 flex justify-between text-2xl font-bold">
            <span>Total</span>
            <span>Rs {total}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="mt-10 w-full bg-orange-600 text-white py-5 rounded-2xl text-xl font-semibold hover:bg-orange-700"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;