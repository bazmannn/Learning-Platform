import api from "./api";

const refreshTokenService = async () => {
  try {
    const response = await api.get("/auth/refresh");
    return response.data;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
};

export default refreshTokenService;
