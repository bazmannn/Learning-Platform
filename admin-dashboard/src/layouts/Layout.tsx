import { ReactNode, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
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
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white flex">
      {/* Side Menu (Always Visible on Desktop) */}
      <div className="hidden lg:block w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {/* Navbar (Mobile Only) */}
        {!hideNavbar && <Navbar />}

        {/* Page Content */}
        <main className="flex-grow p-4">{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
