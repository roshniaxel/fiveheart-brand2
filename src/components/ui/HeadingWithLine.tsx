interface HeadingWithLineProps {
    text: string;
    color?: string; // Text color
    lineColor?: string; // Line color
  }
  
  export default function HeadingWithLine({
    text,
    color = "text-[#1A1A1A]", // Default dark text color like Vijfhart
    lineColor = "bg-[#E30613]", // Default Vijfhart red line
  }: HeadingWithLineProps) {
    return (
      <div className="flex flex-col items-center text-center">
        <h2 className={`text-3xl sm:text-4xl font-bold ${color}`}>{text}</h2>
        <div className={`${lineColor} h-[5px] w-16 mt-2`} />
      </div>
    );
  }
  