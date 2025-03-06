"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

// ✅ Define Course Type
interface Course {
  nid: string;
  title: string;
  field_course_price: string;
  field_brands_name?: string;
  field_brand_logo?: string;
  field_course_image_url?: string;
  field_course_category?: string;
  field_course_level?: string;
  field_duration?: string;
  field_star_rating?: string;
  field_course_reviews?: string;
  field_course_description?: string;
}

export default function CourseDetailPage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [cart, setCart] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        console.log(`🔄 Fetching course details from /api/course-search-detail/${params.id}`);
        const res = await fetch(`/api/course-search-detail/${params.id}`);
        if (!res.ok) throw new Error("Course not found");

        const data = await res.json();
        console.log("✅ Course API Response:", data);

        if (data?.search_results?.length > 0) {
          setCourse(data.search_results[0]);
        } else {
          throw new Error("No course data available.");
        }
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchCourse();

    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, [params.id]);

  const handleRegisterNow = () => {
    if (!course) return;

    const formattedCourse: Course = {
      nid: course.nid,
      title: course.title || "Untitled Course",
      field_course_price: course.field_course_price || "Free",
      field_brands_name: course.field_brands_name || "Unknown Brand",
      field_brand_logo: course.field_brand_logo
        ? `http://fiveheart.ddev.site${course.field_brand_logo}`
        : undefined,
      field_course_image_url: course.field_course_image_url
        ? `http://fiveheart.ddev.site${course.field_course_image_url}`
        : undefined,
    };

    console.log("🛒 Course being added to cart:", formattedCourse);
    const updatedCart = [...cart, formattedCourse];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setIsPopupOpen(true);
  };

  const handleGoToCart = () => {
    setIsPopupOpen(false);
    router.push("/cart");
  };

  const handleGoToCourses = () => {
    setIsPopupOpen(false);
    router.push("/courses");
  };

  if (error) return <div className="text-red-500 text-center">❌ Error: {error}</div>;
  if (!course) return <div className="text-center">Loading...</div>;

  return (
    <main className="container mx-auto p-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* ✅ Course Image */}
        {course.field_course_image_url && (
          <Image
            src={`http://fiveheart.ddev.site${course.field_course_image_url}`}
            alt={course.title}
            width={600}
            height={350}
            className="w-full h-64 object-cover rounded-md mb-4"
          />
        )}

        {/* ✅ Brand Logo & Name */}
        {course.field_brand_logo && (
          <div className="flex items-center mb-4">
            <Image
              src={`http://fiveheart.ddev.site${course.field_brand_logo}`}
              alt={course.field_brands_name || "Unknown Brand"}
              width={50}
              height={50}
              className="w-12 h-12 rounded-full mr-3"
            />
            <span className="text-lg font-semibold">{course.field_brands_name || "Unknown Brand"}</span>
          </div>
        )}

        {/* ✅ Course Title */}
        <h1 className="text-3xl font-bold mb-2">{course.title || "No Title Available"}</h1>

        {/* ✅ Level & Duration */}
        <p className="text-gray-700">
          <strong>Level:</strong> {course.field_course_level || "N/A"} |{" "}
          <strong>Duration:</strong> {course.field_duration || "N/A"}
        </p>

        {/* ✅ Dynamic Review Feature */}
        {course.field_star_rating && course.field_course_reviews && (
          <p className="text-sm text-gray-600 flex items-center mt-2">
            ⭐ {course.field_star_rating} ({course.field_course_reviews} reviews)
          </p>
        )}

        {/* ✅ Price */}
        <p className="text-lg font-semibold mt-4">💰 Price: {course.field_course_price || "Free"}</p>

        {/* ✅ Course Description */}
        {course.field_course_description && (
          <div
            className="text-gray-700 mt-4"
            dangerouslySetInnerHTML={{ __html: course.field_course_description }}
          ></div>
        )}

        {/* ✅ Register Now Button */}
        <button
          onClick={handleRegisterNow}
          className="mt-4 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
        >
          📌 Register Now
        </button>
      </div>

      {/* ✅ Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
            <h2 className="text-xl font-semibold mb-4">🎉 Course Added to Cart!</h2>
            <p className="text-gray-700 mb-4">{course.title} has been added to your cart.</p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleGoToCourses}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Continue Shopping
              </button>
              <button
                onClick={handleGoToCart}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Go to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
