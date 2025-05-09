// Register.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { register } from "../../services/auth";
import { useErrorHandler } from "../../utils/ErrorHandler";
import { useNavigate } from "react-router-dom"; // Add this

const Register = () => {
  const { t } = useTranslation("register");
  const navigate = useNavigate(); // Add this
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { handleError } = useErrorHandler();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await register({ email, password, fullName: name });
      console.log("Registration successful:", response);
      navigate("/dashboard"); // Add this
    } catch (err) {
      const errorMessage = handleError(err, "register");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium mb-1">{t("name")}</label>
          <input
            type="text"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            placeholder={t("name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("email")}</label>
          <input
            type="email"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            placeholder={t("email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("password")}
          </label>
          <input
            type="password"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
          disabled={loading} // Disable the button when loading
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            t("submit")
          )}
        </button>
      </form>
      <p className="mt-4 text-center">
        {t("haveAccount")}{" "}
        <a href="/login" className="text-blue-500 hover:underline">
          {t("login")}
        </a>
      </p>
    </div>
  );
};

export default Register;
