// Homepage.tsx
import { useTranslation } from "react-i18next";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import TestimonialsSection from "./TestimonialsSection";
import ClassesSection from "./ClassesSection";

const Homepage = () => {
  useTranslation("homepage");

  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <section id="classes">
        {" "}
        {/* Add id="classes" here */}
        <ClassesSection />
      </section>
      <TestimonialsSection />
    </div>
  );
};

export default Homepage;
