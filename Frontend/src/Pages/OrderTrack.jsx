import React from "react";

const OrderTrack = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Order Tracking</h1>

        <div className="bg-white rounded-3xl shadow-xl p-10">
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">🍔</div>
            <h2 className="text-3xl font-semibold">Order #FH-78492</h2>
            <p className="text-green-600 font-medium mt-2">Estimated Delivery: 35 minutes</p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">✓</div>
              <div>Order Confirmed</div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">✓</div>
              <div>Preparing your food</div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">🚀</div>
              <div className="font-semibold">Out for Delivery</div>
            </div>
            <div className="flex gap-6 items-start opacity-40">
              <div className="w-8 h-8 border-2 border-gray-300 rounded-full"></div>
              <div>Delivered</div>
            </div>
          </div>

          {/* Fake Map */}
          <div className="mt-12 h-80 bg-gray-200 rounded-3xl flex items-center justify-center text-3xl font-medium text-gray-500">
            📍 Live Map (Static)
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrack;