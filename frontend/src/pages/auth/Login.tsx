import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useErrorHandler } from "../../utils/ErrorHandler";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const { t } = useTranslation("login");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { handleError } = useErrorHandler();

  // Demo accounts
  const demoAccounts = [
    {
      role: "Teacher",
      email: "teacher1@gmail.com",
      password: "ezio0098",
      description: "Access teacher features"
    },
    {
      role: "Parent",
      email: "parent1@gmail.com",
      password: "123456789",
      description: "Access parent features"
    }
  ];

  const handleSuccessfulLogin = () => {
    navigate("/"); // First navigate to home
    // Then refresh after a small delay
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email, password });
      handleSuccessfulLogin();
    } catch (err) {
      const errorMessage = handleError(err, "login");
      setError(errorMessage || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    setError(null);

    try {
      await login({ email: demoEmail, password: demoPassword });
      handleSuccessfulLogin();
    } catch (err) {
      const errorMessage = handleError(err, "login");
      setError(errorMessage || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {/* Demo Accounts Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Try Demo Accounts:</h2>
        <div className="space-y-2">
          {demoAccounts.map((account, index) => (
            <div key={index} className="border rounded p-3 dark:border-gray-700">
              <p className="font-medium">{account.role}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{account.description}</p>
              <button
                onClick={() => handleDemoLogin(account.email, account.password)}
                className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm flex items-center justify-center"
                disabled={loading}
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
                  `Login as ${account.role}`
                )}
              </button>
              <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                Email: {account.email}<br />
                Password: {account.password}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Regular Login Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
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
          disabled={loading}
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
        {t("noAccount")}{" "}
        <a href="/register" className="text-blue-500 hover:underline">
          {t("register")}
        </a>
      </p>
    </div>
  );
};

export default Login;