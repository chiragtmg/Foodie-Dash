import React from "react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-10">Checkout</h1>

        <div className="bg-white rounded-3xl p-8 shadow space-y-10">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Delivery Address</h2>
            <input type="text" placeholder="Full Address" className="w-full p-4 rounded-2xl border mb-4" defaultValue="Thamel, Kathmandu" />
            <input type="text" placeholder="Phone Number" className="w-full p-4 rounded-2xl border" defaultValue="9812345678" />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-orange-600 p-6 rounded-2xl text-center font-medium">Cash on Delivery</div>
              <div className="border p-6 rounded-2xl text-center font-medium">Khalti / eSewa</div>
            </div>
          </div>

          <button
            onClick={() => navigate("/order-tracking")}
            className="w-full bg-green-600 text-white py-5 rounded-2xl text-xl font-bold hover:bg-green-700"
          >
            Place Order - Rs 980
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;