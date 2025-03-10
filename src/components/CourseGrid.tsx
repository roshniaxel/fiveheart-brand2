"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CourseFilters from "@/components/CourseFilters";
import Image from "next/image";

interface Course {
  nid: number;
  title?: string;
  field_course_image_url?: string;
  field_course_rating?: string;
  field_course_reviews?: string;
  field_brand_logo?: string;
  field_brands_name?: string;
  field_course_category?: string;
  field_course_level?: string;
  field_course_duration?: string;
}

export default function CourseGrid() {
  const [selectedFilters, setSelectedFilters] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSelectedFilters(`/api/course-search/${window.location.host}`);
    }
  }, []);

  useEffect(() => {
    if (!selectedFilters) return;

    const fetchCourses = async () => {
      setLoading(true);
      try {
        console.log("🔄 Fetching courses from:", selectedFilters);
        const res = await fetch(selectedFilters);
        const data = await res.json();

        if (data?.search_results && Array.isArray(data.search_results)) {
          setCourses(data.search_results);
        } else {
          console.error("❌ Unexpected API response format", data);
          setCourses([]);
        }
      } catch (err) {
        console.error("❌ Error fetching courses:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedFilters]);

  if (loading) return <div className="text-center text-lg font-semibold text-gray-600">Loading courses...</div>;

  return (
    <div className="container mx-auto p-8 flex gap-6">
      {/* Sidebar Filters */}
      <CourseFilters selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />

      {/* Courses Grid */}
      <div className="w-3/4 p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">Explore Our Courses</h1>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
          {courses.length > 0 ? (
            courses.map((course) => {
              const courseId = course.nid;
              const courseImage = course.field_course_image_url
                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${course.field_course_image_url}`
                : null;

              const rating = course.field_course_rating || "4.5";
              const reviews = course.field_course_reviews || "888";

              return (
                <div key={courseId} className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transition duration-300 border border-gray-200">
                  {/* Course Image */}
                  {courseImage && (
                    <Image
                      src={courseImage}
                      alt={course.title || "Course Image"}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}

                  {/* Brand Logo & Brand Name */}
                  {course.field_brand_logo && course.field_brands_name && (
                    <div className="flex items-center mb-2">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${course.field_brand_logo}`}
                        alt={course.field_brands_name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full mr-2 border border-gray-300"
                      />
                      <span className="text-sm font-semibold text-gray-700">{course.field_brands_name}</span>
                    </div>
                  )}

                  {/* Course Title */}
                  <h2 className="text-lg font-semibold mb-2 text-gray-900">
                    <Link href={`/courses/${courseId}`} className="hover:text-blue-600 transition-colors duration-200">
                      {course.title || "Untitled Course"}
                    </Link>
                  </h2>

                  {/* Expertise (Category) */}
                  {course.field_course_category && (
                    <p className="text-sm text-gray-600">
                      <strong>Category:</strong> {course.field_course_category}
                    </p>
                  )}

                  {/* Level & Duration */}
                  <p className="text-sm text-gray-600">
                    <strong>Level:</strong> {course.field_course_level || "N/A"} | 
                    <strong> Duration:</strong> {course.field_course_duration || "N/A"}
                  </p>

                  {/* ⭐ Dynamic Review Feature */}
                  <p className="text-sm text-gray-600 flex items-center mt-2">
                    ⭐ {rating} ({reviews} reviews)
                  </p>

                  {/* View Course Button */}
                  <Link
                    href={`/courses/${courseId}`}
                    className="inline-block px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-300 mt-4 shadow-md"
                  >
                    View Course
                  </Link>
                </div>
              );
            })
          ) : (
            <p className="text-gray-600 text-center col-span-3">No courses found. Try adjusting your filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}
