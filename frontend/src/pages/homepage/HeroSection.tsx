import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  const { t } = useTranslation("homepage/herosection");

  return (
    <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 dark:from-gray-800 dark:to-gray-900 text-white py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] opacity-10 bg-cover bg-center" />{" "}
      {/* Photo by Daniele Levis Pelusi on Unsplash */}
      <div className="container mx-auto px-4 text-center relative">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
          {t("heroTitle")}
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 text-blue-100 dark:text-gray-300">
          {t("heroDescription")}
        </p>
        <button className="bg-white text-blue-600 dark:bg-gray-900 dark:text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-opacity-90 transition-all duration-200 flex items-center mx-auto gap-2">
          Get Started <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
