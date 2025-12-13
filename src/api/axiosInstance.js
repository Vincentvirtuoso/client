import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper functions for token management
const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");
const setAccessToken = (token) => localStorage.setItem("accessToken", token);
const setRefreshToken = (token) => localStorage.setItem("refreshToken", token);
const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

/* =======================
   REQUEST INTERCEPTOR
======================= */
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* =======================
   RESPONSE INTERCEPTOR
======================= */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Network error (no response)
    if (!error.response) {
      return Promise.reject({
        message: "No response from server. Please check your connection.",
        code: "NETWORK_ERROR",
      });
    }

    const { status, data } = error.response;
    const originalRequest = error.config;

    const normalizedError = {
      message: data?.message || "An error occurred",
      code: data?.code,
      status,
    };

    /* 🔒 Handle 401 - Token Expired */
    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token") &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint with refresh token
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {
            refreshToken: getRefreshToken(),
          }
        );

        const { token } = response.data.data;
        setAccessToken(token);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        clearTokens();
        if (window.location.pathname !== "/auth/login") {
          window.location.replace("/auth/login");
        }
        return Promise.reject(refreshError);
      }
    }

    // If 401 and no refresh token, redirect to login
    if (status === 401 && !getRefreshToken()) {
      clearTokens();
      if (window.location.pathname !== "/auth/login") {
        window.location.replace("/auth/login");
      }
    }

    return Promise.reject(normalizedError);
  }
);

// Export token management functions for use in auth context
export { getAccessToken, setAccessToken, setRefreshToken, clearTokens };
export default api;
