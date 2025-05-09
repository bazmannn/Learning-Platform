import { useContext } from "react";
import { LanguageContext } from "../../contexts/LanguageContext";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useContext(LanguageContext);
  const { i18n } = useTranslation();

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    localStorage.setItem("language", newLanguage); // Save to localStorage
    document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr"; // Set text direction
  };

  return (
    <div
      className={`flex ${
        i18n.language === "ar" ? "space-x-reverse" : ""
      } space-x-2`}
    >
      <button
        onClick={() => changeLanguage("en")}
        className={`px-3 py-1 rounded ${
          language === "en"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage("ar")}
        className={`px-3 py-1 rounded ${
          language === "ar"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white"
        }`}
      >
        AR
      </button>
    </div>
  );
};

export default LanguageSwitcher;
