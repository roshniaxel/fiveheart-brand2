"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface MenuItem {
  title: string;
  url: string;
}

interface Menu {
  title: string;
  items: MenuItem[];
}

const menuEndpoints = [
  { title: "Get Started with AI", url: "/api/menu/get-started-with-ai?_format=json" },
  { title: "Next Step in Career", url: "/api/menu/next-step-in-career?_format=json" },
  { title: "Popular Subjects", url: "/api/menu/popular-subjects?_format=json" },
  { title: "Popular Resources", url: "/api/menu/popular-resources?_format=json" },
];

export default function Footer() {
  const [menus, setMenus] = useState<Menu[]>([]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const responses = await Promise.all(menuEndpoints.map((menu) => fetch(menu.url)));

        const data = await Promise.all(
          responses.map(async (res, index) => {
            if (!res.ok) throw new Error(`❌ Failed to fetch ${res.url}: ${res.status}`);

            // Clone response before reading the body
            const resClone = res.clone();
            const text = await resClone.text();
            //console.log(`📢 API Response (${menuEndpoints[index].title}):`, text);

            if (!res.headers.get("content-type")?.includes("application/json")) {
              throw new Error(`❌ Invalid JSON response from ${res.url}`);
            }

            return res.json();
          })
        );

        const formattedMenus: Menu[] = data.map((items, index) => ({
          title: menuEndpoints[index].title,
          items: Array.isArray(items)
            ? items.map((item: MenuItem) => ({
                title: item.title || "Untitled",
                url: item.url || "#",
              }))
            : [],
        }));

        setMenus(formattedMenus);
      } catch (error) {
        console.error("❌ Error fetching menus:", error);
      }
    };

    fetchMenus();
  }, []);

  return (
    <footer className="bg-blue-800 text-white py-8">
      <div className="container mx-auto px-6">
        {/* Grid Layout for Menus */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left">
          {menus.map((menu, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-2">{menu.title}</h3>
              <ul>
                {menu.items.length > 0 ? (
                  menu.items.map((item, idx) => (
                    <li key={idx} className="mb-1">
                      <Link href={item.url} className="text-gray-300 hover:text-white transition">
                        {item.title}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No items available</li>
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Horizontal Line */}
        <hr className="border-gray-700 my-6" />

        {/* Copyright Text */}
        <p className="text-center text-gray-400">
          © {new Date().getFullYear()} Vijfhart. Member of the House of Ambition group. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
