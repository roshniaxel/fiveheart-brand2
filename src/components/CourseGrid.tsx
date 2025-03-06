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
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<string>("/api/course-search/AWS");

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        console.log("🔄 Fetching courses from:", selectedFilters);
        const res = await fetch(selectedFilters);
        const data = await res.json();
        console.log("✅ Filtered Courses Response:", data);

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

  if (loading) return <div className="text-center">Loading courses...</div>;

  return (
    <div className="container mx-auto p-6 flex">
      {/* Sidebar Filters */}
      <CourseFilters selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />

      {/* Courses Grid */}
      <div className="w-3/4 p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Explore Our Courses</h1>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
          {courses.length > 0 ? (
            courses.map((course) => {
              const courseId = course.nid;
              console.log("Course NID:", courseId);

              const courseImage = course.field_course_image_url
                ? `http://fiveheart.ddev.site${course.field_course_image_url}`
                : null;

              const rating = course.field_course_rating || "4.5";
              const reviews = course.field_course_reviews || "888";

              return (
                <div key={courseId} className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  
                  {/* Course Image */}
                  {courseImage && (
                    <Image
                      src={courseImage}
                      alt={course.title || "Course Image"}
                      width={400}
                      height={250}
                      className="w-full h-40 object-cover rounded-md mb-4"
                    />
                  )}

                  {/* Brand Logo & Brand Name */}
                  {course.field_brand_logo && course.field_brands_name && (
                    <div className="flex items-center mb-2">
                      <Image
                        src={`http://fiveheart.ddev.site${course.field_brand_logo}`}
                        alt={course.field_brands_name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full mr-2"
                      />
                      <span className="text-sm font-semibold">{course.field_brands_name}</span>
                    </div>
                  )}

                  {/* Course Title */}
                  <h2 className="text-xl font-semibold mb-2">
                    <Link href={`/courses/${courseId}`} className="hover:text-blue-600 transition-colors duration-200">
                      {course.title || "Untitled Course"}
                    </Link>
                  </h2>

                  {/* Expertise (Category) */}
                  {course.field_course_category && (
                    <p className="text-sm text-gray-600">
                      <strong>Expertise:</strong> {course.field_course_category}
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
                    className="inline-block px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition mt-3"
                  >
                    View Course
                  </Link>

                </div>
              );
            })
          ) : (
            <p className="text-gray-600 text-center col-span-3">No courses found. Try changing the filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}
