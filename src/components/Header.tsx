"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Define the type for a menu item
interface MenuItem {
  title: string;
  relative?: string;
  absolute?: string;
}
const siteUrl = process.env.NEXT_PUBLIC_API_BASE_URL

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

        const data: MenuItem[] = JSON.parse(text); // Ensure TypeScript recognizes the structure
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
    <header className="bg-blue-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
      <Image 
        src={`${siteUrl}/sites/default/files/Logo-Animatie.gif`} 
        alt="Vijfhart Logo Animation" 
        width={250} 
        height={100} 
        className="mt-4"
      />


        <nav>
          {error ? (
            <p className="text-red-500">Error loading menu</p>
          ) : (
            <ul className="flex space-x-4">
              {menuItems.length > 0 ? (
                menuItems.map((item, index) => (
                  <li key={index}>
                    <Link href={item.url} className="hover:underline">
                      {item.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li>Loading menu...</li>
              )}
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
}
