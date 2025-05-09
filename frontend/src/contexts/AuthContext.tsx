import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { getUserInfo } from "../services/user";
import { login, logout, refreshToken } from "../services/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any; // Replace with your user type
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [, setAuthToken] = useState<string | null>(null); // Store token in memory
  const initializationRef = useRef(false);
  const actualApiCallRef = useRef(false);

  const updateAuthState = async () => {
    // Only make the API call if it hasn't been made yet
    if (!actualApiCallRef.current) {
      try {
        actualApiCallRef.current = true;
        const userData = await getUserInfo();
        setUser(userData);
        setIsAuthenticated(true);
        return true;
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }
    } else {
      return true;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (initializationRef.current) {
        return;
      }

      // Check if the user is authenticated by calling the API
      initializationRef.current = true;
      await updateAuthState();
    };

    initializeAuth();

    return () => {
      // Don't reset actualApiCallRef here, only on logout
      initializationRef.current = false;
    };
  }, []);

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      actualApiCallRef.current = false; // Reset on login to allow new API call
      const response = await login(data);
      setAuthToken(response.token); // Store token in memory
      await updateAuthState();
    } catch (error) {
      console.error("Login failed in handleLogin:", error); // Add logging
      setUser(null);
      setIsAuthenticated(false);
      throw error; // Ensure the error is rethrown
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setAuthToken(null); // Clear token from memory
      setUser(null);
      setIsAuthenticated(false);
      actualApiCallRef.current = false; // Reset on logout
      initializationRef.current = false;
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const refreshAuth = async () => {
    try {
      actualApiCallRef.current = false; // Reset on refresh to allow new API call
      const token = await refreshToken();
      setAuthToken(token); // Store refreshed token in memory
      await updateAuthState();
    } catch (error) {
      console.error("Token refresh failed:", error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login: handleLogin,
        logout: handleLogout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
