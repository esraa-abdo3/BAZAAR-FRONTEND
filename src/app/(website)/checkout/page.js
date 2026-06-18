"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, updateCartQuantity, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    setUpdatingId(productId);
    if (newQuantity <= 0) {
      await removeFromCart(productId);
    } else {
      await updateCartQuantity(productId, newQuantity);
    }
    setUpdatingId(null);
  };
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    governate: "",
    city: "",
    paymentMethod: "CASH",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart || !cart.items || cart.items.length === 0) return;

    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    try {
      // Group items by brand and bazaar because the endpoint requires them in the URL
      const ordersByBrand = {};
      
      cart.items.forEach((item) => {
        // the cart item has bazaarId and brandId
        const key = `${item.bazaarId}_${item.brandId}`;
        if (!ordersByBrand[key]) {
          ordersByBrand[key] = {
            bazaarId: item.bazaarId,
            brandId: item.brandId,
            items: [],
          };
        }
        ordersByBrand[key].items.push({
          productId: item.productId._id || item.productId,
          quantity: item.quantity,
        });
      });

      // Submit an order for each brand
      const orderPromises = Object.values(ordersByBrand).map((orderGroup) => {
        return fetch(
          `https://bazary-backend.vercel.app/api/events/live/${orderGroup.bazaarId}/brands/${orderGroup.brandId}/orders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              items: orderGroup.items,
              paymentMethod: formData.paymentMethod,
              fullName: formData.fullName,
              phone: formData.phone,
              address: formData.address,
              governate: formData.governate,
              city: formData.city,
            }),
          }
        ).then((res) => res.json());
      });

      const results = await Promise.all(orderPromises);
      
      const hasErrors = results.some(res => res.status === "fail" || res.status === "error");
      
      if (hasErrors) {
        throw new Error("Failed to create some orders. Please try again.");
      }

      // Clear the cart after successful order
      await clearCart();
      router.push("/payment/success");
      
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "Something went wrong during checkout.");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button 
          onClick={() => router.push("/explore")} 
          className="bg-primary text-white px-6 py-2 rounded-xl"
        >
          Go to Explore
        </button>
      </div>
    );
  }

  return (
    <div className="container w-[95%] lg:w-[85%] mx-auto py-12 px-4 mt-16 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Shipping Details</h2>
          
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-primary"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-primary"
                  placeholder="01012345678"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                required
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-primary"
                placeholder="123 Street Name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Governorate</label>
                <input
                  required
                  type="text"
                  name="governate"
                  value={formData.governate}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-primary"
                  placeholder="Cairo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  required
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-primary"
                  placeholder="Nasr City"
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Method</h3>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="cash"
                  name="paymentMethod"
                  value="CASH"
                  checked={formData.paymentMethod === "CASH"}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                />
                <label htmlFor="cash" className="text-gray-700 font-medium">Cash on Delivery (CASH)</label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30 active:scale-[.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : `Place Order (${cart.totalAmount} EGP)`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
              {cart.items.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2 py-2 border-b border-gray-50 last:border-0 text-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4 text-gray-800 font-medium">
                      {item.productId?.name || "Product"}
                    </div>
                    <span className="font-semibold text-gray-900">{item.price * item.quantity} EGP</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <button
                        type="button"
                        disabled={updatingId === (item.productId?._id || item.productId)}
                        onClick={() => handleUpdateQuantity(item.productId?._id || item.productId, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-xs font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={updatingId === (item.productId?._id || item.productId)}
                        onClick={() => handleUpdateQuantity(item.productId?._id || item.productId, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-gray-400">{item.price} EGP / item</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{cart.totalAmount} EGP</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-500">Free</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary">{cart.totalAmount} EGP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
