"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Define the structure of a Partner item
interface Partner {
  field_brand_logo?: { url: string }[];
  name?: { value: string }[];
}

export default function PartnerSlider() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch("/api/partners");
        if (!res.ok) throw new Error("Failed to fetch partners");
        const data: Partner[] = await res.json();

        // Ensure the correct data format
        if (!Array.isArray(data)) {
          throw new Error("Invalid API response format");
        }

        setPartners(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (loading) return <p className="text-center">Loading partners...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!partners.length) return <p className="text-center">No partners found.</p>;

  return (
    <section className="partners-slider bg-gray-100 py-10">
      <div className="container mx-auto">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          navigation
          autoplay={{ delay: 3000 }}
          loop
        >
          {partners.map((partner, index) => (
            <SwiperSlide key={index} className="flex justify-center">
              <Image
                src={partner.field_brand_logo?.[0]?.url || "/placeholder.jpg"}
                alt={partner.name?.[0]?.value || "Partner"}
                width={200}
                height={100}
                className="object-contain"
                unoptimized // Prevents Next.js from optimizing external images
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
