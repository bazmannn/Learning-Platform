// src/utils/ErrorHandler.tsx

import { useTranslation } from "react-i18next";

interface ErrorResponse {
  message: string;
  errors?: Array<{
    path: string[];
    message: string;
  }>;
}

export const useErrorHandler = () => {
  const { t } = useTranslation("errors");

  const handleError = (
    error: any,
    context: "login" | "register" = "register"
  ): string => {
    // Default error message
    let errorMessage = t("default");

    // Check if the error is an Axios error and has a response
    if (error.response) {
      const { message, errors }: ErrorResponse = error.response.data;

      // Handle validation errors (only for registration)
      if (errors && errors.length > 0 && context === "register") {
        // Map the validation error to a translation
        const validationError = errors[0];
        switch (validationError.message) {
          case "String must contain at least 6 character(s)":
            errorMessage = t("passwordTooShort");
            break;
          case "String must contain at least 2 character(s)":
            errorMessage = t("nameTooShort");
            break;
          default:
            errorMessage = validationError.message;
            break;
        }
      } else {
        // Handle other errors
        switch (message) {
          case "Invalid email or password":
            errorMessage = t("unauthorized");
            break;
          case "Email already in use":
            errorMessage = t("emailInUse");
            break;
          default:
            // Ignore password validation errors during login
            if (context === "login" && errors && errors.length > 0) {
              const isPasswordError = errors.some((err) =>
                err.path.includes("password")
              );
              if (isPasswordError) {
                errorMessage = t("unauthorized"); // Show "Invalid email or password" for login
              } else {
                errorMessage = message || errorMessage;
              }
            } else {
              errorMessage = message || errorMessage;
            }
            break;
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = t("noResponse");
    } else {
      // Something happened in setting up the request
      errorMessage = error.message || errorMessage;
    }

    return errorMessage;
  };

  return { handleError };
};
