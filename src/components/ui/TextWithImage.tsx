import Image from "next/image";
import Link from "next/link";

export interface TextWithImageProps {
    title: string;
    text: string;
    imageUrl: string;
    imageAlt?: string;
    imagePosition?: "left" | "right";
    button?: {
      text: string;
      href: string;
    };
  }
  
  export default function TextWithImage({
    title,
    text,
    imageUrl,
    imageAlt = "",
    imagePosition = "left",
    button,
  }: TextWithImageProps) {
    return (
      <section className={`flex flex-col md:flex-row items-center gap-6 ${imagePosition === "right" ? "md:flex-row-reverse" : ""} p-6`}>
        {/* Image */}
        <div className="w-full md:w-1/2">
          <Image src={imageUrl} alt={imageAlt} width={600} height={400} className="w-full rounded-lg shadow-lg" />
        </div>
  
        {/* Text Content */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <div className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: text }} />
          {button && (
            <Link href={button.href} className="inline-block px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition">
              {button.text}
            </Link>
          )}
        </div>
      </section>
    );
  }
  