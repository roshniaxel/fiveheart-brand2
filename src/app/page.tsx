"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import TextWithImage from "@/components/ui/TextWithImage";
// import PartnerSlider from "@/components/ui/PartnerSlider";
import { News } from "fiveheart-shared-library"; // ✅ Import the News component



interface ParagraphContent {
  field_heading?: { value: string }[];
  field_description?: { value: string }[];
  field_image?: { url: string; alt: string }[];
  field_cta?: { title: string; uri: string }[];
  field_variation?: { value: string }[];
}

interface Article {
  title: string;
  description: string;
  field_news_image?: string; // ✅ Added field_news_image
  image?: string; // ✅ Ensure image exists in the final object
  link: string;
}

export default function Home() {
  const [featureContent, setFeatureContent] = useState<ParagraphContent[]>([]);
  const [articles, setArticles] = useState([]); // ✅ State for News Articles
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Featured Content
  useEffect(() => {
    const fetchFeatureContent = async () => {
      try {
        console.log("🔄 Fetching Home Page API...");
        const homeRes = await fetch("/api/drupal/node/134");
        if (!homeRes.ok) throw new Error("Failed to fetch home page content");

        const homeData = await homeRes.json();
        console.log("✅ Home Page API Response:", homeData);

        if (!homeData.field_featured_content || !Array.isArray(homeData.field_featured_content)) {
          throw new Error("field_featured_content is missing or not an array");
        }

        const paragraphUuids = homeData.field_featured_content.map(
          (item: { target_uuid: string }) => item.target_uuid
        );

        const paragraphPromises = paragraphUuids.map(async (uuid: string) => {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/paragraph-api/${uuid}`);
          if (!res.ok) throw new Error(`Failed to fetch paragraph ${uuid}`);
          return res.json();
        });

        const rawParagraphs = await Promise.all(paragraphPromises);
        console.log("✅ Fetched Raw Paragraph Data:", rawParagraphs);

        const paragraphs: ParagraphContent[] = rawParagraphs.map((item) =>
          Array.isArray(item) ? item[0] : item
        );

        setFeatureContent(paragraphs);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("❌ Error fetching feature content:", err.message);
          setError(err.message);
        } else {
          console.error("❌ Unknown error occurred");
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeatureContent();
  }, []);

  // ✅ Fetch News Articles
  useEffect(() => {
    const siteUrl = window.location.host;
    fetch(`/api/news/${siteUrl}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Fetched Articles:", data);
  
        const updatedArticles = data.map((article: Article) => ({
          ...article,
          image:
            typeof article.field_news_image === "string" &&
            article.field_news_image.startsWith("/")
              ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${article.field_news_image}`
              : article.field_news_image || undefined, // ✅ No default image here
        }));
  
        setArticles(updatedArticles);
      })
      .catch((err) => console.error("Error fetching news", err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-col items-center justify-center flex-1 text-center p-8">
        <h1 className="text-4xl font-bold mt-4">Vijfhart IT Training Courses</h1>
        <p className="text-gray-600 mt-2 max-w-lg">
          Vijfhart is the largest independent IT trainer in the Netherlands with over 40 years of experience.
          We have now trained over 500,000 people to become IT professionals. Together we make the Netherlands smarter.
        </p>
        <div className="mt-6 flex gap-4">
          <Button asChild>
            <Link href="/courses">Explore Courses</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </main>

      {/* ✅ Render Feature Sections Dynamically */}
      <section className="py-12">
        {error ? (
          <p className="text-red-500 text-center">❌ Error fetching feature content: {error}</p>
        ) : loading ? (
          <p className="text-gray-600 text-center">⏳ Loading feature content...</p>
        ) : (
          featureContent.map((item, index) => {
            if (!item) return null;
            const variation = item.field_variation?.[0]?.value || "text_with_left_image";
            const imagePosition = variation === "text_with_right_image" ? "right" : "left";

            return (
              <TextWithImage
                key={index}
                title={item.field_heading?.[0]?.value || "Vijfhart 40 Years"}
                text={item.field_description?.[0]?.value || "Celebrating 40 years of IT training! 🎉"}
                imageUrl={item.field_image?.[0]?.url || "/images/text-image.gif"}
                imageAlt={item.field_image?.[0]?.alt || "Celebration of 40 years"}
                imagePosition={imagePosition}
                button={
                  item.field_cta?.[0]?.uri && item.field_cta?.[0]?.title
                    ? { text: item.field_cta[0].title, href: item.field_cta[0].uri }
                    : undefined
                }
              />
            );
          })
        )}
      </section>

      {/* ✅ News Section */}
      <section className="py-12 bg-gray-50">
        <h2 className="text-3xl font-semibold text-center mb-6">Latest News</h2>
        {articles.length > 0 ? (
          <News articles={articles} />
        ) : (
          <p className="text-center text-gray-600">⏳ Loading news...</p>
        )}
      </section>

      {/* ✅ Partner Slider Section */}
      {/* <section className="py-10 bg-gray-100">
        <h2 className="text-3xl font-semibold text-center mb-6">Our Partners</h2>
        <PartnerSlider />
      </section> */}
    </div>
  );
}
