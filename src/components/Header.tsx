"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface MenuItem {
  title: string;
  relative?: string;
  absolute?: string;
}

const siteUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Header() {
  const [menuItems, setMenuItems] = useState<{ title: string; url: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("/api/menu/main", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const text = await res.text();
        const data: MenuItem[] = JSON.parse(text);

        if (!Array.isArray(data)) throw new Error("Invalid API response");

        setMenuItems(
          data.map((item) => ({
            title: item.title || "Untitled",
            url: item.relative || item.absolute || "#",
          }))
        );
      } catch (err) {
        if (err instanceof Error) {
          console.error("❌ Error fetching menu:", err);
          setError(err.message);
        } else {
          console.error("❌ Unknown error fetching menu");
          setError("An unknown error occurred");
        }
      }
    };

    fetchMenu();
  }, []);

  return (
    <header className="bg-gradient-to-r from-white-900 to-white-700 text-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-6">
        
        {/* Logo */}
        <Link href="/">
          <Image
            src={`${siteUrl}/sites/default/files/CoachResult-logo.svg`} 
            alt="CoachResult Logo"
            width={200}
            height={60}
            className="cursor-pointer"
          />
        </Link>

        {/* Navigation */}
        <nav>
          {error ? (
            <p className="text-red-500">Error loading menu</p>
          ) : (
            <ul className="flex space-x-6 text-lg font-medium">
              {menuItems.length > 0 ? (
                menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.url}
                      className="relative hover:text-blue-300 transition duration-300 after:block after:content-[''] after:h-[2px] after:w-0 after:bg-blue-300 after:transition-all after:duration-300 hover:after:w-full"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-300">Loading menu...</li>
              )}
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
}
