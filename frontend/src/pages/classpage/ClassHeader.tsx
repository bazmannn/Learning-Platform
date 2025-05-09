import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ClassHeaderProps {
  title: string;
  image: string;
  category?: string;
}

const ClassHeader = ({ title, image, category }: ClassHeaderProps) => {
  const navigate = useNavigate();

  const handleBackToClasses = () => {
    navigate("/"); // Navigate to the homepage
    setTimeout(() => {
      const classesSection = document.getElementById("classes");
      if (classesSection) {
        classesSection.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to the Classes Section
      }
    }, 100); // Small delay to ensure the page has loaded
  };

  return (
    <div className="relative h-[400px] group">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={image} // Directly use the image prop as the src attribute
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70">
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12">
          <button
            onClick={handleBackToClasses} // Use onClick instead of Link
            className="text-white/80 hover:text-white flex items-center gap-2 mb-6 w-fit transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Classes
          </button>
          {category && (
            <span className="text-blue-400 font-medium mb-3">{category}</span>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ClassHeader;
