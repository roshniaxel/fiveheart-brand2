"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ✅ Define types for raw cart items
type CartItemRaw = {
    id?: string;
    nid: string;
    title?: string | { value: string };
    field_brands_name?: string;
    field_course_image_url?: string;
    field_course_price?: string | number | undefined; // ✅ Existing key
    price?: string | number; // ✅ Add this key
  };
  

// ✅ Define the final CartItem type
type CartItem = {
  id: string;
  nid: string;
  title: string;
  field_brands_name: string;
  field_course_image_url: string | null;
  price: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart: CartItemRaw[] = JSON.parse(savedCart);

        const formattedCart: CartItem[] = Array.from(new Map(
            parsedCart.map(item => {
              let price = 0;
          
              // ✅ Use either `price` or `field_course_price`
              if (item.price !== undefined) {
                price = parseFloat(String(item.price).trim());
              } else if (item.field_course_price !== undefined) {
                price = parseFloat(String(item.field_course_price).trim());
              }
          
              if (isNaN(price) || price < 0) {
                price = 0;
              }
          
              return [item.nid, {
                id: item.id || item.nid || `cart-item-${Math.random().toString(36).substring(7)}`,
                nid: item.nid,
                title: typeof item.title === "object" && item.title !== null ? item.title.value : item.title || "Untitled Course",
                field_brands_name: item.field_brands_name || "Unknown Brand",
                field_course_image_url: typeof item.field_course_image_url === "string" ? item.field_course_image_url : null,
                price, // ✅ Now `price` is properly initialized before use
              }];
            })
          ).values());
          
          
          
          

        console.log("🛒 Loaded and formatted cart:", formattedCart);
        setCart(formattedCart);
        localStorage.setItem("cart", JSON.stringify(formattedCart));
      } catch (error) {
        console.error("❌ Failed to parse cart:", error);
      }
    }
  }, []);

  const handleRemoveFromCart = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🛒 Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600 text-center">Your cart is empty.</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ul>
            {cart.map((course, index) => (
                <li key={`${course.nid}-${course.id || Math.random().toString(36).substring(7)}`} className="flex justify-between items-center border-b py-2">
                {/* ✅ Course Image */}
                {course.field_course_image_url ? (
                  <Image
                    src={course.field_course_image_url}
                    alt={course.title || "Course Image"}
                    width={80}
                    height={50}
                    className="rounded-md"
                  />
                ) : (
                  <div className="w-20 h-12 bg-gray-300 rounded-md flex items-center justify-center">
                    🚫 No Image
                  </div>
                )}

                <div>
                  <span className="font-semibold">{course.title || "No Title Available"}</span>
                  <p className="text-sm text-gray-600">{course.field_brands_name || "Unknown Brand"}</p>
                  <p className="text-sm text-gray-700 font-semibold">💰 ₹{course.price.toFixed(2)}</p>
                </div>

                {/* ✅ Remove Button */}
                <button onClick={() => handleRemoveFromCart(index)} className="text-red-500 text-sm hover:underline">
                  ❌ Remove
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => router.push("/checkout")}
            className="mt-4 w-full px-6 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md"
          >
            🛍 Proceed to Checkout
          </button>
        </div>
      )}
    </main>
  );
}
