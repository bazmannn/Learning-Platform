import i18n from "i18next";

import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common/common.json";
import arCommon from "./locales/ar/commom/common.json";

import enLogin from "./locales/en/pages/login/login.json";
import arLogin from "./locales/ar/pages/login/login.json";

import enHeroSection from "./locales/en/pages/homepage/herosection.json";
import arHeroSection from "./locales/ar/pages/homepage/herosection.json";
import enFeatureSection from "./locales/en/pages/homepage/featuresection.json";
import arFeatureSection from "./locales/ar/pages/homepage/featuresection.json";
import enTestimonialsSection from "./locales/en/pages/homepage/testimonialssection.json";
import arTestimonialsSection from "./locales/ar/pages/homepage/testimonialssection.json";
import enClassesSection from "./locales/en/pages/homepage/classessection.json";
import arClassesSection from "./locales/ar/pages/homepage/classessection.json";

import enClassPage from "./locales/en/pages/classpage/classpage.json";
import arClassPage from "./locales/ar/pages/classpage/classpage.json";

import enCourseContent from "./locales/en/coursecontent.json";
import arCourseContent from "./locales/ar/coursecontent.json";

import enErrors from "./locales/en/common/errors.json"; // Add errors namespace for English
import arErrors from "./locales/ar/commom/errors.json"; // Add errors namespace for Arabic

import enProfile from "./locales/en/pages/profile/profile.json";
import arProfile from "./locales/ar/pages/profile/profile.json";

// Retrieve the language from localStorage, default to 'en' if not found
const savedLanguage = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      "homepage/herosection": enHeroSection,
      "homepage/featuresection": enFeatureSection,
      "homepage/testimonialssection": enTestimonialsSection,
      "homepage/classessection": enClassesSection,

      classpage: enClassPage,
      coursecontent: enCourseContent,
      errors: enErrors, // Add errors namespace for English
      login: enLogin,
      profile: enProfile,
    },
    ar: {
      common: arCommon,
      "homepage/herosection": arHeroSection,
      "homepage/featuresection": arFeatureSection,
      "homepage/testimonialssection": arTestimonialsSection,
      "homepage/classessection": arClassesSection,
      classpage: arClassPage,
      coursecontent: arCourseContent,
      errors: arErrors, // Add errors namespace for Arabic
      login: arLogin,
      profile: arProfile,
    },
  },
  lng: savedLanguage, // Use the saved language
  fallbackLng: "en", // Fallback language
  ns: [
    "common",
    "homepage/herosection",
    "homepage/featuresection",
    "homepage/testimonialssection",
    "homepage/classessection",
    "classpage",
  ], // Namespaces
  defaultNS: "common", // Default namespace
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});
