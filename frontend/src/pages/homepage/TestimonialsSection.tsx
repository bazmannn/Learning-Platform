// TestimonialsSection.tsx
import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const { t } = useTranslation("homepage/testimonialssection");

  return (
    <section className="py-24 ">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
          {t("testimonialsTitle")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {[1, 2].map((num) => (
            <div
              key={num}
              className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-6">
                "{t(`testimonial${num}Text`)}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <img
                    src={`/api/placeholder/48/48`}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {t(`testimonial${num}Author`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
