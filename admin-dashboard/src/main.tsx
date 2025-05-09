import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css"; // Import global styles
import AppRoutes from "./AppRoutes"; // Import your main routes
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider for authentication state
import { DarkModeProvider } from "./contexts/DarkModeContext"; // Import DarkModeProvider for dark mode
import { LanguageProvider } from "./contexts/LanguageContext"; // Import LanguageProvider for i18n
import "./i18n"; // Import i18n configuration

// Create the root element for rendering the app
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Wrap the app with LanguageProvider for i18n support */}
    <LanguageProvider>
      {/* Wrap the app with DarkModeProvider for dark mode support */}
      <DarkModeProvider>
        {/* Wrap the app with AuthProvider for authentication state */}
        <AuthProvider>
          {/* Render the main routes of the app */}
          <AppRoutes />
        </AuthProvider>
      </DarkModeProvider>
    </LanguageProvider>
  </StrictMode>
);
