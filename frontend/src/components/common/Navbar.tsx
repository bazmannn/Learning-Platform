import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import SideMenu from "./SideMenu";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const { t, i18n } = useTranslation("common");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate(); // Use useNavigate to navigate

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isRTL = i18n.language === "ar";

  const handleLogout = () => {
    logout(); // Perform the logout action
    navigate("/"); // Navigate to the home page
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-blue-500 dark:bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Hamburger Menu */}
        <div className="flex items-center">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>

          <div className={isRTL ? "mr-4" : "ml-4"}>
            <div className="text-white text-xl font-bold">My App</div>
          </div>
        </div>

        {/* Navigation Links (Desktop) */}
        <div className="flex items-center">
          <ul
            className={`hidden lg:flex ${
              isRTL ? "space-x-reverse" : ""
            } space-x-4 items-center`}
          >
            <li>
              <Link
                to="/"
                className="text-white hover:text-gray-200 dark:hover:text-gray-400"
              >
                {t("home")}
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-white hover:text-gray-200 dark:hover:text-gray-400"
              >
                {t("about")}
              </Link>
            </li>
          </ul>

          {/* Profile Icon and Dropdown */}
          {isAuthenticated && (
            <div
              ref={dropdownRef}
              className={`relative ${isRTL ? "mr-4" : "ml-4"}`}
            >
              <button
                onClick={toggleProfileDropdown}
                className="grid grid-cols-[auto_auto] items-center"
                style={{
                  direction: isRTL ? "rtl" : "ltr",
                  columnGap: "0.5rem", // Adding consistent spacing
                }}
              >
                <span className="text-white hover:text-gray-200 dark:hover:text-gray-400 order-1">
                  {t("welcome")}, {user?.firstName?.split(" ")[0]}
                </span>
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center order-2">
                  <span className="text-lg font-semibold text-gray-800 dark:text-white">
                    {user?.firstName?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div
                  className={`absolute ${
                    isRTL ? "left-0" : "right-0"
                  } mt-2 w-40 bg-white dark:bg-gray-700 rounded-lg shadow-lg`}
                >
                  <ul>
                    <li>
                      <Link
                        to="/profile"
                        className={`block px-3 py-1.5 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t("profile")}
                      </Link>
                    </li>
                    {user?.role === "TEACHER" && (
                      <li>
                        <Link
                          to="/teacher/course"
                          className={`block px-3 py-1.5 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 ${
                            isRTL ? "text-right" : "text-left"
                          }`}
                        >
                          {t("myCourses")}
                        </Link>
                      </li>
                    )}
                    {user?.role === "PARENT" && (
                      <li>
                        <Link
                          to="/profile/manage-students"
                          className={`block px-3 py-1.5 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 ${
                            isRTL ? "text-right" : "text-left"
                          }`}
                        >
                          {t("manageStudent")}
                        </Link>
                      </li>
                    )}
                    <li>
                      <button
                        onClick={handleLogout}
                        className={`w-full px-3 py-1.5 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t("logout")}
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Login Button */}
          {!isAuthenticated && (
            <div className={`hidden lg:flex ${isRTL ? "mr-4" : "ml-4"}`}>
              <Link
                to="/login"
                className="text-white hover:text-gray-200 dark:hover:text-gray-400"
              >
                {t("login")}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Side Menu (Mobile) */}
      <SideMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </nav>
  );
};

export default Navbar;
