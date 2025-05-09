import { ReactNode, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../contexts/LanguageContext";
import { useContext } from "react";

interface LayoutProps {
  children: ReactNode;
  hideNavbar?: boolean; // Optional prop to control Navbar visibility
}

const Layout = ({ children, hideNavbar = false }: LayoutProps) => {
  const { i18n } = useTranslation();
  const { setLanguage } = useContext(LanguageContext);

  // Initialize language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en";
    setLanguage(savedLanguage);
    i18n.changeLanguage(savedLanguage);
    document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr"; // Set text direction
  }, [i18n, setLanguage]);

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white flex flex-col">
      {/* Conditionally hide the Navbar */}
      {!hideNavbar && <Navbar />}

      {/* Main Content */}
      <main className="flex-grow p-4 container mx-auto pt-20">{children}</main>

      {/* Footer */}
    </div>
  );
};

export default Layout;
