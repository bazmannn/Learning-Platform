// src/components/common/Navbar.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import SideMenu from "./SideMenu";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import DropdownMenu from "./DropdownMenu"; // Import the DropdownMenu component
import { logout as apiLogout } from "../../services/auth"; // Import the logout API

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { logout } = useAuth(); // Get the logout function from AuthContext
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    console.log("Logging out..."); // Debugging log
    try {
      // Call the logout API from auth.ts
      await apiLogout();
      console.log("Backend logout successful"); // Debugging log

      // Call the logout function from AuthContext to clear local state
      logout();

      // Navigate to the login page
      navigate("/login");

      // Refresh the page to ensure the cookie is cleared
      console.log("Refreshing page..."); // Debugging log
      window.location.reload();
    } catch (err) {
      console.error("Failed to logout:", err); // Debugging log
    }
  };

  return (
    <nav className="bg-blue-500 dark:bg-gray-800 p-4 h-16 flex items-center">
      <div className="container mx-auto flex justify-between items-center">
        {/* Hamburger Menu (Only on Mobile, Hidden on Desktop) */}
        <button
          onClick={toggleMenu}
          className="text-white focus:outline-none lg:hidden"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: i18n.language !== "ar" ? "scaleX(-1)" : "none", // Mirror the icon for non-Arabic languages
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>

        {/* Profile Icon with Dropdown */}
        <div
          className={`flex items-center ${
            i18n.language === "ar" ? "mr-auto" : "ml-auto"
          }`}
        >
          <DropdownMenu
            trigger={
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer">
                {/* Placeholder Icon (Replace with an actual image or icon) */}
                <svg
                  className="w-6 h-6 text-gray-700 dark:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
            }
            position={i18n.language === "ar" ? "left" : "right"} // Adjust position based on language
          >
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {t("logout")}
              </button>
            </li>
          </DropdownMenu>
        </div>
      </div>

      {/* Side Menu (Always Visible on Desktop, Togglable on Mobile) */}
      <SideMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </nav>
  );
};

export default Navbar;
