import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import AppRoutes from "./AppRoutes";
import "./i18n";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <DarkModeProvider>
        <AuthProvider>
          {" "}
          {/* Wrap the app with AuthProvider */}
          <AppRoutes />
        </AuthProvider>
      </DarkModeProvider>
    </LanguageProvider>
  </StrictMode>
);
