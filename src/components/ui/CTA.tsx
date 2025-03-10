import React from "react";

interface CTAProps {
  text: string;
  link: string;
  color?: string;
}

const CTA: React.FC<CTAProps> = ({ text, link, color = "blue" }) => {
  return (
    <a
      href={link}
      className={`px-4 py-2 text-white bg-${color}-600 hover:bg-${color}-700 rounded-md`}
    >
      {text}
    </a>
  );
};

export default CTA;
