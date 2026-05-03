import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, imgBaseURL } from "../Services/API";
import { toast } from "react-toastify";
import { useCart } from "../Context/CartContext";
import { AuthContext } from "../Context/AuthContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { refreshCart } = useCart();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "Pokhara",
    instructions: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await apiRequest.get("/cart");
      setCartItems(res.data.cart || res.data.items || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cart");
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 60;
  const total = subtotal + deliveryFee;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!formData.fullName || !formData.phone || !formData.street) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          menuItemId: item.menuItemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingDetails: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: `${formData.street}, ${formData.city}`,
          instructions: formData.instructions,
        },
        paymentMethod,
        subtotal,
        deliveryFee,
        totalAmount: total,
      };

      const res = await apiRequest.post("/order/create", orderData);

      if (res.data.success) {
        toast.success("Order placed successfully! 🎉");
        await apiRequest.delete("/cart/clear");
        refreshCart();
        setTimeout(() => navigate("/myorders"), 1800);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Your cart is empty</h2>
          <button onClick={() => navigate("/restaurants")} className="mt-6 px-8 py-3 bg-orange-600 text-white rounded-xl">
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Delivery Information */}
          <div className="bg-white rounded-3xl p-8 shadow">
            <h2 className="text-2xl font-bold mb-8">Delivery Information</h2>

            <div className="space-y-6">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name *"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-6 py-4 border rounded-2xl focus:border-orange-500 outline-none"
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-6 py-4 border rounded-2xl focus:border-orange-500 outline-none"
                required
              />

              <input
                type="text"
                name="street"
                placeholder="Street Address / Landmark *"
                value={formData.street}
                onChange={handleChange}
                className="w-full px-6 py-4 border rounded-2xl focus:border-orange-500 outline-none"
                required
              />

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-6 py-4 border rounded-2xl focus:border-orange-500 outline-none"
              />

              <textarea
                name="instructions"
                placeholder="Special Instructions (optional)"
                value={formData.instructions}
                onChange={handleChange}
                rows={4}
                className="w-full px-6 py-4 border rounded-2xl focus:border-orange-500 outline-none resize-y"
              />
            </div>
          </div>

          {/* Order Summary + Payment */}
          <div className="bg-white rounded-3xl p-8 shadow h-fit sticky top-8">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-8 max-h-80 overflow-auto">
              {cartItems.map((item) => (
                <div key={item.menuItemId} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">Rs. {item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-6 space-y-4 text-lg">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>Rs. {deliveryFee}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold border-t pt-4">
                <span>Total</span>
                <span>Rs. {total}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod("cod")}
                  className={`w-full py-4 rounded-2xl border-2 transition ${paymentMethod === "cod" ? "border-orange-600 bg-orange-50" : "border-gray-200"}`}
                >
                  Cash on Delivery (COD)
                </button>

                <button
                  onClick={() => setPaymentMethod("online")}
                  className={`w-full py-4 rounded-2xl border-2 transition ${paymentMethod === "online" ? "border-orange-600 bg-orange-50" : "border-gray-200"}`}
                  disabled
                >
                  Online Payment (Coming Soon)
                </button>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full mt-10 py-5 bg-orange-600 hover:bg-orange-700 text-white text-xl font-semibold rounded-2xl transition disabled:opacity-70"
            >
              {loading ? "Placing Order..." : `Pay Rs. ${total} & Place Order`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;