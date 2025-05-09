// FeaturesSection.tsx
import { useTranslation } from "react-i18next";
import { Zap, Star, Users } from "lucide-react";

const FeaturesSection = () => {
  const { t } = useTranslation("homepage/featuresection");

  const features = [
    {
      icon: <Zap className="w-12 h-12" />,
      title: t("feature1Title"),
      description: t("feature1Description"),
    },
    {
      icon: <Star className="w-12 h-12" />,
      title: t("feature2Title"),
      description: t("feature2Description"),
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: t("feature3Title"),
      description: t("feature3Description"),
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
          {t("featuresTitle")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group hover:transform hover:scale-105 transition-all duration-200"
            >
              <div className="mb-6 text-blue-600 dark:text-blue-400 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
