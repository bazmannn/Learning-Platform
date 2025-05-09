import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import enLogin from "./locales/en/login.json";
import enRegister from "./locales/en/register.json";
import enHomepage from "./locales/en/homepage.json";
import enFooter from "./locales/en/footer.json";
import enErrors from "./locales/en/errors.json"; // Add errors namespace for English


import arCommon from "./locales/ar/common.json";
import arHomepage from "./locales/ar/homepage.json";
import arFooter from "./locales/ar/footer.json";
import arLogin from "./locales/ar/login.json";
import arRegister from "./locales/ar/register.json";
import arErrors from "./locales/ar/errors.json"; // Add errors namespace for Arabic

// Retrieve the language from localStorage, default to 'en' if not found
const savedLanguage = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      homepage: enHomepage,
      footer: enFooter,
      login: enLogin,
      register: enRegister,
      errors: enErrors, // Add errors namespace for English

    },
    ar: {
      common: arCommon,
      homepage: arHomepage,
      footer: arFooter,
      login: arLogin,
      register: arRegister,
      errors: arErrors, // Add errors namespace for Arabic

    },
  },
  lng: savedLanguage, // Use the saved language
  fallbackLng: "en", // Fallback language
  ns: ["common", "homepage", "footer", "login", "register", "errors"], // Add 'errors' to namespaces
  defaultNS: "common", // Default namespace
});