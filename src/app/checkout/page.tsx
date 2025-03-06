"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define a type for cart items
type CartItem = {
  nid: number;
  title: string;
  price: number;
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    paymentMethod: "credit_card",
    paymentDetails: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart data:", error);
      }
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "Full name is required.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Valid email is required.";
    if (!form.address.trim()) newErrors.address = "Shipping address is required.";
    if (!form.paymentMethod) newErrors.paymentMethod = "Please select a payment method.";
    if (!form.paymentDetails.trim()) newErrors.paymentDetails = "Payment details are required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    setIsProcessing(true);

    const orderData = {
      title: `Order by ${form.name}`,
      user_email: form.email,
      payment_method: form.paymentMethod,
      payment_details: form.paymentDetails,
      total_amount: cart.reduce((sum, course) => sum + course.price, 0),
      purchased_courses: cart.map((course) => ({
        course_id: course.nid,
        title: course.title,
        price: course.price,
      })),
    };

    try {
      const response = await fetch("/api/log-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error(`Failed to log purchase: ${response.status}`);
      setIsPopupOpen(true);
      localStorage.removeItem("cart");
    } catch (error) {
      console.error("Error logging purchase:", error);
      alert("Failed to log order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🛍 Checkout</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600 text-center">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Billing Details */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
            <form className="space-y-4">
              {/* Name */}
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              {/* Address */}
              <div>
                <input
                  type="text"
                  name="address"
                  placeholder="Shipping Address"
                  value={form.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
              </div>

              {/* Payment Method Dropdown */}
              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md bg-white text-gray-700"
                >
                  <option value="credit_card">💳 Credit Card</option>
                  <option value="paypal">🅿️ PayPal</option>
                  <option value="bank_transfer">🏦 Bank Transfer</option>
                </select>
                {errors.paymentMethod && <p className="text-red-500 text-sm">{errors.paymentMethod}</p>}
              </div>

              {/* Payment Details */}
              <div>
                <input
                  type="text"
                  name="paymentDetails"
                  placeholder="Payment Details"
                  value={form.paymentDetails}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
                {errors.paymentDetails && <p className="text-red-500 text-sm">{errors.paymentDetails}</p>}
              </div>

              {/* Place Order Button */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition"
              >
                {isProcessing ? "Processing..." : "✅ Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your Order</h2>
            <ul className="divide-y">
              {cart.map((course, index) => (
                <li key={index} className="py-2 flex justify-between">
                  <span>{course.title}</span>
                  <span className="font-semibold">💰 {course.price}</span>
                </li>
              ))}
            </ul>
            <div className="border-t pt-4 mt-4 flex justify-between font-bold">
              <span>Total:</span>
              <span>💰 {cart.reduce((sum, course) => sum + course.price, 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmation Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
            <h2 className="text-xl font-semibold mb-4">🎉 Order Placed Successfully!</h2>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Go to Home
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
