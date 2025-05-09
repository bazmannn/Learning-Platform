// src/components/common/ProtectedRoute.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, refreshAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await refreshAuth(); // Refresh the token and update auth state
      } catch (err) {
        // If token refresh fails, redirect to login
        navigate("/login");
      }
    };

    if (!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, refreshAuth, navigate]);

  // If authenticated, render the children (protected page)
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
